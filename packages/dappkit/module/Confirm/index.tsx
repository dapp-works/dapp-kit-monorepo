import { Store } from "../../store/standard/base";
import { makeAutoObservable } from "mobx";
import Provider from "./Provider";
import React from "react";
import { ModalSlots, SlotsToClasses } from "@nextui-org/react";
import { getStyle, ThemeType } from "../../themes";

export class ConfirmStore implements Store {
  sid = 'ConfirmStore';
  provider = () => <Provider />;

  isOpen: boolean = false;
  title?: string = '';
  description?: string = '';
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
  className: string = '';
  classNames?: SlotsToClasses<ModalSlots>;
  theme: ThemeType = "default";
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
    const modalStyle = getStyle(confirmProps?.theme || 'default', 'Modal');
    const classNames = {
      ...modalStyle.classNames,
      ...confirmProps?.classNames
    }
    Object.assign(this, confirmProps, { classNames });

    this.toggleOpen(true);
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.description = '';
    this.size = 'md';
    this.cancelText = 'Cancel';
    this.okText = 'Apply';
  }
}
