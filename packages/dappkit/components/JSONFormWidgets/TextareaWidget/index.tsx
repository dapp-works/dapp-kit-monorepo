import React from 'react';
import { Textarea } from '@nextui-org/react';
import { WidgetProps } from '@rjsf/utils';
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  size: 'sm' | 'md' | 'lg',
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
};

export interface TextareaWidgetProps extends WidgetProps {
  options: Options;
}

export interface TextareaWidgetUIOptions {
  'ui:widget': (props: TextareaWidgetProps) => JSX.Element;
  'ui:options': Options;
}

export function TextareaWidget(props: TextareaWidgetProps) {
  const { onChange, options, label, value, required, disabled, schema } = props;
  const { className, labelPlacement = 'inside', size = 'md', minRows = 2, maxRows = 8 } = options;
  const placeholder = props.placeholder || options.placeholder;
  return (
    <Textarea
      className={cn('w-full', className)}
      label={label}
      placeholder={placeholder}
      value={value}
      isRequired={required}
      isDisabled={disabled}
      minRows={minRows}
      maxRows={maxRows}
      size={size}
      labelPlacement={labelPlacement}
      description={schema.description || ''}
      onChange={e => onChange(e.target.value)}
    />
  );
}
