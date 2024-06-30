import {coreMods} from "./patches.js";
import {addPlainTextPatch} from "../webpack/index.js";
import {coreLogger} from "common/consts.js";
import {startBD} from "../protons/BdApi/index.js";

type Plugin = {
    manifest: {
        name: string;
        id?: string;
    };
    module?: {
        start: () => void;
        stop: () => void;
        [key: string]: any;
    };
    started: boolean;
};

type PluginsArray = Plugin[];

let plugins: PluginsArray = [];
declare const window: any;



export function getPlugins(): PluginsArray {
    return plugins;
}

export function loadPlugins(pluginList: { source: string; manifest: { name: string; id?: string } }[]): PluginsArray {
    window.BdApi = startBD();
    pluginList.forEach((plugin) => {
        const module = loadPluginModule(plugin.source);
        plugins.push({manifest: plugin.manifest, module, started: false, type: 'plugin'});
    });
    return plugins;
}

export function loadPluginPatches(pluginList: {
    source: string;
    manifest: { name: string; id?: string }
}[]): PluginsArray {
    pluginList.forEach((plugin) => {
        const module = loadPluginModule(plugin.source);
        if (Array.isArray(module.patches)) {
            addPlainTextPatch(...module.patches);
        }
    });
    return plugins;
}

function loadPluginModule(source: string) {
    const module = {
        exports: {
            patches: {}
        }
    };
    try
    {
        new Function("module", "exports", "", source)(module, module.exports, () => {
            throw "no"
        });
    } catch (e) {}
    return module.exports;
}

export function startCoreMods(): void {
    coreMods.forEach((plugin) => {
        plugin?.start?.();
    });
}

async function getDisabledPlugins(): Promise<string[]> {
    const {disabled} = await window.gluonzaNative.storage.read('dev.glounza');
    return Array.isArray(disabled) ? disabled : [];
}

function findPluginById(id: string | undefined) {
    return plugins.find(plugin => plugin.manifest.id === id);
}

export function startPlugin(id: string | undefined): void {
    const plugin = findPluginById(id);
    if (plugin) {
        plugin.module?.start?.() ?? plugin.module?.prototype?.start?.();
        plugin.started = true;
    }
}

export function stopPlugin(id: string | undefined): void {
    const plugin = findPluginById(id);
    if (plugin) {
        plugin.module?.stop?.() ?? plugin.module?.prototype?.stop?.();
        plugin.started = false;
    }
}

export async function startPlugins(): Promise<void> {
    const disabledArray = await getDisabledPlugins();

    plugins.forEach((plugin) => {
        if (disabledArray.includes(<string>plugin.manifest.id)) return;

        try {
            startPlugin(plugin.manifest.id);
        } catch (err) {}
        coreLogger.info(`Started plugin: ${plugin.manifest.id}`);
    });
}

export async function disablePlugin(pluginId: string): Promise<void> {
    const disabledArray = await getDisabledPlugins();

    if (!disabledArray.includes(pluginId)) {
        const plugin = findPluginById(pluginId);

        if (plugin) {
            stopPlugin(pluginId);

            const updatedDisabled = [...disabledArray, pluginId];
            await window.gluonzaNative.storage.write('dev.glounza', {disabled: updatedDisabled});
            coreLogger.info(`Disabled plugin: ${plugin.manifest.id}`);
        } else {
            coreLogger.error(`Plugin with ID ${pluginId} not found`);
        }
    } else {
        coreLogger.info(`Plugin with ID ${pluginId} is already disabled`);
    }
}

function reloadPlugin(givenPlugin: { exports: {}; manifest: { id?: string } }, module?: {
    start: () => void;
    stop: () => void
}, isManifestOnly: boolean = false): void {
    const plugin = findPluginById(givenPlugin.manifest.id);

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
            plugin.manifest = givenPlugin.manifest;
            plugin.module.start();
        } else {
            plugins.push({manifest: givenPlugin.manifest, module, started: false});
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
            reloadPlugin({exports: {}, manifest}, undefined, true);
        } else {
            const module = {
                exports: {},
                manifest: JSON.parse(plugin.manifest),
            };

            // Wrap plugin source in an IIFE to ensure proper scoping
            const wrappedSource = `(function(module, exports) { ${plugin.source} })(module, module.exports);`;

            new Function("module", "exports", wrappedSource)(module, module.exports);

            const {start, stop, ...otherExports} = module.exports;
            if (start && stop) {
                reloadPlugin(module, {start, stop}, false);
            } else {
                reloadPlugin(module, otherExports, false);
            }
        }
    } catch (error) {
        coreLogger.error(`Failed to process plugin ${pluginPath}:`, error);
    }
});

window.gluonzaNative.listeners.addListener("pluginAdd", async (pluginPath: string) => {
    coreLogger.info(`Plugin ${pluginPath} has been added`);

    try {
        const pluginName = pluginPath.split('/').pop();
        const isManifestOnly = pluginPath.endsWith('manifest.json');
        const plugin = await window.gluonzaNative.plugins.read(pluginName);

        if (isManifestOnly) {
            const manifest = JSON.parse(plugin.manifest);
            reloadPlugin({exports: {}, manifest}, undefined, true);
        } else {
            const module = {
                exports: {},
                manifest: JSON.parse(plugin.manifest),
            };

            // Wrap plugin source in an IIFE to ensure proper scoping
            const wrappedSource = `(function(module, exports) { ${plugin.source} })(module, module.exports);`;

            new Function("module", "exports", wrappedSource)(module, module.exports);

            const {start, stop, ...otherExports} = module.exports;
            if (start && stop) {
                reloadPlugin(module, {start, stop}, false);
            } else {
                reloadPlugin(module, otherExports, false);
            }
        }
    } catch (error) {
        coreLogger.error(`Failed to process plugin ${pluginPath}:`, error);
    }
});
