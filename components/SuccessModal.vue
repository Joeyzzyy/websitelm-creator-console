<template>
  <a-modal
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :footer="null"
    :closable="false"
    :maskClosable="true"
    :width="400"
    class="success-modal"
    @after-close="$emit('close')"
  >
    <div class="success-content">
      <div class="confetti-container">
        <div v-for="n in 50" :key="n" class="confetti" :style="getConfettiStyle()"></div>
      </div>
      <div class="success-icon">🎉</div>
      <h2>Welcome Aboard!</h2>
      <p>Your product has been successfully set up. Let's start creating amazing content!</p>
      <a-button type="primary" @click="handleClose">Get Started</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    getConfettiStyle() {
      const colors = ['#1890ff', '#1890ff', '#EC4899', '#8B5CF6', '#6366F1']
      return {
        '--fall-duration': `${Math.random() * 3 + 2}s`,
        '--fall-delay': `${Math.random() * 2}s`,
        '--x-end': `${Math.random() * 300 - 150}px`,
        '--confetti-color': colors[Math.floor(Math.random() * colors.length)]
      }
    }
  }
}
</script>

<style scoped>
.success-modal {
  :deep(.ant-modal-content) {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
  }
}

.success-content {
  text-align: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 1s ease infinite;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--confetti-color);
  opacity: 0;
  animation: fall var(--fall-duration) var(--fall-delay) linear forwards;
}

h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1890ff 0%, #1890ff 50%, #EC4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

p {
  color: #666;
  margin-bottom: 24px;
}

.ant-btn-primary {
  background: linear-gradient(135deg, #1890ff, #1890ff);
  border: none;
  height: 40px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fall {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--x-end), 100vh, 0) rotate(360deg);
  }
}
</style> 