import React from "react";
import { Input } from "@nextui-org/react";
import { WidgetProps } from "@rjsf/utils";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  size: "sm" | "md" | "lg";
  placeholder?: string;
};

export interface InputWidgetProps extends WidgetProps {
  options: Options;
}

export interface InputWidgetUIOptions {
  "ui:widget": (props: InputWidgetProps) => JSX.Element;
  "ui:options": Options;
}

export function InputWidget(props: InputWidgetProps) {
  const {
    onChange,
    options,
    label,
    value,
    required,
    disabled,
    schema,
  } = props;
  const { className, labelPlacement = "inside", size = "sm" } = options;
  const placeholder = props.placeholder || options.placeholder;
  return (
    <Input
      className={cn("w-full", className)}
      label={label}
      placeholder={placeholder}
      value={value}
      defaultValue=""
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

