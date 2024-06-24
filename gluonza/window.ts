import {api} from "./api/webpack/api";
import {injectCSS, uninjectCSS} from "common/dom.js";
import {Dashboard, OpenSettingsButton} from "./api/protons/settings/index.js";
import {getPlugins, loadPlugins} from "./api/systems/plugins.js";

export const gluonza = {
  webpack: api,
  css: {injectCSS, uninjectCSS},
  jsx: __jsx__,
  plugins: {plugins: getPlugins()},
    _self: {OpenSettingsButton, Dashboard},
  get React() { return api.common.React }
}
