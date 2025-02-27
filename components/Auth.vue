<template>
  <div class="auth-container">
    <div class="auth-loader">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import api from '../api/api';

export default {
  name: 'Auth',
  data() {
    return {
      message: '认证中，请稍候...'
    };
  },
  created() {
    this.processToken();
  },
  methods: {
    processToken() {
      // 从 URL 获取 token
      const token = this.$route.query.token;
      const customerId = this.$route.query.customerId;
      
      if (!token) {
        this.message = '未找到有效的认证信息';
        setTimeout(() => {
          this.$router.replace('/login');
        }, 1500);
        return;
      }
      
      try {
        // 存储 token
        localStorage.setItem('accessToken', token);
        localStorage.setItem('intelickIsLoggedIn', 'true');
        
        // 如果有 customerId，也存储它
        if (customerId) {
          localStorage.setItem('currentCustomerId', customerId);
        }
        
        // 验证 token 是否有效（可选）
        this.validateTokenAndRedirect();
      } catch (error) {
        console.error('处理认证信息时出错:', error);
        this.message = '认证过程中出现错误';
        setTimeout(() => {
          this.$router.replace('/login');
        }, 1500);
      }
    },
    
    // 可选：验证 token 是否有效
    async validateTokenAndRedirect() {
      try {
        // 可以调用一个简单的 API 来验证 token
        // 例如获取用户信息或其他不敏感的数据
        const userInfo = await api.getUserInfo();
        
        if (userInfo) {
          // token 有效，重定向到 dashboard
          this.$router.replace('/dashboard');
        } else {
          // token 无效
          this.message = '认证信息无效';
          localStorage.removeItem('accessToken');
          localStorage.removeItem('intelickIsLoggedIn');
          localStorage.removeItem('currentCustomerId');
          
          setTimeout(() => {
            this.$router.replace('/login');
          }, 1500);
        }
      } catch (error) {
        // API 调用失败，可能是 token 无效
        console.error('验证 token 时出错:', error);
        this.message = '认证信息验证失败';
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('intelickIsLoggedIn');
        localStorage.removeItem('currentCustomerId');
        
        setTimeout(() => {
          this.$router.replace('/login');
        }, 1500);
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.auth-loader {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  color: #333;
  font-size: 16px;
  margin: 0;
}
</style> 