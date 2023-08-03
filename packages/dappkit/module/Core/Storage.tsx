import { t } from '@/server/trpc';
import { useStore } from '@/store';
import RootStore from '@/dappkit/store/root';
import { Store } from '@/dappkit/store/standard/base';
import { makeAutoObservable, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Card } from '@/dappkit/components/ui/card';
import { Textarea } from '@/dappkit/components/ui/textarea';
import { useRef } from 'react';
import { _ } from '@/dappkit/lib/lodash';
import { AsyncStorage } from './Async';

export type Engine = {
  get(key): any;
  set(key, value): any;
  remove(key): any;
};

export type GetParams<T> = { key: string; value?: T; engine?: Engine; _value?: T; onGet?(value: T): void };
export type ReturnValue<T> = { value: T; set: (value: T) => void; setValue: (value: T) => void } & GetParams<T>;
const memory = {};

export class StoragePlugin implements Store {
  sid = 'StoragePlugin';
  autoObservable?: boolean = true;
  static engines = {
    memory: {
      get(key) {
        return memory[key];
      },
      set(key, value) {
        return (memory[key] = value);
      },
      remove(key) {
        delete memory[key];
        return;
      },
    },
    localStorage: {
      get(key) {
        return StoragePlugin.safeParse(globalThis.localStorage.getItem(key));
      },
      set(key, value) {
        return globalThis.localStorage.setItem(key, JSON.stringify(value));
      },
      remove(key) {
        return globalThis.localStorage.removeItem(key);
      },
    },
    asyncStorage: {
      get(key) {
        return RootStore.Get(AsyncStorage).get(key);
      },
      set(key, value) {
        return RootStore.Get(AsyncStorage).set(key, value);
      },
      remove(key) {
        return RootStore.Get(AsyncStorage).remove(key);
      },
    },
  };
  engines = StoragePlugin.engines;

  // data = {};
  dataMeta: Record<string, ReturnValue<any>> = {};

  devtools = {
    panels: [
      {
        title: 'Storage',
        render: observer(() => {
          const changeValueRef = useRef(
            _.debounce((key: string, value: string) => {
              this.set({ key, value: StoragePlugin.safeParse(value) });
            }, 800),
          );
          return (
            <Card className="p-4 dark:border-gray-800 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(this.dataMeta).map((key) => {
                return (
                  <div key={key}>
                    <span className="font-bold text-xs">{key}: </span>
                    <Textarea
                      className="mt-2 h-8 text-xs"
                      defaultValue={JSON.stringify(this.dataMeta[key].value)}
                      onChange={(e) => {
                        changeValueRef.current(key, e.target.value);
                      }}
                    />
                  </div>
                );
              })}
            </Card>
          );
        }),
      },
    ],
  };

  static safeParse(val: any) {
    try {
      return JSON.parse(val);
    } catch (error) {
      return val;
    }
  }

  set = ({ key, value, engine }: { key: string; value: any; engine?: Engine }) => {
    this.dataMeta[key]._value = value;
    const _engine = engine || this.dataMeta[key]?.engine || this.engines.memory;
    return _engine.set(key, value);
  };

  get = <T,>({ key, value: defaultValue, engine = this.engines.memory, ...other }: GetParams<T>): ReturnValue<T> => {
    const that = this;
    if (!this.dataMeta[key]) {
      const exists = engine.get(key);
      if (!exists) {
        engine.set(key, defaultValue);
      }
      const _value = engine.get(key);
      this.dataMeta[key] = makeAutoObservable({
        key,
        engine,
        ...other,
        _value,
        get value() {
          console.log(that.dataMeta[key]._value,'that.dataMeta[key]._value')
          return that.dataMeta[key]._value;
        },
        set value(value) {
          that.set({ key, value });
        },
        set(value) {
          that.set({ key, value });
        },
        setValue(value) {
          that.set({ key, value });
        },
      });
      if (this.dataMeta[key].onGet) {
        this.dataMeta[key].onGet(this.dataMeta[key].value);
      }
    }

    //@ts-ignore
    return this.dataMeta[key];
  };

  remove = ({ key, engine = this.engines.memory }: { key?: string; engine?: Engine }): void => {
    engine.remove(key);
  };

  static Get<T>(args: GetParams<T>): ReturnValue<T> {
    const storagePlugin = RootStore.Get(StoragePlugin);
    return storagePlugin.get(args);
  }

  static GetState(args: Parameters<StoragePlugin['get']>[0]) {
    const storagePlugin = RootStore.Get(StoragePlugin);

    return storagePlugin.get(args);
  }

  constructor(args: Partial<StoragePlugin> = {}) {
    Object.assign(this, args);
  }
}
