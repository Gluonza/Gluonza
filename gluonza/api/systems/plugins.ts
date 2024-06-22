import {coreMods} from "./patches.js";

export function startCoreMods() {
    coreMods.forEach(plugin => {
        plugin.start();
    })
}