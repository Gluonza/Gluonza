// Import necessary modules
import {LoadingScreen} from "./components/Loading.js";
import {webFrame} from "electron/renderer";
import {readFileSync} from "fs";
import path from "path";
import {waitForElementRemoved, waitForNode} from "common/dom.js";
import {coreLogger} from "common/consts";

import "./native";

export const removalNodeQuery = '[class*="container_"][class*="fixClipping_"]'

function InitMain() {
    const loader = new LoadingScreen();
    document.addEventListener("readystatechange", async () => {

        /* Discord. 1. Why do you share the same preload for overlays. */
        /* 2. WHY DO YOU SHARE THE SAME PRELOAD FOR OVERLAYS */
        /* If you couldn't tell, this is so splash screen doesn't load in overlays */

        const isOverlayContext = typeof window !== 'undefined' && window != null && window.__OVERLAY__ || document.getElementById('__OVERLAY__SENTINEL__') != null || /overlay/.test(window.location.pathname);
        if (isOverlayContext) return

        loader.init()
        coreLogger.info('Loaded InitMain.')
        const node = await waitForNode(removalNodeQuery);
        await waitForElementRemoved(node);

        loader.hide();
    });
}

function InitRenderer() {
    const rendererScriptPath = path.join(__dirname, 'gluonza.js');
    try {
        const rendererSource = readFileSync(rendererScriptPath).toString('base64');
        const scriptContent = `
            (async () => {
                try {
                    const base64ToUint8Array = (base64) => {
                        const binaryString = atob(base64);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        return bytes;
                    };
        
                    const arrayBufferToString = (buffer) => {
                        return new TextDecoder().decode(buffer);
                    };
        
                    const createBlobURL = (script) => {
                        return URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
                    };
        
                    const retryImport = async (url, retries = 3, delay = 1000) => {
                        for (let i = 0; i < retries; i++) {
                            try {
                                await import(url);
                                return;
                            } catch (error) {
                                console.error('Gluonza failed to import? How? Attempt:', i + 1, error);
                                if (i < retries - 1) {
                                    await new Promise(res => setTimeout(res, delay));
                                }
                            }
                        }
                        throw new Error('Gluonza failed, Update your PC.');
                    };
        
                    const rendererSource = '${rendererSource}';
                    const decodedScript = arrayBufferToString(base64ToUint8Array(rendererSource));
                    const blobURL = createBlobURL(decodedScript + '//# sourceURL=gluonza://gluonza/renderer');
        
                    await retryImport(blobURL);
        
                } catch (error) {
                    console.error('Failed to Gluonza:', error);
                }
            })();
            //# sourceURL=gluonza://gluonza/import
        `;
        void webFrame.executeJavaScript(scriptContent);
    } catch (error) {
        console.error('Failed to Gluonza:', error);
    }
}

function InitPreload() {
    const preloaderPath = process.env.DISCORD_PRELOADER;
    // @ts-ignore
    require(preloaderPath);
}

InitPreload();
InitMain();
InitRenderer();
