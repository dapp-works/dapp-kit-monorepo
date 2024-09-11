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
import { useRouter } from 'next/router';

const queryClient = new QueryClient();
export const WalletProvider = (({
  children,
  theme,
  appName,
  supportedChains,
  compatibleMode = true,
  router
}: {
  children: React.ReactNode,
  theme?: 'dark' | 'light',
  appName?: string,
  supportedChains?: Chain[],
  compatibleMode?: boolean,
  router?: any
}) => {
  //@ts-ignore
  const walletConfig = RootStore.Get(WalletConfigStore, { args: { supportedChains: supportedChains ?? [iotex] } });

  const [config, setConfig] = useState(walletConfig.rainbowKitConfig)

  useEffect(() => {
    const disposer = reaction(
      () => walletConfig.updateTicker,
      () => {
        setConfig(walletConfig.rainbowKitConfig)
      }
    )
    return () => disposer()
  })

  useEffect(() => {
    try {
      if (typeof window != 'undefined') {
        window.addEventListener('message', (msg) => {
          if (msg.origin.includes('safe')) {
            walletConfig.isInSafeApp = true
          }
        })
      }
    } catch (error) {
    }
  }, [])

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
    <WagmiProvider config={config} reconnectOnMount={compatibleMode ? false : true}>
      <QueryClientProvider client={queryClient} >
        <RainbowKitProvider locale="en" theme={theme == 'dark' ? darkTheme() : lightTheme()}>
          {/* @ts-ignore */}
          {children}
          <WalletConnect compatibleMode={compatibleMode} router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
});

export const WalletConnect = ({ compatibleMode = true, router }) => {
  const { reconnect } = useReconnect()
  const wallet = RootStore.Get(WalletStore);
  wallet.use();

  if (router && compatibleMode) {
    useEffect(() => {
      if (!wallet.account) {
        reconnect()
      }
    }, [router])
  }

  return <></>;
};
