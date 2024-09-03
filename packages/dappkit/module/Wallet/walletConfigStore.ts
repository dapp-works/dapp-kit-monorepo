import { Chain, Wallet, useConnectModal, getDefaultConfig, WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { walletConnectWallet, metaMaskWallet, iopayWallet, okxWallet, binanceWallet } from '@rainbow-me/rainbowkit/wallets';
import { iotex } from 'viem/chains';
import { ObjectPool, Store } from '../..';

export class WalletConfigStore implements Store {
  sid = 'WalletConfigStore';
  autoObservable = true

  appName = 'Dappkit';
  projectId = 'b69e844f38265667350efd78e3e1a5fb'
  // @ts-ignore
  supportedChains: Chain[] = [iotex];
  defaultChainId = 4689;
  updateTicker = 1

  set(params: Partial<WalletConfigStore>) {
    Object.assign(this, params);
    this.updateTicker += 1
  }

  get rainbowKitConfig() {
    console.log(`rainbowKitConfig-${this.supportedChains?.map(i => i.id).join('-')}`)
    return ObjectPool.get(`rainbowKitConfig-${this.supportedChains?.map(i => i.id).join('-')}`, () => {
      return getDefaultConfig({
        appName: this.appName,
        projectId: this.projectId,
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
