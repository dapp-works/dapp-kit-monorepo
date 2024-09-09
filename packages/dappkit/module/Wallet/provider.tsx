import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RootStore } from "../../store";
import { WalletStore } from '.';
import { WalletConfigStore } from './walletConfigStore'
import { reaction } from 'mobx';
import { type Chain } from "viem/chains";
import { iotex } from './type';

const queryClient = new QueryClient();
export const WalletProvider = (({
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
}) => {
  //@ts-ignore
  const walletConfig = RootStore.Get(WalletConfigStore, { args: { supportedChains: supportedChains ?? [iotex] } });

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
    if (compatibleMode != undefined) {
      walletConfig.compatibleMode = compatibleMode
    }
  }, [appName, compatibleMode])
  return (
    //@ts-ignore
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
