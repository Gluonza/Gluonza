// @ts-check
import esbuild from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const dirname = path.join(fileURLToPath(import.meta.url), "..");

/** @type {esbuild.Plugin} */
const CSSPlugin = {
  name: "css",
  setup(build) {
    build.onResolve({
      filter: /\.css$/
    }, (args) => ({
      path: path.resolve(args.resolveDir, args.path).replace(dirname, ".").replace(/\\/g, "/"),
      namespace: "css-plugin"
    }));

    build.onLoad({
      filter: /.*/, namespace: "css-plugin"
    }, async (args) => {
      const css = await readFile(args.path, { encoding: "binary" });
      
      return {
        contents: `
import { injectCSS } from "common/dom";

injectCSS(
  ${JSON.stringify("glounza-css-" + args.path)},
  ${JSON.stringify(css)}
)
        `,
        resolveDir: path.dirname(args.path)
      }
    });
  }
}

await esbuild.build({
  entryPoints: [ "gluonza/index.tsx" ],
  outfile: "build/gluonza.js",
  inject: [
    "./injections/jsx.js"
  ],
  plugins: [
    CSSPlugin
  ],
  bundle: true,
  platform: "browser",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled gluonza");

await esbuild.build({
  entryPoints: [ "desktop/main/index.ts" ],
  outfile: "build/index.js",
  inject: [
    "./injections/node-require.js"
  ],
  plugins: [
    
  ],
  external: [ "electron", "original-fs" ],
  bundle: true,
  platform: "node",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled desktop/main");

await esbuild.build({
  entryPoints: [ "desktop/renderer/index.ts" ],
  outfile: "build/preload.js",
  inject: [
    "./injections/node-require.js"
  ],
  plugins: [
    CSSPlugin
  ],
  external: [ "electron", "original-fs" ],
  bundle: true,
  platform: "node",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled desktop/renderer");

await esbuild.build({
  entryPoints: [ "desktop/splash/index.ts" ],
  outfile: "build/splash.js",
  inject: [
    "./injections/node-require.js"
  ],
  plugins: [
    CSSPlugin
  ],
  external: [ "electron", "original-fs" ],
  bundle: true,
  platform: "node",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled desktop/splash");

await esbuild.build({
  entryPoints: [ "desktop/overlay/index.ts" ],
  outfile: "build/overlay.js",
  inject: [
    "./injections/node-require.js"
  ],
  plugins: [
    CSSPlugin
  ],
  external: [ "electron", "original-fs" ],
  bundle: true,
  platform: "node",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled desktop/overlay");

await writeFile("./build/package.json", JSON.stringify({
  main: "./index.js",
  type: "commonjs"
}))