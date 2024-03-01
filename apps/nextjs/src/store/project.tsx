import { observer } from "mobx-react-lite";
import React from "react";
import { rootStore, Store, helper, PromiseState } from "@dappworks/kit";
import { StoragePlugin } from "@dappworks/kit/experimental"
import { signIn } from "next-auth/react";


export class Project implements Store {
  sid = 'project';
  autoObservable?: boolean = false;
  title = StoragePlugin.Get({ key: "project.title", value: "@dappworks/kit", engine: StoragePlugin.engines.memory })
  description = StoragePlugin.Get({ key: "project.description", value: "This is dapp kit template project", engine: StoragePlugin.engines.memory })
  script = StoragePlugin.Get({ key: "project.script", value: "console.log('from script')", engine: StoragePlugin.engines.memory })
  body = StoragePlugin.Get({ key: "project.body", value: "", engine: StoragePlugin.engines.memory })

  data = new PromiseState({
    context: this,
    value: { test: "123" },
    function: async () => {
      return { test: "123" }
    },
  })


  static Copy = observer(({ text, className, ...props }: { [key: string]: any }) => {
    const copied = StoragePlugin.Get({ key: "copied", defaultValue: false })
    return (<div className={"flex items-center justify-center w-8 h-8 rounded-lg p-1 hover:bg-gray-300"} onClick={(e) => {
      e.stopPropagation();
      helper.string.copy(text);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1000)
    }}>
      {!copied.value ? <svg
        fill="none"
        height={20}
        shapeRendering="geometricPrecision"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        width={20}
      >
        <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z" />
      </svg> : <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z" />
      </svg>}
    </div >)
  })

  slots = {
    Logo: {
      render: () => {
        return <div className="flex items-center">
          <div className="text-lg font-bold">Custom Logo in store/project/slots</div>
        </div>
      }
    }
  }
}