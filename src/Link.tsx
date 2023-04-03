import React from "react";
import { Link as LinkRaw } from "react-router-dom";
import { StaticRouteBase } from "@nexcodepl/vite-static";
import { useRouteData } from "./routeDataContext.js";

export interface LinkProps {
    className?: string;
    children?: JSX.Element | string | null | JSX.Element[];
    to: string | { id: string };
    onClick?: () => void;
}

export type LinkComponent = typeof Link;

export const Link: React.FC<LinkProps> = ({ className, children, to, onClick }) => {
    const routeData = useRouteData();

    // return LinkRaw({
    //     to: getLink(to, routeData?.routesMap),
    //     className: className,
    //     onClick: () => {
    //         if (onClick) {
    //             onClick();
    //         }
    //     },
    //     children: children,
    // });

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
