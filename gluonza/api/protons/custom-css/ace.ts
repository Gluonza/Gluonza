import { waitForNode } from "common/dom";
import { destructuredPromise } from "../../../util";

export async function loadAce(window: Window & typeof globalThis) {
  if (window.ace) return window.ace;

  const { promise, resolve, reject } = destructuredPromise<AceAjax.Ace>();
  
  waitForNode("body", { target: window.document }).then((body) => {
    const script = document.createElement("script");
    script.src = "https://ajaxorg.github.io/ace-builds/src-min-noconflict/ace.js";
    script.id = "ace.js";
  
    script.addEventListener("load", () => resolve(window.ace));
    script.addEventListener("error", (err) => reject(err.error));
  
    body.append(script);
  });

  return promise;
}

loadAce(window);