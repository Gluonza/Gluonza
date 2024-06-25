import {proxyCache} from "../../../../util.js";
import {getModule, getProxy, getProxyByKeys, getProxyByStrings, getStore} from "../../../webpack/index.js";
import {gluonza} from "../../../../window.js";
import {getPlugins} from "../../../systems/plugins.js";
import {openWindow} from "../../../window/index.js";
import {FloatingWindow} from "../../custom-css/editor.js";
import {getThemes} from "../../../systems/themes.js";

const React = proxyCache(() => {
    return window.gluonza.React
})

export function openFloatingEditor() {
    openWindow({
        id: "custom-css",
        render: FloatingWindow,
        title: "Custom CSS"
    })
}

export const DashboardStyle = `
:root {
    --primary-color: #6873c8;
    --light-bg: #ffffff;
    --dark-bg: #1e1e1e;
    --light-text: #000000;
    --dark-text: #ffffff;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

.app {
    z-index: 3001;
    animation: fadeIn 0.3s ease-out forwards;
}
[class*="layers"] {display: flex; flex-direction: row;}
.app.closing {
    animation: fadeOut 0.3s ease-out forwards;
}

.backdrop {
    width: 300%;
    position: absolute;
    display: inline-block;
    padding: 20px 15px 0;
    vertical-align: top;
    background: rgba(0, 0, 0, 0.7); 
    backdrop-filter: blur(0px);
    height: 100%;
}

.sidebar {
    width: 300px; /* idk what width you set it to */
    z-index: 3001;
    background-color: #292b2f;
    padding: 20px 15px 0;
    display: inline-block;
    height: 100%;
}

.sidebar .logo {
    background: url('https://cdn.discordapp.com/attachments/1128887206476513420/1254141344964808744/Gluonza.png?ex=667869a5&is=66771825&hm=e646e5417470663f34f9c510ee2c2c0a8dff27a842cebde18901570ab5bc846e&') center/cover;
} /* Once this link runs off the ex tag. Ill replace it with a Github link. Thankies pastel love */

.sidebar .header {
    padding: 6px 0;
    margin-left: 10px;
    margin-top: 15px;
    color: rgba(255, 255, 255, .15);
    font-size: 14px;
    line-height: 16px;
    text-transform: uppercase;
    font-weight: 600;
    font-family: Whitney, sans-serif;
}

.sidebar .settings_tab {
    border-radius: 3px;
    margin-bottom: 2px; 
    padding: 6px 10px;
    color: #b9bbbe;
    cursor: pointer;
    font-size: 17px;
    line-height: 20px;
    white-space: nowrap;
    font-family: Whitney, sans-serif;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sidebar .settings_tab:hover {
    background-color: rgba(185, 185, 185, .1);
    color: #f6f6f6;
}

.sidebar .settings_tab.active {
    background: #6873c8;
    color: #fff;
    cursor: default;
}

.main {
    width: 500px;
    display: inline-block;
    padding: 20px 15px 0;
    vertical-align: top;
    background: #36393e;
    height: 100%;
}

.headertext {
    color: #6873c8;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 16px;
    flex: 1 1 auto;
    font-family: Whitney, sans-serif;
}

.main h5 {
    color: #b9bbbe;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 12px;
    font-family: Whitney, sans-serif;
    padding: 10px 0;
}

.main button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    text-align: center;
    user-select: none;
    font-weight: 500;
    background: #6873c8;
    border: 0;
    outline: none !important;
    border-radius: 3px;
    padding: 5px 10px;
}

.main button:hover {
    background: #5d69c4;
}

.main .hint {
    color: #72767d;
    font-size: 14px;
    font-weight: 500;
    margin: 10px 0;
    font-family: Whitney, sans-serif;
}

.form_divider {
    height: 1px;
    margin: 15px 0;
    background: hsla(218, 5%, 47%, .3);
}

@media (prefers-color-scheme: dark) {
    body {
        background-color: var(--dark-bg);
        color: var(--dark-text);
    }
}

@media (prefers-color-scheme: light) {
    body {
        background-color: var(--light-bg);
        color: var(--light-text);
    }
}

.credit-screen {
    display: flex;
    height: 100vh;
    padding: 20px;
}

.container {
    text-align: center;
    border: 2px solid var(--primary-color);
    border-radius: 10px;
    padding: 20px;
    max-width: 600px;
    height: fit-content;
    width: 100%;
}

.credit-screen h1 {
    color: var(--primary-color);
    margin-bottom: 20px;
}

.credit-screen ul {
    list-style: none;
    padding: 0;
}

.credit-screen li {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

.credit-screen img {
    border-radius: 50%;
    margin-right: 10px;
}

.info {
    text-align: left;
}

.info strong {
    display: block;
    font-size: 1.1em;
}

.info span {
    font-size: 0.9em;
    color: var(--primary-color);
}

.tabs {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    font-family: Whitney,  sans-serif;
}
.tabs .local, .tabs .online {
    color: #b9bbbe;
    border-bottom: 2px solid hsla(218, 5%, 47%, .3);
    width: 100%;
    text-align: center;
    &:hover:not(.selected) {border-color: #6873c890;}
    &.selected {border-color: #6873c8;}
}

.gluonza_card {
    padding: 16px;
    font-family: Whitney,  sans-serif;
}
.gluonza_addon_header {
    display: flex; 
    align-items: center;
    justify-content: start;
}
.gluonza_addon_title {
    color: #b9bbbe;
    margin-left: 8px;
    font-weight: bold;
    font-size: 18px;
}
.gluonza_addon_switch, .gluonza_addon_controls {margin-left: auto;}
.gluonza_addon_footer {
    display: flex;
    align-items: end;
    justify-content: start;
}
.gluonza_addon_description {color: #8a8c90; font-weight: bold; font-size: 14px;}
.gluonza_addon_footer span {color: #6873c8; font-size: 12px;}
.gluonza_addon_controls {
    display: flex;
}
.gluonza_addon_button {
    background: #6873c8;
    color: white;
    padding: 3px;
    &:hover {background-color: #5d69c4;}
    &.trash {
        background-color: #f23f42;
        &:hover {background-color: #f13134;}
    }
}
.gluonza_addon_button:first-of-type {
    border-radius: 3px 0 0 3px;
}
.gluonza_addon_button:last-of-type {
    border-radius: 0 3px 3px 0;
}
.gluonza_addon_divider {
    height: 1px;
    background: hsla(218, 5%, 47%, .3);
}
`;

interface SettingsTabProps {
    name: string;
    active: boolean;
    onClick: () => void;
}

const CloseButton: JSX.Element = proxyCache( () => {
    return getModule(x=>x.Z && x.default.Variants)
})

const Components = getProxyByKeys([ "Anchor" ]);

const Tab = ({ labels, selectedTab, onSelectTab }) => {
    return (
        <div className="tabs">
            {labels.map((label, index) => (
                <div
                    key={index}
                    className={`tab ${selectedTab === label ? 'selected' : ''}`}
                    onClick={() => onSelectTab(label)}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};

const Switch = getProxy(() => {
    return getProxyByStrings([ "xMinYMid meet" ]);
})

const Card = ({ icon, name, description, version, authors, onEdit, onSettings, onRefresh, onDelete }) => {
    const buttons = [
        { label: "✏️", onClick: onEdit },
        { label: "⚙️", onClick: onSettings },
        { label: "↻", onClick: onRefresh },
        { label: "🗑️", onClick: onDelete }
    ];

    const titleStyle = icon == undefined ? { marginLeft: '0px !important' } : {};

    return (
        <div className="gluonza_card">
            <div className="gluonza_addon_header">
                {icon !== undefined && <img src={icon} width="32" alt="Icon"/>}
                <div className="gluonza_addon_title" style={titleStyle}>{name}</div>
                <Switch className="gluonza_addon_switch">switch</Switch>
            </div>
            <div className="gluonza_addon_description">{description}</div>
            <div className="gluonza_addon_footer">
                <span>{version}</span>
                <span>&nbspby&nbsp</span>
                <span>{authors?.join?.(', ')}</span>
                <div className="gluonza_addon_controls">
                    {buttons.map((button, index) => (
                        <div key={index} className="gluonza_addon_button" onClick={button.onClick}>{button.label}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const SettingsTab: ({name, active, onClick}: { name: any; active: any; onClick: any }) => JSX.Element = ({
     name,
     active,
     onClick
 }) => {
    return (
        <div className={`settings_tab ${active ? 'active' : ''}`} onClick={onClick}>{name}</div>
    );
};

const ConnectivityMenu: () => JSX.Element = () => (
    <div>
        <h5 className="header accent">Connectivity Settings</h5>
        <button>Save Changes</button>
        <p className="hint">Adjust your connectivity settings here.</p>
    </div>
);

const CoreMenu: () => JSX.Element = () => (
    <div>
        <h5 className="header accent">Core Settings</h5>
        <button>Save Changes</button>
        <p className="hint">Manage core settings here.</p>
    </div>
);

const CreditItem = ({ imgSrc, altText, name, position }) => {
    return (
        <li>
            <img src={imgSrc} alt={altText} />
            <div className="info">
                <strong>{name}</strong>
                <span>{position}</span>
            </div>
        </li>
    );
};

const CreditsScreen = () => {
    const credits = [
        { imgSrc: "https://cdn.discordapp.com/avatars/515780151791976453/51e45b02bb0acf0449a87f3f1e079fc8.webp?size=56", altText: "doggybootsy", name: "doggybootsy", position: "Developer" },
        { imgSrc: "https://cdn.discordapp.com/avatars/412388816863887362/b059978b8c4cdb99ea3286889b940a26.webp?size=56", altText: "pastellove", name: "Pastel Love", position: "CSS Designer" },
        { imgSrc: "https://cdn.discordapp.com/avatars/801089753038061669/a_5ac8bad37d4cec451bb9003e89c9c51a.webp?size=56", altText: "Riddim", name: "Riddim Glitch", position: "Logo Assistance" },
    ];

    return (
        <div className="credit-screen">
            <div className="container">
                <ul>
                    {credits.map((credit, index) => (
                        <CreditItem
                            imgSrc={credit.imgSrc}
                            altText={credit.altText}
                            name={credit.name}
                            position={credit.position}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

const UIMenu: () => JSX.Element = () => (
    <div>
        <h5 className="header accent">UI Settings</h5>
        <button>Save Changes</button>
        <p className="hint">Customize your UI here.</p>
    </div>
);

const SecurityPrivacyMenu: () => JSX.Element = () => (
    <div>
        <h5 className="header accent">Security and Privacy Settings</h5>
        <button>Save Changes</button>
        <p className="hint">Adjust your security and privacy settings here.</p>
    </div>
);

const CSSEditorMenu: () => JSX.Element = () => (
    <div>
        <h5 className="header accent">CSS Editor</h5>
        <button onClick={() => openFloatingEditor()}>Open External IDE</button>
    </div>
);

const PluginsMenu = () => {
    const plugins = getPlugins();

    const handleEdit = (plugin: any) => {
        console.log("Edit", plugin);
    };

    const handleSettings = (plugin) => {
        console.log("Settings", plugin);
    };

    const handleRefresh = (plugin) => {
        console.log("Refresh", plugin);
    };

    const handleDelete = (plugin) => {
        console.log("Delete", plugin);
    };

    return (
        <div>
            <h5 className="header accent">Plugin Settings</h5>
            <Components.Clickable onClick={() => {
                window.gluonzaNative.app.openPath('plugins')
            }} style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                <FolderSVG/>
            </Components.Clickable>
            <div className="cards-container">
                {plugins.map((plugin, index) => (
                    <React.Fragment key={index}>
                        <Card
                            {...plugin.manifest}
                            onEdit={() => handleEdit(plugin)}
                            onSettings={() => handleSettings(plugin)}
                            onRefresh={() => handleRefresh(plugin)}
                            onDelete={() => handleDelete(plugin)}
                        />
                        <div className="gluonza_addon_divider"></div>
                    </React.Fragment>
                ))}
            </div>
            <p className="hint">Manage your plugins here.</p>
        </div>
    )
}


const FolderSVG: () => JSX.Element = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <rect x="3" y="8" width="14" height="4" rx="2" ry="1" fill="#ebc262"/>
        <rect x="3" y="10" width="18" height="11" rx="2" ry="2" fill="#F1D592"/>
    </svg>
)

const ThemesMenu: () => JSX.Element = () => {

    const themes = getThemes();

    const handleEdit = (plugin: any) => {
        console.log("Edit", plugin);
    };

    const handleSettings = (plugin) => {
        console.log("Settings", plugin);
    };

    const handleRefresh = (plugin) => {
        console.log("Refresh", plugin);
    };

    const handleDelete = (plugin) => {
        console.log("Delete", plugin);
    };

    return (
        <div>
            <h5 className="header accent">Plugin Settings</h5>
            <Components.Clickable onClick={() => {
                window.gluonzaNative.app.openPath('plugins')
            }} style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                <FolderSVG/>
            </Components.Clickable>
            <div className="cards-container">
                {themes.map((plugin, index) => (
                    <React.Fragment key={index}>
                        <Card
                            {...plugin.manifest}
                            onEdit={() => handleEdit(plugin)}
                            onSettings={() => handleSettings(plugin)}
                            onRefresh={() => handleRefresh(plugin)}
                            onDelete={() => handleDelete(plugin)}
                        />
                        <div className="gluonza_addon_divider"></div>
                    </React.Fragment>
                ))}
            </div>
            <p className="hint">Manage your plugins here.</p>
        </div>
    )
};

interface SidebarProps {
    onClose: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: ({onClose, activeTab, setActiveTab}: {
    onClose: any;
    activeTab: any;
    setActiveTab: any
}) => JSX.Element = ({ onClose, activeTab, setActiveTab }) => {
    const internalTabs: string[] = ["Connectivity", "Core", "UI", "Security and Privacy", "CSS Editor","Credits"];
    const externalTabs: string[] = ["Plugins", "Themes"];

    return (
        <div className="sidebar">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div className="logo" style={{height: '50px', width: '230px'}}></div>
                <CloseButton.Z className="placeholder" keybind={"ESC"} closeAction={() => { onClose() }} style={{ background: 'red', position: 'absolute', top: '0px', right: '0', padding: '0px', margin: '20px' }}></CloseButton.Z>
            </div>
            <div className="header">Internal</div>
            {internalTabs.map(tab => (
                <SettingsTab
                    key={tab}
                    name={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                />
            ))}
            <div className="header">External</div>
            {externalTabs.map(tab => (
                <SettingsTab
                    key={tab}
                    name={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                />
            ))}
        </div>
    );
};

interface MainProps {
    activeTab: string;
}

const Main: ({activeTab}: { activeTab: any }) => JSX.Element = ({ activeTab }) => {
    const renderMenu = () => {
        switch(activeTab) { // I love switches. faster than if statements
            case "Connectivity":
                return <ConnectivityMenu />;
            case "Core":
                return <CoreMenu />;
            case "UI":
                return <UIMenu />;
            case "Security and Privacy":
                return <SecurityPrivacyMenu />;
            case "CSS Editor":
                return <CSSEditorMenu />;
            case "Plugins":
                return <PluginsMenu />;
            case "Themes":
                return <ThemesMenu />;
            case "Credits":
                return <CreditsScreen />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="main">
            <div className="headertext">{activeTab}</div>
            {renderMenu()}
        </div>
    );
};

interface MainDashboardProps {
    onClose: () => void;
}


async function sleep(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function useForceUpdate() {
    const [, setState] = React.useState(0);
    return () => setState((s) => s + 1);
}

export const MainDashboard: ({onClose}: { onClose: any }) => JSX.Element = ({ onClose }) => {
    const [activeTab, setActiveTab] = React.useState("Connectivity");
    const [closing, setClosing] = React.useState(false);
    const forceUpdate = useForceUpdate();
    
    React.useEffect(() => {
        function listener() {
            console.log('Updated')
            forceUpdate();
        }

        window.gluonzaNative.listeners.addListener("pluginAfterChange", listener);

        return () => {
            window.gluonzaNative.listeners.removeListener("pluginAfterChange", listener);
        };
    }, []);
    
    const handleClose = async () =>
    {
        setClosing(true)
        await sleep(300).then(() => // I don't think this is needed but sure
        {
            onClose();
        })
    }
    
    return (
        // Closing the window onClose/backdrop click.
        <div className={`app ${closing ? 'closing' : ''}`}>
            <Sidebar onClose={handleClose} activeTab={activeTab} setActiveTab={setActiveTab}/>
            <Main activeTab={activeTab}/>
            <div className="backdrop" onClick={handleClose}/>
        </div>
    );
};
