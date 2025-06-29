
type Signal<T> = [
    accessor: () => T,
    setter: (value: T | ((prev: T) => T)) => T,
    addChangeListener: (callback: (value: T) => void) => () => void
];

interface Options<T> {
    equals?: false | ((prev: T, next: T) => boolean);
}

// This is 2 prevent from doing access twice in the same component
// Because of hooks and such
let hasBeenInReact = false;

// importing react crashes discord
let react: typeof import("react");
function inReactContext() {
    if (!react) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        react = require("@modules/react").default;
    }

    if (!String((react as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H.useId).includes("throw")) {
        if (typeof scheduler === "object") {
            if (hasBeenInReact) return false;

            hasBeenInReact = true;
            scheduler.postTask(() => {
                hasBeenInReact = false;
            });
        }

        return true;
    }
    return false;
}

/**
 * A function similar to [solidjs.createSignal]({@link https://docs.solidjs.com/reference/basic-reactivity/create-signal}) but for react
 *
 * @example
 * // Inside Component
 * const [ access, setter ] = createSignal(0);
 *
 * function MyComponent() {
 *      return <div>{access()}</div>
 * }
 *
 * setInterval(() => setter(v => v + 1), 50);
 *
 * @example
 * // Plugin Storage
 * const [ access, setter, addChangeListener ] = createSignal(BdApi.Data.load<boolean>("MyPlugin", "key"));
 *
 * // Automatically save plugin data
 * addChangeListener(BdApi.Data.save.bind(null, "MyPlugin", "key"));
 *
 * access(); // access
 * setter(v => !v) // setter
 */
export default function createSignal<T>(defaultValue: T | (() => T), opts?: Options<T>): Signal<T> {
    let state = typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;

    let equals = (prev: T, next: T) => Object.is(prev, next);
    if (typeof opts?.equals === "function") {
        equals = opts.equals;
    }
    else if (opts?.equals === false) {
        equals = () => true;
    }

    const listeners = new Set<(value: T) => void>();

    return [
        () => {
            if (inReactContext()) {
                react.useSyncExternalStore((onStoreChange) => {
                    listeners.add(onStoreChange);
                    return () => void listeners.delete(onStoreChange);
                }, () => Symbol());
            }

            return state;
        },
        (value) => {
            const newState = typeof value === "function" ? (value as (prev: T) => T)(state) : value;

            if (!equals(state, newState)) {
                state = newState;

                for (const listener of listeners) {
                    listener(state);
                }
            }

            return state;
        },
        (callback) => {
            listeners.add(callback);
            return () => void listeners.delete(callback);
        }
    ];
}
