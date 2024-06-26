import {getComponentType, proxyCache} from "../../util";
import {byStrings, getModule, getProxyStore} from "../webpack";
import {dirtyDispatch, React} from "../webpack/common";

const PopoutWindow = proxyCache(() => {
    const filter = byStrings(".DnDProvider", ".POPOUT_WINDOW", "{guestWindow:");

    return getModule<React.FunctionComponent<PopoutWindowProps>>((m) => filter(getComponentType(m)))!;
}, true);

const PopoutWindowStore = getProxyStore("PopoutWindowStore");

interface PopoutWindowProps {
    windowKey: string,
    withTitleBar: boolean,
    title: string,
    children: React.ReactNode
}

interface OpenWindowOptions {
    id: string,
    render: React.ComponentType<{ window: Window & typeof globalThis }>,
    title: string,
    wrap?: boolean
}

export function openWindow(opts: OpenWindowOptions) {
    const {id, render: Component, title, wrap = true} = opts;

    const windowKey = `DISCORD_gluonza_${id}`;

    function Render() {
        const window = React.useMemo(() => PopoutWindowStore.getWindow(windowKey)!, []);

        if (!wrap) return <Component window={window}/>;

        return (
            <PopoutWindow
                windowKey={windowKey}
                title={title}
                withTitleBar
            >
                <Component window={window}/>
            </PopoutWindow>
        );
    };

    dirtyDispatch({
        type: "POPOUT_WINDOW_OPEN",
        key: windowKey,
        render: () => <Render/>,
        features: {
            popout: true
        }
    });

    return () => closeWindow(id);
}

export function isWindowOpen(id: string) {
    return PopoutWindowStore.getWindowOpen(`DISCORD_gluonza_${id}`);
}

export function closeWindow(id: string) {
    if (!isWindowOpen(id)) return;

    try {
        PopoutWindowStore.unmountWindow(`DISCORD_gluonza_${id}`);
    } catch (error) {
    }
}