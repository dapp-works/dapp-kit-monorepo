import RootStore from '../../store/root';
import { Store } from '../../store/standard/base';
import Provider from './Provider';
import { makeAutoObservable } from 'mobx';
import React from 'react'

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
    // @ts-ignore 
    this.content = undefined;
  }
}

export async function showDialog(v: Partial<DialogStore>) {
  const modal = RootStore.Get(DialogStore);
  modal.setData({
    ...v,
    isOpen: true,
  });
}

export async function closeDialog() {
  const modal = RootStore.Get(DialogStore);
  modal.close();
}
