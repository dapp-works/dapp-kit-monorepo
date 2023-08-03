import MonacoEditor from '@monaco-editor/react';
import { useRef } from 'react';
import { _ } from '@/dappkit/lib/lodash';
import * as jsonpatch from 'fast-json-patch';
import { cn } from '@/dappkit/lib/utils';
import { Button } from '../ui/button';

const Editor = ({
  className,
  height = '100%',
  initialJson,
  onChange,
  onSubmit,
}: {
  className?: string;
  height?: string | number;
  initialJson: string;
  onChange?: (value: Record<string, any>) => void;
  onSubmit?: (value: Record<string, any>) => void;
}) => {
  const valueRef = useRef<string>(initialJson);
  const changeValueRef = useRef(
    _.debounce((initialJson: string, currentJson: string) => {
      if (onChange) {
        try {
          const tree1 = JSON.parse(initialJson);
          const tree2 = JSON.parse(currentJson);
          const diff = jsonpatch.compare(tree1, tree2);
          const applyDiff = (diff) => {
            const result = {};
            for (const change of diff) {
              const { op, path, value } = change;
              // 将路径拆分为键数组
              const keys = path.split('/').filter(key => key !== '');
              let current = result;
              for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key]) {
                  // 如果路径上的键不存在，则创建一个空对象
                  current[key] = {};
                }
                current = current[key];
              }
              const lastKey = keys[keys.length - 1];
              if (op === 'replace') {
                // 替换最后一个键的值
                current[lastKey] = value;
              }
              if (op === 'add') {
                // 添加最后一个键
                current[lastKey] = value;
              }
            }
            return result;
          }
          const result = applyDiff(diff);
          if (Object.keys(result).length > 0) {
            onChange(result);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000)
  );


  return (
    <div className={cn('relative w-full', className)}>
      <MonacoEditor
        options={{
          minimap: {
            enabled: false
          }
        }}
        height={height}
        theme="vs-dark"
        language="json"
        value={initialJson}
        onChange={(v) => {
          changeValueRef.current?.(initialJson, v);
          valueRef.current = v;
        }}
      />
      {onSubmit && (
        <Button
          className='z-50 absolute bottom-[50px] right-[20px]'
          variant='secondary'
          size='sm'
          onClick={() => {
            try {
              const json = JSON.parse(valueRef.current);
              onSubmit(json);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Submit
        </Button>
      )}
    </div>
  )
}

export default Editor;