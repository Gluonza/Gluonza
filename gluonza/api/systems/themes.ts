import {coreLogger} from "common/consts.js";
import {injectCSS, uninjectCSS} from "common/dom.js";

let themesList: any[] = [];

export function getThemes()
{
    return themesList;
}

export function loadThemes(themes: [])
{
    themes.forEach((theme: { source: string; manifest: {name: string} }) =>
    {
        themesList.push({manifest: theme.manifest, source: theme.source});
    })
    return themesList
}

export async function startThemes(): Promise<void> {
    const { disabled } = await window.gluonzaNative.storage.read('dev.glounza');
    const disabledArray = Array.isArray(disabled) ? disabled : [];

    themesList.forEach((theme) => {
        if (disabledArray.includes(theme.manifest.id)) return

        injectCSS(theme.manifest.id, theme.source);
        coreLogger.info(`Started theme: ${theme.manifest.id}`);
    });
}

export async function disableTheme(themeId: string): Promise<void> {
    const { disabled } = await window.gluonzaNative.storage.read('dev.glounza');
    const disabledArray = Array.isArray(disabled) ? disabled : [];

    if (!disabledArray.includes(themeId)) {
        const theme = themesList.find(p => p.manifest.id === themeId);

        if (theme) {
            uninjectCSS(theme.manifest.id);
            coreLogger.info(`Stopped theme: ${theme.manifest.id}`);

            const updatedDisabled = [...disabledArray, themeId];
            await window.gluonzaNative.storage.write('dev.glounza', { disabled: updatedDisabled });
            coreLogger.info(`Disabled theme: ${theme.manifest.id}`);
        } else {
            coreLogger.error(`theme with ID ${themeId} not found`);
        }
    } else {
        coreLogger.info(`theme with ID ${themeId} is already disabled`);
    }
}