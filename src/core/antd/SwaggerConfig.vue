<template>
  <a-drawer v-model:visible="visable" width="800">
    <a-card no-border>
      <a-form>
        <a-form-item
          label="controller"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            v-model:value="currentTag"
            :options="tags"
            @change="OnChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          label="新增的Api"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-model:value="addModelIndex" @change="addChange">
            <a-select-option
              v-for="(item, index) in apiData"
              :key="index"
              :value="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="更新Api"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select>
            <a-select-option v-for="(item, index) in apiData" :key="index">
              {{ item.name }}
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
                <a-select v-model:value="record.componentType">
                  <a-select-option :value="item.type" v-for="(item,index) in componenList" :key="index">{{item.label}}</a-select-option>
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
import SwaggerService from "@/services/SwaggerService";
import { computed, defineComponent, reactive, toRefs } from "@vue/runtime-core";
import {
  widgetForm,
  WidgetForm,
  rules,
  basicComponents,
  advanceComponents,
} from "@/config/antd";
import { v4 } from "uuid";

interface Tag {
  value: string;
}

interface State {
  tags: Array<Tag>;
  currentTag: string;
  addModelIndex: number;
  apiData: Array<any>;
  formModels?: Array<any>;
}

const componentsTypes: any = {
  string: "input",
  integer: "number",
  boolean: "switch",
};

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
      currentTag: "",
      addModelIndex: -1,
    });
    const visable = computed({
      get: () => props.value,
      set: (value) => {
        ctx.emit("update:value", value);
      },
    });
    const componenList = computed(() => [
      ...basicComponents,
      ...advanceComponents,
    ]);
    const { getApiDoc, getApiMethods } = SwaggerService();
    getApiDoc().then((res) => {
      state.tags = res;
    });
    const OnChange = (tag: string) => {
      const apiData = getApiMethods(tag);
      console.log("：：：：：：：", apiData);
      state.apiData = apiData;
      state.formModels = [];
      state.addModelIndex = -1;
    };
    const addChange = (index: number) => {
      if (state.apiData[index].requestModel) {
        const properties = state.apiData[index].requestModel.properties;
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
    return {
      ...toRefs(state),
      visable,
      componenList,
      OnChange,
      addChange,
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
          const filed = {
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
            key: "",
            model: "",
          };
          filed.label = el.description;
          filed.type = el.componentType;
          filed.options.placeholder = `请输入${el.description}`;
          filed.options.rules.required = el.required;
          filed.key = v4().replaceAll("-", "");
          filed.model = `${el.key}`;
          list.push(JSON.parse(JSON.stringify(filed)));
        }
      });
      this.visable = false;
      formData.list = list;
      this.$emit("ok", formData);
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