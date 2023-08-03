import React, { useCallback, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import MonacoEditor from '@monaco-editor/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/dappkit/components/ui/select';

type Options = {
  emptyValue?: string;
  editorHeight?: string;
  readOnly?: boolean;
  language?: string;
  showLanguageSelector?: boolean;
  languageSelectorOptions?: { label: string; value: string }[];
  onChangeLanguage?: (v: string) => void;
};

export interface EditorWidgetProps extends WidgetProps {
  options: Options;
}

export type EditorWidgetUIOptions = {
  'ui:widget': (props: EditorWidgetProps) => JSX.Element;
  'ui:options': Options;
};

const EditorWidget = ({ id, label, options = {}, value, required, onChange }: EditorWidgetProps) => {
  const { emptyValue, editorHeight = '200px', readOnly = false, language = 'json', showLanguageSelector = false, languageSelectorOptions = [], onChangeLanguage } = options;
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const handleChange = useCallback(
    (value) => {
      onChange(value === '' ? (emptyValue ? emptyValue : '') : value);
    },
    [onChange, emptyValue]
  );

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center mb-[10px]'>
        {/* <div className="flex items-center">
          <div>{label}</div>
          {required && (
            <div className="ml-1 text-red-500 ">
              *
            </div>
          )}
        </div> */}
        {showLanguageSelector && (
          <Select
            value={selectedLanguage}
            onValueChange={(v) => {
              setSelectedLanguage(v);
              onChangeLanguage && onChangeLanguage(v);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  languageSelectorOptions.map((item, index) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <MonacoEditor
        options={{ readOnly }}
        height={editorHeight}
        theme="vs-dark"
        language={showLanguageSelector ? selectedLanguage : language}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default EditorWidget;
