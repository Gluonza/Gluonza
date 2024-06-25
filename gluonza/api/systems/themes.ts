import { coreLogger } from "common/consts.js";
import { injectCSS, uninjectCSS } from "common/dom.js";

let themesList: any[] = [];

export function getThemes() {
    return themesList;
}

export function loadThemes(themes: []) {
    themes.forEach((theme: { source: string; manifest: { id: string, name: string } }) => {
        themesList.push({ manifest: theme.manifest, source: theme.source, started: false, type: 'theme' });
    });
    return themesList;
}

function getDisabledThemes() {
    const { disabled } = window.gluonzaNative.storage.read('dev.glounza');
    return Array.isArray(disabled) ? disabled : [];
}

function findThemeById(themeId: string) {
    return themesList.find(theme => theme.manifest.id === themeId);
}

export function startThemes() {
    const disabledArray = getDisabledThemes();

    themesList.forEach((theme) => {
        if (disabledArray.includes(theme.manifest.id)) return;

        theme.started = true;
        injectCSS(theme.manifest.id, theme.source);
        coreLogger.info(`Started theme: ${theme.manifest.id}`);
    });
}

export function startTheme(themeId: string) {
    const disabledArray = getDisabledThemes();

    if (!disabledArray.includes(themeId)) {
        const theme = findThemeById(themeId);

        if (theme) {
            theme.started = true;
            injectCSS(theme.manifest.id, theme.source);
            coreLogger.info(`Starting theme: ${theme.manifest.id}`);
        } else {
            coreLogger.error(`Theme with ID ${themeId} not found`);
        }
    } else {
        coreLogger.info(`Theme with ID ${themeId} is already disabled`);
    }
}

export function disableTheme(themeId: string) {
    const disabledArray = getDisabledThemes();

    if (!disabledArray.includes(themeId)) {
        const theme = findThemeById(themeId);

        if (theme) {
            theme.started = false;
            uninjectCSS(theme.manifest.id);
            coreLogger.info(`Stopped theme: ${theme.manifest.id}`);

            const updatedDisabled = [...disabledArray, themeId];
            window.gluonzaNative.storage.write('dev.glounza', { disabled: updatedDisabled });
            coreLogger.info(`Disabled theme: ${theme.manifest.id}`);
        } else {
            coreLogger.error(`Theme with ID ${themeId} not found`);
        }
    } else {
        coreLogger.info(`Theme with ID ${themeId} is already disabled`);
    }
}
