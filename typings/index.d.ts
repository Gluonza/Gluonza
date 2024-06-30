declare const __jsx__ = Object.assign(React["createElement"], {
    createElement: React["createElement"],
    Fragment: React["Fragment"]
});

declare module Webpack {
    interface Require extends Function {
        c: Record<PropertyKey, Module>;
        m: Record<PropertyKey, RawModule>;

        <T = any>(id: PropertyKey): T;

        d(target, exports): void;

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

    type FilterOptions<T extends boolean = false> = {
        searchExports?: boolean,
        searchDefault?: boolean,
        raw?: T,
        defaultExport?: boolean
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
}
;

declare module Sass {
    interface ErrorResult {
        status: 1,
        file: "stdin",

        column: number,
        line: number,

        message: string
        formatted: string,
    }

    interface Result {
        status: 0,
        files: [],
        map: {
            version: number,
            file: "stdout",
            sourceRoot: "root",
            sources: ["stdin"],
            sourcesContent: [string],
            mappings: string
        },
        text: string | null
    }

    interface Options {
        style: number,
        indentedSyntax: boolean
    }

    interface Sass {
        style: Record<string, number>,

        compile(text: string, options: Options, callback: (data: Result | ErrorResult) => void): void
    }
}

declare module Less {
    interface Result {
        css: string
    }

    interface Less {
        render(less: string): Promise<Result>
    }
}


interface Node {
    __reactFiber$?: import("react-reconciler").Fiber,
    __reactProps$?: any
}

type gluonzaGlobal = typeof import("../gluonza/window")["gluonza"];

interface DiscordWindow {
    webpackChunkdiscord_app?: Webpack.AppObject,
    gluonza: typeof import("../gluonza/window")["gluonza"],
    gluonzaNative: typeof import("../desktop/renderer/native")["gluonzaNative"],
    Sass?: Sass.Sass,
    less?: Less.Less,
    // DiscordNative?: DiscordNative
}

/**
 * @description This is a alias to the original node require function.
 * Esbuild will ignore this require
 * @note This type is wrong, __node_require__ does not always exist
 */
declare const __node_require__: NodeJS.Require;

declare global {
    interface Window extends DiscordWindow {
    }
}

interface Window extends DiscordWindow {
}

declare module "*.css" {

}

interface Patch {
    identifier: string;
    find: RegExp;
    replace: string;
}

interface Plugin {
    start: Function
    stop: Function
    patches: ? []
}