import React, { useEffect } from "react";
import { Store } from "../../store/standard/base";
import { Account, PublicClient, type HttpTransport, WalletClient, TransactionReceipt } from "viem";
import { PromiseHook } from '../../store/standard/PromiseHook';
import { BigNumberState } from '../../store/standard/BigNumberState';
import BigNumber from 'bignumber.js';
import { AddressMode, WalletTransactionHistoryType } from "./type";
import EventEmitter from "events";
import { SwitchChainMutate } from "wagmi/query";
import { Config, useAccount, useConnect, useDisconnect, useReconnect, useSwitchChain, useWalletClient, } from "wagmi";
import { Chain, useConnectModal, WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { RootStore } from "../../store";
import { ToastPlugin } from "../Toast/Toast";
import { http, createPublicClient } from 'viem';
import { WalletHistoryStore, WalletRpcStore } from './walletPluginStore';
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import { ShowSuccessTxDialog } from './SuccessTxDialog'
import { WalletConfigStore } from "./walletConfigStore";
import { AIem } from "../../aiem";
import { helper } from "../../lib/helper";
import { injected } from "wagmi/connectors";
import { useRouter } from "next/router";

export class WalletStore implements Store {
  sid = 'wallet';
  autoObservable = true;
  account: `0x${string}` = null;
  isSuccessDialogOpen = false;
  isInSafeApp = false;
  isConnect = false;
  walletClient: WalletClient;
  event = new EventEmitter();
  switchChain: SwitchChainMutate<Config, unknown> | undefined;
  updateTicker = 0;
  addressMode: AddressMode = '0x';
  get isIoTeXChain(): boolean {
    if (this.chain && this.chain.id == 4689) {
      return true
    }
    return false
  }
  setAddressMode(mode: AddressMode) {
    this.addressMode = mode;
    localStorage.setItem('addressMode', mode);
  }
  get accountFormat() {
    return this.account ? helper.address.convertAddress(this.addressMode, this.account) : '-';
  }
  get connectAccountEllipsisFormat() {
    return this.account ? helper.string.truncate(helper.address.convertAddress(this.addressMode, this.account), 11, '...') : '-';
  }
  get accountEllipsisFormat() {
    return this.account ? helper.string.truncate(helper.address.convertAddress(this.addressMode, this.account), 16, '...') : '-';
  }
  get supportedChains() {
    return RootStore.Get(WalletConfigStore).supportedChains
  }
  chain: Chain | undefined;
  openConnectModal: any;
  disconnect: any;
  balance = PromiseHook.wrap({
    func: async () => {
      if (!this.publicClient || !this.account) return helper.number.warpBigNumber('0');
      const balance = await this.publicClient.getBalance({
        address: this.account,
      });
      if (balance) {
        return helper.number.warpBigNumber(balance?.toString() ?? '0');
      }
    },
  });

  constructor(args?: Partial<WalletStore>) {
    Object.assign(this, args);
  }

  use() {
    const { data: walletClient, isSuccess } = useWalletClient();
    const { chain, address, isConnected } = useAccount();
    const { reconnect } = useReconnect()
    const router = useRouter()
    const { switchChain } = useSwitchChain();
    const { openConnectModal } = useConnectModal();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const walletConfigStore = RootStore.Get(WalletConfigStore);
    this.set({
      //@ts-ignore
      connect,
      // @ts-ignore 
      walletClient,
      openConnectModal,
      switchChain,
      disconnect
    })

    useEffect(() => {
      RootStore.Get(WalletHistoryStore).set({ isRender: true })
      this.set({
        isConnect: isConnected,
        account: address,
        // @ts-ignore 
        chain,
      })
      walletConfigStore.set({
        isConnect: isConnected,
      })
      if (this.account) {
        this.updateTicker++;
        walletConfigStore.set({
          walletUpdateTick: this.updateTicker,
        })
        this.event.emit('walletAccount:ready');
      }
    }, [address, isConnected, chain])

    useEffect(() => {
      if (!address) {
        reconnect()
        // console.log({ address })
        if (walletConfigStore.compatibleMode) {
          // try {
          //   //@ts-ignore
          //   connect(walletConfigStore.rainbowKitConfig, { connector: injected() });
          // } catch (error) {
          //   console.log(error)
          // }
        }
      }
    }, [router])

    useEffect(() => {
      setTimeout(() => {
        this.balance.call()
      }, 1500)
    }, [this.updateTicker])
  }

  //always return or return default chain
  get publicClient(): PublicClient<HttpTransport, Chain, any, any> {
    if (this.chain && this.supportedChains.some(i => i.id === this.chain.id)) {
      if (this.chain.id == 4689) {
        return AIem.PubClient('4689', { rpcUrls: { default: { http: [RootStore.Get(WalletRpcStore).curRpc.value] } }, multicall: true })
      }
      return AIem.PubClient(this.chain.id.toString())
    } else {
      return AIem.PubClient('4689')
    }
  }

  set(args: Partial<WalletStore>) {
    Object.assign(this, args);
  }

  toJSON() {
    const { account } = this;
    return { account };
  }

  async prepare(chainId?: number): Promise<WalletStore> {
    return new Promise<WalletStore>(async (res, rej) => {
      try {
        if (this.account) {
          if (!chainId) {
            res(this);
          }
          if (Number(this.chain?.id) == Number(chainId)) {
            console.log('has and return ')
            res(this);
          }
          this.switchChain?.({ chainId: chainId ?? 4689 });
          const interval = setInterval(() => {
            if (this.switchChain) {
              if (this.chain?.id == chainId) {
                try {
                  // //@ts-ignore
                  // const provider = new ethers.providers.Web3Provider(window?.ethereum);
                  // this.signer = provider.getSigner();
                  res(this);
                } catch (error) {
                }
                clearInterval(interval);
              }
            }
          }, 1000);
        } else {
          this.openConnectModal();
          // this.connect?.({ chainId, connector: this.rainbowkitParams.connectors()[0] }) connect success but ui not change so
          const interval = setInterval(() => {
            if (this.account) {
              clearInterval(interval);
              res(this);
            }
          }, 1000);
        }
      } catch (error) {
        rej(error);
      }
    });
  }


  async waitForTransactionReceipt({ hash }) {
    // https://github.com/wevm/wagmi/discussions/3463#discussioncomment-8139187
    if (this.isInSafeApp) {
      // console.log('isInSafeApp', this.isInSafeApp);
      const sdk = new SafeAppsSDK();
      while (true) {
        const queued = await sdk.txs.getBySafeTxHash(hash);
        if (queued.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS || queued.txStatus === TransactionStatus.AWAITING_EXECUTION || queued.txStatus === TransactionStatus.CANCELLED) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          return this.publicClient.waitForTransactionReceipt({ hash: queued.txHash! as `0x${string}` });
        }
      }
    } else {
      return this.publicClient.waitForTransactionReceipt({ hash });
    }
  }

  static async SendTx(...args: Parameters<WalletStore['sendTx']>) {
    return RootStore.Get(WalletStore).sendTx(...args);
  }
  static async SendRawTx(...args: Parameters<WalletStore['sendRawTx']>) {
    return RootStore.Get(WalletStore).sendRawTx(...args);
  }
  async sendTx({
    chainId,
    tx,
    autoAlert = true,
    loadingText,
    successText,
    onError,
    historyItem,
    showSuccessDialog = false,
  }: {
    chainId: number | string;
    tx: any;
    autoAlert?: boolean;
    loadingText?: string;
    successText?: string;
    showSuccessDialog?: boolean;
    historyItem?: Pick<WalletTransactionHistoryType, 'msg' | 'type'>;
    onError?: (error: any) => void;
  }) {
    const toast = RootStore.Get(ToastPlugin);
    let hash;
    const historyStore = RootStore.Get(WalletHistoryStore)
    try {
      if (loadingText) toast.loading(loadingText);
      if (!chainId) throw new Error('chainId, address, data is required');
      await RootStore.Get(WalletStore).prepare(Number(chainId));
      hash = await tx();
      if (historyItem) {
        historyStore.recordHistory({ ...historyItem, tx: hash, timestamp: Date.now(), status: 'loading', chainId: Number(chainId) });
      }
      const receipt = await this.waitForTransactionReceipt({ hash });
      if (receipt.status == 'success') {
        toast.dismiss();
        toast.success('The transaction was successful');
        if (historyItem) {
          if (showSuccessDialog) {
            ShowSuccessTxDialog({ msg: historyItem.msg, hash: hash });
          }
          historyStore.updateHistoryStatusByTx(hash, 'success');
        }
      } else {
        toast.dismiss();
        toast.error('The transaction failed');
        historyStore.updateHistoryStatusByTx(hash, 'fail');
      }
      if (successText) toast.success(successText);
      this.updateTicker++;
      return receipt;
    } catch (error) {
      console.log(error);
      toast.dismiss();
      if (autoAlert) {
        const msg = /reason="[A-Za-z0-9_ :"]*/g.exec(error?.message);
        console.log('sendTx', error?.message);
        if (error?.message?.includes('user rejected transaction') || String(error).toLowerCase().includes('user rejected') || String(error).toLowerCase().includes('user denied')) {
          toast.error('user rejected transaction');
          onError?.(error);
          return;
        }
        if (error?.message?.includes('The Transaction may not be processed on a block yet') || error?.message?.includes('could not be found')) {
          if (historyItem) {
            historyStore.updateHistoryStatusByTx(hash, 'success');
          }
          toast.success('The transaction was successful');
          return;
        }

        if (msg) {
          toast.error(msg as unknown as string);
          onError?.(msg);
        } else {
          if (error?.message.includes('viem')) {
            const messageArr = error?.message.split('\n');
            console.log('messageArr---', messageArr);
            if (messageArr.length > 0) {
              toast.error(messageArr[0]);
              onError?.(messageArr[0]);
            }
          } else {
            toast.error(String(error?.message || error));
            onError?.(String(error?.message || error));
          }
        }
      } else {
        throw error;
      }
    }
  }
  async sendRawTx({
    chainId,
    address,
    data,
    value = '0',
    autoAlert = true,
    onSended,
    onSuccess,
    onError,
    historyItem,
    loadingText,
    showSuccessDialog = false,
  }: {
    loadingText?: string;
    chainId: number | string;
    address: string;
    data: string | null;
    value?: string;
    autoRefresh?: boolean;
    autoAlert?: boolean;
    historyItem?: Pick<WalletTransactionHistoryType, 'msg' | 'type'>;
    showTransactionSubmitDialog?: boolean;
    showSuccessDialog?: boolean;
    onSended?: ({ res }: { res: TransactionReceipt }) => void;
    onSuccess?: ({ res }: { res: TransactionReceipt }) => void;
    onError?: ({ res }: { res: TransactionReceipt }) => void;
  }): Promise<TransactionReceipt | undefined> {
    chainId = Number(chainId);
    const toast = RootStore.Get(ToastPlugin);
    try {
      if (!chainId || !address) throw new Error('chainId, address, is required');
      await RootStore.Get(WalletStore).prepare(chainId);
      if (loadingText) toast.loading(loadingText);
      const historyStore = RootStore.Get(WalletHistoryStore)
      // @ts-ignore
      const hash = await this.walletClient.sendTransaction({
        account: this.account,
        to: address as `0x${string}`,
        data: data as `0x${string}`,
        value: value ? BigInt(value) : undefined,
      });
      // console.log(hash)
      let receipt = await this.waitForTransactionReceipt({ hash });
      console.log(receipt);
      if (historyItem) {
        historyStore.recordHistory({ ...historyItem, tx: receipt.transactionHash, timestamp: Date.now(), status: 'loading', chainId: Number(chainId) });
      }
      onSended ? onSended({ res: receipt }) : null;
      if (receipt.status == 'success') {
        if (historyItem) {
          if (showSuccessDialog) {
            ShowSuccessTxDialog({ msg: historyItem.msg, hash: hash });
          }
          historyStore.updateHistoryStatusByTx(receipt.transactionHash, 'success');
        }
        onSuccess && onSuccess({ res: receipt });
        toast.dismiss();
        toast.success('The transaction was successful');
      } else {
        if (historyItem) {
          historyStore.updateHistoryStatusByTx(receipt.transactionHash, 'fail');
        }
        onError && onError({ res: receipt });
        toast.dismiss();
        toast.error('The transaction failed');
      }
      return receipt;
    } catch (error) {
      toast.dismiss();
      console.log(error.message);
      const msg = /reason="[A-Za-z0-9_ :"]*/g.exec(error?.message);
      // Details: Transaction was rejected
      if (error?.message?.includes('user rejected transaction') || error?.message?.includes('cancel') || String(error).toLowerCase().includes('user rejected') || String(error).toLowerCase().includes('user denied')) {
        autoAlert && toast.error('user rejected transaction');
        return;
      }
      if (error?.message?.includes('Price slippage check')) {
        autoAlert && toast.error('The latest pool price has changed, please try to increase the slippage tolerance or reload the page.');
        return;
      }
      if (error?.message.includes('viem')) {
        const messageArr = error?.message.split('\n');
        console.log('messageArr---', messageArr);
        if (messageArr.length > 0) {
          toast.error(messageArr[0]);
          onError?.(messageArr[0]);
          return;
        }
      }

      if (msg) {
        autoAlert && toast.error(msg as unknown as string);
      } else {
        autoAlert && toast.error(String(error.message));
      }
      if (!autoAlert) {
        throw error;
      }
    }
  }
}