import React, { useCallback, useState } from "react";
import { WidgetProps } from "@rjsf/utils";
import { Select, SelectItem, SelectProps, SelectSlots, SlotsToClasses } from "@nextui-org/react";
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  nextuiClassNames?: SlotsToClasses<SelectSlots>;
  listboxProps?: SelectProps['listboxProps'];
  labelPlacement?: SelectProps["labelPlacement"];
  placeholder?: string;
  size: SelectProps["size"];
  color?: SelectProps["color"];
  variant?: SelectProps["variant"];
  radius?: SelectProps["radius"];
  description?: string;
};

export interface SelectWidgetProps extends WidgetProps {
  options: Options;
}

export interface SelectWidgetUIOptions {
  "ui:widget": (props: SelectWidgetProps) => JSX.Element;
  "ui:options": Options;
}

export function SelectWidget(props: SelectWidgetProps) {
  const { onChange, options, label, value, required, disabled, uiSchema } = props;
  const {
    className,
    nextuiClassNames = {
      popoverContent: 'rounded-lg shadow-md border dark:border-[#3e3e3e]',
    },
    listboxProps = {
      itemClasses: {
        base: [
          'rounded-lg',
          'text-default-500',
          'transition-opacity',
          'data-[hover=true]:text-foreground',
          'data-[hover=true]:bg-default-100',
          'dark:data-[hover=true]:bg-default-50',
          'data-[selectable=true]:focus:bg-default-50',
          'data-[pressed=true]:opacity-70',
          'data-[focus-visible=true]:ring-default-500',
        ],
      },
    },
    labelPlacement = 'inside',
    size = 'sm',
    color,
    variant,
    radius,
    description,
  } = options;
  const { selectOptions = [], requiredErrMsg, validate } = uiSchema;
  const placeholder = uiSchema['ui:options']?.placeholder;
  const [errMsg, setErrMsg] = useState<string>('');
  const isInvalid = !!errMsg;
  const checkValue = useCallback((value) => {
    if (!value && required) {
      setErrMsg(requiredErrMsg || 'This field is required');
      return;
    }
    if (validate) {
      const errMsg = validate(value);
      setErrMsg(errMsg);
      return;
    }
    setErrMsg('');
  }, []);

  return (
    <Select
      label={label?.trim()}
      className={cn('w-full', className)}
      classNames={nextuiClassNames}
      labelPlacement={labelPlacement}
      placeholder={placeholder}
      size={size}
      isRequired={required}
      isDisabled={disabled}
      isInvalid={isInvalid}
      description={description}
      listboxProps={listboxProps}
      variant={variant}
      radius={radius}
      color={isInvalid ? 'danger' : color}
      errorMessage={isInvalid && errMsg}
      selectedKeys={[value]}
      onSelectionChange={(v) => {
        const keys = Array.from(v) as string[];
        const _v = keys[0];
        onChange(_v);
        checkValue(_v);
      }}
    >
      {selectOptions.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}


