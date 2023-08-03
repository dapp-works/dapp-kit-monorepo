import { makeAutoObservable } from 'mobx';
import { EventEmitter } from 'stream';
import RootStore from '../root';

export abstract class Store {
  sid?: string;
  disabled?: boolean;
  autoObservable?: boolean;
  autoAsyncable?: boolean;

  stores?: Store[];

  private pannel?: {
    title: string;
    render: any;
  };
  devtools?: {
    enable?: boolean;
    started?: boolean;
    panels: Store['pannel'][];
  };

  private slot?: {
    input?: Record<string, any>;
    Component: React.FC;
    render: React.FC;
  };
  slots?: Record<string, Store['slot']>;

  events?: Record<string, { name: string; handler(args: { e: MouseEvent; v?: any }): any }>;

  provider?(args: { rootStore: RootStore }): any;

  onNewStore?({ rootStore, store }: { rootStore: RootStore; store: Store }): void;
  onAddedStores?({ rootStore }: { rootStore: RootStore }): void;
  onAdded?({ rootStore }: { rootStore: RootStore }): void;

  init?(): void;
  JSONView?: Record<string, { name: string; render: React.FC }>;
}

export type StoreClass<T extends Store> = new (...args: any[]) => T;

export interface BaseState {
  value: number;
  setValue(value: any): any;
}

export class StringState<T extends string> {
  value: T = null;
  constructor(args: Partial<StringState<T>> = {}) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }
  setValue(value: T) {
    this.value = value;
  }
}

export class BooleanState {
  value: boolean = false;
  constructor(args: Partial<BooleanState> = {}) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }
  setValue(value: boolean) {
    this.value = value;
  }
}

export class NumberState {
  value: number = 0;
  constructor(args: Partial<NumberState> = {}) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }
  setValue(value: number) {
    this.value = value;
  }
}

export class ValueState<T> {
  _value: T = null;
  constructor(args: Partial<ValueState<T>> = {}) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get value() {
    return this.getValue ? this.getValue(this._value) : this._value;
  }
  set value(value) {
    this._value = value;
  }

  getValue: (value: T) => T;

  setValue(value: T) {
    this._value = value;
  }
}

export interface Events {
  data: (data: any) => void;
  error: (error: any) => void;
  update: () => void;
  wait: () => void;
}

// export class AsyncValue<T> {
//   _value: T = null;
//   event = new EventEmitter();
//   constructor(args: Partial<ValueState<T>> = {}) {
//     Object.assign(this, args);
//     makeAutoObservable(this);
//   }

//   get value() {
//     return this.getValue ? this.getValue(this._value) : this._value;
//   }
//   set value(value) {
//     this._value = value;
//   }

//   on<E extends keyof Events>(event: E, listener: Events[E]) {
//     this.event.on(event, listener);
//     return this;
//   }

//   emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
//     this.event.emit(event, ...args);
//   }

//   async wait(): Promise<Awaited<T>> {
//     return new Promise<Awaited<T>>((res, rej) => {
//       if (this.value) {
//         if (Array.isArray(this.value)) {
//           if (this.value.length > 0) {
//             //@ts-ignore
//             res(this._value);
//           }
//         } else {
//           //@ts-ignore
//           res(this._value);
//         }
//       }
//       this.event.emit('wait');
//       this.event.once('data', res);
//       this.event.on('error', rej);
//     });
//   }

//   getValue: (value: T) => T;

//   setValue(value: T) {
//     this._value = value;
//     this.event.emit('update');
//   }
// }
