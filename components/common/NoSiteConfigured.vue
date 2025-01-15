<template>
  <div class="domain-notice">
    <div class="notice-content">
      <exclamation-circle-outlined class="notice-icon" />
      <h2>No Site Configured</h2>
      <p>Please add and verify your site first</p>
      <a-button type="primary" @click="goToDashboard">
        Configure Domain
      </a-button>
    </div>
  </div>
</template>

<script>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NoSiteConfigured',
  components: {
    ExclamationCircleOutlined
  },
  setup() {
    const router = useRouter()
    
    const goToDashboard = () => {
      router.push('/dashboard')
    }

    return {
      goToDashboard
    }
  }
}
</script>

<style scoped>
.domain-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background: #fff;
  border-radius: 16px;
}

.notice-content {
  text-align: center;
  padding: 40px;
}

.notice-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 24px;
}

.notice-content h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.notice-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.notice-content :deep(.ant-btn) {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  height: 40px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 20px;
}

.notice-content :deep(.ant-btn:hover) {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}
</style> 