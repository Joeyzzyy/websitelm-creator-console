<template>
  <a-modal
    v-model:visible="visible"
    title="Welcome to WebsiteLM!"
    :footer="null"
  >
    <div class="success-content">
      <div class="success-icon">🎉</div>
      <p>Your product has been set up successfully. Here are the next steps:</p>
      
      <div class="todo-list">
        <div class="todo-item">
          <div class="todo-info">
            <span class="todo-title">1. Verify Your Domain</span>
            <span class="todo-desc">Enable automatic sitemap and content fetching</span>
          </div>
          <a-button type="primary" @click="$emit('verifyDomain')">
            Start Verify
          </a-button>
        </div>

        <div class="todo-item">
          <div class="todo-info">
            <span class="todo-title">2. Connect Google Search Console</span>
            <span class="todo-desc">Track your website performance</span>
          </div>
          <a-button type="primary" @click="$emit('connectGSC')">
            Connect Now
          </a-button>
        </div>

        <div class="todo-item">
          <div class="todo-info">
            <span class="todo-title">3. Explore Features</span>
            <span class="todo-desc">Learn about all available features</span>
          </div>
          <a-button type="primary" @click="$emit('exploreTour')">
            Start Tour
          </a-button>
        </div>
      </div>

      <div class="skip-action">
        <a-button @click="$emit('close')">Skip for now</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'SuccessModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'verifyDomain', 'connectGSC', 'exploreTour', 'close']
}
</script> 