"use client";

import RootStore from "../../store/root";
import { Store } from "../../store/standard/base";
import { makeAutoObservable, makeObservable, observable, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Card } from "../../components/ui/card";
import { useRef } from "react";
import { _ } from "../../lib/lodash";
import { AsyncStorage } from "./Async";
import React from "react";
import {  cn } from '@nextui-org/react';
import { Collection } from './standard/Collection';
import { JSONForm } from '../../components/JSONForm';

export type Engine = {
  name: string;
  get(key): any;
  set(key, value): any;
  remove(key): any;
};

export type DataGroup = Record<
  string,
  {
    index: StorageParams<any>;
    children: Record<string, DataGroup>;
  }
>;

export type StorageParams<T> = {
  key: string;
  value?: T;
  engine?: Engine;
  _value?: T;
  defaultValue?: T;
  onInit?(value: T): void;
  onSet?(value: T): void;
  set?: (value: T) => void;
  setValue?: (value: T) => void;
  reset?: () => void;
  listen?: (func?: (args: { key: string; value: any }) => void) => void;
};
const memory = {};

export class StoragePlugin implements Store {
  sid = 'StoragePlugin';
  autoObservable?: boolean = true;
  static engines = {
    memory: {
      name: 'memory',
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
      name: 'localStorage',
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
      name: 'asyncStorage',
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
  dataMeta: Record<string, StorageParams<any>> = {};

  get dataGroup() {
    const tree = Object.values(this.dataMeta).reduce((p, c) => {
      const current = this.dataMeta[c.key];
      const path = c.key;
      const parentPath = path
        .split('.')
        .slice(0, path.length - 1)
        .join('.');
      const key = path.split('.').pop();
      if (!p[parentPath]) {
        const topPath = !parentPath.includes('.');
        _.set(p, parentPath + (topPath ? `.${key}` : ``), {
          ...current,
          toJSON() {
            return typeof current.value === 'object' ? JSON.stringify(toJS(current.value), null, 2) : current.value;
          },
        });
      }

      return p;
    }, {});

    return tree;
  }

  StorageTools = observer(() => {
    const collection = RootStore.Get(Collection<any>, { sid: 'StoragePlugin.current', args: { data: this.dataGroup } });
    const data = collection.current as Record<string, StorageParams<any>>;

    const dataConfig = Object.entries(data).reduce((p, [key, value]) => {
      p[key] = {
        title: `${key} (${value.engine.name})`,
      };
      return p;
    }, {});

    return (
      <div className="h-full flex flex-col md:flex-row text-sm">
        <div className="w-full md:w-[300px] space-y-1 pr-2 md:border-r-[1px] border-gray-200 dark:border-gray-700 overflow-auto">
          {Object.keys(collection.data)
            .sort((a, b) => a.length - b.length)
            .map((i) => (
              <div
                key={i}
                className={cn('px-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer', { 'bg-green-600 text-white': collection.key === i })}
                onClick={() => collection.setKey(i)}
              >
                {i}
              </div>
            ))}
        </div>
        <div className="mt-4 w-full overflow-auto md:mt-0">
          <JSONForm
            formData={{ data: JSON.parse(JSON.stringify(data, null, 2)) }}
            formConfig={{
              data: dataConfig,
            }}
            onSet={(v) => {
              //TODO:  only udpate changed filed
              Object.entries(v).forEach(([key, value]) => {
                data[key].set(StoragePlugin.safeParse(value));
              });
              return v;
            }}
          />
        </div>
      </div>
    );
  });

  devtools = {
    panels: [
      {
        title: 'Storage',
        render: this.StorageTools,
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

    //@ts-ignore
    RootStore.init().events.emit(`storage.${key}.update`, { key, value });
    if (this.dataMeta[key].onSet) this.dataMeta[key].onSet(value);
    return _engine.set(key, value);
  };

  get = <T,>({ key, value: defaultValue, engine = this.engines.memory, ...other }: StorageParams<T>): StorageParams<T> => {
    if (typeof window == 'undefined' && engine.name == 'localStorage') {
      engine = this.engines.memory;
    }
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
        defaultValue,
        ...other,
        _value,
        get value() {
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
        reset() {
          that.set({ key, value: defaultValue });
        },
        toJSON() {
          return that.dataMeta[key]._value;
        },
        listen(func) {
          //@ts-ignore
          RootStore.init().events.on(`storage.${key}.update`, (args) => func(args));
        },
      });
      if (this.dataMeta[key].onInit) {
        this.dataMeta[key].onInit(this.dataMeta[key].value);
      }
    }

    //@ts-ignore
    return this.dataMeta[key];
  };

  remove = ({ key, engine = this.engines.memory }: { key?: string; engine?: Engine }): void => {
    engine.remove(key);
  };

  static Get<T>(args: StorageParams<T>): StorageParams<T> {
    const storagePlugin = RootStore.Get(StoragePlugin);
    return storagePlugin.get(args);
  }

  static Input<T, U extends StorageParams<T>>(args: U): U {
    const storagePlugin = RootStore.Get(StoragePlugin);

    const data = storagePlugin.get(args);
    //@ts-ignore
    return observable({
      ...args,
      ...data,
      get value() {
        return data.value;
      },
      set value(value) {
        data.set(value);
      },
      onChange(e) {
        data.set(e.target.value);
      },
    });
  }

  static Custom<T, U extends StorageParams<T>>(args: U): U & StorageParams<T> {
    const storagePlugin = RootStore.Get(StoragePlugin);
    const { value, _value, ...others } = args;
    const data = storagePlugin.get(args);
    //@ts-ignore
    return observable({
      ...args,
      ...data,
      get value() {
        return data.value;
      },
      set value(value) {
        data.set(value);
      },
      onChange(e) {
        data.set(e.target.value);
      },
    });
  }

  constructor(args: Partial<StoragePlugin> = {}) {
    Object.assign(this, args);
  }
}
