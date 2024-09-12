import { observer } from "mobx-react-lite";
import { Button, Card } from "@nextui-org/react";
import { MetricsView } from "@dappworks/kit/metrics";
import { PromiseState, RootStore } from "@dappworks/kit";
import { ConfirmStore, DialogStore, PromiseStateGroup } from "@dappworks/kit/plugins";
import { useMemo } from "react";
import ThemeSwitcher from "~/components/ThemeSwitcher";
import Test from "./wallet";

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
      <Test />
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
                  }, 1000);
                });
              }
            });
            const ps2 = new PromiseState({
              function: async () => {
                return new Promise((resolve, reject) => {
                  reject('My error')
                });
              }
            });

            const ps3 = new PromiseState({
              function: async () => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(2);
                  }, 1000);
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

        <Button
          color="primary"
          size="sm"
          onClick={async () => {
            const ps1 = new PromiseState({
              function: async () => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(1);
                  }, 500);
                });
              }
            });
            const ps2 = new PromiseState({
              function: async () => {
                return 1
              }
            });

            const ps3 = new PromiseState({
              function: async () => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(2);
                  }, 1000);
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
                },
              ]
            });
            const res = await promiseStateGroup
              .callWithDialog(
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

            console.log('PromiseStateGroup Call:', res);
          }}
        >
          Auto Call with Dialog
        </Button>
      </div>
    </Card>
  )
});

const HomePage = observer(() => {
  return (
    <div className="p-4 w-full lg:w-[900px] mx-auto">
      <ThemeSwitcher />

      <PromiseStateGroupTest />

      <div className="my-2 flex items-center gap-2">
        <Button
          color="primary"
          size="sm"
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
          size="sm"
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