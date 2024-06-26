import {getLazy} from "./lazy";
import {getModule} from "./searching";
import {getProxy} from "./util";
import {webpackRequire} from "./webpack";

export function bySource(...sources: (string | RegExp)[]): Webpack.Filter {
    const filter = combine(...sources.map(m => typeof m === "string" ? byStrings(m) : byRegex(m)));

    return (exports, module, id) => {
        if (exports !== module.exports) return;

        const fn = webpackRequire!.m[id];
        return filter(fn);
    };
}

export function combine(...filters: Webpack.ExportedOnlyFilter[]): Webpack.ExportedOnlyFilter
export function combine(...filters: (Webpack.ExportedOnlyFilter | Webpack.Filter)[]): Webpack.Filter
export function combine(...filters: Webpack.Filter[]): Webpack.Filter {
    return (exports, module, id) => {
        for (const filter of filters) {
            if (!filter.call(module, exports, module, id)) return false;
        }
        return true;
    };
}

export function not(filter: Webpack.ExportedOnlyFilter): Webpack.ExportedOnlyFilter
export function not(filter: Webpack.Filter): Webpack.Filter {
    return (exports, module, id) => {
        return !filter.call(module, exports, module, id);
    };
}

const hook = Symbol.for("gluonza.patcher.hook");

export function byStrings(...strings: string[]): Webpack.ExportedOnlyFilter {
    return (exports) => {
        if (!(exports instanceof Function)) return;

        // Check for patch
        let originalFunction = hook in exports ? exports[hook].original : exports;
        if ("__gluonzaOriginal" in originalFunction) originalFunction = originalFunction.__gluonzaOriginal;

        try {
            const stringed = Function.prototype.toString.call(originalFunction);
            for (const string of strings) {
                if (!stringed.includes(string)) return;
            }
            return true;
        } catch (error) {
        }
    }
}

export function getByStrings<T extends Record<PropertyKey, any>>(strings: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(strings)) strings = [strings];
    return getModule<T>(byStrings(...strings), opts);
}

export function getProxyByStrings<T extends Record<PropertyKey, any>>(strings: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(strings)) strings = [strings];
    return getProxy<T>(byStrings(...strings), opts);
}

export function getLazyByStrings<T extends Record<PropertyKey, any>>(strings: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(strings)) strings = [strings];
    return getLazy<T>(byStrings(...strings), opts);
}

export function byRegex(...regexes: RegExp[]): Webpack.ExportedOnlyFilter {
    return (exports) => {
        if (!(exports instanceof Function)) return;

        try {
            const stringed = Function.prototype.toString.call(exports);
            for (const regex of regexes) {
                if (!regex.test(stringed)) return;
            }
            return true;
        } catch (error) {
        }
    }
}

export function getByRegex<T extends Record<PropertyKey, any>>(regexes: RegExp[] | RegExp, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(regexes)) regexes = [regexes];
    return getModule<T>(byRegex(...regexes), opts);
}

export function getProxyByRegex<T extends Record<PropertyKey, any>>(regexes: RegExp[] | RegExp, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(regexes)) regexes = [regexes];
    return getProxy<T>(byRegex(...regexes), opts);
}

export function getLazyByRegex<T extends Record<PropertyKey, any>>(regexes: RegExp[] | RegExp, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(regexes)) regexes = [regexes];
    return getLazy<T>(byRegex(...regexes), opts);
}

export function byKeys(...keys: string[]): Webpack.ExportedOnlyFilter {
    return (exports) => {
        if (!(exports instanceof Object)) return;

        for (const key of keys) {
            if (!Reflect.has(exports, key)) return;
        }

        return true;
    }
}

export function getByKeys<T extends Record<PropertyKey, any>>(keys: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(keys)) keys = [keys];
    return getModule<T>(byKeys(...keys), opts);
}

export function getProxyByKeys<T extends Record<PropertyKey, any>>(keys: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(keys)) keys = [keys];
    return getProxy<T>(byKeys(...keys), opts);
}

export function getLazyByKeys<T extends Record<PropertyKey, any>>(keys: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(keys)) keys = [keys];
    return getLazy<T>(byKeys(...keys), opts);
}

export function byProtoKeys(...keys: string[]): Webpack.ExportedOnlyFilter {
    const filter = byKeys(...keys);

    return (exports) => {
        if (!exports) return;
        if (!exports.prototype) return;

        return filter(exports.prototype);
    }
}

export function getByProtoKeys<T extends Record<PropertyKey, any>>(keys: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(keys)) keys = [keys];
    return getModule<T>(byProtoKeys(...keys), opts);
}

export function getProxyByProtoKeys<T extends Record<PropertyKey, any>>(keys: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(keys)) keys = [keys];
    return getProxy<T>(byProtoKeys(...keys), opts);
}

export function getLazyByProtoKeys<T extends Record<PropertyKey, any>>(keys: string[] | string, opts?: Webpack.FilterOptions) {
    if (!Array.isArray(keys)) keys = [keys];
    return getLazy<T>(byProtoKeys(...keys), opts);
}
