import { observer } from 'mobx-react-lite';
import { Store } from '@/dappkit/store/standard/base';
import { Collection } from '@/dappkit/module/Core/standard/Collection';
import { getFormState } from '../FormModal';
import { JSONSchemaForm } from '@/dappkit/components/JSONSchemaForm';
import { cn } from '@/dappkit/lib/utils';
import RootStore from '@/dappkit/store/root';

export class SlotPlugin implements Store {
  sid = 'SlotPlugin';
  autoObservable?: boolean = false;

  static slots = {};

  get slots() {
    return SlotPlugin.slots;
  }

  SlotList = observer(() => {
    const collection = RootStore.Get(Collection<Store['slot']>, { sid: 'SlotPlugin.slots', args: { data: this.slots } });
    const Component = collection.current.Component;

    return (
      <div className="h-full flex flex-col md:flex-row text-sm">
        <div className="w-full md:w-[300px] space-y-1 pr-2 md:border-r-[1px] border-gray-200 dark:border-gray-700 overflow-auto">
          {Object.keys(collection.data).map((i) => (
            <div key={i} className={cn('px-2 rounded-md hover:bg-green-600 hover:text-white cursor-pointer', { 'bg-green-600 text-white': collection.key === i })} onClick={() => collection.setKey(i)}>
              {i}
            </div>
          ))}
        </div>
        <div className="mt-4 w-full md:w-[400px] px-4 overflow-auto md:mt-0 md:ml-4">
          <Component {...collection.current.input} />
          {collection.current.input && (
            <JSONSchemaForm
              formState={getFormState({
                uiSize: 'small',
                data: collection.current.input,
                onSubmit: (data) => {
                  console.log(data);
                  collection.setValue(collection.key, { ...collection.current, input: data });
                },
              })}
            />
          )}
        </div>
      </div>
    );
  });

  devtools = {
    panels: [
      {
        title: 'Slot',
        render: this.SlotList,
      },
    ],
  };

  static Register = (Component, { name, input = null }: { name?: string; input?: any } = {}) => {
    const _name = Component.displayName || name;
    const render = observer(() => <Component {...input} />);

    if (!_name) throw new Error('SlotPlugin.Register: name is required');
    this.slots[_name] = {
      input,
      Component,
    };
    return render;
  };

  constructor(args: Partial<SlotPlugin> = {}) {
    Object.assign(this, args);
  }
}
