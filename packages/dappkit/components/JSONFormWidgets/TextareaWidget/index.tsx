import React from 'react';
import { Textarea } from '@nextui-org/react';
import { WidgetProps } from '@rjsf/utils';
import { cn } from "../../../lib/utils";

type Options = {
  className?: string;
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  size: 'sm' | 'md' | 'lg',
  maxRows?: number;
};

export interface TextareaWidgetProps extends WidgetProps {
  options: Options;
}

export interface TextareaWidgetUIOptions {
  'ui:widget': (props: TextareaWidgetProps) => JSX.Element;
  'ui:options': Options;
}

function TextareaWidget({ onChange, options, id, label, value, required, disabled, schema }: TextareaWidgetProps) {
  const { className, labelPlacement = 'inside', size = 'md', maxRows = 8 } = options;
  return (
    <Textarea
      id={id}
      className={cn('w-full', className)}
      label={label}
      placeholder=""
      value={value}
      isRequired={required}
      isDisabled={disabled}
      minRows={3}
      maxRows={maxRows}
      size={size}
      labelPlacement={labelPlacement}
      description={schema.description || ''}
      type={schema.inputType || 'text'}
      onChange={e => onChange(e.target.value)}
    />
  );
}

export default TextareaWidget;
