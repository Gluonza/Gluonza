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

type Plugin = {
    manifest: {
        name: string;
    };
    module?: {
        start: () => void;
        stop: () => void;
    };
};

type PluginsArray = Plugin[];

declare const plugins: PluginsArray;
declare const window: any;
declare const coreLogger: {
    info: (message: string) => void;
    error: (message: string, error: any) => void;
};

function reloadPlugin(pluginName: string, module: { start: () => void; stop: () => void } | undefined): void {
    const plugin = plugins.find(p => p.manifest.name === pluginName);

    if (plugin) {
        plugin.module?.stop();
        delete plugin.module;
    }

    if (module && typeof module.start === 'function' && typeof module.stop === 'function') {
        if (plugin) {
            plugin.module = module;
            plugin.module.start();
        } else {
            plugins.push({ manifest: { name: pluginName }, module });
            module.start();
        }
    }
}

window.gluonzaNative.listeners.addListener("pluginChange", async (pluginName: string) => {
    coreLogger.info(`Plugin ${pluginName} has changed`);

    try {
        const plugin = await window.gluonzaNative.plugins.read(pluginName);
        const module = {
            exports: {},
            manifest: JSON.parse(plugin.manifest)
        };

        new Function("module", "exports", plugin.source)(module, module.exports);

        reloadPlugin(module.manifest.name, module.exports as { start: () => void; stop: () => void });
    } catch (error) {
        coreLogger.error(`Failed to process plugin ${pluginName}:`, error);
    }
});
