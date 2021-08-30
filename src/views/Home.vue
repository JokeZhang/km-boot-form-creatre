<template>
    <AntdDesignForm />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AntdDesignForm from "@/core/antd/AntdDesignForm.vue"
import "@/less/index.less"
@Options({
  components:{AntdDesignForm}
})
export default class Home extends Vue {}
</script>
