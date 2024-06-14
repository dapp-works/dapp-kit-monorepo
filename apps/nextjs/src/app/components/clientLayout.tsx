"use client";

import { AppProvider, RootStore } from "@dappworks/kit";
import { useEffect } from "react";
import { init } from "~/store";
import { DeviceDetectStore } from "~/store/deviceDetect";

export const ClientLayout = ({ children }) => {
  useEffect(() => { init() }, [])
  RootStore.Get(DeviceDetectStore).use();
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
};