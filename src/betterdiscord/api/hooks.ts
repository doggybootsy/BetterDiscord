/* eslint-disable react-hooks/rules-of-hooks */
import JsonStore from "@stores/json";
import {useForceUpdate, useStateFromStores} from "@ui/hooks";

type UseDataArgs<Bounded extends boolean> = [
    ...(Bounded extends false ? [pluginName: string] : []),
    key: string
];

class Hooks<Bounded extends boolean> {
    #callerName = "";

    constructor(callerName?: string) {
        if (!callerName) return;
        this.#callerName = callerName;
    }

    useData<T>(...args: UseDataArgs<Bounded>) {
        if (this.#callerName) {
            return useStateFromStores(JsonStore, () => JsonStore.getData<T>(this.#callerName, args[0]));
        }

        return useStateFromStores(JsonStore, () => JsonStore.getData<T>(args[0], args[1]));
    }

    useForceUpdate = useForceUpdate;

    useStateFromStores = useStateFromStores;
}

Object.freeze(Hooks);
Object.freeze(Hooks.prototype);
export default Hooks;