"use client";

import { AppProvider } from "@dappworks/kit/module/Core/AppProvider";
import { HeaderStore } from "@dappworks/kit/module/Layout/header";

import "~/store/index";

import RootStore from "@dappworks/kit/store/root";

export default function HomePage() {
  const headerStore = RootStore.Get(HeaderStore);
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-pink-400">T3</span> Turbo
        </h1>
        <AppProvider>
          <headerStore.Header />
        </AppProvider>
      </div>
    </main>
  );
}
