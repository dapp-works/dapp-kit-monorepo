import React from "react";
import { Checkbox } from "@nextui-org/react";
import { WidgetProps } from "@rjsf/utils";
import { PlusIcon } from "lucide-react";

type Options = {
  className?: string;
  size: "sm" | "md" | "lg";
};

export interface CheckboxWidgetProps extends WidgetProps {
  options: Options;
}

export interface CheckboxWidgetUIOptions {
  "ui:widget": (props: CheckboxWidgetProps) => JSX.Element;
  "ui:options": Options;
}

function CheckboxWidget({
  onChange,
  options,
  id,
  label,
  value,
  required,
  disabled,
  schema,
}: CheckboxWidgetProps) {
  const { className, size = "sm" } = options;

  return (
    <Checkbox
      id={id}
      defaultSelected={value}
      icon={<PlusIcon color="white" />}
      color="success"
      size={size}
      onChange={(e: any) => {
        const checked = e.target.checked;
        onChange(checked);
      }}
    >
      {label}
    </Checkbox>
  );
}

export default CheckboxWidget;
