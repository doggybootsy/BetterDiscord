import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";

import PluginManager from "@modules/pluginmanager";
import ThemeManager from "@modules/thememanager";
import Page from "../../Page";
import {t} from "@common/i18n";
import {ArrowDownAZIcon, ArrowDownZAIcon, EllipsisVertical, FolderIcon, LayoutGridIcon, Palette, PlugIcon, SearchIcon, StretchHorizontalIcon, XIcon} from "lucide-react";
import ContextMenuPatcher from "@api/contextmenu";
import ipc from "@modules/ipc";
import {setAddonListControls, useAddonlistControls, type AddonListControls} from "../addonlistControls";
import {useSearchParams} from "../../hooks";
import Button from "@ui/base/button";
import AddonCard from "./card";
import addonStore from "@modules/addonstore";
import {TagContext, type Tags} from "./shared";
import Web from "@data/web";
import Paginator from "@ui/misc/paginator";

const ContextMenu = new ContextMenuPatcher() as InstanceType<typeof ContextMenuPatcher> & {
    Separator: any;
    CheckboxItem: any;
    RadioItem: any;
    ControlItem: any;
    Group: any;
    Item: any;
    Menu: any;
};

function AddonStoreMenu({manager, ...props}: {manager: typeof PluginManager | typeof ThemeManager;}) {
    const {view, sort, ascending} = useAddonlistControls(manager.prefix);

    const setControl = React.useCallback(<T extends keyof AddonListControls>(type: T, value: AddonListControls[T]) => setAddonListControls(`${manager.prefix}-store`, type, value), [manager]);

    const isGrid = React.useMemo(() => view === "grid", [view]);

    const toggleView = React.useCallback(() => setControl("view", isGrid ? "list" : "grid"), [setControl, isGrid]);
    const toggleAscending = React.useCallback(() => setControl("ascending", !ascending), [setControl, ascending]);

    const [tags, setTags] = useState<Partial<Record<string, boolean>>>({});

    return (
        <ContextMenu.Menu navId="betterdiscord-addon-page-menu" {...props}>
            <ContextMenu.Group>
                <ContextMenu.Item
                    id="tags"
                    label={`Tags (${Object.values(tags).filter(x => x).length})`}
                    // icon={ArrowDownUpIcon}
                    action={toggleView}
                >
                    {Web.store.tags[manager.prefix].map((tag) => (
                        <ContextMenu.CheckboxItem
                            label={tag.slice(0, 1).toUpperCase() + tag.slice(1)}
                            checked={tags[tag]}
                            action={() => setTags(v => ({...v, [tag]: !v[tag]}))}
                            id={tag}
                            key={tag}
                        />
                    ))}
                </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Group label="Sorting">
                <ContextMenu.Item
                    id="sort-by"
                    label={`Sort By ${t(`Addons.${sort}`)}`}
                    // icon={ArrowDownUpIcon}
                    action={toggleView}
                >
                    {([
                        {label: t("Addons.downloads"), value: "downloads"},
                        // {label: t("Addons.popularity"), value: "popularity"},
                        {label: t("Addons.name"), value: "name"},
                        {label: t("Addons.author"), value: "author"},
                        {label: t("Addons.version"), value: "version"},
                        {label: t("Addons.lastUpdated"), value: "modified"},
                        {label: t("Addons.releaseDate"), value: "releaseDate"},
                        {label: t("Addons.isInstalled"), value: "isInstalled"},
                        {label: t("Addons.likes"), value: "likes"}
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

function AddonStore({addon: addonPage}: {addon: string;}) {
    const manager = React.useMemo(() => addonPage === "plugins" ? PluginManager : ThemeManager, [addonPage]);

    const searchParams = useSearchParams();

    const query = useMemo(() => searchParams.get("query") || "", [searchParams]);
    const [search, setSearch] = useState(() => query);

    const parameterPage = useMemo(() => {
        if (!searchParams.has("page")) return 0;

        const param = searchParams.get("page");
        const paramPage = Number(param);

        if (isNaN(paramPage)) return 0;

        return paramPage;
    }, [searchParams]);
    const [page, setPage] = useState(() => parameterPage);

    useLayoutEffect(() => setSearch(query), [query]);
    useLayoutEffect(() => setPage(parameterPage), [parameterPage]);

    const [tags, setTags] = useState<Partial<Record<Tags, boolean>>>({});

    const toggleTag = useCallback((tag: Tags, value?: boolean) => {
        setPage(0);

        setTags(($tags) => ({
            ...$tags,
            [tag]: value ?? !$tags[tag]
        }));
    }, []);

    const {error, addons, loading} = addonStore.useState();

    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Page
            title={t(`Panels.${addonPage}`)}
            icon={addonPage === "themes" ? Palette : PlugIcon}
            contentRef={contentRef}
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
                            (props: unknown) => <AddonStoreMenu {...props} manager={manager} />,
                            {}
                        );
                    }
                }
            ]}
        >
            <div className="bd-store-list">
                <TagContext value={[(tag: Tags) => !!tags[tag], toggleTag]}>
                    {addons.slice(page * 50, (page + 1) * 50).map((addon) => <AddonCard key={addon.id} addon={addon} isEmbed={false} />)}
                </TagContext>
            </div>

            <Paginator
                currentPage={page}
                onPageChange={(i) => {
                    searchParams.set("page", i.toString());

                    if (contentRef.current) {
                        contentRef.current.scrollTo({top: 0, behavior: "smooth"});
                    }
                }}
                length={addons.length}
                pageSize={50}
            />
        </Page>
    );
}

export default AddonStore;