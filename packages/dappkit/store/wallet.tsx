import { EventEmitter } from "events";
import { TransactionReceipt, TransactionRequest } from "@ethersproject/providers";
//allChains,
import { Chain, getChainByChainId, IotexNetwork, IotexNetworkTestnet, Polygon } from "@thirdweb-dev/chains";
import { InjectedWallet, MetaMaskWallet, WalletOptions } from "@thirdweb-dev/wallets";
import { WalletMeta } from "@thirdweb-dev/wallets/dist/declarations/src/evm/wallets/base";
import { ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import { makeAutoObservable } from "mobx";
import { SiweMessage } from "siwe";
import { RootStore, rootStore } from ".";
import { _ } from "../lib/lodash";
import { ToastPlugin } from "../module/Toast/Toast";
import { BigNumberState } from "./standard/BigNumberState";
import { helper, Store } from "..";
import { useAddress, useConnect, useSDK, useSwitchChain, useBalance, useConnectionStatus, ThirdwebSDK, useMetamask, WalletInstance, useSigner } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

import {
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { iopayWallet } from "../components/InjectedWallet/iopayWallet"
import BigNumber from "bignumber.js";

export class MyInjectedWallet extends InjectedWallet {
  constructor(options?: WalletOptions) {
    super(options);
  }
  static meta: WalletMeta = {
    name: "IoPay Wallet",
    iconURL: "https://framerusercontent.com/images/zj4bWRK880xDSHFe6mk9E55Lo.png",
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
export class WalletStore implements Store {
  sid = "wallet";
  activeChain = IotexNetwork
  rpcCilentId = ''
  autoObervable = true;
  chainId: number = 0;
  signer: ethers.Signer;
  account: string;
  autoConnect: boolean = true;
  connectWithMetamask: any;
  connect: any;
  sdk: ThirdwebSDK;
  isConnect = false;
  balance = new BigNumberState({});
  autoSign = true; //auto use swie sign
  event = new EventEmitter();
  supportedWallets: any = [metamaskWallet(), walletConnect()]
  supportedChains = [IotexNetwork, IotexNetworkTestnet]
  switchChain = null;
  constructor(args?: Partial<WalletStore>) {
    Object.assign(this, args);
    if (typeof window !== "undefined") {
      if (helper.env.isIopayMobile()) {
        this.supportedWallets.unshift(iopayWallet);
      }
    }
    makeAutoObservable(this);
  }

  use() {
    this.account = useAddress();
    this.sdk = useSDK();
    this.signer = useSigner();
    const balance = useBalance(NATIVE_TOKEN_ADDRESS)
    if (balance?.data?.value?.toString()) {
      this.balance.value = new BigNumber(balance?.data?.value?.toString() ?? '0')
    }
    const connectionStatus = useConnectionStatus();
    if (connectionStatus == 'connected') {
      this.isConnect = true
    } else {
      this.isConnect = false
      this.balance.value = new BigNumber('0')
    }

    this.switchChain = useSwitchChain();
    this.connect = useConnect()
    this.connectWithMetamask = useMetamask()
  }

  set(args: Partial<WalletStore>) {
    Object.assign(this, args);
  }


  get currentNetwork(): Chain | null {
    try {
      return getChainByChainId(this.chainId);
    } catch {
      return null;
    }
  }

  toJSON() {
    const { account } = this;
    return { account };
  }

  async prepare(chainId?: number): Promise<WalletStore> {
    const promise = new Promise<void>(async (res, rej) => {
      if (this.account) {
        if (this.chainId != chainId) {
          await this.switchChain(chainId)
          setTimeout(async () => {
            res()
          }, 1000)
          return
        }
        res();
      } else {
        try {
          const address = await this.connect(this.supportedWallets[0], { chainId: chainId ?? (this.activeChain.chainId) })
          if (address) {
            setTimeout(async () => {
              this.signer = this.sdk.getSigner()
              res()
            }, 500)
          }
        } catch (error) {
          rej(error)
        }
      }
    });

    await promise;
    return this;
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
    // const signature = await this.wallet.signMessage(message.prepareMessage());
    // return signature;
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
    const toast = RootStore.Get(ToastPlugin);
    try {
      if (!chainId || !address || !data) throw new Error("chainId, address, data is required");
      const wallet = await RootStore.Get(WalletStore).prepare(chainId);
      let sendTransactionParam: Deferrable<TransactionRequest> = _.omitBy(
        {
          to: address,
          data,
          value: value ? ethers.BigNumber.from(value) : null,
          gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : null,
        },
        _.isNil,
      );
      const res = await wallet.signer.sendTransaction(sendTransactionParam);

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
      console.log(error.message)
      const msg = /reason="[A-Za-z0-9_ :"]*/g.exec(error?.message);
      if (error?.message?.includes("user rejected transaction") || String(error).toLowerCase().includes("user rejected")) {
        autoAlert && toast.error("user rejected transaction");
        return;
      }
      if (msg) {
        autoAlert && toast.error(msg as unknown as string);
      } else {
        autoAlert && toast.error(String(error));
      }
    }
  }
}
