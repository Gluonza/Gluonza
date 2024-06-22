import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";
import electron from "electron";

const RDT_PATH = path.join(__dirname, "fmkadmapgofadopljbjfkapdkoienihi");
const RDT_ZIP_PATH = path.join(__dirname, "fmkadmapgofadopljbjfkapdkoienihi.zip");

async function downloadRDT() {
  if (existsSync(RDT_PATH)) return;

  let buffer: Buffer;

  if (!existsSync(RDT_ZIP_PATH)) {
    const request = await fetch("https://replugged.dev/api/v1/react-devtools", {
      headers: {
        "User-Agent": ""
      }
    });
    buffer = Buffer.from(await request.arrayBuffer());
  
    await fs.writeFile(RDT_ZIP_PATH, buffer);
  }
  else buffer = await fs.readFile(RDT_ZIP_PATH);

  const zip = new AdmZip(buffer);

  return new Promise<void>((resolve, reject) => {
    zip.extractAllToAsync(RDT_PATH, true, false, (error) => {
      if (error) return reject(error);
      resolve();
    })
  });
}

export async function downloadAndLoadRDT() {
  await downloadRDT();

  await electron.app.whenReady();

  await electron.session.defaultSession.loadExtension(RDT_PATH, { allowFileAccess: true });
}