import {coreMods} from "./patches.js";
import {coreLogger} from "common/consts.js";

let plugins: any[] = [];

export function getPlugins()
{
    return plugins;
}

export function loadPlugins(pluginList: [])
{
    pluginList.forEach((plugin: { source: string; manifest: {name: string} }) =>
    {
        const module = { exports: {} };
        new Function("module", "exports", "", plugin.source)(module, module.exports, function() { throw "no" });
        plugins.push({manifest: plugin.manifest, source: plugin.source, module: module.exports});
    })
    return plugins
}

export function startCoreMods() {
    coreMods.forEach(plugin => {
        plugin.start();
    })
}

export function startPlugins() {
    plugins.forEach(plugin => {
        plugin?.module?.start();
        coreLogger.info(`Started plugin: ${plugin.manifest.name}`)
    })
}