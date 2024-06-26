import path from "node:path";
import fs from "node:fs";
import {app} from "electron";

import {MOD_NAME} from "common/consts";

const release = require(path.join(app.getAppPath(), "..", "build_info.json")).releaseChannel;

type FolderStructure = {
    [key: string]: FolderStructure | string[];
};

// create the file director with this (above the rdt call)
const fileDirectory: FolderStructure = {
    plugins: [],
    themes: [],
    settings: [release],
    data: []
}

function createFolderTree(basePath: string, structure: FolderStructure) {
    for (const folder in structure) {
        if (!Object.prototype.hasOwnProperty.call(structure, folder)) return;
        const folderPath = path.join(basePath, folder);

        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, {recursive: true});

        const subStructure = structure[folder]!;

        if (Array.isArray(subStructure)) {
            for (const subFolder of subStructure) {
                const subFolderPath = path.join(folderPath, subFolder);

                if (!fs.existsSync(subFolderPath))
                    fs.mkdirSync(subFolderPath, {recursive: true});
            }
        } else
            createFolderTree(folderPath, subStructure);
    }
}

createFolderTree(app.getPath("appData"), {[MOD_NAME]: fileDirectory})
