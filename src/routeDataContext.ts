import { useStore, Store, useStoreState } from "@nexcodepl/react-store";
import { StaticRouteBase, RouteData } from "@nexcodepl/vite-static";
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
    routeDataStore: Store<RouteData<TRoute> | null>;
    routeData: RouteData<TRoute>;
}

interface Props<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData, TRoute extends StaticRouteBase<any, any>> {
    globalData: TGlobalData;
    route: TStaticRoute;
    routes: TStaticRoute[];
    routeData: RouteData<TRoute> | null;
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
    const routeDataStore = useStore<RouteData<TRoute> | null>(routeDataInit);

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
        routeData: routeData as RouteData<TRoute>,
    };
}

export type RouteDataContextContextType = React.Context<RouteDataContextType<any, any, any>>;
export type RouteDataContextProviderType = RouteDataContextContextType['Provider'];

export function getRouteDataContext() {
    return createContext<RouteDataContextType<any, any, any>>({} as RouteDataContextType<any, any, any>);
}

export function useRouteData<
    TStaticRoute extends StaticRouteBase<any, any>,
    TGlobalData,
    TRoute extends StaticRouteBase<any, any>
>(context: RouteDataContextContextType) {
    const ctx = useContext(context);

    return ctx as RouteDataContextType<TStaticRoute, TGlobalData, TRoute>;
}
