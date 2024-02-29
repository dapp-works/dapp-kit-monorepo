import { defineConfig } from "tsup";
export default defineConfig({
  // Outputs `dist/a.js` and `dist/b.js`.
  // Outputs `dist/foo.js` and `dist/bar.js`
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
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
