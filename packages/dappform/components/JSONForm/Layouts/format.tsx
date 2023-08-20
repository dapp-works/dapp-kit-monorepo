import React from "react";
import { Button } from "@nextui-org/react";
import { UiSchema } from "@rjsf/utils";

import { FormDataOfKey, FormKey, JSONFormProps } from "..";
import CheckboxWidget from "../../../components/JSONFormWidgets/CheckboxWidget";
import InputWidget from "../../../components/JSONFormWidgets/InputWidget";
import SelectWidget from "../../../components/JSONFormWidgets/SelectWidget";
import {
  JSONSchemaFormState,
  JSONValue,
} from "../../../store/standard/JSONSchemaState";
import { helper } from "../../../lib/helper";
import EditorWidget from '../../../components/JSONFormWidgets/EditorWidget';


export const getFormState = <T, L>(
  props: JSONFormProps<T, L>,
  formLayout: { [x: string]: { fieldLayout?: any[] } } = {},
) => {
  const { formData, formConfig, onSubmit, onSet, onChange } = props;

  const formStates: {
    [F in keyof T]?: JSONSchemaFormState<FormDataOfKey<T>, UiSchema>;
  } = {};

  //@ts-ignore
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
            formConfigData[k]["ui:options"] = {
              labelPlacement: "inside",
              size: "sm",
            };
            if (type === "number") {
              p[k].inputType = "number";
            }

            if (helper.json.isJsonString(v)) {
              formConfigData[k]['ui:widget'] = EditorWidget;
            }
          }
        }
      }
      if (type === "boolean") {
        formConfigData[k]["ui:widget"] = CheckboxWidget;
        formConfigData[k]["ui:options"] = {
          size: "sm",
        };
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
      // if (formConfigData[k]?.selectOptions) {
      //   p[k].enum = formConfigData[k].selectOptions.map((i) => i.value);
      //   p[k].enumNames = formConfigData[k].selectOptions.map((i) => i.label);
      // }
      if (formConfigData[k]?.required) {
        //@ts-ignore
        required.push(k);
      }
      value[k] = v;
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
          norender: onSubmit ? false : true,
        },
        ...formConfigData,
        layout: formLayout[key]?.fieldLayout,
      },
      afterSubmit: async (e) => {
        onSubmit?.(key as FormKey<T>, e.formData as FormDataOfKey<T>);
      },
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

export const BatchSubmitButton = ({ formStates, onSubmit }) => {
  return (
    <Button
      className="ml-auto mt-4"
      size="sm"
      color="primary"
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
            console.error("formRef.current is null");
            return;
          }
        }
        onSubmit?.(formData);
      }}
    >
      Submit
    </Button>
  );
};
