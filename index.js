// @ts-check

import esbuild from "esbuild";
import path from "node:path";

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
  tsconfig: path.join(__dirname, "tsconfig.json"),
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
  tsconfig: path.join(__dirname, "tsconfig.json"),
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
  tsconfig: path.join(__dirname, "tsconfig.json"),
  jsx: "transform"
});

console.log("Compiled desktop/renderer");

