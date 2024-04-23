import React from "react";
import { Checkbox } from "@nextui-org/react";
import { WidgetProps } from "@rjsf/utils";
import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  size: 'sm' | 'md' | 'lg';
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

export interface CheckboxWidgetProps extends WidgetProps {
  options: Options;
}

export interface CheckboxWidgetUIOptions {
  "ui:widget": (props: CheckboxWidgetProps) => JSX.Element;
  "ui:options": Options;
}

export function CheckboxWidget({
  onChange,
  options,
  label,
  value,
  disabled,
  schema,
}: CheckboxWidgetProps) {
  const { size = 'sm', color = 'primary' } = options;
  const { description } = schema;

  return (
    <>
      <Checkbox
        classNames={{
          base: cn(
            'm-0 flex items-center justify-start w-full',
            'cursor-pointer rounded-lg gap-2 p-2.5 bg-content2 border-1 border-transparent',
            value ? `border-${color}` : '',
          ),
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
      >
        {label}
      </Checkbox>
      {description && <div className="mt-1 text-xs text-[#A1A1A9] dark:text-[#717179]">{description}</div>}
    </>
  );
}

