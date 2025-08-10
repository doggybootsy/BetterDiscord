import React from "react";

import Page from "./Page";
import {Home} from "lucide-react";
import {useInternalStore} from "@ui/hooks";
import {Stores} from "@webpack";

function HomePage() {
    const user = useInternalStore(Stores.UserStore, () => Stores.UserStore.getCurrentUser());

    return (
        <Page title="Home" toolbar={[]} icon={Home}>
            <div style={{color: "red"}}>
                Hello {user.globalName || user.username}
            </div>
        </Page>
    );
}

export default HomePage;