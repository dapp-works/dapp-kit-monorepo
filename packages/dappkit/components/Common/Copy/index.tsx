import React, { useEffect, useState } from "react";
import copyToClipboard from "copy-to-clipboard";
import { Copy as CopyIcon, CopyCheck } from "lucide-react";
import { cn } from "../../../lib/utils";

export const Copy = ({
  className = '',
  value,
  iconSize = 20,
  iconClassName = ''
}: {
  className?: string;
  value: string;
  iconSize?: number,
  iconClassName?: string
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  return (
    <button
      className={cn("rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-600", className)}
      onClick={(e) => {
        e.preventDefault();
        copyToClipboard(value);
        setCopied(true);
      }}>
      {copied ? <CopyCheck size={iconSize} className={iconClassName} /> : <CopyIcon size={iconSize} className={iconClassName} />}
    </button>
  );
}
