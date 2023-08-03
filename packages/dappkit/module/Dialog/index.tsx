import { Store } from '@/dappkit/store/standard/base';
import Provider from './Provider';
import { makeAutoObservable } from 'mobx';
import { rootStore } from '@/store';

export class DialogStore implements Store {
  sid = 'DialogStore';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  description = '';
  className: string = '';
  content: JSX.Element | string = '';

  constructor(args?: Partial<DialogStore>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  setData(v: Partial<DialogStore>) {
    Object.assign(this, v);
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.content = undefined;
  }
}

export async function showDialog(v: Partial<DialogStore>) {
  const modal = rootStore.get(DialogStore);
  modal.setData({
    ...v,
    isOpen: true,
  });
}

export async function closeDialog() {
  const modal = rootStore.get(DialogStore);
  modal.close();
}
