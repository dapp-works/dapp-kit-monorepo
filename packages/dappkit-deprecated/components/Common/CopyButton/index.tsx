import React, { useEffect, useState } from "react";
import copyToClipboard from "copy-to-clipboard";
import { Copy, CopyCheck } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function CopyButton({ className, value }: { className?: string; value: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  return (
    <button
      className={cn("rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-600", className)}
      onClick={() => {
        copyToClipboard(value);
        setCopied(true);
      }}>
      {copied ? <CopyCheck size={20} /> : <Copy size={20} />}
    </button>
  );
}
