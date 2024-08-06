"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import Form from "@rjsf/core";
import {
  type ErrorListProps,
  type FieldTemplateProps,
  type ObjectFieldTemplateProps,
  type SubmitButtonProps,
} from "@rjsf/utils";
import * as Utils from "@rjsf/utils"
import { ChevronDown, ChevronUp } from "lucide-react";
import { observer } from "mobx-react-lite";
import { cn } from "../../lib/utils";
import { JSONSchemaFormState } from "../../store/standard/JSONSchemaState";
import { toJS } from "mobx";

function FieldTemplate(props: FieldTemplateProps) {
  const { id, classNames, label, help, required, description, errors, children, schema, uiSchema } = props;

  if (uiSchema && uiSchema['ui:widget'] === 'hidden') { return null; }

  // const hideLabel = schema.type === 'object' || schema.type === 'boolean';

  const isDate = uiSchema && uiSchema['ui:widget'] === 'date';
  const isDateTime = uiSchema && uiSchema['ui:widget'] === 'date-time';
  const isTime = uiSchema && uiSchema['ui:widget'] === 'time';
  const showLabel = isDate || isDateTime || isTime;

  return (
    <div className={cn(classNames)}>
      {showLabel && (
        <label htmlFor={id} className={cn('flex items-center h-8')}>
          <span className="text-sm">{label}</span>
          {required && <span className="font-bold text-red-600">*</span>}
        </label>
      )}

      {/* {description} */}
      {/* {children} */}
      {/* {help} */}

      {children}
    </div>
  );
}

const renderLayout = (layout: any[], fields: { [k: string]: React.ReactElement }, n = 1) => {
  n++;
  return layout.map((item, index) => {
    if (Array.isArray(item)) {
      const even = (n & 1) === 0;
      return (
        <div key={index} className={cn('w-full flex justify-between items-center space-x-2', even ? 'flex-row items-start' : 'flex-col')}>
          {renderLayout(item, fields, n)}
        </div>
      );
    } else {
      return (
        <div className="w-full" key={index}>
          {fields[item]}
        </div>
      );
    }
  });
};

const ObjectFieldTemplate = ({ title, idSchema: { $id }, properties, uiSchema: { layout } }: ObjectFieldTemplateProps) => {
  const [opened, setOpened] = useState(false);
  const fields = Object.fromEntries(properties.map((item) => [item.name, item.content]));
  return (
    <div className="w-full space-y-2.5">
      {$id === 'root' ? (
        layout ? (
          renderLayout(layout, fields)
        ) : (
          properties.map((element) => {
            return (
              <div key={element.content.key}>
                {element.content}
              </div>
            );
          })
        )
      ) : (
        <>
          <div
            className="mt-5 mb-[10px] flex justify-between items-center cursor-pointer border-t-[1px solid #E5E5EA] py-[5px] hover:bg-[#F2F2F7] dark:hover:bg-gray-900"
            onClick={() => setOpened((o) => !o)}
          >
            <div className="text-gray-900 dark:text-gray-100 font-bold text-base">{title}</div>
            {opened ? <ChevronUp /> : <ChevronDown />}
          </div>
          <div className={cn('mt-2 space-y-2.5', opened ? 'block' : 'hidden')}>
            {layout
              ? renderLayout(layout, fields)
              : properties.map((element) => {
                return (
                  <div key={element.content.key}>
                    {element.content}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

const ErrorListTemplate = ({ errors }: ErrorListProps) => {
  return (
    <div>
      <div className="font-bold">Errors</div>
      <div className="mt-[10px]">
        {errors.map((error) => (
          <div className="mb-[10px]" color="red" key={error.property}>
            {error.stack}
          </div>
        ))}
      </div>
    </div>
  );
};

const SubmitButton = ({ uiSchema }: SubmitButtonProps) => {
  const { submitText, norender, props: submitButtonProps = {} } = Utils.getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  return (
    <div className="flex justify-end mt-4">
      <Button type="submit" color='primary' size='sm'>{submitText}</Button>
    </div>
  );
};

interface Props {
  formState: JSONSchemaFormState<any>;
  children?: any;
}

export const JSONSchemaForm = observer(({ children, formState }: Props) => {
  if (!formState?.dynamicData?.ready) return <></>;
  return (
    <Form
      showErrorList="bottom"
      templates={{
        ObjectFieldTemplate,
        FieldTemplate,
        ErrorListTemplate,
        ButtonTemplates: { SubmitButton },
      }}
      formData={toJS(formState.formData)}
      readonly={formState.readonly}
      uiSchema={formState.uiSchema}
      schema={formState.schema}
      onChange={formState.onChange}
      onSubmit={formState.onSubmit}
      validator={formState.validator}
      customValidate={formState.customValidate}
      ref={formState.formRef}
    >
      {children && children}
    </Form>
  );
});
