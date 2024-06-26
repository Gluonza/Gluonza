import { React } from "../../webpack/common";

export type SnippetType = "css" | "scss" | "sass" | "less";

export interface Snippet {
  name: string,
  content: string,
  enabled: boolean,
  type: SnippetType,
  id: string,
  visible: boolean,
  deleted?: true
}

interface StorageType {
  snippets: Record<string, Snippet>
}

const storage = window.gluonzaNative.storage.read("glounza.custom-css") as StorageType;

let first = true;
export function getSnippets(): Snippet[] {
  storage.snippets ??= {};

  storage.snippets.css ??= {
    name: "Custom CSS",
    content: "/* default CSS */\n",
    enabled: true,
    id: "css",
    type: "css",
    visible: true
  }
  storage.snippets.scss ??= {
    name: "Custom SCSS",
    content: "/* default SCSS */\n",
    enabled: true,
    id: "scss",
    type: "scss",
    visible: true
  }
  storage.snippets.sass ??= {
    name: "Custom SASS",
    content: "/* default SASS */\n",
    enabled: true,
    id: "sass",
    type: "sass",
    visible: true
  }
  storage.snippets.less ??= {
    name: "Custom less",
    content: "/* default less */\n",
    enabled: true,
    id: "less",
    type: "less",
    visible: true
  }

  if (first) {
    first = false;

    for (const key in storage.snippets) {
      if (!Object.prototype.hasOwnProperty.call(storage.snippets, key)) continue;
      if (storage.snippets[key].deleted) delete storage.snippets[key];
    }
  }

  const values = Object.values(storage.snippets);

  const index = values.findIndex((snippet) => snippet.id === "css");

  values.splice(index, 1);

  storage.snippets.css.visible = true;

  return [ storage.snippets.css, ...values ];
}

const listeners = new Set<() => void>();

export function useSnippets() {
  const [ state, setState ] = React.useState(() => getSnippets());

  React.useEffect(() => {
    const onStorageChange = () => setState(() => getSnippets());

    onStorageChange();

    listeners.add(onStorageChange);
    return () => void listeners.delete(onStorageChange);
  }, [ ]);

  return state;
}

export function getSnippet(id: string) {
  return storage.snippets[id];
}

export function updateSnippets() {
  window.gluonzaNative.storage.write("glounza.custom-css", storage);
  
  for (const iterator of listeners) iterator();
}

export function createNewSnippet(type: SnippetType): Snippet {
  const id = Date.now().toString(32);

  const snippet: Snippet = {
    name: id,
    content: `/* Insert ${type} */\n`,
    id: id,
    enabled: true,
    type,
    visible: true
  }

  storage.snippets[id] = snippet;

  updateSnippets();

  return snippet;
}

export function deleteSnippet(id: string) {
  // @ts-expect-error 
  storage.snippets[id] = { deleted: true };

  updateSnippets();
}