import React, { useCallback } from 'react';
import { WidgetProps } from '@rjsf/utils';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { api } from '@/dappkit/lib/trpc';

type Options = {};

export interface SelectUserWidgetProps extends WidgetProps {
  options: Options;
}

export interface SelectUserWidgetUIOptions {
  'ui:widget': (props: SelectUserWidgetProps) => JSX.Element;
  'ui:options': Options;
}

const loadOptions = async (
  inputValue: string,
  callback: (options: { value: string; label: string }[]) => void,
) => {
  if (!inputValue) {
    return;
  }
  const users = await api.user.getUsersByEmail.query({
    email: inputValue,
  });
  const values = users.map((user) => ({
    value: user.id,
    label: user.email,
  }));
  callback(values);
};

function SelectUserWidget({ onChange }: SelectUserWidgetProps) {
  const loadOptionsDebounced = useCallback(debounce(loadOptions, 1000), []);
  const handleChange = useCallback((v) => onChange(v.value), [onChange]);

  return (
    <AsyncSelect
      placeholder="Enter email"
      cacheOptions
      //@ts-ignore
      loadOptions={loadOptionsDebounced}
      onChange={handleChange}
    />
  );
}

export default SelectUserWidget;
