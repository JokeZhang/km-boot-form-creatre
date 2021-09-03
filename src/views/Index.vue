<template>
  <a-button @click="add()">xxxxxxxxxxx</a-button>
  <a-modal v-model:visible="visable" :maskClosable="false">
    <template #footer>
      <a-button
        key="submit"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
        >提交</a-button
      >
      <a-button key="reset" @click="resetForm">重置</a-button>
    </template>
    <a-form
      ref="modelRef"
      :model="model"
      :rules="rules"
      :layout="config.layout"
      :labelAlign="config.labelAlign"
      :labelCol="config.labelCol"
      :hideRequiredMark="config.hideRequiredMark"
    >
      <!-- 描述 Start -->
      <a-form-item label="描述" name="description">
        <a-input
          v-model:value="model.description"
          :size="config.size"
          style="width: 100%"
          placeholder="请输入描述"
        />
      </a-form-item>
      <!-- 描述 End -->
      <!-- 字典编码 Start -->
      <a-form-item label="字典编码" name="dictCode">
        <a-input
          v-model:value="model.dictCode"
          :size="config.size"
          style="width: 100%"
          placeholder="请输入字典编码"
        />
      </a-form-item>
      <!-- 字典编码 End -->
      <!-- 字典名称 Start -->
      <a-form-item label="字典名称" name="dictName">
        <a-input
          v-model:value="model.dictName"
          :size="config.size"
          style="width: 100%"
          placeholder="请输入字典名称"
        />
      </a-form-item>
      <!-- 字典名称 End -->
    </a-form>
  </a-modal>
</template><script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  getCurrentInstance,
  UnwrapRef,
} from "vue";
import { message } from "ant-design-vue";
import { dictAddUsingPOST } from "@/api/DictApi";
interface FormModel {
  //描述
  description?: string;
  //字典编码
  dictCode?: string;
  //字典名称
  dictName?: string;
  //undefined
  id?: string;
  //字典类型0为string,1为number
  type?: number;
}
const defaultFormModel: FormModel = {
  //描述
  description: undefined,
  //字典编码
  dictCode: undefined,
  //字典名称
  dictName: undefined,
  //
  id: undefined,
  //字典类型0为string,1为number
  type: undefined,
};
export default defineComponent({
  setup(props, ctx) {
    const _this = getCurrentInstance()?.appContext.config.globalProperties;
    let model: UnwrapRef<FormModel> = reactive({});
    const state = reactive({
      config: {
        size: "default",
        hideRequiredMark: false,
        layout: "horizontal",
        labelAlign: "right",
        labelCol: { span: 3, offset: 0 },
      },
      modelRef: ref(),
      visable: false,
      loading: false,
      submitLoading: false,
      rules: {
        description: { required: true, trigger: "blur", message: "" },
        dictCode: { required: true, trigger: "blur", message: "" },
        dictName: { required: true, trigger: "blur", message: "" },
      },
    });
    /**
     * 新增
     */
    const add = () => {
      model = reactive(defaultFormModel);
      state.visable = true;
    };
    /**
     * 表单提交
     */
    const handleSubmit = async () => {
      try {
        await state.modelRef.validate();
        state.submitLoading = true;
        await dictAddUsingPOST(model);
        ctx.emit("ok");
        closeModal();
      } catch (error) {
        console.log(error);
        state.submitLoading = false;
      }
    };
    /**
     * 重置form
     */
    const resetForm = () => {
      state.modelRef.resetFields();
    };
    /**
     * 关闭弹窗
     */
    const closeModal = () => {
      state.visable = false;
      ctx.emit("close");
    };
    return {
      ...toRefs(state),
      model,
      add,
      resetForm,
      handleSubmit,
      closeModal,
    };
  },
  methods: {
    tes() {
      this.$deepCopy({});
    },
  },
});
</script>