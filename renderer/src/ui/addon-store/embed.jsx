import React from "@modules/react";
import AddonStore from "@modules/addonstore";

import AddonCard from "./card";
import {TagContext} from "./page";
import Spinner from "@ui/spinner";

const {useState, useEffect, useCallback} = React;

export default function AddonEmbed({id, name, original}) {
    if (typeof id !== "string") AddonStore.initializeIfNeeded();    

    const getAddon = useCallback(() => name ? AddonStore.getAddonViaEmbedName(name) : AddonStore.getAddon(id), [id, name]);

    const [addon, setAddon] = useState(() => getAddon());
    const [loading, setLoading] = useState(() => typeof name === "string" ? AddonStore.loading : true);
    const [tags, setTags] = useState({});
    
    useEffect(() => {
        if (typeof id === "string") {
            AddonStore.requestAddon(decodeURIComponent(id)).then(setAddon, () => setLoading(false));
            return;
        }

        setAddon(getAddon());
        setLoading(AddonStore.loading);

        const listener = () => {      
            setAddon(getAddon);
            setLoading(AddonStore.loading);
        };

        return AddonStore.addChangeListener(listener);
    }, [getAddon, id]);

    if (!addon) {
        // 404 don't show
        if (!loading) return original;

        return (
            <div className="bd-addon-store-card-embed bd-addon-store-card-loading">
                <Spinner type={Spinner.Type.SPINNING_CIRCLE} />
            </div>
        );
    }

    return (
        <TagContext.Provider
            value={[
                (tag) => tags[tag] === true,
                (tag, state) => setTags(($tags) => ({...$tags, [tag]: state ?? !$tags[tag]}))
            ]}
        >
            <AddonCard addon={addon} isEmbed />
        </TagContext.Provider>
    );
}