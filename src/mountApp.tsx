/// <reference types="vite/client" />

import React from "react";
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";
import { StaticRouter } from "react-router-dom/server.js";
import { BrowserRouter } from "react-router-dom";

import {
    staticDataContext,
    StaticDataContext,
    serverStaticDataContext,
    StaticDataStorage,
} from "./staticDataContext.js";

export function mountApp(App: JSX.Element, disableStrictMode?: boolean) {
    if (import.meta.env.MODE === "development") {
        ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
            disableStrictMode ? (
                <StaticDataContext.Provider value={staticDataContext()}>
                    <BrowserRouter>{App}</BrowserRouter>
                </StaticDataContext.Provider>
            ) : (
                <React.StrictMode>
                    <StaticDataContext.Provider value={staticDataContext()}>
                        <BrowserRouter>{App}</BrowserRouter>
                    </StaticDataContext.Provider>
                </React.StrictMode>
            )
        );
    } else {
        ReactDOM.hydrateRoot(
            document.getElementById("root") as HTMLElement,
            disableStrictMode ? (
                <StaticDataContext.Provider value={staticDataContext()}>
                    <BrowserRouter>{App}</BrowserRouter>
                </StaticDataContext.Provider>
            ) : (
                <React.StrictMode>
                    <StaticDataContext.Provider value={staticDataContext()}>
                        <BrowserRouter>{App}</BrowserRouter>
                    </StaticDataContext.Provider>
                </React.StrictMode>
            )
        );
    }
}

export function getServerRenderFunction(App: JSX.Element) {
    return (url: string, staticData: StaticDataStorage) => {
        return ReactDOMServer.renderToString(
            <StaticDataContext.Provider value={serverStaticDataContext(staticData)}>
                <StaticRouter location={url}>{App}</StaticRouter>
            </StaticDataContext.Provider>
        );
    };
}
