import { WalletConnectButton } from "@dappkit/index";
import { AsyncStorage } from "@dappkit/module/Core/Async";
import { SlotPlugin } from "@dappkit/module/Core/Slot";
import { StoragePlugin } from "@dappkit/module/Core/Storage";
import { ThemePlugin } from "@dappkit/module/Core/Theme";
import { DevInspectorPlugin } from "@dappkit/module/DevInspector";
import { DevTool } from "@dappkit/module/Devtool/devtool";
import { JSONViewPlugin } from "@dappkit/module/JSONView";
import { HeaderStore } from "@dappkit/module/Layout/header";
import { rootStore, RootStore } from "@dappkit/store";
import { signIn } from "next-auth/react";

rootStore.addStores([
  new DevTool({
    disabled: process.env.NODE_ENV != "development",
  }),
  new HeaderStore({
    UserNav: () => {
      return <WalletConnectButton></WalletConnectButton>;
    },
  }),
  new StoragePlugin(),
  new AsyncStorage(),
  new SlotPlugin(),
  new JSONViewPlugin(),
  new DevInspectorPlugin({ disabled: process.env.NODE_ENV != "development" }),
  new ThemePlugin(),
]);

if (process.env.NODE_ENV == "development") {
  rootStore.events.on("*", console.log);
}

rootStore.events.on("next.signIn.github", () => {
  signIn("github");
});
