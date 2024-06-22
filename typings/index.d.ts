declare const __jsx__ = Object.assign(React["createElement"], {
  createElement: React["createElement"],
  Fragment: React["Fragment"]
});

declare module Webpack {
  interface Require extends Function {
    <T = any>(id: PropertyKey): T;
    d(target, exports): void;
    c: Record<PropertyKey, Module>;
    m: Record<PropertyKey, RawModule>;
    e(id: PropertyKey): Promise<unknown>;
  };
  interface Module<T extends any = any> {
    id: PropertyKey,
    exports: T,
    loaded: boolean
  };
  type RawModule = (module: Module, exports: object, require: Require) => void;
  
  type Filter = (this: Module, exported: any, module: Module, id: PropertyKey) => any;
  type ExportedOnlyFilter = (exported: any) => any;
  type FilterOptions = {
    searchExports?: boolean,
    searchDefault?: boolean
  };
  type BulkFilter = FilterOptions & {
    filter: Filter
  };
  type SignalOption = { signal?: AbortSignal };
  type LazyFilterOptions = FilterOptions & SignalOption;

  type ModuleWithEffect = [
    Array<any>,
    Record<PropertyKey, RawModule>,
    (require: Require) => void
  ];
  type ModuleWithoutEffect = [
    Array<any>,
    Record<PropertyKey, RawModule>
  ];
  type AppObject = Array<ModuleWithoutEffect | ModuleWithEffect>;
};

type GluanzaGlobal = typeof import("../gluonza/window")["gluanza"];

interface DiscordWindow {
  webpackChunkdiscord_app?: Webpack.AppObject,
  gluanza: GluanzaGlobal,
  // DiscordNative?: DiscordNative
}

declare global {
  interface Window extends DiscordWindow {};
}
interface Window extends DiscordWindow {};