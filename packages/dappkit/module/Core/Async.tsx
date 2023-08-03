import React, { lazy, Suspense } from "react";
import JSONEditor from "@dappkit/components/JSONEditor";
import axios from "axios";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";

import { Input } from "../../components/ui/input";
import { helper } from "../../lib/helper";
import { _ } from "../../lib/lodash";
import RootStore from "../../store/root";
import { Store } from "../../store/standard/base";
import { PromiseState } from "../../store/standard/PromiseState";
import { ToastPlugin } from "../Toast/Toast";
import { StoragePlugin } from "./Storage";

export class AsyncStorage implements Store {
  sid = "AsyncStorage";
  url = "/api/projectData";
  forceUpdate = false;
  autoObservable?: boolean = true;

  data = new PromiseState({
    context: this,
    value: {},
    function: async () => {
      const res = await axios.get(this.url, {
        params: { forceUpdate: this.forceUpdate },
      });
      //@ts-ignore
      return { ...this.data.value, ...res.data };
    },
  }).on("data", (data) => {
    this.syncStorage();
  });

  syncStorage() {
    const data = this.data.value;
    const storage = RootStore.Get(StoragePlugin);

    Object.keys(data).map((key) => {
      const value = data[key];
      const target = storage.dataMeta[key];
      if (target) {
        target.set(value);
      }
    });
  }

  devtools = {
    panels: [
      {
        title: "AsyncStorage",
        render: observer(() => {
          const jwt = StoragePlugin.Get({
            key: "asyncStorage.token",
            value: "",
            engine: StoragePlugin.engines.localStorage,
          });
          return (
            <div className="h-full w-full overflow-auto">
              <Input
                placeholder="Please enter your asyncStorage token here"
                value={jwt.value}
                onChange={(e) => jwt.set(e.target.value)}
              />
              <JSONEditor
                className="h-full"
                initialJson={JSON.stringify(toJS(this.data.value), null, 2)}
                onChange={(data) => {
                  console.log("onChange", data);
                  helper.deepMerge(this.data.value, data);
                  this.syncStorage();
                }}
                onSubmit={async (data) => {
                  if (!jwt.value) {
                    RootStore.Get(ToastPlugin).error(
                      "Please enter your asyncStorage token first",
                    );
                  } else {
                    if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
                      RootStore.Get(ToastPlugin).error(
                        "Please set your project id first",
                      );
                    }
                    await axios.post(
                      "/api/upsertAsyncData",
                      {
                        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
                        config: data,
                      },
                      {
                        headers: {
                          Authorization: `${jwt.value}`,
                        },
                      },
                    );
                  }
                  this.forceUpdate = true;
                  await this.data.wait({ call: true });
                  console.log("onSubmit", data);
                }}
              />
            </div>
          );
        }),
      },
    ],
  };

  constructor(args: Partial<AsyncStorage> = {}) {
    Object.assign(this, args);
  }

  get(key) {
    return _.get(this.data.value, key);
  }

  async set(key, value) {
    _.set(this.data.value, key, value);
  }

  async remove(key) {
    _.remove(this.data.value, key);
  }

  onNewStore = ({
    rootStore,
    store,
  }: {
    rootStore: RootStore;
    store: Store;
  }) => {
    if (store.autoAsyncable) {
      this.makeAutoAsyncAble(store);
    }
  };

  async makeAutoAsyncAble(instance) {
    const data = await this.data.wait({ call: true });
    if (data[instance.sid]) {
      Object.assign(instance, data[instance.sid]);
    }
  }
}
