import {waitForNode} from "common/dom";
import {destructuredPromise} from "../../../util";

const {promise, resolve, reject} = destructuredPromise();

waitForNode("body").then((body) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/less";
    script.id = "npm.less";

    script.addEventListener("load", () => resolve());
    script.addEventListener("error", (err) => reject(err.error));

    body.append(script);
});

export function compileLess(text: string) {
    return new Promise<string>(async (resolve, reject) => {
        try {
            await promise;

            const result = await window.less!.render(text);

            resolve(result.css);
        } catch (error) {
            reject(error);
        }
    })
}