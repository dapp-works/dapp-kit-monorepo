import React, { useCallback, useMemo, useState } from 'react';
import { Chip, Select, SelectItem, SelectProps, SelectedItems } from '@nextui-org/react';
import { WidgetProps } from '@rjsf/utils';
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  nextuiClassNames?: SelectProps['classNames'];
  labelPlacement?: SelectProps['labelPlacement'];
  listboxProps?: SelectProps['listboxProps'];
  size: SelectProps['size'];
  color?: SelectProps['color'];
  placeholder?: string;
  description?: string;
  renderValue?: (
    items: SelectedItems<{
      label: string;
      value: string;
    }>,
  ) => React.ReactNode;
};

export interface MultipleSelectWidgetProps extends WidgetProps {
  options: Options;
}

export interface MultipleSelectWidgetUIOptions {
  'ui:widget': (props: MultipleSelectWidgetProps) => JSX.Element;
  'ui:options': Options;
}

export function MultipleSelectWidget(props: MultipleSelectWidgetProps) {
  const { onChange, options, label, value, required, uiSchema = {} } = props;
  const { selectOptions = [], requiredErrMsg, validate } = uiSchema;
  const {
    className,
    nextuiClassNames = {
      base: 'w-full',
      trigger: 'min-h-12 py-1 rounded-lg bg-transparent shadow-none border dark:border-[#2c2c2c] data-[hover=true]:bg-default-50',
      popoverContent: 'rounded-lg shadow-md border dark:border-[#3e3e3e]',
    },
    labelPlacement = 'inside',
    listboxProps = {},
    size = 'sm',
    color,
    description,
    renderValue = DefaultRenderValue
  } = options;
  const placeholder = uiSchema['ui:options']?.placeholder || 'Select an option';
  const selectedKeys = useMemo(() => {
    return value ? value.split(',') : [];
  }, [value]);
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
      className={cn('w-full', className)}
      label={label}
      isMultiline
      selectionMode="multiple"
      labelPlacement={labelPlacement}
      size={size}
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      isRequired={required}
      color={isInvalid ? 'danger' : color}
      errorMessage={isInvalid && errMsg}
      onSelectionChange={(v) => {
        const keys = Array.from(v) as string[];
        const _v = keys.join(',');
        onChange(_v);
        checkValue(_v);
      }}
      items={selectOptions}
      classNames={nextuiClassNames}
      listboxProps={{
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
        ...listboxProps
      }}
      description={description}
      renderValue={renderValue}
    >
      {selectOptions.map((item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}

function DefaultRenderValue(
  items: SelectedItems<{
    label: string;
    value: string;
  }>,
) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip color="secondary" size="sm" key={item.key}>
          {item.textValue}
        </Chip>
      ))}
    </div>
  );
}
