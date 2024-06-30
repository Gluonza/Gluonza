import { injectCSS, uninjectCSS } from "common/dom.js";
import {Injector, Patcher} from "../../patcher/index.js";
import { gluonza } from "../../../window.js";
import * as menu from "../../../api/context-menu";
import * as util from "../../../util";
import {BDgetModule, getByStrings} from "../../webpack/index.js";
import {api} from "../../webpack/api.js";

const Data = {
    delete(plugin: any, key: string | number) {
        const storage = window.gluonzaNative.storage.read(`BdApi-${plugin}`);
        if (!storage || !storage.data) return;
        delete storage.data[key];
        window.gluonzaNative.storage.write(`BdApi-${plugin}`, storage);
    },
    load(plugin: any, key: string | number) {
        const storage = window.gluonzaNative.storage.read(`BdApi-${plugin}`);
        if (!storage || !storage.data) return;
        return storage.data[key];
    },
    save(plugin: any, key: string | number, data: any) {
        const storage = window.gluonzaNative.storage.read(`BdApi-${plugin}`) ?? {};
        storage.data ??= {};
        storage.data[key] = data;
        window.gluonzaNative.storage.write(`BdApi-${plugin}`, storage);
    }
}

export function startBD() {
    /*window.require = function v(moduleName: string) {
        return require(moduleName);
    }*/
    
    function BDgetByStrings(...strings) {
        let options = strings.at(-1);
        if (options instanceof Object) strings.pop();
        else options = {};
        return getByStrings(strings, options);
    }


    return class BdApi {
        private readonly id: any;

        static Webpack = {...api, getModule: BDgetModule, getByStrings: BDgetByStrings};
        static React = gluonza.React;

        static DOM = {
            addStyle: (id: string, style: string | null) => {
                injectCSS(id, style);
            },
            removeStyle: (id: string) => {
                uninjectCSS(id);
            }
        };

        static Patcher = Patcher
        static ContextMenu = { buildMenu: menu.patch };

        static addStyle(id: string, style: string) {
            BdApi.DOM.addStyle(id, style);
        }

        static removeStyle(id: string) {
            BdApi.DOM.removeStyle(id);
        }
        
        static Utils = util;
        
        static Data = Data;
    };
}
