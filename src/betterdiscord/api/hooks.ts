import type Store from "@stores/base";
import JsonStore from "@stores/json";
import {useForceUpdate, useStateFromStores} from "@ui/hooks";
import type {FluxStore} from "discord/modules";
import {useInsertionEffect, useState} from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Data from "./data";

export default class Hooks {
    constructor(callerName: string = "") {
        this.#callerName = callerName;
    }
    #callerName;

    /**
     * A [React use hook]({@link https://react.dev/learn/reusing-logic-with-custom-hooks}) version of {@link Data.load}
     *
     * @example
     * function Component() {
     *     const data = Hooks.useData("Foo", "Bar") ?? "Default Data";
     *
     *     return (
     *         <input
     *             value={data}
     *             onChange={(event) => Data.save("Foo", "Bar", event.currentTarget.value)}
     *         />
     *     )
     * }
     *
     * @param {string} pluginName Name of the plugin loading data
     * @param {string} key Which piece of data to load
     * @returns {any} The stored data
     */
    useData(pluginName: string, key: string) {
        if (this.#callerName) {
            key = pluginName;
            pluginName = this.#callerName;
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(() => JsonStore.getData(pluginName, key));

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useInsertionEffect(() => {
            setValue(JsonStore.getData(pluginName, key));

            return JsonStore.addPluginListener(pluginName, key, setValue);
        }, [pluginName, key]);

        return value;
    }

    useStateFromStores<T>(stores: Store | FluxStore | Array<Store | FluxStore>, factory: () => T, deps?: React.DependencyList, areStateEqual: (oldState: T, newState: T) => boolean = (oldState, newState) => oldState === newState): T {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useStateFromStores(stores, factory, deps, areStateEqual);
    }

    useForceUpdate() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useForceUpdate();
    }
}