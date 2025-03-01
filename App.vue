<template>
  <!-- 完全移除 a-layout 相关组件，直接使用 div -->
  <div class="app-container">
    <router-view></router-view>
    
    <!-- 添加设置进度面板 -->
    <setup-progress-panel 
      @verify-domain="handleVerifyDomain"
      @connect-gsc="handleConnectGSC"
      @start-tour="handleStartTour"
    />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  background: #fff;
}

/* 移除所有 Ant Design Layout 相关的默认样式 */
:deep(.ant-layout-sider-trigger) {
  display: none !important;
}

:deep(.ant-layout-sider) {
  display: none !important;
}

:deep(.ant-layout) {
  background: #fff !important;
}
</style>

<script>
import { defineComponent } from 'vue'
import SetupProgressPanel from './components/SetupProgressPanel.vue'

export default defineComponent({
  name: 'App',
  components: {
    SetupProgressPanel
  },
  methods: {
    handleVerifyDomain() {
      // 导航到仪表盘或打开域名验证模态框
      this.$router.push('/dashboard')
    },
    handleConnectGSC() {
      // 处理 GSC 连接（组件中已实现）
      console.log('GSC connection initiated')
    },
    handleStartTour() {
      // 启动应用导览
      this.$emit('open-guide-mode') // 或者使用你的导览系统
    }
  }
});
</script>
