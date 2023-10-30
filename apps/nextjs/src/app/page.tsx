"use client";

import "~/store/index";

import { RootStore, AppProvider, } from "@dappworks/kit";
import { Button, Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
const JSONMetricsView = dynamic(() => import('@dappworks/jsonview').then(t => t.JSONMetricsView), { ssr: false })

// const inputValue = StoragePlugin.Get({
//   key: "test.inputValue", value: "test", defaultValue: "defaultValue", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
//     console.log('test.inputValue onset', v);
//   }
// });

const HomePage = observer(() => {
  // const headerStore = RootStore.Get(HeaderStore);


  return (
    <div className="px-4">
      <div>test</div>
      {/* <headerStore.Header /> */}
      {/* <Input value={inputValue.value} onChange={e => inputValue.set!(e.target.value)}></Input> */}
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
  );
})

export default HomePage;