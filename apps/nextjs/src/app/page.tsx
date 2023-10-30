"use client";

import "~/store/index";

import { RootStore, AppProvider, HeaderStore, StoragePlugin, UserStore, ConnectWallet, WalletStore, useSDK, useSigner } from "@dappworks/kit";
import { Button, Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const inputValue = StoragePlugin.Input({
  key: "test.inputValue", value: "test", defaultValue: "defaultValue", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
    console.log('test.inputValue onset', v);
  }
});

const HomePage = observer(() => {
  const headerStore = RootStore.Get(HeaderStore);
  const wallet = RootStore.Get(WalletStore)

  wallet.use()
  return (
    <div className="px-4">
      <headerStore.Header />
      <Input {...inputValue}></Input>
      <Button onClick={e => {
        wallet.sendTx({
          address: "0x0000000000000000000000000000000000000000",
          chainId: 4690,
          data: "0x",
        })
      }}>SendTx</Button>
      <ConnectWallet
        theme={"light"}
        modalSize={"wide"}
      />
    </div>
  );
})

export default HomePage;