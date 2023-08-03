import { Store } from '@/dappkit/store/standard/base';
import Provider from './Provider';
import EventEmitter from 'events';
import { makeAutoObservable } from 'mobx';
import { JSONSchemaFormState, JSONValue } from '@/dappkit/store/standard/JSONSchemaState';
import { rootStore } from '@/store';
import { UiSchema } from '@rjsf/utils';

export class FormModalStore<T = { [key: string]: any }> implements Store {
  sid = 'FormModalStore';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  form: JSONSchemaFormState<T> = null;
  isAutomaticallyClose = true;
  className: string = '';
  uiSize?: 'small' | 'default' = 'default';
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
    this.isAutomaticallyClose = true;
    this.className = '';
    this.uiSize = 'default';
    this.closeOnOverlayClick = true;
    this.onAfterSubmit = undefined;
    this.event.removeAllListeners();
  }
}

export async function getFormData<T = { [key: string]: any }>(v: Partial<FormModalStore>) {
  return new Promise<T>((resolve, reject) => {
    const formModal = rootStore.get(FormModalStore);
    formModal.setData({
      ...v,
      isOpen: true,
    });
    formModal.event.on('afterSubmit', (formData: T) => {
      if (formModal.isAutomaticallyClose) {
        formModal.close();
        resolve(formData);
      } else {
        formModal.onAfterSubmit?.(formData);
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
    uiSize
  }: {
    data: T;
    metadata?: { [key: string]: any } & Partial<JSONSchemaFormState<any>>;
    onSet?: (v: T, form: JSONSchemaFormState<T, UiSchema>) => T;
    onSubmit?: (data: T) => void;
    uiSize?: 'small' | 'default';
  }
): JSONSchemaFormState<T, UiSchema> {
  const value = {};
  const required = [];
  const props = Object.entries(data).reduce((p, c) => {
    const [k, v] = c;
    p[k] = {
      type: typeof v,
    };
    if (metadata[k]?.title) {
      p[k].title = metadata[k]?.title || v;
      delete metadata[k].title;
    }
    if (metadata[k]?.enum) {
      p[k].enum = metadata[k].enum;
      delete metadata[k].enum;
    }
    if (metadata[k]?.enumNames) {
      p[k].enumNames = metadata[k].enumNames;
      delete metadata[k].enumNames;
    }
    if (metadata[k]?.required) {
      required.push(k);
      delete metadata[k].required;
    }
    if (uiSize) {
      if (!metadata[k]) { metadata[k] = {}; }
      metadata[k]['ui:size'] = uiSize;
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
        const formModal = rootStore.get(FormModalStore);
        formModal.event.emit('afterSubmit', e.formData);
      }
    },
    value: new JSONValue({
      default: value,
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
  const form = getFormState({ data, metadata, onSet, uiSize: config.uiSize });
  return getFormData<T>({
    ...config,
    form
  });
}
