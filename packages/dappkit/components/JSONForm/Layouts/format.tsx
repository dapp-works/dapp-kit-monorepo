import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { UiSchema } from "@rjsf/utils";
import { FormDataOfKey, JSONFormProps } from "..";
import { CheckboxWidget } from "../../../components/JSONFormWidgets/CheckboxWidget";
import { InputWidget } from "../../../components/JSONFormWidgets/InputWidget";
import { SelectWidget } from "../../../components/JSONFormWidgets/SelectWidget";
import { EditorWidget } from '../../../components/JSONFormWidgets/EditorWidget';
import {
  JSONSchemaFormState,
  JSONValue,
} from "../../../store/standard/JSONSchemaState";
import { helper } from "../../../lib/helper";
import { cn } from "../../../lib/utils";

export const getFormState = <T,>(
  props: JSONFormProps<T>,
  formLayout: { [x: string]: { fieldLayout?: any[] } } = {},
) => {
  const { formData, formConfig, onSet, onChange } = props;

  const formStates: {
    [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>;
  } = {};

  Object.keys(formData).forEach((key) => {
    const metadata = formData[key];
    const formConfigData = formConfig?.[key] || {};
    const value = {};
    const required = [];
    const properties = Object.entries(metadata).reduce((p, c: any) => {
      const [k, v] = c;

      const type = typeof v;
      p[k] = {
        type,
      };

      value[k] = v;

      if (!formConfigData[k]) {
        formConfigData[k] = {};
      }

      if (type === "string" || type === "number") {
        if (formConfigData[k]?.selectOptions) {
          formConfigData[k]["ui:widget"] = SelectWidget;
          p[k].selectOptions = formConfigData[k].selectOptions;
        } else {
          if (!formConfigData[k]["ui:widget"]) {
            formConfigData[k]["ui:widget"] = InputWidget;

            if (type === "number") {
              p[k].inputType = "number";
            }

            if (helper.json.isJsonString(v)) {
              formConfigData[k]['ui:widget'] = EditorWidget;
              formConfigData[k]["ui:options"] = {
                ...formConfigData[k]["ui:options"],
                jsonStrSpace: 2,
              };
            }
          }
        }
      }

      if (type === "boolean") {
        formConfigData[k]["ui:widget"] = CheckboxWidget;
      }

      if (type === 'object') {
        // Instead of setting up "definitions", the easy way to do this is to edit the json directly using the EditorWidget
        p[k].type = 'string';
        value[k] = JSON.stringify(v, null, 2);
        formConfigData[k]['ui:widget'] = EditorWidget;
      }

      if (formConfigData[k]?.inputType) {
        p[k].inputType = formConfigData[k].inputType;
      }
      if (formConfigData[k]?.title) {
        p[k].title = formConfigData[k].title || k;
      }
      if (formConfigData[k]?.description) {
        p[k].description = formConfigData[k].description;
      }

      if (formConfigData[k]?.required) {
        required.push(k);
      }

      return p;
    }, {});
    const schema = {
      type: "object",
      properties,
      required,
    };
    const form = new JSONSchemaFormState({
      //@ts-ignore
      schema,
      uiSchema: {
        "ui:submitButtonOptions": {
          norender: true,
        },
        ...formConfigData,
        layout: formLayout[key]?.fieldLayout,
      },
      // afterSubmit: async (e) => {
      //   onSubmit?.(key as FormKey<T>, e.formData as FormDataOfKey<T>);
      // },
      afterChange: (e, id) => {
        const { formData } = e;
        if (formData) {
          const field = id.replace('root_', '');
          const data = {
            [key]: {
              [field]: formData[field],
            }
          };
          //@ts-ignore
          onChange?.(data);
        }
      },
      value: new JSONValue({
        default: value,
        //@ts-ignore
        onSet: (v) => {
          if (onSet) {
            return onSet(v as FormDataOfKey<T>, form);
          }
          return v;
        },
      }),
    });

    formStates[key] = form;
  });

  return formStates;
};

export const BatchSubmitButton = ({ formStates, onSubmit, buttonProps }) => {
  const { className, onClick, children, isLoading, onBatchSubmit, ...rest } = buttonProps || {};
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className={cn('mt-4 ml-auto', className)}
      size="sm"
      color="primary"
      isLoading={loading}
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
            console.error('formRef.current is null');
            return;
          }
        }
        onSubmit?.(formData, setLoading);
        onBatchSubmit?.(formData, setLoading);
      }}
      {...rest}
    >
      {children || 'Submit'}
    </Button>
  );
};

export const SubmitButton = ({ formKey, formState, buttonProps }) => {
  const { className, onClick, children, isLoading, onAfterSubmit, ...rest } = buttonProps || {};
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full flex">
      <Button
        className={cn('mt-4 ml-auto', className)}
        type="submit"
        color="primary"
        size="sm"
        isLoading={loading}
        onClick={(e) => {
          let formData = {};
          const current = formState.formRef.current;
          if (current) {
            current.submit();
            formData = current.state.formData;
            const required = current.state.schema.required;
            for (const i of required) {
              if (!formData[i]) {
                return;
              }
            }
            const errors = current.state.errors;
            if (errors.length > 0) {
              return;
            }
          }
          onAfterSubmit?.(formKey, formData, setLoading);
        }}
        {...rest}
      >
        {children || 'Submit'}
      </Button>
    </div>
  );
};
