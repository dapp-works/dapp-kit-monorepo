"use client";

import { rootStore, RootStore, useStore } from "../../store";
import { observer } from "mobx-react-lite";
import { RouterStore } from "./Router";
import React, { ReactNode, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { UserStore } from "../../store/user";
import ErrorBoundary from "../../components/Common/ErrorBoundary";

export const AppProvider = observer(({ children, errorBoundaryFallback }: { children: ReactNode, errorBoundaryFallback: ReactNode }) => {
  const userStore = RootStore.Get(UserStore);
  const routerStore = RootStore.Get(RouterStore);
  routerStore.use();
  userStore.use();
  rootStore.useKeyBindings();
  return (
    <>

      <NextUIProvider>
        {rootStore.providers.map((store) => {
          const Component = store.provider;
          return <Component rootStore={rootStore} />;
        })}
        {errorBoundaryFallback ? <ErrorBoundary fallback={errorBoundaryFallback}> {children} </ErrorBoundary> : children}
      </NextUIProvider>
    </>
  );
});
