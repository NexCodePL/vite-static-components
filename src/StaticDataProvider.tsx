import { DatasourceState, DatasourceStateError, useDatasource } from "@nexcodepl/endpoint-client";
import { useStoreState } from "@nexcodepl/react-store";
import { StaticRouteBase } from "@nexcodepl/vite-static";
import { useEffect } from "react";
import { RouteDataContextContextType, useRouteDataContext } from "./routeDataContext.js";
import { EndpointStaticData } from "./Static.endpoint.js";
import { useStaticDataContext } from "./staticDataContext.js";
import { HtmlHeadWrapper } from "./HtmlHeadWrapper.js";

type ElementWithProps<TProps> = (props: TProps) => JSX.Element;

interface Props<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData, TElementProps> {
    RouteDataContext: RouteDataContextContextType;
    route: TStaticRoute;
    element: ElementWithProps<TElementProps>;
    wrapper: React.FC<{
        route: TStaticRoute;
        children: ElementWithProps<TElementProps>;
        routeDataState: DatasourceState<any>["state"];
    }>;
    loader: ElementWithProps<TElementProps>;
    error: (error: DatasourceStateError, props: TElementProps) => JSX.Element;
    routes: TStaticRoute[];
    globalData: TGlobalData;
    basePath?: string;
}

export function StaticDataProvider<TStaticRoute extends StaticRouteBase<any, any>, TGlobalData, TElementProps>({
    route,
    element,
    loader,
    error,
    routes,
    globalData,
    wrapper,
    RouteDataContext,
    basePath = "",
}: Props<TStaticRoute, TGlobalData, TElementProps>) {
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
                children: props =>
                    dsRouteDataState.state === "error" ? (
                        error(dsRouteDataState, props)
                    ) : dsRouteDataState.state === "pending" ||
                      routeDataContext.routeData === null ||
                      route.id !== routeDataContext.routeData.data?.id ? (
                        loader(props)
                    ) : (
                        <HtmlHeadWrapper routeDataContext={RouteDataContext}>{element(props)}</HtmlHeadWrapper>
                    ),
            })}
        </RouteDataContext.Provider>
    );
}
