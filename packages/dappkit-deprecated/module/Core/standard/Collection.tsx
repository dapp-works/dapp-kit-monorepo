import { observer } from 'mobx-react-lite';
import RootStore from '../../../store/root';
import { Store } from '../../../store/standard/base';

export class Collection<T = any> implements Store {
  sid = 'Collection';
  autoObservable = true;

  key: string;
  data: {
    [key: string]: T;
  } = {};
  constructor(args: Partial<Collection<T>>) {
    Object.assign(this, args);
    if (!this.key) {
      this.key = Object.keys(this.data)[0];
    }
  }
  get current(): T {
    return this.data[this.key];
  }

  setKey(key: string) {
    this.key = key;
  }
  setValue(key: string, value: T) {
    this.data[key] = value;
  }
}
