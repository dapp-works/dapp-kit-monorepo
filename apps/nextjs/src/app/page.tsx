"use client";

import "~/store/index";

import { RootStore, AppProvider, HeaderStore, StoragePlugin, UserStore } from "@dappworks/kit";
import { Button, Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { MyProject } from "~/store/index";
import { ComplexFormModalStore } from "@dappworks/form";
const HomePage = observer(() => {
  const headerStore = RootStore.Get(HeaderStore);
  const complexFormModal = RootStore.Get(ComplexFormModalStore);
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
    <div className="px-4">
      <headerStore.Header />
      <div className="flex flex-col">
        <Input className="mt-2" placeholder="StoragePlugin.Input debounce Example" {...inputValue}></Input>
        <Input className="mt-2" placeholder="StoragePlugin.Get debounce Example" value={inputValue2.value} onChange={e => inputValue2.value = e.target.value}></Input>
        <MyProject.Copy className="mt-2" text="123"></MyProject.Copy>
        <Button className="mt-2" onClick={() => {
          complexFormModal.setData({
            isOpen: true,
            title: 'test',
            formData: {
              name: {
                first: 'first',
                last: 'last',
              }
            },
            layoutConfig: {
              type: 'TabLayout',
            }
          })
        }}>Open ComplexFormModal</Button>
      </div>
    </div>
  );
})

export default HomePage;