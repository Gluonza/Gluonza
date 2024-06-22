import { api } from "./api/webpack/api";

export const gluanza = {
  webpack: api,
  jsx: __jsx__,
  get React() { return api.common.React }
}
