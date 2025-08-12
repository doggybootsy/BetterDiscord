import React from "react";

import Settings, {type SettingsCollection} from "@stores/settings";
import type {RouteComponentProps} from "react-router";
import Page from "./Page";
import {t} from "@common/i18n";
import {Cloudy, Cog, ListRestartIcon, Palette, PlugIcon} from "lucide-react";
import type {RouteParams} from "@modules/routemanager";
import SettingsGroup from "@ui/settings/group";
import JsonStore from "@stores/json";
import Events from "@modules/emitter";
import HomePage from "./home";
import AddonPage from "./addons";
import CustomCSSPage from "./Custom-CSS";

function Logo(props: {
    className: string,
    color: string,
    width: number,
    height: number;
}) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" enableBackground="new 0 0 2000 2000" xmlSpace="preserve">
            <g>
                <path fill={props.color} d="M1402.2,631.7c-9.7-353.4-286.2-496-642.6-496H68.4v714.1l442,398V490.7h257c274.5,0,274.5,344.9,0,344.9H597.6v329.5h169.8c274.5,0,274.5,344.8,0,344.8h-699v354.9h691.2c356.3,0,632.8-142.6,642.6-496c0-162.6-44.5-284.1-122.9-368.6C1357.7,915.8,1402.2,794.3,1402.2,631.7z" />
                <path fill={props.color} d="M1262.5,135.2L1262.5,135.2l-76.8,0c26.6,13.3,51.7,28.1,75,44.3c70.7,49.1,126.1,111.5,164.6,185.3c39.9,76.6,61.5,165.6,64.3,264.6l0,1.2v1.2c0,141.1,0,596.1,0,737.1v1.2l0,1.2c-2.7,99-24.3,188-64.3,264.6c-38.5,73.8-93.8,136.2-164.6,185.3c-22.6,15.7-46.9,30.1-72.6,43.1h72.5c346.2,1.9,671-171.2,671-567.9V716.7C1933.5,312.2,1608.7,135.2,1262.5,135.2z" />
            </g>
        </svg>
    );
}

type BetterDiscordRouteProps = RouteComponentProps<RouteParams>;

function CollectionView({collection}: {collection: SettingsCollection;}) {
    const getDrawerState = React.useCallback((group: string, defaultValue: boolean) => {
        const drawerStates: Partial<Record<string, Record<string, boolean>>> = JsonStore.get("misc", "drawerStates") || {};
        if (!drawerStates[collection.id]) return defaultValue;
        if (!drawerStates[collection.id]!.hasOwnProperty(group)) return defaultValue;
        return drawerStates[collection.id]![group];
    }, [collection]);

    const onDrawerToggle = React.useCallback((group: string, state: boolean) => {
        const drawerStates: Partial<Record<string, Record<string, boolean>>> = JsonStore.get("misc", "drawerStates") || {};
        if (!drawerStates[collection.id]) drawerStates[collection.id] = {};
        drawerStates[collection.id]![group] = state;
        JsonStore.set("misc", "drawerStates", drawerStates);
    }, [collection]);

    const onChange = React.useCallback((category: string, id: string, value: unknown) => {
        Settings.state[collection.id][category][id] = value;

        Events.dispatch("setting-updated", collection, category, id, value);

        Settings.emit();
        Settings.saveCollection(collection.id);
    }, [collection]);

    return collection.settings.map(section => {
        const props = Object.assign({}, section, {
            collection: collection.id,
            onChange,
            onDrawerToggle: (state: boolean) => onDrawerToggle(section.id, state),
            shown: getDrawerState(section.id, section.hasOwnProperty("shown") ? section.shown : true)
        });

        // @ts-expect-error IDK!
        return <SettingsGroup {...props} />;
    });
}

function BetterDiscordRoute(props: BetterDiscordRouteProps) {
    const content = React.useMemo(() => {
        const path = props.location.pathname.slice(14) || "/";
        // if (!path) {
        //     path = "/settings";

        //     (props.match.params as {
        //         collection: string;
        //     }).collection = "settings";
        // }

        switch (path) {
            case "/":
                return <HomePage />;
            case "/custom-css":
                return <CustomCSSPage />;
            case "/updates":
                return (
                    <Page title={t("Panels.updates")} toolbar={[]} icon={Cloudy}>
                        <div style={{color: "red"}}>Updater</div>
                    </Page>
                );
            default:
                if ("collection" in props.match.params) {
                    const collection = Settings.collections.find(({id}) => (props.match.params as {collection: string;}).collection === id)!;

                    return (
                        <Page
                            title={collection.name}
                            toolbar={[
                                {
                                    icon: ListRestartIcon,
                                    tooltip: t("Settings.resetSettings"),
                                    onClick: () => {}
                                }
                            ]}
                            icon={Cog}
                        >
                            <CollectionView collection={collection} />
                        </Page>
                    );
                }
                if ("addon" in props.match.params) {
                    const icon = props.match.params.addon === "themes" ? Palette : PlugIcon;

                    if (path.endsWith("/store")) {
                        return (
                            <Page title={`${props.match.params.addon} Store`} toolbar={[]} icon={icon}>
                                <div style={{color: "red"}}>{props.match.params.addon} Store</div>
                            </Page>
                        );
                    }

                    return <AddonPage addon={props.match.params.addon} />;
                }

                return (
                    <Page title="404" toolbar={[]} icon={Logo}>
                        <div style={{color: "red"}}>404 Route not found</div>
                    </Page>
                );
        }
    }, [props.location, props.match]);

    return content;
}

export default React.memo(BetterDiscordRoute);