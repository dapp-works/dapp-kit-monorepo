import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useReconnect, WagmiProvider } from 'wagmi';
import { RootStore } from "../../store";
import { WalletStore } from '.';
import { WalletConfigStore } from './walletConfigStore'
import { reaction } from 'mobx';
import { type Chain } from "viem/chains";
import { iotex } from './type';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { observer } from 'mobx-react-lite';
const queryClient = new QueryClient();
export const WalletProvider = observer((({
  children,
  theme,
  appName,
  supportedChains,
  compatibleMode = true,
}: {
  children: React.ReactNode,
  theme?: 'dark' | 'light',
  appName?: string,
  supportedChains?: Chain[],
  compatibleMode?: boolean,
  debug?: boolean,
}) => {
  //@ts-ignore
  const walletConfig = RootStore.Get(WalletConfigStore, { args: { supportedChains: supportedChains ?? [iotex] } });
  useEffect(() => {
    if (appName) {
      walletConfig.appName = appName
    }
    if (compatibleMode != undefined) {
      walletConfig.compatibleMode = compatibleMode
    }
  }, [appName, compatibleMode])
  useEffect(() => {
    const sdk = new SafeAppsSDK()
    sdk.safe.getEnvironmentInfo().then(({ origin }) => {
      if (origin) {
        walletConfig.isInSafeApp = true
      }
    })
  }, [])
  return (
    <WagmiProvider config={walletConfig.rainbowKitConfig} reconnectOnMount={walletConfig.reconnectOnMount}>
      <QueryClientProvider client={queryClient} >
        <RainbowKitProvider locale="en" theme={theme == 'dark' ? darkTheme() : lightTheme()}>
          {children}
          <WalletConnect />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}));

export const WalletConnect = () => {
  const wallet = RootStore.Get(WalletStore);
  wallet.use();
  return <></>;
};
