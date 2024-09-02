"use client";

import { AppProvider, RootStore } from "@dappworks/kit";
import { useEffect } from "react";
import { init } from "~/store";
import { DeviceDetectStore } from "~/store/deviceDetect";
import { ThemeProvider } from 'next-themes';
import { WalletProvider, WalletStore } from "@dappworks/kit/wallet";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RainbowKitProvider, Wallet, connectorsForWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { WagmiProvider } from 'wagmi';


const queryClient = new QueryClient();
export const ClientLayout = ({ children }) => {
  useEffect(() => { init() }, [])
  RootStore.Get(DeviceDetectStore).use();
  const wallet = RootStore.Get(WalletStore)
  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      {/* <WalletProvider theme='light'> */}
      <AppProvider>
        <WagmiProvider config={wallet.rainbowKitConfig} reconnectOnMount={true}>
          <QueryClientProvider client={queryClient} >
            <RainbowKitProvider locale="en" >
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AppProvider>
      {/* </WalletProvider> */}
    </ThemeProvider>

  )
};