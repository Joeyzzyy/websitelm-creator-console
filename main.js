import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import router from './router';

// 确保 Tailwind 最后加载
import 'ant-design-vue/dist/reset.css';
import './assets/styles/tailwind.css'

createApp(App)
  .use(Antd)
  .use(router)
  .mount('#app');
