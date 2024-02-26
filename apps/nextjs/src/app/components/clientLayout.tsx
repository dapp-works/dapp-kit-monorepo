"use client";

import { AppProvider } from "@dappworks/kit";
import { useEffect } from "react";
import { init } from "~/store";

export const ClientLayout = ({ children }) => {
  useEffect(() => { init() }, [])
  return <AppProvider>
    {children}
  </AppProvider>
};