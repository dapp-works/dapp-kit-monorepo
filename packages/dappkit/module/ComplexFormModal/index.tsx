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

export class FormPlugin<T extends FormDataType> implements Store {
  sid = 'FormPlugin';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  formData?: T;
  formConfig?: FormConfigType<T>;
  layoutConfig?: LayoutConfigType<T, LayoutType>;
  className = '';
  classNames?: SlotsToClasses<ModalSlots>;
  modalSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
  scrollBehavior?: 'normal' | 'inside' | 'outside' = 'normal';
  isDismissable = true;
  event = new EventEmitter();
  onBatchSubmit?: (data: T, setLoading?: Dispatch<SetStateAction<boolean>>) => void;
  onSet?: (v: FormDataOfKey<T>, form: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => FormDataOfKey<T>;
  onChange?: (data: Partial<T>) => void;
  onReady?: (formStates: { [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema> }) => void;
  batchSubmitButtonProps?: ButtonProps & { onBatchSubmit?: (formData: T, setLoading: Dispatch<SetStateAction<boolean>>) => void };

  constructor(args?: Partial<FormPlugin<T>>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  setData(v: Partial<FormPlugin<T>>) {
    Object.assign(this, v);
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.formData = undefined;
    this.formConfig = undefined;
    this.layoutConfig = undefined;
    this.className = '';
    this.classNames = undefined;
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

export async function getComplexFormData<T extends FormDataType>(v: Partial<FormPlugin<T>>) {
  return new Promise<T>((resolve, reject) => {
    const complexFormModal = RootStore.Get(FormPlugin);
    // @ts-ignore
    complexFormModal.setData({
      ...v,
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
