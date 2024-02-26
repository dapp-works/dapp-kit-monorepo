"use client";

import { rootStore, RootStore } from "../../store";
import { observer } from "mobx-react-lite";
import { RouterStore } from "./Router";
import React, { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { UserStore } from "../../store/user";
import ErrorBoundary from "../../components/Common/ErrorBoundary";

export const AppProvider = observer(({ children, errorBoundaryFallback }: { children: ReactNode, errorBoundaryFallback?: ReactNode }) => {
  const userStore = RootStore.Get(UserStore);
  const routerStore = RootStore.Get(RouterStore);
  // const wallet = RootStore.Get(WalletStore);
  routerStore.use();
  userStore.use();
  // rootStore.useKeyBindings();

  return (
    <>
      <NextUIProvider>
        {rootStore.providers.map((store) => {
          const Component = store.provider;
          return <Component rootStore={rootStore} key={store.sid} />;
        })}
        {errorBoundaryFallback ? <ErrorBoundary fallback={errorBoundaryFallback}> {children} </ErrorBoundary> : children}
      </NextUIProvider>
    </>
  );
});
