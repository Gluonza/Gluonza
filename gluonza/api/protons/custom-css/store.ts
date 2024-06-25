import { compileLess } from "./less";
import { compileSass } from "./sass";

export type SnippetType = "css" | "scss" | "sass" | "less";

export interface Snippet {
  name: string,
  content: string,
  enabled: boolean,
  type: SnippetType,
  id: string
}

interface StorageType {
  snippets: Record<string, Snippet>
}

const storage = window.gluonzaNative.storage.read("glounza.custom-css") as StorageType;

export function getSnippets(): Snippet[] {
  storage.snippets ??= {};

  storage.snippets.css ??= {
    name: "Custom CSS",
    content: "/* default CSS */\n",
    enabled: true,
    id: "default",
    type: "css"
  }
  storage.snippets.scss ??= {
    name: "Custom SCSS",
    content: "/* default SCSS */\n",
    enabled: true,
    id: "default",
    type: "scss"
  }
  storage.snippets.sass ??= {
    name: "Custom SASS",
    content: "/* default SASS */\n",
    enabled: true,
    id: "default",
    type: "sass"
  }
  storage.snippets.less ??= {
    name: "Custom less",
    content: "/* default less */\n",
    enabled: true,
    id: "default",
    type: "less"
  }

  return Object.values(storage.snippets);
}

export function getSnippet(id: string) {
  return storage.snippets[id];
}

export function getSnippetCSS(id: string) {
  return new Promise(async (resolve, reject) => {
    const snippet = storage.snippets[id]

    if (snippet.type === "css") return resolve(snippet.content);

    if (snippet.type === "less") {
      try {
        resolve(await compileLess(snippet.content));
      }
      catch (error) {
        reject(error);
      }
      return;
    }

    try {
      resolve(
        await compileSass(snippet.content, snippet.type === "scss")
      );
    }
    catch (error) {
      reject(error);
    }
  })
}

export function updateSnippets() {
  window.gluonzaNative.storage.write("glounza.custom-css", storage);
}

export function createNewSnippet(type: SnippetType): Snippet {
  const snippet: Snippet = {
    name: "New Snippet",
    content: `/* Insert ${type} */\n`,
    id: Date.now().toString(32),
    enabled: true,
    type
  }

  storage.snippets[snippet.id] = snippet;

  updateSnippets();

  return snippet;
}

export function deleteSnippet(snippet: string) {
  delete storage.snippets[snippet];
  updateSnippets();
}