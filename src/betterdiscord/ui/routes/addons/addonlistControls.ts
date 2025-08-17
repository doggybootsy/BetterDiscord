import JsonStore from "@stores/json";
import {useInternalStore} from "@ui/hooks";
import {shallowEqual} from "fast-equals";

export interface AddonListControls {
    view: "list" | "grid";
    sort: "name" | "author" | "version" | "added" | "modified" | "isEnabled";
    ascending: boolean;
}

export interface AddonStoreControls {
    sort: "name" | "author" | "version" | "added" | "modified" | "isEnabled";
    ascending: boolean;
}

const defaultControls: AddonListControls = {
    view: "list",
    sort: "name",
    ascending: true
};

type BasePage = "theme" | "plugin";
type StorePage = `${BasePage}-store`;
type Page = BasePage | `${BasePage}-store`;

type CompleteAddonlistControls = {
    [key in Page]?: AddonListControls;
};


export function useAddonlistControls(page: Page) {
    return useInternalStore(JsonStore, () => Object.assign({}, defaultControls, ((JsonStore.get("misc", "addonlistControls") || {}) as CompleteAddonlistControls)[page]), [page], shallowEqual);
}

export function setAddonListControls<T extends keyof AddonListControls>(page: Page, type: T, value: AddonListControls[T]) {
    const addonlistControls: CompleteAddonlistControls = JsonStore.get("misc", "addonlistControls") || {};

    const controls = Object.assign({}, defaultControls, addonlistControls[page], {[type]: value});

    JsonStore.set("misc", "addonlistControls", {
        ...addonlistControls,
        [page]: controls
    });
}