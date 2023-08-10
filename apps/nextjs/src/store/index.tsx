"use client";

import { rootStore, RootStore } from "@dappkit/store";
import { AsyncStorage, DevInspectorPlugin, DevTool, HeaderStore, helper, JSONViewPlugin, SlotPlugin, StoragePlugin, ThemePlugin, WalletConnectButton } from "@dappworks/kit";
import { signIn } from "next-auth/react";

rootStore.addStores([
  new DevTool({
    disabled: process.env.NODE_ENV != "development",
  }),
  new SlotPlugin(),
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
