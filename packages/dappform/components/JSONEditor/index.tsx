"use client";

import React, { useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { _ } from "../../lib/lodash";
import * as jsonpatch from "fast-json-patch";
import { cn } from "../../lib/utils";
import { Button } from '@nextui-org/react';

export const Editor = ({ className, height = "100%", initialJson, onChange, onSubmit }: { className?: string; height?: string | number; initialJson: string; onChange?: (value: Record<string, any>) => void; onSubmit?: (value: Record<string, any>) => void }) => {
  const valueRef = useRef<string>(initialJson);
  const changeValueRef = useRef(
    _.debounce((initialJson: string, currentJson: string) => {
      if (onChange) {
        try {
          const tree1 = JSON.parse(initialJson);
          const tree2 = JSON.parse(currentJson);
          const diff = jsonpatch.compare(tree1, tree2);
          // @ts-ignore
          const applyDiff = (diff) => {
            const result = {};
            for (const change of diff) {
              const { op, path, value } = change;
              // @ts-ignore
              const keys = path.split("/").filter((key) => key !== "");
              let current = result;
              for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                // @ts-ignore
                if (!current[key]) {
                  // @ts-ignore
                  current[key] = {};
                }
                // @ts-ignore
                current = current[key];
              }
              let lastKey = keys[keys.length - 1];
              lastKey = lastKey.replace('~1', '/');
              if (op === "replace") {
                // @ts-ignore
                current[lastKey] = value;
              }
              if (op === "add") {
                // @ts-ignore
                current[lastKey] = value;
              }
            }
            return result;
          };
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
    <div className={cn("relative w-full", className)}>
      <MonacoEditor
        options={{
          minimap: {
            enabled: false,
          },
        }}
        height={height}
        theme="vs-dark"
        language="json"
        value={initialJson}
        onChange={(v) => {
          changeValueRef.current?.(initialJson, v);
          // @ts-ignore
          valueRef.current = v;
        }}
      />
      {onSubmit && (
        <Button
          className="z-50 absolute bottom-[50px] right-[20px]"
          color='primary'
          size='sm'
          onClick={() => {
            try {
              const json = JSON.parse(valueRef.current);
              onSubmit(json);
            } catch (error) {
              console.error(error);
            }
          }}>
          Submit
        </Button>
      )}
    </div>
  );
};

