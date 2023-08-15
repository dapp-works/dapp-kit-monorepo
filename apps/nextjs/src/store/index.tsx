"use client";
import { cn } from "@dappkit/lib/utils";
import { rootStore, Store, AsyncStorage, DevInspectorPlugin, DevTool, HeaderStore, helper, JSONViewPlugin, StoragePlugin, ThemePlugin, WalletConnectButton, Project } from "@dappworks/kit";
import { Snippet } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { signIn } from "next-auth/react";

export class MyProject extends Project {
  constructor() {
    super()
  }
}

rootStore.addStores([
  new DevTool({
    disabled: process.env.NODE_ENV != "development",
  }),
  new StoragePlugin(),
  new AsyncStorage(),
  new JSONViewPlugin(),
  new DevInspectorPlugin({ disabled: process.env.NODE_ENV != "development" }),
  new ThemePlugin(),
  new HeaderStore({
    UserNav: (props) => {
      return <WalletConnectButton className={...props.className}></WalletConnectButton>;
    },
  }),
]);

if (helper.env.isBrowser()) {
  if (process.env.NODE_ENV == "development") {
    rootStore.events.on("*", console.log);
  }

  rootStore.events.on("next.signIn.github", () => {
    signIn("github");
  });
}