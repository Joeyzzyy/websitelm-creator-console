<template>
    <page-layout
      title="Settings"
      description="Configure your website settings and deployment options"
      icon="⚙️"
    >
      <smart-banner
        :theme="bannerTheme"
        title="Account Setting"
        description="Configure your account settings, manage login email and password."
        :badges="[
          { text: 'Login Email' },
          { text: 'Password' },
        ]"
      />
        <div class="settings-content">
            <a-tabs 
                class="main-tabs"
                v-model:activeKey="activeTab"
            >
                <a-tab-pane key="login-email" tab="Login Email Setting" />
                <a-tab-pane key="password" tab="Password Setting" />
            </a-tabs>

            <div class="page-content">
                <div class="settings-content">
                <template v-if="activeTab === 'login-email'">
                    <div class="account-settings">
                    <div class="current-email-section">
                        <h3>Current Login Email</h3>
                        <div class="email-display">
                        <p class="current-email-text">
                            {{ currentEmail }}
                        </p>
                        <a-button 
                            type="primary"
                            @click="showChangeEmailForm"
                            v-if="!showEmailForm"
                            class="change-email-btn"
                        >
                            Change Login Email
                        </a-button>
                        </div>
                    </div>

                    <div class="email-change-section" v-if="showEmailForm">
                        <div class="section-header">
                        <h3>Change Login Email</h3>
                        <a-button 
                            @click="cancelEmailChange"
                            class="cancel-btn"
                        >
                            <close-outlined />
                        </a-button>
                        </div>
                        <div class="email-change-form">
                        <a-form
                            :model="emailForm"
                            layout="vertical"
                        >
                            <a-form-item 
                            label="New Email Address"
                            required
                            >
                            <div class="email-input-group">
                                <a-input
                                v-model:value="emailForm.newEmail"
                                placeholder="Enter new email address"
                                class="custom-input"
                                />
                                <a-button 
                                type="primary"
                                :loading="sendingCode"
                                :disabled="!isValidEmail || cooldown > 0"
                                @click="sendVerificationCode"
                                class="send-code-btn"
                                >
                                {{ cooldown > 0 ? `${cooldown}s` : 'Send Code' }}
                                </a-button>
                            </div>
                            </a-form-item>

                            <a-form-item 
                            label="Verification Code"
                            required
                            >
                            <a-input
                                v-model:value="emailForm.code"
                                placeholder="Enter verification code"
                                class="custom-input"
                            />
                            </a-form-item>

                            <a-form-item>
                            <a-button 
                                type="primary"
                                :loading="changing"
                                @click="confirmEmailChange"
                                :disabled="!canSubmit"
                                class="save-btn"
                            >
                                Change Now
                            </a-button>
                            </a-form-item>
                        </a-form>
                        </div>
                    </div>
                    </div>
                </template>

                <template v-if="activeTab === 'password'">
                    <div class="settings-container">
                        <template v-if="productInfo?.isFirstLogin">
                        <!-- 首次设置密码 -->
                        <div class="current-email-section">
                            <h3>Set Your Password</h3>
                            <div class="email-display">
                            <p class="current-email-text">
                                {{ currentEmail }}
                            </p>
                            </div>
                        </div>

                        <div class="email-change-section">
                            <h3>Create Password</h3>
                            <div class="email-change-form">
                            <a-form
                                :model="passwordForm"
                                layout="vertical"
                                class="password-form"
                            >
                                <a-form-item 
                                label="New Password"
                                :rules="[
                                    { required: true, message: 'Please input new password!' },
                                    { validator: validatePassword }
                                ]"
                                >
                                <a-input-password
                                    v-model:value="passwordForm.newPassword"
                                    placeholder="Please input new password"
                                    class="custom-input"
                                />
                                <div class="password-strength" v-if="passwordForm.newPassword">
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
                                    v-model:value="passwordForm.confirmPassword"
                                    placeholder="Please confirm your password"
                                    class="custom-input"
                                />
                                </a-form-item>

                                <a-form-item>
                                <a-button
                                    type="primary"
                                    :loading="submitLoading"
                                    @click="handleSetPassword"
                                    class="change-email-btn"
                                >
                                    Set Password
                                </a-button>
                                </a-form-item>
                            </a-form>
                            </div>
                        </div>
                        </template>

                        <template v-else>
                        <!-- 修改密码 -->
                        <div class="current-email-section">
                            <h3>Change Your Password For</h3>
                            <div class="email-display">
                            <p class="current-email-text">
                                {{ currentEmail }}
                            </p>
                            </div>
                        </div>

                        <div class="email-change-section">
                            <h3>Verify Identity</h3>
                            <div class="email-change-form">
                            <a-form
                                :model="passwordForm"
                                layout="vertical"
                                class="password-form"
                            >
                                <a-form-item 
                                label="Verification Code"
                                :rules="[{ required: true, message: 'Please input verification code!' }]"
                                >
                                <div class="email-input-group">
                                    <a-input 
                                    v-model:value="passwordForm.code" 
                                    placeholder="Please input verification code"
                                    class="custom-input"
                                    />
                                    <a-button 
                                    type="primary"
                                    @click="sendResetCode" 
                                    :disabled="cooldown > 0"
                                    class="send-code-btn"
                                    >
                                    {{ cooldown > 0 ? `${cooldown}s` : 'Send Code' }}
                                    </a-button>
                                </div>
                                </a-form-item>

                                <a-form-item 
                                label="New Password"
                                :rules="[
                                    { required: true, message: 'Please input new password!' },
                                    { validator: validatePassword }
                                ]"
                                >
                                <a-input-password
                                    v-model:value="passwordForm.newPassword"
                                    placeholder="Please input new password"
                                    class="custom-input"
                                />
                                <div class="password-strength" v-if="passwordForm.newPassword">
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
                                    v-model:value="passwordForm.confirmPassword"
                                    placeholder="Please confirm your password"
                                    class="custom-input"
                                />
                                </a-form-item>

                                <a-form-item>
                                <a-button
                                    type="primary"
                                    :loading="submitLoading"
                                    @click="handleChangePassword"
                                    class="change-email-btn"
                                >
                                    Change Password
                                </a-button>
                                </a-form-item>
                            </a-form>
                            </div>
                        </div>
                        </template>
                    </div>
                </template>
                </div>
            </div>
        </div>
  
    </page-layout>
  </template>
  
  <script>
  import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import PageLayout from './layout/PageLayout.vue'
  import { useRouter } from 'vue-router';
  import { SettingOutlined, DeleteOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons-vue'
  import apiClient from '../api/api';
  import { VERCEL_CONFIG } from '../config/vercelConfig';
  import NoSiteConfigured from './common/NoSiteConfigured.vue'
  import SmartBanner from './common/SmartBanner.vue'
  
  
  export default {
    name: 'AccountPage',
    components: {
      PageLayout,
      SettingOutlined,
      DeleteOutlined,
      ReloadOutlined,
      CloseOutlined,
      NoSiteConfigured,
      SmartBanner,
    },
    setup() {
      const PROJECT_ID = VERCEL_CONFIG.PROJECT_ID;
      const cooldown = ref(0);
      const cooldownTimer = ref(null);
      const router = useRouter();
      const goToDashboard = () => {
        router.push('/dashboard');
      };
      const activeTab = ref('login-email');
      const saving = ref(false);
      const productInfo = ref(null);
      const dnsColumns = [
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
        }
      ];
      const refreshing = ref(false);
      const handleRefresh = async () => {
        refreshing.value = true;
        try {
          await loadVercelDomainInfo();
          message.success('Refresh successfully');
        } catch (error) {
          message.error('Refresh failed');
        } finally {
          refreshing.value = false;
        }
      };
  
      const currentEmail = ref(localStorage.getItem('currentCustomerEmail') || '');
      const showEmailForm = ref(false);
      const emailForm = ref({
        newEmail: '',
        code: ''
      });
      const sendingCode = ref(false);
      const changing = ref(false);
  
      const isValidEmail = computed(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailForm.value.newEmail);
      });
  
      const canSubmit = computed(() => {
        return isValidEmail.value && emailForm.value.code.length > 0;
      });
  
      const showChangeEmailForm = () => {
        showEmailForm.value = true;
      };
  
      const sendVerificationCode = async () => {
        if (emailForm.value.newEmail === currentEmail.value) {
          message.error('Please enter a different email address from your current one');
          return;
        }
        sendingCode.value = true;
        try {
          const response = await apiClient.sendEmailCode(emailForm.value.newEmail, 'change_email');
          // 开始倒计时
          console.log('开始倒计时');
          cooldown.value = 60;
          console.log('当前cooldown值:', cooldown.value);
          cooldownTimer.value = setInterval(() => {
            cooldown.value--;
            console.log('倒计时:', cooldown.value);
            if (cooldown.value <= 0) {
              clearInterval(cooldownTimer.value);
            }
          }, 1000);
          if (response?.code === 200) {
            message.success('Code sent successfully');
          } else {
            message.error('Error sending code');
          }
        } catch (error) {
          console.error('Error sending code:', error);
          message.error('Error sending code, please try again later');
        } finally {
          sendingCode.value = false;
        }
      };
  
      const confirmEmailChange = () => {
        Modal.confirm({
          title: 'Confirm Email Change',
          content: emailForm.value.newEmail.includes('gmail.com') 
            ? 'After changing, the original email account will no longer be able to log in this account. Do you want to continue?'
            : 'Are you sure you want to change your login email?',
          okText: 'Confirm',
          cancelText: 'Cancel',
          async onOk() {
            changing.value = true;
            try {
              const response = await apiClient.changeEmail({
                newEmail: emailForm.value.newEmail,
                code: emailForm.value.code
              });
  
              if (response?.code === 200) {
                // 更新地存储的邮箱
                currentEmail.value = emailForm.value.newEmail;
                localStorage.setItem('currentCustomerEmail', emailForm.value.newEmail);
                
                // 重置表单
                showEmailForm.value = false;
                emailForm.value = { 
                  newEmail: '', 
                  code: '' 
                };
                
                message.success('Successfully changed email');
  
                // 显示登出提示并倒计时
                let secondsLeft = 3;
                const modal = Modal.success({
                  title: 'Success',
                  content: `You will be logged out in ${secondsLeft} seconds, please use the new email to log in`,
                  okText: 'OK',
                  keyboard: false,
                  maskClosable: false,
                });
  
                const timer = setInterval(() => {
                  secondsLeft -= 1;
                  modal.update({
                    content: `You will be logged out in ${secondsLeft} seconds, please use the new email to log in`,
                  });
  
                  if (secondsLeft <= 0) {
                    clearInterval(timer);
                    modal.destroy();
                    // 执行登出操作
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('intelickIsLoggedIn');
                    localStorage.removeItem('currentCustomer');
                    localStorage.removeItem('currentCustomerId'); 
                    router.push('/login');
                    message.success('Logged out, please use the new email to log in');
                  }
                }, 1000);
              } else {
                if(response?.code === 400 && response?.message === 'Email already exists') {
                  message.error('The new email address has already been registered, please try another one');
                } else if (response?.code === 400 && response?.message === 'Invalid verification code') {
                  message.error('The verification code is incorrect, please try again');
                } else {
                  message.error('Failed to change email, please try again later');
                }
              }
            } catch (error) {
              console.error('Failed to change email:', error);
              message.error(error.response?.data?.message || 'Failed to change email, please try again later');
            } finally {
              changing.value = false;
            }
          }
        });
      };
  
      const cancelEmailChange = () => {
        showEmailForm.value = false;
        emailForm.value = {
          newEmail: '',
          code: ''
        };
      };
  
      // 添加域名配置状态
      const domainConfigured = ref(false);
      const loading = ref(false);
  
      // 加载产品信息
      const loadProductInfo = async () => {
        loading.value = true;
        try {
          const customerId = localStorage.getItem('currentCustomerId');
          const response = await apiClient.getProductsByCustomerId(customerId);
          
          if (response?.code === 200 && response.data) {
            productInfo.value = response.data;
            // 修改为与 AssetsPage 一致的判断逻辑
            domainConfigured.value = response.data?.domainStatus || false;
            // 加载 Vercel 域名信息
            if (domainConfigured.value) {
              await loadVercelDomainInfo();
            }
          } else {
            productInfo.value = null;
            domainConfigured.value = false;
          }
        } catch (error) {
          console.error('Failed to load product information:', error);
          productInfo.value = null;
          domainConfigured.value = false;
        } finally {
          loading.value = false;
        }
      };
  
      // 处理 Vercel 域名信息
      const processVercelDomainInfo = async (response) => {
        if (!response?.domains || !productInfo.value?.projectWebsite) {
          return;
        }
  
        const currentDomain = productInfo.value.projectWebsite;
        
        // 过滤匹配的域名，排除主域名
        const matchingDomains = response.domains.filter(domain => {
          return domain.apexName === currentDomain && domain.name !== currentDomain;
        });
  
        // 为每个域名获取详细配置
        const domainsWithConfig = await Promise.all(
          matchingDomains.map(async (domain) => {
            try {
              const customerId = localStorage.getItem('currentCustomerId');
              let projectId = 'nextjs';
              
              if (customerId === '67525da4ba5fcadf228e56c1') {
                projectId = 'prj_7SXIhcIx5SOYKKVzhhRvnmUdoN7g';
              }
  
              const config = await apiClient.getVercelDomainConfig(domain.name);
              return {
                ...domain,
                verified: config.verified || false,
                configDetails: config
              };
            } catch (error) {
              console.error(`Failed to get config for domain ${domain.name}:`, error);
              return {
                ...domain,
                verified: false,
                configDetails: null
              };
            }
          })
        );
  
        console.log('域名配置更新：', domainsWithConfig);
      };
  
      // 添加新的方法来获取 Vercel 域名信息
      const loadVercelDomainInfo = async () => {
        try {
          const projectId = PROJECT_ID;
  
          const response = await apiClient.getVercelDomainInfo(projectId);
          await processVercelDomainInfo(response);
        } catch (error) {
          console.error('Failed to load Vercel domain info:', error);
          message.error('Failed to load domain information');
        }
      };
  
      // 监听 activeTab 变化
      watch(activeTab, (newValue) => {
        if (newValue === 'login-email') {
          showEmailForm.value = false;
          emailForm.value = {
            newEmail: '',
            code: ''
          };
        }
      });
  
      // 在组件挂载时加载产品信息
      onMounted(() => {
        loadProductInfo();
      });
  
      onBeforeUnmount(() => {
        if (cooldownTimer.value) {
          clearInterval(cooldownTimer.value);
        }
      });
  
      // 部署设置相关方法
      const saveDeploymentSettings = async () => {
        if (!deploymentForm.value.method) {
          message.error('Please select a deployment method');
          return;
        }
  
        if (deploymentForm.value.method === 'subdomain' && !deploymentForm.value.prefix) {
          message.error('Please enter a subdomain prefix');
          return;
        }
  
        if (deploymentForm.value.method === 'subdomain') {
          const currentSubdomains = currentDomainConfigs.value.length;
          if (currentSubdomains >= 2) {
            message.error('You can only add up to 2 subdomains');
            return;
          }
        }
  
        saving.value = true;
        try {
          const projectId = PROJECT_ID;
  
          const domainData = {
            name: `${deploymentForm.value.prefix}.${productInfo.value.projectWebsite}`
          };
  
          const response = await apiClient.addVercelDomain(projectId, domainData);
          
          if (response) {
            message.success('Domain added successfully');
            await loadVercelDomainInfo();
            deploymentForm.value.prefix = '';
          }
        } catch (error) {
          console.error('Failed to save deployment settings:', error);
          if (error.response?.data?.error?.code === 'domain_already_in_use') {
            message.info('This subdomain has already been submitted. Please add the DNS records as instructed, then click the verify button.');
          } else {
            message.error('Failed to save settings');
          }
        } finally {
          saving.value = false;
        }
      };
  
      const getDomainStatusColor = (domain) => {
        if (domain.verified) {
          return 'success';
        }
        if (!domain.configDetails?.misconfigured) {
          return 'success';
        }
        return 'warning';
      };
  
      const getDomainStatusText = (domain) => {
        if (domain.verified) {
          return 'Verified';
        }
        if (!domain.configDetails?.misconfigured) {
          return 'Verified';
        }
        return 'Pending';
      };
  
      const passwordForm = ref({
        newPassword: '',
        confirmPassword: '',
        code: ''
      });
      const submitLoading = ref(false);
      const passwordStrength = ref('');
      const passwordStrengthClass = computed(() => {
        const password = passwordForm.value.newPassword;
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
      });
  
      const validatePassword = (rule, value) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!value) {
          return Promise.reject('Please input your password!');
        }
        if (!passwordRegex.test(value)) {
          return Promise.reject('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        }
        return Promise.resolve();
      };
  
      const validateConfirmPassword = (rule, value) => {
        if (!value) {
          return Promise.reject('Please confirm your password!');
        }
        if (value !== passwordForm.value.newPassword) {
          return Promise.reject('The two passwords do not match!');
        }
        return Promise.resolve();
      };
  
      const handleSetPassword = async () => {
        if (!passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
          message.error('Please fill in all fields');
          return;
        }
  
        submitLoading.value = true;
        try {
          const response = await apiClient.changePassword({
            newPassword: passwordForm.value.newPassword,
            confirmPassword: passwordForm.value.confirmPassword
          });
  
          if (response?.code === 200) {
            message.success('Password set successfully');
            await loadProductInfo();
          }
        } catch (error) {
          message.error('Failed to set password');
        } finally {
          submitLoading.value = false;
        }
      };
  
      const handleChangePassword = async () => {
        if (!passwordForm.value.code || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
          message.error('Please fill in all fields');
          return;
        }
  
        submitLoading.value = true;
        try {
          const response = await apiClient.resetPassword({
            email: productInfo.value.email,
            code: passwordForm.value.code,
            newPassword: passwordForm.value.newPassword,
            confirmPassword: passwordForm.value.confirmPassword
          });
  
          if (response?.code === 200) {
            message.success('Password changed successfully');
            passwordForm.value = {
              code: '',
              newPassword: '',
              confirmPassword: ''
            };
          }
        } catch (error) {
          message.error('Failed to change password');
        } finally {
          submitLoading.value = false;
        }
      };
  
      const sendResetCode = async () => {
        try {
          await apiClient.sendEmailCode(productInfo.value.email, 'reset_password');
          
          cooldown.value = 60;
          cooldownTimer.value = setInterval(() => {
            cooldown.value--;
            if (cooldown.value <= 0) {
              clearInterval(cooldownTimer.value);
            }
          }, 1000);
  
          message.success('Verification code has been sent to your email');
        } catch (error) {
          message.error('Failed to send verification code');
        }
      };
  
      return {
        cooldown,
        goToDashboard,
        activeTab,
        saving,
        productInfo,
        loadProductInfo,
        loadVercelDomainInfo,
        currentEmail,
        showEmailForm,
        emailForm,
        sendingCode,
        changing,
        isValidEmail,
        canSubmit,
        showChangeEmailForm,
        sendVerificationCode,
        confirmEmailChange,
        cancelEmailChange,
        getDomainStatusColor,
        getDomainStatusText,
        refreshing,
        handleRefresh,
        passwordForm,
        submitLoading,
        passwordStrength,
        passwordStrengthClass,
        validatePassword,
        validateConfirmPassword,
        handleSetPassword,
        handleChangePassword,
        sendResetCode,
      };
    }
  }
  </script>
  
  <style scoped>
  /* 基础布局样式 */
  .page-content {
    display: flex;
    gap: 24px;
  }
  
  .settings-content {
    flex: 1;
    background: white;
    border-radius: 16px;
    min-height: calc(100vh - 200px);
    position: relative;
  }
  
  .upload-btn-empty {
    background: linear-gradient(135deg, #60A5FA, #3B82F6);
    border: none;
    padding: 0 24px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    height: 40px;
    color: white;
  }
  
  /* Domain 设置样式 */
  .domain-settings {
    background: white;
    border-radius: 16px;
  }
  
  .current-domain {
    margin-top: 12px;
    margin-bottom: 24px;
    padding: 24px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .current-domain h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
  
  .website-url {
    font-size: 18px;
    color: #3B82F6;
    margin: 0;
    font-weight: 500;
  }
  
  .deployment-settings {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .deployment-settings h3 {
    margin: 0 0 24px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
  
  .deployment-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .deployment-option {
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
  }
  
  .deployment-option.active {
    border-color: #3B82F6;
    background: #F0F7FF;
  }
  
  .deployment-option:hover {
    border-color: #3B82F6;
  }
  
  .option-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .option-header h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }
  
  .option-description {
    margin: 0;
    font-size: 13px;
    color: #6B7280;
    line-height: 1.5;
  }
  
  .input-section {
    background: #f9fafb;
    padding: 24px;
    border-radius: 12px;
    margin-top: 24px;
  }
  
  .input-section .section-header {
    margin-bottom: 24px;
  }
  
  .input-section .section-header h3 {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }
  
  .url-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
  }
  
  .url-separator {
    color: #6B7280;
    font-weight: 500;
  }
  
  .base-domain {
    color: #374151;
    font-weight: 500;
  }
  
  .custom-input {
    width: 100%;
  }
  
  .custom-input :deep(.ant-input) {
    border-radius: 8px;
    border-color: #d1d5db;
  }
  
  .custom-input :deep(.ant-input:focus) {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  .save-btn {
    background: linear-gradient(135deg, #60A5FA, #3B82F6);
    border: none;
    height: 40px;
    padding: 0 24px;
    font-weight: 500;
    border-radius: 8px;
    margin-top: 8px;
  }
  
  .save-btn:hover {
    background: linear-gradient(135deg, #3B82F6, #2563EB);
  }
  
  /* Ant Design 组件样式覆盖 */
  :deep(.ant-form-item-label > label) {
    font-weight: 500;
    color: #374151;
  }
  
  :deep(.ant-radio-wrapper) {
    color: #374151;
  }
  
  :deep(.ant-radio-checked .ant-radio-inner) {
    border-color: #3B82F6;
    background: #3B82F6;
  }
  
  :deep(.ant-radio:hover .ant-radio-inner) {
    border-color: #3B82F6;
  }
  
  :deep(.ant-modal-content) {
    border-radius: 12px;
    overflow: hidden;
  }
  
  :deep(.ant-select-selector) {
    border-right: none !important;
  }
  
  :deep(.ant-input-group) .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    border-right: none;
    box-shadow: none !important;
  }
  
  /* 修改加载状态样式 */
  :deep(.ant-spin-nested-loading) {
    position: relative;
    width: 100%;
  }
  
  :deep(.ant-spin-container) {
    height: 100%;
  }
  
  :deep(.ant-spin) {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    max-height: none;
  }
  
  :deep(.ant-spin-spinning) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  /* 添加新的容器类 */
  .settings-container {
    width: 100%;
    min-height: calc(100vh - 200px);
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .deployment-options {
      grid-template-columns: 1fr;
    }
    
    .custom-input {
      width: 100%;
    }
  }
  
  /* 添加以下 CSS 样式 */
  .main-tabs {
    margin: 0;
    background: white;
    border-radius: 16px 16px 0 0;
  }
  
  :deep(.ant-tabs-nav) {
    margin: 0 !important;
  }
  
  :deep(.ant-tabs-nav::before) {
    border-bottom: 1px solid #E5E7EB;
  }
  
  :deep(.ant-tabs-ink-bar) {
    background: #3B82F6 !important;
  }
  
  :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #3B82F6 !important;
  }
  
  :deep(.ant-tabs-tab:hover) {
    color: #60A5FA !important;
  }
  
  .account-settings {
    background: white;
    border-radius: 12px;
  }
  
  .current-email-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    margin-bottom: 24px;
  }
  
  .current-email-section h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
  
  .email-display {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  .current-email-text {
    font-size: 15px;
    color: #374151;
    margin: 0;
    padding: 8px 0;
  }
  
  .change-email-btn {
    background: linear-gradient(135deg, #60A5FA, #3B82F6);
    border: none;
    height: 40px;
    padding: 0 24px;
    font-weight: 500;
    border-radius: 8px;
  }
  
  .email-change-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .email-change-section h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
  
  .email-change-form {
    background: #f9fafb;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .email-input-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .email-input-group .custom-input {
    flex: 1;
  }
  
  .send-code-btn {
    background: linear-gradient(135deg, #60A5FA, #3B82F6);
    border: none;
    height: 40px;
    padding: 0 24px;
    font-weight: 500;
    border-radius: 8px;
    white-space: nowrap;
  }
  
  :deep(.ant-form-item-label > label) {
    font-weight: 500;
    color: #374151;
  }
  
  :deep(.ant-input) {
    border-radius: 8px;
    border-color: #d1d5db;
  }
  
  :deep(.ant-input:focus) {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-header h3 {
    margin: 0;
  }
  
  .cancel-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
  }
  
  .cancel-btn:hover {
    color: #60A5FA;
    background: #F0F7FF;
    border-radius: 4px;
  }
  
  .password-notice {
    margin-bottom: 24px;
  }
  
  .password-form {
    max-width: 300px;
  }
  
  .current-email {
    margin-bottom: 24px;
  }
  
  .current-email h3 {
    margin-bottom: 8px;
    color: #1f2937;
  }
  
  .current-email p {
    color: #374151;
    font-size: 16px;
  }
  
  .email-verify-group {
    display: flex;
    gap: 12px;
  }
  
  .verify-code-btn {
    min-width: 100px;
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
  </style> 