"use client";

import { rootStore } from "../../store";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

export const AppProvider = observer(({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      {rootStore.providers.map((store) => {
        const Component = store.provider;
        // @ts-ignore
        return <Component rootStore={rootStore} key={store.sid} />;
      })}
      {children}
    </NextUIProvider>
  );
});
