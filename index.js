// @ts-check

import esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.join(fileURLToPath(import.meta.url), "..");

await esbuild.build({
  entryPoints: [ "gluonza/index.tsx" ],
  outfile: "dist/gluonza.js",
  inject: [
    "./injections/jsx.js"
  ],
  plugins: [
    
  ],
  bundle: true,
  platform: "browser",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled gluanza");

await esbuild.build({
  entryPoints: [ "desktop/main/index.ts" ],
  outfile: "dist/index.js",
  inject: [ ],
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
  outfile: "dist/preload.js",
  inject: [ ],
  plugins: [
    
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
  outfile: "dist/splash.js",
  inject: [ ],
  plugins: [
    
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
  outfile: "dist/overlay.js",
  inject: [ ],
  plugins: [
    
  ],
  external: [ "electron", "original-fs" ],
  bundle: true,
  platform: "node",
  tsconfig: path.join(dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled desktop/overlay");
