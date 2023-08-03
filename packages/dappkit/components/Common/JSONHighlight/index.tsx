import { cn } from "@/dappkit/lib/utils";

export default function JSONHighlight({ jsonStr, className }: { jsonStr: string, className?: string }) {
  if (!jsonStr) return null;
  jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const str = jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return `<span class="${cls}">${match}</span>`;
  });

  return (
    <pre className={cn('w-full overflow-auto text-xs', className)} dangerouslySetInnerHTML={{ __html: str }} />
  )
}
