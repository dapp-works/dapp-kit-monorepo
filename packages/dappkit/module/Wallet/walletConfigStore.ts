import { Chain, Wallet, useConnectModal, getDefaultConfig, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { walletConnectWallet, metaMaskWallet, iopayWallet, okxWallet, binanceWallet, safeWallet, gateWallet } from "@rainbow-me/rainbowkit/wallets";
import { iotex } from "viem/chains";
import { ObjectPool, Store } from "../..";

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
            wallets: [iopayWallet, metaMaskWallet],
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
