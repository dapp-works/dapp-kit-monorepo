"use client";

import "~/store/index";

import { RootStore, AppProvider, HeaderStore, StoragePlugin, UserStore, ConnectWallet, WalletStore } from "@dappworks/kit";
import { Button, Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";

const HomePage = observer(() => {
  const headerStore = RootStore.Get(HeaderStore);
  const wallet = RootStore.Get(WalletStore)
  const inputValue = StoragePlugin.Input({
    key: "test.inputValue", value: "", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
      console.log('test.inputValue onset', v);
    }
  });
  wallet.use()
  return (
    <div className="px-4">
      <headerStore.Header />
      {
        wallet.balance.format
      }
      <ConnectWallet
        theme={"light"}
        modalSize={"wide"}
      />
    </div>
  );
})

export default HomePage;