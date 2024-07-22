import React, { useEffect } from 'react';
import { FormDataType, JSONFormProps, LayoutConfigType } from '..';
import { JSONSchemaForm } from '../../../components/JSONSchemaForm';
import { BatchSubmitButton, SubmitButton, getFormState } from './format';

export const SimpleLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps, onReady, theme } = props;
  const { $type, ...formLayout } = layoutConfig as LayoutConfigType<T, 'SimpleLayout'>;
  const formStates = getFormState(props, formLayout, theme);

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      <div className="space-y-2">
        {Object.keys(formStates).map((key) => {
          const layout = formLayout[key];
          return (
            <div key={key} id={`form-${key}`}>
              <JSONSchemaForm formState={formStates[key]}>{layout?.submitButtonProps && <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}</JSONSchemaForm>
            </div>
          );
        })}
      </div>
      {(onBatchSubmit || batchSubmitButtonProps?.onBatchSubmit) && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} buttonProps={batchSubmitButtonProps} />
        </div>
      )}
    </>
  );
};
