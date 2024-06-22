import path from "node:path";
import { app } from "electron";
import { downloadAndLoadRDT } from "./rdt";

import "./overrides";
import "./ipc";
import fs from "node:fs";
import {MOD_NAME} from "common/consts.js";

const release = require(path.join(app.getAppPath(), "..", "build_info.json")).releaseChannel;

// create the file director with this (above the rdt call)
const fileDirectory = {
  plugins: [],
  themes: [],
  settings: [ release ],
  data: []
}

type FolderStructure = {
  [key: string]: FolderStructure | never[];
};

function createFolderTree(basePath: string, structure: FolderStructure)
{
  Object.keys(structure).forEach((folder) =>
  {
    const folderPath = path.join(basePath, folder);

    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });

    const subStructure = structure[folder];

    if (Array.isArray(subStructure))
      subStructure.forEach(subFolder =>
      {
        if (typeof subFolder === 'string')
        {
          const subFolderPath = path.join(folderPath, subFolder);

          if (!fs.existsSync(subFolderPath))
            fs.mkdirSync(subFolderPath, { recursive: true });
        }
      });
    else
      createFolderTree(folderPath, subStructure as FolderStructure);
  });
}

// @ts-ignore
createFolderTree(app.getPath("appData"),{[MOD_NAME]: fileDirectory})

downloadAndLoadRDT();