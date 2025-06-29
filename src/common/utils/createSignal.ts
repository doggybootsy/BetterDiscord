
type Signal<T> = [
    accessor: (forceNoUseHook?: boolean) => T,
    setter: (value: T | ((prev: T) => T)) => T
];

interface Options<T> {
    equals?: false | ((prev: T, next: T) => boolean);
    onChange?(value: T): void;
}

// This is 2 prevent from doing access twice in the same component
// Because of hooks and such
let hasBeenCalledInStack = false;

// importing react crashes discord
let react: typeof import("react");
function inReactContext(smart: boolean) {
    if (!react) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        react = require("@modules/react").default;
    }

    if (!String((react as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H.useId).includes("throw")) {
        if (smart && typeof scheduler === "object") {
            if (hasBeenCalledInStack) return false;

            hasBeenCalledInStack = true;
            scheduler.postTask(() => {
                hasBeenCalledInStack = false;
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
 * const [ access, setter ] = createSignal(BdApi.Data.load<boolean>("MyPlugin", "key"), {
 *      // Automatically save plugin data
 *      onChange: BdApi.Data.save.bind(null, "MyPlugin", "key")
 * });
 *
 * access(); // access
 * setter(v => !v) // setter
 */
export default function createSignal<T>(defaultValue: T | (() => T), opts?: Options<T>): Signal<T> {
    let state: T;
    const createdInReactContext = inReactContext(false);

    const listeners = createdInReactContext ? react.useRef(new Set<(value: T) => void>()).current : new Set<(value: T) => void>();

    if (createdInReactContext) {
        const [currentState, setState] = react.useState(() => ({
            current: typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue
        }));

        state = currentState.current;
        listeners.add(react.useCallback((value) => setState({current: value}), []));

        const once = react.useRef(true);
        if (once.current && typeof opts?.onChange === "function") {
            listeners.add(opts.onChange);
            once.current = false;
        }
    }
    else {
        state = typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;

        if (typeof opts?.onChange === "function") {
            listeners.add(opts.onChange);
        }
    }

    let equals = (prev: T, next: T) => Object.is(prev, next);
    if (typeof opts?.equals === "function") {
        equals = opts.equals;
    }
    else if (opts?.equals === false) {
        equals = () => false;
    }

    const createReturnee: () => Signal<T> = () => [
        (forceNoUseHook) => {
            if (!forceNoUseHook && !createdInReactContext && inReactContext(true)) {
                const [, forceUpdate] = react.useReducer<number, any>((num) => num + 1, 0);

                react.useInsertionEffect(() => {
                    function listener() {
                        forceUpdate();
                    }

                    listeners.add(listener);
                    return () => void listeners.delete(listener);
                }, []);
            }

            return state;
        },
        (value) => {
            const newState = typeof value === "function" ? (value as (prev: T) => T)(state) : value;

            if (!equals(state, newState)) {
                state = newState;

                for (const element of listeners) {
                    element(state);
                }
            }

            return state;
        }
    ];

    if (createdInReactContext) react.useMemo(createReturnee, [state]);
    return createReturnee();
}
