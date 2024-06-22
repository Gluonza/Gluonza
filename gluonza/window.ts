import {api} from "./api/webpack/api";
import {injectCSS, uninjectCSS} from "common/dom.js";
import {Dashboard, OpenSettingsButton} from "./api/protons/settings/index.js";

export const gluonza = {
  webpack: api,
  css: {injectCSS, uninjectCSS},
  jsx: __jsx__,
    _self: {OpenSettingsButton, Dashboard},
  get React() { return api.common.React }
}
