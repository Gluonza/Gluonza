export function compileFunction<T extends Function>(code: string, args: string[]): T {
    return new Function(...args, code) as T;
}

export function isInvalidSyntax(code: string): false | SyntaxError {
    try {
        compileFunction(code, []);
        return false;
    } catch (error) {
        // IDK what other kind of errors i can get but better safe than sry
        if (error instanceof SyntaxError) return error;
        return false;
    }
}

export function escapeRegex(text: string, flags?: string): RegExp {
    text = text.replace(/[\.\[\]\(\)\\\$\^\|\?\*\+]/g, "\\$&");
    return new RegExp(text, flags);
}

export function destructuredPromise<T extends any = void>() {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason: any) => void;
    const promise = new Promise<T>(($resolve, $reject) => {
        resolve = $resolve;
        reject = $reject;
    });
    return {promise, resolve: resolve!, reject: reject!};
}


export function isObject(item: any): item is Object {
    if (typeof item === "object" && item !== null) return true;
    if (typeof item === "function") return true;
    return false;
}

export function proxyCache<T extends object>(factory: () => T, typeofIsObject: boolean = false): T {
    const handlers: ProxyHandler<T> = {};

    const cFactory = cache(factory);

    const cacheFactory = () => {
        if (!cFactory.hasValue()) return cFactory();
        if (cFactory() instanceof Object) return cFactory();
        // Attempt to hopefully have the results be a instance of Object
        cFactory.reset();
        return cFactory();
    }

    for (const key of Object.getOwnPropertyNames(Reflect) as Array<keyof typeof Reflect>) {
        const handler = Reflect[key];

        if (key === "get") {
            handlers.get = (target, prop, r) => {
                if (prop === "prototype") return (cacheFactory() as any).prototype ?? Function.prototype;
                if (prop === Symbol.for("gluonza.proxy.cache")) return cFactory;
                return Reflect.get(cacheFactory(), prop, r);
            }
            continue;
        }
        if (key === "ownKeys") {
            handlers.ownKeys = () => {
                const keys = Reflect.ownKeys(cacheFactory());
                if (!typeofIsObject && !keys.includes("prototype")) keys.push("prototype");
                return keys;
            };
            continue;
        }

        // @ts-expect-error
        handlers[key] = function (target, ...args) {
            // @ts-expect-error
            return handler.apply(this, [cacheFactory(), ...args]);
        }
    }

    const proxy = new Proxy(Object.assign(typeofIsObject ? {} : function () {
    }, {
        [Symbol.for("gluonza.proxy.cache")]: cFactory
    }) as T, handlers);

    return proxy;
}

interface Cache<T> {
    get: T,

    (): T,

    hasValue(): boolean,

    reset(): void
}

export function cache<T>(factory: () => T): Cache<T> {
    const value = {} as { current: T } | {};

    function cache() {
        if ("current" in value) return value.current;

        const current = factory();
        (value as { current: T }).current = current;

        return current;
    }

    cache.__internal__ = value;

    cache.hasValue = () => "current" in value;

    cache.reset = () => {
        // @ts-expect-error
        if ("current" in value) delete value.current;
    };

    Object.defineProperty(cache, "get", {
        get: () => cache()
    });

    return cache as unknown as Cache<T>;
}


export function createNullObject<T extends Record<PropertyKey, any> = Record<PropertyKey, any>>(properties?: T, name?: string): T {
    let descriptors: { [key: PropertyKey]: PropertyDescriptor } = {};
    if (properties) {
        descriptors = Object.getOwnPropertyDescriptors(properties);
    }

    if (typeof name === "string") {
        descriptors[Symbol.toStringTag] = {value: name};
    }

    return Object.create(null, descriptors);
}

type StateLike<T> = [
    () => T,
    (newValue: ((previous: T) => T) | T) => T,
    () => T
]

export function createStateLike<T>(defaultValue: T): StateLike<T> {
    const listeners = new Set<() => void>();

    let state = defaultValue;

    function getState() {
        return state;
    }

    function useState() {
        return window.gluonza.React.useSyncExternalStore((listener) => {
            listeners.add(listener);
            return () => void listeners.delete(listener);
        }, () => state);
    }

    function setState($state: ((previous: T) => T) | T) {
        state = typeof $state === "function" ? ($state as (previous: T) => T)(state) : $state;
        for (const iterator of listeners) {
            iterator();
        }
        return state;
    }

    return [getState, setState, useState] as const;
}


interface classNameValueTypes {
    array: Array<string | void | false | classNameValueTypes["object"]>
    object: Record<string, boolean>
};

export function className(classNames: classNameValueTypes["array"] | classNameValueTypes["object"]) {
    if (!Array.isArray(classNames)) classNames = [classNames];

    function parseString(className: string) {
        return className.split(" ").filter(Boolean).join(" ");
    }

    const flattenedString: string[] = [];
    for (const className of classNames) {
        if (!className) continue;

        if (typeof className === "string") {
            flattenedString.push(parseString(className));
            continue;
        }

        for (const key in className) {
            if (Object.prototype.hasOwnProperty.call(className, key)) {
                if (className[key]) flattenedString.push(parseString(key));
            }
        }
    }

    return Array.from(new Set(flattenedString)).join(" ");
};

export const base64 = {
  decode(base64: string) {
    return new TextDecoder().decode(Uint8Array.from(atob(base64), (m) => m.codePointAt(0)!));
  },
  encode(text: string) {
    return btoa(String.fromCodePoint(...new TextEncoder().encode(text)));
  }
}

export function getComponentType<P>(component: string | React.ComponentType<P> | React.MemoExoticComponent<React.ComponentType<P>> | React.ForwardRefExoticComponent<P>): React.ComponentType<P> | string {
    if (component instanceof Object && "$$typeof" in component) {
        if (component.$$typeof === Symbol.for("react.memo")) return getComponentType<P>((component as any).type);
        if (component.$$typeof === Symbol.for("react.forward_ref")) return getComponentType<P>((component as any).render);
    }

    return component as React.ComponentType<P> | string;
}

export function createAbort(): readonly [abort: (reason?: any) => void, getSignal: () => AbortSignal] {
    let controller = new AbortController();

    function abort(reason?: any) {
        controller.abort(reason);

        controller = new AbortController();
    }

    return [abort, () => controller.signal];
}

let hasSeen: WeakSet<any> | null = null;
export function findInTree<T extends Object>(tree: any, searchFilter: (item: any) => any, options: {
  walkable?: string[] | null,
  ignore?: string[]
} = {}): T | void {
  hasSeen ??= new WeakSet();

  const { walkable = null, ignore = [] } = options;
  
  if (!(tree instanceof Object)) return;
  
  if (hasSeen.has(tree)) return;
  if (searchFilter(tree)) return tree as T;

  hasSeen.add(tree);

  let tempReturn: any;
  if (tree instanceof Array) {
    for (const value of tree) {
      tempReturn = findInTree(value, searchFilter, { walkable, ignore });
      if (typeof tempReturn != "undefined") {
        hasSeen = null;
        return tempReturn;
      }
    }
  }
  else {
    const toWalk = walkable == null ? Object.keys(tree) : walkable;
    for (const key of toWalk) {
      const value = tree[key];

      if (typeof(value) === "undefined" || ignore.includes(key)) continue;

      tempReturn = findInTree(value, searchFilter, { walkable, ignore });
      if (typeof tempReturn !== "undefined") {
        hasSeen = null;
        return tempReturn;
      }
    }
  }

  hasSeen = null;
  return tempReturn;
}

export function findInReactTree<T extends Object>(tree: any, searchFilter: (item: any) => any): T | void {
    return findInTree(tree, searchFilter, { walkable: [ "children", "props" ] });
}

type Fiber = import("react-reconciler").Fiber;

export function getInternalInstance(node?: Node): Fiber | null {
  return node?.__reactFiber$ || null;
}
export function getOwnerInstance<P = {}, S = {}, SS = any>(instance: Fiber | Node | null): React.Component<P, S, SS> | null {
  if (instance instanceof Node) instance = getInternalInstance(instance);

  if (!instance) return null;

  const fiber = findInTree<Fiber>(instance, (item) => item.stateNode instanceof window.gluonza.React.Component, { walkable: [ "return" ] });
  if (!fiber) return null;

  return fiber.stateNode;
}

export function wrapElement(element: HTMLElement) {
    return () => {
        const ref = window.gluonza.React.useRef<HTMLDivElement>(null);


        window.gluonza.React.useLayoutEffect(() => {
            if (!ref.current) return;
            
            const fiber = ref.current.__reactFiber$!;
        
            element.__reactFiber$ = fiber;
            
            fiber.stateNode = element;
            ref.current.replaceWith(element);
            (ref as any).current = element;
        }, [ ]);

        return <div ref={ref} />
    }
}

const patchedReactHooks = {
  useMemo(factory: () => any) {
    return factory();
  },
  useState(initial: any) {
    if (typeof initial === "function") return [ initial(), () => {} ];
    return [ initial, () => {} ];
  },
  useReducer(initial: any) {
    if (typeof initial === "function") return [ initial(), () => {} ];
    return [ initial, () => {} ];
  },
  useEffect() {},
  useLayoutEffect() {},
  useRef(value: any = null) {
    return { current: value };
  },
  useCallback(callback: Function) {
    return callback;
  },
  useContext(context: any) {
    return context._currentValue;
  }
};
export function wrapInHooks<P>(functionComponent: React.FunctionComponent<P>): React.FunctionComponent<P> {  
  return (props?: P, context?: any) => {
    const reactDispatcher = (window.gluonza.React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;

    const clone = { ...reactDispatcher };

    Object.assign(reactDispatcher, patchedReactHooks);

    try {
      const result = functionComponent(props ?? {} as P, context);

      Object.assign(reactDispatcher, clone);

      return result;
    } 
    catch (error) {
      Object.assign(reactDispatcher, clone);

      throw error;
    }
  };
};