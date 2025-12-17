import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { RootStore } from "../../store";
import { WalletStore } from '.';
import { WalletConfigStore } from './walletConfigStore'
import { type Chain } from "viem/chains";
import { iotex } from './type';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { observer } from 'mobx-react-lite';
import { AutoConnectIopayWallet } from './AutoConnectIopayWallet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 2500,
      refetchIntervalInBackground: false,
    },
  },
});

export const WalletProvider = observer((({
  children,
  theme,
  appName,
  supportedChains,
  compatibleMode = true,
  rainbowKitProps,
  projectId
}: {
  children: React.ReactNode,
  theme?: 'dark' | 'light',
  appName?: string,
  supportedChains?: Chain[],
  compatibleMode?: boolean,
  debug?: boolean,
  rainbowKitProps?: any,
  projectId?: string
}) => {
  // @ts-ignore
  const walletConfig = RootStore.Get(WalletConfigStore, { args: { supportedChains: supportedChains ?? [iotex] } });
  useEffect(() => {
    if (appName) {
      walletConfig.appName = appName
    }
    if (compatibleMode != undefined) {
      walletConfig.compatibleMode = compatibleMode
    }
    if (projectId) {
      walletConfig.projectId = projectId
    }
  }, [appName, compatibleMode, projectId])
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
        <RainbowKitProvider locale="en" theme={theme == 'dark' ? darkTheme() : lightTheme()} {...rainbowKitProps}>
          {children}
          <AutoConnectIopayWallet />
          {
            compatibleMode ? <WalletConnectcompatibleMode /> : <WalletConnect />
          }
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}));

//There are problems with safeWallet calls in compatibility mode
export const WalletConnectcompatibleMode = () => {
  const wallet = RootStore.Get(WalletStore);
  wallet.use();
  return <></>;
};

export const WalletConnect = () => {
  const wallet = RootStore.Get(WalletStore);
  wallet.useWalletClientWithoutCompatibleMode();
  wallet.use();
  return <></>;
};
