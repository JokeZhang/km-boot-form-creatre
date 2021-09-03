import { ComponentCustomProperties,SetupContext } from 'vue'
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $deepCopy: (data: any) => any
    }
    export interface SetupContext {
        $deepCopy: (data: any) => any
    }
}