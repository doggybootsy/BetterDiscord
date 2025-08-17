import React, {useMemo} from "react";

import type {Plugin} from "@modules/pluginmanager";
import Page, {BasePage} from "../Page";
import {ChevronRightIcon, PlugIcon} from "lucide-react";
import TextElement from "@ui/base/text";
import ErrorBoundary from "@ui/errorboundary";
import {useInternalStore} from "@ui/hooks";
import PluginManager from "@modules/pluginmanager";
import HeaderBar from "../Header";
import {t} from "@common/i18n";
import RouteManager from "@modules/routemanager";

function AddonSettings({addon}: {addon: Plugin;}) {
    const isEnabled = useInternalStore(PluginManager, () => PluginManager.isEnabled(addon.filename), [addon.filename]);

    const content = useMemo(() => {
        if (!isEnabled) return null;
        if (typeof addon.instance.getSettingsPanel !== "function") return null;

        const panel:
            | Element
            | string
            | (() => React.ReactNode)
            | React.ReactNode
            | React.ComponentType = addon.instance.getSettingsPanel();

        let child = panel;

        if (panel instanceof Node || typeof (panel) === "string") {
            child = class ReactWrapper extends React.Component<any, {hasError: boolean;}> {
                element: Element | string;
                elementRef: React.RefObject<Element | string | null>;
                constructor(props?: any) {
                    super(props);
                    this.elementRef = React.createRef();
                    this.element = panel as (Element | string);
                    this.state = {hasError: false};
                }

                componentDidCatch() {
                    this.setState({hasError: true});
                }

                componentDidMount() {
                    if (this.element instanceof Node) (this.elementRef as React.RefObject<Element>).current?.appendChild(this.element as Element);
                }

                render() {
                    if (this.state.hasError) return React.createElement(TextElement, {color: TextElement.Colors.STATUS_RED}, t("Addons.settingsError"));
                    return React.createElement("div", {
                        className: "bd-addon-settings-wrap",
                        ref: this.elementRef,
                        dangerouslySetInnerHTML: typeof (this.element) === "string" ? {__html: this.element} : undefined
                    });
                }
            };
        }
        if (typeof (child) === "function") child = React.createElement(child);

        return child as React.ReactNode;
    }, [isEnabled, addon]);

    return (
        <BasePage>
            <HeaderBar
                toolbar={(
                    <>
                        <button onClick={() => isEnabled ? PluginManager.disableAddon(addon) : PluginManager.enableAddon(addon)}>
                            {isEnabled.toString()}
                        </button>
                    </>
                )}
            >
                <HeaderBar.Icon icon={PlugIcon} />
                <HeaderBar.Title onClick={() => RouteManager.transitionTo("/plugins")}>
                    {t("Panels.plugins")}
                </HeaderBar.Title>
                <HeaderBar.Icon icon={ChevronRightIcon} />
                <HeaderBar.Title>
                    {addon.name}
                </HeaderBar.Title>
                <HeaderBar.Title muted>
                    v{addon.version}
                </HeaderBar.Title>
            </HeaderBar>
            {typeof addon.instance.getSettingsPanel === "function" && (
                <div className="bd-content">
                    <ErrorBoundary>
                        {content}
                    </ErrorBoundary>
                </div>
            )}
        </BasePage>
    );
}

export default AddonSettings;