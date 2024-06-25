import { waitForNode } from "common/dom";
import { destructuredPromise } from "../../../util";

const { promise, resolve, reject } = destructuredPromise();

waitForNode("body").then((body) => {
  const script = document.createElement("script");
  script.src = "https://medialize.github.io/sass.js/dist/sass.sync.js";
  script.id = "sass.sync.js";

  script.addEventListener("load", () => resolve());
  script.addEventListener("error", (err) => reject(err.error));

  body.append(script);
});

export function compileSass(text: string, scss = true) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await promise;

      window.Sass!.compile(text, { 
        indentedSyntax: !scss, 
        style: window.Sass!.style.nested 
      }, (data) => {
        if (data.status === 1) return reject(new Error(data.message));

        resolve(data.text || "");
      });
    } 
    catch (error) {
      reject(error);
    }
  })
}