"use client";

import { AppProvider, Project, RootStore } from "@dappworks/kit";

export const ClientLayout = ({ children }) => {
  const project = RootStore.Get(Project)
  return <AppProvider>
    {children}
  </AppProvider>
};