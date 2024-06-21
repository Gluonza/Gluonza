// TODO: Maybe not just copy paste this?

const MOD_NAME = "gluonza.js"
const BUILD_PATH = "build"

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const distrustPath = path.resolve(BUILD_PATH, MOD_NAME).replaceAll('\\', '\\\\'); // tickets please :>
const args = process.argv.slice(2);
const version = args[1];

const Logger = {
    green: (message) => {
        console.log('\x1b[34m[Distrust] \x1b[0m\x1b[32m%s\x1b[0m', message);
    },
    red: (message) => {
        console.log('\x1b[34m[Distrust] \x1b[0m\x1b[31m%s\x1b[0m', message);
    },
    blue: (message) => {
        console.log('\x1b[34m[Distrust] \x1b[0m\x1b[34m%s\x1b[0m', message);
    },
    yellow: (message) => {
        console.log('\x1b[34m[Distrust] \x1b[0m\x1b[33m%s\x1b[0m', message);
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

function moveBuildFiles(selectedPath) {
    const buildPath = path.join(__dirname, '..', 'build');
    const preloadSrcPath = path.join(buildPath, 'index.js');
    const rendererSrcPath = path.join(buildPath, 'preload.js');
    const preloadDestPath = path.join(selectedPath, 'index.js');
    const rendererDestPath = path.join(selectedPath, 'preload.js');

    fs.copyFile(preloadSrcPath, preloadDestPath, (oopsie) => {
        if (oopsie) {
            Logger.red('Error moving preload.min.js:', oopsie);
            return;
        }
        Logger.green('preload.min.js moved successfully.');
    });

    fs.copyFile(rendererSrcPath, rendererDestPath, (whoopsie) => {
        if (whoopsie) {
            Logger.red('Error moving renderer.min.js:', whoopsie);
            return;
        }
        Logger.green('renderer.min.js moved successfully.');
    });
}

const findHighestVersionFolder = (basePath, prefix) => {
    const folders = fs.readdirSync(basePath).filter(folder => {
        return folder.startsWith(prefix) && fs.lstatSync(path.join(basePath, folder)).isDirectory();
    });

    if (folders.length === 0) {
        return null;
    }

    folders.sort((a, b) => {
        const versionA = parseInt(a.replace(prefix, ''));
        const versionB = parseInt(b.replace(prefix, ''));
        return versionB - versionA;
    });

    return folders[0];
};

const findDiscordPaths = (profilePath) => {
    const targetPaths = [];
    const basePath = path.join(profilePath, 'AppData', 'Local', baseFolderName);
    if (fs.existsSync(basePath)) {
        const appFolders = fs.readdirSync(basePath).filter(folder => {
            const fullPath = path.join(basePath, folder);
            return folder.startsWith('app') && fs.lstatSync(fullPath).isDirectory();
        });

        appFolders.sort().forEach(appFolder => {
            const modulesPath = path.join(basePath, appFolder, 'modules');
            if (fs.existsSync(modulesPath)) {
                const highestVersionFolder = findHighestVersionFolder(modulesPath, 'discord_desktop_core-');
                if (highestVersionFolder) {
                    const targetPath = path.join(modulesPath, highestVersionFolder, 'discord_desktop_core');
                    if (fs.existsSync(targetPath)) {
                        targetPaths.push(targetPath);
                    }
                }
            }
        });
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

const selectTargetPath = (selectedPath) => {
    const indexPath = path.join(selectedPath, 'index.js');

    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            Logger.red('Error reading index.js:', err);
            rl.close();
            return;
        }

        rl.question(`Are you sure you want to install it to "${selectedPath}"? (yes/no): `, (confirmation) => {
            if (confirmation.toLowerCase() === 'yes' || confirmation.toLowerCase() === 'y') {
                const modifiedContent = modifyIndexFile();
                fs.writeFile(indexPath, modifiedContent, (err) => {
                    if (err) {
                        Logger.red('Error writing to index.js:', err);
                        rl.close();
                        return;
                    }
                    Logger.green('index.js modified successfully.');
                    moveBuildFiles(selectedPath);
                    rl.close();
                });
            } else {
                Logger.green('Installation cancelled.');
                rl.close();
            }
        });
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

function modifyIndexFile() {
    return `require(\`${distrustPath}\`);\nmodule.exports = require('./core.asar');`;
}
