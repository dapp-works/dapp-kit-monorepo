import { createRef, LegacyRef, Ref } from "react";
import { ButtonProps } from "@nextui-org/react";
import Form, { IChangeEvent } from "@rjsf/core";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import { action, computed, makeObservable, observable, toJS } from "mobx";

import { helper } from "../../lib/helper";
import { PaginationState } from "./PaginationState";

export class JSONSchemaFormState<T, U = UiSchema> {
  formRef: LegacyRef<Form<any, RJSFSchema, any>> &
    Ref<Form<any, RJSFSchema, any>>;
  value: JSONValue<T> = new JSONValue();
  schema: RJSFSchema;
  uiSchema: U;
  reactive: boolean = true;
  readonly = false;
  liveValidate = false;
  validator = validator;

  get formData() {
    return this.value.get();
  }
  set formData(value: T) {
    this.value.set(value);
  }
  get dynamicData() {
    return this.getDymaicData();
  }
  getDymaicData = () => {
    return { ready: true };
  };
  onChange = (e: IChangeEvent<T>, id: string) => {
    this.value.set(e.formData);
    if (this.afterChange) {
      this.afterChange(e, id);
    }
  };
  onSubmit = (e: IChangeEvent<T>) => {
    if (this.afterSubmit) {
      this.afterSubmit(e);
    }
  };
  afterSubmit: (e: IChangeEvent<T>) => void;
  afterChange: (e: IChangeEvent<T>, id: string) => void;
  reset({ force = false } = {}) {
    if (force) {
      this.value.value = this.value.default;
    } else {
      this.value.reset();
    }
    return this;
  }
  customValidate = (formData: T, errors: any) => errors;

  constructor(args: Partial<JSONSchemaFormState<T, U>> = {}) {
    const formRef = createRef();
    Object.assign(this, args, { formRef });
    if (this.reactive) {
      //@ts-ignore
      makeObservable(this, {
        formData: computed,
      });
    }
  }
}

export abstract class JSONSchemaValue<T> {
  value?: T = null as T;
  default?: T = null as T;
  constructor(args: Partial<JSONSchemaValue<T>> = {}) {
    if (!args.value && args.default) {
      args.value = args.default;
    }
    Object.assign(this, args);
    makeObservable(this, {
      value: observable,
      set: action,
    });
  }
  set(value: Partial<T>, { onSet = true } = {}) {
    value = this.onSet(value);
    const newVal = helper.deepMerge(this.value, value);
    this.value = toJS(newVal);
    return this.value;
  }
  onSet(value: Partial<T>) {
    return value;
  }
  get() {
    return this.getFormat(this.value);
  }
  getFormat(value: T) {
    return value;
  }
  reset() {
    this.set(this.default);
  }
}

export class JSONValue<T> extends JSONSchemaValue<T> {
  constructor(args: Partial<JSONValue<T>> = {}) {
    super(args);
  }
}

export class JSONModalValue extends JSONSchemaValue<{
  show: boolean;
  title: string;
  autoReset: boolean;
}> {
  constructor(args: Partial<JSONModalValue> = {}) {
    super(args);
  }
}

export type ActionButtonType = {
  props: ButtonProps;
  text: string;
};
export type Column<T = any> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => any;
  actions?: (item: T) => ActionButtonType[];
};
export type ExtendedTable<U> = {
  key: string;
  columns: Column<U>[];
};
export class JSONSchemaTableState<T = { [x: string]: any }> {
  columns: Column<T>[] = [];
  dataSource: T[] = [];
  rowKey: string = "";
  extendedTables?: ExtendedTable<any>[] = [];
  pagination?: PaginationState = new PaginationState({
    page: 1,
    limit: 8,
  });
  isServerPaging?: boolean = false;
  className?: string = "";
  rowOnClick?: (item: T) => void;

  set(v: Partial<JSONSchemaTableState<T>>) {
    Object.assign(this, v);
  }

  constructor(args: Partial<JSONSchemaTableState<T>> = {}) {
    Object.assign(this, args);
    makeObservable(this, {
      columns: observable,
      dataSource: observable,
      pagination: observable,
      set: action,
    });
  }
}
