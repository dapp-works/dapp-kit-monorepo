import React from "react";
import { makeAutoObservable } from "mobx";

import { rootStore } from "../../store";
import { Store } from "../../store/standard/base";
import Provider from "./Provider";


export class DialogStore implements Store {
  sid = 'DialogStore';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
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
    this.content = '';
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
