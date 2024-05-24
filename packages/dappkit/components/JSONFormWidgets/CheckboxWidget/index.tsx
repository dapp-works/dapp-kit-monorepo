import React, { useState } from "react";
import { Checkbox, CheckboxProps } from "@nextui-org/react";
import { WidgetProps } from "@rjsf/utils";
import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  size: CheckboxProps["size"];
  color: CheckboxProps["color"];
  description?: string;
  descriptionClassName?: string;
};

export interface CheckboxWidgetProps extends WidgetProps {
  options: Options;
}

export interface CheckboxWidgetUIOptions {
  "ui:widget": (props: CheckboxWidgetProps) => JSX.Element;
  "ui:options": Options;
}

export function CheckboxWidget({
  onChange, options, label, value, disabled, uiSchema
}: CheckboxWidgetProps) {
  const { className, size = 'sm', color = 'primary', description, descriptionClassName } = options;
  const { validate } = uiSchema;
  const [errMsg, setErrMsg] = useState<string>('');
  const isInvalid = !!errMsg;

  return (
    <>
      <Checkbox
        className={cn('w-full', className)}
        classNames={{
          base: cn('m-0 flex items-center justify-start w-full', 'cursor-pointer rounded-lg gap-2 p-[13px] bg-content2 border-1 border-transparent', value ? `border-${color}` : ''),
        }}
        defaultSelected={value}
        isDisabled={disabled}
        icon={<Check className="bg-white dark:bg-black" />}
        color={color}
        size={size}
        onChange={(e: any) => {
          const checked = e.target.checked;
          onChange(checked);
        }}
        onBlur={() => {
          if (validate) {
            const errMsg = validate(value);
            setErrMsg(errMsg);
            return;
          }
          setErrMsg('');
        }}
      >
        {label}
      </Checkbox>
      {description && <div className={cn('mt-1 text-xs text-[#A1A1A9] dark:text-[#717179]', descriptionClassName)}>{description}</div>}
      {isInvalid && <div className="mt-2 text-xs text-[#DF3562]">{errMsg}</div>}
    </>
  );
}

