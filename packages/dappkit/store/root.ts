import { Store, StoreClass } from './standard/base';
import { makeAutoObservable, makeObservable } from 'mobx';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';

export type EventMap = {
  '*': (args: any) => void;
  add: (store: Store) => void;
};

export class MyEmitter extends EventEmitter {
  metas: Record<string, { count: number }> = {};
  _events: Record<string, any>;
  emit(type: any, ...args: any[]) {
    if (process.env.NODE_ENV == 'development') {
      super.emit('*', { type, args });
    }
    if (!this.metas[type]) {
      this.metas[type] = { count: 0 };
    }
    this.metas[type].count++;
    return super.emit(type, ...args) || super.emit('', ...args);
  }
  constructor() {
    super();
    makeObservable(this, {
      metas: true,
    });
  }
}

export default class RootStore<T extends EventMap = any> {
  instanceMap = new Map<Function, Map<string, Store>>();
  instance: Record<string, Store> = {};

  providers: Store[] = [];

  events: TypedEmitter<T> = new MyEmitter() as TypedEmitter<T>;

  static init<T extends EventMap>(args: Partial<RootStore<T>> = {}): RootStore<T> {
    if (!globalThis.store) {
      //@ts-ignore
      globalThis.store = new RootStore(args);
    }

    return globalThis.store;
  }

  add(store: Store, { sid }: { sid?: string } = {}) {
    if (store.disabled) {
      return;
    }

    const instanceMapId = sid ? sid : 'singleton';
    const instanceId = sid ? sid : store.sid;

    if (!this.has(store.constructor)) {
      this.instanceMap.set(store.constructor, new Map());
    }

    if (this.instanceMap.get(store.constructor).get(instanceMapId)) {
      console.error(`Store ${store.sid} already exists`);
      return;
      throw new Error(`Store ${store.sid} already exists`);
    }
    if (store.autoObservable) {
      makeAutoObservable(store);
    }
    if (store.provider) {
      this.providers.push(store);
    }
    if (store.onNewStore) {
      this.events.on('add', (e: Store) => {
        store.onNewStore({ rootStore: this, store: e });
      });
    }

    if (store.onAdded) {
      store.onAdded({ rootStore: this });
    }
    if (store.stores) {
      this.addStores(store.stores);
    }

    if (store.events) {
      Object.entries(store.events).forEach(([event, val]) => {
        this.events.on(val.name as any, val.handler);
      });
    }

    this.instanceMap.get(store.constructor).set(instanceMapId, store);
    this.instance[instanceId] = store;
    //@ts-ignore
    this.events.emit('add', store);

    if (store.init) {
      store.init();
    }
    // this.crawlStore(store);
  }

  addStores(store: Store[]) {
    store.forEach((i) => this.add(i));
    return this;
  }

  get<T extends Store>(store: StoreClass<T>, config: { sid?: string; args?: Partial<T> } = {}): T {
    const instanceMapId = config.sid ? config.sid : 'singleton';
    const valid = this.instanceMap.has(store) && this.instanceMap.get(store).has(instanceMapId);
    if (!valid) {
      this.add(new store(config.args || {}), config);
    }
    return this.instanceMap.get(store).get(instanceMapId) as T;
  }

  public has(store: Function): boolean {
    return this.instanceMap.has(store);
  }

  constructor(args: Partial<RootStore<T>> = {}) {
    Object.assign(this, args);
    makeObservable(this, {
      providers: true,
    });

    this.crawlStore(this);
  }

  crawlStore(obj: Object) {
    Object.values(obj).forEach((value) => {
      if (value?.sid) {
        this.add(value);
      }
    });
  }

  static Get<T extends Store>(store: StoreClass<T>, config: { sid?: string; args?: Partial<T> } = {}): T {
    return this.init().get(store, config);
  }
}
