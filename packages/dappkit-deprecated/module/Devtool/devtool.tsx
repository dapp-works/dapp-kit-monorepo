import { Sheet, SheetClose, SheetContent } from "../../components/ui/sheet";
import { Tabs, Tab } from "@nextui-org/react";
import { cn } from "../../lib/utils";
import RootStore from "../../store/root";
import { PromiseState } from "../../store/standard/PromiseState";
import { Store } from "../../store/standard/base";
import { Wrench } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { toJS } from "mobx";
import { helper } from "../../lib/helper";
import EventEmitter from "events";
import { useMemo } from "react";
import React from "react";
import JSONEditor from "../../../dappform/components/JSONEditor";


function filterState(obj) {
  if (obj.toJSON) {
    return obj.toJSON()
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(filterState);
  }

  const filteredObj = {};

  for (const [key, value] of Object.entries(obj)) {
    try {
      if (
        !["sid", "disabled", "autoObservable", "promiseState", "autoAsyncable", "stype"].includes(key) &&
        // !(value instanceof PromiseState) &&
        !(value instanceof EventEmitter) &&
        !value?.hasOwnProperty("$$typeof")
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
  sid = "DevTool";
  stype = "Plugin"
  provider = ({ rootStore }: { rootStore: RootStore }) => <DevToolProvider rootStore={rootStore} />;
  disabled?: boolean = false;
  autoObservable?: boolean = true;
  isOpen = false;

  panels: Store["pannel"][] = [
    {
      title: "Store",
      render: observer(({ rootStore }: { rootStore: RootStore }) => {
        const state = useLocalObservable<{
          curStore: Store;
          curPromiseStateList: { name: string; promiseState: PromiseState<any, any> }[];
        }>(() => ({
          //@ts-ignore
          curStore: null,
          curPromiseStateList: [],
        }));
        const initialJson = useMemo(() => {
          //@ts-ignore
          if (state.curStore?.toJSON) return JSON.stringify(state.curStore?.toJSON(), null, 2);
          const filteredData = filterState(state.curStore || {});
          return JSON.stringify(toJS(filteredData), null, 2);
        }, [state.curStore]);
        return (
          <div className="flex flex-col md:flex-row text-sm">
            <div>
              <Tabs
                size="sm"
                radius="none"
                variant="underlined"
                items={[{ title: "Store", value: "Store" }, { title: "Plugin", value: "Plugin" }]}
              >
                {(item) => {
                  const stores = Object.values(rootStore.instance).filter(i => i.stype == item.value && i.sid).sort((a, b) => a.sid.length - b.sid.length);
                  return (
                    <Tab key={item.title} title={item.title} >
                      <div>
                        <div className="w-full md:w-[300px] space-y-1 pr-2 overflow-auto">
                          {stores.map((store) => {
                            return (
                              <div
                                key={store?.sid}
                                className={cn("px-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer", { "bg-green-600 text-white": state.curStore?.sid === store.sid })}
                                onClick={() => {
                                  state.curStore = store;
                                }}
                              >
                                {store.sid}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Tab>
                  )
                }}
              </Tabs>
            </div>

            <div className="mt-4 w-full overflow-auto md:mt-0">
              <JSONEditor
                className={"h-full"}
                height={450}
                initialJson={initialJson}
                onChange={(data) => {
                  console.log("onChange", data);
                  helper.deepMerge(state.curStore, data);
                }}
              />
              {/* <PromiseStateDebug promiseStateList={state.curPromiseStateList} /> */}
            </div>
          </div>
        );
      }),
    },
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

// const PromiseStateDebug = ({ promiseStateList }: { promiseStateList: { name: string; promiseState: PromiseState<any, any> }[] }) => {
//   if (promiseStateList.length === 0) return null;
//   return (
//     <>
//       <div className="mt-6 mb-2 pt-2 border-t-[1px] font-bold dark:border-gray-600">Debug PromiseState</div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {promiseStateList.map((item, index) => {
//           const formData = item.promiseState.debug.input;
//           return (
//             <Card className="p-2 dark:border-gray-800" key={index}>
//               <div className="font-bold text-xs">{item.name}</div>
//               <JSONSchemaForm
//                 formState={getFormState({
//                   data: formData,
//                   onSubmit: (data) => {
//                     item.promiseState.call(data);
//                   },
//                 })}
//               />
//             </Card>
//           );
//         })}
//       </div>
//     </>
//   );
// };

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
                document.body.removeEventListener("mousemove", onMouseMove);
              };
              document.body.addEventListener("mousemove", onMouseMove);
              document.body.addEventListener("mouseup", onMouseUp, { once: true });
            }}
          />
          <Tabs
            className='w-full'
            size="sm"
            radius="none"
            items={devTool.panels}
          >
            {(panel) => {
              const Component = panel.render || (() => null);
              return (
                <Tab key={panel.title} title={panel.title}>
                  <div className="p-0" style={{ height: `calc(${store.sheetHeight}px - 50px)` }}>
                    <Component rootStore={rootStore} />
                  </div>
                </Tab>
              )
            }}
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
});
