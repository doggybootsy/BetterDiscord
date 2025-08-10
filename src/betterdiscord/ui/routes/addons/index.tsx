import React from "react";

import PluginManager from "@modules/pluginmanager";
import ThemeManager from "@modules/thememanager";
import Page from "../Page";
import {t} from "@common/i18n";
import {CheckIcon, FolderIcon, Palette, PlugIcon, XIcon} from "lucide-react";
import Search from "@ui/settings/components/search";

function AddonPage({addon}: {addon: string;}) {
    const manager = React.useMemo(() => addon === "plugins" ? PluginManager : ThemeManager, [addon]);
    const [query, search] = React.useState("");

    return (
        <Page
            title={t(`Panels.${addon}`)}
            icon={addon === "themes" ? Palette : PlugIcon}
            toolbar={[
                {
                    icon: XIcon,
                    tooltip: t("Addons.disableAll"),
                    onClick: () => {}
                },
                {
                    icon: CheckIcon,
                    tooltip: t("Addons.enableAll"),
                    onClick: () => {}
                },
                {
                    icon: FolderIcon,
                    tooltip: t("Addons.openFolder", {type: t(`Panels.${addon}`)}),
                    onClick: () => {}
                },
                {
                    render: () => (
                        <Search onChange={e => search(e.currentTarget.value)} placeholder={`${t("Addons.search", {type: `${[].length} ${t(`Panels.${addon}`)}`})}...`} />
                    )
                }
            ]}
        >
            {manager.extension}
        </Page>
    );
}

export default AddonPage;