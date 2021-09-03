import { createApp } from 'vue'
import Antd from "ant-design-vue"
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import Icons from '@/icons'
Icons.install()
const app = createApp(App)
app.use(store)
app.use(router)
app.use(Antd)
app.config.globalProperties.$deepCopy = (data: any): any => JSON.parse(JSON.stringify(data))
app.mount('#app')

