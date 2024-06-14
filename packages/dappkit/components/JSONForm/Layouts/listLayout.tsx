import React, { useEffect, useState } from "react";
import { UiSchema } from "@rjsf/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormDataType, FormLayoutType, JSONFormProps, LayoutConfigType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { cn } from "../../../lib/utils";
import { JSONSchemaFormState } from "../../../store/standard/JSONSchemaState";
import { BatchSubmitButton, CustomButton, SubmitButton, getFormState } from "./format";

const CollapsibleBox = (
  { formKey, title, titleBoxCss, formState, submitButtonProps, customButtonProps }:
    {
      formKey: string; title: string; titleBoxCss?: string; formState: JSONSchemaFormState<{ [key: string]: any }, UiSchema>; submitButtonProps: any; customButtonProps: any;
    }
) => {
  const [opened, setOpened] = useState(true);
  return (
    <div id={`form-${formKey}`}>
      <div
        className="mt-5 mb-[10px] flex justify-between items-center cursor-pointer border-t-[1px solid #E5E5EA] py-[5px] hover:bg-[#F2F2F7] dark:hover:bg-gray-900"
        onClick={() => setOpened((o) => !o)}
      >
        <div className={cn('text-gray-900 dark:text-gray-100 font-bold text-base', titleBoxCss)}>{title}</div>
        {opened ? <ChevronUp /> : <ChevronDown />}
      </div>
      <div className={cn('mt-2', opened ? 'block' : 'hidden')}>
        <JSONSchemaForm formState={formState}>
          {submitButtonProps
            &&
            <SubmitButton formKey={formKey} formState={formState} buttonProps={submitButtonProps} />}
          {customButtonProps
            &&
            <CustomButton formKey={formKey} formState={formState} buttonProps={customButtonProps} />}
        </JSONSchemaForm>
      </div>
    </div>
  );
};

export const ListLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps, onReady } = props;
  const { $type, ...formLayout } = layoutConfig as LayoutConfigType<T, 'ListLayout'>;
  const formStates = getFormState(props, formLayout);

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      {Object.keys(formStates).map((key) => {
        const layout = formLayout[key];
        const formState = formStates[key];
        return <CollapsibleBox
          key={key} formKey={key} title={layout?.title || key} titleBoxCss={layout?.titleBoxCss} formState={formState}
          submitButtonProps={layout?.submitButtonProps}
          customButtonProps={layout?.customButtonProps}
        />;
      })}
      {(onBatchSubmit || batchSubmitButtonProps?.onBatchSubmit) && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} buttonProps={batchSubmitButtonProps} />
        </div>
      )}
    </>
  );
};