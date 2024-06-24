// # do mod stuff idk

import { gluonza } from "./window";
import {whenWebpackReady} from "./api/webpack/index.js";
import {loadPlugins, startPlugins} from "./api/systems/plugins.js";

window.gluonza = gluonza;

whenWebpackReady().then(r => {
    // @ts-ignore
    loadPlugins(window.gluonzaNative.plugins.getNativePlugins().plugins)
    startPlugins();
})