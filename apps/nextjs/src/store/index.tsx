"use client";
import { rootStore, WalletStore, Store, AsyncStorage, DevInspectorPlugin, DevTool, HeaderStore, helper, StoragePlugin, ThemePlugin, } from "@dappworks/kit";
import { signIn } from "next-auth/react";
import { Project } from "./project";
import * as mobx from "mobx"

export const init = () => {
  if (rootStore.isInited) return
  rootStore.isInited = true
  rootStore.addStores([
    new DevTool({
      disabled: process.env.NODE_ENV != "development",
    }),
    new WalletStore(),
    new StoragePlugin(),
    new AsyncStorage(),
    new DevInspectorPlugin({ disabled: process.env.NODE_ENV != "development" }),
    // new ThemePlugin(),
    new Project(),
  ]);

  // mobx.spy((change) => {
  //   if (change.type == 'report-end') return
  //   console.log(change)
  // })


  if (helper.env.isBrowser()) {
    if (process.env.NODE_ENV == "development") {
      rootStore.events.on("*", console.log);
    }

    rootStore.events.on("next.signIn.github", () => {
      signIn("github");
    });
  }
}
