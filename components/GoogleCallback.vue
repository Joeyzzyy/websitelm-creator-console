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
  
          <div v-if="loading" class="status-content">
            <a-spin :spinning="true" size="large">
              <div class="status-message">
                <div class="status-title">Verifying Login...</div>
                <div class="status-description">
                  Please wait while we complete your Google authentication
                </div>
              </div>
            </a-spin>
          </div>
  
          <a-form v-if="showSetPasswordForm" layout="vertical" @submit.prevent="handleSetPassword">
            <a-form-item
              label="New Password"
              :rules="[
                { required: true, message: 'Please enter a new password!' },
                { validator: validatePassword }
              ]"
            >
              <a-input-password
                v-model:value="setPasswordForm.newPassword"
                placeholder="Enter new password"
                size="large"
                class="custom-input"
              />
              <div class="password-strength" v-if="setPasswordForm.newPassword">
                Password Strength:
                <span :class="setPasswordStrengthClass">{{ setPasswordStrength }}</span>
              </div>
            </a-form-item>
  
            <a-form-item
              label="Confirm Password"
              :rules="[
                { required: true, message: 'Please confirm your password!' },
                { validator: validateConfirmPassword }
              ]"
            >
              <a-input-password
                v-model:value="setPasswordForm.confirmPassword"
                placeholder="Confirm your password"
                size="large"
                class="custom-input"
              />
            </a-form-item>
  
            <a-form-item>
              <a-button
                type="primary"
                block
                size="large"
                @click="handleSetPassword"
                class="login-button"
                :loading="setPasswordLoading"
              >
                {{ setPasswordLoading ? 'Setting...' : 'Set Password' }}
              </a-button>
            </a-form-item>
          </a-form>
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
      return {
        loading: true,
        showSetPasswordForm: false,
        setPasswordLoading: false,
        setPasswordForm: {
          newPassword: '',
          confirmPassword: ''
        }
      };
    },
    computed: {
      setPasswordStrength() {
        const password = this.setPasswordForm.newPassword;
        if (!password) return '';
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        
        switch(strength) {
          case 4: return 'Strong';
          case 3: return 'Medium';
          default: return 'Weak';
        }
      },
      setPasswordStrengthClass() {
        const strengthMap = {
          'Strong': 'strength-strong',
          'Medium': 'strength-medium',
          'Weak': 'strength-weak'
        };
        return strengthMap[this.setPasswordStrength] || '';
      }
    },
    methods: {
      validatePassword(rule, value) {
        if (!value) {
          return Promise.reject('Please enter a new password!');
        }
        if (value.length < 8) {
          return Promise.reject('Password must be at least 8 characters long');
        }
        if (!/\d/.test(value)) {
          return Promise.reject('Password must contain at least one number');
        }
        if (!/[A-Z]/.test(value)) {
          return Promise.reject('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
          return Promise.reject('Password must contain at least one lowercase letter');
        }
        if (this.setPasswordForm.confirmPassword && value !== this.setPasswordForm.confirmPassword) {
          return Promise.reject('The two passwords do not match');
        }
        return Promise.resolve();
      },
      validateConfirmPassword(rule, value) {
        if (!value) {
          return Promise.reject('Please confirm your password!');
        }
        if (value !== this.setPasswordForm.newPassword) {
          return Promise.reject('The two passwords do not match!');
        }
        return Promise.resolve();
      },
      async handleSetPassword() {
        const { newPassword, confirmPassword } = this.setPasswordForm;
        
        // Validate password format before submission
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
          this.$notification.error({
            message: 'Error',
            description: 'Password format is incorrect, please re-enter'
          });
          return;
        }
        
        if (!newPassword || !confirmPassword) {
          this.$notification.error({
            message: 'Error',
            description: 'Please fill in all fields'
          });
          return;
        }
        
        this.setPasswordLoading = true;
        try {
          const response = await apiClient.changePassword({
            currentPassword: '', // Empty for first-time login
            newPassword,
            confirmPassword,
            isInitPassword: true // Add flag to indicate initial password setup
          });
          
          if (response.code === 200) {
            this.$notification.success({
              message: 'Success',
              description: 'Password set successfully'
            });
            this.$router.push('/dashboard');
          } else if (response.code === 400 && response.message === 'Passwords do not match') {
            this.$notification.error({
              message: 'Error',
              description: 'The two passwords do not match'
            });
          } else {
            this.$notification.error({
              message: 'Error',
              description: response.message || 'Password setting failed'
            });
          }
        } catch (error) {
          this.$notification.error({
            message: 'Error',
            description: 'Network error, please try again'
          });
        } finally {
          this.setPasswordLoading = false;
        }
      }
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

          // 先关闭之前的 Intercom
          shutdownIntercom();
          
          // 初始化用户的 Intercom
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
  
          // // 检查是否是首次登录
          // if (response.data.firstLogin) {
          //   this.loading = false;
          //   this.showSetPasswordForm = true;
          // } else {
          //   this.$notification.success({
          //     message: 'Welcome!',
          //     description: 'Successfully logged in with Google'
          //   });
          //   this.$router.push('/dashboard');
          // }
        } else {
          throw new Error(response?.message || 'Authentication failed');
        }
      } catch (error) {
        // 根据不同的错误类型显示不同的提示
        let errorMessage = 'Failed to complete Google authentication';
        
        if (error.response) {
          switch (error.response.data?.code) {
            case 401:
              if (error.response.data.message === 'Password incorrect') {
                errorMessage = 'Password is incorrect, please try again';
              } else if (error.response.data.message === 'User not find') {
                errorMessage = 'User does not exist, please register first';
              }
              break;
            case 404:
              errorMessage = 'User does not exist, please register first';
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
      } finally {
        // 如果不是显示设置密码表单，则结束加载状态
        if (!this.showSetPasswordForm) {
          this.loading = false;
        }
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
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;  /* 确保有足够的空间显示 */
  }
  
  :deep(.ant-spin) {
    max-height: none !important;  /* 覆盖 Ant Design 默认最大高度限制 */
  }
  
  :deep(.ant-spin-container) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .status-message {
    margin-top: 32px;  /* 增加与spin的间距 */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;  /* 标题和描述文字之间的间距 */
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
  </style>