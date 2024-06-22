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
        if (prop === Symbol.for("gluanza.proxy.cache")) return cFactory;
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
    [Symbol.for("gluanza.proxy.cache")]: cFactory
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