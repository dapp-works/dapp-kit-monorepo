import React, { useState } from "react";
import { WidgetProps } from "@rjsf/utils";
import { Button } from "@nextui-org/react";
import { cn } from "../../../lib/utils";
import MonacoEditor from "@monaco-editor/react";



type Options = {
  editorHeight?: string;
  readOnly?: boolean;
  language?: string;
  languageSelectorOptions?: { label: string; value: string }[];
  onChangeLanguage?: (v: string) => void;
  onRun?: (v: string) => void;
};

export interface EditorWidgetProps extends WidgetProps {
  options: Options;
}

export type EditorWidgetUIOptions = {
  "ui:widget": (props: EditorWidgetProps) => JSX.Element;
  "ui:options": Options;
};

const EditorWidget = ({ id, label, options = {}, value, required, schema, onChange }: EditorWidgetProps) => {
  const { editorHeight = '200px', readOnly = false, language = 'json', languageSelectorOptions = [], onChangeLanguage, onRun } = options;
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [runLoading, setRunLoading] = useState(false);
  const showLanguageSelector = languageSelectorOptions.length > 0;

  return (
    <div className='flex flex-col relative'>
      <div className={cn('flex justify-between items-center', { 'mb-[10px]': label.trim() || showLanguageSelector })}>
        {label && (
          <label
            className="mr-2 flex items-center text-sm"
          >
            {label}
            {required && <span className="font-bold text-red-600">*</span>}
          </label>
        )}
        {showLanguageSelector && (
          <select
            className="w-full p-3 text-sm rounded-md bg-[#F4F4F5] dark:bg-[#27272A]"
            value={selectedLanguage}
            onChange={(event) => {
              const v = event.target.value;
              setSelectedLanguage(v);
              onChangeLanguage && onChangeLanguage(v);
            }}
          >
            {languageSelectorOptions.map((item) => {
              return <option key={item.value} value={item.value}>{item.label}</option>
            })}
          </select>
        )}
      </div>
      {schema.description && <div className='mb-2 text-xs text-[#A1A1A9]'>{schema.description}</div>}
      <div className="rounded-lg overflow-hidden">
        <MonacoEditor
          options={{ readOnly, minimap: { enabled: false } }}
          height={editorHeight}
          theme="vs-dark"
          language={selectedLanguage ? selectedLanguage : language}
          value={value}
          onChange={(v) => onChange(v)}
        />
      </div>
      {onRun && (
        <Button
          className="absolute bottom-2 right-4"
          size="sm"
          isLoading={runLoading}
          onClick={async () => {
            setRunLoading(true);
            await onRun(value);
            setRunLoading(false);
          }}
        >
          Run
        </Button>
      )}
    </div>
  );
};

export default EditorWidget;
