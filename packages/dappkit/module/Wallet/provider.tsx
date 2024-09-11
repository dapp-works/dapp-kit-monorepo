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
    if (appName) {
      walletConfig.appName = appName
    }
    if (compatibleMode != undefined) {
      walletConfig.compatibleMode = compatibleMode
    }
  }, [appName, compatibleMode])

  useEffect(() => {
    const sdk = new SafeAppsSDK()
    // sdk.safe.getInfo().then(res => {
    //   console.log(res)
    // })
    sdk.safe.getEnvironmentInfo().then(({ origin }) => {
      if (origin) {
        walletConfig.isInSafeApp = true
      }
    })
  }, [])

  return (
    <WagmiProvider config={config} reconnectOnMount={compatibleMode ? false : true}>
      <QueryClientProvider client={queryClient} >
        <RainbowKitProvider locale="en" theme={theme == 'dark' ? darkTheme() : lightTheme()}>
          {children}
          <WalletConnect compatibleMode={compatibleMode} router={router} />
          {/* <SafeProviderWrapper /> */}
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
