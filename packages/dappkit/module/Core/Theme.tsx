import { Store } from '@/dappkit/store/standard/base';
import { observer } from 'mobx-react-lite';
import { StoragePlugin } from './Storage';
import MonacoEditor from '@monaco-editor/react';
import { useRef } from 'react';
import { Button } from '@/dappkit/components/ui/button';
import { createGlobalStyle } from 'styled-components';

const css = `
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 47.4% 11.2%);

  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);

  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(222.2 47.4% 11.2%);

  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 47.4% 11.2%);

  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);

  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);

  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);

  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);

  --destructive: hsl(0 100% 50%);
  --destructive-foreground: hsl(210 40% 98%);

  --ring: hsl(215 20.2% 65.1%);

  --radius: 0.5rem;
  }

  .dark {
    --background: hsl(224 71% 4%);
    --foreground: hsl(213 31% 91%);

    --muted: hsl(223 47% 11%);
    --muted-foreground: hsl(215.4 16.3% 56.9%);

    --popover: hsl(224 71% 4%);
    --popover-foreground: hsl(215 20.2% 65.1%);

    --card: hsl(224 71% 4%);
    --card-foreground: hsl(213 31% 91%);

    --border: hsl(216 34% 17%);
    --input: hsl(216 34% 17%);

    --primary: hsl(210 40% 98%);
    --primary-foreground: hsl(222.2 47.4% 1.2%);

    --secondary: hsl(222.2 47.4% 11.2%);
    --secondary-foreground: hsl(210 40% 98%);

    --accent: hsl(216 34% 17%);
    --accent-foreground: hsl(210 40% 98%);

    --destructive: hsl(0 63% 31%);
    --destructive-foreground: hsl(210 40% 98%);

    --ring: hsl(216 34% 17%);

    --radius: 0.5rem;
  }
`.toString();

export class ThemePlugin implements Store {
  sid = 'ThemePlugin';
  autoObservable?: boolean = true;

  cssVars = StoragePlugin.Get({ key: 'cssVars', value: css, engine: StoragePlugin.engines.asyncStorage });

  provider = observer(() => {
    const GlobalStyles = createGlobalStyle`
     ${this.cssVars.value}
    `;
    return <GlobalStyles />;
  });

  devtools = {
    panels: [
      {
        title: 'CSS Variables',
        render: observer(() => {
          const valueRef = useRef(this.cssVars.value);
          return (
            <div className="w-full h-full relative">
              <MonacoEditor
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
                height="100%"
                theme="vs-dark"
                language="css"
                value={this.cssVars.value}
                onChange={(v) => {
                  valueRef.current = v;
                }}
              />
              <Button
                className="z-50 absolute bottom-2 right-4"
                variant="secondary"
                size="sm"
                onClick={() => {
                  try {
                    if (!valueRef.current) {
                      return;
                    }
                    this.cssVars.set(valueRef.current);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Submit
              </Button>
            </div>
          );
        }),
      },
    ],
  };
}
