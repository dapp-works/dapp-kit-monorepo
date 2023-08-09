import React from 'react';
import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from '..';
import { JSONSchemaForm } from '../../../components/JSONSchemaForm';
import { BatchSubmitButton, getFormState } from './format';

export type SimpleLayoutProps = {};

export const SimpleLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig = {}, onBatchSubmit } = props;
  const { type, ...formLayout } = layoutConfig as LayoutConfigType<T, 'SimpleLayout'>;
  const formStates = getFormState(props, formLayout);

  return (
    <>
      {Object.keys(formStates).map((key) => {
        return (
          <div key={key} className='space-y-2'>
            {/* @ts-ignore */}
            <JSONSchemaForm formState={formStates[key]} />
          </div>
        );
      })}
      {onBatchSubmit && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} />
        </div>
      )}
    </>
  );
};
