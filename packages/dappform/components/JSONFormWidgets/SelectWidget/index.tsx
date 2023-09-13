import React, { useEffect } from "react";
import { WidgetProps } from "@rjsf/utils";
import { cn } from "../../../lib/utils";
import { Select, SelectItem } from "@nextui-org/react";

type Options = {
  className?: string;
  labelPlacement?: "top" | "left";
  size: "sm" | "md" | "lg";
  placeholder?: string;
  customProps?: any
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
  const { className, labelPlacement = "top", placeholder = 'Select an option', size, customProps } = options;
  const { selectOptions = [], description } = schema;
  useEffect(() => {
    if (!value && selectOptions.length > 0) {
      onChange(selectOptions[0].value);
    }
  }, [selectOptions]);
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
        {/* <select
          className="w-full rounded-md bg-[#F4F4F5] p-3 text-sm dark:bg-[#27272A]"
          defaultValue={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {selectOptions.map((item) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select> */}
        {/* @ts-ignore  */}
        <Select
          size={size}
          items={selectOptions}
          placeholder={placeholder}
          className="max-w-xs"
          defaultValue={value}
          onChange={(event) => onChange(event.target.value)}
          {...customProps}
        >
          {selectOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      {description && <div className="mb-2 text-xs">{description}</div>}
    </div>
  );
}

export default SelectWidget;
