import { defineConfig } from "tsup";
export default defineConfig({
  splitting: true,
  sourcemap: true,
  // minify: true,
  clean: true,
  // cjsInterop: true,
  treeshake: true,
  external: ["react", "lodash-es"],
  entry: {
    index: "index.ts",
  },
});
