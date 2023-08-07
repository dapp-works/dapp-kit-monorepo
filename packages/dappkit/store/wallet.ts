import { EventEmitter } from "events";
import { helper } from "@dappkit/lib/helper";
import {
  TransactionReceipt,
  TransactionRequest,
} from "@ethersproject/providers";
//allChains,
import {
  allChains,
  Binance,
  Chain,
  Ethereum,
  getChainByChainId,
  Goerli,
  IotexNetwork,
  IotexNetworkTestnet,
  Mumbai,
  Polygon,
} from "@thirdweb-dev/chains";
import {
  AbstractClientWallet,
  AbstractWallet,
  InjectedWallet,
  MetaMaskWallet,
  WalletConnect,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { WalletMeta } from "@thirdweb-dev/wallets/dist/declarations/src/evm/wallets/base";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import { autorun, makeAutoObservable } from "mobx";
import { SiweMessage } from "siwe";

import { rootStore } from ".";
import { _ } from "../lib/lodash";
import { ToastPlugin } from "../module/Toast/Toast";
import { BigNumberState } from "./standard/BigNumberState";
import { PromiseState } from "./standard/PromiseState";
import { StorageState } from "./standard/StorageState";

export class MyInjectedWallet extends InjectedWallet {
  constructor(options?: WalletOptions) {
    super(options);
  }
  static meta: WalletMeta = {
    name: "IoPay Wallet",
    iconURL:
      "https://framerusercontent.com/images/zj4bWRK880xDSHFe6mk9E55Lo.png",
  };
}

export type NetworkObject = {
  name: string;
  chainId: number;
  rpcUrl: string;
  logoUrl: string;
  explorerUrl: string;
  explorerName: string;
  nativeCoin: string;
  type: "mainnet" | "testnet";
};
export class WalletStore {
  sid = "wallet";
  autoObervable = true;
  supportedWallets: AbstractClientWallet[] = [
    // new MetaMaskWallet({
    //   chains: allChains,
    // }),
    new WalletConnect({
      chains: allChains,
      //TODO: update this
      //   dappMetadata: {
      //     name: 'INS',
      //     url: '<INS_URL>',
      //     description: 'IoTeX powered dApp',
      //     logoUrl: 'favicon.png>'
      //   }
    }),
  ];
  supportedNetworks: Chain[] = [
    IotexNetwork,
    IotexNetworkTestnet,
    Ethereum,
    Binance,
    Polygon,
    Goerli,
    Mumbai,
  ];
  popularNetworks: Chain[] = [IotexNetwork, Ethereum, Binance, Polygon];
  popularTestnetNetworks = [IotexNetworkTestnet, Goerli, Mumbai];
  isConnected = false;
  isConnecting = false;
  chainId: number = 0;
  signer: ethers.Signer;
  account: string;
  balance = new BigNumberState({});
  autoSign = true; //auto use swie sign

  get wallet() {
    return this.supportedWallets[this.selectWallet.value.index];
  }

  isSelectNetworkDialogOpen = false;
  isSelectWalletDialogOpen = false;

  testData = new Date().getTime();
  reconnectCount = 0;
  lastConnectWalletIdx = new StorageState<number>({
    key: "lastConnectWalletIdx",
    default: 0,
  });

  event = new EventEmitter();

  constructor(args: Partial<WalletStore>) {
    Object.assign(this, args);
    // this.selectWallet.call(this.lastConnectWalletIdx.value);
    if (typeof window !== "undefined") {
      if (!helper.env.isIopayMobile()) {
        this.supportedWallets.unshift(
          new MetaMaskWallet({
            chains: allChains,
          }),
        );
      } else {
        this.supportedWallets.unshift(
          new MyInjectedWallet({
            chains: allChains,
          }),
        );
      }
      this.selectWallet.call(this.lastConnectWalletIdx.value);
    }
    makeAutoObservable(this);
  }

  set(args: Partial<WalletStore>) {
    Object.assign(this, args);
  }

  get mainnetNetworks(): Chain[] {
    return this.supportedNetworks.filter((network) => !network.testnet);
  }

  get testnetNetworks(): Chain[] {
    return this.supportedNetworks.filter((network) => network.testnet);
  }

  get currentNetwork(): Chain | null {
    try {
      return getChainByChainId(this.chainId);
    } catch {
      return null;
    }
  }

  selectWallet = new PromiseState({
    value: { index: 0 },
    function: async (index: number) => {
      this.wallet?.removeAllListeners();
      // this.wallet = this.supportedWallets[index];

      this.wallet.on("connect", this.onWalletConnect.bind(this));
      this.wallet.on("change", this.onWalletChange.bind(this));
      this.wallet.on("disconnect", this.onWalletDisconnect.bind(this));

      await this.wallet.connect();
      await this.wallet.autoConnect().catch(console.error);

      this.lastConnectWalletIdx.save(index);
      return { index };
    },
  });

  async onWalletConnect(args) {
    const { address, chainId } = args;
    if (!address && !chainId) {
      if (this.reconnectCount >= 100)
        throw new Error("Reconnect too more times");

      this.set({
        reconnectCount: this.reconnectCount + 1,
      });

      return this.wallet.connect();
    }
    if (this.isConnecting) return;
    this.set({
      isConnecting: true,
      chainId,
      account: address,
    });

    await this.refreshWallet();
    this.event.emit("connect");

    console.log("connect");
    //TODO: sign logic
  }

  onWalletChange({ address, chainId }) {
    if (chainId) {
      this.chainId = chainId;
    }
    if (address) {
      this.account = address;
    }
    this.refreshWallet();
    this.event.emit("change");
  }

  onWalletDisconnect() {
    this.event.emit("disconnect");

    this.set({
      isConnected: false,
      account: "",
      isSelectWalletDialogOpen: false,
    });
  }

  async refreshWallet() {
    this.signer = await this.wallet.getSigner();
    this.loadBalance();

    this.set({
      isConnected: true,
      isConnecting: false,
      reconnectCount: 0,
      isSelectNetworkDialogOpen: false,
      isSelectWalletDialogOpen: false,
    });
  }

  async loadBalance() {
    this.balance.setValue(new BigNumber(0));
    const { value } = await this.wallet.getBalance();
    this.balance.setValue(new BigNumber(value.toString()));
  }

  async prepare() {
    const promise = new Promise<void>(async (res, rej) => {
      if (this.account) {
        console.log("account", this.account);
        res();
      } else {
        this.event.once("connect", res);
        await this.wallet.connect();
      }
    });

    await promise;
    return this;
  }

  switchChain(chainId: number) {
    this.wallet.switchChain(chainId);
  }

  async signMessage() {
    const message = new SiweMessage({
      address: this.account,
      chainId: this.chainId,
      expirationTime: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
      domain: document.location.host,
      uri: document.location.origin,
      version: "1",
    });
    const signature = await this.wallet.signMessage(message.prepareMessage());
    return signature;
  }

  async sendTx({
    chainId,
    address,
    data,
    gasPrice = 0,
    value = 0,
    autoAlert = true,
    onSended,
    onSuccess,
    onError,
  }: {
    chainId: number | string;
    address: string;
    data: string;
    value?: string | number;
    gasPrice?: string | number;
    autoRefresh?: boolean;
    autoAlert?: boolean;
    showTransactionSubmitDialog?: boolean;
    onSended?: ({ res }: { res: ethers.providers.TransactionResponse }) => void;
    onSuccess?: ({ res }: { res: TransactionReceipt }) => void;
    onError?: ({ res }: { res: TransactionReceipt }) => void;
  }): Promise<TransactionReceipt> {
    chainId = Number(chainId);
    const toast = rootStore.get(ToastPlugin);
    try {
      if (!chainId || !address || !data)
        throw new Error("chainId, address, data is required");
      if (!this.account) {
        await this.wallet.connect();
      }

      if (this.chainId !== chainId) {
        await this.wallet.switchChain(chainId);
      }

      let sendTransactionParam: Deferrable<TransactionRequest> = _.omitBy(
        {
          to: address,
          data,
          value: value ? ethers.BigNumber.from(value) : null,
          gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : null,
        },
        _.isNil,
      );
      const res = await this.signer.sendTransaction(sendTransactionParam);

      onSended ? onSended({ res }) : null;
      const receipt = await res.wait();
      if (receipt.status == 1) {
        onSuccess && onSuccess({ res: receipt });
        toast.success("The transaction was successful");
      } else {
        onError && onError({ res: receipt });
        toast.error("The transaction failed");
      }
      return receipt;
    } catch (error) {
      console.log(typeof error);
      console.log(error.message);
      const msg = /reason="[A-Za-z0-9_ :"]*/g.exec(error?.message);
      if (error?.message?.includes("user rejected transaction")) {
        autoAlert && toast.error("user rejected transaction");
        return;
      }
      if (msg) {
        autoAlert && toast.error(msg as unknown as string);
      } else {
        autoAlert && toast.error(error);
      }
    }
  }
}
