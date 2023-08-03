import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from '..';
import { Grid, Col, Card, Text } from '@tremor/react';
import { JSONSchemaForm } from '@/dappkit/components/JSONSchemaForm';
import { BatchSubmitButton, getFormState } from './format';

export type GridLayoutProps = {
  gridColumn?: number;
};

export const GridLayout = <T extends FormDataType, L extends LayoutType>(props: JSONFormProps<T, L>) => {
  const { layoutConfig, onBatchSubmit } = props;
  const { type, gridColumn, ...formLayout } = layoutConfig as LayoutConfigType<T, 'GridLayout'>;
  const formStates = getFormState(props, formLayout);
  return (
    <>
      <Grid numItems={gridColumn ?? 1} className="gap-2">
        {Object.keys(formStates).map((key) => {
          const layout = formLayout[key];
          return (
            <Col numColSpan={layout?.colSpan ?? 1} key={key}>
              <Card className="h-full">
                <Text className="mb-2">{layout?.title || key}</Text>
                <JSONSchemaForm formState={formStates[key]}></JSONSchemaForm>
              </Card>
            </Col>
          );
        })}
      </Grid>
      {onBatchSubmit && (
        <div className="w-full flex">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} />
        </div>
      )}
    </>
  );
};
