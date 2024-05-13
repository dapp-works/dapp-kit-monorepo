import React from "react";
import { WidgetProps } from "@rjsf/utils";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  labelPlacement?: "top" | "left";
  placeholder?: string;
};

export interface SelectWidgetProps extends WidgetProps {
  options: Options;
}

export interface SelectWidgetUIOptions {
  "ui:widget": (props: SelectWidgetProps) => JSX.Element;
  "ui:options": Options;
}

export function SelectWidget(props: SelectWidgetProps) {
  const { onChange, options, label, value, required, disabled, schema } = props;
  const { className, labelPlacement = 'top', placeholder = 'Select an option' } = options;
  const { selectOptions = [], description } = schema;
  const labelText = label?.trim();
  const placeholderText = props.placeholder || placeholder;

  return (
    <div className={cn("", className)}>
      <div
        className={cn("flex flex-col", {
          "flex-row items-center": labelPlacement === "left",
        })}
      >
        {labelText && (
          <label
            className={cn("flex items-center text-sm whitespace-nowrap", {
              "mb-2": labelPlacement === "top",
              "mr-2": labelPlacement === "left",
            })}
          >
            {labelText}
            {required && <span className="ml-[2px] font-bold text-red-600">*</span>}
          </label>
        )}
        {description && labelPlacement === "top" && <div className="mb-2 text-xs text-[#A1A1A9] dark:text-[#717179]">{description}</div>}
        <select className="w-full py-3.5 px-2 text-sm rounded-md bg-[#F4F4F5] dark:bg-[#27272A]" defaultValue={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
          <option value="" disabled selected>
            {placeholderText}
          </option>
          {selectOptions.map((item) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

