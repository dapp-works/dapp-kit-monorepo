import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormDataType, JSONFormProps, LayoutConfigType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { cn } from "../../../lib/utils";
import { BatchSubmitButton, SubmitButton, getFormState } from "./format";

const CollapsibleBox = ({ formKey, layout, formState }: { formKey: string; layout: any; formState: any }) => {
  const [opened, setOpened] = useState(true);
  return (
    <div id={`form-${formKey}`}>
      <div
        className="mt-5 mb-[10px] flex justify-between items-center cursor-pointer border-t-[1px solid #E5E5EA] py-[5px]"
        onClick={() => setOpened((o) => !o)}
      >
        <div className={cn('text-gray-900 dark:text-gray-100 font-bold text-base', layout?.titleBoxCss)}>{layout?.title || formKey}</div>
        {opened ? <ChevronUp size={18} className="text-[#717179] dark:text-[#A1A1A9]" /> : <ChevronDown size={18} className="text-[#717179] dark:text-[#A1A1A9]" />}
      </div>
      <div className={cn('mt-2', opened ? 'block' : 'hidden')}>
        {layout?.customRender?.Top?.(formKey, formState)}
        <JSONSchemaForm formState={formState}>
          {layout?.customRender?.SubmitButtonBefore?.(formKey, formState)}
          {layout?.submitButtonProps && <SubmitButton formKey={formKey} formState={formState} buttonProps={layout.submitButtonProps} />}
          {layout?.customRender?.SubmitButtonAfter?.(formKey, formState)}
        </JSONSchemaForm>
      </div>
    </div>
  );
};

export const ListLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps, onReady, theme } = props;
  const { $type, $combFormsCustomRender, ...formLayout } = layoutConfig as LayoutConfigType<T, 'ListLayout'>;
  const formStates = getFormState(props, formLayout, theme);

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      {$combFormsCustomRender?.Top?.(formStates)}
      {Object.keys(formStates).map((key) => {
        return (
          <CollapsibleBox
            key={key}
            formKey={key}
            formState={formStates[key]}
            layout={formLayout[key]}
          />
        );
      })}
      {$combFormsCustomRender?.SubmitButtonBefore?.(formStates)}
      {(onBatchSubmit || batchSubmitButtonProps?.onBatchSubmit) && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} buttonProps={batchSubmitButtonProps} />
        </div>
      )}
      {$combFormsCustomRender?.SubmitButtonAfter?.(formStates)}
    </>
  );
};