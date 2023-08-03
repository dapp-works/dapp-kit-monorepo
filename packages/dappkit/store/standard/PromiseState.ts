import { makeAutoObservable } from 'mobx';
import { BaseState, BooleanState, NumberState } from './base';
import { EventEmitter } from 'events';
import { rootStore } from '@/store';
import { ToastPlugin } from '@/dappkit/module/Toast/Toast';
import RootStore from '../root';

export interface Events {
  data: (data: any) => void;
  error: (error: any) => void;
  select: (index: number) => void;
  update: () => void;
  finally: () => void;
  wait: () => void;
}

export class PromiseState<T extends (...args: any[]) => Promise<any>, U = ReturnType<T>> {
  sid = 'PromiseState';
  key?: string;
  loading = new BooleanState();
  value?: Awaited<U> = null;
  defaultValue: any = null;
  function: T;

  autoAlert = true;
  context: any = undefined;

  successMsg: string = '';
  errMsg: string = '';

  loadingLock = true;

  // event plugin
  event = new EventEmitter();

  on<E extends keyof Events>(event: E, listener: Events[E]) {
    this.event.on(event, listener);
    return this;
  }

  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
    this.event.emit(event, ...args);
  }

  // init plugin
  init: () => Promise<void>;

  // list selector plugin
  currentIndex: BaseState = new NumberState({ value: 0 });
  get current() {
    if (Array.isArray(this.value) && this.value.length > 0 && !this.value[this.currentIndex.value]) {
      this.currentIndex.setValue(0);
    }
    return this.value[this.currentIndex.value];
  }
  _onSelect(index: number) {
    this.currentIndex.setValue(index);
    this.event.emit('select', index);
    this.event.emit('update');
  }

  onSelect(index: number) {
    this._onSelect(index);
  }

  //@ts-ignore
  async waitItem(): Promise<Awaited<U>[0]> {
    await this.wait();
    return this.current;
  }

  // wait hook plugin
  async wait({ call = false } = {}): Promise<Awaited<U>> {
    return new Promise<Awaited<U>>((res, rej) => {
      if (this.value) {
        if (Array.isArray(this.value)) {
          if (this.value.length > 0) {
            res(this.value);
          }
        } else {
          res(this.value);
        }
      }

      //@ts-ignore
      if (call && !this.loading.value) this.call();
      this.event.emit('wait');
      this.event.once('data', res);
      this.event.on('error', rej);
    });
  }

  // devtool plugin
  debug: { name: string; input: Record<string, any> };

  constructor(args: Partial<PromiseState<T, U>> = {}) {
    Object.assign(this, args);
    if (this.defaultValue) {
      this.value = this.defaultValue;
    }
    if (this.key) {
      RootStore.init().add(this, { sid: this.key });
    } else {
      makeAutoObservable(this);
    }
  }

  setValue(val) {
    this.value = val;
    this.event.emit('data', val);
    this.event.emit('update');
  }

  async call(...args: Parameters<T>): Promise<Awaited<U>> {
    const toast = rootStore.get(ToastPlugin);
    try {
      if (this.loadingLock && this.loading.value == true) return;
      this.loading.setValue(true);
      const res = await this.function.apply(this.context, args);
      this.setValue(res);
      if (this.autoAlert && this.successMsg && res) {
        toast.success(this.successMsg);
      }
      return res;
    } catch (error) {
      if (this.autoAlert) {
        const message = error.message;
        if (message.includes('UNAUTHORIZED')) {
          // logout
        } else {
          this.errMsg = message;
          toast.error(message);
        }
      } else {
        this.event.emit('error', error);
        throw error;
      }
    } finally {
      this.event.emit('finally');
      this.loading.setValue(false);
    }
  }
}
