import { useStaticDataContext } from "./staticDataContext.js";

export function useStaticData(staticDataId: string) {
    const staticData = useStaticDataContext();

    return staticData.getData<string>(staticDataId);
}
