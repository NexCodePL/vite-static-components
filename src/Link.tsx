import React from "react";
import { Link as LinkRaw, LinkProps as LinkPropsRaw } from "react-router-dom";
import { StaticRouteBase } from "@nexcodepl/vite-static";
import { RouteDataContextContextType, useRouteData } from "./routeDataContext.js";

export type LinkPropsOptional = Partial<LinkPropsRaw>;

export interface LinkProps {
    className?: string;
    children?: JSX.Element | string | null | JSX.Element[];
    to: string | { id: string };
    onClick?: () => void;
    propsRaw?: LinkPropsOptional;
}

export type LinkComponent = React.FC<LinkProps>;

export function getLinkComponent(routeDataContext: RouteDataContextContextType): LinkComponent {
    const Link: React.FC<LinkProps> = ({ className, children, to, onClick, propsRaw }) => {
        const routeData = useRouteData(routeDataContext);

        return (
            <LinkRaw
                {...propsRaw}
                to={getLink(to, routeData?.routesMap)}
                className={className}
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                }}>
                {children}
            </LinkRaw>
        );
    };

    return Link;
}

function getLink(to: string | { id: string }, map: Record<string, StaticRouteBase<any, any>>): string {
    if (!to) return "";
    if (!map) {
        if (typeof to === "string") return to;
        return "";
    }
    if (typeof to === "object") {
        const route = map[to?.id];
        if (route) return route?.path ?? "";
    }

    if (typeof to === "string") {
        const route = map[to];
        if (route) return route?.path ?? to;

        return to;
    }

    return "";
}
