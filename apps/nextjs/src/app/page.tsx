"use client";

import "~/store/index";

import RootStore from "@dappworks/kit/store/root";
import { JSONViewPlugin, AppProvider, HeaderStore, StoragePlugin, UserStore } from "@dappworks/kit";
import { Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";

const HomePage = observer(() => {
  const headerStore = RootStore.Get(HeaderStore);
  const inputValue = StoragePlugin.Input({
    key: "test.inputValue", value: "", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
      console.log('test.inputValue onset', v);
    }
  });
  const inputValue2 = StoragePlugin.Get({
    key: "test.inputValue2", value: "", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
      console.log('test.inputValue2 onset', v);
    }
  });

  const navs = StoragePlugin.Get({
    key: "Navs",
    value: [
      { title: "Home", link: "/" },
      { title: "DePIN Projects", link: "/depin" },
      { title: "Discover", link: "/browse/dashboards" },
    ],
    engine: StoragePlugin.engines.asyncStorage,
  });

  return (
    <AppProvider>
      <headerStore.Header />
      <div className="flex flex-col">
        <Input placeholder="StoragePlugin.Input debounce Example" {...inputValue}></Input>
        <Input placeholder="StoragePlugin.Get debounce Example" value={inputValue2.value} onChange={e => inputValue2.value = e.target.value}></Input>
      </div>
    </AppProvider>
  );
})

export default HomePage;