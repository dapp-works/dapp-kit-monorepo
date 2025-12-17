import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";
import { ethers } from "ethers";
import { ObjectPool } from "../../store/standard/ObjectPool";
import { RootStore } from "../../store";
import { WalletStore } from ".";
import { ToastPlugin } from "../Toast/Toast";

let _transport: Transport | null = null;
let _signer: LedgerSigner | null = null;

export async function createTransport(): Promise<Transport> {
  if (_transport) {
    return _transport;
  }
  try {
    const res = await TransportWebUSB.create();
    console.log('createTransport res', res);
    _transport = res;
    return res;
  } catch (error) {
    console.error('Error creating transport', error);
    throw error;
  }
}

export async function getAddress(transport: Transport, path: string): Promise<string> {
  const eth = new Eth(transport);
  const address = await eth.getAddress(path);
  return address.address;
}

export function waiter(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export const GlobalLedgerProvider = ObjectPool.get('provider', async () => {
  return new ethers.providers.JsonRpcProvider("https://babel-api.mainnet.iotex.io");
});

export const GlobalLedgerSigner = async () => {
  try {
    if (_signer) {
      return _signer;
    }
    const transport = await createTransport();
    _signer = new LedgerSigner(transport, await GlobalLedgerProvider, "44'/304'/0'/0/0");
    return _signer;
  } catch (error) {
    console.error('Error creating ledger signer', error);
    RootStore.Get(ToastPlugin).error(error.message ?? 'Failed to connect to Ledger');
    RootStore.Get(WalletStore).isLedger = false;
    return null;
  }
}

export const ConnectLedger = async () => {
  RootStore.Get(WalletStore).isLedger = true;
  console.log('ConnectLedger');
  const signer = await GlobalLedgerSigner();
  console.log('signer', signer);
  const interval = setInterval(async () => {
    try {
      const address = await signer?.getAddress()
      if (address) {
        RootStore.Get(WalletStore).set({
          account: address as `0x${string}`,
          isConnect: true,
        });
        // const transport = await createTransport();
        // RootStore.Get(WalletStore).walletClient = createWalletClient({
        //   account: address as `0x${string}`,
        //   chain: iotex,
        //   //@ts-ignore
        //   transport: (transport)
        // }).extend(publicActions)
        clearInterval(interval);
        return signer;
      }
    } catch (error) {
      console.error('Error getting address', error);
    }
  }, 1000);
};

export const DisconnectLedger = () => {
  RootStore.Get(WalletStore).set({
    isConnect: false,
    isLedger: false,
  });
};

export class LedgerSigner extends ethers.Signer {
  readonly path: string
  readonly _eth: Promise<Eth>;

  constructor(transport: Transport, provider?: ethers.providers.Provider, path?: string) {
    super();

    ethers.utils.defineReadOnly(this, "path", path || "44'/304'/0'/0/0");
    //@ts-ignore
    ethers.utils.defineReadOnly(this, "provider", provider || null);

    const eth = new Eth(transport);
    const _eth = eth.getAppConfiguration().then((config) => {
      return eth;
    }, (error) => {
      return Promise.reject(error);
    });
    ethers.utils.defineReadOnly(this, "_eth", _eth);
  }

  _retry<T = any>(callback: (eth: Eth) => Promise<T>, timeout?: number): Promise<T> {
    return new Promise(async (resolve, reject) => {
      if (timeout && timeout > 0) {
        setTimeout(() => { reject(new Error("timeout")); }, timeout);
      }

      const eth = await this._eth;

      // Wait up to 5 seconds
      for (let i = 0; i < 50; i++) {
        try {
          const result = await callback(eth);
          return resolve(result);
        } catch (error) {
          if (error.id !== "TransportLocked") {
            return reject(error);
          }
        }
        await waiter(100);
      }

      return reject(new Error("timeout"));
    });
  }

  async getAddress(): Promise<string> {
    const account = await this._retry((eth) => eth.getAddress(this.path));
    return ethers.utils.getAddress(account.address);
  }

  async signMessage(message: ethers.utils.Bytes | string): Promise<string> {
    if (typeof (message) === 'string') {
      message = ethers.utils.toUtf8Bytes(message);
    }

    const messageHex = ethers.utils.hexlify(message).substring(2);

    const sig = await this._retry((eth) => eth.signPersonalMessage(this.path, messageHex));
    sig.r = '0x' + sig.r;
    sig.s = '0x' + sig.s;
    return ethers.utils.joinSignature(sig);
  }

  async signTransaction(transaction: ethers.providers.TransactionRequest): Promise<string> {
    const tx = await ethers.utils.resolveProperties(transaction);
    const baseTx: ethers.utils.UnsignedTransaction = {
      chainId: (tx.chainId || undefined),
      data: (tx.data || undefined),
      gasLimit: (tx.gasLimit || undefined),
      gasPrice: (tx.gasPrice || undefined),
      nonce: (tx.nonce ? ethers.BigNumber.from(tx.nonce).toNumber() : undefined),
      to: (tx.to || undefined),
      value: (tx.value || undefined),
    };

    const unsignedTx = ethers.utils.serializeTransaction(baseTx).substring(2);
    const sig = await this._retry((eth) => eth.signTransaction(this.path, unsignedTx));

    return ethers.utils.serializeTransaction(baseTx, {
      v: ethers.BigNumber.from("0x" + sig.v).toNumber(),
      r: ("0x" + sig.r),
      s: ("0x" + sig.s),
    });
  }

  connect(provider: ethers.providers.Provider): ethers.Signer {
    //@ts-ignore
    return new LedgerSigner(provider, this.path);
  }
}