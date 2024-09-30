import React, { Dispatch, SetStateAction } from "react";
import { ButtonProps, TabsProps } from "@nextui-org/react";
import { UiSchema } from "@rjsf/utils";
import { JSONSchemaFormState } from "../../store/standard/JSONSchemaState";
import { GridLayout } from "./Layouts/gridLayout";
import { ListLayout } from "./Layouts/listLayout";
import { SimpleLayout } from "./Layouts/simpleLayout";
import { TabLayout } from "./Layouts/tabLayout";
import { ThemeType } from "../../themes";

const COMPONENTS = {
  GridLayout,
  TabLayout,
  ListLayout,
  SimpleLayout,
};

export type FormDataType = {
  [key: string]: {
    [key: string]: string | number | boolean | Record<string, string | number | boolean>;
  };
};

export type FormConfigType<T extends FormDataType> = {
  [F in keyof T]?: {
    [X in keyof T[F]]?: {
      title?: string;
      required?: boolean;
      requiredErrMsg?: string;
      validate?: (v: any) => string | void;
      selectOptions?: { label: string; value: string }[];
      isMultipleSelect?: boolean;
    } & UiSchema;
  };
};

type SubmitButtonProps<T extends FormDataType> = ButtonProps & { onAfterSubmit?: (formKey: FormKey<T>, data: FormDataOfKey<T>, setLoading: Dispatch<SetStateAction<boolean>>) => void };

type CombFormsCustomRender<T extends FormDataType> = (formStates: { [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema> }) => React.ReactNode;
type CombFormsCustomRenderMap<T extends FormDataType> = {
  Top?: CombFormsCustomRender<T>;
  SubmitButtonBefore?: CombFormsCustomRender<T>;
  SubmitButtonAfter?: CombFormsCustomRender<T>;
}

type SubformCustomRender<T extends FormDataType> = (formKey: FormKey<T>, formState: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => React.ReactNode;
type SubformCustomRenderMap<T extends FormDataType> = {
  Top?: SubformCustomRender<T>;
  SubmitButtonBefore?: SubformCustomRender<T>;
  SubmitButtonAfter?: SubformCustomRender<T>;
}

type SubformLayoutBaseConfig<T extends FormDataType, F extends keyof T> = {
  title?: string;
  titleBoxCss?: string;
  fieldLayout?: Array<keyof NonNullable<T[F]>> | Array<Array<keyof NonNullable<T[F]>> | keyof NonNullable<T[F]>>;
  submitButtonProps?: SubmitButtonProps<T>;
  customRender?: SubformCustomRenderMap<T>;
};

interface LayoutConfigMap<T extends FormDataType> {
  GridLayout: {
    $type: 'GridLayout';
    $gridColumn?: number;
    $combFormsCustomRender?: CombFormsCustomRenderMap<T>;
  } & {
    [F in keyof T]?: SubformLayoutBaseConfig<T, F> & {
      colSpan?: number;
      cardCss?: string;
    };
  };
  TabLayout: {
    $type: 'TabLayout';
    $tabsProps?: TabsProps;
    $combFormsCustomRender?: CombFormsCustomRenderMap<T>;
  } & {
    [F in keyof T]?: SubformLayoutBaseConfig<T, F>
  };
  ListLayout: {
    $type: 'ListLayout';
    $combFormsCustomRender?: CombFormsCustomRenderMap<T>;
  } & {
    [F in keyof T]?: SubformLayoutBaseConfig<T, F>
  };
  SimpleLayout: {
    $type: 'SimpleLayout';
    $combFormsCustomRender?: CombFormsCustomRenderMap<T>;
  } & {
    [F in keyof T]?: SubformLayoutBaseConfig<T, F>
  };
}

export type LayoutType = keyof typeof COMPONENTS;
export type LayoutConfigType<T extends FormDataType, L extends LayoutType> = LayoutConfigMap<T>[L];

export type FormKey<T extends FormDataType> = keyof T;
export type FormDataOfKey<T extends FormDataType> = T[FormKey<T>];

export type JSONFormProps<T extends FormDataType> = {
  className?: string;
  theme?: ThemeType;
  formData: T;
  formConfig?: FormConfigType<T>;
  layoutConfig?: LayoutConfigType<T, LayoutType>;
  onBatchSubmit?: (data: T, setLoading: Dispatch<SetStateAction<boolean>>) => void;
  onSet?: (v: FormDataOfKey<T>, form: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => FormDataOfKey<T>;
  onChange?: (data: Partial<T>) => void;
  onReady?: (formStates: { [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema> }) => void;
  batchSubmitButtonProps?: ButtonProps & { onBatchSubmit?: (formData: T, setLoading: Dispatch<SetStateAction<boolean>>) => void };
};

export const JSONForm = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const type = props.layoutConfig?.$type || 'SimpleLayout';
  const Comp = COMPONENTS[type];
  return (
    <div className={props.className}>
      <Comp {...props} />
    </div>
  );
};