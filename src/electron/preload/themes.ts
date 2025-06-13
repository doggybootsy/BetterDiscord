import fs from "fs";
import {dataFolder, dataPath} from "./settings";
import path from "path";

const styleContainer = document.createElement("div");
styleContainer.id = "bd-early-themes";

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const enabledThemes = require(path.resolve(dataFolder, "themes.json"));
    for (const filename of fs.readdirSync(path.resolve(dataPath, "themes"))) {
        if (!filename.endsWith(".theme.css") || enabledThemes[filename]) continue;

        const style = document.createElement("style");
        style.id = filename;
        style.textContent = fs.readFileSync(path.resolve(dataPath, "themes", filename), "utf-8");

        styleContainer.append(style);
    }
}
finally {
    document.addEventListener("DOMContentLoaded", () => {
        document.body.append(styleContainer);
    }, {once: true});
}