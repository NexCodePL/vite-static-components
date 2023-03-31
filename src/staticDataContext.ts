import { createContext, useContext } from "react";

declare global {
    interface Window {
        staticData?: StaticDataStorage;
    }
}

export type StaticDataType = object | undefined | null | string;
export type StaticDataStorage = { [key: string]: StaticDataType };

type GetDataFunction = <T extends StaticDataType>(dataId: string) => T | null;
type SetDataFunction = <T extends StaticDataType>(dataId: string, data: T) => void;

export interface StaticDataContextType {
    setData: SetDataFunction;
    getData: GetDataFunction;
}

export function staticDataContext(): StaticDataContextType {
    return {
        getData: dataId => {
            if (!window.staticData) return null;

            return window.staticData[dataId] as any;
        },
        setData: (dataId, data) => {
            if (!window.staticData) window.staticData = {};
            window.staticData[dataId] = data;
        },
    };
}

export function serverStaticDataContext(initData: StaticDataStorage): StaticDataContextType {
    const dataStorage: StaticDataStorage = initData;

    return {
        getData: dataId => {
            return (dataStorage[dataId] as any) ?? null;
        },
        setData: (dataId, data) => {
            dataStorage[dataId] = data;
        },
    };
}

export const StaticDataContext = createContext<StaticDataContextType>(staticDataContext());

export function useStaticDataContext() {
    const context = useContext(StaticDataContext);

    return context;
}
