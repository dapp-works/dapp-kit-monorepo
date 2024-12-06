import { Chain, Wallet, useConnectModal, getDefaultConfig, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { walletConnectWallet, metaMaskWallet, iopayWallet, okxWallet, binanceWallet, safeWallet, gateWallet } from "@rainbow-me/rainbowkit/wallets";
import { iotex } from "viem/chains";
import { ObjectPool, Store } from "../..";
import { createTransport, waiter } from "./ledger";
import { LedgerSigner } from "./ledger";
import { ethers } from "ethers";
import { CreateWalletFn } from "@rainbow-me/rainbowkit/dist/wallets/Wallet";
import { walletConnect } from "wagmi/connectors";
import { createConnector, CreateConnectorFn } from "wagmi";

function createLedgerConnector(walletDetails: WalletDetailsParams): CreateConnectorFn {
  return createConnector((config) => ({
    name: 'Ledger',
    type: 'ledgerWallet',
    async setup() {
      console.log('setup!!!!!');
    },
    //@ts-ignore
    async connect() {
      try {
        console.log('connect!!!!! wait 5s for window');
        await waiter(5000);
        const transport = await createTransport();
        console.log('transport', transport);
        const signer = new LedgerSigner(transport);
        console.log('signer', signer);
        const address = await signer.getAddress();
        console.log('address', address);
        return {
          accounts: [address],
          chainId: 4689,
        };
      } catch (error) {

        console.error('Error connecting to Ledger', error);
        throw error;
      }
    },
    async disconnect() {
      // Handle disconnect
    },
    async getAccounts() {
      const transport = await createTransport();
      const signer = new LedgerSigner(transport);
      return [await signer.getAddress()] as `0x${string}`[];
    },
    async getProvider() {
      const provider = new ethers.providers.JsonRpcProvider("https://babel-api.mainnet.iotex.io");
      return provider;
    },
    async getSigner() {
      const provider = new ethers.providers.JsonRpcProvider("https://babel-api.mainnet.iotex.io");
      const transport = await createTransport();
      const signer = new LedgerSigner(transport, provider, "44'/304'/0'/0/0")
      return signer;
    },
    async isAuthorized() {
      return true;
    },
    onAccountsChanged(accounts) {
      // if (accounts.length === 0) this.onDisconnect()
      // else
      //   config.emitter.emit('change', {
      //     accounts: accounts.map((x) => (x) as `0x${string}`),
      //   })
    },
    onChainChanged() { },
    onDisconnect() { }
  }))
}


const ledgerWallet: CreateWalletFn = ({ projectId }) => ({
  id: 'ledger',
  name: 'Ledger',
  iconUrl: 'https://example.com/ledger-icon.png',
  iconBackground: '#ffffff',
  //refer to https://github.com/wevm/wagmi/blob/1cef3dad78a1d1a128f2241012a0ce37e6588827/packages/connectors/src/walletConnect.ts#L22
  // https://github.com/rainbow-me/rainbowkit/blob/1fe488a13ec0c516b9add756b9ee2ca40ec34d4b/packages/rainbowkit/src/wallets/walletConnectors/coinbaseWallet/coinbaseWallet.ts#L102
  createConnector: (walletDetails: WalletDetailsParams) => {
    const connector: CreateConnectorFn = createLedgerConnector(walletDetails);
    return createConnector((config) => ({
      ...connector(config),
      ...walletDetails,
    }));
  }
});

export class WalletConfigStore implements Store {
  sid = "WalletConfigStore";
  autoObservable = true;

  appName = "Dappkit";
  projectId = "b69e844f38265667350efd78e3e1a5fb";
  // @ts-ignore
  supportedChains: Chain[];
  defaultChainId = 4689;
  updateTicker = 1;
  walletUpdateTick = 0;
  isConnect = false;
  isInSafeApp = false;
  // This mode to resolve and walletClient and nextui in some extreme cases cause page infinite redraw bugs
  compatibleMode = true;

  constructor(args: Partial<WalletConfigStore>) {
    Object.assign(this, args);
  }

  set(params: Partial<WalletConfigStore>) {
    Object.assign(this, params);
    this.updateTicker += 1;
  }

  get reconnectOnMount() {
    if (!this.compatibleMode) return true;

    if (!this.isConnect && this.walletUpdateTick == 0) {
      return true;
    }
    if (!this.isConnect && this.walletUpdateTick != 0) {
      return false;
    }
    if (this.isConnect) {
      return true;
    }
  }

  get rainbowKitConfig() {
    return ObjectPool.get(`rainbowKitConfig-${this.supportedChains?.map((i) => i.id).join("-")}`, () => {
      return getDefaultConfig({
        appName: this.appName,
        projectId: this.projectId,
        //@ts-ignore
        chains: this.supportedChains,
        wallets: [
          {
            groupName: "Recommended",
            wallets: [iopayWallet, metaMaskWallet], //ledgerWallet
          },
          {
            groupName: "Others",
            wallets: [metaMaskWallet, walletConnectWallet, iopayWallet, okxWallet, binanceWallet, safeWallet, gateWallet],
          },
        ],
      });
    });
  }
}

