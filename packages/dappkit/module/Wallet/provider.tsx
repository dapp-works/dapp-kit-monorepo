import { RainbowKitProvider, Wallet, connectorsForWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { WagmiProvider } from 'wagmi';
import { RootStore } from "../../store";
import { WalletStore } from '.';

const queryClient = new QueryClient();

export const WalletProvider = observer(({ children, theme }: { children: React.ReactNode, theme: 'dark' | 'light' }) => {
  const wallet = RootStore.Get(WalletStore);
  return (
    <WagmiProvider config={wallet.rainbowKitConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient} >
        <RainbowKitProvider locale="en" theme={theme == 'dark' ? darkTheme() : lightTheme()}>
          {/* @ts-ignore  */}
          {children}
        </RainbowKitProvider>
        <WalletConnect />
      </QueryClientProvider>
    </WagmiProvider>
  );
});

export const WalletConnect = () => {
  const wallet = RootStore.Get(WalletStore);
  wallet.use();
  return <></>;
};
