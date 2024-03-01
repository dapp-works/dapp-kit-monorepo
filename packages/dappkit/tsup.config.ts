import { defineConfig } from "tsup";
export default defineConfig({
  splitting: true,
  sourcemap: true,
  minify: true,
  clean: true,
  // cjsInterop: true,
  treeshake: true,
  external: ["react", "react-dom", "next", "@monaco-editor/react", "@nextui-org/react", "@tremor/react", "lodash", "lodash-es", "ajv", "deixe", "react-dev-inspector", "@rjsf/utils", "@rjsf/core", "lucide-react", "bignumber.js", "axios"],
  entry: {
    index: "index.ts",
    metrics: "metrics.ts",
    form: "form.ts",
    plugins: "plugins.ts",
    ui: "ui.ts",
    dev: "dev.ts",
    inspector: "inspector.ts",
    jsontable: "jsontable.ts",
    experimental: "experimental.ts"
  },
});
