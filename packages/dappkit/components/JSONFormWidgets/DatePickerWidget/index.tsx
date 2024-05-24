import React, { useEffect, useState } from "react";
import { DateInputProps, DatePicker, DatePickerProps, DatePickerSlots, SlotsToClasses } from '@nextui-org/react';
import { RJSFSchema, Widget, WidgetProps } from "@rjsf/utils";
import { DateValue, parseAbsoluteToLocal } from '@internationalized/date';
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  nextuiClassNames?: SlotsToClasses<DatePickerSlots> & DateInputProps<any>["classNames"];
  size: DatePickerProps["size"];
  labelPlacement?: DatePickerProps["labelPlacement"];
  color: DatePickerProps["color"];
  granularity?: DatePickerProps["granularity"];
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
  const { className, nextuiClassNames = { calendarContent: 'min-w-fit', }, labelPlacement = 'inside', size = 'sm', granularity = 'day', color = 'default', description } = options;
  const [date, setDate] = useState<DateValue>();
  const { requiredErrMsg, validate } = uiSchema;

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
      label={label}
      size={size}
      labelPlacement={labelPlacement}
      color={color}
      granularity={granularity}
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
