import { waitForNode } from "common/dom";
import { Snippet, SnippetType, getSnippets } from "./store";
import { compileLess } from "./less";
import { compileSass } from "./sass";
import { createAbort } from "../../../util";

const head = document.createElement("glounza-custom-css-head");

const cache: Record<SnippetType, Record<string, string | Error>> = {
  css: {},
  scss: {},
  sass: {},
  less: {}
};

export async function compile(type: SnippetType, content: string): Promise<string | Error> {
  if (type === "css") return content;

  if (content in cache[type]) return cache[type][content];

  if (type === "less") {
    try {
      const css = await compileLess(content);

      cache[type][content] = css;

      return css;
    } 
    catch ($error) {
      const error = $error as Error;
      cache[type][content] = error;
      return error;
    }
  }

  try {
    const css = await compileSass(content, type === "scss");

    cache[type][content] = css;

    return css;
  } 
  catch ($error) {
    const error = $error as Error;
    cache[type][content] = error;
    return error;
  }
}

const undo: Record<string, () => void> = {};

export function initSnippet(snippet: Snippet) {
  if (snippet.id in undo) return undo[snippet.id]();

  const [ abort, getSignal ] = createAbort();

  function insertCSS() {
    abort();

    compile(snippet.type, snippet.content).then((css) => {
      if (!snippet.enabled) return;

      const signal = getSignal();
      if (signal.aborted) return;

      const style = document.createElement("style");
      style.setAttribute("data-snippet-type", snippet.type);
      style.setAttribute("data-snippet", snippet.id);

      if (typeof css === "string") style.textContent = css;
      else style.setAttribute("data-snippet-error", "");

      head.append(style);

      signal.addEventListener("abort", () => style.remove());
    });
  }

  undo[snippet.id] = insertCSS;

  insertCSS();
}

for (const snippet of getSnippets()) initSnippet(snippet);

waitForNode(".drag-previewer").then(() => document.body.append(head));