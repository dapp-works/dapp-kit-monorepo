import React, { useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { FormDataType, JSONFormProps, LayoutConfigType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { BatchSubmitButton, SubmitButton, getFormState } from "./format";

export const TabLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps, onReady } = props;
  const { $type, $variant = 'line', ...formLayout } = layoutConfig as LayoutConfigType<T, 'TabLayout'>;
  const formStates = getFormState(props, formLayout);

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      <TabGroup>
        <TabList variant={$variant}>
          {Object.keys(formStates).map((key, index) => {
            const layout = formLayout[key];
            return <Tab id={`form-${key}-tab-menu`}>{layout?.title || key}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {Object.keys(formStates).map((key) => {
            const layout = formLayout[key];
            return (
              <TabPanel key={key} id={`form-${key}-tab-content`}>
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
