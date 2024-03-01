"use client";

import "~/store/index";

import { observer } from "mobx-react-lite";
import { StoragePlugin } from "@dappworks/kit/experimental";
import { Button } from "@nextui-org/react";
import { RootStore } from "@dappkit/store";
import { DeviceDetectStore } from "../store/deviceDetect";
import { JSONTable } from "@dappworks/kit/jsontable";
import { JSONForm, getComplexFormData } from "@dappworks/kit/form";
import { JSONMetricsView } from "@dappworks/kit/metrics";

const inputValue = StoragePlugin.Get({
  key: "test.inputValue", value: "test", defaultValue: "defaultValue", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
    console.log('test.inputValue onset', v);
  }
});

const HomePage = observer(() => {
  const isMobile = RootStore.Get(DeviceDetectStore).isMobile;
  // Required field
  const formData = {
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
  };

  // Optional field
  const formConfig = {
    // Optional field
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
    // Optional field
    // extraInfo: {
    //   code: {
    //     'ui:widget': EditorWidget,
    //     'ui:options': {
    //       emptyValue: ``,
    //       lang: 'javascript',
    //       editorHeight: '400px',
    //     },
    //   },
    // },
  };
  return (
    <div className="p-4 w-full lg:w-[900px] mx-auto">
      <JSONTable
        className="my-4 h-auto"
        dataSource={[
          {
            a: {
              b: 1,
            },
            c: 2,
            d: {
              e: 3,
            },
          },
          {
            a: {
              b: 4,
            },
            c: 5,
            d: {
              e: 6,
            },
          },
        ]}
        columnOptions={{
          a: {
            label: 'A',
            sortable: true,
            sortKey: 'a.b',
            render: (text) => {
              return text.a.b;
            },
          },
          c: {
            label: 'C',
            valueClassName: 'text-red-500',
            sortable: true,
          },
          d: {
            label: 'D',
            labelClassName: 'font-bold',
            render: (item) => {
              return item.d.e;
            },
          },
        }}
        asCard={isMobile}
        cardOptions={{
          showDivider: true,
          itemClassName: 'flex justify-between',
        }}
        actionsOptions={{
          className: 'mt-4',
        }}
        actions={(item) => {
          return (
            <Button
              className="w-full"
              color="primary"
              onClick={() => {
                console.log('Edit:', item);
              }}
            >
              Edit
            </Button>
          );
        }}
      // actions={(item) => {
      //   return [
      //     {
      //       children: 'Edit',
      //       props: {
      //         onClick: () => {
      //           console.log('Edit:', item);
      //         },
      //       },
      //     },
      //     {
      //       children: 'Delete',
      //       props: {
      //         onClick: () => {
      //           console.log('Delete:', item);
      //         },
      //       },
      //     },
      //   ];
      // }}
      />

      <JSONForm
        className="mt-10"
        // Required field
        formData={formData}
        // Optional field
        formConfig={formConfig}
        // Optional field
        layoutConfig={{
          // Required field
          $type: 'GridLayout',
          // Optional field
          $gridColumn: 2,
          // Optional field
          personalInfo: {
            // Optional field
            title: 'Personal Information',
            // Optional field
            fieldLayout: [['name', 'age'], 'phone', 'city', ['date', 'dateTime', 'time'], 'boolean'],
            // submitButtonProps: {
            //   className: 'mx-auto',
            //   color: 'secondary',
            //   size: 'md',
            //   children: (
            //     <div className="flex items-center">
            //       <Send />
            //       <span className="ml-2">Customized submit button</span>
            //     </div>
            //   ),
            //   onAfterSubmit: async (formKey, formData, setLoading) => {
            //     console.log('[GridLayout onSubmit]', formKey, formData);
            //     setLoading(true);
            //     await new Promise((resolve) => setTimeout(resolve, 2000));
            //     setLoading(false);
            //   },
            // },
          },
          // Optional field
          extraInfo: {
            // Optional field
            title: 'Extra Information',
            // colSpan: 2,
            // submitButtonProps: {
            //   onAfterSubmit: async (formKey, formData, setLoading) => {
            //     console.log('[GridLayout onSubmit]', formKey, formData);
            //     setLoading(true);
            //     await new Promise((resolve) => setTimeout(resolve, 2000));
            //     setLoading(false);
            //   },
            // },
          },
        }}
        // onBatchSubmit={async (data, setLoading) => {
        //   console.log('[GridLayout onBatchSubmit]', data);
        //   setLoading(true);
        //   await new Promise((resolve) => setTimeout(resolve, 2000));
        //   setLoading(false);
        // }}
        batchSubmitButtonProps={{
          className: 'mx-auto',
          color: 'secondary',
          size: 'md',
          children: (
            <div className="flex items-center">
              <span className="ml-2">Customized submit button</span>
            </div>
          ),
          onBatchSubmit: async (formData, setLoading) => {
            console.log('[GridLayout onBatchSubmit]', formData);
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLoading(false);
          },
        }}
        // onSet={(v, form) => {
        //   console.log('[GridLayout onSet]', v, form);
        //   return v;
        // }}
        onChange={(data) => {
          console.log('[GridLayout onChange]', data);
        }}
      />

      <JSONForm
        className="mt-10"
        formData={formData}
        formConfig={formConfig}
        layoutConfig={{
          $type: 'TabLayout',
          $tabsProps: {
            color: 'secondary',
            radius: 'none',
            classNames: {
              base: 'w-full overflow-auto',
              tabList: 'p-0 rounded-sm bg-[#F2EFFD] dark:bg-[#262633]',
            },
          },
          personalInfo: {
            title: 'Personal Information',
            fieldLayout: [['name', 'age'], 'phone', 'city'],
          },
          // extraInfo: {
          //   title: 'Extra Information',
          // },
        }}
        onBatchSubmit={async (data, setLoading) => {
          console.log('[TabLayout onBatchSubmit]:', data);
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setLoading(false);
        }}
      />

      <JSONForm
        className="mt-10"
        formData={formData}
        formConfig={{
          personalInfo: {
            name: {
              title: 'Name',
              required: true,
            },
            age: {
              required: true,
            },
            phone: {
              required: true,
            },
            city: {
              selectOptions: [
                { label: 'city 1', value: 'city1' },
                { label: 'city 2', value: 'city2' },
                { label: 'city 3', value: 'city3' },
              ],
              required: true,
            },
          },
          // extraInfo: {
          //   address: {},
          //   code: {
          //     'ui:widget': EditorWidget,
          //     'ui:options': {
          //       emptyValue: ``,
          //       lang: 'javascript',
          //       editorHeight: '400px',
          //     },
          //   },
          // },
        }}
        layoutConfig={{
          $type: 'ListLayout',
          personalInfo: {
            title: 'Personal Information',
            // fieldLayout: [['name', 'age'], ['phone', 'city']],
          },
          extraInfo: {
            title: 'Extra Information',
          },
        }}
        onBatchSubmit={(data) => {
          console.log('[ListLayout onBatchSubmit]:', data);
        }}
      />

      <JSONForm
        className="mt-10"
        formData={formData}
        formConfig={formConfig}
        // Default layout is SimpleLayout
        onBatchSubmit={(data) => {
          console.log('[SimpleLayout onBatchSubmit]:', data);
        }}
      />

      <Button
        className="my-10"
        onClick={async () => {
          const data = await getComplexFormData({
            // Optional field
            title: 'Complex Form',
            // className: 'w-[100%] md:w-[80%] lg:w-[60%]',
            modalSize: '5xl',
            formData,
            // Optional field
            formConfig,
            // Optional field
            layoutConfig: {
              $type: 'GridLayout',
              $gridColumn: 2,
              personalInfo: {
                title: 'Personal Information',
                fieldLayout: [['name', 'age'], 'phone', 'city'],
              },
              extraInfo: {
                title: 'Extra Information',
              },
            },
            // Optional field
            onBatchSubmit: async (data, setLoading) => {
              console.log('[getComplexFormData onBatchSubmit]:', data);
              setLoading?.(true);
              await new Promise((resolve) => setTimeout(resolve, 2000));
              setLoading?.(false);
            },
            // onChange: (data) => {
            //   console.log('[getComplexFormData onChange]:', data);
            // }
          });
          console.log('[getComplexFormData]:', data);
        }}
      >
        Get Complex Form Data
      </Button>

      <JSONMetricsView
        data={[{
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
        }]}
      />
    </div>
  );
})

export default HomePage;