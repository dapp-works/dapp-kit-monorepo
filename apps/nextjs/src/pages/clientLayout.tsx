import { AppProvider, RootStore } from "@dappworks/kit";
// import { useEffect } from "react";
// import { init } from "~/store";
// import { DeviceDetectStore } from "~/store/deviceDetect";
import { ThemeProvider } from 'next-themes';
import { WalletProvider, WalletStore } from "@dappworks/kit/wallet";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, Wallet, connectorsForWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

export const ClientLayout = ({ children }: any) => {
  return (
    <div>
      <AppProvider />
      <ThemeProvider attribute="class" enableSystem={false}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </ThemeProvider>
    </div>


  )
}