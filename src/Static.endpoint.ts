import { EndpointDefinition } from "@nexcodepl/endpoint-types";

interface EndpointStaticDataParams {
    dataId: string;
}

export const EndpointStaticData: EndpointDefinition<EndpointStaticDataParams, undefined, string, false> = {
    url: "/static/:dataId.json",
    method: "GET",
    secure: false,
};
