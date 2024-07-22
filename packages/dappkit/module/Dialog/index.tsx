import React from "react";
import { makeAutoObservable } from "mobx";
import { rootStore } from "../../store";
import { Store } from "../../store/standard/base";
import Provider from "./Provider";
import { ModalSlots, SlotsToClasses } from "@nextui-org/react";
import { getStyle, ThemeType } from "../../themes";

export class DialogStore implements Store {
  sid = "DialogStore";
  provider = () => <Provider />;

  isOpen = false;
  placement: "center" | "auto" | "top" | "bottom" | "top-center" | "bottom-center";
  title = "";
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "xs" | "3xl" | "4xl" | "5xl" = "md";
  className: string = "";
  classNames?: SlotsToClasses<ModalSlots>;
  theme: ThemeType = "default";
  content: React.ReactNode | ((props: any) => React.ReactNode) = "";
  isDismissable = true;

  constructor(args?: Partial<DialogStore>) {
    const modalStyle = getStyle(args?.theme || 'default', 'Modal');
    const classNames = {
      ...modalStyle.classNames,
      ...args?.classNames
    }
    Object.assign(this, args, { classNames });
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
    this.isDismissable = true;
  }

  static show(v: Partial<DialogStore>) {
    const modalStyle = getStyle(v?.theme || 'default', 'Modal');
    const classNames = {
      ...modalStyle.classNames,
      ...v?.classNames
    }
    rootStore.get(DialogStore).setData({
      ...v,
      classNames,
      isOpen: true,

    });
  }

  static close() {
    rootStore.get(DialogStore).close();
  }
}
