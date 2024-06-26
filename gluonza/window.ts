import {api} from "./api/webpack/api";
import {injectCSS, uninjectCSS} from "common/dom.js";
import {Dashboard, OpenSettingsButton} from "./api/protons/settings/index.js";
import {getPlugins, startPlugin, stopPlugin} from "./api/systems/plugins.js";
import {getThemes, startTheme, stopTheme} from "./api/systems/themes.js";

export const gluonza = {
    webpack: api,
    css: {injectCSS, uninjectCSS},
    jsx: __jsx__,
    plugins: {plugins: getPlugins(), startPlugin, stopPlugin},
    themes: {themes: getThemes(), startTheme, stopTheme},
    _self: {OpenSettingsButton, Dashboard},
    get React() {
        return api.common.React
    }
}
