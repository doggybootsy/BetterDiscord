import React from "react";

import Page from "./Page";
import {t} from "@common/i18n";
import {ExternalLinkIcon, Pencil, RotateCwIcon, Save} from "lucide-react";
import {CustomCSS} from "@builtins/builtins";
import csseditor from "@ui/customcss/csseditor";
import Flex from "@ui/base/flex";
import Switch from "@ui/settings/components/switch";
import Text from "@ui/base/text";

function CustomCSSPage() {
    return (
        <Page
            title={t("Panels.customcss")}
            icon={Pencil}
            toolbar={[
                {
                    icon: RotateCwIcon,
                    onClick: () => {},
                    tooltip: t("CustomCSS.update")
                },
                {
                    icon: Save,
                    onClick: () => {},
                    tooltip: t("CustomCSS.save")
                },
                {
                    icon: Pencil,
                    onClick: () => {},
                    tooltip: t("CustomCSS.openNative")
                },
                {
                    render: () => (
                        <Flex align={Flex.Align.CENTER} style={{gap: "10px"}}>
                            <Text>{t("Collections.settings.customcss.liveUpdate.name")}</Text>
                            <Switch onChange={() => {}} value={true} />
                        </Flex>
                    )
                },
                {
                    icon: ExternalLinkIcon,
                    onClick: () => {},
                    tooltip: t("CustomCSS.openDetached")
                }
            ]}
            fullContent
        >
            {React.createElement(csseditor, {
                css: CustomCSS.savedCss,
                save: CustomCSS.saveCSS.bind(CustomCSS),
                update: CustomCSS.insertCSS.bind(CustomCSS),
                openNative: CustomCSS.openNative.bind(CustomCSS),
                openDetached: CustomCSS.openDetached.bind(CustomCSS),
                onChange: CustomCSS.onChange.bind(CustomCSS)
            })}
        </Page>
    );
}

export default CustomCSSPage;