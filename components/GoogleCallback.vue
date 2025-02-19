<template>
    <a-layout style="height: 100vh; background: linear-gradient(135deg, #E8F0FF 0%, #C7D9FF 100%);">
      <a-layout-content
        style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px;"
      >
        <div
          class="callback-container"
          style="width: 400px; padding: 40px; background: rgba(255, 255, 255, 0.95); border-radius: 24px; box-shadow: 0 8px 32px rgba(108, 152, 255, 0.15); border: 1px solid rgba(108, 152, 255, 0.2);"
        >
          <div class="logo-section">
            <h2 class="app-title">
              <span class="website-text">Website</span><span class="lm-text">LM</span> 
              <span class="title-emoji">✦</span>
            </h2>
          </div>
  
          <div class="redirect-message">
            <h3 class="redirect-title">Welcome aboard!</h3>
            <p class="redirect-text">Successfully authenticated with Google</p>
            <p class="redirect-subtext">Redirecting you to dashboard...</p>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script>
  import apiClient from '../api/api';
  import { initIntercom, shutdownIntercom } from '../utils/intercom';
  
  export default {
    name: 'GoogleCallback',
    data() {
      return {};
    },
    async created() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          throw new Error('Authorization code not received');
        }
  
        const response = await apiClient.googleCallback(code, state);
        
        if (response && response.code === 200) {
          // Clear all old data
          localStorage.clear();
          
          // Store new login information
          localStorage.setItem('intelickIsLoggedIn', 'true');
          localStorage.setItem('accessToken', response.accessToken);
          
          if (response.data?.customerId) {
            localStorage.setItem('currentCustomerEmail', response.data.email);
            localStorage.setItem('currentCustomerId', response.data.customerId);
          }

          shutdownIntercom();
          
          const user = {
            id: response.data.customerId,
            email: response.data.email,
            name: response.data.name || response.data.email,
            createdAt: Math.floor(new Date(response.data.createdAt).getTime() / 1000)
          };
          
          initIntercom(user);

          this.$notification.success({
            message: 'Welcome!',
            description: 'Successfully logged in with Google'
          });
          this.$router.push('/dashboard');
        } else {
          throw new Error(response?.message || 'Authentication failed');
        }
      } catch (error) {
        let errorMessage = 'Failed to complete Google authentication';
        
        if (error.response) {
          switch (error.response.data?.code) {
            case 401:
              errorMessage = 'Authentication failed. Please try again';
              break;
            case 404:
              errorMessage = 'User not found. Please try again';
              break;
            default:
              errorMessage = error.response.data?.message || 'Google login failed';
          }
        }

        this.$notification.error({
          message: 'Authentication Failed',
          description: errorMessage
        });
        
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      }
    }
  }
  </script>
  
  <style scoped>
  .callback-container {
    font-family: 'Roboto', sans-serif;
  }
  
  .app-title {
    text-align: center;
    font-weight: 700;
    margin-bottom: 32px;
    font-size: 32px;
    background: linear-gradient(45deg, #82a3ff 20%, #4B89FF 20%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
    font-family: 'Montserrat', sans-serif;
  }
  
  .lm-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 900;
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
  
  .status-content {
    text-align: center;
    padding: 20px 0;
  }
  
  .status-message {
    margin-top: 24px;
  }
  
  .status-title {
    font-size: 18px;
    font-weight: 500;
    color: #2C5282;
    margin-bottom: 8px;
  }
  
  .status-description {
    font-size: 14px;
    color: #5C7299;
    line-height: 1.5;
  }
  
  :deep(.ant-spin-dot-item) {
    background-color: #4B89FF;
  }
  
  :deep(.ant-spin) {
    color: #4B89FF;
  }
  
  /* 添加密码强度相关样式 */
  .password-strength {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
  
  .strength-weak {
    color: #ff4d4f;
  }
  
  .strength-medium {
    color: #faad14;
  }
  
  .strength-strong {
    color: #52c41a;
  }
  
  .custom-input {
    border-radius: 12px !important;
    border: 1px solid rgba(108, 152, 255, 0.3) !important;
    height: 42px !important;
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
  
  .redirect-message {
    text-align: center;
    padding: 20px 0;
  }
  
  .redirect-title {
    font-size: 24px;
    color: #4B89FF;
    margin-bottom: 16px;
    font-weight: 600;
  }
  
  .redirect-text {
    font-size: 16px;
    color: #5C7299;
    margin-bottom: 8px;
  }
  
  .redirect-subtext {
    font-size: 14px;
    color: #8BA2C9;
    font-style: italic;
  }
  </style>