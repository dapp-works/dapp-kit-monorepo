import { Store } from '@/dappkit/store/standard/base';
import { Inspector, InspectParams } from 'react-dev-inspector';

export class DevInspectorPlugin implements Store {
  sid = 'DevInspectorPlugin';
  autoObservable = false;
  disabled = false;

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
          window.open(`vscode://file/${absolutePath}:${lineNumber}:${columnNumber}`)
        }}
      />
    );
  };
}
