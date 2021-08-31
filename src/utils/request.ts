import Axios, { AxiosResponse, Method } from "axios";

export interface RequestData {
    url: string,
    method: Method,
    data?: any,
    params?: any,
}

export const getAction = (options: RequestData): Promise<AxiosResponse> => {
    const instance = Axios.create();
    return instance(options);

}