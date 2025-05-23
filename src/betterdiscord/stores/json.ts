import fs from "@polyfill/fs";
import path from "path";
import Store from "./base";
import Config from "./config";


type Files = "settings" | "plugins" | "themes" | "misc" | "addon-store";

export default new class JsonStore extends Store {
    cache: Record<Files, Record<string, unknown> | undefined> = {
        "settings": undefined,
        "plugins": undefined,
        "themes": undefined,
        "misc": undefined,
        "addon-store": undefined
    };

    pluginCache: Record<string, Record<string, unknown>> = {};

    // Normal BD data
    get(file: Files): Record<string, unknown>;
    get(file: Files, key: string): unknown;
    get(file: Files, key?: string) {
        this.cache[file] = this.#ensureData(file);
        if (typeof key === "undefined") return this.cache[file] ?? {};
        return this.cache[file][key] ?? "";
    }

    set(file: Files, key: Record<string, unknown>): void;
    set(file: Files, key: string, value: unknown): void;
    set(file: Files, key: Record<string, unknown> | string, value?: unknown) {
        this.cache[file] = this.#ensureData(file);
        if (typeof value === "undefined") {
            if (typeof key === "string") throw new Error("Cannot save string as JSON");
            this.cache[file] = key;
        }
        else {
            if (typeof key !== "string") throw new Error("Cannot use object as key");
            this.cache[file][key] = value;
        }

        this.#save(file);
    }

    delete(file: Files, key: string) {
        this.cache[file] = this.#ensureData(file);
        delete this.cache[file][key];
        this.#save(file);
    }

    #ensureData(file: Files): Record<string, unknown> {
        if (typeof (this.cache[file]) !== "undefined") return this.cache[file]; // Already have data cached
        let data;
        try {
            data = JSON.parse(fs.readFileSync(path.resolve(Config.get("channelPath"), `${file}.json`)));
        }
        catch {
            data = {};
        }
        return data;
    }

    #save(file: Files) {
        fs.writeFileSync(path.resolve(Config.get("channelPath"), `${file}.json`), JSON.stringify(this.cache[file], null, 4));
        this.emit();
    }


    // Plugin data
    #getPluginFile(pluginName: string) {
        return path.resolve(Config.get("pluginsPath"), pluginName + ".config.json");
    }

    #ensurePluginData(pluginName: string) {
        if (typeof (this.pluginCache[pluginName]) !== "undefined") return; // Already have data cached

        // Setup blank data if config doesn't exist
        if (!fs.existsSync(this.#getPluginFile(pluginName))) return this.pluginCache[pluginName] = {};

        try {
            // Getting here means not cached, read from disk
            this.pluginCache[pluginName] = JSON.parse(fs.readFileSync(this.#getPluginFile(pluginName)).toString());
        }
        catch {
            // Setup blank data if parse fails
            return this.pluginCache[pluginName] = {};
        }
    }

    #pluginListeners: Map<string, {keys: Map<string, Set<(newData?: unknown) => void>>, all: Set<(key: string, newData?: unknown) => void>;}> = new Map();
    #emitPluginListeners(pluginName: string, key: string, newData?: unknown) {
        if (!this.#pluginListeners.has(pluginName)) return;

        const pluginListeners = this.#pluginListeners.get(pluginName)!;

        for (const element of pluginListeners.all) {
            // So plugins can do arguments.length === 1 to see if it was a delete
            if (arguments.length === 3) {
                element(key, newData);
            }
            else {
                element(key);
            }
        }

        if (!pluginListeners.keys.has(key)) return;

        const listeners = pluginListeners.keys.get(key)!;

        for (const element of listeners) {
            // So plugins can do arguments.length === 0 to see if it was a delete
            if (arguments.length === 3) {
                element(newData);
            }
            else {
                element();
            }
        }
    }

    addPluginListener(pluginName: string, key: string | true, callback: any) {
        if (!this.#pluginListeners.has(pluginName)) {
            this.#pluginListeners.set(pluginName, {
                keys: new Map(),
                all: new Set()
            });
        }

        const pluginListeners = this.#pluginListeners.get(pluginName)!;
        if (key === true) {
            pluginListeners.all.add(callback);
            return;
        }

        if (!pluginListeners.keys.has(key)) {
            pluginListeners.keys.set(key, new Set());
        }

        const listeners = pluginListeners.keys.get(key)!;
        listeners.add(callback);
    }
    removePluginListener(pluginName: string, key: string | true, callback: any) {
        if (!this.#pluginListeners.has(pluginName)) return;

        const pluginListeners = this.#pluginListeners.get(pluginName)!;
        if (key === true) {
            pluginListeners.all.delete(callback);
            if (!pluginListeners.keys.size && !pluginListeners.all.size) {
                this.#pluginListeners.delete(pluginName)!;
            }

            return;
        }

        if (!pluginListeners.keys.has(key)) {
            return;
        }

        const listeners = pluginListeners.keys.get(key)!;
        listeners.delete(callback);

        if (!listeners.size) {
            pluginListeners.keys.delete(key);
        }

        if (!pluginListeners.keys.size && !pluginListeners.all.size) {
            this.#pluginListeners.delete(pluginName)!;
        }
    }

    #savePluginData(pluginName: string) {
        fs.writeFileSync(this.#getPluginFile(pluginName), JSON.stringify(this.pluginCache[pluginName], null, 4));
        this.emit();
    }

    getData(pluginName: string, key: string) {
        this.#ensurePluginData(pluginName); //       Ensure plugin data, if any, is cached
        return this.pluginCache[pluginName][key]; // Return blindly to allow falsey values
    }

    setData(pluginName: string, key: string, value: unknown) {
        if (value === undefined) return; // Can't set undefined, use deletePluginData
        this.#ensurePluginData(pluginName); // Ensure plugin data, if any, is cached

        this.pluginCache[pluginName][key] = value;
        this.#savePluginData(pluginName);
        this.#emitPluginListeners(pluginName, key, value);
    }

    deleteData(pluginName: string, key: string) {
        this.#ensurePluginData(pluginName); // Ensure plugin data, if any, is cached
        delete this.pluginCache[pluginName][key];
        this.#savePluginData(pluginName);
        this.#emitPluginListeners(pluginName, key);
    }
};