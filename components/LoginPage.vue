<template>
  <a-layout style="height: 100vh;">
    <a-layout-sider 
      width="50%"
      class="left-side"
    >
      <div class="slogan-container">
        <div class="brand-mark">
          <div class="glowing-circle"></div>
          <div class="pulse-ring"></div>
        </div>
        
        <h1 class="main-slogan">
          <span class="gradient-text">AI-crafted Content</span>
          <br/>That Delivers Results.
        </h1>
        <p class="sub-slogan">
          Dominate search results and drive more traffic with AI-generated landing pages 
          and blog posts that are optimized for your audience and search engines.
        </p>

        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="feature-svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
            </div>
            <div class="feature-text">AI-Powered<br/>Content Creation</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="feature-svg">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div class="feature-text">SEO-Optimized<br/>Strategy</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="feature-svg">
                <path d="M21 21H3L12 3l9 18z"/>
                <path d="M12 9v8"/>
                <path d="M8 17h8"/>
              </svg>
            </div>
            <div class="feature-text">Drive Organic<br/>Traffic</div>
          </div>
        </div>
      </div>

      <!-- 背景动画效果 -->
      <div class="animated-shapes">
        <div class="shape circle"></div>
        <div class="shape square"></div>
        <div class="shape triangle"></div>
        <div class="floating-dots"></div>
      </div>

      <!-- 底部装饰 -->
      <div class="bottom-decoration">
        <div class="wave-pattern"></div>
      </div>
    </a-layout-sider>

    <a-layout-content
      class="right-side"
    >
      <div class="login-container">
        <div class="logo-section">
          <h2 class="app-title">
            <span class="website-text">Website</span><span class="lm-text">LM</span> 
            <span class="title-emoji">✦</span>
          </h2>
          <p class="subtitle">
            {{ isForgotPassword ? 'Reset Your Account Password' : (isLogin ? 'Create Content At Ease' : 'Get An Account For Start') }}
          </p>
        </div>
        
        <a-form v-if="isLogin" layout="vertical" @submit.prevent="handleLogin">
          <a-form-item label="Email">
            <a-input 
              v-model:value="form.email" 
              placeholder="Enter your email" 
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
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <a-checkbox v-model:checked="rememberMe">Remember me</a-checkbox>
              <a @click="showForgotPassword" class="forgot-password-link">Forgot Password?</a>
            </div>
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

          <div class="divider">
            <span class="divider-text">or</span>
          </div>

          <a-button 
            block 
            size="large" 
            class="google-login-button"
            @click="handleGoogleLogin"
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              class="google-icon"
            />
            Continue with Google
          </a-button>

          <div class="register-prompt">
            Don't have an account? 
            <a @click="toggleForm">Register now</a>
          </div>
        </a-form>

        <a-form v-if="isForgotPassword" layout="vertical" @submit.prevent="handleResetPassword">
          <a-form-item 
            label="Email" 
            :rules="[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email!' }
            ]"
          >
            <div class="email-verify-group">
              <a-input 
                v-model:value="resetForm.email" 
                placeholder="Please input your email"
                size="large" 
                class="custom-input"
              />
              <a-button 
                @click="sendResetCode" 
                :disabled="cooldown > 0"
                size="large"
                class="verify-code-btn"
              >
                {{ cooldown > 0 ? `${cooldown}s` : 'Send' }}
              </a-button>
            </div>
          </a-form-item>

          <a-form-item 
            label="Code"
            :rules="[{ required: true, message: 'Please input verification code!' }]"
          >
            <a-input 
              v-model:value="resetForm.code" 
              placeholder="Please input verification code"
              size="large" 
              class="custom-input"
            />
          </a-form-item>

          <a-form-item 
            label="New Password"
            :rules="[
              { required: true, message: 'Please input new password!' },
              { validator: validatePassword }
            ]"
          >
            <a-input-password 
              v-model:value="resetForm.newPassword" 
              placeholder="Please input new password"
              size="large" 
              class="custom-input"
            />
            <div class="password-strength" v-if="resetForm.newPassword">
              Password Strength: 
              <span :class="forgotPasswordStrengthClass">{{ forgotPasswordStrength }}</span>
            </div>
          </a-form-item>

          <a-form-item 
            label="Confirm Password"
            :rules="[
              { required: true, message: 'Please confirm your password!' },
              { validator: validateConfirmResetPassword }
            ]"
          >
            <a-input-password 
              v-model:value="resetForm.confirmPassword" 
              placeholder="Please confirm your password"
              size="large" 
              class="custom-input"
            />
          </a-form-item>

          <a-form-item>
            <a-button 
              type="primary" 
              block 
              size="large" 
              @click="handleResetPassword" 
              class="login-button"
              :loading="loading"
            >
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </a-button>
          </a-form-item>

          <div class="register-prompt">
            <a @click="backToLogin">Back to Login</a>
          </div>
        </a-form>

        <a-form v-if="!isLogin && !isForgotPassword" layout="vertical" @submit.prevent="handleRegister">
          <a-form-item 
            label="Email" 
            :rules="[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email!' }
            ]"
          >
            <div class="email-verify-group">
              <a-input 
                v-model:value="registerForm.email" 
                placeholder="Enter your email"
                size="large" 
                class="custom-input"
              />
              <a-button 
                @click="sendCode" 
                :disabled="cooldown > 0"
                size="large"
                class="verify-code-btn"
              >
                {{ cooldown > 0 ? `${cooldown}s` : 'Send' }}
              </a-button>
            </div>
          </a-form-item>

          <a-form-item 
            label="Verification Code"
            :rules="[{ required: true, message: 'Please input verification code!' }]"
          >
            <a-input 
              v-model:value="registerForm.code" 
              placeholder="Enter verification code"
              size="large" 
              class="custom-input"
            />
          </a-form-item>

          <a-form-item 
            label="Password"
            :rules="[
              { required: true, message: 'Please input your password!' },
              { validator: validatePassword }
            ]"
          >
            <a-input-password 
              v-model:value="registerForm.password" 
              placeholder="Enter password"
              size="large" 
              class="custom-input"
            />
            <div class="password-strength" v-if="registerForm.password">
              Password Strength: 
              <span :class="passwordStrengthClass">{{ passwordStrength }}</span>
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
              v-model:value="registerForm.confirmPassword" 
              placeholder="Confirm password"
              size="large" 
              class="custom-input"
            />
            
          </a-form-item>

          <a-form-item>
            <a-button 
              type="primary" 
              block 
              size="large" 
              @click="handleRegister" 
              class="login-button"
              :loading="loading"
            >
              {{ loading ? 'Registering...' : 'Register' }}
            </a-button>
          </a-form-item>

          <div class="register-prompt">
            Already have an account? 
            <a @click="toggleForm">Login now</a>
          </div>
        </a-form>
      </div>
    </a-layout-content>
  </a-layout>

  <!-- 添加次登录设置密码的弹窗 -->
  <a-modal
    v-model:visible="showSetPasswordModal"
    title="Set Password"
    :closable="false"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    width="400px"
  >
    <a-form layout="vertical" @submit.prevent="handleSetPassword">
      <a-form-item
        label="New Password"
        :rules="[
          { required: true, message: 'Please input new password!' },
          { validator: validatePassword }
        ]"
      >
        <a-input-password
          v-model:value="setPasswordForm.newPassword"
          placeholder="Please input new password"
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
          { required: true, message: 'Please confirm password!' },
          { validator: validateConfirmSetPassword }
        ]"
      >
        <a-input-password
          v-model:value="setPasswordForm.confirmPassword"
          placeholder="Please confirm password"
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
  </a-modal>
</template>

<script>
import apiClient from '../api/api';
import { onBeforeUnmount, ref} from 'vue';

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rememberMe: false,
      loading: false,
      isLogin: true,
      isForgotPassword: false,
      registerForm: {
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      cooldown: 0,
      cooldownTimer: null,
      resetForm: {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      showSetPasswordModal: false,
      setPasswordLoading: false,
      setPasswordForm: {
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  setup() {
    const cooldown = ref(0);
    const cooldownTimer = ref(null);
    onBeforeUnmount(() => {
      if (cooldownTimer.value) {
        clearInterval(cooldownTimer.value);
      }
    });
  },
  async created() {
    if (localStorage.getItem('intelickIsLoggedIn') && localStorage.getItem('accessToken')) {
      try {
        this.$router.push('/');
      } catch (error) {
        localStorage.removeItem('intelickIsLoggedIn');
        localStorage.removeItem('accessToken');
      }
    }
  },
  computed: {
    forgotPasswordStrength() {
      const password = this.isForgotPassword 
        ? this.resetForm.newPassword 
        : this.registerForm.password;
        
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
    passwordStrength() {
      const password = this.registerForm.password;
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
    passwordStrengthClass() {
      const strengthMap = {
        'Strong': 'strength-strong',
        'Medium': 'strength-medium',
        'Weak': 'strength-weak'
      };
      return strengthMap[this.passwordStrength] || '';
    },
    forgotPasswordStrengthClass() {
      const strengthMap = {
        'Strong': 'strength-strong',
        'Medium': 'strength-medium',
        'Weak': 'strength-weak'
      };
      return strengthMap[this.forgotPasswordStrength] || '';
    },
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
    async handleGoogleLogin() {
      try {
        const response = await apiClient.googleLogin();
        if (response && response.code === 200) {
          window.location.href = response.data;
        } else {
          this.$notification.error({
            message: 'Error',
            description: 'Failed to get login url from Google'
          });
        }
      } catch (error) {
        this.$notification.error({
          message: 'Error',
          description: error.message || 'Failed to send verification code'
        });
      }
    },
    // 显示忘记密码表单
    showForgotPassword() {
      this.isForgotPassword = true;
      this.isLogin = false;
    },

    // 返回登录表单
    backToLogin() {
      this.isForgotPassword = false;
      this.isLogin = true;
      this.resetForm = {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    // 发送重置密码验证码
    async sendResetCode() {
      if (!this.resetForm.email) {
        this.$notification.error({
          message: 'Error',
          description: 'Please input your email first'
        });
        return;
      }

      try {
        await apiClient.sendEmailCode(this.resetForm.email, 'forgot_password');
        
        this.cooldown = 60;
        this.cooldownTimer = setInterval(() => {
          this.cooldown--;
          if (this.cooldown <= 0) {
            clearInterval(this.cooldownTimer);
          }
        }, 1000);

        this.$notification.success({
          message: 'Success',
          description: 'Verification code has been sent to your email'
        });
      } catch (error) {
        this.$notification.error({
          message: 'Error',
          description: error.message || 'Failed to send verification code'
        });
      }
    },

    // 验证确认密码
    validateConfirmResetPassword(rule, value) {
      if (!value) {
        return Promise.reject('Please confirm your password!');
      }
      if (value !== this.resetForm.newPassword) {
        return Promise.reject('The two passwords do not match!');
      }
      return Promise.resolve();
    },

    // 处理重置密码
    async handleResetPassword() {
      const { email, code, newPassword, confirmPassword } = this.resetForm;
      
      if (!email || !code || !newPassword || !confirmPassword) {
        this.$notification.error({
          message: 'Error',
          description: 'Please fill in all fields'
        });
        return;
      }

      this.loading = true;
      try {
        const response = await apiClient.resetPassword({
          email,
          code,
          newPassword,
          confirmPassword
        });

        if (response && response.code === 200) {
          this.$notification.success({
            message: 'Success',
            description: 'Password reset successful, please use the new password to log in'
          });
          this.backToLogin();
        }
      } catch (error) {
        this.$notification.error({
          message: 'Error',
          description: error.message || 'Password reset failed'
        });
      } finally {
        this.loading = false;
      }
    },
    encodeCredentials(credentials) {
      return btoa(JSON.stringify(credentials));
    },
    decodeCredentials(encoded) {
      return JSON.parse(atob(encoded));
    },
    async handleLogin() {
      const { email, password } = this.form;
      if (!email || !password) {
        this.$notification.error({
          message: 'Login Error',
          description: 'Please enter email and password'
        });
        return;
      }

      this.loading = true;
      try {
        const response = await apiClient.login(email, password);
        if (response) {
          // 添加对响应code的判断
          if (response.code === 401 && response.message === 'Password incorrect') {
            this.$notification.error({
              message: 'Login Failed',
              description: 'Password incorrect, please check your email and password'
            });
            return;
          }

          if (response.code === 404 && response.message === 'User not find') {
            this.$notification.error({
              message: 'Login Failed',
              description: 'User not found, please register first'
            });
            return;
          }

          // 替换 localStorage.clear() 为：
          const keysToRemove = [
            'accessToken',
            'intelickIsLoggedIn',
            'currentCustomerEmail',
            'currentCustomerId'
          ];
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // Store only necessary login information
          localStorage.setItem('intelickIsLoggedIn', 'true');
          localStorage.setItem('accessToken', response.accessToken);
          
          if (response.data.customerId) {
            localStorage.setItem('currentCustomerEmail', response.data.email);
            localStorage.setItem('currentCustomerId', response.data.customerId);
          }
          
          // Remember password functionality
          if (this.rememberMe) {
            const credentials = { email, password };
            localStorage.setItem('rememberedCredentials', this.encodeCredentials(credentials));
          } else {
            localStorage.removeItem('rememberedCredentials');
          }
          
          if (response.data.firstLogin) {
            // 如果是首次登录,显示设置密码弹窗
            this.showSetPasswordModal = true;
            localStorage.setItem('accessToken', response.accessToken);
          } else {
            // 正常登录流程
            this.$router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.$notification.error({
          message: 'Login Failed',
          description: error.response?.data?.message || 'Please check your email and password'
        });
      } finally {
        this.loading = false;
      }
    },
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.loading = false;
    },
    validatePassword(rule, value) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      if (!value) {
        return Promise.reject('Please input your password!');
      }
      if (!passwordRegex.test(value)) {
        return Promise.reject('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return Promise.resolve();
    },
    validateConfirmPassword(rule, value) {
      if (!value) {
        return Promise.reject('Please confirm your password!');
      }
      if (value !== this.registerForm.passwsord) {
        return Promise.reject('The two passwords do not match!');
      }
      return Promise.resolve();
    },
    async sendCode() {
      if (!this.registerForm.email) {
        this.$notification.error({
          message: 'Error',
          description: 'Please enter your email first'
        });
        return;
      }

      try {
        // 发送验证码
        const response = await apiClient.sendEmailCode(this.registerForm.email, 'register');
        
        // 检查返回的状态码
        if (response.code === 1001) {
          this.$notification.error({
            message: 'Error',
            description: 'This email is already registered'
          });
          return;
        }

        // 开始倒计时
        this.cooldown = 60;
        this.cooldownTimer = setInterval(() => {
          this.cooldown--;
          if (this.cooldown <= 0) {
            clearInterval(this.cooldownTimer);
          }
        }, 1000);

        this.$notification.success({
          message: 'Success',
          description: 'Verification code has been sent to your email'
        });
      } catch (error) {
        this.$notification.error({
          message: 'Error',
          description: error.message || 'Failed to send verification code'
        });
      }
    },

    async handleRegister() {
      // 检查所有字段是否填写
      const { email, code, password, confirmPassword } = this.registerForm;
      if (!email || !code || !password || !confirmPassword) {
        this.$notification.error({
          message: 'Error',
          description: 'Please fill in all fields'
        });
        return;
      }

      // 密码强度验证
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        this.$notification.error({
          message: 'Error',
          description: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long'
        });
        return;
      }

      // 密码一致性检查
      if (password !== confirmPassword) {
        this.$notification.error({
          message: 'Error',
          description: 'Passwords do not match'
        });
        return;
      }

      this.loading = true;
      try {
        const response = await apiClient.register({
          email,
          code,
          password
        });

        // 检查是否注册成功
        if (response && response.code === 200) {
          this.$notification.success({
            message: 'Success',
            description: 'Registration successful! Please login.'
          });

          // 重置表单并切换到登录页
          this.registerForm = {
            email: '',
            code: '',
            password: '',
            confirmPassword: ''
          };
          this.isLogin = true;
        } else if (response && response.code === 400 && response.message == 'Invalid verification code') {
          this.$notification.error({
            message: 'Error',
            description: 'The verification code is incorrect. Please check and try again.'
          });
        } else if (response && response.code === 400 && response.message == 'email already exists'){
          this.$notification.error({
            message: 'Error',
            description: 'Email already registered'
          });
        }
      } catch (error) {
        this.$notification.error({
          message: 'Error',
          description: error.message || 'Registration failed'
        });
      } finally {
        this.loading = false;
      }
    },
    validateConfirmSetPassword(rule, value) {
      if (!value) {
        return Promise.reject('Please confirm password!');
      }
      if (value !== this.setPasswordForm.newPassword) {
        return Promise.reject('Two passwords do not match!');
      }
      return Promise.resolve();
    },
    
    async handleSetPassword() {
      const { newPassword, confirmPassword } = this.setPasswordForm;
      
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
          currentPassword: '', // 首次登录时当前密码为空
          newPassword,
          confirmPassword
        });
        
        if (response && response.code === 200) {
          this.$notification.success({
            message: 'Success',
            description: 'Password set successfully'
          });
          
          this.showSetPasswordModal = false;
          // 继续正常登录流程
          this.$router.push('/dashboard');
        }
      } catch (error) {
        this.$notification.error({
          message: 'Error',
          description: error.message || 'Password set failed'
        });
      } finally {
        this.setPasswordLoading = false;
      }
    }
  },
  beforeUnmount() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Playfair+Display:ital,wght@1,900&display=swap');

.forgot-password {
  text-align: right;
  margin-top: -20px;
  margin-bottom: 16px;
}

.forgot-password a {
  color: #4B89FF;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}

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
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
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

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: rgba(108, 152, 255, 0.2);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider-text {
  background-color: white;
  padding: 0 15px;
  color: #5C7299;
  font-size: 14px;
}

.google-login-button {
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(108, 152, 255, 0.3);
  color: #4A5568;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  transition: all 0.3s ease;
}

.google-login-button:hover {
  border-color: #4B89FF;
  color: #4B89FF;
  background: white;
}

.google-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.register-prompt {
  text-align: center;
  margin-top: 16px;
  color: #5C7299;
}

.register-prompt a {
  color: #4B89FF;
  cursor: pointer;
}

.register-prompt a:hover {
  text-decoration: underline;
}

.email-verify-group {
  display: flex;
  gap: 8px;
}

.verify-code-btn {
  border-radius: 12px;
  height: 42px;
  min-width: 80px;
  border: 1px solid rgba(108, 152, 255, 0.3);
  padding: 0 12px;
  font-size: 13px;
}

.verify-code-btn:not(:disabled):hover {
  border-color: #4B89FF;
  color: #4B89FF;
}

.verify-code-btn:disabled {
  color: #999;
  cursor: not-allowed;
  background: #f5f5f5;
}

:deep(.ant-layout-sider) {
  position: relative;
  overflow: hidden;
}

.login-container {
  background: transparent;
  box-shadow: none;
  border: none;
}

/* 左侧样式 */
.left-side {
  background: linear-gradient(135deg, #1a1f35 0%, #131b2e 100%);
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-mark {
  position: relative;
  margin-bottom: 40px;
}

.glowing-circle {
  width: 12px;
  height: 12px;
  background: #4B89FF;
  border-radius: 50%;
  position: relative;
  box-shadow: 
    0 0 30px #4B89FF,
    0 0 60px #4B89FF,
    0 0 90px rgba(75, 137, 255, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border: 2px solid #4B89FF;
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

.slogan-container {
  max-width: 600px;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 120px);
  padding: 0;
}

.main-slogan {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #fff;
  text-shadow: 0 2px 15px rgba(75, 137, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #4B89FF 0%, #82ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sub-slogan {
  font-size: 18px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 60px;
  width: 100%;
  position: relative;
}

.feature-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(75, 137, 255, 0.1) 0%, 
    rgba(130, 255, 255, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-item:hover {
  transform: translateY(-8px);
  border-color: rgba(75, 137, 255, 0.2);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(75, 137, 255, 0.1),
    inset 0 0 20px rgba(75, 137, 255, 0.05);
}

.feature-item:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 32px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(75, 137, 255, 0.1);
  border-radius: 16px;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
  color: #4B89FF;
}

.feature-item:hover .feature-icon {
  background: rgba(75, 137, 255, 0.2);
  transform: translateY(-5px);
}

.feature-item:hover .feature-svg {
  transform: scale(1.1);
}

/* 添加发光效果 */
.feature-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: rgba(75, 137, 255, 0.1);
  filter: blur(15px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-item:hover .feature-icon::after {
  opacity: 1;
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.feature-item:nth-child(1)::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(75, 137, 255, 0.1) 0%, transparent 70%);
  top: -20px;
  left: -20px;
  border-radius: 50%;
  z-index: 0;
}

.feature-item:nth-child(2)::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(44, 82, 130, 0.1) 0%, transparent 70%);
  bottom: -20px;
  right: -20px;
  border-radius: 50%;
  z-index: 0;
}

.feature-item:nth-child(3)::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(75, 137, 255, 0.1) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 0;
}

@keyframes pulse-glow {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
}

.feature-item::after {
  animation: pulse-glow 3s ease-in-out infinite;
}

.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(rgba(75, 137, 255, 0.1) 1px, transparent 1px),
    radial-gradient(rgba(130, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0;
  animation: floatBackground 15s linear infinite;
  opacity: 0.3;
}

.wave-pattern {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(45deg, #4B89FF 25%, transparent 25%) -50px 0,
              linear-gradient(-45deg, #4B89FF 25%, transparent 25%) -50px 0;
  background-size: 100px 100px;
  background-color: transparent;
  opacity: 0.05;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px #4B89FF; }
  50% { box-shadow: 0 0 40px #4B89FF; }
}

@keyframes pulse {
  0% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% { 
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes floatBackground {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-5px) translateX(5px); }
  50% { transform: translateY(-10px) translateX(0); }
  75% { transform: translateY(-5px) translateX(-5px); }
  100% { transform: translateY(0) translateX(0); }
}

.shape {
  position: absolute;
  opacity: 0.1;
  filter: blur(2px);
}

.circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4B89FF 0%, #2C5282 100%);
  top: 10%;
  left: 10%;
  animation: float 15s ease-in-out infinite;
}

.square {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(44, 82, 130, 0.1) 0%, rgba(75, 137, 255, 0.1) 100%);
  bottom: 15%;
  right: 20%;
  animation: float 20s ease-in-out infinite;
  transform: rotate(45deg);
  opacity: 0.08;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 175px solid rgba(75, 137, 255, 0.15);
  top: 50%;
  left: 50%;
  animation: float 18s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
    filter: blur(2px);
  }
  50% { 
    transform: translateY(-30px) rotate(5deg); 
    filter: blur(4px);
  }
}

/* 右侧样式 */
.right-side {
  width: 50%;
  background: linear-gradient(135deg, #EEF2FF 0%, #E6E9FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.right-side::before {
  content: '';
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(
    circle,
    rgba(75, 137, 255, 0.15) 0%,
    rgba(75, 137, 255, 0.1) 20%,
    rgba(75, 137, 255, 0.05) 40%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: background-glow 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes background-glow {
  0%, 100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* 修改登录容器样式 */
.login-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.6),
    0 0 60px rgba(75, 137, 255, 0.2),
    0 0 100px rgba(75, 137, 255, 0.1),
    0 0 140px rgba(75, 137, 255, 0.05);
  width: 400px;
  padding: 40px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: container-glow 6s ease-in-out infinite;
}

/* 增强发光动画 */
@keyframes container-glow {
  0%, 100% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.6),
      0 0 60px rgba(75, 137, 255, 0.2),
      0 0 100px rgba(75, 137, 255, 0.1),
      0 0 140px rgba(75, 137, 255, 0.05);
  }
  50% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.6),
      0 0 80px rgba(75, 137, 255, 0.3),
      0 0 120px rgba(75, 137, 255, 0.2),
      0 0 160px rgba(75, 137, 255, 0.1);
  }
}

/* 添加动态背景效果 */
.animated-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.animated-shapes::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: 
    radial-gradient(circle at 50% 50%, rgba(75, 137, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(130, 255, 255, 0.1) 0%, transparent 30%);
  animation: rotateBackground 20s linear infinite;
}

/* 添加浮动粒子效果 */
.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(rgba(75, 137, 255, 0.1) 1px, transparent 1px),
    radial-gradient(rgba(130, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0;
  animation: floatBackground 15s linear infinite;
  opacity: 0.3;
}

@keyframes rotateBackground {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes floatBackground {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-5px) translateX(5px); }
  50% { transform: translateY(-10px) translateX(0); }
  75% { transform: translateY(-5px) translateX(-5px); }
  100% { transform: translateY(0) translateX(0); }
}

/* 添加光晕效果 */
.brand-mark {
  position: relative;
  margin-bottom: 40px;
}

.glowing-circle {
  width: 12px;
  height: 12px;
  background: #4B89FF;
  border-radius: 50%;
  position: relative;
  box-shadow: 
    0 0 30px #4B89FF,
    0 0 60px #4B89FF,
    0 0 90px rgba(75, 137, 255, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* 添加网格背景 */
.grid-overlay {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image: 
    linear-gradient(rgba(75, 137, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(75, 137, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  transform: perspective(500px) rotateX(60deg);
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(30px); }
}
</style>
