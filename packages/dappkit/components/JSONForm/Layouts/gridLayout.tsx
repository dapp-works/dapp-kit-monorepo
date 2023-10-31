import React from "react";
import { Card } from "@nextui-org/react";
import { Col, Grid, Text } from "@tremor/react";

import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { BatchSubmitButton, SubmitButton, getFormState } from "./format";

export type GridLayoutProps = {
  gridColumn?: number;
};

export const GridLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig, onBatchSubmit, batchSubmitButtonProps } = props;
  const { type, gridColumn, ...formLayout } = layoutConfig as LayoutConfigType<T, 'GridLayout'>;
  const formStates = getFormState(props, formLayout);
  return (
    <>
      <Grid numItems={gridColumn ?? 1} className="gap-2">
        {Object.keys(formStates).map((key) => {
          const layout = formLayout[key];
          return (
            <Col numColSpan={layout?.colSpan ?? 1} key={key}>
              <Card className="h-full m-0 p-4" shadow="sm">
                <Text className="mb-2">{layout?.title || key}</Text>
                <JSONSchemaForm formState={formStates[key]}>
                  {layout?.submitButtonProps && <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}
                </JSONSchemaForm>
              </Card>
            </Col>
          );
        })}
      </Grid>
      {(onBatchSubmit || batchSubmitButtonProps?.onBatchSubmit) && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} buttonProps={batchSubmitButtonProps} />
        </div>
      )}
    </>
  );
};