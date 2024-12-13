<template>
  <page-layout
    title="Settings"
    description="Configure your website settings and deployment options"
    icon="⚙️"
  >
    <a-tabs 
      class="main-tabs"
      v-model:activeKey="activeTab"
    >
      <a-tab-pane key="domains" tab="Domains" />
    </a-tabs>

    <div class="page-content">
      <div class="settings-content">
        <template v-if="activeTab === 'domains'">
          <a-spin :spinning="domainLoading" tip="Loading...">
            <div class="settings-container">
              <div v-if="!domainLoading">
                <template v-if="!productInfo?.projectWebsite">
                  <div class="empty-state">
                    <h3 class="empty-state-title">No Website Configured 🌐</h3>
                    <p class="empty-state-description">
                      Please add your website URL first
                    </p>
                    <a-button 
                      type="primary" 
                      class="upload-btn-empty"
                      @click="showDomainModal"
                    >
                      <setting-outlined /> Add now
                    </a-button>
                  </div>
                </template>
                <template v-else>
                  <div class="domain-settings">
                    <div class="current-domain">
                      <h3>Current Website</h3>
                      <p class="website-url">{{ productInfo.projectWebsite }}</p>
                    </div>
                    
                    <div class="configured-domains" v-if="currentDomainConfigs?.length > 0">
                      <div class="domains-header">
                        <h3>Added Subdomains</h3>
                        <a-button 
                          type="link"
                          class="refresh-btn"
                          :loading="refreshing"
                          @click="handleRefresh"
                        >
                          <reload-outlined />
                        </a-button>
                      </div>
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

                    <div class="deployment-settings">
                      <h3>Deployment Settings</h3>
                      <a-form
                        :model="deploymentForm"
                        layout="vertical"
                      >
                        <a-form-item label="Choose how you want to deploy your content">
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
                                Deploy your content on a subdomain (e.g., blog.yourdomain.com)
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
                                Deploy your content in a subfolder (e.g., yourdomain.com/blog)
                              </p>
                            </div>
                          </div>
                        </a-form-item>

                        <div class="input-section">
                          <template v-if="deploymentForm.method === 'subdomain'">
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
                                <span class="base-domain">{{ productInfo.projectWebsite }}</span>
                              </div>
                            </a-form-item>
                          </template>

                          <template v-if="deploymentForm.method === 'subfolder'">
                            <a-form-item
                              label="Enter your subfolder path"
                              required
                            >
                              <div class="url-preview">
                                <span class="base-domain">{{ productInfo.projectWebsite }}</span>
                                <span class="url-separator">/</span>
                                <a-input
                                  v-model:value="deploymentForm.suffix"
                                  placeholder="blog"
                                  :disabled="saving"
                                  class="custom-input"
                                />
                              </div>
                            </a-form-item>
                          </template>

                          <a-form-item>
                            <a-button 
                              type="primary"
                              :loading="saving"
                              @click="saveDeploymentSettings"
                              class="save-btn"
                              :disabled="deploymentForm.method === 'subfolder'"
                            >
                              {{ deploymentForm.method === 'subfolder' ? 'Coming soon...' : 'Add' }}
                            </a-button>
                          </a-form-item>
                        </div>
                      </a-form>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </a-spin>
        </template>
      </div>
    </div>

    <!-- Domain Modal -->
    <a-modal
      v-model:visible="domainModalVisible"
      title="Add Your Domain"
      @ok="handleDomainModalOk"
      @cancel="handleDomainModalCancel"
      :okButtonProps="{ 
        disabled: !domainForm.domain,
        loading: savingDomain
      }"
      okText="Confirm"
      cancelText="Cancel"
    >
      <a-form
        :model="domainForm"
        layout="vertical"
      >
        <a-form-item
          label="Your Domain"
          name="domain"
          :rules="[{ required: true, message: 'Please enter your domain' }]"
        >
          <a-input-group compact>
            <a-select
              v-model:value="websitePrefix"
              style="width: 90px"
              :disabled="true"
              :open="false"
            >
              <a-select-option value="https://">https://</a-select-option>
            </a-select>
            <a-input 
              v-model:value="domainForm.domain" 
              style="width: calc(100% - 90px)"
              placeholder="example.com"
              @change="handleDomainChange"
            />
          </a-input-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-layout>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import PageLayout from './layout/PageLayout.vue'
import { SettingOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import apiClient from '../api/api';

export default {
  name: 'SettingsPage',
  components: {
    PageLayout,
    SettingOutlined,
    DeleteOutlined,
    ReloadOutlined
  },
  setup() {
    const activeTab = ref('domains');
    const domainLoading = ref(false);
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
    const productInfo = ref(null);
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


    // 添加获取 projectId 的工具方法
    const getProjectId = (customerId) => {
      switch (customerId) {
        case '673f4f19caf5b79765874fe8':
          return 'prj_7SXIhcIx5SOYKKVzhhRvnmUdoN7g';
        case '67525da4ba5fcadf228e56c1':
          return 'prj_7SXIhcIx5SOYKKVzhhRvnmUdoN7g';
        default:
          return 'prj_ySV5jK2SgENiBpE5D2aTaeI3KfAo'; // 默认值待定
      }
    };

    const showDeleteConfirm = (domainName) => {
      Modal.confirm({
        title: 'Confirm Delete',
        content: `Are you sure you want to delete subdomain ${domainName}?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          try {
            const customerId = localStorage.getItem('currentUserId');
            const projectId = getProjectId(customerId);
            
            await apiClient.deleteVercelDomain(projectId, domainName);
            message.success('Domain deleted successfully');
            await loadVercelDomainInfo();
          } catch (error) {
            console.error('Failed to delete domain:', error);
            message.error('Failed to delete domain');
          }
        },
      });
    };

    // 加载产品信息
    const loadProductInfo = async () => {
      domainLoading.value = true;
      try {
        const customerId = localStorage.getItem('currentUserId');
        const response = await apiClient.getProductsByCustomerId(customerId);
        
        if (response?.code === 200 && response.data) {
          productInfo.value = response.data;
          // 重置表单状态
          deploymentForm.value = {
            method: 'subdomain',
            prefix: '',
            suffix: '',
          };
          // 加载 Vercel 域名信息
          await loadVercelDomainInfo();
        } else {
          productInfo.value = null;
        }
      } catch (error) {
        console.error('Failed to load product information:', error);
        productInfo.value = null;
      } finally {
        domainLoading.value = false;
      }
    };

    // 处理 Vercel 域名信息
    const processVercelDomainInfo = async (response) => {
      if (!response?.domains || !productInfo.value?.projectWebsite) {
        currentDomainConfigs.value = [];
        return;
      }

      const currentDomain = productInfo.value.projectWebsite;
      
      // 过滤匹配的域名
      const matchingDomains = response.domains.filter(domain => {
        return domain.apexName === currentDomain;
      });

      // 为每个域名获取详细配置
      const domainsWithConfig = await Promise.all(
        matchingDomains.map(async (domain) => {
          try {
            const customerId = localStorage.getItem('currentUserId');
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
        const customerId = localStorage.getItem('currentUserId');
        const projectId = getProjectId(customerId);

        const response = await apiClient.getVercelDomainInfo(projectId);
        vercelDomainInfo.value = response;
        processVercelDomainInfo(response);
      } catch (error) {
        console.error('Failed to load Vercel domain info:', error);
        message.error('Failed to load domain information');
      }
    };

    // 监听 activeTab 变化
    watch(activeTab, (newValue) => {
      if (newValue === 'domains') {
        loadProductInfo();
      }
    });

    // 在组件挂载时加载产品信息
    onMounted(() => {
      loadProductInfo();
    });

    // Domain Modal 相关方法
    const showDomainModal = () => {
      domainModalVisible.value = true;
    };

    const handleDomainChange = (e) => {
      domainForm.value.domain = e.target.value.trim();
    };

    const handleDomainModalOk = async () => {
      if (!domainForm.value.domain) {
        message.error('Please enter your domain');
        return;
      }
      
      savingDomain.value = true;
      try {
        const formData = {
          ...productInfo.value,
          website: domainForm.value.domain
        };
        
        await apiClient.updateProduct(productInfo.value.productId, formData);
        message.success('Domain added successfully');
        domainModalVisible.value = false;
        loadProductInfo();
      } catch (error) {
        console.error('Failed to save domain:', error);
        message.error('Failed to save domain');
      } finally {
        savingDomain.value = false;
      }
    };

    const handleDomainModalCancel = () => {
      domainModalVisible.value = false;
      domainForm.value.domain = '';
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
        const customerId = localStorage.getItem('currentUserId');
        const projectId = getProjectId(customerId);

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

    return {
      activeTab,
      domainLoading,
      domainModalVisible,
      savingDomain,
      websitePrefix,
      domainForm,
      deploymentForm,
      saving,
      productInfo,
      showDomainModal,
      handleDomainChange,
      handleDomainModalOk,
      handleDomainModalCancel,
      saveDeploymentSettings,
      loadProductInfo,
      vercelDomainInfo,
      loadVercelDomainInfo,
      currentDomainConfigs,
      showDeleteConfirm,
      dnsColumns,
      getDomainStatusColor,
      getDomainStatusText,
      refreshing,
      handleRefresh
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
  padding: 24px;
  min-height: calc(100vh - 200px);
  position: relative;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  min-height: calc(100vh - 300px);
}

.empty-state-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.empty-state-description {
  font-size: 16px;
  color: #6b7280;
  max-width: 400px;
  margin-bottom: 24px;
  line-height: 1.6;
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
  margin-bottom: 32px;
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
  margin-bottom: 24px;
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
  width: 200px;
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

.configured-domains {
  margin-bottom: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.configured-domains h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.domain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.domain-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.domain-name {
  font-size: 15px;
  font-weight: 500;
  color: #3B82F6;
}

.domain-date {
  font-size: 13px;
  color: #6B7280;
}

:deep(.ant-tag) {
  border-radius: 4px;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  margin: 0;
}

.domain-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.domain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

:deep(.anticon) {
  font-size: 16px;
}

.dns-config-alert {
  margin-top: 12px;
  background: #FFFBEB;
  border-radius: 8px;
  padding: 16px;
}

.dns-table-wrapper {
  margin-top: 12px;
}

.dns-table {
  background: white;
  border-radius: 8px;
}

.domains-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 16px 0;
}

.domains-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.refresh-btn {
  padding: 4px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  color: #60A5FA;
  background: #F0F7FF;
  border-radius: 4px;
}
</style> 