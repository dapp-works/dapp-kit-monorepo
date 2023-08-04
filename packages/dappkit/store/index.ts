import RootStore, { EventMap } from "./root";

export type DefaultEventMap = {
  "next.signIn.github": () => void;
} & EventMap;

export const rootStore = RootStore.init<DefaultEventMap>();
export const useStore = () => RootStore.init();
export { RootStore };
