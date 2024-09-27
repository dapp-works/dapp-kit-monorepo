import { AutoMan, rootStore, Store } from "@dappworks/kit";
import { signIn } from "next-auth/react";
import { helper } from "@dappworks/kit/utils";
// import { DevTool } from "@dappworks/kit/dev"
// import { StoragePlugin } from "@dappworks/kit/plugins"
import { DevInspectorPlugin } from "@dappworks/kit/inspector"
import { useEffect } from "react";
import { ToastPlugin } from "@dappworks/kit/plugins";
import { enableStaticRendering } from "mobx-react-lite";

enableStaticRendering(typeof window === 'undefined');

export const initStore = () => {
  useEffect(() => {
    if (process.env.NODE_ENV == 'development') {
      Promise.all([import('@dappworks/kit/inspector')]).then(([{ DevInspectorPlugin }]) => {
        // https://github.com/dapp-works/dapp-kit-monorepo/blob/68254310460c4efc0775c664bafa7f272ac874e3/packages/dappkit/module/DevInspector/index.tsx#L5
        rootStore.addStores([new DevInspectorPlugin()]);
      });
    }

    rootStore.addStores([
      new ToastPlugin(),
      new AutoMan()
    ]);

    if (helper.env.isBrowser()) {
      // rootStore.events.on('next.signIn.github', () => {
      //   signIn('github');
      // });

      if (process.env.NODE_ENV == 'development') {
        rootStore.events.on('*', console.log);
      }
    }
  }, []);
};
