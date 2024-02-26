import { Store } from "../../store/standard/base";
import { makeAutoObservable } from "mobx";
import Provider from "./Provider";
import React from "react";

export class ConfirmStore implements Store {
  sid = 'ConfirmStore';
  provider = () => <Provider />;

  isOpen: boolean = false;
  title?: string = '';
  description?: string = '';
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
  className: string = '';
  cancelText?: string = 'Cancel';
  okText?: string = 'Apply';

  constructor() {
    makeAutoObservable(this);
  }

  toggleOpen(val: boolean) {
    this.isOpen = val;
  }

  onOk() { }

  onCancel() { }

  show(confirmProps: Partial<ConfirmStore>) {
    Object.assign(this, confirmProps);
    this.toggleOpen(true);
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.description = '';
  }
}
