import React from "react";
import { Card } from "@nextui-org/react";
import { Col, Grid, Text } from "@tremor/react";

import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { BatchSubmitButton, getFormState } from "./format";

export type GridLayoutProps = {
  gridColumn?: number;
};

export const GridLayout = <T extends FormDataType, L extends LayoutType>(
  props: JSONFormProps<T, L>,
) => {
  const { layoutConfig, onBatchSubmit } = props;
  const { type, gridColumn, ...formLayout } = layoutConfig as LayoutConfigType<
    T,
    "GridLayout"
  >;
  //@ts-ignore
  const formStates = getFormState(props, formLayout);
  return (
    <>
      <Grid numItems={gridColumn ?? 1} className="gap-2">
        {Object.keys(formStates).map((key) => {
          const layout = formLayout[key];
          return (
            <Col numColSpan={layout?.colSpan ?? 1} key={key}>
              <Card className="m-0 h-full p-4" shadow="sm">
                <Text className="mb-2">{layout?.title || key}</Text>
                {/* @ts-ignore */}
                <JSONSchemaForm formState={formStates[key]}></JSONSchemaForm>
              </Card>
            </Col>
          );
        })}
      </Grid>
      {onBatchSubmit && (
        <div className="flex w-full">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} />
        </div>
      )}
    </>
  );
};
