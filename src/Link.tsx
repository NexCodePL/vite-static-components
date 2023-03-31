import React from "react";
import { Link as LinkRaw } from "react-router-dom";
import { StaticRouteBase } from "@nexcodepl/vite-static";
import { useRouteData } from "./routeDataContext.js";

interface Props {
    className?: string;
    children?: JSX.Element | string;
    to: string | { id: string };
    onClick?: () => void;
}

export const Link: React.FC<Props> = ({ className, children, to, onClick }) => {
    const routeData = useRouteData();

    return (
        <LinkRaw
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
