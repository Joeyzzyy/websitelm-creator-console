<template>
  <transition name="panel">
    <div class="setup-progress-panel" v-if="shouldShowPanel && isPanelReady">
      <div class="panel-header">
        <div class="panel-title">
          <CheckCircleOutlined v-if="allStepsCompleted" />
          <ClockCircleOutlined v-else />
          Setup Progress
        </div>
        <div class="progress-status">
          {{ completedSteps }}/3
        </div>
      </div>
      
      <div class="progress-steps">
        <!-- Domain Verification -->
        <div 
          class="progress-step"
          :class="{ 'completed': isDomainVerified }"
        >
          <div 
            class="step-icon"
            :class="isDomainVerified ? 'completed' : 'pending'"
          >
            <GlobalOutlined />
          </div>
          <div class="step-content">
            <div class="step-title">Verify Domain</div>
            <div class="step-desc">Enable automatic sitemap</div>
          </div>
          <div class="step-action">
            <template v-if="!isDomainVerified">
              <a-button 
                type="link" 
                size="small"
                @click="handleVerifyDomain"
                :loading="loading.verifyDomain"
              >
                Start
              </a-button>
            </template>
            <template v-else>
              <CheckCircleOutlined style="color: #52c41a" />
            </template>
          </div>
        </div>

        <!-- GSC Connection -->
        <div 
          class="progress-step"
          :class="{ 'completed': isGscConnected }"
        >
          <div 
            class="step-icon"
            :class="isGscConnected ? 'completed' : 'pending'"
          >
            <GoogleOutlined />
          </div>
          <div class="step-content">
            <div class="step-title">Connect GSC</div>
            <div class="step-desc">Track performance</div>
          </div>
          <div class="step-action">
            <a-button 
              type="link" 
              size="small"
              @click="handleConnectGSC"
              v-if="!isGscConnected"
              :loading="loading.connectGSC"
            >
              Connect
            </a-button>
            <CheckCircleOutlined v-else style="color: #52c41a" />
          </div>
        </div>

        <!-- Feature Tour -->
        <div 
          class="progress-step"
          :class="{ 'completed': hasTourCompleted }"  
        >
          <div 
            class="step-icon"
            :class="hasTourCompleted ? 'completed' : 'pending'"
          >
            <CompassOutlined />
          </div>
          <div class="step-content">
            <div class="step-title">Take a Tour</div>
            <div class="step-desc">Learn key features</div>
          </div>
          <div class="step-action">
            <a-button 
              type="link" 
              size="small"
              @click="handleStartTour"
              v-if="!hasTourCompleted"
              :loading="loading.startTour"
            >
              Start
            </a-button>
            <CheckCircleOutlined v-else style="color: #52c41a" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  GoogleOutlined,
  CompassOutlined
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'SetupProgressPanel',
  components: {
    CheckCircleOutlined,
    ClockCircleOutlined,
    GlobalOutlined,
    GoogleOutlined,
    CompassOutlined
  },
  props: {
    // Allow parent to hide the panel if needed
    forceHide: {
      type: Boolean,
      default: false
    }
  },
  emits: ['verify-domain', 'connect-gsc', 'start-tour'],
  setup(props, { emit }) {
    const router = useRouter()
    const productInfo = ref(null)
    const isGscConnected = ref(false)
    const isPanelReady = ref(false)
    const loading = ref({
      verifyDomain: false,
      connectGSC: false,
      startTour: false
    })
    
    // Computed properties
    const isDomainVerified = computed(() => productInfo.value?.domainStatus || false)
    const hasTourCompleted = computed(() => productInfo.value?.onboarding || false)
    
    const completedSteps = computed(() => {
      if (!productInfo.value) return 0
      
      let completed = 0
      if (isDomainVerified.value) completed++
      if (isGscConnected.value) completed++
      if (hasTourCompleted.value) completed++
      return completed
    })
    
    const allStepsCompleted = computed(() => completedSteps.value === 3)
    
    const shouldShowPanel = computed(() => {
      return (
        !props.forceHide &&
        productInfo.value && 
        !allStepsCompleted.value && 
        isPanelReady.value
      )
    })
    
    // Methods
    const loadProductInfo = async () => {
      try {
        const response = await apiClient.getProductsByCustomerId()
        
        if (response?.code === 200 && response.data) {
          productInfo.value = response.data
          await checkGscStatus()
          isPanelReady.value = true
        }
      } catch (error) {
        console.error('Failed to load product info:', error)
      }
    }
    
    const checkGscStatus = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.checkGscAuth(customerId)
        
        isGscConnected.value = response?.code === 200
      } catch (error) {
        console.error('Failed to check GSC status:', error)
        isGscConnected.value = false
      }
    }
    
    // Event handlers
    const handleVerifyDomain = async () => {
      loading.value.verifyDomain = true
      try {
        emit('verify-domain')
        // Navigate to dashboard if we're not already there
        if (router.currentRoute.value.path !== '/dashboard') {
          router.push('/dashboard')
        }
      } finally {
        loading.value.verifyDomain = false
      }
    }
    
    const handleConnectGSC = async () => {
      loading.value.connectGSC = true
      try {
        emit('connect-gsc')
        
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.gscAuth(customerId)
        
        if (response?.code === 200 && response.redirectURL) {
          const width = 600
          const height = 600
          const left = (window.screen.width / 2) - (width / 2)
          const top = (window.screen.height / 2) - (height / 2)
          
          window.open(
            response.redirectURL,
            'Google Auth',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
          )
        }
      } catch (error) {
        message.error('Failed to connect to Google Search Console')
      } finally {
        loading.value.connectGSC = false
      }
    }
    
    const handleStartTour = () => {
      loading.value.startTour = true
      try {
        emit('start-tour')
      } finally {
        loading.value.startTour = false
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      loadProductInfo()
      
      // Set up polling for GSC status
      const interval = setInterval(checkGscStatus, 60000) // Check every minute
      
      // Clean up interval on component unmount
      return () => {
        clearInterval(interval)
      }
    })
    
    // Watch for changes in route to refresh data
    watch(() => router.currentRoute.value.path, () => {
      loadProductInfo()
    })
    
    return {
      productInfo,
      isGscConnected,
      isDomainVerified,
      hasTourCompleted,
      completedSteps,
      allStepsCompleted,
      shouldShowPanel,
      isPanelReady,
      loading,
      handleVerifyDomain,
      handleConnectGSC,
      handleStartTour
    }
  }
})
</script>

<style scoped>
/* Setup Progress Panel Styles */
.setup-progress-panel {
  position: fixed;
  bottom: 24px;
  right: 88px; /* 给Intercom或其他小部件留出空间 */
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
              0 0 0 1px rgba(24, 144, 255, 0.1),
              0 0 20px rgba(24, 144, 255, 0.2);
  padding: 16px;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: pulse 2s infinite;
}

.setup-progress-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(24, 144, 255, 0.2),
              0 0 30px rgba(24, 144, 255, 0.3);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
}

.panel-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #262626;
}

.progress-status {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4px 12px;
  border-radius: 12px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-step {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s;
  gap: 12px;
}

.progress-step:hover {
  background: #f0f7ff;
}

.progress-step.completed {
  background: #f6ffed;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.step-icon.completed {
  color: #52c41a;
  background: #f6ffed;
}

.step-icon.pending {
  color: #1890ff;
  background: #e6f7ff;
  position: relative;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 2px;
}

.step-desc {
  font-size: 12px;
  color: #8c8c8c;
}

.step-action {
  margin-left: auto;
}

/* Animation for panel entrance/exit */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Pulse animation */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
                0 0 0 1px rgba(24, 144, 255, 0.1),
                0 0 20px rgba(24, 144, 255, 0.2);
  }
  50% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
                0 0 0 1px rgba(24, 144, 255, 0.2),
                0 0 30px rgba(24, 144, 255, 0.4);
  }
  100% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
                0 0 0 1px rgba(24, 144, 255, 0.1),
                0 0 20px rgba(24, 144, 255, 0.2);
  }
}

/* Shine effect for incomplete steps */
.progress-step:not(.completed) {
  position: relative;
  overflow: hidden;
}

.progress-step:not(.completed)::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 200%;
  }
  100% {
    left: 200%;
  }
}

/* Glow effect for pending icons */
.step-icon.pending::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1890ff, #69c0ff);
  opacity: 0.2;
  z-index: -1;
  animation: iconGlow 2s infinite;
}

@keyframes iconGlow {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}

/* 添加初始显示时的动画 */
.setup-progress-panel {
  animation: panelAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1), pulse 2s infinite;
}

@keyframes panelAppear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 