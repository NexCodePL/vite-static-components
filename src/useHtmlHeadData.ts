import { useEffect } from "react";
import { RouteDataContextContextType, useRouteData } from "./routeDataContext.js";
import { HtmlHeadMeta } from "@nexcodepl/vite-static";

export function useHtmlHeadData(context: RouteDataContextContextType) {
    const routeData = useRouteData(context);

    const htmlData = routeData.routeData?.htmlData;

    useEffect(() => {
        if (document === undefined) return;

        if (!htmlData) return;

        if (htmlData.lang) setLang(htmlData.lang);
        if (htmlData.head?.title) document.title = htmlData.head.title;

        for (const meta of htmlData.head?.meta ?? []) {
            setMeta(meta);
        }
    }, [htmlData]);
}

function setLang(lang: string) {
    const html = document.getElementsByTagName("html")[0];
    if (!html) return;

    html.lang = lang;
}

function setMeta(meta: HtmlHeadMeta) {
    try {
        const head = document.getElementsByTagName("head")[0];
        if (!head || !head.children) return;
        const headElements = Array.from(head.children);
        const metaElements = headElements.filter(isMeta);

        if (meta.name) {
            const matchingElement = metaElements.find(e => e.getAttribute("name") === meta.name);
            if (matchingElement) {
                replaceMetaValues(matchingElement, meta);

                return;
            }
        }

        const newMetaElement = document.createElement("meta");
        replaceMetaValues(newMetaElement, meta);
        head.appendChild(newMetaElement);
    } catch (e) {
        console.log("Cannot set meta tag");
        console.log(e);
    }
}

function isMeta(element: unknown): element is HTMLMetaElement {
    if (!element) return false;
    if (!(element instanceof HTMLMetaElement)) return false;

    return true;
}

function replaceMetaValues(metaElement: HTMLMetaElement, meta: HtmlHeadMeta) {
    if (meta.name) metaElement.setAttribute("name", meta.name);
    if (meta.content) metaElement.setAttribute("content", meta.content);
    if (meta.charset) metaElement.setAttribute("charset", meta.charset);
    if (meta.httpEquiv) metaElement.setAttribute("http-equic", meta.httpEquiv);
    if (meta.property) metaElement.setAttribute("property", meta.property);
}
