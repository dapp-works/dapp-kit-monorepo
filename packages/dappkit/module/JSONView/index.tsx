import { JSONFormProps } from '@/dappkit/components/JSONForm';
import { _ } from '@/dappkit/lib/lodash';
import RootStore from '@/dappkit/store/root';
import { Store } from '@/dappkit/store/standard/base';
import { observer } from 'mobx-react-lite';

export type JSONViewType = {
  className?: string;
  children?: any;
  data?: Record<string, JSONDataType>;
  datas?: Record<string, Record<string, JSONDataType> | JSONDataType[]>;
  uiConfig?: {
    type: string;
    className?: Record<string, string>;
    slots?: Record<string, any>;
    [key: string]: any;
  };
  uiConfigs?: Record<string, JSONViewType['uiConfig']>;
};

export type JSONDataType = {
  title?: string;
  icon?: any;
  render?: any;
  className?: string;
  type?: 'divider' | 'checkbox' | 'label' | 'radio';
  shortcut?: string;
  disabled?: boolean;
  children?: Record<string, JSONDataType>;
  value?: any;
  link?: any;
  events?: Record<string, any>;
  onChange?: (args: { e: any; v: any }) => void;
  onClick?: (args: { e: any; v: any }) => void;
};

export class JSONViewPlugin implements Store {
  sid = 'JSONViewPlugin';
  autoObservable?: boolean = false;

  JSONView = {
    Test: {
      name: 'Test',
      render: () => <div>Test</div>,
    },
  };

  onNewStore({ rootStore, store }: { rootStore: RootStore<any>; store: Store }): void {
    this.crawl(store);
  }

  crawl(store: Store) {
    if (store?.JSONView) {
      this.JSONView = { ...this.JSONView, ...store.JSONView };
    }
  }

  static JSONView = (props: JSONViewType) => {
    const jsonviewplugin = RootStore.Get(JSONViewPlugin);

    return (
      <>
        {Object.keys(props.uiConfigs).map((key) => {
          const config = props.uiConfigs[key] as any;
          const data = _.get(props.datas, key);
          const Component = jsonviewplugin.JSONView[config.type].render;
          const rootStore = RootStore.init();
          Object.values(data).forEach((i) => {
            if (i.events) {
              Object.entries(i.events).forEach(([k, v]) => {
                i[k] = (args) => rootStore.events.emit(v as any, { ...args, action: k });
              });
            }
          });

          return <Component key={key} data={data} uiConfig={config} />;
        })}
      </>
    );
  };
}
