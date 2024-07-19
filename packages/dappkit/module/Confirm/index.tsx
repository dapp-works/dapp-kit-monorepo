import { Store } from "../../store/standard/base";
import { makeAutoObservable } from "mobx";
import Provider from "./Provider";
import React from "react";
import { ModalSlots, SlotsToClasses } from "@nextui-org/react";

export class ConfirmStore implements Store {
  sid = 'ConfirmStore';
  provider = () => <Provider />;

  isOpen: boolean = false;
  title?: string = '';
  description?: string = '';
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
  className: string = '';
  classNames?: SlotsToClasses<ModalSlots> = {
    base: 'dark:bg-[#09090B] border dark:border-[#2c2c2c] rounded-lg shadow-md',
  };
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
    this.size = 'md';
    this.cancelText = 'Cancel';
    this.okText = 'Apply';
    this.className = '';
    this.classNames = {
      base: 'dark:bg-[#09090B] border dark:border-[#2c2c2c] rounded-lg shadow-md',
    };
  }
}
