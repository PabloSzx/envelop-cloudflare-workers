export const tsup: import("tsup").Options = {
  entryPoints: ["src/index.ts"],
  replaceNodeEnv: true,
  external: ["graphql-upload", "@vue/compiler-sfc"],
  splitting: false,
  clean: true,
  minify: false,
};
