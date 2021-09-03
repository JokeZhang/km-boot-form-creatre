<template>
  <a-drawer v-model:visible="visable" width="1024">
    <a-card no-border>
      <a-form>
        <a-form-item
          label="controller"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-model:value="currentTagIndex" @change="OnChange">
            <a-select-option :value="-1" disabled>选择模块</a-select-option>
            <a-select-option
              v-for="(tag, index) in tags"
              :key="index"
              :value="index"
              >{{ tag.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          label="新增的Api"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-model:value="addModelIndex" @change="addChange">
            <a-select-option :value="-1" disabled>选择新增接口</a-select-option>
            <a-select-option
              v-for="(item, index) in apiData"
              :key="index"
              :value="index"
            >
              {{ item.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="其它相关"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-checkbox v-model:checked="apiConfig.enableUpdate"
            >更新功能</a-checkbox
          >
          <a-checkbox v-model:checked="apiConfig.enableDetial"
            >表单详情</a-checkbox
          >
        </a-form-item>
        <a-form-item
          label="更新Api"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          v-if="apiConfig.enableUpdate"
        >
          <a-select v-model:value="updateModelIndex" @change="onUpdateChange">
            <a-select-option :value="-1" disabled>选择更新接口</a-select-option>
            <a-select-option
              v-for="(item, index) in apiData"
              :key="index"
              :value="index"
            >
              {{ item.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="详情Api"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          v-if="apiConfig.enableDetial"
        >
          <a-select v-model:value="detailModelIndex" @change="onDetailChange">
            <a-select-option :value="-1" disabled>选择详情接口</a-select-option>
            <a-select-option v-for="(item, index) in apiData" :key="index">
              {{ item.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-divider>表单字段</a-divider>
        <a-card>
          <a-table
            :dataSource="formModels"
            size="small"
            :pagination="{ pageSize: 100 }"
            :scroll="{ y: 340 }"
            :rowSelection="{
              columnTitle: '主键',
              type: 'radio',
              onSelect,
            }"
          >
            <a-table-column
              key="description"
              title="字段名称"
              data-index="description"
            >
              <template #default="{ record }">
                <a-input v-model:value="record.description"></a-input>
              </template>
            </a-table-column>
            <a-table-column key="key" title="字段" data-index="key">
              <template #default="{ record }">
                <a-checkbox v-model:checked="record.show"></a-checkbox>
                {{ record.key }}
              </template>
            </a-table-column>
            <a-table-column title="必填" key="require">
              <template #default="{ record }">
                <a-checkbox v-model:checked="record.required"></a-checkbox>
              </template>
            </a-table-column>
            <a-table-column key="description" title="类型" data-index="type">
              <template #default="{ record }">
                <a-select
                  v-model:value="record.componentType"
                  style="width: 100%"
                >
                  <a-select-option
                    :value="item.type"
                    v-for="(item, index) in componenList"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
        <a-form-item>
          <a-button type="primary" @click="handleGenerator">生成</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-drawer>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import SwaggerService from "@/services/SwaggerService";
import { computed, defineComponent, reactive, toRefs } from "@vue/runtime-core";
import { ApiConfig, SwaggerTag } from "@/config/SwaggerConfig";
import {
  widgetForm,
  WidgetForm,
  rules,
  basicComponents,
  advanceComponents,
} from "@/config/antd";
import { v4 } from "uuid";

declare interface State {
  tags: Array<SwaggerTag>;
  currentTagIndex: number;
  addModelIndex: number;
  updateModelIndex: number;
  detailModelIndex: number;
  apiData: Array<any>;
  formModels?: Array<any>;
  apiConfig: ApiConfig;
}

const componentsTypes: any = {
  string: "input",
  integer: "number",
  boolean: "switch",
};

const { getApiDoc, getApiMethods } = SwaggerService();

export default defineComponent({
  name: "SwaggerConfig",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const state: State = reactive({
      tags: [],
      apiData: [],
      formModels: [],
      currentTagIndex: -1,
      addModelIndex: -1,
      updateModelIndex: -1,
      detailModelIndex: -1,
      apiConfig: {
        enableUpdate: false,
        enableDetial: false,
        createAction: null,
        updateAction: null,
        detailAction: "",
        controllerData: undefined,
        pk: "",
        modelEntity: null,
      },
    });
    /**
     * 组件显示
     */
    const visable = computed({
      get: () => props.value,
      set: (value) => {
        ctx.emit("update:value", value);
      },
    });
    /**
     * 所有组件
     */
    const componenList = computed(() => [
      ...basicComponents,
      ...advanceComponents,
    ]);
    /**
     * 接口数据初始化
     */
    getApiDoc().then((res) => {
      state.tags = res;
    });
    /**
     * 模块变更时候
     */
    const OnChange = (index: number) => {
      const tagName = state.tags[index].name;
      const apiData = getApiMethods(tagName);
      state.apiData = apiData;
      state.apiConfig.controllerData = state.tags[index];
      state.apiConfig.controllerData.apiName =
        state.apiConfig.controllerData.description
          .replace("Controller", "Api")
          .replace(" ", "");
      state.apiConfig.updateAction = undefined;
      state.apiConfig.detailAction = undefined;
      state.apiConfig.enableUpdate = false;
      state.apiConfig.enableDetial = false;
      state.formModels = [];
      state.addModelIndex = -1;
      state.updateModelIndex = -1;
    };
    /**
     * 新增接口选择
     */
    const addChange = (index: number) => {
      state.apiConfig.createAction = state.apiData[index];
      if (state.apiData[index].requestModel) {
        const properties = state.apiConfig.createAction.requestModel.properties;
        const modelFields = [];
        for (let key in properties) {
          const row = properties[key];
          let componentType;
          if (row.format) {
            if (row.format.indexOf("date") > -1) {
              componentType = "date";
            } else if (row.format.indexOf("int") > -1) {
              componentType = "number";
            }
          } else {
            componentType = componentsTypes[row.type];
          }
          const item = {
            key,
            ...properties[key],
            required: false,
            componentType,
            show: true,
          };
          modelFields.push(item);
        }
        state.formModels = modelFields;
      }
    };
    /**
     * 更新接口选择时候
     */
    const onUpdateChange = (index: number) => {
      state.apiConfig.updateAction = state.apiData[index];
    };
    /**
     * 详情接口选择时候
     */
    const onDetailChange = (index: number) => {
      state.apiConfig.detailAction = state.apiData[index];
    };
    /**
     * 主键选择时候
     */
    const onSelect = (record: any) => {
      state.apiConfig.pk = record.key;
    };
    return {
      ...toRefs(state),
      visable,
      componenList,
      OnChange,
      addChange,
      onUpdateChange,
      onDetailChange,
      onSelect,
    };
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
  },
  methods: {
    handleGenerator() {
      const formData: WidgetForm = Object.assign({}, widgetForm);
      const list: any = [];
      this.formModels?.forEach((el) => {
        if (el.show) {
          const filed = this.findComponent(el.componentType);
          filed.label = el.description;
          filed.type = el.componentType;
          filed.options.placeholder = `请输入${el.description}`;
          if (filed.options.rules) {
            filed.options.rules.required = el.required;
          }
          filed.key = v4().replaceAll("-", "");
          filed.model = `${el.key}`;
          list.push(JSON.parse(JSON.stringify(filed)));
        }
      });
      this.visable = false;
      formData.list = list;
      this.$emit("ok", {
        widgetForm: formData,
        apiConfig: this.apiConfig,
      });
    },
    findComponent(type: string) {
      const data = this.componenList.find((el) => el.type == type);
      return {
        ...(data
          ? data
          : {
              label: "单行文本",
              type: "input",
              options: {
                width: "100%",
                defaultValue: "",
                placeholder: "",
                maxlength: null,
                prefix: "",
                suffix: "",
                addonBefore: "",
                addonAfter: "",
                disabled: false,
                allowClear: false,
                readonly: false,
                rules,
              },
            }),
        key: "",
        model: "",
      };
    },
  },
});
</script>

<style scoped lang="less">
.btn {
  cursor: pointer;
  user-select: none;
  width: 100%;
  height: 100%;
}
</style>