import React, { Dispatch, SetStateAction } from "react";
import { ButtonProps, TabsProps } from "@nextui-org/react";
import { UiSchema } from "@rjsf/utils";
import { JSONSchemaFormState } from "../../store/standard/JSONSchemaState";
import { GridLayout } from "./Layouts/gridLayout";
import { ListLayout } from "./Layouts/listLayout";
import { SimpleLayout } from "./Layouts/simpleLayout";
import { TabLayout } from "./Layouts/tabLayout";
import { ThemeType } from "../../themes";

export type LayoutType = 'TabLayout' | 'GridLayout' | 'ListLayout' | 'SimpleLayout';

export type FieldLayoutType<T, F extends keyof T> = Array<keyof NonNullable<T[F]>> | Array<Array<keyof NonNullable<T[F]>> | keyof NonNullable<T[F]>>;

type SubmitButtonProps<T> = ButtonProps & { onAfterSubmit?: (formKey: FormKey<T>, data: FormDataOfKey<T>, setLoading: Dispatch<SetStateAction<boolean>>) => void };

type CombFormsCustomRender<T> = (formStates: { [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema> }) => React.ReactNode;

type CombFormsCustomRenderMap<T> = {
  Top?: CombFormsCustomRender<T>;
  SubmitButtonBefore?: CombFormsCustomRender<T>;
  SubmitButtonAfter?: CombFormsCustomRender<T>;
}

type SubformCustomRender<T> = (formKey: FormKey<T>, formState: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => React.ReactNode;

type SubformCustomRenderMap<T> = {
  Top?: SubformCustomRender<T>;
  SubmitButtonBefore?: SubformCustomRender<T>;
  SubmitButtonAfter?: SubformCustomRender<T>;
}

export type FormLayoutType<T, L> = L extends 'TabLayout' | 'ListLayout' | 'SimpleLayout'
  ? {
    [F in keyof T]?: {
      title?: string;
      titleBoxCss?: string;
      fieldLayout?: FieldLayoutType<T, F>;
      submitButtonProps?: SubmitButtonProps<T>;
      customRender?: SubformCustomRenderMap<T>;
    };
  }
  : L extends 'GridLayout'
  ? {
    [F in keyof T]?: {
      title?: string;
      titleBoxCss?: string;
      fieldLayout?: FieldLayoutType<T, F>;
      colSpan?: number;
      cardCss?: string;
      submitButtonProps?: SubmitButtonProps<T>;
      customRender?: SubformCustomRenderMap<T>;
    };
  }
  : never;

export type LayoutConfigType<T, L> = L extends 'TabLayout'
  ? { $type: 'TabLayout'; $tabsProps?: TabsProps; $combFormsCustomRender?: CombFormsCustomRenderMap<T> } & FormLayoutType<T, L>
  : L extends 'GridLayout'
  ? { $type: 'GridLayout'; $gridColumn?: number; $combFormsCustomRender?: CombFormsCustomRenderMap<T> } & FormLayoutType<T, L>
  : L extends 'ListLayout'
  ? { $type: 'ListLayout'; $combFormsCustomRender?: CombFormsCustomRenderMap<T> } & FormLayoutType<T, L>
  : L extends 'SimpleLayout'
  ? { $type: 'SimpleLayout'; $combFormsCustomRender?: CombFormsCustomRenderMap<T> } & FormLayoutType<T, L>
  : never;

export type FormDataType = {
  [key: string]: {
    [key: string]: string | number | boolean | Record<string, string | number | boolean>;
  };
};

export type FormConfigType<T> = {
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

export type FormKey<T = FormDataType> = keyof T;

export type FormDataOfKey<T = FormDataType> = T[FormKey<T>];

export type JSONFormProps<T = FormDataType> = {
  className?: string;
  theme?: ThemeType;
  formData: T;
  formConfig?: FormConfigType<T>;
  layoutConfig?: LayoutConfigType<T, LayoutType>;
  children?: any;
  onBatchSubmit?: (data: T, setLoading: Dispatch<SetStateAction<boolean>>) => void;
  onSet?: (v: FormDataOfKey<T>, form: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => FormDataOfKey<T>;
  onChange?: (data: Partial<T>) => void;
  onReady?: (formStates: { [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema> }) => void;
  batchSubmitButtonProps?: ButtonProps & { onBatchSubmit?: (formData: T, setLoading: Dispatch<SetStateAction<boolean>>) => void };
};

const components = {
  GridLayout,
  TabLayout,
  ListLayout,
  SimpleLayout,
};

export const JSONForm = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const type = props.layoutConfig?.$type || 'SimpleLayout';
  const Component = components[type];
  return (
    <div className={props.className}>
      {
        // @ts-ignore
        <Component {...props} />
      }
    </div>
  );
};
