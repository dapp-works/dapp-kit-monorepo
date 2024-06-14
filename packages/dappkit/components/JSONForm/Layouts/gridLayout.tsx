import React, { useEffect } from "react";
import { Card } from "@nextui-org/react";
import { FormDataType, JSONFormProps, LayoutConfigType } from "..";
import { BatchSubmitButton, CustomButton, SubmitButton, getFormState } from "./format";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { Grid, Col } from '../../../components/ui/grid';
import { cn } from '../../../lib/utils';

export const GridLayout = <T extends FormDataType>(props: JSONFormProps<T>) => {
  const { layoutConfig, onBatchSubmit, batchSubmitButtonProps, onReady } = props;
  const { $type, $gridColumn, ...formLayout } = layoutConfig as LayoutConfigType<T, 'GridLayout'>;
  const formStates = getFormState(props, formLayout);

  useEffect(() => {
    if (formStates && onReady) {
      onReady(formStates);
    }
  }, [formStates]);

  return (
    <>
      <Grid numItems={$gridColumn ?? 1} className="gap-2">
        {Object.keys(formStates).map((key) => {
          const layout = formLayout[key];
          return (
            <Col numColSpan={layout?.colSpan ?? 1} key={key} id={`form-${key}`}>
              <Card className={cn("h-full m-0 p-4 shadow-sm border dark:border-[#3e3e3e]", layout?.cardCss)}>
                <div className={cn('mb-2 font-bold text-center', layout?.titleBoxCss)}>{layout?.title || key}</div>
                <JSONSchemaForm formState={formStates[key]}>
                  {layout?.submitButtonProps && <SubmitButton formKey={key} formState={formStates[key]} buttonProps={layout.submitButtonProps} />}
                  {layout?.customButtonProps
                    &&
                    <CustomButton formKey={key} formState={formStates[key]} buttonProps={layout.customButtonProps} />}
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