import React from "react";
import {useInternalStore} from "@ui/hooks";
import RouteManager from "@modules/routemanager";
import Sidebar from "./sidebar";
import Header, {type HeaderIconProps, type IconProps} from "./Header";

type ToolbarItem = {render: () => React.ReactNode;} | HeaderIconProps;

interface PageProps extends React.PropsWithChildren {
    title: React.ReactNode;
    icon: React.ComponentType<IconProps>;
    toolbar?: ToolbarItem[];
    fullContent?: boolean;
}

function HeaderIcon(props: ToolbarItem) {
    if ("render" in props) {
        return props.render();
    }

    return <Header.Icon {...props} />;
}

/**
 * This is the Base component for {@link Page}
 * It doesn't do anything fancy
 */
export function BasePage(props: React.PropsWithChildren) {
    const ownsChannelBar = useInternalStore(RouteManager, () => RouteManager.channelBar.owns());

    if (!ownsChannelBar) {
        return (
            <div className="bd-content-wrapper">
                <main className="bd-page">
                    {props.children}
                </main>
                <Sidebar fallback />
            </div>
        );
    }

    return (
        <main className="bd-page">
            {props.children}
        </main>
    );
}

function Page(props: PageProps) {
    const toolbar = React.useMemo(() => Array.isArray(props.toolbar) ? props.toolbar.map((iProps, index) => {
        return <HeaderIcon {...iProps} key={`${props.toolbar!.length}-${index}`} />;
    }) : false, [props.toolbar]);

    return (
        <BasePage>
            <Header
                toolbar={[
                    toolbar
                    // <Header.Icon
                    //     icon={Globe}
                    //     onClick={() => {}}
                    //     tooltip={t("Addons.website")}
                    // />
                ]}
                className="bd-headerbar"
            >
                <Header.Icon icon={(iProps) => <props.icon {...iProps} />} />
                <Header.Title>
                    {props.title}
                </Header.Title>
            </Header>
            {props.fullContent ? props.children : (
                <div className="bd-content">
                    {props.children}
                </div>
            )}
        </BasePage>
    );
}

export default Page;