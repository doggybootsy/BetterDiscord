import {useInsertionEffect, useReducer, useRef} from "@modules/react";
import type Store from "../stores/base";
import type React from "react";
import type {FluxStore} from "../types/discord/modules";
import {shallowEqual} from "fast-equals";

type StoreType = Store | FluxStore;

/**
 * Dynamically get data from Discord Flux Stores and BetterDiscord Stores
 * @example
 * // Discord Flux Store
 * function MyComponent() {
 *      const currentUser = useStateFromStores(BdApi.Webpack.Stores.UserStore, () => BdApi.Webpack.Stores.UserStore.getCurrentUser());
 *
 *      // Do stuff with the current user
 * }
 *
 * @example
 * // Custom store
 * const MyStore = new class extends BdApi.Utils.Store {
 *      getData() {return this._value;}
 *      setData(value) {
 *          this._value = value;
 *          this.emitChange();
 *      }
 * }
 *
 * function MyComponent() {
 *      const currentData = useStateFromStores(MyStore, () => MyStore.getData());
 *
 *      // Do stuff with the current data
 * }
 *
 * // Later
 * MyStore.setData(123); // Will automatically update the UI
 *
 * @example
 * // Using more than one store
 * function MyComponent() {
 *      const selectedChannel = useStateFromStores([
 *          BdApi.Webpack.Stores.SelectedChannelStore,
 *          BdApi.Webpack.Stores.ChannelStore
 *      ], () => {
 *          const currentChannelId = BdApi.Webpack.Stores.SelectedChannelStore.getCurrentlySelectedChannelId();
 *
 *          return BdApi.Webpack.Stores.ChannelStore.getChannel(currentChannelId);
 *      });
 *
 *      // Do stuff with the currently selected channel
 * }
 */
export function useStateFromStores<T>(stores: StoreType | readonly StoreType[], factory: () => T, deps?: React.DependencyList, areStatesEqual: true | ((oldState: T, newState: T) => boolean) = (oldState, newState) => oldState === newState): T {
    const [, forceUpdate] = useForceUpdate();
    const state = useRef(undefined as T);
    const factoryRef = useRef(undefined as unknown as () => T);
    const compareStates = useRef(areStatesEqual === true ? shallowEqual : areStatesEqual).current;

    if (factoryRef.current === undefined) {
        factoryRef.current = factory;
        state.current = factory();
    }

    const prevDeps = useRef<React.DependencyList | undefined>(undefined);
    if (deps && prevDeps.current) {
        if (deps.length !== prevDeps.current.length) {
            throw new Error("Dependency List Size Changed!");
        }

        for (let index = 0; index < deps.length; index++) {
            if (Object.is(deps[index], prevDeps.current[index])) {
                continue;
            }

            factoryRef.current = factory;

            const newState = factory();

            if (!compareStates(state.current, newState)) {
                state.current = newState;
            }

            break;
        }
    }
    else {
        // If no deps update factory always
        factoryRef.current = factory;
    }

    prevDeps.current = deps;

    useInsertionEffect(() => {
        const $stores: readonly StoreType[] = Array.isArray(stores) ? stores : [stores];
        function listener() {
            const newState = factoryRef.current();
            if (!compareStates(state.current, newState)) {
                state.current = newState;
                forceUpdate();
            }
        }

        for (const store of $stores) {
            store.addChangeListener(listener);
        }

        return () => {
            for (const store of $stores) {
                store.removeChangeListener(listener);
            }
        };
    }, []);

    return state.current;
}

export function useForceUpdate() {
    return useReducer<number, any>((num) => num + 1, 0);
}