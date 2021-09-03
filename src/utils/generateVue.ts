import ejs from "ejs"
import { Rules, widgetForm, WidgetForm } from "@/config/antd"
import { ApiConfig } from "@/config/SwaggerConfig"
import tsData  from "./template/testData.json"


const itemTemplate = `<!-- <%= formElement.label%> Start -->
<a-form-item label="<%= formElement.label %>" name="<%= formElement.model %>">
  <% if(formElement.type==='input' ){ %>
  <a-input v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size"
    <%=formElement.options.width?'style="width:'+formElement.options.width+';"':''%>
    placeholder="<%= element.options.placeholder %>"
    <%= formElement.options.maxlength?' maxlength="'+parseInt(element.options.maxlength)+'"':'' %> 
    <%=formElement.options.prefix??'prefix="'+formElement.options.prefix+'"' %> 
    <%= formElement.options.suffix??' suffix="'+formElement.options.suffix+'"' %> 
    <%= formElement.options.addonBefore?' addon-before="'+formElement.options.addonBefore+'"':'' %> 
    <%= formElement.options.addonAfter?' addon-after="'+formElement.options.addonAfter+'"':'' %> 
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %> 
    <%= formElement.options.readonly?' readonly="'+formElement.options.readonly+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === ' password'){ %>
  <a-input-password v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size" 
    <%=formElement.options.width?'style="width:'+formElement.options.width+';"':''%>
    placeholder="<%= element.options.placeholder %>" 
    <%= formElement.options.maxlength?' maxlength="'+parseInt(element.options.maxlength)+'"':'' %> 
    <%=formElement.options.prefix??'prefix="'+formElement.options.prefix+'"' %>
    <%=formElement.options.prefix??'prefix="'+formElement.options.prefix+'"' %>
    <%= formElement.options.suffix??' suffix="'+formElement.options.suffix+'"' %> 
    <%= formElement.options.addonBefore?' addon-before="'+formElement.options.addonBefore+'"':'' %>
    <%= formElement.options.addonAfter?' addon-after="'+formElement.options.addonAfter+'"':'' %>
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %>
    <%= formElement.options.readonly?' readonly="'+formElement.options.readonly+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
    <%= formElement.options.visibilityToggle?' visibilityToggle="'+formElement.options.visibilityToggle+'"':'' %>
  />
<% } else if(element.type === ' textarea'){ %>
  <a-textarea 
    style="resize: none;<%= formElement.options.width?'width:'+formElement.options.width+';':'' %>" 
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size" 
    <%=formElement.options.rows?'rows="'+formElement.options.rows+'"':'' %> 
    placeholder="<%= element.options.placeholder %>" 
    <%= formElement.options.maxlength?' maxlength="'+parseInt(element.options.maxlength)+'"':'' %> 
    <%= formElement.options.showCount?' showCount="'+formElement.options.showCount+'"':'' %> 
    <%= formElement.options.autoSize?' autoSize="'+formElement.options.autoSize+'"':'' %> 
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %> 
    <%= formElement.options.readonly?' readonly="'+formElement.options.readonly+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === ' number'){ %>
  <a-input-number 
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size" 
    style="width: <%= formElement.options.width %>" 
    <%=formElement.options.max?':max="'+formElement.options.max+'"':'' %> 
    <%= formElement.options.min?' :max="'+formElement.options.min+'"':'' %> 
    <%= formElement.options.readonly?' readonly="'+formElement.options.readonly+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === ' radio'){ %>
  <a-radio-group 
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size" 
    style="width: '<%= formElement.options.width %>'" 
    <%=formElement.options.readonly?'readonly="'+formElement.options.readonly+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %>
  >
    <% let options = element.options.remote? element.options.remoteOptions: element.options.options
      for(let item of options){ 
    %>
      <a-radio 
        key="<%= item.value %>"
        value="<%= item.value %>" 
        style="display:<%= element.options.inline ? ' inline-block' : 'block' %>;">
        <%= element.options.showLabel ? item.label : item.value %>
        </a-radio>
    <%}%>
  </a-radio-group>
<% } else if(element.type==='checkbox' ){ %>
  <a-checkbox-group 
    v-model:value="<%='model.'+formElement.model%>" 
    style="width: <%= formElement.options.width %>;"
    <%=formElement.options.disabled?'disabled="'+formElement.options.disabled+'"':'' %>
  >
    <% let options = element.options.remote? element.options.remoteOptions: element.options.options
      for(let item of options){
    %>
    <a-checkbox 
      key="<%= item.value %>" 
      value="<%= item.value %>" 
      style="display: <%=element.options.inline ? ' inline-block' : 'block' %>;"
      >
        <%= element.options.showLabel ? item.label : item.value %>
    </a-checkbox>
    <%}%>
  </a-checkbox-group>
<% } else if(element.type==='time' ){ %>
  <a-time-picker 
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size"  
    style="width: '<%= formElement.options.width %>'" 
    placeholder="<%= element.options.placeholder %>" 
    <%= formElement.options.readonly?'inputReadOnly="'+formElement.options.readonly+'"':'' %>
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %>
    <%= formElement.options.format?' format="'+formElement.options.format+'"':''%>
    <%= formElement.options.valueFormat?' valueFormat="'+formElement.options.valueFormat+'"':''%>
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === 'date'){ %>
  <a-date-picker
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size"  
    style="width: '<%= formElement.options.width %>'" 
    placeholder="<%= element.options.placeholder %>" 
    <%= formElement.options.readonly?'inputReadOnly="'+formElement.options.readonly+'"':'' %>
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %>
    <%= formElement.options.format?' format="'+formElement.options.format+'"':''%>
    <%= formElement.options.valueFormat?' valueFormat="'+formElement.options.valueFormat+'"':''%>
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === 'rate'){ %>
  <a-rate
    v-model:value="<%='model.'+formElement.model%>" 
    <%= formElement.options.max?':count="'+formElement.options.max+'"':'' %>
    <%= formElement.options.max?':allowHalf="'+formElement.options.allowHalf+'"':'' %> 
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %>
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === 'select'){ %>
  <a-select
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size"  
    style="width: '<%= formElement.options.width %>'"
    <%= formElement.options.mode?'mode="'+formElement.options.mode+'"':'' %>
    placeholder="<%= element.options.placeholder %>" 
    <%= formElement.options.allowClear?' allow-clear="'+formElement.options.allowClear+'"':'' %>
    <%= formElement.options.showSearch?' showSearch="'+formElement.options.showSearch+'"':'' %>
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  >
    <% let options = element.options.remote? element.options.remoteOptions: element.options.options
      for(let item of options){
    %>
    <a-select-option
      key="<%= item.value %>" 
      value="<%= item.value %>"
      label="<%= element.options.showLabel ? item.label : item.value%>"
    >
      <%= element.options.showLabel ? item.label : item.value %>
    </a-select-option>
    <%}%>
  </a-select>
<% } else if(element.type === 'switch'){ %>
  <a-switch
    v-model:value="<%='model.'+formElement.model%>" 
    :size="config.size === 'large' ? 'default' : config.size"
    <%= formElement.options.checkedChildren?' checkedChildren="'+formElement.options.checkedChildren+'"':'' %> 
    <%= formElement.options.unCheckedChildren?' unCheckedChildren="'+formElement.options.unCheckedChildren+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === 'slider'){ %>
  <a-slider
    v-model:value="<%='model.'+formElement.model%>" 
    style="width: '<%= formElement.options.width %>'"
    <%= formElement.options.min?' :min="'+formElement.options.min+'"':'' %> 
    <%= formElement.options.max?' :max="'+formElement.options.max+'"':'' %> 
    <%= formElement.options.step?' :step="'+formElement.options.step+'"':'' %> 
    <%= formElement.options.range?' :range="'+formElement.options.range+'"':'' %> 
    <%= formElement.options.reverse?' reverse="'+formElement.options.reverse+'"':'' %> 
    <%= formElement.options.disabled?' disabled="'+formElement.options.disabled+'"':'' %> 
  />
<% } else if(element.type === 'text'){ %>
  <span><%=  element.options.defaultValue %></span>
<% } %>
</a-form-item>
<!-- <%= formElement.label%> End -->`

const template = `<template>
<a-modal v-model:visable="visable" 
:maskClosable="false">
  <template #footer>
    <a-button key="submit" type="primary" :loading="submitLoading" @click="handleSubmit">提交</a-button>
    <a-button key="reset" @click="resetForm">重置</a-button>
  </template>
  <a-form
  ref="modeRef"
  :model="model"
  :rules="rules"
  :layout="config.layout"
  :labelAlign="config.labelAlign"
  :labelCol="config.labelCol"
  :hideRequiredMark="config.hideRequiredMark"
  >
  <% for (let index in widgetForm.list){ let element = widgetForm.list[index] %><% if(element.type === 'grid'){%><%if(element.key){%>
          <a-row
          type="flex"
          gutter="<%= element.options.gutter ?? 0%>"
          justify="<%= element.options.justify %>"
          align="<%= element.options.align %>"
        >
        <%for(let colIndex in element.columns){ let col = element.columns[colIndex] %>
          <a-col
            key="<%= colIndex %>"
            span="<%= col.span ?? 0 %>"
          >
          <% for(let formElement of col.list){%>${itemTemplate}<%}%>
          </a-col> 
          <%}%>
        </a-row>
        <%}%>   
    <%} else{ let formElement = element%>${itemTemplate}<%}%>      
  <%}%>
  </a-form>
</a-modal>
</template>`

const tsTemplate = `<script lang="ts">
<% let properties = apiConfig.createAction.requestModel.properties %>
import { defineComponent, reactive, toRefs,ref } from 'vue'
import { message } from 'ant-design-vue';
import { <%=apiConfig.createAction.name %><%=apiConfig.enableUpdate ? ',' + apiConfig.updateAction.name : '' %><%=apiConfig.enableDetail ? ',' + apiConfig.detailAction.name : '' %>} from "@/api/<%=apiConfig.controllerData.apiName%>"
interface FormModel {<% for (let key in properties) { %>
  <%='//'+properties[key].description%>
  <%=key %>?:<%= properties[key].type %>,
<%}%>}
const defaultFormModel: FormModel = {
    <% for (let key in properties) { %>
        //<%=properties[key].description%>    
        <%=key %>: undefined,
    <%}%>
}
export default defineComponent({
  setup(props, ctx) {
    const state = reactive({
      config: <%=config%>,
      modelRef:ref(),
      visable:false,
      loading:false,
      submitLoading:false,
      model: ctx.$deepCopy(defaultFormModel),
      <%=rules?'ruels:'+rules:''%>
    });
    /**
    * 新增
    */
    const add = ()=>{
        state.model = ctx.$deepCopy(defaultFormModel)
        state.visable = true
    }
    <%if(apiConfig.enableUpdate){%>
    /**
     * 编辑
     * @model {FormModel} 编辑的内容
     */
    const edit = (model:FormModel)=>{ 
        if(!model.<%= apiConfig.pk%>){
            message.error("编辑数据为空")
            return
        }
        <%if(apiConfig.enableDetail){%>
            formDetail(model.<%=apiConfig.pk%>);
        <%}else{%>
            state.model = Object.assign(model,defaultFormModel);
        <%}%> 
        state.visable = true;   
    }
    <%if (apiConfig.enableDetail) {%>
    /**
     * <%=apiConfig.detailAction.description%>
     */
    const formDetail = async (id:string) => {
        state.loading = true;
        try{
            const apiRes = await <%= apiConfig.detailAction.name %> (id)
            if (apiRes.code == 0) {
                state.model = Object.assign(apiRes.result,defaultFormModel);
            }
        }finally {
            state.loading = false;
        }
    }   
    <%}%><%}%>    
    /**
      * 表单提交
      */
    const handleSubmit = async () => {
        try {
            await state.modelRef.value.validation();
            state.submitLoading = true
                <% if (apiConfig.enableUpdate) { %>
            const apiAciton = state.model.<%=apiConfig.pk%>?<%=apiConfig.updateAction.name %>:<%=apiConfig.createAction.name %>
            <% } else {
                const apiAciton = apiConfig.createAction.name;
            } %>
            await <%=apiConfig.createAction.name %>(state.model);
            ctx.emit('ok')
            closeModal()
        } catch (error) {
            state.submitLoading = false
        }
    }
    /**
     * 重置form 
    */ 
    const resetForm = () => {
        state.modelRef.value.resetFields();
    };
    /**
     * 关闭弹窗 
    */ 
    const closeModal = ()=> {
        state.visable = false
        ctx.emit('close')
    }
    return {
        ...toRefs(state),
        add,
        <%=apiConfig.updateAction?'edit,':''%>
        resetForm,
        handleSubmit,
        closeModal
    }
  }
})
</script>`

// export const testGenerate =()=>{
//   const rules = JSON.stringify(generateRules(tsData))
//   const tsCode =  ejs.render(tsTemplate,{apiConfig:tsData,rules,config:JSON.stringify(tsData.config)})
//   console.log(":::::::::::::::::",removeBlankRow(tsCode))
// }


export const generateData = (widgetForm: WidgetForm, apiConfig: ApiConfig) => {
  console.log(":::::::::::::::::::::apiConfig::::::::::::::",apiConfig)
  const templateCode = ejs.render(template, { widgetForm });
  const rules: any = {};
  const rulesJson = JSON.stringify(generateRules(widgetForm.list,rules))
  const tsCode =  ejs.render(tsTemplate,{apiConfig,rules:rulesJson,config:JSON.stringify(widgetForm.config)})
  return removeBlankRow(templateCode + tsCode);
}


const removeBlankRow = (data: string): string => {
  const reg = /\n(\n)*( )*(\n)*\n/g
  return data.replace(reg, "\n").replaceAll("&#34;", "\"")
}

const generateRules = (itemList:Array<any>,rules:any) => {
  itemList.forEach((element) => {
    if(element.type != 'grid' && element.type != 'text'){
      const optionsRule:Rules = element.options.rules;
      const rule: any = {};
      if (optionsRule.required) {
        rule.required = true;
      }
      if (optionsRule.pattern) {
        rule.pattern = optionsRule.pattern
      }
      if (optionsRule.enum) {
        rule.enmu = optionsRule.enum
      }
      if(optionsRule.len){
        rule.len = optionsRule.len
      }
      if(optionsRule.max){
        rule.max = optionsRule.max
      }
      if(optionsRule.len)
      if (optionsRule.type != 'any') {
        rule.type = optionsRule.type;
      }
      if(optionsRule.min){
        rule.min = optionsRule.min
      }
      if (Object.keys(rule).length) {
        rule.trigger = optionsRule.trigger
        rule.message = optionsRule.message
        rules[element.model] = rule
      }
    }else if(element.type=='grid' && element.columns.length){
        element.columns.forEach((col:any) => {
          if(col.list && col.list.length){
            generateRules(col.list,rules)  
          }
        });
    }
    
  })
  return rules;
}