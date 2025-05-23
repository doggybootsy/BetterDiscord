import JsonStore from "@stores/json";


/**
 * `Data` is a simple utility class for the management of plugin data. An instance is available on {@link BdApi}.
 * @type Data
 * @summary {@link Data} is a simple utility class for the management of plugin data.
 * @name Data
 */
class Data {

    #callerName = "";

    constructor(callerName?: string) {
        if (!callerName) return;
        this.#callerName = callerName;
    }

    /**
     * Saves JSON-serializable data.
     *
     * @param {string} pluginName Name of the plugin saving data
     * @param {string} key Which piece of data to store
     * @param {any} data The data to be saved
     */
    save(pluginName: string, key: string, data: unknown) {
        if (this.#callerName) {
            data = key;
            key = pluginName;
            pluginName = this.#callerName;
        }
        return JsonStore.setData(pluginName, key, data);
    }

    /**
     * Loads previously stored data.
     *
     * @param {string} pluginName Name of the plugin loading data
     * @param {string} key Which piece of data to load
     * @returns {any} The stored data
     */
    load(pluginName: string, key: string) {
        if (this.#callerName) {
            key = pluginName;
            pluginName = this.#callerName;
        }
        return JsonStore.getData(pluginName, key);
    }

    /**
     * Deletes a piece of stored data. This is different than saving `null` or `undefined`.
     *
     * @param {string} pluginName Name of the plugin deleting data
     * @param {string} key Which piece of data to delete.
     */
    delete(pluginName: string, key: string) {
        if (this.#callerName) {
            key = pluginName;
            pluginName = this.#callerName;
        }
        return JsonStore.deleteData(pluginName, key);
    }

    /**
     * Add a listener for whenever the plugin data is changed.
     *
     * @example
     * BdApi.Data.on("Foo", "Bar", function(data) {
     *     const wasDeleted = arguments.length === 0;
     *     if (wasDeleted) {
     *          console.log("Data Was Deleted");
     *          return;
     *      }
     *
     *      console.log("Data was changed:", data);
     * });
     *
     * @example
     * // When passing only a pluginName it will listen to all changes
     * BdApi.Data.on("Foo", function(key, data) {
     *     const wasDeleted = arguments.length === 1;
     *     if (wasDeleted) {
     *          console.log(`'${key}' Was Deleted`);
     *          return;
     *      }
     *
     *      console.log(`'${key}' Was Changed:`, data);
     * });
     *
     * @param {string} pluginName Name of the plugin to listen too
     * @param {string} key Which piece of data to listen to.
     * @param {(newData?: any) => void} callback The callback for when the data has been updated
     * @return {() => void} An undo function
     */
    on(pluginName: string, key: string, callback: (newData: any) => void) {
        if (this.#callerName) {
            // @ts-expect-error Types are scary
            callback = key;
            key = pluginName;
            pluginName = this.#callerName;
        }

        if (typeof key === "function") {
            JsonStore.addPluginListener(pluginName, true, key);

            return () => JsonStore.removePluginListener(pluginName, true, key);
        }

        JsonStore.addPluginListener(pluginName, key, callback);
        return () => JsonStore.removePluginListener(pluginName, key, callback);
    }
    /**
     * Remove a listener for whenever the plugin data is changed.
     *
     * @param {string} pluginName Name of the plugin to unlisten too
     * @param {string} key Which piece of data to unlisten to.
     * @param {(newData?: any) => void} callback The callback for when the data has been updated
     */
    off(pluginName: string, key: string, callback: (newData: any) => void) {
        if (this.#callerName) {
            // @ts-expect-error Types are scary
            callback = key;
            key = pluginName;
            pluginName = this.#callerName;
        }

        if (typeof key === "function") {
            return JsonStore.removePluginListener(pluginName, true, key);
        }

        JsonStore.removePluginListener(pluginName, key, callback);
    }
}

Object.freeze(Data);
Object.freeze(Data.prototype);
export default Data;