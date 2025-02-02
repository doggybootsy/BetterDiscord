import fs from "fs";
import path from "path";
import electron from "electron";
import {spawn} from "child_process";

import ReactDevTools from "./reactdevtools";
import * as IPCEvents from "common/constants/ipcevents";

// Build info file only exists for non-linux (for current injection)
const appPath = electron.app.getAppPath();
const buildInfoFile = path.resolve(appPath, "..", "build_info.json");

// Locate data path to find transparency settings
let dataPath = "";
if (process.platform === "win32" || process.platform === "darwin") dataPath = path.join(electron.app.getPath("userData"), "..");
else dataPath = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : path.join(process.env.HOME, ".config"); // This will help with snap packages eventually
dataPath = path.join(dataPath, "BetterDiscord") + "/";

const script = `(async function() {
    try {
        function deepQuerySelector(node, selector) {
            if (!node) return null;
        
            // Check the current node
            const found = node.querySelector(selector);
            if (found) return found;
        
            if (node.shadowRoot) {
                const shadowResult = deepQuerySelector(node.shadowRoot, selector);
                if (shadowResult) return shadowResult;
            }
        
            for (let child of node.children) {
                const childResult = deepQuerySelector(child, selector);
                if (childResult) return childResult;
            }
        
            return null;
        }
              
        const header = deepQuerySelector(
            deepQuerySelector(
                deepQuerySelector(document, ".main-tabbed-pane"), 
                ".tabbed-pane-left-toolbar"
            )
            , ".toolbar-shadow"
        );
    
        async function evalInMainWindow(expression) {
            const { Context } = await import("devtools://devtools/bundled/panels/console/../../ui/legacy/legacy.js");
            const { RuntimeModel } = await import("devtools://devtools/bundled/panels/console/../../core/sdk/sdk.js");
    
            const ctx = Context.Context.instance().flavor(RuntimeModel.ExecutionContext);
    
            return await ctx.evaluate({
                expression,
                objectGroup: "console",
                includeCommandLineAPI: true,
                silent: false,
                returnByValue: false,
                generatePreview: false,
                replMode: true,
                allowUnsafeEvalBlockedByCSP: true
            }, true, false);
        }
    
        window._evalInMainWindow = evalInMainWindow;
    
        const icon = document.createElement("button");
        icon.classList.value = "toolbar-button toolbar-item toolbar-has-glyph";
        icon.innerHTML = '<svg class="bd-logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Calque_1" x="0px" y="0px" viewBox="0 0 2000 2000" enable-background="new 0 0 2000 2000" xml:space="preserve"><g><path fill="currentColor" class="bd-logo-b" d="M1402.2,631.7c-9.7-353.4-286.2-496-642.6-496H68.4v714.1l442,398V490.7h257c274.5,0,274.5,344.9,0,344.9H597.6v329.5h169.8c274.5,0,274.5,344.8,0,344.8h-699v354.9h691.2c356.3,0,632.8-142.6,642.6-496c0-162.6-44.5-284.1-122.9-368.6C1357.7,915.8,1402.2,794.3,1402.2,631.7z"/><path fill="currentColor" class="bd-logo-d" d="M1262.5,135.2L1262.5,135.2l-76.8,0c26.6,13.3,51.7,28.1,75,44.3c70.7,49.1,126.1,111.5,164.6,185.3c39.9,76.6,61.5,165.6,64.3,264.6l0,1.2v1.2c0,141.1,0,596.1,0,737.1v1.2l0,1.2c-2.7,99-24.3,188-64.3,264.6c-38.5,73.8-93.8,136.2-164.6,185.3c-22.6,15.7-46.9,30.1-72.6,43.1h72.5c346.2,1.9,671-171.2,671-567.9V716.7C1933.5,312.2,1608.7,135.2,1262.5,135.2z"/></g></svg>';
        icon.title = "BetterDiscord v${process.env.__VERSION__}";
        icon.style.display = "flex";
        icon.style.alignItems = "center";

        icon.onclick = async (event) => {
            const { ContextMenu } = await import("devtools://devtools/bundled/ui/legacy/legacy.js");

            const menu = new ContextMenu.ContextMenu(event);

            const section = menu.defaultSection();

            section.appendItem("Disable All Plugins", evalInMainWindow.bind(null, "for (const {id} of BdApi.Plugins.getAll()) BdApi.Plugins.disable(id);"), {
                jslogContext: "bd.disable.plugins"
            });
            section.appendItem("Disable All Themes", evalInMainWindow.bind(null, "for (const {id} of BdApi.Themes.getAll()) BdApi.Themes.disable(id);"), {
                jslogContext: "bd.disable.themes"
            });
            section.appendCheckboxItem("Disable Custom CSS", evalInMainWindow.bind(null, "customcss.disabled=!customcss.disabled"), {
                jslogContext: "bd.disable.css",
                checked: (await evalInMainWindow("customcss.disabled")).object.value
            });

            section.appendSeparator();

            section.appendItem("Support Server", evalInMainWindow.bind(null, "BdApi.Utils.showInviteModal('rC8b2H6SCt'"), {
                jslogContext: "bd.support"
            });

            menu.show();
        }

        icon.oncontextmenu = icon.onclick;
          
        header.insertBefore(icon, header.children[header.children.length - 1]);
    }
    catch(e) { console.error(e); throw e; }
})();`;

let hasCrashed = false;
export default class BetterDiscord {
    static getWindowPrefs() {
        if (!fs.existsSync(buildInfoFile)) return {};
        const buildInfo = __non_webpack_require__(buildInfoFile);
        const prefsFile = path.resolve(dataPath, "data", buildInfo.releaseChannel, "windowprefs.json");
        if (!fs.existsSync(prefsFile)) return {};
        return __non_webpack_require__(prefsFile);
    }

    static getSetting(category, key) {
        if (this._settings) return this._settings[category]?.[key];

        try {
            const buildInfo = __non_webpack_require__(buildInfoFile);
            const settingsFile = path.resolve(dataPath, "data", buildInfo.releaseChannel, "settings.json");
            this._settings = __non_webpack_require__(settingsFile) ?? {};
            return this._settings[category]?.[key];
        }
        catch (_) {
            this._settings = {};
            return this._settings[category]?.[key];
        }
    }

    static ensureDirectories() {
        if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
        if (!fs.existsSync(path.join(dataPath, "plugins"))) fs.mkdirSync(path.join(dataPath, "plugins"));
        if (!fs.existsSync(path.join(dataPath, "themes"))) fs.mkdirSync(path.join(dataPath, "themes"));
    }

    static async injectRenderer(browserWindow) {
        const location = path.join(__dirname, "renderer.js");
        if (!fs.existsSync(location)) return; // TODO: cut a fatal log
        const content = fs.readFileSync(location).toString();
        const success = await browserWindow.webContents.executeJavaScript(`
            (() => {
                try {
                    ${content}
                    return true;
                } catch(error) {
                    console.error(error);
                    return false;
                }
            })();
            //# sourceURL=betterdiscord/renderer.js
        `);

        if (!success) return; // TODO: cut a fatal log
    }

    static setup(browserWindow) {

        // Setup some useful vars to avoid blocking IPC calls
        try {
            process.env.DISCORD_RELEASE_CHANNEL = __non_webpack_require__(buildInfoFile).releaseChannel;
        }
        catch (e) {
            process.env.DISCORD_RELEASE_CHANNEL = "stable";
        }
        process.env.DISCORD_PRELOAD = browserWindow.__originalPreload;
        process.env.DISCORD_APP_PATH = appPath;
        process.env.DISCORD_USER_DATA = electron.app.getPath("userData");
        process.env.BETTERDISCORD_DATA_PATH = dataPath;

        // When DOM is available, pass the renderer over the wall
        browserWindow.webContents.on("dom-ready", () => {
            if (!hasCrashed) return this.injectRenderer(browserWindow);

            // If a previous crash was detected, show a message explaining why BD isn't there
            electron.dialog.showMessageBox({
                title: "Discord Crashed",
                type: "warning",
                message: "Something crashed your Discord Client",
                detail: "BetterDiscord has automatically disabled itself just in case. To enable it again, restart Discord or click the button below.\n\nThis may have been caused by a plugin. Try moving all of your plugins outside the plugin folder and see if Discord still crashed.",
                buttons: ["Try Again", "Open Plugins Folder", "Cancel"],
            }).then((result)=>{
                if (result.response === 0) {
                    electron.app.relaunch();
                    electron.app.exit();
                }
                if (result.response === 1) {
                    if (process.platform === "win32") spawn("explorer.exe", [path.join(dataPath, "plugins")]);
                    else electron.shell.openPath(path.join(dataPath, "plugins"));
                }
            });
            hasCrashed = false;
        });

        // This is used to alert renderer code to onSwitch events
        browserWindow.webContents.on("did-navigate-in-page", () => {
            browserWindow.webContents.send(IPCEvents.NAVIGATE);
        });

        browserWindow.webContents.on("render-process-gone", () => {
            hasCrashed = true;
        });
        
        browserWindow.webContents.on("devtools-open-url", (event, url) => {
            if (!(url.startsWith("https://") || url.startsWith("http://"))) return;

            event.preventDefault();
      
            electron.shell.openExternal(url, {});
        });

        browserWindow.webContents.on("devtools-opened", () => {
            browserWindow.webContents.devToolsWebContents?.executeJavaScript(script);
        });
        
        // Uncomment this to open devtools on devtools 
        // const devtools = new electron.BrowserWindow();
        // devtools.webContents.openDevTools({mode: "right"});

        // browserWindow.webContents.setDevToolsWebContents(devtools.webContents);
        // browserWindow.webContents.openDevTools();

        // Seems to be windows exclusive. MacOS requires a build plist change
        if (electron.app.setAsDefaultProtocolClient("betterdiscord")) {
            // If application was opened via protocol, set process.env.BETTERDISCORD_PROTOCOL
            const protocol = process.argv.find((arg) => arg.startsWith("betterdiscord://"));
            if (protocol) {
                process.env.BETTERDISCORD_PROTOCOL = protocol;
            }

            // I think this is how it works on MacOS
            // But cant work still because of a build plist needs changed (I think?)
            electron.app.on("open-url", (event, url) => {
                if (url.startsWith("betterdiscord://")) {
                    browserWindow.webContents.send(IPCEvents.HANDLE_PROTOCOL, url);
                }
            });

            electron.app.on("second-instance", (event, argv) => {
                // Ignore multi instance
                if (argv.includes("--multi-instance")) return;

                const url = argv.find((arg) => arg.startsWith("betterdiscord://"));

                if (url) {
                    browserWindow.webContents.send(IPCEvents.HANDLE_PROTOCOL, url);
                }
            });
        }
    }

    static disableMediaKeys() {
        if (!BetterDiscord.getSetting("general", "mediaKeys")) return;
        const originalDisable = electron.app.commandLine.getSwitchValue("disable-features") || "";
        electron.app.commandLine.appendSwitch("disable-features", `${originalDisable ? "," : ""}HardwareMediaKeyHandling,MediaSessionService`);
    }
}

if (BetterDiscord.getSetting("developer", "reactDevTools")) {
    electron.app.whenReady().then(async ()=>{
        await ReactDevTools.install(dataPath);
    });
}

// eslint-disable-next-line accessor-pairs
Object.defineProperty(global, "appSettings", {
    set(setting) {
        setting.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING", true);
        if (BetterDiscord.getSetting("window", "removeMinimumSize")) {
            setting.set("MIN_WIDTH", 0);
            setting.set("MIN_HEIGHT", 0);
        }
        else {
            setting.set("MIN_WIDTH", 940);
            setting.set("MIN_HEIGHT", 500);
        }
        delete global.appSettings;
        global.appSettings = setting;
    },
    configurable: true,
    enumerable: false
});
