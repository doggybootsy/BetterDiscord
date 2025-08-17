import React, {useLayoutEffect, useMemo, useState} from "react";

import PluginManager from "@modules/pluginmanager";
import ThemeManager from "@modules/thememanager";
import Page from "../Page";
import {t} from "@common/i18n";
import {ArrowDownAZIcon, ArrowDownZAIcon, CheckIcon, EllipsisVertical, FolderIcon, LayoutGridIcon, Palette, PlugIcon, SearchIcon, StretchHorizontalIcon, XIcon} from "lucide-react";
import ContextMenuPatcher from "@api/contextmenu";
import ipc from "@modules/ipc";
import {setAddonListControls, useAddonlistControls, type AddonListControls} from "./addonlistControls";
import {useInternalStore} from "@ui/hooks";
import {shallowEqual} from "fast-equals";
import {useSearchParams} from "../hooks";
import Button from "@ui/base/button";

const ContextMenu = new ContextMenuPatcher() as InstanceType<typeof ContextMenuPatcher> & {
    Separator: any;
    CheckboxItem: any;
    RadioItem: any;
    ControlItem: any;
    Group: any;
    Item: any;
    Menu: any;
};

function AddonListMenu({manager, ...props}: {manager: typeof PluginManager | typeof ThemeManager;}) {
    const {view, sort, ascending} = useAddonlistControls(manager.prefix);

    const setControl = React.useCallback(<T extends keyof AddonListControls>(type: T, value: AddonListControls[T]) => setAddonListControls(manager.prefix, type, value), [manager]);

    const isGrid = React.useMemo(() => view === "grid", [view]);

    const toggleView = React.useCallback(() => setControl("view", isGrid ? "list" : "grid"), [setControl, isGrid]);
    const toggleAscending = React.useCallback(() => setControl("ascending", !ascending), [setControl, ascending]);

    return (
        <ContextMenu.Menu navId="betterdiscord-addon-page-menu" {...props}>
            <ContextMenu.Group label="Actions">
                <ContextMenu.Item
                    label={t("Addons.enableAll")}
                    id="enable-all"
                    icon={CheckIcon}
                    action={() => {}}
                />
                <ContextMenu.Item
                    label={t("Addons.disableAll")}
                    id="disable-all"
                    icon={XIcon}
                    action={() => {}}
                    color="danger"
                />
            </ContextMenu.Group>
            <ContextMenu.Group label="Sorting">
                <ContextMenu.Item
                    id="sort-by"
                    label={`Sort By ${t(`Addons.${sort}`)}`}
                    // icon={ArrowDownUpIcon}
                    action={toggleView}
                >
                    {([
                        {label: t("Addons.name"), value: "name"},
                        {label: t("Addons.author"), value: "author"},
                        {label: t("Addons.version"), value: "version"},
                        {label: t("Addons.added"), value: "added"},
                        {label: t("Addons.modified"), value: "modified"},
                        {label: t("Addons.isEnabled"), value: "isEnabled"}
                    ] as Array<{label: string, value: AddonListControls["sort"];}>).map(({label, value}) => (
                        <ContextMenu.CheckboxItem
                            label={label}
                            checked={sort === value}
                            action={() => setControl("sort", value)}
                            id={value}
                        />
                    ))}
                </ContextMenu.Item>
                <ContextMenu.Item
                    id="ascending"
                    label={ascending ? t("Sorting.ascending") : t("Sorting.descending")}
                    icon={ascending ? ArrowDownAZIcon : ArrowDownZAIcon}
                    action={toggleAscending}
                />
                <ContextMenu.Item
                    id="layout"
                    label={isGrid ? t("Addons.gridView") : t("Addons.listView")}
                    icon={isGrid ? LayoutGridIcon : StretchHorizontalIcon}
                    action={toggleView}
                />
            </ContextMenu.Group>
            <ContextMenu.Group>
                <ContextMenu.Item
                    label={t("Addons.openFolder", {type: t(`Panels.${manager.prefix}s`)})}
                    id="open-folder"
                    icon={FolderIcon}
                    action={() => ipc.openPath(manager.addonFolder)}
                />
            </ContextMenu.Group>
        </ContextMenu.Menu>
    );
}

function AddonList({addon: addonPage}: {addon: string;}) {
    const manager = React.useMemo(() => addonPage === "plugins" ? PluginManager : ThemeManager, [addonPage]);

    const searchParams = useSearchParams();

    const query = useMemo(() => searchParams.get("query") || "", [searchParams]);
    const [search, setSearch] = useState(() => query);

    useLayoutEffect(() => setSearch(query), [query]);

    const addons = useInternalStore(manager, () => manager.addonList.concat(), [], shallowEqual);

    return (
        <Page
            title={t(`Panels.${addonPage}`)}
            icon={addonPage === "themes" ? Palette : PlugIcon}
            toolbar={[
                {
                    render: () => (
                        <div className="bd-search-wrapper">
                            <input
                                onChange={(e) => setSearch(e.currentTarget.value)}
                                onBlur={() => searchParams.set("query", search)}
                                onKeyDown={(e) => {
                                    switch (e.key) {
                                        case "Enter":
                                        case "Escape":
                                            e.currentTarget.blur();
                                            break;
                                    }
                                }}
                                type="text"
                                className="bd-search"
                                placeholder={`${t("Addons.search", {type: `${[].length} ${t(`Panels.${addonPage}`)}`})}...`}
                                maxLength={50}
                                value={search}
                            />
                            {!search && <SearchIcon size="18px" />}
                            {search && (
                                <Button
                                    look={Button.Looks.BLANK}
                                    color={Button.Colors.TRANSPARENT}
                                    size={Button.Sizes.NONE}
                                    onClick={() => {
                                        searchParams.set("query", "");
                                        setSearch("");
                                    }}
                                >
                                    <XIcon size="16px" />
                                </Button>
                            )}
                        </div>
                    )
                },
                {
                    icon: EllipsisVertical,
                    onClick: (event) => {
                        ContextMenu.open(
                            event,
                            (props: unknown) => <AddonListMenu {...props} manager={manager} />,
                            {}
                        );
                    }
                }
            ]}
        >
            {addons.map((addon) => (
                <div key={addon.filename} style={{color: "red"}}>
                    <div>
                        {addon.name}
                    </div>
                    <div>
                        {addon.filename}
                    </div>
                </div>
            ))}
        </Page>
    );
}

export default AddonList;