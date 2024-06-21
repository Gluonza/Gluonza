import fs from "node:fs";
import path, { join } from "node:path";
import readline from "node:readline";
import cp from "node:child_process";
import asar from "@electron/asar";
import {fileURLToPath} from "node:url";

const dirname = path.join(fileURLToPath(import.meta.url), "..");

const gluonzaPath = JSON.stringify(path.resolve("build", "index.js")); // tickets please :>
const args = process.argv.slice(2);
const version = args[1];

const Logger = {
    green: (message) => {
        console.log('\x1b[34m[gluonza] \x1b[0m\x1b[32m%s\x1b[0m', message);
    },
    red: (message) => {
        console.log('\x1b[34m[gluonza] \x1b[0m\x1b[31m%s\x1b[0m', message);
    },
    blue: (message) => {
        console.log('\x1b[34m[gluonza] \x1b[0m\x1b[34m%s\x1b[0m', message);
    },
    yellow: (message) => {
        console.log('\x1b[34m[gluonza] \x1b[0m\x1b[33m%s\x1b[0m', message);
    },
    rainbow: (message) => { // this was literally NOT needed. but I got bored making this.
        const colors = ['\x1b[31m', '\x1b[33m', '\x1b[32m', '\x1b[36m', '\x1b[34m', '\x1b[35m'];
        let coloredMessage = '';
        for (let i = 0; i < message.length; i++) {
            const color = colors[i % colors.length];
            coloredMessage += `${color}${message[i]}`;
        }
        coloredMessage += '\x1b[0m';
        console.log(coloredMessage);
    },
};

if (!version) {
    Logger.red('Please provide a version argument (e.g., Stable, Canary, Development).');
    process.exit(1);
}

const validVersions = {
    'Stable': 'Discord',
    'Canary': 'DiscordCanary',
    'Development': 'DiscordDevelopment',
    'PTB': 'DiscordPTB'
};

const baseFolderName = validVersions[version];

if (!baseFolderName) {
    Logger.red('Invalid version argument. Use "Stable", "Canary" or "Development".');
    process.exit(1);
}

const getAllUserProfiles = () => {
    const userProfiles = [];
    const usersDir = path.join(process.env.SYSTEMDRIVE, 'Users');
    const userFolders = fs.readdirSync(usersDir);

    userFolders.forEach(userFolder => {
        const profilePath = path.join(usersDir, userFolder);
        if (fs.lstatSync(profilePath).isDirectory()) {
            userProfiles.push(profilePath);
        }
    });

    return userProfiles;
};

const killDiscord = () => new Promise((r) => {
    cp.exec(`Get-Process -Name ${baseFolderName} -ea SilentlyContinue | Stop-Process -Force`, { shell: "powershell" }, () => r()).on("error", () => r());
});

const findDiscordPaths = (profilePath) => {
    const targetPaths = [];
    const basePath = path.join(profilePath, 'AppData', 'Local', baseFolderName);
    if (fs.existsSync(basePath)) {
        const appFolders = fs.readdirSync(basePath).filter(folder => {
            const fullPath = path.join(basePath, folder);
            return folder.startsWith('app') && fs.lstatSync(fullPath).isDirectory();
        });

        for (const appFolder of appFolders.sort()) {
            const appdir = path.join(basePath, appFolder, 'resources');

            if (!fs.existsSync(appdir)) return;

            targetPaths.push(appdir);
        }
    }

    return targetPaths;
};

const userProfiles = getAllUserProfiles();
const allTargetPaths = [];

userProfiles.forEach(profilePath => {
    const discordPaths = findDiscordPaths(profilePath);
    if (discordPaths.length > 0) {
        discordPaths.forEach(targetPath => {
            allTargetPaths.push({userProfile: profilePath, path: targetPath});
        });
    }
});

const makeGlounzaAsar = async () => {
    if (!fs.existsSync(join(dirname, "..", "build"))) {
        Logger.red("You need to compile glounza first!");
        process.exit(1);
    }
    
    if (fs.existsSync(join(dirname, "..", "app.asar"))) {
        fs.rmSync(join(dirname, "..", "app.asar"));
    }

    if (!fs.existsSync(join(dirname, "..", "app"))) fs.mkdirSync(join(dirname, "..", "app"));
 
    await fs.promises.writeFile(join(dirname, "..", "app", "index.js"), `require(${gluonzaPath});\nrequire("../glounza.app.asar");`);
    await fs.promises.writeFile(join(dirname, "..", "app", "package.json"), JSON.stringify({
        main: "./index.js"
    }));

    return asar.createPackage(join(dirname, "..", "app"), join(dirname, "..", "app.asar"));
}

const selectTargetPath = (selectedPath) => {
    const asarPath = path.join(selectedPath, "app.asar");
    const asarPathOriginal = path.join(selectedPath, "glounza.app.asar");    

    rl.question(`Are you sure you want to install it to "${selectedPath}"? (yes/no): `, async (confirmation) => {
        if (confirmation.toLowerCase() === 'yes' || confirmation.toLowerCase() === 'y') {
            await killDiscord();

            if (fs.existsSync(asarPathOriginal)) {
                fs.rmSync(asarPath);
                fs.copyFileSync(asarPathOriginal, asarPath);
            }

            await makeGlounzaAsar();

            fs.copyFileSync(asarPath, asarPathOriginal);
            fs.copyFileSync(join(dirname, "..", "app.asar"), asarPath);

            rl.close();
        } else {
            Logger.green('Installation cancelled.');
            rl.close();
        }
    });
};


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (allTargetPaths.length === 0) {
    if (Math.random() < 0.01) {
        Logger.rainbow(`OOPSIE WOOPSIE!! Uwu We made a fluffity fluff!! A wittle oopsie woopsie! The code monkeys at our headquarters are working VERY HARD to fix this! (or just download ${version})`);
    } else {
        Logger.red(`Double check if ${version} is installed.`);
    }
    process.exit(1);
}

if (allTargetPaths.length > 1) {
    Logger.yellow('We found more than one Discord on your machine. Where would you like to install it?');
    allTargetPaths.forEach((target, index) => {
        Logger.green(`${index + 1}: ${target.path} (User Profile: ${target.userProfile})`);
    });

    rl.question('Please enter the number of the path you want to select: ', (answer) => {
        const selectedIndex = parseInt(answer) - 1;
        if (selectedIndex >= 0 && selectedIndex < allTargetPaths.length) {
            const selectedPath = allTargetPaths[selectedIndex].path;
            Logger.green(`Selected target path: ${selectedPath}`);
            selectTargetPath(selectedPath);
        } else {
            Logger.red('Invalid selection. Exiting.');
            process.exit(1);
        }
    });
} else if (allTargetPaths.length === 1) {
    const selectedPath = allTargetPaths[0].path;
    Logger.green(`Automatically selected target path: ${selectedPath}`);
    selectTargetPath(selectedPath);
}
