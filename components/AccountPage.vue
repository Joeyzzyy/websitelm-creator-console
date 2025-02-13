<template>
    <page-layout
      title="Settings"
      description="Configure your website settings and deployment options"
      icon="⚙️"
    >
      <smart-banner
        :theme="{
          primary: '#7C3AED',
          secondary: '#EC4899',
          background: 'linear-gradient(135deg, #F5F3FF, #FCE7F3)',
          textColor: '#2D3748',
          descriptionColor: '#4A5568',
          badgeColor: '#6B7280',
          badgeBackground: 'rgba(124, 58, 237, 0.1)',
          badgeHoverBackground: 'rgba(236, 72, 153, 0.1)',
          badgeHoverColor: '#EC4899',
          iconBackground: 'rgba(124, 58, 237, 0.1)',
        }"
        title="Account Setting"
        description="Configure your account settings, manage login email and password."
        :badges="[
          { text: 'Login Email' },
          { text: 'Password' },
          { text: 'Plan Usage' },
        ]"
      />
        <div class="settings-content">
            <a-tabs 
                class="main-tabs"
                v-model:activeKey="activeTab"
            >
                <a-tab-pane key="login-email" tab="Login Email Setting" />
                <a-tab-pane key="password" tab="Password Setting" />
                <a-tab-pane key="plan-usage" tab="Plan Usage" />
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
                                ref="formRef"
                                :model="passwordForm"
                                layout="vertical"
                                class="password-form"
                                :rules="{
                                  newPassword: [
                                    { required: true, validator: validatePassword, trigger: 'change' }
                                  ],
                                  confirmPassword: [
                                    { required: true, validator: validateConfirmPassword, trigger: 'change' }
                                  ]
                                }"
                            >
                                <a-form-item 
                                name="newPassword"
                                label="New Password"
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
                                name="confirmPassword"
                                label="Confirm Password"
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
                                ref="formRef"
                                :model="passwordForm"
                                layout="vertical"
                                class="password-form"
                                :rules="{
                                  newPassword: [
                                    { required: true, validator: validatePassword, trigger: 'change' }
                                  ],
                                  confirmPassword: [
                                    { required: true, validator: validateConfirmPassword, trigger: 'change' }
                                  ]
                                }"
                            >
                                <a-form-item 
                                label="Verification Code"
                                name="code"
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
                                name="newPassword"
                                label="New Password"
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
                                name="confirmPassword"
                                label="Confirm Password"
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

                <template v-if="activeTab === 'plan-usage'">
                    <div class="subscription-info">
                        <div class="current-plan">
                            <h3>{{ currentPlan.name }} Plan</h3>
                            <div class="plan-period">
                                {{ currentPlan.period === 'monthly' ? 'Monthly Billing' : 'Annual Billing' }}
                            </div>
                            <div class="plan-expiry" v-if="currentPlan.endDate">
                                <span>Expires: {{ formatDate(currentPlan.endDate) }}</span>
                                <span class="remaining-days">({{ currentPlan.remainingDays }} days remaining)</span>
                            </div>
                        </div>
                        
                        <div class="usage-grid">
                            <div class="usage-column">
                                <div 
                                    v-for="(usage, index) in usageInfo.slice(0, Math.ceil(usageInfo.length/2))" 
                                    :key="index"
                                    class="usage-item"
                                >
                                    <div class="usage-header">
                                        <div class="usage-label">{{ usage.label }}</div>
                                        <div class="usage-description">{{ usage.description }}</div>
                                    </div>
                                    <div class="usage-stats">
                                        <div class="usage-numbers">
                                            <span class="font-medium">
                                                {{ usage.total === 999999999 ? 'Unlimited' : `${usage.used}/${usage.total}` }}
                                            </span>
                                        </div>
                                        <div class="usage-period">
                                            {{ usage.total === 999999999 ? '' : usage.unit }}
                                        </div>
                                    </div>
                                    <div class="usage-bar" v-if="usage.total !== 999999999">
                                        <div 
                                            class="usage-progress"
                                            :style="{ 
                                                width: `${(usage.used / usage.total) * 100}%`,
                                                background: usage.used/usage.total > 0.9 ? '#ff4d4f' : '#1890ff'
                                            }"
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div class="usage-column">
                                <div 
                                    v-for="(usage, index) in usageInfo.slice(Math.ceil(usageInfo.length/2))" 
                                    :key="index"
                                    class="usage-item"
                                >
                                    <div class="usage-header">
                                        <div class="usage-label">{{ usage.label }}</div>
                                        <div class="usage-description">{{ usage.description }}</div>
                                    </div>
                                    <div class="usage-stats">
                                        <div class="usage-numbers">
                                            <span class="font-medium">
                                                {{ usage.total === 999999999 ? 'Unlimited' : `${usage.used}/${usage.total}` }}
                                            </span>
                                        </div>
                                        <div class="usage-period">
                                            {{ usage.total === 999999999 ? '' : usage.unit }}
                                        </div>
                                    </div>
                                    <div class="usage-bar" v-if="usage.total !== 999999999">
                                        <div 
                                            class="usage-progress"
                                            :style="{ 
                                                width: `${(usage.used / usage.total) * 100}%`,
                                                background: usage.used/usage.total > 0.9 ? '#ff4d4f' : '#1890ff'
                                            }"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
  import dayjs from 'dayjs';
  
  
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
      watch(activeTab, async (newValue) => {
        if (newValue === 'login-email') {
          showEmailForm.value = false;
          emailForm.value = {
            newEmail: '',
            code: ''
          };
        } else if (newValue === 'password') {
          try {
            const response = await apiClient.getUserInfo();
            if (response?.code === 200) {
              productInfo.value = {
                ...productInfo.value,
                isFirstLogin: response.data.firstLogin
              };
            }
          } catch (error) {
            console.error('获取用户信息失败:', error);
            message.error('获取用户信息失败');
          }
        }
      });
  
      onMounted(() => {
        loadProductInfo();
        loadPackageInfo();
      });
  
      onBeforeUnmount(() => {
        if (cooldownTimer.value) {
          clearInterval(cooldownTimer.value);
        }
      });
  
      // 添加加载套餐信息的方法
      const loadPackageInfo = async () => {
        try {
          const response = await apiClient.getCustomerPackage();
          if (response?.data) {
            const packageData = response.data;
            
            currentPlan.value = {
              name: packageData.packageName?.trim() || 'Professional',
              period: packageData.packageName?.toLowerCase().includes('monthly') ? 'monthly' : 'yearly',
              endDate: packageData.packageEndTime,
              remainingDays: packageData.remainingDays
            };
            
            usageInfo.value = [
              {
                label: 'Outline Generator',
                used: packageData.outlineGeneratorUsage || 0,
                total: packageData.outlineGeneratorLimit || 999999999,
                unit: 'times/month',
                description: 'AI-powered outline generation'
              },
              {
                label: 'Page Generator',
                used: packageData.pageGeneratorUsage || 0,
                total: packageData.pageGeneratorLimit || 999999999,
                unit: 'times/month',
                description: 'SEO-optimized page creation'
              },
              {
                label: 'Internal Links Storage',
                used: packageData.internalLinkStorageUsage || 0,
                total: packageData.internalLinkStorageLimit || 999999999,
                unit: 'links',
                description: 'Store and manage internal link structure'
              },
              {
                label: 'Free Page Deployment',
                used: packageData.freeDeploymentPageUsage || 0,
                total: packageData.freeDeploymentPageLimit || 999999999,
                unit: 'times/year',
                description: 'Number of pages that can be deployed'
              },
              {
                label: 'Image Storage',
                used: packageData.imageStorageUsage || 0,
                total: packageData.imageStorageLimit || 999999999,
                unit: 'images',
                description: 'Store and optimize images'
              },
            ];
          }
        } catch (error) {
          console.error('Failed to load package information:', error);
          message.error('Failed to load subscription details');
        }
      };
  
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
  
      const formRef = ref();
      const passwordForm = ref({
        newPassword: '',
        confirmPassword: '',
        code: ''
      });
      const submitLoading = ref(false);
      const passwordStrength = computed(() => {
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
  
      const passwordStrengthClass = computed(() => {
        switch(passwordStrength.value) {
          case 'Strong': return 'strength-strong';
          case 'Medium': return 'strength-medium';
          case 'Weak': return 'strength-weak';
          default: return '';
        }
      });
  
      const validatePassword = async (_rule, value) => {
        if (!value) {
          throw new Error('Please input your password!');
        }
        if (value.length < 8) {
          throw new Error('Password must be at least 8 characters!');
        }
        if (!/[A-Z]/.test(value)) {
          throw new Error('Password must contain at least one uppercase letter!');
        }
        if (!/[a-z]/.test(value)) {
          throw new Error('Password must contain at least one lowercase letter!');
        }
        if (!/\d/.test(value)) {
          throw new Error('Password must contain at least one number!');
        }
      };
  
      const validateConfirmPassword = async (_rule, value) => {
        if (!value) {
          throw new Error('Please confirm your password!');
        }
        if (value !== passwordForm.value.newPassword) {
          throw new Error('The two passwords do not match!');
        }
      };
  
      const handleSetPassword = async () => {
        try {
          await formRef.value.validate();
          submitLoading.value = true;
          
          const response = await apiClient.changePassword({
            currentPassword: '', 
            newPassword: passwordForm.value.newPassword,
            confirmPassword: passwordForm.value.confirmPassword,
            isInitPassword: true
          });

          if (response?.code === 200) {
            message.success('Password set successfully');
            await loadProductInfo();
            passwordForm.value = {
              newPassword: '',
              confirmPassword: '',
              code: ''
            };
          } else {
            message.error(response.message || 'Password setting failed');
          }
        } catch (error) {
          if (error.response?.data) {
            message.error(error.response.data.message || 'Password setting failed');
          } else {
            message.error('Password setting failed');
          }
        } finally {
          submitLoading.value = false;
        }
      };
  
      const handleChangePassword = async () => {
        try {
          await formRef.value.validate();
          submitLoading.value = true;
          
          const response = await apiClient.resetPassword({
            email: currentEmail.value,
            code: passwordForm.value.code,
            newPassword: passwordForm.value.newPassword,
            confirmPassword: passwordForm.value.confirmPassword
          });

          if (response?.code === 200) {
            message.success('Password changed successfully');
            // 清空表单
            passwordForm.value = {
              code: '',
              newPassword: '',
              confirmPassword: ''
            };
            // 清除倒计时
            cooldown.value = 0;
            if (cooldownTimer.value) {
              clearInterval(cooldownTimer.value);
              cooldownTimer.value = null;
            }
          } else {
            // 处理错误响应
            if (response?.code === 400) {
              if (response.message === 'Invalid verification code') {
                message.error('The verification code is incorrect');
              } else {
                message.error(response.message || 'Failed to change password');
              }
            }
          }
        } catch (error) {
          // 处理 API 调用错误
          if (error.response?.data) {
            message.error(error.response.data.message || 'Failed to change password');
          } else {
            message.error('Failed to change password');
          }
        } finally {
          submitLoading.value = false;
        }
      };
  
      const sendResetCode = async () => {
        try {
          await apiClient.sendEmailCode(currentEmail.value, 'forgot_password');
          
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
  
      const currentPlan = ref({
        name: '',
        period: 'monthly',
        endDate: null,
        remainingDays: 0
      });

      const usageInfo = ref([]);

      const formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
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
        currentPlan,
        usageInfo,
        formatDate,
        formRef,
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
    max-width: 400px;
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
    margin-top: 24px;
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
    max-width: 400px;
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
    max-width: 400px;
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
  
  /* 确保验证码输入框组的响应式布局 */
  @media (max-width: 500px) {
    .email-input-group {
      flex-direction: column;
    }
    
    .send-code-btn {
      width: 100%;
    }
  }

  .subscription-info {
    padding: 24px;
  }

  .current-plan {
    margin-bottom: 24px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%);
    border-radius: 12px;
    border: 1px solid rgba(24, 144, 255, 0.2);
  }

  .current-plan h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
  }

  .plan-period {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }

  .plan-expiry {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }

  .remaining-days {
    margin-left: 8px;
    color: #ff4d4f;
  }

  .usage-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .usage-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .usage-item {
    padding: 16px;
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
  }

  .usage-header {
    margin-bottom: 12px;
  }

  .usage-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .usage-description {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }

  .usage-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .usage-numbers {
    font-size: 14px;
    color: #333;
  }

  .usage-period {
    font-size: 12px;
    color: #666;
  }

  .usage-bar {
    height: 4px;
    background: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .usage-progress {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  @media (max-width: 768px) {
    .usage-grid {
      grid-template-columns: 1fr;
    }
  }
  </style> 