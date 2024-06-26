import {
  getLazyStore,
  getMangled,
  getMangledProxy,
  getModuleIdBySource,
  getProxyStore,
  getStore,
  webpackAppChunk,
  webpackReady,
  webpackRequire,
  whenWebpackInit
} from ".";
import {
  byKeys,
  byProtoKeys,
  byRegex,
  bySource,
  byStrings,
  combine,
  getByKeys,
  getByProtoKeys,
  getByRegex,
  getByStrings,
  getLazyByKeys,
  getLazyByProtoKeys,
  getLazyByRegex,
  getLazyByStrings,
  getProxyByKeys,
  getProxyByProtoKeys,
  getProxyByRegex,
  getProxyByStrings,
  not
} from "./filters";
import {getLazy} from "./lazy";
import {getAllModules, getBulk, getModule} from "./searching";
import {getProxy} from "./util";

import * as webpack from "./";
import * as common from "./common";

export const api = {
    getModule,
    getByStrings,
    getByRegex,
    getByKeys,
    getByProtoKeys,

    getProxy,
    getProxyByStrings,
    getProxyByRegex,
    getProxyByKeys,
    getProxyByProtoKeys,

    getLazy,
    getLazyByStrings,
    getLazyByRegex,
    getLazyByKeys,
    getLazyByProtoKeys,

    getStore,
    getProxyStore,
    getLazyStore,

    getBulk,
    getAllModules,

    getMangled,
    getMangledProxy,

    whenReady: whenWebpackInit,
    whenInit: whenWebpackInit,
    get require() {
        return webpackRequire
    },
    get ready() {
        return webpackReady
    },
    get appChunk() {
        return webpackAppChunk
    },

    filters: {
        bySource,
        byStrings,
        byRegex,
        byKeys,
        byProtoKeys,
        combine,
        not
    },

    common,

    getModuleIdBySource,

    __raw: webpack
};
