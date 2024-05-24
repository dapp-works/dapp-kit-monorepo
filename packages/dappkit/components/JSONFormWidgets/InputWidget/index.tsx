import React, { ReactNode } from "react";
import { Input, InputProps, InputSlots, SlotsToClasses } from "@nextui-org/react";
import { WidgetProps } from "@rjsf/utils";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  nextuiClassNames?: SlotsToClasses<InputSlots>;
  labelPlacement?: InputProps["labelPlacement"];
  size: InputProps["size"];
  placeholder?: string;
  inputType?: 'text' | 'number' | 'password';
  color?: InputProps["color"];
  variant?: InputProps["variant"];
  radius?: InputProps["radius"];
  startContent?: ReactNode;
  endContent?: ReactNode;
  description?: string;
};

export interface InputWidgetProps extends WidgetProps {
  options: Options;
}

export interface InputWidgetUIOptions {
  "ui:widget": (props: InputWidgetProps) => JSX.Element;
  "ui:options": Options;
}

export function InputWidget(props: InputWidgetProps) {
  const { onChange, options, label, value, required, disabled, uiSchema } = props;
  const { className, nextuiClassNames, labelPlacement = 'inside', size = 'sm', inputType = 'text', placeholder, color, variant, radius, startContent, endContent, description } = options;
  const { requiredErrMsg, validate } = uiSchema;
  return (
    <Input
      className={cn('w-full', className)}
      classNames={nextuiClassNames}
      label={label}
      placeholder={placeholder}
      value={value}
      isRequired={required}
      isDisabled={disabled}
      size={size}
      labelPlacement={labelPlacement}
      description={description}
      type={inputType}
      color={color}
      variant={variant}
      radius={radius}
      startContent={startContent}
      endContent={endContent}
      onChange={(e) => onChange(e.target.value)}
      validate={() => {
        if (value === '' && required) {
          return requiredErrMsg || 'This field is required';
        }
        if (validate) {
          const errMsg = validate(value);
          return errMsg;
        }
        return true;
      }}
    />
  );
}

