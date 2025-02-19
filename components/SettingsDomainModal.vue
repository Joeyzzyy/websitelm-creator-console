<template>
  <a-modal
    :visible="visible"
    title="Settings"
    :width="800"
    :footer="null"
    @update:visible="$emit('update:visible', $event)"
    @cancel="handleCancel"
  >
    <a-spin 
      :spinning="loading"
      class="centered-spin"
    >
      <template v-if="domainConfigured">
        <div class="settings-content">
          <div class="settings-container">
            <div v-if="!domainLoading">
              <div class="domain-settings">
                <div class="current-domain">
                  <h3>Current Site</h3>
                  <p class="website-url">{{ productInfo?.projectWebsite }}</p>
                </div>
                <div class="deployment-settings">
                  <h3>Deployment Settings</h3>
                  <a-form
                    :model="deploymentForm"
                    layout="vertical"
                  >
                    <a-form-item>
                      <div class="deployment-options">
                        <div 
                          class="deployment-option"
                          :class="{ active: deploymentForm.method === 'subdomain' }"
                          @click="deploymentForm.method = 'subdomain'"
                        >
                          <div class="option-header">
                            <div class="radio-wrapper">
                              <a-radio :checked="deploymentForm.method === 'subdomain'" />
                            </div>
                            <h4>Subdomain</h4>
                          </div>
                          <p class="option-description">
                            blog.yourdomain.com
                          </p>
                        </div>

                        <div 
                          class="deployment-option"
                          :class="{ active: deploymentForm.method === 'subfolder' }"
                          @click="deploymentForm.method = 'subfolder'"
                        >
                          <div class="option-header">
                            <div class="radio-wrapper">
                              <a-radio :checked="deploymentForm.method === 'subfolder'" />
                            </div>
                            <h4>Subfolder</h4>
                          </div>
                          <p class="option-description">
                            yourdomain.com/blog
                          </p>
                        </div>
                      </div>
                    </a-form-item>

                    <div class="input-section" v-if="deploymentForm.method === 'subfolder'">
                      <a-spin :spinning="subfolderLoading">
                        <div class="current-domain">
                          <h3>Current Site</h3>
                          <div class="domain-verification">
                            <p class="website-url">{{ productInfo?.projectWebsite }}</p>
                            <a-button 
                              v-if="showStartVerifying"
                              @click="handleStartVerifying"
                            >
                              Start Verifying
                            </a-button>
                          </div>
                        </div>

                        <div class="verification-status" v-if="subfolderDomainConfig">
                          <div class="domains-header">
                            <h3>Domain Verification</h3>
                            <div class="domain-actions">
                              <a-button 
                                :loading="refreshingSubfolder"
                                @click="handleSubfolderRefresh"
                              >
                                Refresh
                              </a-button>
                            </div>
                          </div>
                          
                          <template v-if="subfolderDomainConfig.misconfigured">
                            <div class="dns-config-alert">
                              <a-alert
                                type="warning"
                                show-icon
                                message="DNS Configuration Required"
                                description="Please add the following DNS record to your domain provider:"
                              />
                              <div class="dns-table-wrapper">
                                <a-table
                                  :dataSource="[{
                                    type: 'A',
                                    name: '@',
                                    value: '76.76.21.21'
                                  }]"
                                  :columns="dnsColumnsWithActions"
                                  :pagination="false"
                                  size="small"
                                  class="dns-table"
                                />
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="verification-header">
                              <a-alert
                                type="success"
                                show-icon
                                message="Domain Verified"
                                description="Your domain has been successfully verified"
                                class="success-alert"
                              >
                                <template #message>
                                  <div class="alert-content">
                                    <span>Domain Verified</span>
                                  </div>
                                </template>
                                <template #action>
                                  <a-button 
                                    type="link" 
                                    danger
                                    @click="showDeleteSubfolderDomainConfirm"
                                    class="delete-btn"
                                  >
                                    <delete-outlined />
                                  </a-button>
                                </template>
                              </a-alert>
                            </div>
                          </template>
                        </div>

                        <template v-if="subfolderDomainConfig">
                          <template v-if="!subfolderDomainConfig.misconfigured">
                            <div class="section-header">
                              <h3>Subfolder Management</h3>
                              <a-button type="primary" @click="showSubfolderModal = true">
                                Add Subfolder
                              </a-button>
                            </div>

                            <!-- 添加子文件夹的模态框 -->
                            <a-modal
                              v-model:visible="showSubfolderModal"
                              title="Add Subfolder"
                              @ok="handleAddSubfolder"
                              :confirmLoading="savingSubfolders"
                            >
                              <a-form-item label="Subfolder Name">
                                <a-input
                                  v-model:value="newSubfolder"
                                  placeholder="Enter subfolder name"
                                />
                              </a-form-item>
                            </a-modal>

                            <div class="subfolder-list">
                              <a-table 
                                :dataSource="subfolders" 
                                :columns="subfolderColumns" 
                                :pagination="false"
                              >
                                <template #bodyCell="{ column, record }">
                                  <template v-if="column.key === 'text'">
                                    <span>{{ record }}</span>
                                  </template>
                                  <template v-if="column.key === 'action'">
                                    <a-button type="link" danger @click="confirmDeleteSubfolder(record)">
                                      Delete
                                    </a-button>
                                  </template>
                                  <template v-if="column.key === 'preview'">
                                    <span>{{ productInfo?.projectWebsite }}/{{ record }}</span>
                                  </template>
                                </template>
                              </a-table>
                            </div>
                          </template>
                        </template>
                      </a-spin>
                    </div>
                    <div class="input-section" v-if="deploymentForm.method === 'subdomain'">
                      <a-form-item 
                        label="Enter your subdomain"
                        required
                      >
                        <div class="url-preview">
                          <a-input
                            v-model:value="deploymentForm.prefix"
                            placeholder="blog"
                            :disabled="saving"
                            class="custom-input"
                          />
                          <span class="url-separator">.</span>
                          <span class="base-domain">{{ productInfo?.projectWebsite }}</span>
                        </div>
                      </a-form-item>
                      <a-form-item>
                        <div class="button-group">
                          <a-button 
                            type="primary"
                            :loading="saving"
                            @click="saveDeploymentSettings"
                            class="save-btn"
                          >
                            Add
                          </a-button>
                          <a-button 
                            :loading="refreshing"
                            @click="handleRefresh"
                          >
                            Refresh
                          </a-button>
                        </div>
                      </a-form-item>

                      <a-spin :spinning="subdomainLoading">
                        <div class="configured-domains" v-if="currentDomainConfigs?.length > 0">
                          <div class="domain-list">
                            <div v-for="domain in currentDomainConfigs" :key="domain.name" class="domain-item">
                              <div class="domain-info">
                                <span class="domain-name">{{ domain.name }}</span>
                                <a-tag :color="getDomainStatusColor(domain)">
                                  {{ getDomainStatusText(domain) }}
                                </a-tag>
                              </div>
                              <template v-if="domain.configDetails?.misconfigured">
                                <div class="dns-config-alert">
                                  <a-alert
                                    type="warning"
                                    show-icon
                                    message="DNS Configuration Required"
                                    description="Please add the following DNS record to your domain provider:"
                                  />
                                  <div class="dns-table-wrapper">
                                    <a-table
                                      :dataSource="[{
                                        type: 'CNAME',
                                        name: domain.name.split('.')[0],
                                        value: 'cname.vercel-dns.com.'
                                      }]"
                                      :columns="dnsColumns"
                                      :pagination="false"
                                      size="small"
                                      class="dns-table"
                                    >
                                    </a-table>
                                  </div>
                                </div>
                              </template>
                              <div class="domain-actions">
                                <span class="domain-date">Added on {{ new Date(domain.createdAt).toLocaleDateString() }}</span>
                                <a-button 
                                  type="link" 
                                  danger
                                  @click="showDeleteConfirm(domain.name)"
                                >
                                  <delete-outlined />
                                </a-button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a-spin>
                    </div>
                  </a-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 添加域名未配置的提示 -->
      <template v-else>
        <no-site-configured v-if="!loading"/>
      </template>
    </a-spin>
  </a-modal>
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
  name: 'SettingsModal',
  components: {
    PageLayout,
    SettingOutlined,
    DeleteOutlined,
    ReloadOutlined,
    CloseOutlined,
    NoSiteConfigured,
    SmartBanner,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    productInfo: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const PROJECT_ID = VERCEL_CONFIG.PROJECT_ID;
    const cooldown = ref(0);
    const cooldownTimer = ref(null);
    const router = useRouter();
    const goToDashboard = () => {
      router.push('/dashboard');
    };
    const domainLoading = ref(false);
    const subdomainLoading = ref(false);
    const domainModalVisible = ref(false);
    const savingDomain = ref(false);
    const websitePrefix = ref('https://');
    const domainForm = ref({
      domain: ''
    });
    const deploymentForm = ref({
      method: 'subdomain',
      prefix: '',
      suffix: '',
    });
    const saving = ref(false);
    const vercelDomainInfo = ref(null);
    const currentDomainConfigs = ref([]);
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

    const showDeleteConfirm = (domainName) => {
      Modal.confirm({
        title: 'Confirm Delete',
        content: `Are you sure you want to delete subdomain ${domainName}?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          try {
            await apiClient.deleteVercelDomain(PROJECT_ID, domainName);
            message.success('Domain deleted successfully');
            await loadVercelDomainInfo();
          } catch (error) {
            console.error('Failed to delete domain:', error);
            message.error('Failed to delete domain');
          }
        },
      });
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
          props.productInfo = response.data;
          domainConfigured.value = response.data?.domainStatus || false;
          
          // 重置表单状态
          deploymentForm.value = {
            method: 'subdomain',
            prefix: '',
            suffix: '',
          };
          
          // 如果配置了域名,加载 Vercel 域名信息
          if (domainConfigured.value) {
            await loadVercelDomainInfo();
            await loadSubfolders();
          }
        } else {
          props.productInfo = null;
          domainConfigured.value = false;
        }
      } catch (error) {
        console.error('Failed to load product information:', error);
        props.productInfo = null;
        domainConfigured.value = false;
      } finally {
        loading.value = false;
      }
    };

    // 处理 Vercel 域名信息
    const processVercelDomainInfo = async (response) => {
      if (!response?.domains || !props.productInfo?.projectWebsite) {
        currentDomainConfigs.value = [];
        return;
      }

      const currentDomain = props.productInfo.projectWebsite;
      
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

      currentDomainConfigs.value = domainsWithConfig;
      console.log('域名配置更新：', currentDomainConfigs.value);
    };

    // 添加新的方法来获取 Vercel 域名信息
    const loadVercelDomainInfo = async () => {
      try {
        subdomainLoading.value = true;
        const projectId = PROJECT_ID;

        const response = await apiClient.getVercelDomainInfo(projectId);
        vercelDomainInfo.value = response;
        await processVercelDomainInfo(response);
      } catch (error) {
        console.error('Failed to load Vercel domain info:', error);
        message.error('Failed to load domain information');
      } finally {
        subdomainLoading.value = false;
      }
    };

    // 修改loadSubfolders方法
    const loadSubfolders = async () => {
      try {
        subfolderLoading.value = true;
        const response = await apiClient.getSubfolders();
        if (response?.code === 200 && response?.data) {
          subfolders.value = response.data;
        } else {
          subfolders.value = [];
        }
      } catch (error) {
        console.error('Failed to load subfolders:', error);
        message.error('Failed to load subfolder list');
        subfolders.value = [];
      } finally {
        subfolderLoading.value = false;
      }
    };

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
          name: `${deploymentForm.value.prefix}.${props.productInfo.projectWebsite}`
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

    const subfolders = ref([]);
    const savingSubfolders = ref(false);
    const showSubfolderModal = ref(false);
    const newSubfolder = ref('');

    const subfolderColumns = [
      {
        title: 'Subfolder',
        dataIndex: '',
        key: 'text',
        render: (text) => text
      },
      {
        title: 'Preview',
        key: 'preview',
      },
      {
        title: 'Action',
        key: 'action',
      },
    ];

    const confirmDeleteSubfolder = (subfolder) => {
      Modal.confirm({
        title: 'Delete Subfolder',
        content: `Are you sure you want to delete this subfolder?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          try {
            const subfoldersToSave = subfolders.value.filter(item => item !== subfolder);
            await apiClient.updateSubfolders(subfoldersToSave);
            await loadSubfolders(); // 重新加载数据
            message.success('Subfolder deleted successfully');
          } catch (error) {
            console.error('Failed to delete subfolder:', error);
            message.error('Failed to delete subfolder');
          }
        },
      });
    };

    const handleAddSubfolder = async () => {
      if (!newSubfolder.value) {
        message.warning('Please enter a subfolder name');
        return;
      }

      // 检查是否已存在相同的子文件夹
      const normalizedNewSubfolder = newSubfolder.value.toLowerCase().trim();
      const exists = subfolders.value.some(item => 
        item.toLowerCase().trim() === normalizedNewSubfolder
      );

      if (exists) {
        message.error('This subfolder already exists');
        return;
      }

      try {
        savingSubfolders.value = true;
        const newSubfolders = [...subfolders.value, newSubfolder.value.trim()];

        await apiClient.updateSubfolders(newSubfolders);
        await loadSubfolders(); // 重新加载数据
        newSubfolder.value = '';
        showSubfolderModal.value = false;
        message.success('Subfolder added successfully');
      } catch (error) {
        console.error('Failed to add subfolder:', error);
        message.error('Failed to add subfolder');
      } finally {
        savingSubfolders.value = false;
      }
    };

    const saveSubfolders = async () => {
      try {
        savingSubfolders.value = true;
        // 转换回字符串数组格式再发送
        const subfoldersToSave = subfolders.value.map(item => item.text);

        console.log('subfoldersToSave', subfoldersToSave);
        
        await apiClient.updateSubfolders(subfoldersToSave);
        
        message.success('Subfolders saved successfully');
      } catch (error) {
        console.error('Failed to save subfolders:', error);
        message.error('Failed to save subfolders');
      } finally {
        savingSubfolders.value = false;
      }
    };

    const subfolderLoading = ref(false);

    const subfolderDomainConfig = ref(null);
    const verifyingSubfolder = ref(false);
    const refreshingSubfolder = ref(false);

    const startVerifyingSubfolder = async () => {
      try {
        verifyingSubfolder.value = true;
        const projectId = PROJECT_ID;
        
        // 1. 向 Vercel 发送主域名验证请求
        const domainData = {
          name: props.productInfo.projectWebsite // 使用主域名
        };
        
        // 2. 调用 Vercel API 进行域名验证
        const response = await apiClient.addVercelDomain(projectId, domainData);
        
        // 3. 加载验证配置
        await loadSubfolderDomainConfig();
        message.success('Verification request submitted, please configure DNS records as instructed');
        
      } catch (error) {
        console.error('Failed to start domain verification:', error);
        if (error.response?.data?.error?.code === 'domain_already_in_use') {
          message.info('This domain has already been submitted. Please add the DNS records as instructed, then click the verify button.');
        } else {
          message.error('Failed to start domain verification');
        }
      } finally {
        verifyingSubfolder.value = false;
      }
    };

    const loadSubfolderDomainConfig = async () => {
      try {
        // 获取主域名的验证状态
        const config = await apiClient.getVercelDomainConfig(props.productInfo.projectWebsite);
        
        subfolderDomainConfig.value = {
          ...config,
          verified: !config.misconfigured
        };
        
      } catch (error) {
        console.error('Failed to load domain configuration:', error);
        message.error('Failed to load domain configuration');
      }
    };

    const handleSubfolderRefresh = async () => {
      refreshingSubfolder.value = true;
      try {
        await loadSubfolderDomainConfig();
        message.success('Refresh successful');
      } catch (error) {
        message.error('Refresh failed');
      } finally {
        refreshingSubfolder.value = false;
      }
    };

    // 删除子文件夹域名验证
    const showDeleteSubfolderDomainConfirm = () => {
      Modal.confirm({
        title: 'Delete Domain Verification',
        content: `Are you sure you want to delete the domain verification for ${props.productInfo.projectWebsite}?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          try {
            const projectId = PROJECT_ID;
            await apiClient.deleteVercelDomain(projectId, props.productInfo.projectWebsite);
            message.success('Domain verification has been deleted');
            subfolderDomainConfig.value = null;
          } catch (error) {
            console.error('Failed to delete domain verification:', error);
            message.error('Failed to delete domain verification');
          }
        },
      });
    };

    // 添加带操作列的 DNS 列定义
    const dnsColumnsWithActions = [
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

    const sendResetCode = async () => {
      try {
        await apiClient.sendEmailCode(props.productInfo.email, 'reset_password');
        
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

    // 添加关闭弹窗的处理方法
    const handleCancel = () => {
      emit('update:visible', false);
    };

    // 修改检查当前站点配置的方法
    const checkCurrentSiteConfig = async (domain) => {
      try {
        const config = await apiClient.getVercelDomainConfig(domain);
        // 同时更新 subfolderDomainConfig
        subfolderDomainConfig.value = {
          ...config,
          verified: !config.misconfigured
        };
        return !config?.misconfigured;
      } catch (error) {
        console.error(`Failed to get config for domain ${domain}:`, error);
        subfolderDomainConfig.value = null;
        return false;
      }
    };

    // 添加计算属性来控制 Start Verifying 按钮的显示
    const showStartVerifying = ref(false);
    
    // 监听模式切换
    watch(
      () => deploymentForm.value.method,
      async (newMode) => {
        if (newMode === 'subfolder') {
          const currentSite = props.productInfo?.projectWebsite;
          if (currentSite) {
            const isConfigured = await checkCurrentSiteConfig(currentSite);
            showStartVerifying.value = !isConfigured;
          }
        } else {
          // 切换到其他模式时重置状态
          subfolderDomainConfig.value = null;
          showStartVerifying.value = false;
        }
      }
    );

    return {
      cooldown,
      goToDashboard,
      domainLoading,
      domainModalVisible,
      savingDomain,
      websitePrefix,
      domainForm,
      deploymentForm,
      saving,
      vercelDomainInfo,
      loadVercelDomainInfo,
      currentDomainConfigs,
      showDeleteConfirm,
      dnsColumns,
      getDomainStatusColor,
      getDomainStatusText,
      refreshing,
      handleRefresh,
      currentEmail,
      showEmailForm,
      emailForm,
      sendingCode,
      changing,
      isValidEmail,
      canSubmit,
      subfolders,
      savingSubfolders,
      showSubfolderModal,
      newSubfolder,
      subfolderColumns,
      loadSubfolders,
      confirmDeleteSubfolder,
      handleAddSubfolder,
      saveSubfolders,
      subfolderLoading,
      subdomainLoading,
      subfolderDomainConfig,
      verifyingSubfolder,
      refreshingSubfolder,
      startVerifyingSubfolder,
      handleSubfolderRefresh,
      showDeleteSubfolderDomainConfirm,
      dnsColumnsWithActions,
      domainConfigured,
      loading,
      passwordForm,
      submitLoading,
      handleCancel,
      showStartVerifying,
    };
  }
}
</script>

<style scoped>
.settings-content {
  padding: 0;
  background: white;
  border-radius: 8px;
  min-height: auto;
}

.settings-container {
  width: 100%;
  min-height: auto;
  padding: 16px;
}

.domain-settings {
  margin-bottom: 16px;
}

.current-domain {
  margin-bottom: 16px;
}

.website-url {
  font-size: 16px;
  color: #1890ff;
  margin: 0;
}

.deployment-settings {
  margin-top: 16px;
}

.deployment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.deployment-option {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.deployment-option:hover {
  border-color: #1890ff;
}

.deployment-option.active {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.option-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.radio-wrapper {
  margin-right: 12px;
}

.option-description {
  color: #666;
  margin: 0;
}

.url-preview {
  display: flex;
  align-items: center;
  gap: 4px;
}

.url-separator {
  color: #666;
}

.base-domain {
  color: #666;
}

.custom-input {
  max-width: 200px;
}

.configured-domains {
  margin-top: 16px;
}

.domains-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.domain-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
}

.domain-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.domain-name {
  font-size: 16px;
  font-weight: 500;
}

.dns-config-alert {
  margin: 12px 0;
}

.dns-table-wrapper {
  margin-top: 12px;
}

.dns-table {
  background: #fafafa;
}

.domain-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.domain-date {
  color: #666;
  font-size: 14px;
}

.refresh-btn {
  padding: 4px 8px;
}

.verification-status {
  margin-top: 16px;
}

.verification-header {
  margin-bottom: 16px;
}

.success-alert {
  margin-bottom: 16px;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  margin-left: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.subfolder-list {
  margin-top: 16px;
}

:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
}

:deep(.ant-modal-body) {
  padding: 0;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

:deep(.ant-modal-close) {
  top: 16px;
}

.centered-spin {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.domain-verification {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.ant-modal) {
  width: 900px !important;
  max-width: 95vw;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style> 