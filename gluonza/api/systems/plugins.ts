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

function reloadPlugin(givenPlugin: { exports: {}; manifest: any }, module: {
    start: () => void;
    stop: () => void
} | undefined, isManifestOnly: boolean): void {
    const plugin = plugins.find(p => p.manifest.id === givenPlugin.manifest.id);

    if (plugin) {
        plugin.module?.stop();
        if (isManifestOnly) {
            plugin.manifest = givenPlugin.manifest;
            plugin.module?.start();
            return;
        }
        delete plugin.module;
        delete plugin.manifest;
    }

    if (module && typeof module.start === 'function' && typeof module.stop === 'function') {
        if (plugin) {
            plugin.module = module;
            plugin.manifest = module.manifest;
            plugin.module.start();
        } else {
            plugins.push({ manifest: givenPlugin.manifest, module });
            module.start();
        }
    }
}

window.gluonzaNative.listeners.addListener("pluginChange", async (pluginPath: string) => {
    coreLogger.info(`Plugin ${pluginPath} has changed`);

    try {
        const pluginName = pluginPath.split('/').pop();
        const isManifestOnly = pluginPath.endsWith('manifest.json');
        const plugin = await window.gluonzaNative.plugins.read(pluginName);

        if (isManifestOnly) {
            const manifest = JSON.parse(plugin.manifest);
            reloadPlugin({ exports: {}, manifest }, undefined, true);
        } else {
            const module = {
                exports: {},
                manifest: JSON.parse(plugin.manifest)
            };
            new Function("module", "exports", plugin.source)(module, module.exports);
            reloadPlugin(module, module.exports as { start: () => void; stop: () => void }, false);
        }
    } catch (error) {
        coreLogger.error(`Failed to process plugin ${pluginPath}:`, error);
    }
});

