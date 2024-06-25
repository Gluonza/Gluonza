import { waitForNode } from "common/dom";
import { SnippetType, getSnippets } from "./store";
import { compileLess } from "./less";
import { compileSass } from "./sass";

const head = document.createElement("glounza-head");

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

for (const snippets of getSnippets()) {
  if (!snippets.enabled) continue;

  compile(snippets.type, snippets.content).then((css) => {
    const style = document.createElement("style");
    style.setAttribute("data-snippet-type", snippets.type);
    style.setAttribute("data-snippet", snippets.id);

    if (typeof css === "string") style.textContent = css;
    else style.setAttribute("data-snippet-error", "");

    head.append(style);
  });
}

waitForNode("head").then(() => document.head.append(head));