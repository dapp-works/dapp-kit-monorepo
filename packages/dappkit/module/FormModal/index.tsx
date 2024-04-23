import EventEmitter from "events";
import React from "react";
import { UiSchema } from "@rjsf/utils";
import { makeAutoObservable } from "mobx";
import { Store } from "../../store/standard/base";
import {
  JSONSchemaFormState,
  JSONValue,
} from "../../store/standard/JSONSchemaState";
import Provider from "./Provider";
import { SelectWidget } from "../../components/JSONFormWidgets/SelectWidget";
import { InputWidget } from "../../components/JSONFormWidgets/InputWidget";
import { CheckboxWidget } from "../../components/JSONFormWidgets/CheckboxWidget";
import { RootStore } from "../../store";
import { SlotsToClasses, ModalSlots } from "@nextui-org/react";

export class FormModalStore<T = { [key: string]: any }> implements Store {
  sid = 'FormModalStore';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  form: JSONSchemaFormState<T> = null;
  className: string = '';
  classNames?: SlotsToClasses<ModalSlots>;
  modalSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' = 'md';
  scrollBehavior?: 'normal' | 'inside' | 'outside' = 'normal';
  closeOnOverlayClick = false;
  event = new EventEmitter();
  onAfterSubmit?: (data: T) => void;

  constructor(args?: Partial<FormModalStore>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  setData(v: Partial<FormModalStore>) {
    Object.assign(this, v);
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.form = null;
    this.className = '';
    this.classNames = undefined;
    this.modalSize = 'md';
    this.scrollBehavior = 'normal';
    this.closeOnOverlayClick = false;
    this.onAfterSubmit = undefined;
    this.event.removeAllListeners();
  }
}

export async function getFormData<T = { [key: string]: any }>(v: Partial<FormModalStore>) {
  return new Promise<T>((resolve, reject) => {
    const formModal = RootStore.Get(FormModalStore);
    formModal.setData({
      ...v,
      isOpen: true,
    });
    formModal.event.on('afterSubmit', (formData: T) => {
      if (formModal.onAfterSubmit) {
        formModal.onAfterSubmit(formData);
      } else {
        formModal.close();
        resolve(formData);
      }
    });
    formModal.event.on('abort', () => {
      formModal.close();
      reject('abort');
    });
  });
}

export function getFormState<T>(
  {
    data,
    metadata = {},
    onSet = (v: T, form) => v,
    onSubmit,
  }: {
    data: T;
    metadata?: { [key: string]: any } & Partial<JSONSchemaFormState<any>>;
    onSet?: (v: T, form: JSONSchemaFormState<T, UiSchema>) => T;
    onSubmit?: (data: T) => void;
  }
): JSONSchemaFormState<T, UiSchema> {
  const value = {};
  const required = [];
  const props = Object.entries(data).reduce((p, c) => {
    const [k, v] = c;
    const type = typeof v;
    p[k] = {
      type
    };
    if (!metadata[k]) {
      metadata[k] = {};
    }
    if (type === 'string' || type === 'number') {
      if (metadata[k]?.selectOptions) {
        metadata[k]['ui:widget'] = SelectWidget;
        p[k].selectOptions = metadata[k].selectOptions;
      } else {
        if (!metadata[k]['ui:widget']) {
          metadata[k]['ui:widget'] = InputWidget;
          metadata[k]['ui:options'] = {
            // labelPlacement: 'outside-left',
            size: 'sm',
          };
          if (type === 'number') {
            p[k].inputType = 'number';
          }
        }
      }
    }
    if (type === 'boolean') {
      metadata[k]['ui:widget'] = CheckboxWidget;
      metadata[k]['ui:options'] = {
        size: 'sm',
      }
    }
    if (metadata[k]?.inputType) {
      p[k].inputType = metadata[k].inputType;
      delete metadata[k].inputType;
    }
    if (metadata[k]?.title) {
      p[k].title = metadata[k].title || v;
      delete metadata[k].title;
    }
    if (metadata[k]?.description) {
      p[k].description = metadata[k].description;
      delete metadata[k].description;
    }
    // if (metadata[k]?.enum) {
    //   p[k].enum = metadata[k].enum;
    //   delete metadata[k].enum;
    // }
    // if (metadata[k]?.enumNames) {
    //   p[k].enumNames = metadata[k].enumNames;
    //   delete metadata[k].enumNames;
    // }
    if (metadata[k]?.required) {
      required.push(k);
      delete metadata[k].required;
    }
    value[k] = v;
    return p;
  }, {});
  const schema = {
    type: 'object',
    properties: props,
    required,
  };
  const form = new JSONSchemaFormState({
    //@ts-ignore
    schema,
    uiSchema: {
      'ui:submitButtonOptions': {
        norender: false,
        submitText: 'Submit',
      },
      ...metadata,
    },
    afterSubmit(e) {
      if (onSubmit) {
        onSubmit(e.formData as T);
      } else {
        const formModal = RootStore.Get(FormModalStore);
        formModal.event.emit('afterSubmit', e.formData);
      }
    },
    value: new JSONValue({
      default: value,
      //@ts-ignore
      onSet: (v: T) => onSet(v, form),
    }),
  });
  return form;
}

export async function getSimpleFormData<T>(
  data: T,
  metadata: { [key: string]: any } & Partial<JSONSchemaFormState<any>> = {},
  config: Partial<FormModalStore>,
  onSet = (v: T, form: JSONSchemaFormState<T, UiSchema>) => {
    return v;
  },
) {
  const form = getFormState({ data, metadata, onSet });
  return getFormData<T>({
    ...config,
    //@ts-ignore
    form
  });
}
