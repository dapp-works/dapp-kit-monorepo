// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DatePicker, DatePickerProps } from '@nextui-org/react';
import { RJSFSchema, Widget, WidgetProps } from "@rjsf/utils";
import { DateValue, parseAbsoluteToLocal } from '@internationalized/date';
import { cn } from "../../../lib/utils";
import { getStyle } from "../../../themes";

type Options = {
  className?: string;
  nextuiClassNames?: Record<"base" | "selectorButton" | "selectorIcon" | "popoverContent" | "calendar" | "calendarContent" | "timeInputLabel" | "timeInput", string>;
  dateInputClassNames?: Record<
    | "base"
    | "label"
    | "inputWrapper"
    | "innerWrapper"
    | "input"
    | "helperWrapper"
    | "description"
    | "errorMessage",
    string
  >;
  size: DatePickerProps["size"];
  labelPlacement?: DatePickerProps["labelPlacement"];
  color: DatePickerProps["color"];
  granularity?: DatePickerProps["granularity"];
  variant?: DatePickerProps['variant'];
  description?: string;
};

export interface DatePickerWidgetProps extends WidgetProps {
  options: Options;
}

export interface DatePickerWidgetUIOptions {
  'ui:widget': (props: DatePickerWidgetProps) => string | Widget<any, RJSFSchema, any> | undefined;
  'ui:options': Options;
}

export function DatePickerWidget({ label, options, value, required, disabled, uiSchema, onChange }: DatePickerWidgetProps) {
  const {
    className,
    nextuiClassNames = { calendarContent: 'min-w-fit' },
    dateInputClassNames,
    labelPlacement = 'inside',
    size = 'sm',
    granularity = 'day',
    color = 'default',
    description,
    variant,
  } = options;
  const [date, setDate] = useState<DateValue>();
  const { requiredErrMsg, validate, theme } = uiSchema;
  const isFirstChecked = useRef(true);
  const dateInputStyle = useMemo(() => {
    const themeStyle = getStyle(theme || 'default', 'DatePickerWidget');
    return {
      ...themeStyle.dateInputClassNames,
      ...dateInputClassNames
    }
  }, [theme, dateInputClassNames]);

  useEffect(() => {
    if (value) {
      try {
        const ISOStr = new Date(value).toISOString();
        const v = parseAbsoluteToLocal(ISOStr);
        setDate(v);
      } catch (error) {
        console.log('error', error.message);
      }
    }
  }, [value]);

  return (
    <DatePicker
      showMonthAndYearPickers
      className={cn('w-full', className)}
      classNames={nextuiClassNames}
      dateInputClassNames={dateInputStyle}
      label={label}
      size={size}
      labelPlacement={labelPlacement}
      color={color}
      granularity={granularity}
      variant={variant}
      value={date}
      isRequired={required}
      description={description || ''}
      isDisabled={disabled}
      onChange={(dateValue) => {
        if (dateValue) {
          const v = dateValue.toDate('GMT').toISOString();
          onChange(v);
        }
      }}
      validate={() => {
        if (isFirstChecked.current) {
          isFirstChecked.current = false;
          return true;
        }
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
