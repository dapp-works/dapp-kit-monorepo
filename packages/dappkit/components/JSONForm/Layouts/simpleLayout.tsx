import React from 'react';
import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from '..';
import { JSONSchemaForm } from '../../../components/JSONSchemaForm';
import { BatchSubmitButton, SubmitButton, getFormState } from './format';

export type SimpleLayoutProps = {};

export const SimpleLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps } = props;
  const { type, ...formLayout } = layoutConfig as LayoutConfigType<T, 'SimpleLayout'>;
  const formStates = getFormState(props, formLayout);

  return (
    <>
      {Object.keys(formStates).map((key) => {
        const layout = formLayout[key];
        return (
          <div key={key} className="space-y-2">
            <JSONSchemaForm formState={formStates[key]}>{layout?.submitButtonProps && <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}</JSONSchemaForm>
          </div>
        );
      })}
      {(onBatchSubmit || batchSubmitButtonProps?.onBatchSubmit) && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} buttonProps={batchSubmitButtonProps} />
        </div>
      )}
    </>
  );
};