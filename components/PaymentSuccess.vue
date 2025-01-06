<template>
  <div class="success-container">
    <div class="success-card">
      <div class="success-icon">
        <CheckCircleOutlined />
      </div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your subscription. Your account has been activated.</p>
      <a-button type="primary" size="large" @click="goToDashboard">
        Go to Dashboard
      </a-button>
    </div>
  </div>
</template>

<script>
import { CheckCircleOutlined } from '@ant-design/icons-vue';

export default {
  name: 'PaymentSuccess',
  components: {
    CheckCircleOutlined
  },
  methods: {
    goToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.success-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.success-card {
  background: white;
  padding: 48px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 24px;
}

h1 {
  color: #2C5282;
  margin-bottom: 16px;
}

p {
  color: #4A5568;
  margin-bottom: 32px;
}
</style> 