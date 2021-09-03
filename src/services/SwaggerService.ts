import { getAction } from "@/utils/request";

import { reactive } from "vue"


interface Tag {
    name: string
}

interface State {
    apiTags: Array<string>,
    apiMethods: any,
    apiModels: any,
}

const methodKeys: Array<string> = ['get', 'post', 'put', 'delete']

export default function SwaggerService() {
    const state: State = reactive({
        apiTags: [],
        apiMethods: null,
        apiModels: null
    })
    const getApiDoc = async () => {
        const { data } = await getAction({
            url: "system/v3/api-docs",
            method: "GET"
        })
        const apiTags = data.tags;
        state.apiMethods = data.paths
        state.apiModels = data.components.schemas
        return apiTags;
    }
    const getApiMethods = (currentTag: string): Array<any> => {
        const res: Array<any> = [];
        Object.keys(state.apiMethods).forEach(key => {
            const el: any = state.apiMethods[key]
            methodKeys.forEach(m => {
                if (el[m]?.tags.includes(currentTag)) {
                    const aciton = el[m];
                    let requestModel;
                    let responseModel;
                    if (aciton.requestBody && aciton.requestBody.content) {
                        const qoModelArray = aciton.requestBody.content["application/json"].schema.$ref.split("/");
                        const qoMdelName = qoModelArray[qoModelArray.length - 1]
                        requestModel = state.apiModels[qoMdelName];
                    }
                    if (aciton.responses[200].content && aciton.responses[200].content['*/*'].schema.$ref) {
                        const voModelArray = aciton.responses[200].content['*/*'].schema.$ref.split("/");
                        const voModelName = voModelArray[voModelArray.length - 1]
                        responseModel = state.apiModels[voModelName]
                    }

                    const item = {
                        name: aciton.operationId,
                        description: aciton.description,
                        method: m,
                        path: key,
                        requestModel,
                        responseModel,
                    }
                    res.push(item)
                }
            })
        });
        return res;
    }
    return {
        getApiDoc,
        getApiMethods
    }
}