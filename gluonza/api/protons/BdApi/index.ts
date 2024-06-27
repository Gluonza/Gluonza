import { injectCSS, uninjectCSS } from "common/dom.js";
import { Injector } from "../../patcher/index.js";
import * as Comps from '../../context-menu/index.js';
import { gluonza } from "../../../window.js";
import * as menu from "../../../api/context-menu";
import * as util from "../../../util";

export function start() {
    window.BdApi = class BdApi {
        private readonly id: any;

        static Webpack = gluonza.webpack;
        static React = gluonza.React;

        static DOM = {
            addStyle: (id: string, style: string | null) => {
                injectCSS(id, style);
            },
            removeStyle: (id: string) => {
                uninjectCSS(id);
            }
        };

        static Patcher = new Injector();
        static ContextMenu = { ...Comps, buildMenu: menu.patch };

        static addStyle(id: string, style: string) {
            BdApi.DOM.addStyle(id, style);
        }

        static removeStyle(id: string) {
            BdApi.DOM.removeStyle(id);
        }

        static Utils = util;
    };
}
