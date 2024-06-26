import {shouldSearchDefault, shouldSkipModule, wrapFilter} from "./shared";
import {webpackRequire} from ".";

export function getModule<
    T extends R extends true ? any : Object,
    R extends boolean = false,
    E = R extends true ? Webpack.Module<T> : T,
    F = R extends true ? Webpack.RawFilter : Webpack.Filter
>($filter: F, opts: Webpack.FilterOptions<R> = {}): E | undefined {
    const {searchDefault = true, searchExports = false, raw = false} = opts;

    if (!webpackRequire) return undefined;

    const filter = wrapFilter($filter as Webpack.Filter);
    for (const id in webpackRequire.c) {
        if (Object.prototype.hasOwnProperty.call(webpackRequire.c, id)) {
            const module = webpackRequire.c[id] as Webpack.Module<T>;
            if (shouldSkipModule(module)) continue;

            const keys: string[] = [];
            if (searchExports) keys.push(...Object.keys(module.exports));
            else if (searchDefault && shouldSearchDefault(module)) keys.push("default");

            if (filter.call(module, module.exports, module, module.id)) {
                return raw ? (module as unknown as E) : (module.exports as E);
            }

            for (const key of keys) {
                if (!Reflect.has(module.exports, key)) continue;
                const exported = module.exports[key];
                if (!(exported instanceof Object)) continue;

                if (filter.call(module, exported, module, module.id)) {
                    return raw ? (module as unknown as E) : (exported as E);
                }
            }
        }
    }

    return undefined;
}

export function getAllModules(filter: Webpack.Filter, opts: Webpack.FilterOptions = {}) {
    const modules: any[] = [];

    if (!webpackRequire) return modules;

    filter = wrapFilter(filter);

    const {searchDefault = true, searchExports = false} = opts;

    for (const id in webpackRequire.c) {
        if (Object.prototype.hasOwnProperty.call(webpackRequire.c, id)) {
            const module = webpackRequire.c[id];

            if (shouldSkipModule(module)) continue;

            const keys: string[] = [];
            if (searchExports) keys.push(...Object.keys(module.exports));
            else if (searchDefault && shouldSearchDefault(module)) keys.push("default");

            if (filter.call(module, module.exports, module, module.id)) {
                modules.push(module.exports);
            }

            for (const key of keys) {
                if (!Reflect.has(module.exports, key)) continue;
                const exported = module.exports[key];

                if (!(exported instanceof Object)) continue;

                if (filter.call(module, exported, module, module.id)) {
                    modules.push(exported);
                }
            }
        }
    }

    return modules;
};

export function getBulk(...filters: Array<Webpack.BulkFilter>) {
    if (!webpackRequire) return;

    const modules = Array(filters.length).fill(null).map(() => ({value: null, hasValue: false}));

    filters.map((opts) => opts.filter = wrapFilter(opts.filter));

    for (const id in webpackRequire.c) {
        if (modules.every((m) => m.hasValue)) break;

        if (Object.prototype.hasOwnProperty.call(webpackRequire.c, id)) {
            const module = webpackRequire.c[id];

            if (shouldSkipModule(module)) continue;

            for (const i in filters) {
                const chunk = modules[i];
                if (chunk.hasValue) continue;

                const {searchDefault = true, searchExports = false, filter} = filters[i];

                const keys: string[] = [];
                if (searchExports) keys.push(...Object.keys(module.exports));
                else if (searchDefault && shouldSearchDefault(module)) keys.push("default");

                if (filter.call(module, module.exports, module, module.id)) {
                    chunk.value = module.exports;
                    chunk.hasValue = true;
                }

                for (const key of keys) {
                    if (!Reflect.has(module.exports, key)) continue;
                    if (chunk.hasValue) continue;

                    const exported = module.exports[key];

                    if (!(exported instanceof Object)) continue;

                    if (filter.call(module, exported, module, module.id)) {
                        chunk.value = exported;
                        chunk.hasValue = true;
                    }
                }
            }
        }
    }

    return modules.map((m) => m.value);
}
