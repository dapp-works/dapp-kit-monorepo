import { makeAutoObservable } from 'mobx';

export class StorageState<T> {
  key: string;
  value: T | any = null;
  default: T | any = null;
  constructor(args: Partial<StorageState<T>>) {
    Object.assign(this, args);
    makeAutoObservable(this);
    this.load();
  }

  static safeParse(val: any) {
    try {
      return JSON.parse(val);
    } catch (error) {
      return val;
    }
  }

  load() {
    try {
      const value = global?.localStorage?.getItem(this.key);
      this.value = StorageState.safeParse(value);
      if (this.value == null) {
        this.value = this.default;
      }
      return this.value;
    } catch (error) {
      return null
    }
  }

  save(value?: T) {
    try {
      if (value !== null || value !== undefined) {
        this.value = value;
      }
      global?.localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      return null
    }
  }

  setValue(value?: T) {
    this.save(value);
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      return null
    }
  }
}
