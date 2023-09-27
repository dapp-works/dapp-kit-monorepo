"use client";

import "~/store/index";

import { RootStore, HeaderStore, StoragePlugin } from "@dappworks/kit";
import { Button, Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { FormPlugin } from "@dappworks/jsonview";
import { JSONMetricsView } from "@dappworks/jsonview";


const HomePage = observer(() => {
  const headerStore = RootStore.Get(HeaderStore);

  const inputValue = StoragePlugin.Input({
    key: "test.inputValue", value: "", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
      console.log('test.inputValue onset', v);
    }
  });

  return (
    <div className="px-4">
      <headerStore.Header />
      <div className="flex flex-col">
        <Input className="mt-2" placeholder="StoragePlugin.Input debounce Example" {...inputValue}></Input>
        <Button className="mt-2" onClick={async () => {
          const data = await RootStore.Get(FormPlugin).form({
            title: 'test',
            formData: {
              name: {
                first: 'first',
                last: 'last',
              }
            },
            layoutConfig: {
              type: 'TabLayout',
            }
          });
          console.log(data)
        }}>Open ComplexFormModal</Button>

        <JSONMetricsView data={[{
          type: 'KPICard',
          title: 'Data Messages',
          description: 'Total number of messages received from all devices',
          data: new Array(30).fill(0).map((_, i) => ({
            date: new Date(2021, 0, i + 1).toISOString(),
            SemiAnalysis: Math.floor(Math.random() * 100),
            'The Pragmatic Engineer': Math.floor(Math.random() * 100),
          })),
          index: 'date',
          categories: ["SemiAnalysis", "The Pragmatic Engineer"],
          metricTitle: 'Total Events',
          metric: 124,
          chartType: 'area',
        }]} />
      </div>
    </div>
  );
})

export default HomePage;