<template>
  <a-layout style="height: 100vh; background: linear-gradient(135deg, #E8F0FF 0%, #C7D9FF 100%);">
    <a-layout-content
      style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px;"
    >
      <div
        class="login-container"
        style="width: 400px; padding: 40px; background: rgba(255, 255, 255, 0.95); border-radius: 24px; box-shadow: 0 8px 32px rgba(108, 152, 255, 0.15); border: 1px solid rgba(108, 152, 255, 0.2);"
      >
        <div class="logo-section">
          <h2 class="app-title">
            Intelick Page Creator <span class="title-emoji">🌟</span>
          </h2>
          <p class="subtitle">Create Effective Pages with Ease</p>
        </div>
        
        <a-form layout="vertical" @submit.prevent="handleLogin">
          <a-form-item label="Username">
            <a-input 
              v-model:value="form.username" 
              placeholder="Enter your username" 
              size="large" 
              class="custom-input"
              @keydown.enter="handleLogin"
            />
          </a-form-item>
          <a-form-item label="Password">
            <a-input-password 
              v-model:value="form.password" 
              placeholder="Enter your password" 
              size="large" 
              class="custom-input"
              @keydown.enter="handleLogin"
            />
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="rememberMe">Remember me</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button 
              type="primary" 
              block 
              size="large" 
              @click="handleLogin" 
              class="login-button"
              :loading="loading"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import apiClient from '../api/api';

export default {
  name: 'LoginPage',
  data() {
    if (localStorage.getItem('intelickIsLoggedIn')) {
      this.$router.push('/');
    }
    return {
      form: {
        username: '',
        password: ''
      },
      rememberMe: false,
      loading: false
    };
  },
  created() {
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const decoded = this.decodeCredentials(savedCredentials);
      this.form.username = decoded.username;
      this.form.password = decoded.password;
      this.rememberMe = true;
    }
  },
  methods: {
    encodeCredentials(credentials) {
      return btoa(JSON.stringify(credentials));
    },
    decodeCredentials(encoded) {
      return JSON.parse(atob(encoded));
    },
    async handleLogin() {
      const { username, password } = this.form;
      if (!username || !password) {
        this.$notification.error({
          message: 'Login Error',
          description: 'Please enter username and password'
        });
        return;
      }

      this.loading = true;
      try {
        const response = await apiClient.login(username, password);
        if (response) {
          // Clear all old data
          localStorage.clear();
          
          // Store only necessary login information
          localStorage.setItem('intelickIsLoggedIn', 'true');
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('customers', JSON.stringify(response.customers));
          
          if (response.customers?.[0]) {
            localStorage.setItem('currentCustomer', JSON.stringify(response.customers[0]));
            localStorage.setItem('currentUserId', response.customers[0].customerId);
          }
          
          // Remember password functionality
          if (this.rememberMe) {
            const credentials = { username, password };
            localStorage.setItem('rememberedCredentials', this.encodeCredentials(credentials));
          }
          
          this.$router.push('/dashboard');
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.$notification.error({
          message: 'Login Failed',
          description: error.response?.data?.message || 'Please check your username and password'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  font-family: 'Roboto', sans-serif;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.ant-form-item-label > label) {
  color: #2C5282;
  font-weight: 500;
}

.custom-input {
  border-radius: 12px !important;
  border: 1px solid rgba(108, 152, 255, 0.3) !important;
  height: 42px !important;
}

.custom-input:hover, .custom-input:focus {
  border-color: #4B89FF !important;
  box-shadow: 0 0 0 2px rgba(108, 152, 255, 0.1) !important;
}

.login-button {
  height: 42px;
  border-radius: 12px;
  background: #4B89FF !important;
  border: none;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(108, 152, 255, 0.25);
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #5C95FF !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(108, 152, 255, 0.3);
}

.login-button:active {
  background: #3A78FF !important;
  transform: translateY(1px);
}

.app-title {
  text-align: center;
  font-weight: 700;
  margin-bottom: 32px;
  font-size: 28px;
  background: linear-gradient(45deg, #82a3ff 20%, #4B89FF 20%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.subtitle {
  text-align: center;
  color: #5C7299;
  margin-top: -20px;
  margin-bottom: 32px;
  font-size: 14px;
}

:deep(.ant-checkbox-wrapper) {
  color: #4A5568;
}

.title-emoji {
  font-size: 24px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  -webkit-text-fill-color: initial;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}
</style>
