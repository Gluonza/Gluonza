import {addPlainTextPatch} from "../webpack/index.js";

export const coreMods = [require('../protons/settings/index.js'), require('../protons/noTrack/index.js')]

export function startMainPatches() {
    coreMods.forEach(mod => {
        addPlainTextPatch(...mod.patches)
    })
}