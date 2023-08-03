import { Store } from '@/dappkit/store/standard/base';
import Provider from './Provider';
import { FormConfigType, FormDataOfKey, FormDataType, FormKey, LayoutConfigType, LayoutType } from '@/dappkit/components/JSONForm';
import EventEmitter from 'events';
import { JSONSchemaFormState } from '@/dappkit/store/standard/JSONSchemaState';
import { UiSchema } from '@rjsf/utils';
import { makeAutoObservable } from 'mobx';
import { rootStore } from '@/store';

export class ComplexFormModalStore<T extends FormDataType> implements Store {
  sid = 'ComplexFormModalStore';
  provider = () => <Provider />;

  isOpen = false;
  title = '';
  formData?: T;
  formConfig?: FormConfigType<T>;
  layoutConfig?: LayoutConfigType<T, LayoutType>;
  isAutomaticallyClose = true;
  className = '';
  uiSize?: 'small' | 'default' = 'default';
  event = new EventEmitter();
  onBatchSubmit?: (data: T) => void;
  onSubmit?: (formKey: FormKey<T>, data: FormDataOfKey<T>) => void;
  onSet?: (v: FormDataOfKey<T>, form: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => FormDataOfKey<T>;

  constructor(args?: Partial<ComplexFormModalStore<T>>) {
    Object.assign(this, args);
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
    this.isAutomaticallyClose = true;
    this.className = '';
    this.uiSize = 'default';
    this.onBatchSubmit = undefined;
    this.onSubmit = undefined;
    this.onSet = undefined;
    this.event.removeAllListeners();
  }
}

export async function getComplexFormData<T extends FormDataType>(v: Partial<ComplexFormModalStore<T>>) {
  return new Promise<T>((resolve, reject) => {
    const complexFormModal = rootStore.get(ComplexFormModalStore);
    // @ts-ignore
    complexFormModal.setData({
      ...v,
      isOpen: true,
    });
    complexFormModal.event.on('batchSubmit', (formData: T) => {
      if (complexFormModal.isAutomaticallyClose) {
        complexFormModal.close();
        resolve(formData);
      } else {
        complexFormModal.onBatchSubmit?.(formData);
      }
    });
    complexFormModal.event.on('abort', () => {
      complexFormModal.close();
      reject('abort');
    });
  });
}
