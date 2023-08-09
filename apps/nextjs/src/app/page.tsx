"use client";

import "~/store/index";

import RootStore from "@dappworks/kit/store/root";
import { JSONViewPlugin,AppProvider,HeaderStore, StoragePlugin, UserStore } from "@dappworks/kit";

export default function HomePage() {
  const headerStore = RootStore.Get(HeaderStore);
  const ValueFromMemroy = StoragePlugin.Get({
    key: 'test.ValueFromMemroy',
    value: '123',
    onSet(v) {
      // console.log(v);
    },
  });
  const ValueFromLocalStoarge = StoragePlugin.Get({ key: 'test.ValueFromLocalStoarge', value: '123', engine: StoragePlugin.engines.localStorage });
  const ValueFromAsyncStorage = StoragePlugin.Get({ key: 'test.ValueFromAsyncStorage', value: '123', engine: StoragePlugin.engines.asyncStorage });
  const navs = StoragePlugin.Get({
    key: 'Navs',
    value: [
      { title: 'Home', link: '/' },
      { title: 'DePIN Projects', link: '/depin' },
      { title: 'Discover', link: '/browse/dashboards' },
    ],
    engine: StoragePlugin.engines.asyncStorage,
  });

  return (
      <AppProvider>
        <headerStore.Header />
      </AppProvider>
  );
}
