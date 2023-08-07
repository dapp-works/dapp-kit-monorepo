"use client";

import { AppProvider } from "@dappworks/kit/module/Core/AppProvider";
import { HeaderStore } from "@dappworks/kit/module/Layout/header";

import "~/store/index";

import RootStore from "@dappworks/kit/store/root";

export default function HomePage() {
  const headerStore = RootStore.Get(HeaderStore);
  return (
    <AppProvider>
      <headerStore.Header />
    </AppProvider>
  );
}
