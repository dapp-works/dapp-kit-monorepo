import React from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import copy from "copy-to-clipboard";
import { observer, useLocalStore } from "mobx-react-lite";

interface IProps {
  value: string;
}
export const Copy = observer(({ value }: IProps) => {
  const store = useLocalStore(() => ({
    copied: false,
    toggleIOTipOpen(val: boolean) {
      this.isTipOpen = val;
    },
  }));

  return (
    <div>
      {store.copied ? (
        <CheckIcon className="text-green-400" />
      ) : (
        <CopyIcon
          className="text-primary-foreground cursor-pointer"
          onClick={async () => {
            copy(value);
            store.copied = true;
            setTimeout(() => {
              store.copied = false;
            }, 900);
          }}
        />
      )}
    </div>
  );
});
