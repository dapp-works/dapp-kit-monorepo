"use client";

import { AppProvider, RootStore } from "@dappworks/kit";
import { useEffect } from "react";
import { init } from "~/store";

export const ClientLayout = ({ children }) => {
  useEffect(() => { init() }, [])
  return <AppProvider errorBoundaryFallback={<>Error!</>}>
    {children}
  </AppProvider>
};