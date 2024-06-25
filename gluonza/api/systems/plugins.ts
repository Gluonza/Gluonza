import { coreMods } from "./patches.js";
import { addPlainTextPatch } from "../webpack/index.js";
import {coreLogger} from "common/consts.js";

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
};

type PluginsArray = Plugin[];

let plugins: PluginsArray = [];
declare const window: any;

export function getPlugins(): PluginsArray {
    return plugins;
}

export function loadPlugins(pluginList: { source: string; manifest: { name: string; id?: string } }[]): PluginsArray {
    pluginList.forEach((plugin) => {
        const module = { exports: {} };
        new Function("module", "exports", "", plugin.source)(module, module.exports, () => { throw "no" });
        plugins.push({ manifest: plugin.manifest, source: plugin.source, module: module.exports });
    });
    return plugins;
}

export function loadPluginPatches(pluginList: { source: string; manifest: { name: string; id?: string } }[]): PluginsArray {
    pluginList.forEach((plugin) => {
        const module = { exports: {} };
        new Function("module", "exports", "", plugin.source)(module, module.exports, () => { throw "no" });
        if (Array.isArray(module.exports.patches)) {
            addPlainTextPatch(...module.exports.patches);
        }
    });
    return plugins;
}

export function startCoreMods(): void {
    coreMods.forEach((plugin) => {
        plugin.start();
    });
}

export async function startPlugins(): Promise<void> {
    const { disabled } = await window.gluonzaNative.storage.read('dev.glounza');
    const disabledArray = Array.isArray(disabled) ? disabled : [];

    plugins.forEach((plugin) => {
        if (disabled.includes(plugin.manifest.id)) return
        
        plugin.module?.start();
        coreLogger.info(`Started plugin: ${plugin.manifest.id}`);
    });
}

export async function disablePlugin(pluginId: string): Promise<void> {
    const { disabled } = await window.gluonzaNative.storage.read('dev.glounza');
    const disabledArray = Array.isArray(disabled) ? disabled : [];

    if (!disabledArray.includes(pluginId)) {
        const plugin = plugins.find(p => p.manifest.id === pluginId);

        if (plugin) {
            plugin.module?.stop();
            coreLogger.info(`Stopped plugin: ${plugin.manifest.id}`);

            const updatedDisabled = [...disabledArray, pluginId];
            await window.gluonzaNative.storage.write('dev.glounza', { disabled: updatedDisabled });
            coreLogger.info(`Disabled plugin: ${plugin.manifest.id}`);
        } else {
            coreLogger.error(`Plugin with ID ${pluginId} not found`);
        }
    } else {
        coreLogger.info(`Plugin with ID ${pluginId} is already disabled`);
    }
}

function reloadPlugin(givenPlugin: { exports: {}; manifest: { id?: string } }, module?: { start: () => void; stop: () => void }, isManifestOnly: boolean = false): void {
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
            plugin.manifest = givenPlugin.manifest;
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
                manifest: JSON.parse(plugin.manifest),
            };

            // Wrap plugin source in an IIFE to ensure proper scoping
            const wrappedSource = `(function(module, exports) { ${plugin.source} })(module, module.exports);`;

            new Function("module", "exports", wrappedSource)(module, module.exports);

            const { start, stop, ...otherExports } = module.exports;
            if (start && stop) {
                reloadPlugin(module, { start, stop }, false);
            } else {
                reloadPlugin(module, otherExports, false);
            }
        }
    } catch (error) {
        coreLogger.error(`Failed to process plugin ${pluginPath}:`, error);
    }
});
