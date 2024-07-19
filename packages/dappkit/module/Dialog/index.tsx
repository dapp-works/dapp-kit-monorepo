import React from "react";
import { makeAutoObservable } from "mobx";
import { rootStore } from "../../store";
import { Store } from "../../store/standard/base";
import Provider from "./Provider";
import { ModalSlots, SlotsToClasses } from "@nextui-org/react";

export class DialogStore implements Store {
  sid = "DialogStore";
  provider = () => <Provider />;

  isOpen = false;
  title = "";
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "xs" | "3xl" | "4xl" | "5xl" = "md";
  className: string = "";
  classNames?: SlotsToClasses<ModalSlots> = {
    base: 'dark:bg-[#09090B] border dark:border-[#2c2c2c] rounded-lg shadow-md',
  };
  content: React.ReactNode | ((props: any) => React.ReactNode) = "";
  isDismissable = true;

  constructor(args?: Partial<DialogStore>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  setData(v: Partial<DialogStore>) {
    Object.assign(this, v);
  }

  close() {
    this.isOpen = false;
    this.title = "";
    this.content = "";
    this.size = "md";
    this.className = "";
    this.classNames = {
      base: 'dark:bg-[#09090B] border dark:border-[#2c2c2c] rounded-lg shadow-md',
    };
    this.isDismissable = true;
  }

  static show(v: Partial<DialogStore>) {
    const modal = rootStore.get(DialogStore);
    modal.setData({
      ...v,
      isOpen: true,
    });
  }

  static close() {
    const modal = rootStore.get(DialogStore);
    modal.close();
  }
}
