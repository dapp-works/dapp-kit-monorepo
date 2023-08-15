"use client";

import { AppProvider } from "@dappworks/kit";
import { Project } from "~/store";

export const ClientLayout = ({ children }) => {
  return <AppProvider>
    {children}
  </AppProvider>
};