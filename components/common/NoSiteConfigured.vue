<template>
  <div class="domain-notice">
    <div class="notice-content">
      <exclamation-circle-outlined class="notice-icon" />
      <h2>Domain Verification Required</h2>
      <p class="main-text">To unlock all features, please verify your domain ownership</p>
      <p class="sub-text">Domain verification helps ensure secure and authorized access to advanced functionality</p>
      <a-button type="primary" @click="goToDashboard">
        Verify Domain
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
  font-size: 48px !important;
  color: #faad14;
  margin-bottom: 24px;
}

.notice-content h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-weight: 600;
}

.main-text {
  font-size: 18px;
  color: #374151;
  margin-bottom: 12px;
}

.sub-text {
  font-size: 14px;
  color: #6B7280;
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