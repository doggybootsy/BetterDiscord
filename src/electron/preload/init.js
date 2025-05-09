import {ipcRenderer as IPC} from "electron";
import * as IPCEvents from "@common/constants/ipcevents";

export default function() {
    // Load Discord's original preload
    const preload = process.env.DISCORD_PRELOAD;
    if (preload) {

        // Restore original preload for future windows
        IPC.send(IPCEvents.REGISTER_PRELOAD, preload);
        // Run original preload
        try {
            const originalKill = process.kill;
            process.kill = function() {};
            require(preload);
            process.kill = originalKill;
        }
        catch {
            // TODO bail out
        }
    }
}