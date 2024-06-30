type ClassType = new (...args: any) => any;
type FunctionType = (this: any, ...args: any) => any;

type ClassParameters<T extends ClassType> = T extends new (...args: infer P) => any ? P : never;
type FunctionParameters<T extends FunctionType> = T extends (this: any, ...args: infer P) => any ? P : never;
type Parameters<T extends ClassType | FunctionType> = T extends ClassType ? ClassParameters<T> : T extends FunctionType ? FunctionParameters<T> : never;

type ThisParameterType<T extends FunctionType> = T extends (this: infer P, ...args: any) => any ? P : never;

// Object Typings
type KeysMatching<T, V> = {[K in keyof T]-?: T[K] extends V ? K : never}[keyof T];

class InjectorReturn<T = any> {
  constructor(public readonly value: T) {}
}

type AfterCallback<F extends FunctionType> = (that: ThisParameterType<F>, args: Parameters<F>, result: ReturnType<F>) => void | InjectorReturn<ReturnType<F>>;
type InsteadCallback<F extends FunctionType> = (that: ThisParameterType<F>, args: Parameters<F>, original: F) => ReturnType<F>;
type BeforeCallback<F extends FunctionType> = (that: ThisParameterType<F>, args: Parameters<F>) => void;
// 'component' argument only exist's if the element type is a React.Component
type ReactElementCallback<P extends {}> = (props: P, result: React.ReactNode, component?: React.Component<P>) => InjectorReturn<React.ReactNode>;

type UndoFunction = () => void;

interface Hook<F extends FunctionType> {
  after: Set<AfterCallback<F>>,
  instead: Set<InsteadCallback<F>>,
  before: Set<BeforeCallback<F>>,
  original: F
};

function apply<T extends FunctionType>(fn: T, that: ThisParameterType<T>, args: Parameters<T>): ReturnType<T> {
  return Function.prototype.apply.call(fn, that, args);
}

const HOOK_SYMBOL = Symbol.for("gluonza.patcher.hook");
function hookFunction<M extends Record<PropertyKey, any>, K extends KeysMatching<M, FunctionType>, F extends M[K]>(module: M, key: K): Hook<F> {
  const fn = module[key];

  if (HOOK_SYMBOL in fn) return fn[HOOK_SYMBOL];

  const hook: Hook<F> = {
    after: new Set(),
    instead: new Set(),
    before: new Set(),
    original: fn
  };

  const glounzaPatcher = new Proxy(fn, {
    apply(target, that, argArray) {
      const args = Array.from(argArray) as Parameters<F>;
  
      for (const before of hook.before) before(that, args)
  
      let result: ReturnType<F>;
      if (!hook.instead.size) {
        result = apply(fn, that, args);
      }
      else {
        const insteadHooks = Array.from(hook.instead);
        const instead = insteadHooks.at(0)!;
        let depth = 1;

        const goDeeper: M[K] = new Proxy(target, {
          apply(target, thisArg, argArray) {
            const hook = insteadHooks.at(depth++);
            if (hook) return hook(thisArg, argArray as Parameters<F>, goDeeper as F);
            return apply(target, thisArg, argArray as Parameters<F>);
          }
        });
  
        result = instead(that, args, goDeeper as F);
      }
  
      for (const after of hook.after) {
        const res = after(that, args, result);
        if (res instanceof InjectorReturn) result = res.value;
      }
  
      return result;
    }
  });

  glounzaPatcher[HOOK_SYMBOL] = hook;
  module[key] = glounzaPatcher;

  return hook;
};

const patches = new WeakMap<Injector, Set<UndoFunction>>();

export class Patcher {
  static #map = {};
  static before(id, ...args) {
    const patcher = Patcher.#map[id] ??= new Patcher(id);

    return patcher.before(...args);
  }
  static instead(id, ...args) {
    const patcher = Patcher.#map[id] ??= new Patcher(id);

    return patcher.instead(...args);
  }
  static after(id, ...args) {
    const patcher = Patcher.#map[id] ??= new Patcher(id);

    return patcher.after(...args);
  }
  static unpatchAll(id) {
    const patcher = Patcher.#map[id] ??= new Patcher(id);

    patcher.unpatchAll();
  }
  static getPatchesByCaller(id) {
    const patcher = Patcher.#map[id] ??= new Patcher(id);

    return patcher.getPatchesByCaller();
  }

  constructor(name) {
    if (Patcher.#map[name]) return Patcher.#map[name];
    this.#name = name;
    Patcher.#map[name] = this;
  }
  #name;
  #id = 0;
  #injector = new window.gluonza.Injector();
  #patches = new Set();

  getPatchesByCaller() {
    return [...this.#patches];
  }

  before(...args: any[]) {
    const undo = this.#injector.before(...args);

    const obj = {
      callback: args[2],
      id: this.#id++,
      type: "before",
      caller: this.#name,
      unpatch: () => {
        this.#patches.delete(obj);
        undo();
      }
    }

    this.#patches.add(obj);

    return obj.unpatch;
  }
  instead(...args: any[]) {
    const undo = this.#injector.instead(...args);

    const obj = {
      callback: args[2],
      id: this.#id++,
      type: "instead",
      caller: this.#name,
      unpatch: () => {
        this.#patches.delete(obj);
        undo();
      }
    }

    this.#patches.add(obj);

    return obj.unpatch;
  }
  after(...args) {
    const undo = this.#injector.after(...args);

    const obj = {
      callback: args[2],
      id: this.#id++,
      type: "after",
      caller: this.#name,
      unpatch: () => {
        this.#patches.delete(obj);
        undo();
      }
    }

    this.#patches.add(obj);

    return obj.unpatch;
  }
  unpatchAll(...args) {
    for (const iterator of this.#patches) {
      iterator.unpatch();
    }
  }
}
export class Injector {
  public static return<T extends any>(value: T) {
    return new InjectorReturn(value);
  }
  public static getOriginal<T extends FunctionType>(hooked: T): T {
    if (HOOK_SYMBOL in hooked) (hooked[HOOK_SYMBOL] as Hook<T>).original;
    return hooked;
  }

  public static patchElement<P extends {} = {}>(node: React.ReactElement<P, React.JSXElementConstructor<P>>, callback: ReactElementCallback<P>) {
    if (!window.gluonza.React.isValidElement(node)) throw new TypeError(`Argument 'node' must be type a react element!`);

    const { type } = node;

    if (type.prototype instanceof window.gluonza.React.Component) {
      const $type = type as React.ComponentClass<P> & { prototype: React.Component<P> };

      node.type = class extends $type {
        static [HOOK_SYMBOL] = type;
        render() {
          const result = super.render();

          const res = callback(this.props, result, this);
          if (res instanceof InjectorReturn) return res.value;
          
          return result;
        }
      }

      return;
    }

    function newType(props: P) {
      const result = (type as Function).apply(null, arguments);

      const res = callback(props, result);
      if (res instanceof InjectorReturn) return res.value;

      return result;
    }
    newType.displayName = (node.type as any).displayName;
    newType[HOOK_SYMBOL] = type;

    node.type = newType;
  }

  // Copy the 3 static methods to the prototype
  public return<T extends any>(value: T) {
    return Injector.return(value);
  }
  public getOriginal<T extends FunctionType>(hooked: T): T {
    return Injector.getOriginal(hooked);
  }
  public patchElement<P extends {} = {}>(node: React.ReactElement<P, React.JSXElementConstructor<P>>, callback: ReactElementCallback<P>) {
    Injector.patchElement(node, callback);
  }

  // Runs callback after the original function was called
  public after<M extends Record<PropertyKey, any>, K extends KeysMatching<M, FunctionType>, F extends M[K]>(module: M, key: K, callback: AfterCallback<F>) {
    const hook = hookFunction(module, key);

    hook.after.add(callback);

    if (!patches.has(this)) patches.set(this, new Set<() => void>());
    const $patches = patches.get(this)!;
  
    function undo() {
      $patches.delete(undo);
      hook.after.delete(callback);
    }

    $patches.add(undo);
    return undo;
  }
  // Runs the callback instead of the original function
  public instead<M extends Record<PropertyKey, any>, K extends KeysMatching<M, FunctionType>, F extends M[K]>(module: M, key: K, callback: InsteadCallback<F>) {
    const hook = hookFunction(module, key);

    hook.instead.add(callback);

    if (!patches.has(this)) patches.set(this, new Set<() => void>());
    const $patches = patches.get(this)!;
  
    function undo() {
      $patches.delete(undo);
      hook.instead.delete(callback);
    }

    $patches.add(undo);
    return undo;
  }
  // Runs callback before the original function was called
  public before<M extends Record<PropertyKey, any>, K extends KeysMatching<M, FunctionType>, F extends M[K]>(module: M, key: K, callback: BeforeCallback<F>) {
    const hook = hookFunction(module, key);

    hook.before.add(callback);

    if (!patches.has(this)) patches.set(this, new Set<() => void>());
    const $patches = patches.get(this)!;
  
    function undo() {
      $patches.delete(undo);
      hook.before.delete(callback);
    }

    $patches.add(undo);
    return undo;
  }
  // Undos all patches
  public unpatchAll() {
    if (!patches.has(this)) return;
    for (const undo of patches.get(this)!) undo();
  }
}