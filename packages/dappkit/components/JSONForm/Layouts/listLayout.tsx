import React, { useState } from "react";
import { UiSchema } from "@rjsf/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

import { FormDataType, JSONFormProps, LayoutConfigType, LayoutType } from "..";
import { JSONSchemaForm } from "../../../components/JSONSchemaForm";
import { cn } from "../../../lib/utils";
import { JSONSchemaFormState } from "../../../store/standard/JSONSchemaState";
import { BatchSubmitButton, getFormState } from "./format";

export type ListLayoutProps = {};

const CollapsibleBox = ({
  title,
  formState,
}: {
  title: string;
  formState: JSONSchemaFormState<{ [key: string]: any }, UiSchema>;
}) => {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <div
        className="border-t-[1px solid #E5E5EA] mb-[10px] mt-5 flex cursor-pointer items-center justify-between py-[5px] hover:bg-[#F2F2F7] dark:hover:bg-gray-900"
        onClick={() => setOpened((o) => !o)}
      >
        <div className="text-base font-bold text-gray-900 dark:text-gray-100">
          {title}
        </div>
        {opened ? <ChevronUp /> : <ChevronDown />}
      </div>
      <div className={cn("mt-2", opened ? "block" : "hidden")}>
        <JSONSchemaForm formState={formState}></JSONSchemaForm>
      </div>
    </>
  );
};

export const ListLayout = <T extends FormDataType, L extends LayoutType>(
  props: JSONFormProps<T, L>,
) => {
  const { layoutConfig = {}, onBatchSubmit } = props;
  const { type, ...formLayout } = layoutConfig as LayoutConfigType<
    T,
    "ListLayout"
  >;
  //@ts-ignore
  const formStates = getFormState(props, formLayout);

  return (
    <>
      {Object.keys(formStates).map((key) => {
        const layout = formLayout[key];
        const formState = formStates[key];
        return (
          <CollapsibleBox
            key={key}
            title={layout?.title || key}
            // @ts-ignore
            formState={formState}
          ></CollapsibleBox>
        );
      })}
      {onBatchSubmit && (
        <div className="flex w-full">
          <BatchSubmitButton formStates={formStates} onSubmit={onBatchSubmit} />
        </div>
      )}
    </>
  );
};
