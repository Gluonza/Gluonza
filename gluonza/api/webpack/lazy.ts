import {getModule, listeners} from ".";
import {shouldSearchDefault, shouldSkipModule, wrapFilter} from "./shared";

export function getLazy<T extends R extends true ? any : Object, R extends boolean = false, E = R extends true ? Webpack.Module<T> : T, F = R extends true ? Webpack.RawFilter : Webpack.Filter>($filter: F, opts: Webpack.LazyFilterOptions<R> = {}): Promise<E> {
    const cached = getModule<T, R, E, F>($filter, opts);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
        const {searchDefault = true, searchExports = false, raw = false, signal} = opts;

        if (raw) {
            const filter = $filter as Webpack.RawFilter;

            const undoListener = () => void listeners.delete(listener);

            function listener(module: Webpack.Module) {
                if (shouldSkipModule(module)) return;

                try {
                    if (filter.call(module, module, module.id)) {
                        resolve(module.exports);
                        return undoListener();
                    }
                } catch (error) {

                }
            }

            listeners.add(listener);

            if (signal) {
                signal.addEventListener("abort", () => {
                    reject(new Error("User aborted lazy module search"));
                    undoListener();
                })
            }
            return;
        }

        const filter = wrapFilter($filter as Webpack.Filter);

        const undoListener = () => void listeners.delete(listener);

        function listener(module: Webpack.Module) {
            if (shouldSkipModule(module)) return;

            if (filter.call(module, module.exports, module, module.id)) {
                resolve(module.exports);
                return undoListener();
            }

            const keys: string[] = [];
            if (searchExports) keys.push(...Object.keys(module.exports));
            else if (searchDefault && shouldSearchDefault(module)) keys.push("default");

            for (const key of keys) {
                const exported = module.exports[key];

                if (!(exported instanceof Object)) continue;
                if (!Reflect.has(module.exports, key)) continue;

                if (filter.call(module, exported, module, module.id)) {
                    resolve(raw ? module : exported);
                    return undoListener();
                }
            }
        }

        listeners.add(listener);

        if (signal) {
            signal.addEventListener("abort", () => {
                reject(new Error("User aborted lazy module search"));
                undoListener();
            })
        }
    });
}