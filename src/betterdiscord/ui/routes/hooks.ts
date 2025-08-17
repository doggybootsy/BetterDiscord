import RouteManager from "@modules/routemanager";
import {getLazyBySource} from "@webpack";
import {useMemo} from "react";

import type * as RR from "react-router";

export let useLocation: typeof RR["useLocation"] = () => {
    return useMemo(() => ({
        pathname: location.pathname,
        search: location.search,
        state: {} as any,
        hash: location.hash,
        key: undefined
    }), []);
};

class IURLSearchParams extends URLSearchParams {
    append(name: string, value: string): void {
        super.append(name, value);
        RouteManager.transitionTo(`?${this}`);
    }

    delete(name: string, value?: string): void {
        super.delete(name, value);
        RouteManager.transitionTo(`?${this}`);
    }

    set(name: string, value: string): void {
        super.set(name, value);
        RouteManager.transitionTo(`?${this}`);
    }
}

export function useSearchParams(
    init?: string[][] | Record<string, string> | string | URLSearchParams
) {
    const location = useLocation();

    return useMemo(() => new IURLSearchParams([...new URLSearchParams(init), ...new URLSearchParams(location.search)]), [location.search, init]);
}

getLazyBySource([".location", "withRouter"], {searchDefault: false}).then((ReactRouter: any) => {
    const _useLocation = Object.values(ReactRouter)
        .find((m: any) => m?.length === 0 && String(m).includes(".location"));

    if (_useLocation) {
        useLocation = _useLocation as typeof RR["useLocation"];
    }
});
