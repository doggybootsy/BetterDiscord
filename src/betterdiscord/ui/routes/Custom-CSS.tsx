import React from "react";

import {BasePage} from "./Page";
import {CustomCSS} from "@builtins/builtins";
import CSSEditor from "@ui/customcss/csseditor";
import Header from "./Header";
import {ExternalLinkIcon, PencilIcon, RotateCwIcon, SaveIcon} from "lucide-react";
import {t} from "@common/i18n";
import Flex from "@ui/base/flex";
import Text from "@ui/base/text";
import Switch from "@ui/settings/components/switch";

function CustomCSSPage() {
    return (
        <BasePage>
            <Header
                toolbar={
                    <>
                        <Flex align={Flex.Align.CENTER} style={{gap: "10px"}}>
                            <Text>{t("Collections.settings.customcss.liveUpdate.name")}</Text>
                            <Switch onChange={() => {}} value={true} />
                        </Flex>
                        <Header.Icon
                            icon={ExternalLinkIcon}
                            tooltip={t("CustomCSS.openDetached")}
                            onClick={() => {}}
                        />
                    </>
                }
            >
                <Header.Icon
                    icon={RotateCwIcon}
                    tooltip={t("CustomCSS.update")}
                    onClick={() => {}}
                />
                <Header.Icon
                    icon={SaveIcon}
                    tooltip={t("CustomCSS.save")}
                    onClick={() => {}}
                />
                <Header.Icon
                    icon={PencilIcon}
                    tooltip={t("CustomCSS.openNative")}
                    onClick={() => {}}
                />
            </Header>
            {React.createElement(CSSEditor, {
                css: CustomCSS.savedCss,
                save: CustomCSS.saveCSS.bind(CustomCSS),
                update: CustomCSS.insertCSS.bind(CustomCSS),
                openNative: CustomCSS.openNative.bind(CustomCSS),
                openDetached: CustomCSS.openDetached.bind(CustomCSS),
                onChange: CustomCSS.onChange.bind(CustomCSS)
            })}
        </BasePage>
    );
}

export default CustomCSSPage;