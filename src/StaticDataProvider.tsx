import { DatasourceState, DatasourceStateError, useDatasource } from "@nexcodepl/endpoint-client";
import { useStoreState } from "@nexcodepl/react-store";
import { StaticRouteBase } from "@nexcodepl/vite-static";
import { useEffect } from "react";
import { RouteDataContextContextType, useRouteDataContext } from "./routeDataContext.js";
import { EndpointStaticData } from "./Static.endpoint.js";
import { useStaticDataContext } from "./staticDataContext.js";
import { HtmlHeadWrapper } from "./HtmlHeadWrapper.js";

interface Props<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData> {
    RouteDataContext: RouteDataContextContextType;
    route: TStaticRoute;
    element: JSX.Element;
    wrapper: React.FC<{ route: TStaticRoute; children: JSX.Element; routeDataState: DatasourceState<any>["state"] }>;
    loader: JSX.Element;
    error: (error: DatasourceStateError) => JSX.Element;
    routes: TStaticRoute[];
    globalData: TGlobalData;
    basePath?: string;
}

export function StaticDataProvider<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData>({
    route,
    element,
    loader,
    error,
    routes,
    globalData,
    wrapper,
    RouteDataContext,
    basePath = "",
}: Props<TStaticRoute, TGlobalData>) {
    const staticDataContext = useStaticDataContext();
    const routeDataContext = useRouteDataContext<TStaticRoute, TGlobalData, TStaticRoute>({
        globalData,
        route,
        routes,
        routeData: staticDataContext.getData(route.id),
    });

    const dsRouteData = useDatasource({ ...EndpointStaticData, url: basePath + EndpointStaticData.url });

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

    return (
        <RouteDataContext.Provider value={routeDataContext}>
            {wrapper({
                routeDataState: dsRouteDataState.state,
                route,
                children:
                    dsRouteDataState.state === "error" ? (
                        error(dsRouteDataState)
                    ) : dsRouteDataState.state === "pending" ||
                      routeDataContext.routeData === null ||
                      route.id !== routeDataContext.routeData.data?.id ? (
                        loader
                    ) : (
                        <HtmlHeadWrapper routeDataContext={RouteDataContext}>{element}</HtmlHeadWrapper>
                    ),
            })}
        </RouteDataContext.Provider>
    );
}
