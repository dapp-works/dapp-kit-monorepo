import React, { ReactNode, useMemo, useRef } from 'react';
import { InputProps, InputSlots, SlotsToClasses, Textarea } from '@nextui-org/react';
import { WidgetProps } from '@rjsf/utils';
import { cn } from "../../../lib/utils";
import { getStyle } from '../../../themes';

type Options = {
  className?: string;
  nextuiClassNames?: SlotsToClasses<InputSlots>;
  labelPlacement?: InputProps['labelPlacement'];
  size: InputProps['size'];
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
  color?: InputProps["color"];
  variant?: InputProps["variant"];
  radius?: InputProps["radius"];
  startContent?: ReactNode;
  endContent?: ReactNode;
  description?: string;
};
// @ts-ignore 
export interface TextareaWidgetProps extends WidgetProps {
  options: Options;
}

export interface TextareaWidgetUIOptions {
  'ui:widget': (props: TextareaWidgetProps) => JSX.Element;
  'ui:options': Options;
}

export function TextareaWidget(props: TextareaWidgetProps) {
  const { onChange, options, label, value, required, disabled, uiSchema } = props;
  const {
    className,
    nextuiClassNames = {
      inputWrapper: 'rounded-lg shadow-none border dark:border-[#2c2c2c] !bg-transparent data-[hover=true]:!bg-default-50 group-data-[focus=true]:!bg-transparent',
    },
    labelPlacement = 'inside',
    size = 'md',
    minRows = 3,
    maxRows = 8,
    color,
    variant,
    radius,
    startContent,
    endContent,
    description,
  } = options;
  const { requiredErrMsg, validate, theme } = uiSchema;
  const placeholder = uiSchema['ui:options']?.placeholder;
  const isFirstChecked = useRef(true);
  const classNames = useMemo(() => {
    const themeStyle = getStyle(theme || 'default', 'InputWidget');
    return {
      ...themeStyle.classNames,
      ...nextuiClassNames
    }
  }, [theme, nextuiClassNames]);

  return (
    <Textarea
      className={cn('w-full', className)}
      classNames={classNames}
      label={label}
      placeholder={placeholder}
      value={value}
      isRequired={required}
      isDisabled={disabled}
      minRows={minRows}
      maxRows={maxRows}
      size={size}
      labelPlacement={labelPlacement}
      description={description}
      color={color}
      variant={variant}
      radius={radius}
      startContent={startContent}
      endContent={endContent}
      onChange={(e) => onChange(e.target.value)}
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
