import { Chain, Wallet, useConnectModal, getDefaultConfig, WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { walletConnectWallet, metaMaskWallet, iopayWallet, okxWallet, binanceWallet } from '@rainbow-me/rainbowkit/wallets';
import { iotex } from 'viem/chains';
import { ObjectPool, Store } from '../..';

export class WalletConfigStore implements Store {
  sid = 'WalletConfigStore';
  autoObservable = true

  appName = 'Dappkit';
  projectId = '043229b9b9d784a5cfe40fe5f0107811'
  // @ts-ignore
  supportedChains: (Chain)[] = [iotex];
  defaultChainId = 4689;

  get rainbowKitConfig() {
    return ObjectPool.get(`rainbowKitConfig-${this.supportedChains?.map(i => i.id).join('-')}`, () => {
      return getDefaultConfig({
        appName: this.appName,
        projectId: 'b69e844f38265667350efd78e3e1a5fb',
        //@ts-ignore
        chains: this.supportedChains,
        wallets: [{
          groupName: 'Recommended',
          wallets: [iopayWallet, metaMaskWallet],
        },
        {
          groupName: 'Others',
          wallets: [metaMaskWallet, walletConnectWallet, iopayWallet, okxWallet, binanceWallet],
        }]
      });
    });
  }
}
