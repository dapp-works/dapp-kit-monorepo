import React, { useEffect } from 'react';
import { FormDataType, JSONFormProps, LayoutConfigType } from '..';
import { JSONSchemaForm } from '../../../components/JSONSchemaForm';
import { BatchSubmitButton, SubmitButton, getFormState } from './format';

export const SimpleLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps, onReady, theme } = props;
  const { $type, $combFormsCustomRender, ...formLayout } = layoutConfig as LayoutConfigType<T, 'SimpleLayout'>;
  const formStates = getFormState(props, formLayout, theme);

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      {$combFormsCustomRender?.Top?.(formStates)}
      <div className="space-y-2">
        {Object.keys(formStates).map((key) => {
          const layout = formLayout[key];
          return (
            <div key={key} id={`form-${key}`}>
              {layout?.customRender?.Top?.(key, formStates[key])}
              <JSONSchemaForm formState={formStates[key]}>
                {layout?.customRender?.SubmitButtonBefore?.(key, formStates[key])}
                {layout?.submitButtonProps && <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}
                {layout?.customRender?.SubmitButtonAfter?.(key, formStates[key])}
              </JSONSchemaForm>
            </div>
          );
        })}
      </div>
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
