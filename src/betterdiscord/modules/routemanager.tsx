import {Filters, getByStrings, getLazyByPrototypes, getLazyBySource} from "@webpack";
import Patcher from "./patcher";
import {findInTree} from "@common/utils";
import React from "react";
import BetterDiscordRoute from "@ui/routes";
import type {ExtractRouteParams, RouteComponentProps} from "react-router";
import Settings from "@stores/settings";
import Sidebar from "@ui/routes/sidebar";
import Store from "@stores/base";

const getRoutes = () => [
    `/betterdiscord/:collection(${Settings.collections.map((collection) => collection.id).join("|")})`,
    "/betterdiscord/:addon(plugins|themes)/store?",
    "/betterdiscord/:addon(plugins|themes)",
    "/betterdiscord/custom-css",
    "/betterdiscord/updates",
    "/betterdiscord",
    "/betterdiscord/*"
] as const satisfies Array<`/betterdiscord${string}`>;

export type RouteParams = ExtractRouteParams<ReturnType<typeof getRoutes>[number], string>;

export default new class RouteManager extends Store {
    constructor() {
        super();

        this.channelSidebar = this.channelSidebar.bind(this);
    }

    public initialize() {
        this.patchAppView();
        this.patchRoutePaths();
    }

    private _transitionTo?: (path: string) => void;
    public transitionTo(path: string) {
        this._transitionTo ??= getByStrings(["transitionTo -"], {searchExports: true});

        if (path === "/home" || path === "/" || path === "") {
            path = "/betterdiscord";
        }
        else {
            path = `/betterdiscord/${path.slice(1)}`;
        }

        this._transitionTo!(path);
    }

    private async patchRoutePaths() {
        const Router = await getLazyByPrototypes<React.ComponentClass>([
            "handleHistoryChange", "ensureChannelMatchesGuild"
        ]);

        Patcher.after("betterdiscord-router", Router!.prototype, "render", (that, args, res) => {
            const channelRouteProps: {
                path: string[];
            } = findInTree(res, (node) => node && node.path?.length > 5, {
                walkable: ["children", "props"]
            });

            channelRouteProps.path = Array.from(new Set([
                ...getRoutes(),
                ...channelRouteProps.path
            ]));
        });
    }

    private Route?: React.FC<{
        path: readonly string[],
        disableTrack: boolean;
        render: React.ComponentType<RouteComponentProps>;
    }>;

    private handleAddingRoutes(res: React.ReactNode) {
        const {children} = findInTree(res as any, (node) => node && node.children?.length > 5, {walkable: ["children", "props"]}) as {children: React.ReactNode[];};

        const bdRoute = children.findIndex((node) => React.isValidElement(node) && node.key === "BetterDiscord");
        if (bdRoute !== -1) return;

        if (typeof this.Route !== "function") {
            const Router = children.find((node) => React.isValidElement(node) && "path" in (node.props as {
                path: string[],
                disableTrack: boolean;
            }));

            this.Route = (Router as React.ReactElement)?.type || getByStrings<any>([
                "[\"impressionName\",\"impressionProperties\",\"disableTrack\"]"
            ]);
        }

        if (!this.Route) {
            // Not real
            return;
        }

        children.push(
            <this.Route
                path={getRoutes()}
                disableTrack
                render={(props) => (
                    <BetterDiscordRoute {...props} />
                )}
                key="BetterDiscord"
            />
        );
    }

    private channelSidebarFilter = Filters.byStrings("ChannelSidebar");
    private channelSidebarType?: React.FC;

    private channelSidebarListFilter = Filters.byStrings("Sidebar");

    private _channelBar = false;
    public channelBar = {
        owns: () => this._channelBar,
        doOwn: () => {
            if (this._channelBar) return;
            this._channelBar = true;
            this.emit();
        }
    };

    private hasPatchedChannelSidebar = false;
    private channelSidebar(props: object) {
        const ret = this.channelSidebarType!(props) as any;

        if (this.hasPatchedChannelSidebar) return ret;
        this.hasPatchedChannelSidebar = true;

        return React.cloneElement(ret, {
            children: (p: any) => {
                const res = ret.props.children(p);

                const element = findInTree(res, (node) => React.isValidElement(node) && this.channelSidebarListFilter((node.type as unknown as React.MemoExoticComponent<React.FC>).type));

                Patcher.after("betterdiscord-router", element.type, "type", () => {
                    if (location.pathname.startsWith("/betterdiscord")) {
                        return <Sidebar />;
                    }
                });

                return res;
            }
        });
    }

    private replaceChannelSidebar(res: React.ReactNode) {
        const node = findInTree(res as any, (node) => node && this.channelSidebarFilter(node.type), {walkable: ["children", "props"]}) as React.ReactElement;

        if (typeof this.channelSidebarType !== "function") {
            this.channelSidebarType = node.type as any;
        }

        node.type = this.channelSidebar;
    }

    private async patchAppView() {
        const AppView = await getLazyBySource<{
            Z: React.FC;
        }>(["\"AppView\""], {
            searchDefault: false
        });

        Patcher.after("betterdiscord-router", AppView!, "Z", (that, args, res) => {
            this.handleAddingRoutes(res as React.ReactNode);
            this.replaceChannelSidebar(res as React.ReactElement);
        });
    }
};