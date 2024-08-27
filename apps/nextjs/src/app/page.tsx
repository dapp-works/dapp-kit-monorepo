"use client";

import "~/store/index";

import { observer, useLocalObservable } from "mobx-react-lite";
import { StoragePlugin } from "@dappworks/kit/experimental";
import { Button, Card } from "@nextui-org/react";
import { DeviceDetectStore } from "../store/deviceDetect";
import { JSONTable } from "@dappworks/kit/jsontable";
import { ComplexFormModalStore, DatePickerWidget, EditorWidget, JSONForm, getComplexFormData } from "@dappworks/kit/form";
import { JSONMetricsView, MetricsView } from "@dappworks/kit/metrics";
import { Copy } from '@dappworks/kit/ui';
import { PaginationState, PromiseState, RootStore } from "@dappworks/kit";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { ConfirmStore, DialogStore, PromiseStateGroup } from "@dappworks/kit/plugins";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { helper } from "@dappworks/kit/utils";

const inputValue = StoragePlugin.Get({
  key: "test.inputValue", value: "test", defaultValue: "defaultValue", engine: StoragePlugin.engines.memory, debounce: 500, onDebounce: (v) => {
    console.log('test.inputValue onset', v);
  }
});

const PromiseStateGroupTest = observer(() => {
  const promiseStateGroup = useMemo(() => {
    const ps1 = new PromiseState({
      function: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(1);
          }, 2000);
        });
      }
    });
    const ps2 = new PromiseState({
      function: async () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('2'));
          }, 2000);
        });
      }
    });
    const ps3 = new PromiseState({
      function: async () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(3);
          }, 2000);
        });
      }
    });
    const promiseStateGroup = new PromiseStateGroup({
      group: [ps1, ps2, ps3],
      groupOptions: [
        {
          title: '====P1===='
        },
        {
          title: '====P2===='
        },
        {
          title: '====P3===='
        }
      ]
    });
    return promiseStateGroup;
  }, [])
  return (
    <Card className="my-4 p-4">
      <div className="mb-4">PromiseStateGroup Test</div>
      {promiseStateGroup.render()}
      <div className="mt-4 flex items-center space-x-2">
        <Button
          color="primary"
          size="sm"
          onClick={async () => {
            promiseStateGroup.onPrevious();
          }}
        >
          Pre Step
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={async () => {
            const res = await promiseStateGroup.stepCall(promiseStateGroup.currentCallStepNo);
            console.log('Current Step Call:', res);
            if (!res.errMsg) {
              promiseStateGroup.onNext();
            }
          }}
        >
          Step Call
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={async () => {
            const res = await promiseStateGroup.call();
            console.log('PromiseStateGroup Call:', res);
          }}
        >
          Auto Next
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={async () => {
            const ps1 = new PromiseState({
              function: async () => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(1);
                  }, 2000);
                });
              }
            });
            const ps2 = new PromiseState({
              function: async () => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(3);
                  }, 2000);
                });
              }
            });
            const promiseStateGroup = new PromiseStateGroup({
              group: [ps1, ps2],
              groupOptions: [
                {
                  title: '====P1===='
                },
                {
                  title: '====P2===='
                },
              ]
            });
            const res = await promiseStateGroup
              .showDialog(
                {
                  title: 'PromiseStateGroup Dialog',
                  size: 'sm',
                  // classNames: {
                  //   base: 'bg-[#000] text-white border border-[#f9f9f9]',
                  // }
                },
                {
                  className: 'pb-4',
                  spinnerProps: {
                    size: 'sm',
                    color: 'success'
                  },
                  // SuccessIcon: <Check size={20} color="#fff" />,
                  // FailureIcon: <X size={20} color="#fff" />
                }
              )
              .call();

            console.log('PromiseStateGroup Call:', res);
          }}
        >
          Show Dialog
        </Button>
      </div>
    </Card>
  )
});

const HomePage = observer(() => {
  const isMobile = RootStore.Get(DeviceDetectStore).isMobile;
  const store = useLocalObservable(() => ({
    isLoading: false,
    dataSource: [
      {
        a: {
          b: 1,
        },
        c: 2223,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 1,
        },
        c: 2,
        d: {
          e: 3,
        },
        e: [],
      },
      {
        a: {
          b: 4,
        },
        c: 5,
        d: {
          e: 6,
        },
        e: [
          {
            aa: 3,
            bb: 4,
          },
          {
            aa: 5,
            bb: 6,
          },
        ],
      },
    ]
  }));
  // Required field
  const formData = {
    personalInfo: {
      name: '',
      age: 18,
      phone: '',
      city: 'city1',
      date: '2021-01-01',
      dateTime: '2021-01-01T00:00:00',
      boolean: true,
      // boolean2: false,
      object: {
        a: 1,
        b: 2,
      },
    },
    extraInfo: {
      address: '',
      code: '',
      jsonStr: '{"personalInfo":{"name":"","age":18,"phone":"","city":"city1","date":"2021-01-01","dateTime":"2021-01-01T00:00:00","time":"00:00:00","boolean":true},"extraInfo":{"address":"","code":""}}'
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
      age: {
        required: true,
        validate: (v) => {
          if (v < 18) {
            return 'Age must be greater than 18';
          }
        },
        'ui:options': {
          placeholder: 'Please input age',
        },
      },
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
        // isMultipleSelect: true,
        required: true,
        validate: (v) => {
          if (v === 'city1') {
            return 'City cannot be city1';
          }
        },
        'ui:options': {
          placeholder: 'Select a city',
          description: 'This is a description',
          // renderValue: (items) => {
          //   const textList = items.map((item) => item.textValue);
          //   return textList.join(', ');
          // }
          // disabled: true,
        },
      },
      date: {
        title: 'Date',
        'ui:widget': DatePickerWidget,
        'ui:options': {
          granularity: 'day'
        }
      },
      dateTime: {
        title: 'Date Time',
        'ui:widget': DatePickerWidget,
        'ui:options': {
          granularity: 'minute'
        }
      },
      // boolean: {
      //   title: 'Boolean',
      //   'ui:options': {
      //     // disabled: true,
      //     nextuiClassNames: {
      //       base: 'py-1 px-2'
      //     }
      //   }
      // },
      // boolean2: {
      //   // description: 'This is a description',
      //   'ui:options': {
      //     color: 'secondary'
      //   }
      // }
    },
    // Optional field
    extraInfo: {
      code: {
        required: true,
        'ui:widget': EditorWidget,
        'ui:options': {
          language: 'javascript',
          editorHeight: '240px',
        },
      },
    },
  };


  return (
    <div className="p-4 w-full lg:w-[900px] mx-auto">
      <ThemeSwitcher />

      <PromiseStateGroupTest />

      <JSONTable
        // isHeaderSticky
        // className="my-4 h-auto lg:h-[200px] p-2 fixed-table-left-column"
        className="my-4"
        classNames={{
          th: 'text-[#64748B] dark:text-gray-300',
          tr: 'border-t-1 border-[#E5E7EB] dark:border-[#23222d] first:border-t-0',
        }}
        isLoading={store.isLoading}
        loadingOptions={{
          type: 'spinner',
          skeleton: {
            // line: 10,
            skeletonClassName: 'bg-red-500'
          }
        }}
        virtualizedOptions={{
          isVirtualized: true,
          vListHeight: isMobile ? 400 : 200,
          classNames: {
            row: 'border-t-1 border-[#E5E7EB] dark:border-[#23222d] hover:bg-[#ff8080] dark:hover:bg-[#18181B]',
          },
          fetchData: async () => {
            if (store.dataSource.length > 60) {
              return;
            }
            store.isLoading = true;
            await helper.promise.sleep(2000);
            store.dataSource = store.dataSource.concat([
              {
                a: {
                  b: 1,
                },
                c: 2,
                d: {
                  e: 3,
                },
                e: [],
              },
              {
                a: {
                  b: 1,
                },
                c: 2,
                d: {
                  e: 3,
                },
                e: [],
              },
              {
                a: {
                  b: 1,
                },
                c: 2,
                d: {
                  e: 3,
                },
                e: [],
              },
              {
                a: {
                  b: 1,
                },
                c: 2,
                d: {
                  e: 3,
                },
                e: [],
              },
              {
                a: {
                  b: 1,
                },
                c: 2,
                d: {
                  e: 3,
                },
                e: [],
              },
              {
                a: {
                  b: 1,
                },
                c: 2,
                d: {
                  e: 3,
                },
                e: [],
              },
            ])
            store.isLoading = false;
          }
        }}
        dataSource={store.dataSource}
        // dataSource={[]}
        headerKeys={['a', 'c', 'd', 'e']}
        // headerKeys={['$actions', 'a', 'c', 'd', 'e']}
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
            sortable: true,
            width: 250,
          },
          d: {
            label: 'D',
            render: (item) => {
              return item.d.e;
            },
          },
          e: {
            label: 'E',
          },
          $actions: {
            render: (item) => {
              return (
                <Button
                  className="w-full md:w-auto"
                  size="sm"
                  color="primary"
                  onClick={() => {
                    console.log('Edit:', item);
                  }}
                >
                  Edit
                </Button>
              );
            },
          },
        }}
        // showPagination={false}
        pagination={new PaginationState({
          limit: 5,
          onPageChange: (page) => {
            console.log('Page Change:', page);
          }
        })}
        nextuiPaginationProps={{
          color: 'secondary',
          size: 'sm',
          // radius: 'none',
          // isCompact: true
        }}
        onRowClick={(item) => {
          console.log('Row Click:', item);
        }}
        // asCard={isMobile}
        cardOptions={{
          showDivider: true,
          cardClassName: 'shadow-sm bg-[#f9f9f9] dark:bg-[#18181B]',
          itemClassName: 'flex justify-between',
          labelClassName: 'font-bold',
          valueClassName: 'text-red-500',
        }}
        emptyContent={isMobile ? <Card className='w-full h-20 flex flex-col justify-center items-center p-4 shadow-sm border text-foreground-400 rounded-lg'>No Data</Card> : undefined}
        collapsedTableConfig={{
          classNames: {
            th: 'text-[#64748B] dark:text-gray-300 whitespace-nowrap',
            tr: 'border-t-1 border-[#E5E7EB] dark:border-[#23222d] first:border-t-0',
          },
          options: [
            {
              key: 'e',
              headerKeys: ['aa', 'bb'],
              columnOptions: {
                aa: {
                  label: 'AA',
                },
                bb: {
                  label: 'BB'
                },
                '$actions': {
                  order: 100,
                  label: ' ',
                  render: (item) => {
                    return (
                      <Button
                        className="w-full md:w-auto"
                        size="sm"
                        color="primary"
                        onClick={() => {
                          console.log('Edit:', item);
                        }}
                      >
                        Edit
                      </Button>
                    );
                  }
                }
              }
            }
          ],
          rowCss: 'cursor-pointer',
          onRowClick: (data) => {
            console.log('data===>', data);
          },
          collapsedHandlerPosition: 'left',
          closedIcon: <ChevronRight size={18} />,
        }}
      />

      <JSONForm
        className="mt-10"
        theme="primary"
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
            titleBoxCss: 'text-xl',
            // Optional field
            fieldLayout: [['name', 'age'], 'phone', 'city', 'date', 'dateTime', 'boolean', 'object'],
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

            customRender: {
              Top: (formKey, formState) => {
                console.log('[GridLayout Top]===>', formKey, formState);
                return (
                  <div className="mb-2 flex items-center gap-2">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => {
                        console.log('Top Button Click');
                      }}
                    >
                      Top Button
                    </Button>
                  </div>
                )
              },
              SubmitButtonAfter(formKey, formState) {
                console.log('[GridLayout SubmitButtonAfter]===>', formKey, formState);

                const CustomButton = ({ className, children, onClick, ...rest }) => {
                  const [loading, setLoading] = useState(false);
                  return (
                    <Button
                      className={className}
                      type="submit"
                      color="primary"
                      size="sm"
                      isLoading={loading}
                      onClick={() => {
                        const formData = formState.formRef.current?.state.formData;
                        onClick?.(formKey, formData, setLoading);
                      }}
                      {...rest}
                    >
                      {children}
                    </Button>
                  )
                }

                const buttonPropsList = [
                  {
                    className: '',
                    children: 'test1',
                    onClick: async (formKey, formData, setLoading) => {
                      console.log('click test1:', formKey, formData);
                      setLoading(true);
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      setLoading(false);
                    }
                  },
                  {
                    className: '',
                    children: 'test2',
                    onClick: (formKey, formData, setLoading) => { console.log('click test2') }
                  }
                ]

                return (
                  <div className="mt-2 flex items-center gap-2">
                    {buttonPropsList.map((item, index) => {
                      return <CustomButton key={index} className={item.className} onClick={item.onClick}>{item.children}</CustomButton>
                    })}
                  </div>
                )
              }
            },

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

          // $combFormsCustomRender: {
          //   Top: (formStates) => {
          //     return 'Top';
          //   },
          //   SubmitButtonBefore: (formStates) => {
          //     return 'SubmitButtonBefore';
          //   },
          //   SubmitButtonAfter: (formStates) => {
          //     return 'SubmitButtonAfter';
          //   },
          // }

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
        onSet={(v, form) => {
          console.log('[GridLayout onSet]', v, form);
          // @ts-ignore
          if (v.name && v.name !== form.formData.name) {
            // @ts-ignore
            v.phone = v.name;
          }
          return v;
        }}
      // onChange={(data) => {
      //   console.log('[GridLayout onChange]', data);
      // }}
      />

      <JSONForm
        className="mt-10"
        // theme="primary"
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
          extraInfo: {
            title: 'Extra Information',
            titleBoxCss: 'font-bold'
          },
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
        theme="primary"
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
          extraInfo: {
            address: {},
            code: {
              'ui:widget': EditorWidget,
              'ui:options': {
                language: 'javascript',
                editorHeight: '240px',
              },
            },
          },
        }}
        layoutConfig={{
          $type: 'ListLayout',
          personalInfo: {
            title: 'Personal Information',
            titleBoxCss: 'font-bold text-red-500',
            submitButtonProps: {
              className: 'mx-auto',
              color: 'secondary',
              size: 'md',
              children: (
                <div className="flex items-center">
                  <span className="ml-2">Customized submit button</span>
                </div>
              ),
            }
          },
          extraInfo: {
            title: 'Extra Information',
            titleBoxCss: 'font-bold text-red-500',
          },
        }}
      />
      {/* 
      <JSONForm
        className="mt-10"
        formData={formData}
        formConfig={formConfig}
        // Default layout is SimpleLayout
        onBatchSubmit={(data) => {
          console.log('[SimpleLayout onBatchSubmit]:', data);
        }}
      /> */}

      <div className="flex items-center gap-2">
        <Button
          className="my-10"
          color="primary"
          onClick={async () => {
            const data = await getComplexFormData({
              // Optional field
              title: 'Complex Form',
              // className: 'w-[100%] md:w-[80%] lg:w-[60%]',
              theme: 'primary',
              // classNames: {
              //   body: "bg-red-500"
              // },
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
                RootStore.Get(ComplexFormModalStore).close();
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

        <Button
          color="primary"
          onClick={() => {
            DialogStore.show({
              title: 'Dialog Title',
              size: 'md',
              content: 'Dialog Content',
              // theme: 'primary',
              placement: 'top'
            })
          }}
        >
          Show Dialog
        </Button>

        <Button
          color="primary"
          onClick={() => {
            const confirmStore = RootStore.Get(ConfirmStore);
            confirmStore.show({
              title: 'Delete data table',
              description: 'Are you sure to delete this data table?',
              onOk: async () => {

              },
              onCancel: () => {

              },
              okBtnProps: {
                color: 'warning',
                children: 'Delete'
              },
              cancelBtnProps: {
                color: 'default',
              }
            });
          }}
        >
          ConfirmStore
        </Button>
      </div>

      <MetricsView
        data={{
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
          chartClassName: 'h-[200px]',
        }}
      />
    </div>
  );
})



export default HomePage;