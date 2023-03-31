import { DatasourceStateError, useDatasource } from "@nexcodepl/endpoint-client";
import { useStoreState } from "@nexcodepl/react-store";
import { StaticRouteBase } from "@nexcodepl/vite-static";
import { useEffect } from "react";
import { RouteDataContext, useRouteDataContext } from "./routeDataContext.js";
import { EndpointStaticData } from "./Static.endpoint.js";
import { useStaticDataContext } from "./staticDataContext.js";

interface Props<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData> {
    route: TStaticRoute;
    element: JSX.Element;
    loader: JSX.Element;
    error: (error: DatasourceStateError) => JSX.Element;
    routes: TStaticRoute[];
    globalData: TGlobalData;
}

export function StaticDataProvider<
    TStaticRoute extends StaticRouteBase<any, any>,
    TGlobalData,
>({ route, element, loader, error, routes, globalData }: Props<TStaticRoute, TGlobalData>) {
    const staticDataContext = useStaticDataContext();
    const routeDataContext = useRouteDataContext<TStaticRoute, TGlobalData, TStaticRoute>({
        globalData,
        route,
        routes,
        routeData: staticDataContext.getData(route.id),
    });

    const dsRouteData = useDatasource(EndpointStaticData);

    const dsRouteDataState = useStoreState(dsRouteData.state);

    useEffect(() => {
        const routeData = staticDataContext.getData(route.id) ?? null;
        routeDataContext.routeDataStore.set(routeData as any);

        if (!routeData) {
            dsRouteData.load({ params: { dataId: route.id } });
        }
    }, [route.id]);

    useEffect(() => {
        if (dsRouteDataState.state === "completed") {
            routeDataContext.routeDataStore.set(dsRouteDataState.response as any);
            staticDataContext.setData(route.id, dsRouteDataState.response);
        }
    }, [dsRouteDataState.state]);

    if (dsRouteDataState.state === "error") {
        return error(dsRouteDataState);
    }

    if (dsRouteDataState.state === "pending" || routeDataContext.routeData === null) {
        return loader;
    }

    return <RouteDataContext.Provider value={routeDataContext}>{element}</RouteDataContext.Provider>;
}