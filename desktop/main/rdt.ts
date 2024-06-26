import fs from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";
import electron from "electron";

const RDT_PATH = path.join(electron.app.getPath("appData"), "gluonza", "fmkadmapgofadopljbjfkapdkoienihi");
const RDT_ZIP_PATH = `${RDT_PATH}.zip`;
const RDT_DOWNLOAD_URL = "https://replugged.dev/api/v1/react-devtools";

async function downloadRDT() {
    if (existsSync(RDT_PATH)) return;

    let buffer: Buffer;

    if (!existsSync(RDT_ZIP_PATH)) {
        const request = await fetch(RDT_DOWNLOAD_URL, {
            headers: {
                "User-Agent": electron.session.defaultSession.getUserAgent()
            }
        });
        buffer = Buffer.from(await request.arrayBuffer());

        await fs.writeFile(RDT_ZIP_PATH, buffer);
    } else buffer = await fs.readFile(RDT_ZIP_PATH);

    const zip = new AdmZip(buffer);

    return new Promise<void>((resolve, reject) => {
        zip.extractAllToAsync(RDT_PATH, true, false, (error) => {
            if (error) return reject(error);
            resolve();
        })
    });
}

export async function downloadAndLoadRDT() {
    await electron.app.whenReady();

    await downloadRDT();

    await electron.session.defaultSession.loadExtension(RDT_PATH, {allowFileAccess: true});
}