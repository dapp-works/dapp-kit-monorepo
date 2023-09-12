import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";

import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { BatchSubmitButton, SubmitButton, getFormState } from "./format";

export type TabLayoutProps = {};

export const TabLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps } = props;
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
            const layout = formLayout[key];
            return (
              <TabPanel key={key}>
                <JSONSchemaForm formState={formStates[key]}>
                  {layout?.submitButtonProps && <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}
                </JSONSchemaForm>
              </TabPanel>
            );
          })}
        </TabPanels>
      </TabGroup>
      {(onBatchSubmit || batchSubmitButtonProps?.onBatchSubmit) && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} buttonProps={batchSubmitButtonProps} />
        </div>
      )}
    </>
  );
};

