import {byStrings, getModule} from "../../webpack/index.js";
import {proxyCache} from "../../../util.js";
import {injectCSS} from "common/dom.js";
import {dashboardStyles, Sidebar} from "./Dashboard.js";

export function start() {
}

export function stop() {
}

// @ts-ignore
const ListItem = proxyCache(() => {
    const filter = byStrings(".__invalid_circleButtonMask");
    return getModule(m => filter(m.render))
}, true);

export const [getState, setState, useState] = (function () {
    const listeners = new Set<() => void>();

    let state = false;

    function getState() {
        return state;
    }

    function useState() {
        return window.gluonza.React.useSyncExternalStore((listener) => {
            listeners.add(listener);
            return () => void listeners.delete(listener);
        }, () => state);
    }

    function setState($state: boolean) {
        state = $state;
        for (const iterator of listeners) {
            iterator();
        }
    }

    return [getState, setState, useState] as const;
})();

export function Dashboard() {
    const isOpen = useState();
    if (!isOpen) return null;

    return <Sidebar/>
}

injectCSS('settings', dashboardStyles)

export function OpenSettingsButton() {
    return <ListItem tooltip={'Glounza Menu'} onClick={() => {
        setState(!getState())
    }}/>
}

export const patches = [
    {
        identifier: "gluonza(dashboard)",
        find: "this.renderLayers()",
        replace: "[this.renderLayers(),$jsx($gluonza._self.Dashboard)]"
    },
    {
        identifier: "gluonza(home-button)",
        match: ".Messages.GUILDS_BAR_A11Y_LABEL",
        find: /\.tree,children:\[/,
        replace: `.tree,children:[$jsx($gluonza._self.OpenSettingsButton),`
    }];
