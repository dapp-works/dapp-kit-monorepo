import React from "react";
import { Input } from "@nextui-org/react";
import { WidgetProps } from "@rjsf/utils";

import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  size: "sm" | "md" | "lg";
};

export interface InputWidgetProps extends WidgetProps {
  options: Options;
}

export interface InputWidgetUIOptions {
  "ui:widget": (props: InputWidgetProps) => JSX.Element;
  "ui:options": Options;
}

function InputWidget({
  onChange,
  options,
  id,
  label,
  value,
  required,
  disabled,
  schema,
}: InputWidgetProps) {
  const { className, labelPlacement = "inside", size = "md" } = options;
  return (
    <Input
      id={id}
      className={cn("w-full", className)}
      label={label}
      placeholder=""
      value={value}
      isRequired={required}
      isDisabled={disabled}
      size={size}
      labelPlacement={labelPlacement}
      description={schema.description || ""}
      type={schema.inputType || "text"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default InputWidget;
