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
  type RawFilter = (this: Module, module: Module, id: PropertyKey) => any;

  type FilterOptions<T extends boolean = false> = {
    searchExports?: boolean,
    searchDefault?: boolean,
    raw?: T
  };
  type BulkFilter = {
    searchExports?: boolean,
    searchDefault?: boolean,
    filter: Filter
  };
  type SignalOption = { signal?: AbortSignal };
  type LazyFilterOptions<T extends boolean = false> = FilterOptions<T> & SignalOption;

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

type gluonzaGlobal = typeof import("../gluonza/window")["gluonza"];

interface DiscordWindow {
  webpackChunkdiscord_app?: Webpack.AppObject,
  gluonza: typeof import("../gluonza/window")["gluonza"],
  gluonzaNative: typeof import("../desktop/renderer/native")["gluonzaNative"],
  // DiscordNative?: DiscordNative
}

declare global {
  interface Window extends DiscordWindow {};
}
interface Window extends DiscordWindow {};