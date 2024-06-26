﻿﻿
import {byStrings, getModule} from "../../webpack/index.js";
import {proxyCache} from "../../../util.js";
import {injectCSS} from "common/dom.js";
import {DashboardStyle, MainDashboard} from "./comps/Dashboard.js";

export function start() {
    console.log("Starting settings.index.tsx.");
}

export function stop() {
}

const ListItem: React.FunctionComponent<any> = proxyCache(() => {
    const filter = byStrings(".__invalid_circleButtonMask");
    return getModule(m => filter(m.render))!;
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

    return <MainDashboard onClose={() => {
        setState(!getState())
    }}/>
}

injectCSS('settings', DashboardStyle)

const Icon = () => {
    return (<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="60" fontFamily="Arial, sans-serif" fontSize="60" fill="#5f6ddc" fontWeight="bold">G</text>
        <text x="40" y="80" fontFamily="Arial, sans-serif" fontSize="60" fill="#ffffff" fontWeight="bold">Z</text>
    </svg>)
}

export function OpenSettingsButton() {
    return <ListItem color={'#6873c8'} icon={Icon} tooltip={'Glounza Menu'} onClick={() => {
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