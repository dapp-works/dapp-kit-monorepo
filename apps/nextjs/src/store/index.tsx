import { rootStore, Store } from "@dappworks/kit";
import { signIn } from "next-auth/react";
import { helper } from "@dappworks/kit/utils";
// import { DevTool } from "@dappworks/kit/dev"
// import { StoragePlugin } from "@dappworks/kit/plugins"
import { DevInspectorPlugin } from "@dappworks/kit/inspector"



export const init = () => {
  if (rootStore.isInited) return
  rootStore.isInited = true
  if (process.env.NODE_ENV == "development") {
    rootStore.addStores([
      new DevInspectorPlugin(),
    ]);
  }

  rootStore.addStores([
    new DevInspectorPlugin({ disabled: process.env.NODE_ENV != "development" }),
  ]);

  // mobx.spy((change) => {
  //   if (change.type == 'report-end') return
  //   console.log(change)
  // })


  if (helper.env.isBrowser()) {
    if (process.env.NODE_ENV == "development") {
      rootStore.events.on("*", console.log);
    }
  }
}
