import { useEffect } from 'react';
import { useRouter } from 'next/router.js';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../store';
import { Store } from "../../store/standard/base";
import React from 'react';

export class AutoMan implements Store {
  sid = 'AutoMan';
  stype = 'Plugin';
  autoObservable?: boolean | undefined;

  provider = observer(() => {
    // Soft reference to the optional wallet store. Importing WalletStore statically here
    // pulled the entire wallet dependency tree (rainbowkit/wagmi/@ledgerhq/viem) into the
    // package root entry, breaking builds for consumers that never use `@dappworks/kit/wallet`.
    // Read it from the registry by sid instead so the wallet chunk stays out of the root graph.
    // @ts-ignore
    const wallet: { updateTicker?: number } | undefined = rootStore.instance?.['wallet'];
    const walletTicker = wallet?.updateTicker;
    const router = useRouter();
    useEffect(() => {
      console.log('automan proverider')
      // @ts-ignore
      const stores = Object.values(rootStore.instance).filter((i) => i._active > 0);
      //@ts-ignore
      const promise: PromiseState<any>[] = stores.reduce((p, c) => {
        //@ts-ignore
        const promise = Object.values(c).filter((i: PromiseState<any>) => !!i?.call);
        //@ts-ignore
        return [...p, ...promise];
      }, []);
      const autoUpdate = promise.filter((i) => i.autoUpdate);
      console.log({ autoUpdate });

      autoUpdate.forEach((i) => !i.loading.value && i.call());
    }, [walletTicker, router.asPath]);
    return <></>;
  });

  static use<T extends { [Key in keyof T]: Store }, U extends { [Key in keyof T]: T[Key] extends Store ? { [K in keyof T[Key]]?: any } : never }>(stores: T, promises?: U) {
    useEffect(() => {
      Object.keys(stores).forEach((storeName) => {
        const store = stores[storeName];
        Object.keys(store).forEach((key) => {
          const i = store[key];
          //@ts-ignore
          if (!!i?.getOrCall && (i.autoInit || !!promises?.[storeName][key])) {
            if (!store._active) store._active = 0;
            store._active += 1;
            i.getOrCall();
          }
        });
      });

      return () => {
        Object.values(stores).forEach((store) => {
          //@ts-ignore
          if (!store._active) store._active = 0;
          //@ts-ignore
          store._active -= 1;
          //@ts-ignore
          if (store.autoClean !== false && !store._active > 0) {
            //@ts-ignore
            Object.entries(store)
              //@ts-ignore
              .filter(([key, i]) => !!i?.value)
              .forEach(([key, i]) => {
                console.log('clean', key);
                //@ts-ignore
                i.value = null;
              });
          }
        });

        if (!!promises) {
          //@ts-ignore
          Object.entries(promises).forEach(([storaName, promise]) => {
            const store = stores[storaName];
            //@ts-ignore
            Object.keys(promise).forEach((key) => {
              const promise = store[key];
              console.log('clean', key);
              if (!promise) return
              if (!promise._active) promise._active = 0;

              promise._active -= 1;
              //@ts-ignore
              if (!promise._active > 0) {
                promise.value = null;
              }
            });
          });
        }
      };
    }, []);
    return stores;
  }
}
