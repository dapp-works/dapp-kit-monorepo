import { defineConfig } from "tsup";
export default defineConfig({
  splitting: true,
  sourcemap: true,
  minify: true,
  clean: true,
  // cjsInterop: true,
  treeshake: true,
  external: [],
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
