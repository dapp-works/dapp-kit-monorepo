import React, { useEffect, useMemo, useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { FormDataType, JSONFormProps, LayoutConfigType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { BatchSubmitButton, CustomButton, SubmitButton, getFormState } from "./format";
import { cn } from "../../../lib/utils";

export const TabLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig = {}, onBatchSubmit, batchSubmitButtonProps, onReady } = props;
  const {
    $type,
    $tabsProps = {
      color: 'default',
    },
    ...formLayout
  } = layoutConfig as LayoutConfigType<T, 'TabLayout'>;
  const formStates = useMemo(() => getFormState(props, formLayout), [props.formData, props.formConfig, props.layoutConfig]);
  const formKeys = Object.keys(formStates);
  const [selectedTab, setSelectedTab] = useState(formKeys[0] || '');

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      <Tabs
        {...$tabsProps}
        selectedKey={selectedTab}
        onSelectionChange={(key: string) => {
          setSelectedTab(key);
        }}
      >
        {formKeys.map((key) => {
          const layout = formLayout[key];
          return <Tab id={`form-${key}-tab-menu`} key={key} title={<div className={layout?.titleBoxCss}>{layout?.title || key}</div>} />;
        })}
      </Tabs>
      {formKeys.map((key) => {
        const layout = formLayout[key];
        return (
          <div
            key={key}
            id={`form-${key}-tab-content`}
            className={cn('mt-4', selectedTab === key ? '' : 'hidden')}
          >
            <JSONSchemaForm formState={formStates[key]}>
              {layout?.submitButtonProps
                &&
                <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}
              {layout?.customButtonProps
                &&
                <CustomButton formKey={key} formState={formStates[key]} buttonProps={layout.customButtonProps} />}
            </JSONSchemaForm>
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
