import React from "react";
import { RouteDataContextContextType } from "./routeDataContext.js";
import { useHtmlHeadData } from "./useHtmlHeadData.js";

interface Props {
    routeDataContext: RouteDataContextContextType;
    children: JSX.Element | JSX.Element[] | string | null | undefined;
}

export const HtmlHeadWrapper: React.FC<Props> = ({ routeDataContext, children }) => {
    useHtmlHeadData(routeDataContext);

    return <>{children ?? null}</>;
};
