import React from "react";
import { WidgetProps } from "@rjsf/utils";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  labelPlacement?: "top" | "left";
  size: "sm" | "md" | "lg";
  placeholder?: string;
};

export interface SelectWidgetProps extends WidgetProps {
  options: Options;
}

export interface SelectWidgetUIOptions {
  "ui:widget": (props: SelectWidgetProps) => JSX.Element;
  "ui:options": Options;
}

function SelectWidget({
  onChange,
  options,
  id,
  label,
  value,
  required,
  disabled,
  schema,
}: SelectWidgetProps) {
  const { className, labelPlacement = "top", placeholder = 'Select an option' } = options;
  const { selectOptions = [], description } = schema;
  return (
    <div className={cn("", className)}>
      <div
        className={cn("flex flex-col", {
          "flex-row items-center": labelPlacement === "left",
        })}
        id={id}
      >
        {label && (
          <label
            className={cn("flex items-center text-sm", {
              "mb-2": labelPlacement === "top",
              "mr-2": labelPlacement === "left",
            })}
          >
            {label}
            {required && <span className="font-bold text-red-600">*</span>}
          </label>
        )}
        <select className="w-full p-3 text-sm rounded-md bg-[#F4F4F5] dark:bg-[#27272A]" defaultValue={value} onChange={(event) => onChange(event.target.value)}>
          <option value="" disabled selected>{placeholder}</option>
          {selectOptions.map((item) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
      {description && <div className="mb-2 text-xs">{description}</div>}
    </div>
  );
}

export default SelectWidget;
