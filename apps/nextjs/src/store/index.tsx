import { rootStore, RootStore } from "@dappkit/store";
import {
  AsyncStorage,
  DevInspectorPlugin,
  DevTool,
  HeaderStore,
  // JSONViewPlugin,
  // SlotPlugin,
  StoragePlugin,
  ThemePlugin,
  WalletConnectButton,
} from "@dappworks/kit";
import { signIn } from "next-auth/react";

rootStore.addStores([
  new DevTool({
    disabled: process.env.NODE_ENV != "development",
  }),
  new HeaderStore({
    UserNav: (props) => {
      return <WalletConnectButton className={...props.className}></WalletConnectButton>;
    },
  }),
  new StoragePlugin(),
  new AsyncStorage(),
  // new SlotPlugin(),
  // new JSONViewPlugin(),
  new DevInspectorPlugin({ disabled: process.env.NODE_ENV != "development" }),
  new ThemePlugin(),
]);

if (process.env.NODE_ENV == "development") {
  rootStore.events.on("*", console.log);
}

rootStore.events.on("next.signIn.github", () => {
  signIn("github");
});
