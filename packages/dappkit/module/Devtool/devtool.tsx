import { Sheet, SheetClose, SheetContent } from '@/dappkit/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/dappkit/components/ui/tabs';
import { cn } from '@/dappkit/lib/utils';
import RootStore, { MyEmitter } from '@/dappkit/store/root';
import { PromiseState } from '@/dappkit/store/standard/PromiseState';
import { Store } from '@/dappkit/store/standard/base';
import { Wrench } from 'lucide-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { toJS } from 'mobx';
import { helper } from '@/dappkit/lib/helper';
import EventEmitter from 'events';
import { JSONSchemaForm } from '@/dappkit/components/JSONSchemaForm';
import { getFormState } from '../FormModal';
import { Card } from '@/dappkit/components/ui/card';
import { useMemo } from 'react';
import { Button } from '@/dappkit/components/ui/button';

const JSONEditor = dynamic({ loader: () => import('@/dappkit/components/JSONEditor') }, { ssr: false });

function filterState(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(filterState);
  }

  const filteredObj = {};

  for (const [key, value] of Object.entries(obj)) {
    try {
      if (
        !['sid', 'disabled', 'autoObservable', 'promiseState', 'autoAsyncable'].includes(key) &&
        !(value instanceof PromiseState) &&
        !(value instanceof EventEmitter) &&
        !value?.hasOwnProperty('$$typeof')
      ) {
        filteredObj[key] = filterState(value);
      }
    } catch (error) {
      console.error(error);
      return obj;
    }
  }

  return filteredObj;
}

export class DevTool implements Store {
  sid = 'DevTool';
  provider = ({ rootStore }: { rootStore: RootStore }) => <DevToolProvider rootStore={rootStore} />;
  disabled?: boolean = false;
  autoObservable?: boolean = true;
  isOpen = false;

  panels: Store['pannel'][] = [
    {
      title: 'Store',
      render: observer(({ rootStore }: { rootStore: RootStore }) => {
        const stores = Object.keys(rootStore.instance).sort((a, b) => a.length - b.length);
        const state = useLocalObservable<{
          curStore: Store;
          curPromiseStateList: { name: string; promiseState: PromiseState<any, any> }[];
        }>(() => ({
          curStore: null,
          curPromiseStateList: [],
        }));
        const initialJson = useMemo(() => {
          const filteredData = filterState(state.curStore || {});
          return JSON.stringify(toJS(filteredData), null, 2);
        }, [state.curStore]);
        return (
          <div className="h-full flex flex-col md:flex-row text-sm">
            <div className="w-full md:w-[300px] space-y-1 pr-2 overflow-auto">
              {stores.map((key) => {
                const store = rootStore.instance[key];
                return (
                  <div
                    key={store.sid}
                    className={cn('px-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer', { 'bg-green-600 text-white': state.curStore?.sid === store.sid })}
                    onClick={() => {
                      state.curStore = store;
                      const promiseStateList = [];
                      Object.keys(store).forEach((key) => {
                        const promiseState: PromiseState<any, any> = store[key];
                        if (promiseState instanceof PromiseState && promiseState.debug) {
                          promiseStateList.push({ name: key, promiseState });
                        }
                      });
                      state.curPromiseStateList = promiseStateList;
                    }}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 w-full overflow-auto md:mt-0">
              <JSONEditor
                className={state.curPromiseStateList.length > 0 ? '' : 'h-full'}
                height={state.curPromiseStateList.length > 0 ? 400 : '100%'}
                initialJson={initialJson}
                onChange={(data) => {
                  console.log('onChange', data);
                  helper.deepMerge(state.curStore, data);
                }}
              />
              <PromiseStateDebug promiseStateList={state.curPromiseStateList} />
            </div>
          </div>
        );
      }),
    },
    // {
    //   title: 'Event',
    //   render: observer(({ rootStore }: { rootStore: RootStore }) => {
    //     const events = rootStore.events as MyEmitter;
    //     return (
    //       <div>
    //         {
    //           //@ts-ignore
    //           Object.entries(events._events).map(([key, event]) => {
    //             const eventMeta = events.metas[key];
    //             return (
    //               <div>
    //                 <div>
    //                   {key}
    //                   <span>
    //                     <Button size="sm" onClick={(e) => rootStore.events.emit(key, { e, action: 'debug' })}>
    //                       Call
    //                     </Button>
    //                   </span>
    //                   <span>call Count: {eventMeta?.count}</span>
    //                 </div>
    //               </div>
    //             );
    //           })
    //         }
    //       </div>
    //     );
    //   }),
    // },
  ];

  onNewStore({ rootStore }: { rootStore: RootStore }) {
    Object.values(rootStore.instance).forEach((store) => {
      if (store.devtools?.started) return;
      if (store.devtools?.panels) {
        store.devtools.started = true;
        this.panels = [...this.panels, ...store.devtools?.panels];
      }
    });
  }

  constructor(args: Partial<DevTool> = {}) {
    Object.assign(this, args);
  }
}

const PromiseStateDebug = ({ promiseStateList }: { promiseStateList: { name: string; promiseState: PromiseState<any, any> }[] }) => {
  if (promiseStateList.length === 0) return null;
  return (
    <>
      <div className="mt-6 mb-2 pt-2 border-t-[1px] font-bold dark:border-gray-600">Debug PromiseState</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {promiseStateList.map((item, index) => {
          const formData = item.promiseState.debug.input;
          return (
            <Card className="p-2 dark:border-gray-800" key={index}>
              <div className="font-bold text-xs">{item.name}</div>
              <JSONSchemaForm
                formState={getFormState({
                  uiSize: 'small',
                  data: formData,
                  onSubmit: (data) => {
                    item.promiseState.call(data);
                  },
                })}
              />
            </Card>
          );
        })}
      </div>
    </>
  );
};

export const DevToolProvider = observer(({ rootStore }: { rootStore: RootStore }) => {
  const devTool = rootStore.get(DevTool);
  const minSheetHeight = 500;
  const store = useLocalObservable(() => ({
    sheetHeight: minSheetHeight,
  }));
  return (
    <>
      <div className="fixed right-4 bottom-4 z-10">
        <div
          className="p-1 rounded-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 cursor-pointer"
          onClick={() => {
            devTool.isOpen = true;
          }}
        >
          <Wrench size={20} />
        </div>
      </div>
      <Sheet open={devTool.isOpen}>
        <SheetContent
          open={devTool.isOpen}
          side="bottom"
          className="p-0 outline-none bg-card dark:border-none"
          style={{
            height: store.sheetHeight,
          }}
        >
          <div className="absolute top-0 left-0 h-[32px] w-full bg-gray-100 dark:bg-gray-800"></div>
          <SheetClose
            className="top-2 right-2"
            onClick={() => {
              devTool.isOpen = false;
            }}
          />
          <div
            className="absolute top-[-8px] left-0 w-full h-[10px] cursor-row-resize"
            onMouseDown={(e) => {
              const startH = store.sheetHeight;
              const startPageY = e.pageY;
              const onMouseMove = (mouseMoveEvent: MouseEvent) => {
                const diff = startPageY - mouseMoveEvent.pageY;
                const h = startH + diff;
                if (h > minSheetHeight && h < window.innerHeight) {
                  store.sheetHeight = h;
                }
              };
              const onMouseUp = () => {
                document.body.removeEventListener('mousemove', onMouseMove);
              };
              document.body.addEventListener('mousemove', onMouseMove);
              document.body.addEventListener('mouseup', onMouseUp, { once: true });
            }}
          />
          <Tabs defaultValue="Store">
            <TabsList className="relative max-w-[calc(100vw-50px)] p-0 h-auto rounded-none">
              {devTool.panels.map((panel) => {
                return (
                  <TabsTrigger key={panel.title} value={panel.title} className="rounded-none">
                    <div>{panel.title}</div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {devTool.panels.map((panel) => {
              const Component = panel.render || (() => null);
              return (
                <TabsContent key={panel.title} value={panel.title} className="p-1" style={{ height: `calc(${store.sheetHeight}px - 50px)` }}>
                  <Component rootStore={rootStore} />
                </TabsContent>
              );
            })}
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
});
