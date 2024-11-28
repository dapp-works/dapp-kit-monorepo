import React from 'react';
import { Inspector, InspectParams } from 'react-dev-inspector';
import { Store } from '../../store/standard/base';

export class DevInspectorPlugin implements Store {
  sid = 'DevInspectorPlugin';
  stype = "Plugin"
  autoObservable = false;
  disabled = false;
  editor: 'vscode' | 'cursor' = 'vscode';

  constructor(args: Partial<DevInspectorPlugin> = {}) {
    Object.assign(this, args);
  }

  provider = () => {
    return (
      <Inspector
        // props see docs:
        // https://github.com/zthxxx/react-dev-inspector#inspector-component-props
        keys={['control', 'shift', 'command', 'c']}
        disableLaunchEditor={true}
        onClickElement={({ codeInfo }: InspectParams) => {
          if (!codeInfo?.absolutePath) return
          const { absolutePath, lineNumber, columnNumber } = codeInfo
          // you can change the url protocol if you are using in Web IDE
          window.open(`${this.editor}://file/${absolutePath}:${lineNumber}:${columnNumber}`)
        }}
      />
    );
  };
}
