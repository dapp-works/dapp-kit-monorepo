import { Chain, RainbowKitProvider, Wallet, connectorsForWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { WagmiProvider } from 'wagmi';
import { RootStore } from "../../store";
import { WalletStore } from '.';
import { WalletConfigStore } from './walletConfigStore'

const queryClient = new QueryClient();
export const WalletProvider = observer(({
  children,
  theme,
  appName
}: {
  children: React.ReactNode,
  theme?: 'dark' | 'light',
  appName?: string,
}) => {
  const walletConfig = RootStore.Get(WalletConfigStore);

  useEffect(() => {
    if (appName) {
      walletConfig.appName = appName
    }
  }, [appName])
  return (
    //@ts-ignore
    <WagmiProvider config={walletConfig.rainbowKitConfig} reconnectOnMount={true}>
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
