import path from "node:path";
import { app } from "electron";
import { downloadAndLoadRDT } from "./rdt";

import "./overrides";
import "./ipc";

const release = path.join(app.getAppPath(), "..", "build_info.json");

// create the file director with this (above the rdt call)
const fileDirectory = {
  plugins: [],
  themes: [],
  settings: [ release ],
  data: []
}


downloadAndLoadRDT();