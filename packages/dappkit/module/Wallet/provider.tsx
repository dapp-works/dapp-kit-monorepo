import { Chain, RainbowKitProvider, Wallet, connectorsForWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { WagmiProvider } from 'wagmi';
import { RootStore } from "../../store";
import { WalletStore } from '.';
import { WalletConfigStore } from './walletConfigStore'
import { reaction } from 'mobx';

const queryClient = new QueryClient();
export const WalletProvider = (({
  children,
  theme,
  appName
}: {
  children: React.ReactNode,
  theme?: 'dark' | 'light',
  appName?: string,
}) => {
  const walletConfig = RootStore.Get(WalletConfigStore);

  const [config, setConfig] = useState(walletConfig.rainbowKitConfig)

  reaction(
    () => walletConfig.updateTicker,
    () => {
      setConfig(walletConfig.rainbowKitConfig)
    }
  )

  useEffect(() => {
    if (appName) {
      walletConfig.appName = appName
    }
  }, [appName])
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient} >
        <RainbowKitProvider locale="en" theme={theme == 'dark' ? darkTheme() : lightTheme()}>
          {/* @ts-ignore */}
          {children}
          <WalletConnect />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
});

export const WalletConnect = () => {
  const wallet = RootStore.Get(WalletStore);
  wallet.use();
  return <></>;
};
