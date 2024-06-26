import { React } from "../../webpack/common";
import { loadAce } from "./ace";
import { className, createAbort } from "../../../util";
import { Snippet, SnippetType, createNewSnippet, deleteSnippet, updateSnippets, useSnippets } from "./store";
import { MenuComponents, MenuRenderProps, closeMenu, openMenu } from "../../context-menu";
import { openConfirmModal } from "../../modals";
import { compile, initSnippet } from "./dom";
import { Markdown } from "../../../markdown";
import { getProxyByKeys } from "../../webpack";

function CSSLogo({className}: { className?: string }) {
  const props = className ? {className} : {className: "tabbar-icon", width: 30, height: 30};

  return (
      <svg {...props} viewBox="0 0 387 387" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_2_14" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="71" y="55" width="244" height="276">
          <path d="M71.9989 55.7307H314.628L305.884 153.77L304.702 166.777L292.591 302.482L193.458 329.956V329.964L193.235 330.026L94.0139 302.482L87.2277 226.427H135.852L139.3 265.059L193.246 279.625L193.291 279.613V279.609L247.314 265.028L252.937 202.207L85.0635 202.207L80.7221 153.77L257.137 153.77L261.545 104.169H76.4021L71.9989 55.7307Z" fill="white" />
        </mask>
        <g mask="url(#mask0_2_14)">
          <path d="M386.916 -25L351.667 369.879L193.221 413.805L35.2117 369.941L0 -25H386.916Z" fill="#264DE4"/>
          <path d="M321.49 344.734L351.613 7.29227H193.458V380.23L321.49 344.734Z" fill="#2965F1"/>
        </g>
      </svg>
  )
}

function SassLogo({className}: { className?: string }) {
  const props = className ? {className} : {className: "tabbar-icon", width: 30, height: 30};

  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#f06292" d="M36.561,12.574c-0.904-3.545-6.781-4.71-12.343-2.734c-3.31,1.176-6.894,3.022-9.471,5.432 c-3.064,2.866-3.552,5.36-3.351,6.402c0.71,3.677,5.749,6.081,7.82,7.865v0.011c-0.611,0.301-5.081,2.563-6.127,4.876 c-1.104,2.44,0.176,4.191,1.023,4.427c2.625,0.73,5.318-0.583,6.766-2.742c1.397-2.084,1.281-4.774,0.674-6.113 c0.837-0.221,1.814-0.32,3.054-0.175c3.501,0.409,4.188,2.595,4.056,3.51c-0.131,0.915-0.866,1.418-1.111,1.57 c-0.246,0.152-0.32,0.205-0.3,0.317c0.03,0.164,0.143,0.158,0.353,0.123c0.288-0.049,1.838-0.744,1.905-2.433 c0.084-2.144-1.97-4.542-5.608-4.48c-1.498,0.026-2.44,0.168-3.121,0.422c-0.05-0.057-0.102-0.114-0.154-0.171 c-2.249-2.4-6.407-4.097-6.231-7.323c0.064-1.173,0.472-4.261,7.989-8.007c6.158-3.069,11.088-2.224,11.94-0.353 c1.217,2.674-2.635,7.643-9.03,8.36c-2.437,0.273-3.72-0.671-4.039-1.023c-0.336-0.37-0.386-0.387-0.511-0.317 c-0.204,0.113-0.075,0.44,0,0.635c0.191,0.497,0.975,1.378,2.31,1.817c1.175,0.386,4.036,0.597,7.496-0.741 C34.424,20.229,37.45,16.059,36.561,12.574z M20.076,30.638c0.29,1.074,0.258,2.076-0.041,2.983c-0.033,0.101-0.07,0.2-0.11,0.299 c-0.04,0.098-0.083,0.196-0.129,0.292c-0.231,0.48-0.542,0.929-0.922,1.344c-1.16,1.265-2.78,1.743-3.474,1.34 c-0.75-0.435-0.374-2.218,0.97-3.64c1.446-1.529,3.527-2.512,3.527-2.512l-0.003-0.006C19.954,30.705,20.015,30.672,20.076,30.638z"/>
    </svg>
  )
}

function LessLogo({className}: { className?: string }) {
    const props = className ? {className} : {className: "tabbar-icon", width: 30, height: 30};

    return (
        <svg {...props} viewBox="0 0 961.0625 429" id="svg3059">
            <defs id="defs3061">
                <linearGradient x1="464.315" y1="532.26703" x2="464.315" y2="108.459" id="SVGID_1_"
                                gradientUnits="userSpaceOnUse" gradientTransform="matrix(1,0,0,-1,0.14,777.638)">
                    <stop style={{stopColor: "#2a4f84", stopOpacity: 1}} offset="0.1497"/>
                    <stop style={{stopColor: "#294e82", stopOpacity: 1}} offset="0.38839999"/>
                    <stop style={{stopColor: "#172e4e", stopOpacity: 1}} offset="1"/>
                </linearGradient>
                <linearGradient x1="464.315" y1="532.26703" x2="464.315" y2="108.459" id="linearGradient3057"
                                xlinkHref="#SVGID_1_" gradientUnits="userSpaceOnUse"
                                gradientTransform="matrix(1,0,0,-1,-110.8195,852.7348)"/>
            </defs>
            <g transform="translate(130.53125,-317.84375)" id="layer1">
                <path
                    d="m 778.7625,662.5338 c 0,44.958 -36.784,81.742 -81.742,81.742 H 9.9705001 C -34.9875,744.2758 -71.7715,707.4918 -71.7715,662.5338 V 402.20979 c 0,-44.958 36.784,-81.742 81.7420001,-81.742 H 697.0205 c 44.958,0 81.742,36.784 81.742,81.742 V 662.5338 z"
                    style={{fill: "url(#linearGradient3057)"}}
                />
                <path
                    d="m 635.0385,526.8108 c 35.909,12.563 53.856,34.088 53.856,64.543 0,20.046 -7.443,35.957 -22.296,47.725 -14.838,11.776 -36.005,19.084 -63.557,19.084 -27.552,0 -53.037,-7.983 -76.51,-21.088 0.254,-6.95 2.091,-14.575 5.463,-22.852 3.372,-8.277 7.363,-14.853 11.936,-19.656 21.573,11.211 40.346,16.826 56.281,16.826 7.531,0 13.358,-1.264 17.414,-3.809 4.063,-2.536 6.083,-5.94 6.083,-10.217 0,-8.039 -6.226,-14.051 -18.638,-18.058 l -22.296,-8.421 c -33.73,-12.293 -50.596,-32.323 -50.596,-60.146 0,-20.316 7.085,-36.418 21.255,-48.33 14.17,-11.895 33.269,-22.137 57.283,-22.137 11.88,0 24.96,1.67 39.272,5.01 14.297,3.348 26.042,11.594 35.218,16.125 0.541,7.49 -0.962,15.712 -4.452,24.665 -3.515,8.961 -7.824,15.306 -12.969,19.052 -22.685,-10.162 -41.562,-15.243 -56.686,-15.243 -5.415,0 -9.494,1.201 -12.357,3.618 -2.831,2.41 -4.223,5.478 -4.223,9.224 0,6.417 5.121,11.49 15.386,15.235 l 25.133,8.85 z"
                    fill="#f6f6f6"
                />
                <path
                    d="m 455.6835,526.8108 c 35.909,12.563 53.848,34.088 53.848,64.543 0,20.046 -7.443,35.957 -22.272,47.725 -14.853,11.776 -36.028,19.084 -63.572,19.084 -27.528,0 -53.045,-7.983 -76.51,-21.088 0.254,-6.95 2.091,-14.575 5.47,-22.852 3.372,-8.277 7.347,-14.853 11.936,-19.656 21.597,11.211 40.362,16.826 56.289,16.826 7.538,0 13.366,-1.264 17.406,-3.809 4.048,-2.536 6.083,-5.94 6.083,-10.217 0,-8.039 -6.226,-14.051 -18.638,-18.058 l -22.281,-8.421 c -33.738,-12.293 -50.611,-32.323 -50.611,-60.146 0,-20.316 7.085,-36.418 21.27,-48.33 14.162,-11.895 33.253,-22.137 57.267,-22.137 11.872,0 24.984,1.67 39.265,5.01 14.313,3.348 26.042,11.594 35.225,16.125 0.541,7.49 -0.962,15.712 -4.452,24.665 -3.507,8.961 -7.824,15.306 -12.961,19.052 -22.694,-10.162 -41.571,-15.243 -56.702,-15.243 -5.407,0 -9.502,1.201 -12.349,3.618 -2.823,2.41 -4.23,5.478 -4.23,9.224 0,6.417 5.128,11.49 15.394,15.235 l 25.125,8.85 z"
                    fill="#f6f6f6"
                />
                <path
                    d="m 324.8885,529.6408 c 0,-12.293 -1.956,-23.656 -5.868,-34.089 -3.904,-10.432 -9.51,-19.378 -16.794,-26.868 -7.292,-7.49 -16.126,-13.367 -26.511,-17.645 -10.401,-4.27 -22.074,-10.711 -35.027,-10.711 -15.387,0 -28.816,6.966 -40.282,12.317 -11.466,5.344 -20.913,12.691 -28.332,22.05 -7.435,9.366 -12.969,20.388 -16.611,33.086 -3.642,12.699 -5.463,26.534 -5.463,41.499 0,15.49 1.479,29.818 4.453,42.914 2.966,13.08 8.03,24.435 15.18,34.073 7.156,9.621 16.467,17.104 27.941,22.439 11.474,5.344 25.715,9.447 42.716,9.447 31.305,0 57.752,-9.065 79.348,-24.292 -2.139,-15.49 -7.657,-27.807 -16.523,-36.896 -11.029,4.142 -20.786,7.108 -29.246,8.93 -8.468,1.798 -15.935,2.704 -22.383,2.704 -12.906,0 -22.193,-3.284 -27.83,-9.915 -5.631,-6.608 -8.72,-14.424 -9.267,-26.296 h 105.265 c 3.477,-11.243 5.234,-26.438 5.234,-42.747 z m -110.9,2.776 c 0.802,-13.645 3.292,-28.244 7.435,-34.255 4.151,-6.019 10.504,-9.025 19.083,-9.025 8.835,0 15.466,3.197 19.879,9.614 4.422,6.417 6.631,19.346 6.631,29.237 l 0.008,4.429 h -53.036 l 0,0 z"
                    fill="#f6f6f6"
                />
                <path
                    d="m 799.9545,559.0938 c -11.442,9.995 -18.082,24.379 -18.082,43.185 v 70.037 c 0,23.282 -7.157,40.99 -23.322,53.164 -16.15,12.158 -34.979,18.177 -56.472,18.757 l -12.738,-0.096 v -34.899 c 11.228,-3.276 15.839,-7.084 20.308,-11.41 8.095,-7.315 14.297,-19.219 14.297,-35.75 v -56.543 c 0.302,-19.219 1.781,-34.279 8.778,-45.157 7.022,-10.878 20.69,-20.388 41.006,-28.602 -22.439,-10.273 -37.508,-23.688 -45.189,-40.235 -4.516,-9.828 -4.604,-23.091 -4.604,-39.774 v -51.85201 c 0,-17.128 -5.606,-29.126 -12.5,-35.973 -4.484,-4.469 -9.701,-8.039 -22.113,-10.734 v -32.761 c 15.18,0.159 22.845,-0.015 31.687,0 13.613,-0.111 25.016,7.332 34.939,15.084 10.807,8.5 18.487,19.991 22.988,34.454 2.56,8.357 2.926,16.341 2.926,23.942 v 59.97101 c 0,21.182 6.258,36.927 16.953,47.208 6.028,5.964 14.536,11.418 29.143,16.341 v 27.091 c -12.944,3.579 -21.071,8.429 -28.005,14.552 z"
                    style={{fill: "#f6f6f6", stroke: "#404040", strokeWidth: "5.15089989", strokeMiterlimit: 10}}
                />
                <path
                    d="m -5.2445,320.46879 v 0.047 c -4.349,-0.024 -8.286,-0.04 -11.434,-0.032 -13.621,-0.119 -25.023,7.324 -34.938,15.084 -10.822,8.5 -20.085,19.593 -22.987,34.454 -1.654,8.715 -1.304,16.332 -1.304,23.942 v 59.97101 c 0,21.175 -7.88,36.911 -18.567,47.209 -6.02,5.963 -18.87,11.409 -33.485,16.331 v 27.09 c 12.953,3.571 25.422,8.405 32.339,14.544 11.45,10.003 19.703,24.396 19.703,43.2 v 70.037 c 0,23.267 5.551,40.991 21.7,53.148 16.15,12.15 34.971,18.193 56.464,18.781 l 14.384,-0.096 v -34.923 c -11.22,-3.284 -17.45299995,-7.093 -21.946,-11.403 -8.087,-7.324 -12.667,-19.219 -12.667,-35.742 v -56.551 c -0.31,-19.234 -3.411,-34.279 -10.416,-45.165 -7.005,-10.862 -20.674,-20.388 -41.014,-28.594 22.448,-10.281 37.508,-23.688 45.189,-40.227 4.525,-9.836 6.242,-23.099 6.242,-39.781 v -51.85201 c 0,-17.128 3.975,-29.126 10.862,-35.98 3.737,-3.721 10.3840001,-6.783 19.617,-9.263 l 14.599,0.102 c 0,-12.566 0,-20.432 0,-34.334 h -32.339 v 0.003 h -0.002 z"
                    style={{fill: "#f6f6f6", stroke: "#404040", strokeWidth: "5.15089989", strokeMiterlimit: 10}}
                />
                <path
                    d="m 129.3525,604.6078 h -10.933 c -11.887,0 -16.364,-6.25 -16.364,-18.805 V 355.05779 c 0,-13.875 -4.007,-23.616 -9.137,-29.229 -5.129,-5.598 -14.034,-5.542 -26.717,-5.542 h -24.69 l -2.91,-0.056 v 0.238 l -0.024,34.343 V 596.9678 c 0,19.258 4.326,33.349 12.022,42.318 7.705,8.953 20.722,13.422 39.074,13.422 12.691,0 27.131,-1.336 43.32,-4.016 0.811,-2.704 1.217,-8.492 1.217,-17.374 0,-8.906 -1.621,-17.788 -4.858,-26.71 z"
                    fill="#f6f6f6"
                />
            </g>
        </svg>
    )
}

const MegaModule = getProxyByKeys(["Anchor"]);

const types: SnippetType[] = ["css", "scss", "sass", "less"];
let handleAction: () => void;

const TurnIntoTheme: React.FC<{ snippet: Snippet }> = ({snippet}) => {
    const [themeData, setThemeData] = React.useState({
        id: '',
        name: '',
        description: '',
        authors: '',
    });

    const handleInputChange = (key: string, value: any) => {
        setThemeData({ ...themeData, [key]: value });
    };

    handleAction = async () => {
        const { id, name, description, authors } = themeData;

        if (!id || !name || !description || !authors) {
            alert('All inputs need to be filled for it to work');
            return;
        }
        else
        {
            const css = await compile(snippet.type, snippet.content) as string;
            
            window.gluonzaNative.themes.turnCompiledCssIntoFile(css, themeData)
        }
    };

    return (
        <>
            <div className={'withDivider_b3a5c'}>
                <MegaModule.Text> Theme ID * </MegaModule.Text>
                <MegaModule.TextInput
                    value={themeData.id}
                    onChange={(e: any) => handleInputChange('id', e)}
                />
            </div>
            <div className={'withDivider_b3a5c'}>
                <MegaModule.Text> Theme Name * </MegaModule.Text>
                <MegaModule.TextInput
                    value={themeData.name}
                    onChange={(e: any) => handleInputChange('name', e)}
                />
            </div>
            <div className={'withDivider_b3a5c'}>
                <MegaModule.Text> Theme Description </MegaModule.Text>
                <MegaModule.TextInput
                    value={themeData.description}
                    onChange={(e: any) => handleInputChange('description', e)}
                />
            </div>
            <div className={'withDivider_b3a5c'}>
                <MegaModule.Text> Theme Authors </MegaModule.Text>
                <MegaModule.TextInput
                    value={themeData.authors}
                    onChange={(e: any) => handleInputChange('authors', e)}
                />
            </div>
        </>
    );
};


function createSnippetSubMenu(snippet: Snippet, toggle: () => void, updateLanguage: (type: SnippetType) => void, stopViewing: () => void) {
  const [ name, setName ] = React.useState(snippet.name);
  const isDefault = snippet.id === "css" || snippet.id === "less" || snippet.id === "scss" || snippet.id === "sass";

  return (
    <MenuComponents.MenuGroup key={snippet.id}>
      {!isDefault && (
        <>
          <MenuComponents.MenuControlItem 
            id="rename"
            control={(props, ref) => (
              <MegaModule.TextInput 
                value={name}
                placeholder={snippet.id}
                onChange={setName}
                onBlur={() => {
                  if (!name) return setName(snippet.name);

                  snippet.name = name;
                  updateSnippets();
                }}
                size={MegaModule.TextInput.Sizes.MINI}
                autoFocus
              />
            )}
          />
          <MenuComponents.MenuItem id="type" label="Type">
            <MenuComponents.MenuGroup label="Snippet Type">
              {types.map((type) => (
                <MenuComponents.MenuRadioItem
                  id={type}
                  key={type}
                  label={type}
                  group="type"
                  checked={snippet.type === type}
                  action={() => {
                    snippet.type = type;
                    updateSnippets();
                    updateLanguage(type);
                    initSnippet(snippet);
                  }}
                />
              ))}
            </MenuComponents.MenuGroup>
          </MenuComponents.MenuItem>
          <MenuComponents.MenuSeparator />
        </>
      )}
      <MenuComponents.MenuCheckboxItem 
        id="enabled"
        label="Enabled"
        checked={snippet.enabled}
        action={() => {
          snippet.enabled = !snippet.enabled;
          updateSnippets();
        }}
      />
      <MenuComponents.MenuCheckboxItem 
        id="visible"
        label="Visible"
        checked={snippet.visible}
        disabled={snippet.id === "css"}
        action={() => toggle()}
      />
      <MenuComponents.MenuSeparator />
      <MenuComponents.MenuItem 
        id="view-css"
        label="View CSS"
        action={async () => {
          const css = await compile(snippet.type, snippet.content);
          
          openConfirmModal("CSS", [
            <div style={{ userSelect: "text" }}>
              <Markdown text={`${"```"}css\n${typeof css === "string" ? css : css.message}\n${"```"}`} />
            </div>
          ], {
            contextKey: "popout"
          })
        }}
      />
			<MenuComponents.MenuItem
					id="turn-css-into-theme"
					label="Turn into Theme"
					action={() => {
						openConfirmModal("Converting Stage", <TurnIntoTheme snippet={snippet}/>,{
							onConfirm() {
								handleAction();
							}
						})
					}}
			/>
			{!isDefault && (
				<>
          <MenuComponents.MenuSeparator/>
					<MenuComponents.MenuItem 
            id="delete"
            label="Delete"
            color="danger"
            action={() => {
              openConfirmModal("Delete Snippet", [ "Confirm delete snippet" ], {
                onConfirm() {
                  deleteSnippet(snippet.id);
                  stopViewing();
                },
                danger: true
              })
            }}
          />
        </>
      )}
    </MenuComponents.MenuGroup>
  )
}

function Tab({ snippet, selected, onSelect, onClose, updateLanguage }: { snippet: Snippet, selected: boolean, onSelect: () => void, onClose: () => void, updateLanguage: (type: SnippetType) => void }) {
  if (snippet.deleted || !snippet.visible) return;

  return (
    <div 
      className={className({ "tabbar-item": true, selected: selected })} 
      onClick={onSelect}
      onMouseDown={(event) => {
        if (event.button === 1) onClose();
      }}
      onContextMenu={(event) => {
        openMenu(event, (event) => {
          useSnippets();

          return (
            <MenuComponents.Menu navId="gluonza-tab-menu" onClose={closeMenu} {...event}>
              {createSnippetSubMenu(snippet, () => {
                if (snippet.visible) return onClose();
                snippet.visible = true;
                updateSnippets();
              }, updateLanguage, () => snippet.visible && onClose())}
            </MenuComponents.Menu>
          );
        })
      }}
    >
      {snippet.type === "css" ? <CSSLogo /> : snippet.type === "less" ? <LessLogo /> : <SassLogo />}
      <div className="tabbar-name">{snippet.name}</div>
      {snippet.id !== "css" && (
        <svg 
          className="tabbar-close" 
          aria-hidden="true" 
          role="img" 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          fill="none" 
          viewBox="0 0 24 24"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }}
        >
          <path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z" />
        </svg>
      )}
    </div>
  )
}

function NewMenu(props: MenuRenderProps & { toggleSnippet(index: number): void, updateLanguage: (type: SnippetType) => void }) {
  const [ query, setQuery ] = React.useState("");
  const snippets = useSnippets();

  const qsnippets = React.useMemo(() => (
    snippets.filter((snippet) => snippet.deleted ? false : snippet.name.toLowerCase().includes(query.toLowerCase()))
  ), [ query, snippets ]);

  return (
    <MenuComponents.Menu navId="gluonza-plus-menu" onClose={closeMenu} {...props}>
      <MenuComponents.MenuItem
        id="new"
        label="New Snippet"
      >
        <MenuComponents.MenuGroup label="New Snippet">
          <MenuComponents.MenuItem 
            id="css"
            label="css"
            icon={CSSLogo}
            action={() => createNewSnippet("css")}
          />
          <MenuComponents.MenuItem 
            id="scss"
            label="scss"
            icon={SassLogo}
            action={() => createNewSnippet("scss")}
          />
          <MenuComponents.MenuItem 
            id="sass"
            label="sass"
            icon={SassLogo}
            action={() => createNewSnippet("sass")}
          />
          <MenuComponents.MenuItem 
            id="less"
            label="less"
            icon={LessLogo}
            action={() => createNewSnippet("less")}
          />
        </MenuComponents.MenuGroup>
      </MenuComponents.MenuItem>
      <MenuComponents.MenuSeparator />
      <MenuComponents.MenuControlItem 
        id="search"
        control={(props, ref) => (
          <MenuComponents.MenuSearchControl 
            onChange={setQuery}
            query={query}
            {...props}
            ref={ref}
          />
        )}
      />
      {qsnippets.map((snippet, index) => (
        <MenuComponents.MenuItem 
          label={snippet.name} 
          id={snippet.id} 
          key={index}
          icon={snippet.type === "css" ? CSSLogo : snippet.type === "less" ? LessLogo : SassLogo}
        >
          {createSnippetSubMenu(snippet, () => props.toggleSnippet(index), updateSnippets, () => snippet.visible && props.toggleSnippet(index))}
        </MenuComponents.MenuItem>
      ))}
    </MenuComponents.Menu>
  )
}

export function FloatingWindow({ window }: { window: Window & typeof globalThis }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<AceAjax.Editor | null>();
  const onChangeRef = React.useRef<() => void>(() => {});
  const [ selected, setSelected ] = React.useState(0);
  const [ error, setError ] = React.useState<false | Error>(false);
  
  const snippets = useSnippets();

  React.useInsertionEffect(() => {
    const css = `
    [data-popout-root="true"] {
      background: var(--background-tertiary);
    }
    #body {
      display: flex;
      height: 100%;
      width: 100%;
      flex-direction: column;
    }
    #navbar {
      flex: 0 1 30px;
      display: flex;
      overflow: scroll hidden;
    }
    #navbar::-webkit-scrollbar {
      display: none;
    }
    #plus {
      display: flex;
      margin: 3px;
      color: var(--interactive-normal);
      cursor: pointer;
      border-radius: 3px;
      position: sticky;
      right: 3px;
    }
    #plus::before {
      content: "";
      position: absolute;
      left: -3px;
      top: -3px;
      background: var(--background-tertiary);
      right: -3px;
      bottom: -3px;
      z-index: -1;
    }
    #plus:hover {
      background: var(--background-modifier-hover);
      color: var(--interactive-hover);
    }
    .tabbar-item {
      display: flex;
      width: fit-content;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      color: var(--interactive-normal);
      flex: 0 0 auto;
    }
    .tabbar-item .tabbar-close {
      cursor: pointer;
      border-radius: 3px;
      padding: 2px;
    }

    .tabbar-item.selected {
      background: var(--background-modifier-active);
    }
    .tabbar-item.selected .tabbar-name {
      color: var(--interactive-active);
    }
    .tabbar-item.selected .tabbar-close:hover {
      color: var(--interactive-active);
      background: var(--background-modifier-hover);
    }

    .tabbar-item:not(.selected):hover {
      background: var(--background-modifier-hover);
    }
    .tabbar-item:not(.selected):hover .tabbar-name {
      color: var(--interactive-hover);
    }
    .tabbar-item:not(.selected) .tabbar-close:hover {
      color: var(--interactive-hover);
      background: var(--background-modifier-hover);
    }
    #content {
      flex: 1 1 auto;
    }
    #content:empty {
      background: var(--background-primary);
    }
    #error:not(:empty) {
      color: red;
      padding: 4px;
    }
    `;

    const style = document.createElement("style");
    style.textContent = css;

    window.document.head.append(style);
  }, [ ]);

  function onTabSelect(index: number) {
    if (!editorRef.current) return;

    onChangeRef.current = () => {};

    const snippet = snippets[index];

    editorRef.current.session.setMode(`ace/mode/${snippet.type}`);
    editorRef.current.setValue(snippet.content);

    editorRef.current.focus();

    const [ abort, getSignal ] = createAbort();

    function checkValidityOfCSS() {
      abort();
      const signal = getSignal();

      compile(snippet.type, snippet.content).then((css) => {
        if (signal.aborted) return;

        if (typeof css === "string") return setError(false);
        setError(css);
      });
    }

    onChangeRef.current = () => {
      snippet.content = editorRef.current!.getValue();
      
      checkValidityOfCSS();

      initSnippet(snippet);

      updateSnippets();
    }
  }

  React.useLayoutEffect(() => {
    (async function() {
      const ace = await loadAce(window);
      if (!ref.current) return;

      const editor = ace.edit(ref.current);
      editor.session.setUseWorker(true);

      editor.setTheme("ace/theme/monokai");

      editorRef.current = editor;

      editorRef.current!.session.on("change", (delta) => {
        onChangeRef.current();
      });

      onTabSelect(0);
    })();
  }, [ window ]);

  function selectTab(index: number) {
    if (index === selected) return;

    setSelected(index);
    onTabSelect(index);
  }

  function hideSnippet(index: number) {
    const snippet = snippets[index];

    snippet.visible = false;
    updateSnippets();

    if (index !== selected) return;

    while (index--) {
      if (!snippets[index].visible) continue;
      
      setSelected(index);
      onTabSelect(index);

      break;
    }
  }

  return (
    <div id="body">
      <div 
        id="navbar" 
        onWheel={(event) => {
          event.preventDefault(); 

          // mouses can both scroll left / right and top / down so just combine the delta ig
          const delta = event.deltaY + event.deltaX;
          event.currentTarget.scroll({ left: event.currentTarget.scrollLeft += delta, top: 0 });
        }}
      >
        {snippets.map((snippet, index) => (
          <Tab 
            snippet={snippet} 
            selected={index === selected}
            onSelect={() => selectTab(index)} 
            onClose={() => hideSnippet(index)}
            updateLanguage={(type) => editorRef.current?.session.setMode(`ace/mode/${type}`)}
            key={index} 
          />
        ))}
        <div 
          id="plus" 
          onClick={(event) => {
            openMenu(event, (props) => (
              <NewMenu 
                {...props} 
                toggleSnippet={(index: number) => {
                  if (snippets[index].visible) return hideSnippet(index);
                  snippets[index].visible = true;
                  updateSnippets();
                }}
                updateLanguage={(type) => editorRef.current?.session.setMode(`ace/mode/${type}`)} 
              />
            ))
          }}
        >
          <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z" />
          </svg>
        </div>
      </div>
      <div id="content" ref={ref} />
      <div id="error">{error && error.message}</div>
    </div>
  )
}