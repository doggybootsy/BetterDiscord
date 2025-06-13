import electron from "electron";
import path from "path";

import * as IPCEvents from "@common/constants/ipcevents";

export let dataPath = "";
if (process.platform === "win32" || process.platform === "darwin") dataPath = path.join(electron.ipcRenderer.sendSync(IPCEvents.GET_PATH, "userData"), "..");
else dataPath = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : path.join(process.env.HOME!, ".config"); // This will help with snap packages eventually
dataPath = path.join(dataPath, "BetterDiscord") + "/";

export const dataFolder = path.resolve(dataPath, "data", process.env.DISCORD_RELEASE_CHANNEL!);

let _settings: Record<string, Record<string, any>>;
export function getSetting(category: string, key: string) {
    if (_settings) return _settings[category]?.[key];

    try {
        const settingsFile = path.resolve(dataFolder, "settings.json");
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        _settings = require(settingsFile) ?? {};
        return _settings[category]?.[key];
    }
    catch {
        _settings = {};
        return _settings[category]?.[key];
    }
}