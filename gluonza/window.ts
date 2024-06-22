import {api} from "./api/webpack/api";
import {Dashboard, OpenSettingsButton} from "./api/protons/settings/index..js";

export const gluanza = {
  webpack: api,
  jsx: __jsx__,
    _self: {OpenSettingsButton, Dashboard},
  get React() { return api.common.React }
}
