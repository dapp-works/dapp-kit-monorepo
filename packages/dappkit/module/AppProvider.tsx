import React from "react";
import { observer } from "mobx-react-lite";
import { RootStore } from "../store/root";

export const AppProvider = observer(({ children }: { children: any }) => {
    const rootStore = RootStore.init()
    return <>
        {rootStore.providers.map((store) => {
            const Component: any = store.provider;
            return <Component rootStore={rootStore} key={store.sid} />;
        })}
        {children}
    </>
})