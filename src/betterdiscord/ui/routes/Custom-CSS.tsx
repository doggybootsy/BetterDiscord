import React from "react";

import {BasePage} from "./Page";
import {CustomCSS} from "@builtins/builtins";
import Header from "./Header";
import {ExternalLinkIcon, RotateCwIcon, SaveIcon, PencilIcon} from "lucide-react";
import {t} from "@common/i18n";
import Flex from "@ui/base/flex";
import Text from "@ui/base/text";
import Switch from "@ui/settings/components/switch";
import Editor from "@ui/customcss/editor";
import Events from "@modules/emitter";
import Settings from "@stores/settings";
import {useInternalStore} from "@ui/hooks";

function CustomCSSPage() {
    const editorRef = React.useRef<{
        value: string;
    }>(null);
    const [hasUnsavedChanges, setUnsaved] = React.useState(false);

    const updateEditor = React.useCallback((newCSS: string) => {
        if (editorRef.current) {
            editorRef.current.value = newCSS;
        }
    }, [editorRef]);

    React.useEffect(() => {
        Events.on("customcss-updated", updateEditor);
        return () => void Events.off("customcss-updated", updateEditor);
    }, [updateEditor]);

    const toggleLiveUpdate = React.useCallback((checked: boolean) => Settings.set("settings", "customcss", "liveUpdate", checked), []);
    const updateCss = React.useCallback(() => CustomCSS.insertCSS(editorRef.current!.value), []);
    const popoutNative = React.useCallback(() => CustomCSS.openNative(), []);
    const popout = React.useCallback(() => CustomCSS.openDetached(editorRef.current!.value), []);

    const liveUpdate = useInternalStore(Settings, () => Settings.get<boolean>("settings", "customcss", "liveUpdate"));

    const onChange = React.useCallback(() => {
        CustomCSS.onChange(editorRef.current!.value);
        setUnsaved(!liveUpdate);
    }, [liveUpdate]);

    const saveCss = React.useCallback(() => {
        CustomCSS.saveCSS(editorRef.current!.value);
        setUnsaved(false);
    }, []);

    return (
        <BasePage>
            <Header
                toolbar={
                    <>
                        <Flex align={Flex.Align.CENTER} style={{gap: "10px"}}>
                            <Text>{t("Collections.settings.customcss.liveUpdate.name")}</Text>
                            <Switch
                                onChange={toggleLiveUpdate}
                                value={liveUpdate}
                                internalState={false}
                            />
                        </Flex>
                        <Header.Icon
                            icon={ExternalLinkIcon}
                            tooltip={t("CustomCSS.openDetached")}
                            onClick={popout}
                        />
                    </>
                }
            >
                <Header.Icon
                    icon={RotateCwIcon}
                    tooltip={t("CustomCSS.update")}
                    onClick={updateCss}
                />
                <Header.Icon
                    icon={SaveIcon}
                    tooltip={t("CustomCSS.save")}
                    onClick={saveCss}
                    badgePosition="bottom"
                    showBadge={hasUnsavedChanges}
                />
                <Header.Icon
                    icon={PencilIcon}
                    tooltip={t("CustomCSS.openNative")}
                    onClick={popoutNative}
                />
            </Header>
            <Editor
                ref={editorRef}
                id="bd-customcss-editor"
                onChange={onChange}
                value={CustomCSS.savedCss}
                controls={[]}
            />
        </BasePage>
    );
}

export default CustomCSSPage;