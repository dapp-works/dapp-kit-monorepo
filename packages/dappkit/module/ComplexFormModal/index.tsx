import { Store } from "../../store/standard/base";
import Provider from "./Provider";
import { FormConfigType, FormDataOfKey, FormDataType, LayoutConfigType, LayoutType } from "../../components/JSONForm";
import EventEmitter from "events";
import { JSONSchemaFormState } from "../../store/standard/JSONSchemaState";
import { UiSchema } from "@rjsf/utils";
import { makeAutoObservable } from "mobx";
import { RootStore } from "../../store";
import React, { Dispatch, SetStateAction } from "react";
import { ButtonProps, SlotsToClasses, ModalSlots } from "@nextui-org/react";
import { getStyle, ThemeType } from "../../themes";

export class ComplexFormModalStore<T extends FormDataType> implements Store {
  sid = 'ComplexFormModalStore';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  formData?: T;
  formConfig?: FormConfigType<T>;
  layoutConfig?: LayoutConfigType<T, LayoutType>;
  className = '';
  classNames?: SlotsToClasses<ModalSlots>;
  theme: ThemeType = "default";
  modalSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
  scrollBehavior?: 'normal' | 'inside' | 'outside' = 'normal';
  isDismissable = true;
  event = new EventEmitter();
  onBatchSubmit?: (data: T, setLoading?: Dispatch<SetStateAction<boolean>>) => void;
  onSet?: (v: FormDataOfKey<T>, form: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => FormDataOfKey<T>;
  onChange?: (data: Partial<T>) => void;
  onReady?: (formStates: { [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema> }) => void;
  batchSubmitButtonProps?: ButtonProps & { onBatchSubmit?: (formData: T, setLoading: Dispatch<SetStateAction<boolean>>) => void };

  constructor(args?: Partial<ComplexFormModalStore<T>>) {
    const modalStyle = getStyle(args?.theme || 'default', 'Modal');
    const classNames = {
      ...modalStyle.classNames,
      ...args?.classNames
    }
    Object.assign(this, args, { classNames });
    makeAutoObservable(this);
  }

  setData(v: Partial<ComplexFormModalStore<T>>) {
    Object.assign(this, v);
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.formData = undefined;
    this.formConfig = undefined;
    this.layoutConfig = undefined;
    this.modalSize = 'md';
    this.scrollBehavior = 'normal';
    this.isDismissable = true;
    this.onBatchSubmit = undefined;
    this.onSet = undefined;
    this.onChange = undefined;
    this.onReady = undefined;
    this.event.removeAllListeners();
  }
}

export async function getComplexFormData<T extends FormDataType>(v: Partial<ComplexFormModalStore<T>>) {
  return new Promise<T>((resolve, reject) => {
    const modalStyle = getStyle(v?.theme || 'default', 'Modal');
    const classNames = {
      ...modalStyle.classNames,
      ...v?.classNames
    }
    const complexFormModal = RootStore.Get(ComplexFormModalStore);
    // @ts-ignore
    complexFormModal.setData({
      ...v,
      classNames,
      isOpen: true,
    });
    complexFormModal.event.on('batchSubmit', (formData: T) => {
      if (complexFormModal.onBatchSubmit) {
        complexFormModal.onBatchSubmit(formData);
      } else {
        complexFormModal.close();
        resolve(formData);
      }
    });
    complexFormModal.event.on('abort', () => {
      complexFormModal.close();
      reject('abort');
    });
  });
}
