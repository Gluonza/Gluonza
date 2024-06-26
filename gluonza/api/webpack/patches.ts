export type PlainTextPatchType = PlainTextPatch | PlainTextPatchNonArray | PlainTextPatchReplacer;

interface PlainTextPatchBase {
    identifier?: string,
    _self?: Record<string, string>
};

export interface PlainTextPatch extends PlainTextPatchBase {
    match: string | RegExp | ((module: string) => boolean),
    replacements: PlainTextReplacer[]
};

interface PlainTextPatchNonArray extends PlainTextPatchBase {
    match: string | RegExp | ((module: string) => boolean),
    replacements: PlainTextReplacer
};

type PlainTextPatchReplacer = PlainTextReplacer & PlainTextPatchBase & {
    match?: string | RegExp | ((module: string) => boolean),
    find: string | RegExp
};

type Replacer = (substring: string, ...args: any[]) => string;

interface PlainTextReplacerString {
    find: string,
    replace: string

    predicate?(): boolean,
};

interface PlainTextReplacerFunction {
    find: { [Symbol.replace](string: string, replacer: Replacer): string; },
    replace: Replacer

    predicate?(): boolean,
};

interface PlainTextReplacerSymbolString {
    find: { [Symbol.replace](string: string, replaceValue: string): string; },
    replace: string

    predicate?(): boolean,
};

export type PlainTextReplacer = PlainTextReplacerFunction | PlainTextReplacerSymbolString | PlainTextReplacerString;

export const plainTextPatches: PlainTextPatch[] = [];

addPlainTextPatch(
    // Remove the hash thats appended to react element keys, ex 'Element.__reactFiber$'
    {
        identifier: "gluonza(no-react-reconciler-hash)",
        match: "__reactFiber$",
        find: /(var (.{1,3}))=Math.random\(\).toString\(36\).slice\(2\)/,
        replace: "$1=''"
    },
    // Removes the 'HOLD UP' logs in console and prevents token hiding
    {
        identifier: "gluonza(no-hold-up)",
        match: ".window.setDevtoolsCallbacks",
        find: /^function\(.{1,3},(.{1,3}),(.{1,3})\){"use strict";\2\.d\(\1,{(.{1,3}|UserDefenses):function\(\){return .{1,3}}.+/,
        replace: "function(module,$1,$2){$2.d($1,{$3(){return ()=>{}}})}"
    },
    // Prevents localStorage and sessionStorage from getting deleted
    ...["localStorage", "sessionStorage"].map((type) => ({
        identifier: `gluonza(save-${type})`,
        find: `delete window.${type}`,
        replace: ""
    })),
    // For webpack getLazy
    {
        identifier: "gluonza(lazy-store)",
        match: "Store.waitFor(...)",
        find: /,.{1,3}\.push\(this\),/,
        replace: "$&gluonza.webpack.__raw._lazyStore(this),"
    }
);

export function addPlainTextPatch(...patches: PlainTextPatchType[]) {
    for (const patch of patches) {
        const asReplacer = patch as PlainTextPatchReplacer;
        if (typeof asReplacer.find !== "undefined") {
            const newPatch: PlainTextPatch = {
                _self: asReplacer._self,
                identifier: asReplacer.identifier,
                match: asReplacer.match || asReplacer.find,
                replacements: [
                    {
                        find: asReplacer.find,
                        predicate: asReplacer.predicate,
                        replace: asReplacer.replace
                    } as any
                ]
            };

            plainTextPatches.push(newPatch);

            continue;
        }
        ;

        const asNormal = patch as PlainTextPatch | PlainTextPatchNonArray;

        if (!Array.isArray(asNormal.replacements)) asNormal.replacements = [asNormal.replacements];

        const newPatch: PlainTextPatch = {
            _self: asNormal._self,
            identifier: asNormal.identifier,
            match: asNormal.match,
            replacements: asNormal.replacements
        };

        plainTextPatches.push(newPatch);
    }
}
