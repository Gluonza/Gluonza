import {coreMods} from "./patches.js";

export const plugins = [];

export function startCoreMods() {
    coreMods.forEach(plugin => {
        plugin.start();
    })
}

export function startPlugins() {
    plugins.forEach(plugin => {
        plugin.start();
    })
}