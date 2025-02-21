import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import router from './router';

import 'ant-design-vue/dist/reset.css';
import './assets/styles/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'

// 创建 Vue 应用实例
const app = createApp(App);

app.use(Antd)
   .use(router)
   .mount('#app');
