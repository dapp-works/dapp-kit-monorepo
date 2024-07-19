"use client";

import { AppProvider, RootStore } from "@dappworks/kit";
import { useEffect } from "react";
import { init } from "~/store";
import { DeviceDetectStore } from "~/store/deviceDetect";
import { ThemeProvider } from 'next-themes';

export const ClientLayout = ({ children }) => {
  useEffect(() => { init() }, [])
  RootStore.Get(DeviceDetectStore).use();
  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>

  )
};