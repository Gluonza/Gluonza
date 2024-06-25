import {addPlainTextPatch} from "../webpack/index.js";

export const coreMods = [require('../protons/settings/index.js'), require('../protons/noTrack/index.js'), require('../protons/experiments/index.js'), require("../protons/custom-css")]

export function startMainPatches() {
    coreMods.forEach(mod => {
        if (mod?.patches){
            addPlainTextPatch(...mod.patches)
        }
    })
}