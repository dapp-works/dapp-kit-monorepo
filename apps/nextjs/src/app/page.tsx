"use client";

import "~/store/index";


import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
const JSONMetricsView = dynamic(() => import('@dappworks/kit/metrics').then(t => t.JSONMetricsView), { ssr: false })
const JSONForm = dynamic(() => import('@dappworks/kit/form').then(t => t.JSONForm), { ssr: false })

import { StoragePlugin } from "@dappworks/kit/experimental";
import { Input } from "@nextui-org/react";

const inputValue = StoragePlugin.Get({
  key: "test.inputValue", value: "test", defaultValue: "defaultValue", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
    console.log('test.inputValue onset', v);
  }
});

const HomePage = observer(() => {
  // const headerStore = RootStore.Get(HeaderStore);

  return (
    <div className="px-4">
      <div>test1</div>
      <JSONForm
        className="my-10"
        formData={{
          personalInfo: {
            name: '',
            age: 18,
            phone: '',
            city: 'city1',
            date: '2021-01-01',
            dateTime: '2021-01-01T00:00:00',
            time: '00:00:00',
            boolean: true,
          },
          extraInfo: {
            address: '',
            code: '',
          },
        }}
        formConfig={{
          personalInfo: {
            name: {
              // Optional field
              title: 'Name',
              // Optional field
              required: true,
            },
            // age: {
            //   required: true,
            // },
            phone: {
              required: true,
              // 'ui:options': {
              //   disabled: true,
              // },
            },
            city: {
              // Optional field
              selectOptions: [
                { label: 'city 1', value: 'city1' },
                { label: 'city 2', value: 'city2' },
                { label: 'city 3', value: 'city3' },
              ],
              required: true,
              description: 'This is a description',
              'ui:options': {
                placeholder: 'Select a city',
                // disabled: true,
              },
            },
            date: {
              title: 'Date',
              'ui:widget': 'date',
            },
            dateTime: {
              title: 'Date Time',
              'ui:widget': 'date-time',
            },
            time: {
              title: 'Time',
              'ui:widget': 'time',
            },
            boolean: {
              title: 'Boolean',
              // 'ui:options': {
              //   disabled: true,
              // },
            },
          },
        }}
        layoutConfig={{
          $type: 'GridLayout',
          $gridColumn: 2,
          personalInfo: {
            title: 'Personal Information',
            fieldLayout: [['name', 'age'], 'phone', 'city'],
          },
          extraInfo: {
            title: 'Extra Information',
          },
        }}
      />


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