import { useStore, Store, useStoreState } from "@nexcodepl/react-store";
import { StaticRouteBase, StaticRouteBaseGetData } from "@nexcodepl/vite-static";
import { createContext, useContext } from "react";

export interface RouteDataContextType<
    TStaticRoute extends StaticRouteBase<any, any>,
    TGlobalData,
    TRoute extends StaticRouteBase<any, any>
> {
    globalData: TGlobalData;
    route: TStaticRoute;
    routes: TStaticRoute[];
    routesMap: Record<string, TStaticRoute>;
    routeDataStore: Store<StaticRouteBaseGetData<TRoute> | null>;
    routeData: StaticRouteBaseGetData<TRoute>;
}

interface Props<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData, TRoute extends StaticRouteBase<any, any>> {
    globalData: TGlobalData;
    route: TStaticRoute;
    routes: TStaticRoute[];
    routeData: StaticRouteBaseGetData<TRoute> | null;
}

export function useRouteDataContext<
    TStaticRoute extends StaticRouteBase<any, any>,
    TGlobalData,
    TRoute extends StaticRouteBase<any, any>
>({
    globalData,
    route,
    routes,
    routeData: routeDataInit,
}: Props<TStaticRoute, TGlobalData, TRoute>): RouteDataContextType<TStaticRoute, TGlobalData, TRoute> {
    const routeDataStore = useStore<StaticRouteBaseGetData<TRoute> | null>(routeDataInit);

    const routeData = useStoreState(routeDataStore);

    return {
        globalData,
        route,
        routes,
        routesMap: routes.reduce<Record<string, TStaticRoute>>((m, r) => {
            m[r.id] = r;
            return m;
        }, {}),
        routeDataStore: routeDataStore,
        routeData: routeData as StaticRouteBaseGetData<TRoute>,
    };
}

export const RouteDataContext = createContext<RouteDataContextType<any, any, any>>(
    {} as RouteDataContextType<any, any, any>
);

export function useRouteData<
    TStaticRoute extends StaticRouteBase<any, any>,
    TGlobalData,
    TRoute extends StaticRouteBase<any, any>
>() {
    const ctx = useContext(RouteDataContext);

    return ctx as RouteDataContextType<TStaticRoute, TGlobalData, TRoute>;
}
