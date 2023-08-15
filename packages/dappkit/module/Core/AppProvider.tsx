"use client";

import { rootStore, RootStore, useStore } from "../../store";
import { observer } from "mobx-react-lite";
import { RouterStore } from "./Router";
import React, { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { UserStore } from "@dappkit/store/user";
import { SessionProvider } from "next-auth/react";

export const AppProvider = observer(({ children }: any) => {
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
        {children}
      </NextUIProvider>
    </>
  );
});
