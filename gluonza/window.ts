import {api} from "./api/webpack/api";
import {injectCSS, uninjectCSS} from "common/dom.js";
import {Dashboard, OpenSettingsButton} from "./api/protons/settings/index..js";
import {__jsx__} from "typings";

export const gluanza = {
  webpack: api,
  css: {injectCSS, uninjectCSS},
  jsx: __jsx__,
    _self: {OpenSettingsButton, Dashboard},
  get React() { return api.common.React }
}
