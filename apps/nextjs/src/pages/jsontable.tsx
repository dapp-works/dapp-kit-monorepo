import { observer, useLocalObservable } from "mobx-react-lite";
import { Button, Card } from "@nextui-org/react";
import { DeviceDetectStore } from "../store/deviceDetect";
import { JSONTable } from "@dappworks/kit/jsontable";
import { PaginationState, RootStore } from "@dappworks/kit";
import { ChevronRight } from "lucide-react";
import { helper } from "@dappworks/kit/utils";
import ThemeSwitcher from "~/components/ThemeSwitcher";

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

  return (
    <div className="mt-4 p-4 w-full lg:w-[900px] mx-auto border">
      <ThemeSwitcher />
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
        asCard={isMobile}
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
                  label: 'AA'
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
    </div>
  );
})

export default HomePage;