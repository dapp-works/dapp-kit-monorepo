"use client";
import { rootStore, WalletStore, Store, AsyncStorage, DevInspectorPlugin, DevTool, HeaderStore, helper, StoragePlugin, ThemePlugin, WalletConnectButton, } from "@dappworks/kit";
import { signIn } from "next-auth/react";
import { Project } from "./project";

export const init = () => {
  rootStore.addStores([
    new DevTool({
      disabled: process.env.NODE_ENV != "development",
    }),
    new WalletStore(),
    new StoragePlugin(),
    new AsyncStorage(),
    new DevInspectorPlugin({ disabled: process.env.NODE_ENV != "development" }),
    new ThemePlugin(),
    new Project(),
  ]);

  if (helper.env.isBrowser()) {
    if (process.env.NODE_ENV == "development") {
      rootStore.events.on("*", console.log);
    }

    rootStore.events.on("next.signIn.github", () => {
      signIn("github");
    });
  }
}
