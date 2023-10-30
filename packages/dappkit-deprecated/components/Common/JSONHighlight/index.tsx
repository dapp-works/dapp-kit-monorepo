import React from "react";
import { cn } from "../../../lib/utils";

export default function JSONHighlight({ jsonStr, className }: { jsonStr: string, className?: string }) {
  if (!jsonStr) return null;
  jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const str = jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    // number
    let cls = 'text-blue-500';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        // key
        cls = 'text-gray-700 dark:text-gray-400';
      } else {
        // string
        cls = 'text-green-600';
      }
    } else if (/true|false/.test(match)) {
      // boolean
      cls = 'text-purple-500';
    } else if (/null/.test(match)) {
      // null
      cls = 'text-red-400';
    }
    return `<span class="${cls}">${match}</span>`;
  });

  return (
    <pre className={cn('w-full overflow-auto text-xs font-bold', className)} dangerouslySetInnerHTML={{ __html: str }} />
  )
}
