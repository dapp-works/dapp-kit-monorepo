import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from '..';
import { JSONSchemaForm } from '@/dappkit/components/JSONSchemaForm';
import { BatchSubmitButton, getFormState } from './format';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { UiSchema } from '@rjsf/utils';
import { JSONSchemaFormState } from '@/dappkit/store/standard/JSONSchemaState';
import { cn } from '@/dappkit/lib/utils';

export type ListLayoutProps = {};

const CollapsibleBox = ({ title, formState }: { title: string; formState: JSONSchemaFormState<{ [key: string]: any }, UiSchema> }) => {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <div
        className="mt-5 mb-[10px] flex justify-between items-center cursor-pointer border-t-[1px solid #E5E5EA] py-[5px] hover:bg-[#F2F2F7] dark:hover:bg-gray-900"
        onClick={() => setOpened((o) => !o)}
      >
        <div className="text-gray-900 dark:text-gray-100 font-bold text-base">{title}</div>
        {opened ? <ChevronUp /> : <ChevronDown />}
      </div>
      <div className={cn('mt-2', opened ? 'block' : 'hidden')}>
        <JSONSchemaForm formState={formState}></JSONSchemaForm>
      </div>
    </>
  );
};

export const ListLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig = {}, onBatchSubmit } = props;
  const { type, ...formLayout } = layoutConfig as LayoutConfigType<T, 'ListLayout'>;
  const formStates = getFormState(props, formLayout);

  return (
    <>
      {Object.keys(formStates).map((key) => {
        const layout = formLayout[key];
        const formState = formStates[key];
        return <CollapsibleBox key={key} title={layout?.title || key} formState={formState}></CollapsibleBox>;
      })}
      {onBatchSubmit && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} />
        </div>
      )}
    </>
  );
};
