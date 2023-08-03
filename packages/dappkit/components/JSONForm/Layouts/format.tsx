import { Button } from '@tremor/react';
import { FormDataOfKey, FormKey, JSONFormProps } from '..';
import { JSONSchemaFormState, JSONValue } from '@/dappkit/store/standard/JSONSchemaState';
import { UiSchema } from '@rjsf/utils';

export const getFormState = <T, L>(props: JSONFormProps<T, L>, formLayout: { [x: string]: { fieldLayout?: any[] } } = {}) => {
  const { uiSize, formData, formConfig, onSubmit, onSet } = props;

  const formStates: {
    [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>
  } = {};

  Object.keys(formData).forEach((key) => {
    const metadata = formData[key];
    const formConfigData = formConfig?.[key] || {};
    const value = {};
    const required = [];
    const properties = Object.entries(metadata).reduce((p, c: any) => {
      const [k, v] = c;
      p[k] = {
        type: typeof v,
      };
      if (formConfigData[k]?.title) {
        p[k].title = formConfigData[k]?.title || k;
      }
      if (formConfigData[k]?.selectOptions) {
        p[k].enum = formConfigData[k].selectOptions.map((i) => i.value);
        p[k].enumNames = formConfigData[k].selectOptions.map((i) => i.label);
      }
      if (formConfigData[k]?.required) {
        required.push(k);
      }
      if (uiSize) {
        if (!formConfigData[k]) { formConfigData[k] = {}; }
        formConfigData[k]['ui:size'] = uiSize;
      }
      value[k] = v;
      return p;
    }, {});
    const schema = {
      type: 'object',
      properties,
      required,
    };
    const form = new JSONSchemaFormState({
      //@ts-ignore
      schema,
      uiSchema: {
        'ui:submitButtonOptions': {
          norender: onSubmit ? false : true,
        },
        ...formConfigData,
        layout: formLayout[key]?.fieldLayout,
      },
      afterSubmit: async (e) => {
        onSubmit?.(key as FormKey<T>, e.formData as FormDataOfKey<T>);
      },
      // afterChange: (e) => {
      //   onChange?.(key as FormKey<T>, e.formData as FormDataOfKey<T>,);
      // },
      value: new JSONValue({
        default: value,
        onSet: (v) => {
          if (onSet) {
            return onSet(v as FormDataOfKey<T>, form)
          }
          return v;
        },
      }),
    });

    formStates[key] = form;
  })

  return formStates;
}

export const BatchSubmitButton = ({ formStates, onSubmit }) => {
  return (
    <Button
      className="bg-black mt-4 ml-auto"
      onClick={(e) => {
        const formData = {};
        const formKeys = Object.keys(formStates);
        for (const key of formKeys) {
          const form = formStates[key];
          const current = form.formRef.current;
          if (current) {
            current.submit();
            const data = current.state.formData;
            const required = current.state.schema.required;
            for (const i of required) {
              if (!data[i]) {
                return;
              }
            }
            const errors = current.state.errors;
            if (errors.length > 0) {
              return;
            }
            formData[key] = data;
          } else {
            return;
          }
        }
        onSubmit?.(formData);
      }}
    >
      Submit
    </Button>
  )
}