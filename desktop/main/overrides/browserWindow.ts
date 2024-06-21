// # patch electron BrowserWindow and set up ipc
// # done for you. lil cinamin.. cinamon? cinnamon! yeah. cinnamon roll

import * as electron from "electron";
import {BrowserWindow} from "electron";
import {join} from "path";

const {env} = process;

class PatchedBrowserWindow extends BrowserWindow {
    constructor(opts: Electron.BrowserWindowConstructorOptions) {
        // Make sure to only get the main window
        if (!opts || !opts.webPreferences || !opts.webPreferences.preload) {
            super(opts);
            return;
        }

        if (opts.webPreferences.preload.includes("main")) {
            env.DISCORD_PRELOADER = opts.webPreferences!.preload;

            opts.webPreferences!.preload = join(__dirname, "./preload.js");
        }
        else if (opts.webPreferences.preload.includes("splash")) {
            env.DISCORD_PRELOADER_SPLASH = opts.webPreferences!.preload;

            opts.webPreferences!.preload = join(__dirname, "./splash.js");
        }// no idea if this works
        else if (opts.webPreferences.preload.includes("overlay")) {
            env.DISCORD_PRELOADER_OVERLAY = opts.webPreferences!.preload;

            opts.webPreferences!.preload = join(__dirname, "./overlay.js");
        }
        // If this isnt any of those 3 just stop
        else super(opts);

        return new BrowserWindow(opts);

        super();
    }
}

// i no no tink dis works
let appSettings: { set(key: any, value: any): void; };

Object.defineProperty(global, "appSettings", {
    get: () => appSettings,
    set: (v: typeof appSettings) => {
        v.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING", true);
        v.set("SKIP_HOST_UDPATE", true);
        appSettings = v;
    }
});

const electronModule = require.resolve("electron");
delete require.cache[electronModule]!.exports;

const electronMod: typeof Electron.CrossProcessExports = {
    ...electron,
    BrowserWindow: PatchedBrowserWindow
};

require.cache[electronModule]!.exports = electronMod;