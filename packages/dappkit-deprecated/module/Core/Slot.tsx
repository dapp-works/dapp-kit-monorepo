import { Store } from "../../store/standard/base";
import RootStore from "../../store/root";
import React, { ReactNode } from "react";

export class SlotPlugin implements Store {
  sid = "SlotPlugin";
  stype = "Plugin"
  autoObservable?: boolean = false;

  slotMap: Store["slots"] = {};

  // SlotList = observer(() => {
  //   const collection = RootStore.Get(Collection<Store["slot"]>, { sid: "SlotPlugin.slots", args: { data: this.slotMap } });
  //   //@ts-ignore
  //   const Component = collection.current.Component;

  //   return (
  //     <div className="h-full flex flex-col md:flex-row text-sm">
  //       <div className="w-full md:w-[300px] space-y-1 pr-2 md:border-r-[1px] border-gray-200 dark:border-gray-700 overflow-auto">
  //         {Object.keys(collection.data).map((i) => (
  //           <div key={i} className={cn("px-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer", { "bg-green-600 text-white": collection.key === i })} onClick={() => collection.setKey(i)}>
  //             {i}
  //           </div>
  //         ))}
  //       </div>
  //       <div className="mt-4 w-full md:w-[400px] px-4 overflow-auto md:mt-0 md:ml-4">
  //         {/* @ts-ignore */}
  //         <Component {...collection.current.input} />
  //         {/* @ts-ignore  */}
  //         {collection.current.input && (
  //           <JSONSchemaForm
  //             formState={getFormState({
  //               uiSize: "small",
  //               // @ts-ignore
  //               data: collection.current.input,
  //               onSubmit: (data) => {
  //                 console.log(data);
  //                 // @ts-ignore
  //                 collection.setValue(collection.key, { ...collection.current, input: data });
  //               },
  //             })}
  //           />
  //         )}
  //       </div>
  //     </div>
  //   );
  // });

  // devtools = {
  //   panels: [
  //     {
  //       title: "Slot",
  //       render: this.SlotList,
  //     },
  //   ],
  // };

  onNewStore({ rootStore }: { rootStore: RootStore }) {
    Object.values(rootStore.instance).forEach((store) => {
      //@ts-ignore
      if (store.isSlotInit) return;
      if (store.slots) {
        //@ts-ignore
        store.isSlotInit = true;
        //@ts-ignore
        this.slotMap = { ...this.slotMap, ...store.slots };
      }
    });
  }

  toJSON() {
    return this.slotMap
  }

  static Slot = ({ name, ...props }: { name } & any): ReactNode => {
    const slotPlugin = RootStore.Get(SlotPlugin);
    const slot = slotPlugin.slotMap![name];
    //@ts-ignore
    const Component: React.FC = slot?.render;
    if (!Component) {
      //@ts-ignore
      return <div></div>;
    }
    //@ts-ignore
    return <Component {...props} />;
  };

  constructor(args: Partial<SlotPlugin> = {}) {
    Object.assign(this, args);
  }
}
