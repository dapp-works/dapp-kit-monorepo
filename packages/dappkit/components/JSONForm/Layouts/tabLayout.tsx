import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from '..';
import { TabList, Tab, TabGroup, TabPanels, TabPanel } from '@tremor/react';
import { JSONSchemaForm } from '@/dappkit/components/JSONSchemaForm';
import { BatchSubmitButton, getFormState } from './format';

export type TabLayoutProps = {};

export const TabLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig = {}, onBatchSubmit } = props;
  const { type, ...formLayout } = layoutConfig as LayoutConfigType<T, 'TabLayout'>;
  const formStates = getFormState(props, formLayout);

  return (
    <>
      <TabGroup>
        <TabList className="">
          {Object.keys(formStates).map((key, index) => {
            const layout = formLayout[key];
            return <Tab>{layout?.title || key}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {Object.keys(formStates).map((key) => {
            return (
              <TabPanel key={key}>
                <JSONSchemaForm formState={formStates[key]}></JSONSchemaForm>
              </TabPanel>
            );
          })}
        </TabPanels>
      </TabGroup>
      {onBatchSubmit && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} />
        </div>
      )}
    </>
  );
};
