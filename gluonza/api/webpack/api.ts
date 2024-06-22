import { getProxyStore, getStore, getLazyStore, webpackReady, whenWebpackInit, getModuleIdBySource, getMangled, getMangledProxy } from ".";
import { byKeys, byProtoKeys, byRegex, bySource, byStrings, combine, getByKeys, getByProtoKeys, getByRegex, getByStrings, getLazyByKeys, getLazyByProtoKeys, getLazyByRegex, getLazyByStrings, getProxyByKeys, getProxyByProtoKeys, getProxyByRegex, getProxyByStrings, not } from "./filters";
import { getLazy } from "./lazy";
import { getBulk, getModule, getAllModules } from "./searching";
import { getProxy } from "./util";
import { webpackAppChunk, webpackRequire } from ".";

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
  get require() { return webpackRequire },
  get ready() { return webpackReady },
  get appChunk() { return webpackAppChunk },

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
