import {t} from "@common/i18n";
import Changelog from "@data/changelog";
import DiscordModules from "@modules/discordmodules";
import RouteManager from "@modules/routemanager";
import Settings from "@stores/settings";
import VersionInfo from "@ui/misc/versioninfo";
import Modals from "@ui/modals";
import clsx from "clsx";
import {CircleHelpIcon, Cloudy, Cog, Github, Globe, HistoryIcon, Home, Palette, Pencil, PlugIcon} from "lucide-react";
import React from "react";

function NavButton({label, icon, route, onClick: originalOnClick}: {
    label: React.ReactNode,
    icon: React.ReactNode;
    route: string;
    onClick?(): void;
}) {
    const onClick = React.useCallback(() => {
        if (originalOnClick) {
            originalOnClick();
            return;
        }

        RouteManager.transitionTo(route);
    }, [originalOnClick, route]);

    return (
        <div className={clsx("bd-nav-item", (route === location.pathname.slice(14)) && "bd-nav-item-selected")} role="button" onClick={onClick}>
            <div className="bd-nav-item-icon">{icon}</div>
            <div className="bd-nav-item-text">{label}</div>
        </div>
    );
}

function Seperator() {
    return <div className="bd-nav-seperator" />;
}

function Sidebar({fallback}: {fallback?: boolean;}) {
    if (!fallback) {
        RouteManager.channelBar.doOwn();
    }

    return (
        <div className="bd-sidebar">
            <div className="bd-header">
                <h2>BetterDiscord</h2>
                <DiscordModules.Tooltip text={t("Modals.changelog")}>
                    {(props) => (
                        <div
                            {...props}
                            className="bd-changelog"
                            onClick={() => Modals.showChangelogModal(Changelog)}
                            role="button"
                            tabIndex={-1}
                        >
                            <HistoryIcon size={18} />
                        </div>
                    )}
                </DiscordModules.Tooltip>
            </div>
            <nav className="bd-nav">
                <NavButton
                    route=""
                    label="Home"
                    icon={<Home />}
                />
                <Seperator />
                {Settings.collections.map((collection) => (
                    <NavButton
                        route={`/${collection.id}`}
                        label={collection.name}
                        icon={<Cog />}
                    />
                ))}
                <Seperator />
                <NavButton
                    route="/updates"
                    label={t("Panels.updates")}
                    icon={<Cloudy />}
                />
                <Seperator />
                <NavButton
                    route="/custom-css"
                    label={t("Panels.customcss")}
                    icon={<Pencil />}
                />
                <NavButton
                    route="/plugins"
                    label={t("Panels.plugins")}
                    icon={<PlugIcon />}
                />
                <NavButton
                    route="/themes"
                    label={t("Panels.themes")}
                    icon={<Palette />}
                />
                {/* <NavButton
                    route="/plugins/store"
                    label={t("Panels.plugins")}
                    icon={<PlugIcon />}
                />
                <NavButton
                    route="/themes/store"
                    label={t("Panels.themes")}
                    icon={<Palette />}
                /> */}
                {/* <NavButton
                    route="/themes/store"
                    label="Changelog"
                    icon={<HistoryIcon />}
                /> */}

                <Seperator />
            </nav>
            <div className="bd-links">
                <DiscordModules.Tooltip text="Github">
                    {(tProps) => (
                        <a {...tProps} href="https://github.com/BetterDiscord/BetterDiscord" target="_blank" rel="noopener noreferrer">
                            <Github />
                        </a>
                    )}
                </DiscordModules.Tooltip>
                <DiscordModules.Tooltip text="Website">
                    {(tProps) => (
                        <a {...tProps} href="https://betterdiscord.app/" target="_blank" rel="noopener noreferrer">
                            <Globe />
                        </a>
                    )}
                </DiscordModules.Tooltip>
                <DiscordModules.Tooltip text="Support Server">
                    {(tProps) => (
                        <a
                            {...tProps}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();

                                Modals.showGuildJoinModal("0Tmfo5ZbORCRqbAd");
                            }}
                        >
                            <CircleHelpIcon />
                        </a>
                    )}
                </DiscordModules.Tooltip>
            </div>
            <VersionInfo />
        </div>
    );
}

export default Sidebar;