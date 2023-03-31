import { RouteObject } from 'react-router-dom';

export function isRouteObject(e: RouteObject | null): e is RouteObject {
    if (e === null) return false;
    return true;
}
