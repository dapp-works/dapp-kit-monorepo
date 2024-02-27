

import { makeAutoObservable, observable } from 'mobx';

export class KV {
  //@ts-ignore
  static datas = observable();
}

export abstract class ContractBase {
  // chainId?: number;
  // address?: string;

}

export type ContractClass<T extends ContractBase> = new (args: Partial<T>) => T

export type PromiseHookData<T, U> = { value: Awaited<U>; get: T; call: T, loading: boolean }

export class PromiseHook {
  static entities = observable([]);
  static Get<T extends ContractBase>(cls: ContractClass<T>): (args: { args: Partial<T>; id?: string, select?: { [key in keyof Partial<T>]: boolean }, unselect?: { [key in keyof Partial<T>]: boolean } }) => Promise<T & { refresh: () => Promise<void> }> {
    try {
      return async ({ args, select, id, unselect }) => {
        let instance: any
        //@ts-ignore
        if (!id || !this.entities[id]) {
          instance = new cls(args);

          instance.refresh = async () => {
            const hooks = Object.entries(instance)
              .filter((i) => {
                if (!this.isPromiseHook(instance[i[0]])) return false
                if (select && !select[i[0]]) return false
                if (unselect && unselect[i[0]]) return false
                return true
              }).map(i => {
                const hook = instance[i[0]]
                return hook
              })

            await Promise.all(hooks.map((i) => i.call()));
          }
          if (id) {
            //@ts-ignore
            this.entities[id] = instance
          }
        } else {
          instance = this.entities[id!]
          // console.log("exists", instance)

        }


        await instance.refresh()
        return instance;
      };
    } catch (e) {
      throw e
    }
  }


  static isPromiseHook(target) {
    return target?._type == "promiseHook"
  }


  //ttl : ms
  static wrap<T extends (...args: any[]) => Promise<any>, U = ReturnType<T>>({ func, defaultValue }: { func: T; defaultValue?: Awaited<U>; }): PromiseHookData<T, U> {
    let context;
    const call = () => {
      context.loading = true;
      if (!context._call) {
        context._call = func()
          .then((i) => {
            context.value = i;
            console.log("call", context.value)
            context.loading = false;
            context._call = null
            return i
          })
          .catch((i) => {
            console.error(i, func);
            context.value = defaultValue
            context._call = null
            context.loading = false;
            throw i;
          });
      }


      return context._call
    };
    const get = async () => {
      if (!context.value) {

        return call();
      }
      return context.value;
    };

    if (!context) {
      context = observable({
        _type: 'promiseHook',
        _value: defaultValue,
        get value() {
          return context['_value'];
        },
        set value(val) {
          context['_value'] = val;
        },
        get,
        loading: false,
        call,
        defaultValue,
        toJSON() {
          return context.value
        },
        toString() {
          return context.value
        },
      });
    }

    return context;
  }

}
