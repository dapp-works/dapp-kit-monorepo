import { UiSchema } from '@rjsf/utils';
import { JSONSchemaFormState } from '@/dappkit/store/standard/JSONSchemaState';
import { GridLayout, GridLayoutProps } from './Layouts/gridLayout';
import { TabLayout, TabLayoutProps } from './Layouts/tabLayout';
import { ListLayout, ListLayoutProps } from './Layouts/listLayout';

export type LayoutType = 'TabLayout' | 'GridLayout' | 'ListLayout';

export type FieldLayoutType<T, F extends keyof T> = Array<keyof NonNullable<T[F]>> | Array<Array<keyof NonNullable<T[F]>> | keyof NonNullable<T[F]>>;

export type SubLayoutType<T, L> = L extends 'TabLayout' | 'ListLayout'
  ? {
    [F in keyof T]?: {
      title?: string;
      fieldLayout?: FieldLayoutType<T, F>;
    };
  }
  : L extends 'GridLayout'
  ? {
    [F in keyof T]?: {
      title?: string;
      fieldLayout?: FieldLayoutType<T, F>;
      colSpan?: number;
    };
  }
  : never;

export type LayoutConfigType<T, L> = L extends 'TabLayout'
  ? { type: 'TabLayout' } & SubLayoutType<T, L> & TabLayoutProps
  : L extends 'GridLayout'
  ? { type: 'GridLayout' } & SubLayoutType<T, L> & GridLayoutProps
  : L extends 'ListLayout'
  ? { type: 'ListLayout' } & SubLayoutType<T, L> & ListLayoutProps
  : never;

export type FormDataType = {
  [key: string]: {
    [key: string]: string | number | boolean | { [key: string]: string | number | boolean };
  };
};

export type FormConfigType<T> = {
  [F in keyof T]?: {
    [X in keyof T[F]]?: {
      title?: string;
      required?: boolean;
      selectOptions?: { label: string; value: string }[];
      horizontal?: boolean;
    } & UiSchema;
  };
};

export type FormKey<T = FormDataType> = keyof T;

export type FormDataOfKey<T = FormDataType> = T[FormKey<T>];

export type JSONFormProps<T = FormDataType, L = LayoutType> = {
  className?: string;
  uiSize?: 'small' | 'default';
  formData: T;
  formConfig?: FormConfigType<T>;
  layoutConfig?: LayoutConfigType<T, L>;
  children?: any;
  onBatchSubmit?: (data: T) => void;
  onSet?: (v: FormDataOfKey<T>, form: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>) => FormDataOfKey<T>;
  onSubmit?: (formKey: FormKey<T>, data: FormDataOfKey<T>) => void;
  // onChange?: (formKey: FormKey<T>, data: FormDataOfKey<T>) => void;
};

const components = {
  GridLayout,
  TabLayout,
  ListLayout,
};

export const JSONForm = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const type = props.layoutConfig?.type || 'ListLayout';
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
