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

function reloadPlugin(pluginPath: string, module: {}): void { // pluginPath is just named-index in plugins array.
    const findPlugin = plugins.find(x=>x.manifest.name === pluginPath);
    if (findPlugin) {
        findPlugin.module.stop();
    }
    
    delete findPlugin.module;
    
    if (module && typeof module.start === 'function' && typeof module.stop === 'function') {
        findPlugin.module = module;
        findPlugin.module.start();
    }
}

window.gluonzaNative.listeners.addListener("pluginChange", async (a, b) => {
    coreLogger.info(`Plugin ${a} has changed`);

    try {
        const plugin = await window.gluonzaNative.plugins.read(a);

        const module = {
            exports: {},
            manifest: JSON.parse(plugin.manifest)
        };

        new Function("module", "exports", "", plugin.source)(module, module.exports, function () {
            throw "no";
        });

        reloadPlugin(module.manifest.name, module.exports)
    } catch (error) {
        coreLogger.error(`Failed to process plugin ${a}:`, error);
    }
});
