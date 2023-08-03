import { signIn } from "next-auth/react";

import { AsyncStorage } from "../module/Core/Async";
import { SlotPlugin } from "../module/Core/Slot";
import { StoragePlugin } from "../module/Core/Storage";
import { ThemePlugin } from "../module/Core/Theme";
import { DevInspectorPlugin } from "../module/DevInspector";
import { DevTool } from "../module/Devtool/devtool";
import { JSONViewPlugin } from "../module/JSONView";
import RootStore, { EventMap } from "../store/root";

type MyEventMap = {
  "next.signIn.github": () => void;
} & EventMap;

export const rootStore = RootStore.init<MyEventMap>();

rootStore.addStores([
  new DevTool({ disabled: process.env.NODE_ENV != "development" }),
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

export const useStore = () => RootStore.init();
