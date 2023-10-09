"use client";

import { rootStore, RootStore } from "../../store";
import { observer } from "mobx-react-lite";
import { RouterStore } from "./Router";
import React, { ReactNode, useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { UserStore } from "../../store/user";
import ErrorBoundary from "../../components/Common/ErrorBoundary";
import { WalletStore } from "../../store/wallet";
import {
  ThirdwebProvider, useSDK,
} from "@thirdweb-dev/react";

export const AppProvider = observer(({ children, errorBoundaryFallback }: { children: ReactNode, errorBoundaryFallback?: ReactNode }) => {
  const userStore = RootStore.Get(UserStore);
  const routerStore = RootStore.Get(RouterStore);
  const wallet = RootStore.Get(WalletStore);
  routerStore.use();
  userStore.use();
  rootStore.useKeyBindings();

  return (
    <>
      <ThirdwebProvider
        supportedChains={wallet.supportedChains}
        supportedWallets={wallet.supportedWallets}
        activeChain={wallet.activeChain}
        clientId={wallet.rpcCilentId}
        autoConnect={wallet.autoConnect}
      >
        <NextUIProvider>
          {rootStore.providers.map((store) => {
            const Component = store.provider;
            return <Component rootStore={rootStore} />;
          })}
          {errorBoundaryFallback ? <ErrorBoundary fallback={errorBoundaryFallback}> {children} </ErrorBoundary> : children}
        </NextUIProvider>
      </ThirdwebProvider>
    </>
  );
});
