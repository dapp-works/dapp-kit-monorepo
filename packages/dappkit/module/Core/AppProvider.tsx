import { useStore } from "../../store";
import { observer } from "mobx-react-lite";
import { RouterStore } from "./Router";
import React from "react";

export const AppProvider = observer(({ children }: any) => {
  const rootStore = useStore();

  const routerStore = rootStore.get(RouterStore);
  routerStore.use();

  return (
    <>
      {rootStore.providers.map((store) => {
        const Component = store.provider;
        return <Component rootStore={rootStore} />;
      })}
      {children}
    </>
  );
});
