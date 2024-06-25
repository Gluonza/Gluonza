export function compileFunction<T extends Function>(code: string, args: string[]): T {
  return new Function(...args, code) as T;
}

export function isInvalidSyntax(code: string): false | SyntaxError {
  try {
    compileFunction(code, [ ]);
    return false;
  } 
  catch (error) {
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
  return { promise, resolve: resolve!, reject: reject! };
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
    handlers[key] = function(target, ...args) {
      // @ts-expect-error
      return handler.apply(this, [ cacheFactory(), ...args ]);
    }
  }

  const proxy = new Proxy(Object.assign(typeofIsObject ? {} : function() {}, {
    [Symbol.for("gluonza.proxy.cache")]: cFactory
  }) as T, handlers);

  return proxy;
}

interface Cache<T> {
  (): T,
  get: T,
  hasValue(): boolean,
  reset(): void
}

export function cache<T>(factory: () => T): Cache<T> {
  const value = { } as { current: T } | { };

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
    descriptors[Symbol.toStringTag] = { value: name };
  }

  return Object.create(null, descriptors);
}

type StateLike<T> =  [ 
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
  if (!Array.isArray(classNames)) classNames = [ classNames ];
  
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

export function getComponentType<P>(component: string | React.ComponentType<P> | React.MemoExoticComponent<React.ComponentType<P>> | React.ForwardRefExoticComponent<P>): React.ComponentType<P> | string {
  if (component instanceof Object && "$$typeof" in component) {
    if (component.$$typeof === Symbol.for("react.memo")) return getComponentType<P>((component as any).type);
    if (component.$$typeof === Symbol.for("react.forward_ref")) return getComponentType<P>((component as any).render);
  }

  return component as React.ComponentType<P> | string;
}