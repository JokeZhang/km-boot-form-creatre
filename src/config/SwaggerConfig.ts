import { WidgetForm } from "./antd";

export interface SwaggerTag {
    name: string;
    description: string;
    apiName?:string
}

export interface ApiConfig {
    pk: string;
    createAction: any;
    updateAction?: any;
    detailAction?: any;
    enableUpdate: boolean;
    enableDetial: boolean;
    controllerData?: SwaggerTag;
}

export interface SwaggerConfig {
    widgetForm: WidgetForm,
    apiConfig: ApiConfig
}
