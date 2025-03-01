<template>
  <page-layout
    title="Dashboard"
    description="Manage your product and track your performance"
    icon="📊"
  >

    <!-- 添加骨架屏加载效果 -->
    <div class="dashboard-content">
      <a-skeleton active :loading="!productInfo" :paragraph="{ rows: 10 }" class="dashboard-skeleton">
        <template #title>
          <div class="skeleton-header">
            <a-skeleton-input active style="width: 200px; height: 24px;" />
          </div>
        </template>
      </a-skeleton>

      <!-- 原有内容，只在数据加载完成后显示 -->
      <a-row :gutter="[16, 16]" v-if="productInfo?.productId">
        <a-col :span="24">
          <a-card class="product-info-card">
            <template #title>
              <div class="card-title">
                <span>Product Information</span>
                <div class="header-actions">
                  <a-button type="primary" @click="openEditWithBasicInfo" class="edit-product-btn">
                    Edit Product Information
                  </a-button>
                </div>
              </div>
            </template>
            
            <div class="info-grid">
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">
                    <span>Product Name</span>
                  </div>
                  <div class="info-content">
                    {{ productInfo?.productName || 'Not set' }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    Website
                  </div>
                  <div class="website-content">
                    <a
                      :href="productInfo?.projectWebsite ? `https://${productInfo.projectWebsite.replace(/^https?:\/\//, '')}` : '#'"
                      target="_blank"
                      class="website-link"
                    >
                      {{ productInfo?.projectWebsite ? productInfo.projectWebsite.replace(/^https?:\/\//, '') : 'Not set' }}
                    </a>
                    <a-tag v-if="productInfo?.domainStatus" color="success">
                      Verified
                    </a-tag>
                    <a-tag v-else color="warning">
                      Not Verified
                    </a-tag>
                  </div>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">
                    Competitors
                  </div>
                  <div class="info-content">
                    <div class="competitors-stats-horizontal">
                      <template v-if="competitors.length">
                        <a-tag 
                          v-for="comp in competitors" 
                          :key="comp.url"
                          class="competitor-tag"
                        >
                          <a :href="`https://${comp.url}`" target="_blank" class="competitor-link">
                            {{ comp.name }}
                          </a>
                        </a-tag>
                      </template>
                      <template v-else>
                        <span class="no-competitors">No competitors added</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

    </div>

    <a-modal
      v-model:open="onboardingModalVisible"
      :maskClosable="false"
      :closable="true"
      :width="1000"
      :footer="null"
      :class="['product-modal']"
    >
      <template #title>
        <div class="modal-title">
          <span>✏️ Edit Product Information</span>
        </div>
      </template>

      <a-form 
        :model="formState" 
        layout="vertical"
        @finish="handleFormSubmit" 
        ref="formRef"
      >
        <!-- Basic info -->
        <a-form-item 
          label="Product Name" 
          name="productName"
          :rules="[{ required: true, message: 'Please enter product name' }]"
        >
          <p class="step-description">Enter the name of your existing product or service.</p>
          <a-input 
            v-model:value="formState.productName" 
            placeholder="Enter your product name"
            :maxLength="50"
          />
        </a-form-item>

        <!-- Website info and domain verification -->
        <a-form-item 
          label="Official Website" 
          name="website"
        >
          <p class="step-description">Enter your product's website URL to help us better understand and fetch your product content.</p>
          <div class="website-input-group">
            <a-input-group compact>
              <div class="website-prefix">https://</div>
              <a-input 
                v-model:value="formState.website" 
                class="website-input"
                placeholder="example.com"
                @change="handleWebsiteChange"
                :disabled="verifying"
              />
            </a-input-group>
            <!-- Add domain status tag -->
            <div class="domain-status" v-if="formState.website">
              <a-tag v-if="productInfo?.domainStatus" color="success">Verified</a-tag>
              <a-tag v-else color="warning">Unverified</a-tag>
            </div>
          </div>
          
          <!-- Domain verification section -->
          <template v-if="(!productInfo.domainStatus || formState.website !== productInfo.projectWebsite?.replace('https://', '')) && formState.website">
            <div class="mt-3">
              <template v-if="!showVerifyRecord">
                <a-button 
                  type="primary" 
                  @click="startVerify"
                  :disabled="!formState.website"
                  :loading="startVerifying"
                >
                  Start Verifying
                </a-button>
              </template>
              <template v-else>
                <div class="verify-record-container">
                  <div class="verify-record-title">
                    Please add the following TXT record to your DNS settings:
                  </div>
                  <div class="verify-record-table">
                    <div class="verify-record-row">
                      <div class="verify-record-cell">
                        <span class="verify-label">Type:</span>
                        <a-typography-text>TXT</a-typography-text>
                      </div>
                    </div>
                    
                    <!-- Combined Host row with horizontal layout -->
                    <div class="verify-record-row">
                      <div class="verify-record-cell">
                        <span class="verify-label">Host:</span>
                        <div class="record-value-container horizontal">
                          <div class="host-option">
                            <a-typography-text code copyable class="record-value">
                              {{ verifyRecord?.host || '_' }}
                            </a-typography-text>
                            <span class="record-note">For most DNS providers</span>
                          </div>
                          
                          <div class="host-divider">
                            <span class="divider-text">OR</span>
                          </div>
                          
                          <div class="host-option">
                            <a-typography-text code copyable class="record-value">
                              {{ verifyRecord?.host?.split('.' + formState.website)[0] || '_' }}
                            </a-typography-text>
                            <span class="record-note">For Namecheap, Aliyun, etc.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="verify-record-row">
                      <div class="verify-record-cell">
                        <span class="verify-label">Value:</span>
                        <a-typography-text code copyable class="record-value">
                          {{ verifyRecord?.value || '_' }}
                        </a-typography-text>
                      </div>
                    </div>
                  </div>
                  
                  <div class="verify-record-help">
                    <!-- Remove the basic tips and only keep the important warning -->
                    <div class="important-warning">
                      <ExclamationCircleFilled />
                      <div class="warning-content">
                        <strong>IMPORTANT: If verification keeps failing</strong>
                        <p>
                          Try removing the existing TXT record from your DNS provider and add it again as a new record. 
                          This often resolves persistent verification issues!
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <a-button 
                    type="primary" 
                    @click="verifyNow"
                    :loading="verifying"
                    class="mt-3"
                  >
                    Verify Now
                  </a-button>
                </div>
              </template>
            </div>
          </template>
        </a-form-item>

        <!-- Competitor analysis -->
        <a-form-item label="Competitors">
          <p class="step-description">Add up to 4 main competitors to help us understand your market positioning.</p>
          <div class="competitors-section">
            <!-- Row 1: Added competitors tags -->
            <div class="competitors-tags">
              <a-space wrap>
                <a-tag 
                  v-for="(comp, index) in formState.competitors" 
                  :key="index"
                  closable
                  @close="removeCompetitor(index)"
                  :color="['blue', 'green', 'orange', 'purple'][index % 4]"
                >
                  {{ comp.name }}
                </a-tag>
              </a-space>
            </div>

            <!-- Row 2: Input fields and add button -->
            <div class="competitors-input">
              <a-space>
                <a-input
                  v-model:value="newCompetitor.name"
                  placeholder="Competitor name"
                  style="width: 200px"
                />
                <a-input
                  v-model:value="newCompetitor.url"
                  placeholder="Website (e.g. example.com)"
                  style="width: 200px"
                />
                <a-button 
                  type="primary"
                  @click="addCompetitor"
                  :disabled="!newCompetitor.name || !newCompetitor.url"
                >
                  Add
                </a-button>
              </a-space>
            </div>
          </div>
        </a-form-item>

        <!-- Bottom buttons -->
        <a-form-item>
          <div class="form-bottom-actions">
            <a-button 
              type="primary" 
              html-type="submit"
              :loading="loading"
              :disabled="!formState.productName"
              block
            >
              Save Changes
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Add GSC connection success modal -->
    <a-modal
      v-model:open="gscSuccessModalVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      class="gsc-success-modal"
    >
      <div class="success-content">
        <div class="success-icon"></div>
        <h3>Connected Successfully!</h3>
        <p>Please close this window and refresh the page</p>
      </div>
    </a-modal>
  </page-layout>
</template>

<script>
import { defineComponent } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { 
  EditOutlined, 
  DeleteOutlined, 
  FileTextOutlined, 
  LineChartOutlined, 
  NodeIndexOutlined,
  CalendarOutlined, 
  LinkOutlined, 
  GlobalOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  GoogleOutlined,
  CompassOutlined,
  RightOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { Modal, message } from 'ant-design-vue'
import { createVNode } from 'vue'

export default defineComponent({
  components: {
    PageLayout,
    EditOutlined,
    DeleteOutlined,
    FileTextOutlined,
    LineChartOutlined,
    NodeIndexOutlined,
    CalendarOutlined,
    LinkOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    GoogleOutlined,
    CompassOutlined,
    RightOutlined,
    CheckSquareOutlined,
    AppstoreOutlined,
    ThunderboltOutlined,
    ExclamationCircleFilled,
    ExclamationCircleOutlined,
  },
  data() {
    return {
      productInfo: null,
      onboardingModalVisible: false,
      loading: false,
      formState: {
        productId: undefined,
        productName: '',
        website: '',
        competitors: []
      },
      newCompetitor: {
        name: '',
        url: ''
      },
      sitemapData: [],
      loadingSitemap: false,
      publishedPages: 0,
      isGscConnected: false,
      gscSuccessModalVisible: false,
      gscCheckInterval: null,
      showVerifyRecord: false,
      verifyRecord: '',
      verifying: false,
      startVerifying: false,
      goStartVerifying: false,
      originalDomainStatus: null, 
      chart: null, 
      loadingUrls: {}, 
      nodeUrls: {}, 
      activeCollapseKeys: [], 
      sitemapModal: {
        visible: false,
        publishedUrls: []
      },
      submitLoading: false,
      publishedUrls: [],
      expandedKeys: [], 
      hasTourCompleted: false, 
      originalWebsite: '', 
      checkingGscStatus: false, 
      isPanelReady: false,
    }
  },
  created() {
    this.loadProductInfo()
    this.handleGscCallback()
    this.startGscStatusCheck()
  },
  beforeUnmount() {
    if (this.gscCheckInterval) {
      clearInterval(this.gscCheckInterval)
    }
  },
  setup(props, { emit }) {
    return {
      showOnboardingModal,
      isComponentMounted,
      pagesTable,
      productModalVisible,
      chartRef,
      chartInstance,
      initChart
    }
  },
  computed: {
    competitors() {
      if (!this.productInfo || !this.productInfo.competeProduct) return []
      return this.productInfo.competeProduct.split(',').map(item => {
        const [name, url] = item.split('|');
        return { name, url };
      });
    },
    completedSteps() {
      // 如果产品信息还未加载完成,直接返回0
      if (!this.productInfo) {
        return 0;
      }
      
      let completed = 0;
      if (this.productInfo.domainStatus) completed++;
      if (this.isGscConnected) completed++;
      if (this.productInfo.onboarding) completed++;
      return completed;
    },
    
    progressPercent() {
      return Math.round((this.completedSteps / 3) * 100);
    },
    
    allStepsCompleted() {
      return this.completedSteps === 3;
    },
    isDomainVerified() {
      return this.productInfo?.domainStatus || false;
    },
    // 添加新的计算属性来控制面板显示
    shouldShowSetupPanel() {
      // 只有当所有必要数据都加载完成且未完成所有步骤时才显示
      return (
        this.productInfo && 
        !this.allStepsCompleted && 
        !this.loading &&
        !this.checkingGscStatus && // 确保GSC状态检查完成
        this.isPanelReady // 确保面板准备就绪
      );
    }
  },
  methods: {
    handleLogout() {
      Modal.confirm({
        title: 'Are you sure you want to logout?',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Are you sure you want to logout?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('intelickIsLoggedIn');
          localStorage.removeItem('currentCustomer');
          localStorage.removeItem('currentCustomerId');
          this.$router.push('/login');
          message.success('Successfully logged out');
        }
      });
    },
    async checkDomainVerification() {
      if (!this.formState.website) return;

      try {
        this.goStartVerifying = true;
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getDomain({
          customerId,
        });

        if (response?.code === 200) {
          if (response.data?.textRecord) {
            // 如果存在TXT记录，显示验证记录
            this.verifyRecord = JSON.parse(response.data.textRecord);
            this.showVerifyRecord = true;
          } else {
            // 如果不存在TXT记录，重置状态
            this.showVerifyRecord = false;
            this.verifyRecord = null;
          }
        }
      } catch (error) {
        console.error('Failed to check domain verification status:', error);
        this.showVerifyRecord = false;
        this.verifyRecord = null;
      } finally {
        this.goStartVerifying = false;
      }
    },

    openEditWithBasicInfo() {
      this.currentStep = 0; // 强制显示第一步
      this.editProductInfo(); // 用现的编方法
    },

    // 修改 editProductInfo 方法，添加 async 关键字
    async editProductInfo() {
      this.originalDomainStatus = this.productInfo?.domainStatus;
      this.originalWebsite = this.productInfo?.projectWebsite?.replace('https://', '');
      this.formState = {
        productId: this.productInfo.productId,
        productName: this.productInfo.productName,
        website: this.productInfo.projectWebsite?.replace('https://', ''),
        coreFeatures: this.productInfo.productDesc,
        competitors: this.competitors,
        domainStatus: this.productInfo.domainStatus
      };
      
      // 如果域名未验证，检查是否有验证记录
      if (!this.productInfo.domainStatus && this.formState.website) {
        await this.checkDomainVerification();
      }
      
      this.onboardingModalVisible = true;
    },
    
    async loadProductInfo() {
      try {
        console.log('Start loading product info');
        const response = await apiClient.getProductsByCustomerId();
        
        if (!response) {
          throw new Error('API response is empty');
        }

        if (response.code === 200) {
          // 检查返回的数据是否为空
          if (!response.data) {
            console.log('No product info found, redirecting to onboarding');
            // 重定向到 onboarding 页面
            this.$router.push('/onboarding');
            return;
          }

          this.productInfo = response.data;
          
          if (!response.data) {
            console.log('No product info found, showing new user setup interface');
            // 重置表单状态
            this.formState = {
              productId: undefined,
              productName: '',
              website: '',
              coreFeatures: '',
              competitors: []
            };
            this.onboardingModalVisible = true;
            return;
          }

          console.log('Product info loaded successfully, starting to load related data');
          
          // 使用 Promise.allSettled 替代 Promise.all,避免一个请求失败影响其他请求
          const results = await Promise.allSettled([
            this.checkGscStatus(),
          ]);

          // 检查每个请求的结果
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`Data loading failed ${index}:`, result.reason);
            }
          });

          if (this.productInfo.domainStatus) {
            try {
              await this.getSitemap();
              
              if (this.isGscConnected) {
                await this.loadGscData();
              }
            } catch (error) {
              console.error('Failed to load sitemap or GSC data:', error);
            }
          }

          // 所有数据加载完成后设置面板状态
          this.$nextTick(() => {
            this.isPanelReady = true;
          });
        } else {
          throw new Error(`API returned error code: ${response.code}`);
        }
      } catch (error) {
        console.error('Failed to load product info:', error);
        this.productInfo = null;
        this.isPanelReady = false;
      }
    },
    handleCompetitorChange(value) {
      if (value.length > 4) {
        this.formState.competitors = value.slice(0, 4)
      } else {
        this.formState.competitors = value
      }
    },
    async handleFormSubmit() {
      this.loading = true;
      try {
        const formData = this.prepareFormData();
        const response = await apiClient.updateProduct(this.formState.productId, formData);
        
        if (response?.code === 200) {
          this.$notification.success({
            message: 'Product Updated',
            description: 'Product information has been updated successfully.'
          });
          
          this.onboardingModalVisible = false;
          await this.loadProductInfo();
        }
      } catch (error) {
        console.error('Error updating product:', error);
        this.$notification.error({
          message: 'Update Failed',
          description: error.message || 'Failed to update product information'
        });
      } finally {
        this.loading = false;
      }
    },

    // 准备表单数据的公共方法
    prepareFormData() {
      const isWebsiteChanged = this.formState.website !== (this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '') || '');
      
      return {
        customerId: localStorage.getItem('currentCustomerId'),
        productName: this.formState.productName,
        productDesc: this.formState.coreFeatures,
        competeProduct: this.formState.competitors.map(comp => 
          `${comp.name}|${comp.url}`
        ).join(','),
        website: this.formState.website || '',
        sitemap: '',
        // 域名变更时一定重置验证状态
        domainStatus: isWebsiteChanged ? false : this.formState.domainStatus
      };
    },

    async deleteProduct() {
      try {
        // Add confirmation dialog using Modal.confirm
        const confirmed = await new Promise(resolve => {
          Modal.confirm({
            title: 'Delete Product',
            content: 'Are you sure you want to delete this product? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!confirmed) return;

        const response = await apiClient.deleteProduct(this.productInfo.productId)
        if (response?.code === 200) {
          this.$notification.success({
            message: 'Delete Successful',
            description: 'Product information has been deleted successfully'
          })
          
          // 删除成功后直接重定向到 onboarding 页面
          this.$router.push('/onboarding');
        }
      } catch (error) {
        this.$notification.error({
          message: 'Delete Failed',
          description: error.message || 'An error occurred while deleting product information'
        })
      }
    },
    async handleWebsiteChange(e) {
      const newWebsite = e.target.value.trim();
      
      // 更新 formState 中的 website
      this.formState = {
        ...this.formState,
        website: newWebsite,
        // 如果是新域名，重置验证状态
        domainStatus: newWebsite === this.originalWebsite ? this.originalDomainStatus : false
      };
      
      // 如果域名变更，重置验证相关状态，显示 Start Verify 按钮
      if (newWebsite !== this.originalWebsite) {
        this.showVerifyRecord = false;
        this.verifyRecord = null;
      }
      // 如果改回原域名且未验证，恢复之前的验证记录状态
      else if (!this.originalDomainStatus) {
        await this.checkDomainVerification();
      }
    },
    addCompetitor() {
      if (this.newCompetitor.name && this.newCompetitor.url) {
        if (this.formState.competitors.length >= 4) {
          this.$notification.warning({
            message: 'Maximum Competitors',
            description: 'You can only add up to 4 competitors.'
          });
          return;
        }
        
        this.formState.competitors.push({
          name: this.newCompetitor.name,
          url: this.newCompetitor.url.replace(/^https?:\/\//, '')
        });
        
        this.newCompetitor = {
          name: '',
          url: ''
        };
      }
    },
    removeCompetitor(index) {
      const newCompetitors = [...this.formState.competitors];
      newCompetitors.splice(index, 1);
      this.formState.competitors = newCompetitors;
    },
    async getSitemap(isRefresh = false) {
      // 只检查域名状态
      if (!this.productInfo?.projectWebsite || !this.productInfo.domainStatus) {
        return;
      }
      
      try {
        this.loadingSitemap = true;
        const customerId = localStorage.getItem('currentCustomerId');

        if (isRefresh) {
          await apiClient.updateSitemap(customerId);
        }
        
        const response = await apiClient.getSitemap(customerId);

        if (response?.code === 200) {
          if (!response.data) {
            this.allPages = [];
            this.sitemapData = [];
            return;
          }

          this.allPages = response.data.flatMap(folder => folder.urls);
          this.sitemapData = this.processSitemap(response.data);
        } else {
          throw new Error('Failed to get sitemap');
        }
      } catch (error) {
        console.error('Failed to get sitemap:', error);
        this.$message.error('Failed to get sitemap, please try again later');
        this.sitemapData = [];
      } finally {
        this.loadingSitemap = false;
      }
    },

    processSitemap(sitemapData) {
      if (!Array.isArray(sitemapData)) {
        return [{
          key: 'empty',
          title: 'No pages found',
          selectable: false,
          children: []
        }];
      }

      // 收集所有节点的 key
      const keys = [];
      
      const processedData = sitemapData.map(folder => {
        const folderKey = `folder_${folder.websiteId}`;
        keys.push(folderKey); // 添加文件夹 key
        
        const processedUrls = folder.urls.map(url => {
          const urlKey = url;
          keys.push(urlKey); // 添加 URL key
          return {
            key: urlKey,
            title: new URL(url.startsWith('http') ? url : `https://${url}`).pathname || '/',
            fullUrl: url.startsWith('http') ? url : `https://${url}`
          };
        });

        return {
          key: folderKey,
          title: `${folder.name} (${folder.childNum})`,
          children: processedUrls
        };
      });

      // 更新展开的 keys
      this.expandedKeys = keys;
      
      return processedData;
    },

    async connectGSC() {
      if (this.isGscConnected) {
        return // 如果已连接，不执行任何操作
      }
      
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.gscAuth(customerId)
        
        if (response?.code === 200 && response.redirectURL) {
          const width = 600
          const height = 600
          const left = (window.screen.width / 2) - (width / 2)
          const top = (window.screen.height / 2) - (height / 2)
          
          window.open(
            response.redirectURL,
            'Google Auth',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
          )
        }
      } catch (error) {
        this.$notification.error({
          message: 'GSC Connection Failed',
          description: error.message || 'Failed to connect to Google Search Console'
        })
      }
    },

    async handleGscCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const isGscSuccess = urlParams.get('gsc-auth-success');
      
      if (isGscSuccess === 'true') {
        // 显示 Modal 而不是 notification
        this.gscSuccessModalVisible = true;
        
        // 移除 URL 参数
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // 刷新 GSC 数据
        await this.loadGscData();
      }
    },

    async loadGscData() {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getGscSites(customerId)
        
        if (response?.code === 200 && response?.data) {
          this.gscSites = response.data
          console.log('GSC Sites loaded:', this.gscSites) // 添加日志
          
          // 如果有站点数据，自动选择第一个
          if (this.gscSites.length > 0) {
            this.selectedSiteUrl = this.gscSites[0].siteUrl
          }
        }
      } catch (error) {
        console.error('Failed to load GSC data:', error)
      }
    },

    async checkGscStatus() {
      try {
        this.checkingGscStatus = true; // 开始检查时设置loading状态
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.checkGscAuth(customerId);
        
        console.log('GSC Status:', response);
        
        if (
          response?.code === 1201 || 
          response?.code === 500 ||  
          response?.code !== 200     
        ) {
          this.isGscConnected = false;
          this.gscSites = [];
          return;
        }
        
        this.isGscConnected = true;
      } catch (error) {
        console.error('Failed to check GSC status:', error);
        this.isGscConnected = false;
        this.gscSites = [];
      } finally {
        this.checkingGscStatus = false; // 检查完成后关闭loading状态
      }
    },

    startGscStatusCheck() {
      if (this.gscCheckInterval) {
        clearInterval(this.gscCheckInterval)
      }
      
      this.gscCheckInterval = setInterval(() => {
        this.checkGscStatus()
      }, 60000)
    },
   
    openEditWithBasicInfoToVerify() {
      this.currentStep = 0;
      this.openEditWithBasicInfo();
    },

    async startVerify() {
      this.startVerifying = true;
      try {
        const currentDomain = this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '');
        const domain = this.formState.website.replace(/^https?:\/\//, '');

        // 如果域名发生变化，需要先更新产品信息
        if (domain !== currentDomain) {
          const formData = {
            customerId: localStorage.getItem('currentCustomerId'),
            productName: this.formState.productName,
            productDesc: this.formState.coreFeatures,
            competeProduct: this.formState.competitors.map(comp => 
              `${comp.name}|${comp.url}`
            ).join(','),
            website: domain,
            sitemap: '',
            domainStatus: false
          };

          const updateResponse = await apiClient.updateProduct(this.formState.productId, formData);
          if (updateResponse?.code !== 200) {
            throw new Error('Failed to update product information');
          }

          await this.loadProductInfo();
        }

        const response = await apiClient.createDomainWithTXT({
          customerId: localStorage.getItem('currentCustomerId'),
          domainName: domain
        });
        
        if (response?.code === 10042) {
          throw new Error(response.message || 'This domain is already taken. Please choose another domain.');
        }
        
        if (response?.code === 200) {
          this.verifyRecord = JSON.parse(response.data.txt);
          this.showVerifyRecord = true;
          
          if (this.productInfo) {
            this.productInfo = {
              ...this.productInfo,
              domainStatus: false
            };
          }
        } else {
          throw new Error('Failed to get verification record');
        }
      } catch (error) {
        // 显示错误消息
        this.$message.error(error.message || 'Failed to start verification');
        
        // 确保在失败时重置验证状态
        if (this.productInfo) {
          this.productInfo = {
            ...this.productInfo,
            domainStatus: false
          };
        }
      } finally {
        this.startVerifying = false;
      }
    },

    async verifyNow() {
      if (!this.formState?.website) return;
      
      this.verifying = true;
      try {
        const response = await apiClient.validateDomain({
          customerId: localStorage.getItem('currentCustomerId'),
        });
        
        if (response?.code === 200) {
          this.$message.success('Domain verified successfully!');
          this.showVerifyRecord = false;
          
          // 同时更新 formState 和 productInfo 的验证状态
          this.formState = {
            ...this.formState,
            domainStatus: true
          };
          
          // 更新 productInfo 的验证状态
          if (this.productInfo) {
            this.productInfo = {
              ...this.productInfo,
              domainStatus: true
            };
          }
          
          // 更新原始域名验证状态
          this.originalDomainStatus = true;
          
          // 添加提示，提醒用户保存更改
          this.$notification.info({
            message: 'Domain Verified',
            description: 'Please click "Save Changes" to apply your changes.',
            duration: 0
          });
        } else {
          this.$message.error('Verification failed. If you have added the TXT record correctly, please wait for some seconds and try again.');
        }
      } catch (error) {
        this.$message.error('Verification failed: ' + (error.message || 'Unknown error'));
      } finally {
        this.verifying = false;
      }
    },
    handleStateChange() {
      this.resetPanelState();
      this.$nextTick(() => {
        this.isPanelReady = true;
      });
    },

    getVisitUrl(key) {
      if (key === 'root') {
        return `https://${this.productInfo?.projectWebsite}`;
      }
      return key;
    },

    openGuideModeDialog() {
      console.log('Guide triggered with productInfo:', this.productInfo);
      console.log('Onboarding status when guide triggered:', this.productInfo?.onboarding);
      if (this.shouldShowGuide()) {
        this.$emit('open-guide-mode');
      } else {
        console.log('Guide skipped due to onboarding status');
      }
    },

    // 添加一个方法来检查是否应该显示导览
    shouldShowGuide() {
      return this.productInfo && !this.productInfo.onboarding;
    },

    async disconnectGSC() {
      try {
        // Add confirmation dialog using Modal.confirm
        const confirmed = await new Promise(resolve => {
          Modal.confirm({
            title: 'Disconnect Google Search Console',
            content: 'Are you sure you want to disconnect from Google Search Console? This will remove access to your search analytics data.',
            okText: 'Disconnect',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!confirmed) return;

        const response = await apiClient.cancelGscAuth();
        if (response?.code === 200) {
          this.isGscConnected = false;
          this.gscSites = [];
          this.$notification.success({
            message: 'Disconnected Successfully',
            description: 'Successfully disconnected from Google Search Console'
          });
        } else {
          throw new Error('Failed to disconnect from Google Search Console');
        }
      } catch (error) {
        this.$notification.error({
          message: 'Disconnect Failed',
          description: error.message || 'An error occurred while disconnecting from Google Search Console'
        });
      }
    },

    // 添加重置面板状态的方法
    resetPanelState() {
      this.isPanelReady = false;
    },

    // 在状态发生变化时重新评估是否显示面板
    async handleStateChange() {
      this.resetPanelState();
      await this.$nextTick();
      this.isPanelReady = true;
    },
    
    // 将 watch 移动到这里作为方法
    handleModalVisibleChange(newVal) {
      if (newVal) {
        this.currentStep = 0;
      }
    },
    
    handleProductInfoChange(newVal) {
      if (this.productInfo) {
        this.hasTourCompleted = !!newVal;
      }
    },
    
    handleDomainStatusChange() {
      this.handleStateChange();
    },
    
    handleGscConnectedChange() {
      this.handleStateChange(); 
    },
    
  },

  emits: ['open-guide-mode'],
  setup(props, { emit }) {
    const openGuideModeDialog = () => {
      emit('open-guide-mode');
    }
    
    return {
      openGuideModeDialog
    }
  }
})
</script>

<style scoped>
/* 修改主容器样式，移除 Discord 横幅相关的样式 */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 64px); /* 减去顶部导航栏高度 */
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 覆盖一些 Ant Design 默认样式 */
:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

.verify-record-container {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
  width: 100%;
}

.verify-record-title {
  color: #1890ff;
  margin-bottom: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.verify-record-table {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.verify-record-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.verify-record-cell {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  width: 100%;
  
  .verify-label {
    width: 80px;
    color: #666;
    font-weight: 500;
  }
  
  .record-value {
    flex: 1;
    font-family: monospace;
  }
}

.verify-record-help {
  margin: 12px 0;
  /* Remove the blue background and padding */
}

.important-warning {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-left: 4px solid #ff4d4f;
  border-radius: 4px;
  padding: 12px;
  margin-top: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  .anticon {
    color: #ff4d4f;
    font-size: 18px;
    margin-top: 2px;
  }
  
  .warning-content {
    flex: 1;
    
    strong {
      display: block;
      color: #ff4d4f;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    p {
      color: #434343;
      margin: 0;
      line-height: 1.5;
    }
  }
  
  /* Add subtle pulsing animation to draw attention */
  animation: warningPulse 2s infinite;
}

@keyframes warningPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.2);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 77, 79, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
  }
}

.ant-row .ant-card {
  height: 100%;  /* Make all cards in the row full height */
}

:deep(.ant-statistic-group) {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

:deep(.ant-card .ant-statistic) {
  text-align: center;
}

:deep(.ant-descriptions-item) {
  align-items: center !important;
  padding-bottom: 0 !important;  /* 移除底部 padding */
}

:deep(.ant-descriptions-item-label),
:deep(.ant-descriptions-item-content) {
  display: flex !important;
  align-items: center !important;
  min-height: 32px !important;
  line-height: 32px !important;
}

/* 覆盖 Descriptions 组件的 padding */
:deep(.ant-descriptions .ant-descriptions-row > th),
:deep(.ant-descriptions .ant-descriptions-row > td) {
  padding-bottom: 0;  /* 移除底部 padding */
}

:deep(.align-button) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 优化卡片样式 */
:deep(.ant-card) {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
}

/* 信息卡片样式优化 */
.info-card {
  :deep(.ant-card-head) {
    background: #fafafa;
    border-radius: 8px 8px 0 0;
  }
  
  :deep(.ant-descriptions-item-label) {
    font-weight: 600 !important; /* 使用 600 而不是 500 来让文字更粗一些 */
    color: #262626 !important; /* 使用深色来增加对比度 */
    font-size: 15px;
  }
}

/* 统计数据卡片样式 */
:deep(.ant-statistic) {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  
  .ant-statistic-title {
    color: #666;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    color: #262626;
    font-weight: 600;
  }
}

/* 图表卡片样式 */
.traffic-analytics {
  width: 100%;
  height: 400px;
  position: relative;
  margin: 20px 0;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px; /* 添加最小高度 */
}
/* 添加树容器样式 */
.tree-container {
  flex: 1;
  overflow: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  
  /* 优化滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #999;
    }
  }
}

/* 优化树节点样式 */
:deep(.ant-tree) {
  background: transparent;
  
  .ant-tree-treenode {
    padding: 4px 0;
    
    &:hover {
      background: #f5f5f5;
    }
  }
  
  .ant-tree-node-content-wrapper {
    min-height: 24px;
    line-height: 24px;
  }
  
  .ant-tree-switcher {
    width: 24px;
    height: 24px;
    line-height: 24px;
  }
}

/* 确保行布局正确 */
.ant-row {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin: 0 -8px;
}

.ant-col {
  display: flex;
  flex: 1;
  padding: 0 8px;
  min-width: 0;
  overflow: hidden;
}

:deep(.ant-card) {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

:deep(.ant-card-head) {
  flex: 0 0 auto;
}

:deep(.ant-card-body) {
  flex: 1 1 auto; /* 占据卡片中所有剩余空间 */
  height: 0; /* 关键：强制内容区域收缩 */
  min-height: 0; /* 允许内容区域收缩 */
  overflow: auto; /* 内容过多时可滚动 */
  display: flex;
  flex-direction: column;
  padding: 16px; /* 减小内边距 */
}

.info-grid,
.tree-container {
  flex: 1 1 auto; /* 占据所有可用空间 */
  min-height: 0; /* 关键：允许内容区域收缩 */
  overflow: auto; /* 内容过多时可滚动 */
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 信息项 - 可能需要防止它们撑开容器 */
.info-item {
  flex-shrink: 0; /* 防止项目被压缩 */
  /* 其他样式保持不变 */
}

/* 标签样式优化 */
:deep(.ant-tag) {
  border-radius: 4px;
  padding: 2px 8px;
  
  &.ant-tag-success {
    background: #f6ffed;
    border-color: #b7eb8f;
  }
}

/* 统计卡片行样式 */
.ant-row {
  :deep(.ant-card) {
    background: #fff;
    
    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
    }
    
    .ant-statistic {
      transition: background-color 0.3s; /* 只保留背景色过渡效果 */
      
      &:hover {
        transform: none; /* 移除位移效果 */
      }
    }
  }
}

.centered-empty-state {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 确保父容器也支持flex布局 */
.sitemap-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
}

/* 更新 competitors-section 相关样式 */
.competitors-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.competitors-tags {
  display: none; /* 默认隐藏 */
  min-height: 0;
  padding: 0;
  
  /* 只在有内容时显示 */
  &:not(:empty) {
    display: block; /* 有内容时才显示 */
    min-height: 32px;
    padding: 4px 0;
    margin-bottom: 8px;
  }
}

.competitors-input {
  margin-top: 0; /* 修改这里，原来是 4px */
  padding-top: 0; /* 修改这里，原来是 4px */
}

:deep(.ant-select) {
  margin-bottom: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;  /* 控制 Traffic 和下拉框之间的间距 */
  height: 40px;
  padding: 4px 0;
}

.title-text {
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.ant-select) {
  height: 24px;
  line-height: 24px;
}

:deep(.ant-select-selector) {
  height: 24px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-select-selection-item) {
  line-height: 22px !important;
  height: 22px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-space) {
  display: flex;
  align-items: center;
}

.product-modal {
  .step-description {
    color: #666;  /* 改为灰色,区分于标题 */
    font-size: 13px;
    margin: 0 0 8px;
    line-height: 1.5;
    padding: 8px 12px;
    background: #f5f5f5;  /* 改为浅灰色背景 */
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .help-text {
    color: #8c8c8c;  /* 改为更浅的灰色 */
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 修复输入框组件高度不一致的问题 */
  :deep(.ant-input-group) {
    display: flex;
    align-items: stretch; /* 确保子元素高度一致 */

    .ant-input-group-addon {
      display: inline-flex;
      align-items: center;
      height: 32px; /* 统一高度为32px */
      line-height: 32px;
      background: #fafafa;
      border: 1px solid #d9d9d9;
      border-right: none;
      border-radius: 6px 0 0 6px;
      padding: 0 11px;
    }

    .ant-input {
      height: 32px; /* 统一高度为32px */
      line-height: 32px;
      border-radius: 0 6px 6px 0;
    }
  }

  /* 表单标题使用更深的颜色 */
  :deep(.ant-form-item-label) {
    label {
      color: #262626; /* 使用更深的颜色 */
      font-weight: 500;
      font-size: 14px;
    }
  }

  /* 修改编辑模态框中的域名验证标签 */
  :deep(.domain-status .ant-tag) {
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    height: 26px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    
    /* 增强验证标签的可见性 */
    &.ant-tag-success {
      background: #52c41a;
      color: white;
      font-weight: 600;
      border: none;
      box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
      animation: pulseSuccess 2s infinite;
    }
    
    /* 未验证标签也增强显示 */
    &.ant-tag-warning {
      background: #faad14;
      color: white;
      font-weight: 600;
      border: none;
      box-shadow: 0 2px 6px rgba(250, 173, 20, 0.3);
    }
  }
}

/* 添加成功标签的脉冲动画 */
@keyframes pulseSuccess {
  0% {
    box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
  }
  50% {
    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.5);
  }
  100% {
    box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
  }
}

/* 更新欢迎标题样式 */
.welcome-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  
  .beta-tag {
    background: linear-gradient(135deg, #1677ff, #4096ff);  /* 改为蓝色渐变 */
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  
  .title-text {
    background: linear-gradient(135deg, #1677ff, #4096ff);  /* 改为蓝色渐变 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  }
}

/* 优化表单间距 */
.product-modal {
  :deep(.ant-form-item) {
    .ant-form-item-label {
      padding-bottom: 4px;
    }
  }
  
  .step-description {
    margin: 0 0 8px;
    padding: 6px 10px;
  }
  
  .help-text {
    margin-top: 4px;
  }
}

.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.todo-list {
  margin: 24px 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.todo-info {
  text-align: left;
}

.todo-title {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

.todo-desc {
  display: block;
  color: #666;
  font-size: 14px;
}

.skip-action {
  margin-top: 24px;
}

/* 修改浮动面板样式，添加发光效果 */
.setup-progress-panel {
  position: fixed;
  bottom: 24px;
  right: 88px; /* 修改这里，从24px改为88px，给Intercom留出空间 */
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
              0 0 0 1px rgba(24, 144, 255, 0.1),
              0 0 20px rgba(24, 144, 255, 0.2);
  padding: 16px;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: pulse 2s infinite;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(24, 144, 255, 0.2),
                0 0 30px rgba(24, 144, 255, 0.3);
  }
}

/* 添加脉冲动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
                0 0 0 1px rgba(24, 144, 255, 0.1),
                0 0 20px rgba(24, 144, 255, 0.2);
  }
  50% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
                0 0 0 1px rgba(24, 144, 255, 0.2),
                0 0 30px rgba(24, 144, 255, 0.4);
  }
  100% {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
                0 0 0 1px rgba(24, 144, 255, 0.1),
                0 0 20px rgba(24, 144, 255, 0.2);
  }
}

/* 给未完成的步骤添加闪光效果 */
.progress-step:not(.completed) {
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: shine 3s infinite;
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 200%;
  }
  100% {
    left: 200%;
  }
}

/* 优化步骤图标的发光效果 */
.step-icon {
  &.pending {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      background: linear-gradient(45deg, #1890ff, #69c0ff);
      opacity: 0.2;
      z-index: -1;
      animation: iconGlow 2s infinite;
    }
  }
}

@keyframes iconGlow {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f7ff;
  }
  
  &.completed {
    background: #f6ffed;
  }
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  
  &.completed {
    color: #52c41a;
    background: #f6ffed;
  }
  
  &.pending {
    color: #1890ff;
    background: #e6f7ff;
  }
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 2px;
}

.step-desc {
  font-size: 12px;
  color: #8c8c8c;
}

.step-action {
  margin-left: auto;
}

/* 添加进入和离开动画 */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.progress-status {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4px 12px;
  border-radius: 12px;
}

.analytics-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
}

.traffic-analytics-content {
  padding: 24px;
}

:deep(.ant-tag) {
  margin: 0;
  font-size: 12px;
  line-height: 1;
  padding: 2px 6px;
}

:deep(.ant-divider-vertical) {
  margin: 0 16px;
  border-left: 1px solid #e8e8e8;
}

.chart-wrapper {
  width: 100%;
  height: 400px;
  position: relative;
}

.centered-empty-state {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quick-access-panel {
  :deep(.ant-card-head) {
    background: linear-gradient(135deg, #1677ff, #4096ff);
    border-radius: 8px 8px 0 0;
    
    .ant-card-head-title {
      color: white;
    }
  }
}

.inline-stats {
  display: flex;
  align-items: center;
}

:deep(.inline-stat) {
  display: flex;
  align-items: center;
  background: none;  /* 确保没有背景 */
  padding: 0;  /* 移除内边距 */
  
  .ant-statistic-title {
    margin: 0;
    margin-right: 8px;
    font-size: 13px;
    color: #666;
  }
  
  .ant-statistic-content {
    margin: 0;
    font-size: 13px;
    background: none;  /* 确保没有背景 */
    
    .ant-statistic-content-value {
      font-size: 13px;
    }
  }
  
  .ant-tag {
    font-size: 12px;
    line-height: 16px;
    height: 16px;
    padding: 0 4px;
  }
}

:deep(.ant-divider-vertical) {
  border-left: 1px solid #f0f0f0;
}

:deep(.ant-divider-vertical) {
  height: 40px;
  margin: 0;
}

/* 移除所有背景相关样式 */
.compact-stat {
  background: none;
  padding: 0;
  
  :deep(.ant-statistic-title) {
    font-size: 13px;
    color: #666;
    margin-bottom: 0;
    background: none;
  }

  :deep(.ant-statistic-content) {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #262626;
    line-height: 1;
    white-space: nowrap;
    background: none;
  }
}

/* 添加折叠面板样式 */
:deep(.ant-collapse) {
  background: transparent;
  border: none;
}

:deep(.ant-collapse-item) {
  margin-bottom: 16px;
  border: none;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
}

/* 标题区域样式优化 */
:deep(.ant-collapse-header) {
  font-size: 16px;
  font-weight: 500;
  padding: 16px 24px !important;
  background: linear-gradient(to right, #fafafa, #f5f5f5) !important;  /* 更改为浅色渐变 */
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
  position: relative;
  
  /* 添加微妙的光晕效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at top right, rgba(24, 144, 255, 0.03), transparent 70%),
      radial-gradient(circle at bottom left, rgba(24, 144, 255, 0.03), transparent 70%);
    pointer-events: none;
  }
  
  /* 添加鼠标悬停效果 */
  &:hover {
    background: linear-gradient(to right, #f5f5f5, #f0f0f0) !important;
    cursor: pointer;
    
    .ant-collapse-expand-icon {
      opacity: 0.9;
    }
  }
  
  /* 优化展开图标 */
  .ant-collapse-expand-icon {
    color: #1890ff;
    font-size: 16px;
    margin-right: 12px;
    transition: all 0.3s ease;
    opacity: 0.8;
  }
  
  /* 标题文本样式 */
  .ant-collapse-header-text {
    color: #262626;
    display: flex;
    align-items: center;
    gap: 8px;
    
    /* 让 emoji 更突出 */
    span {
      font-size: 20px;
      margin-right: 4px;
    }
  }
}

/* 激活状态的面板样式 */
:deep(.ant-collapse-item-active) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  .ant-collapse-header {
    background: linear-gradient(to right, #f0f7ff, #e6f4ff) !important;  /* 激活时使用浅蓝色渐变 */
    
    /* 激活状态下的展开图标 */
    .ant-collapse-expand-icon {
      color: #1890ff;
    }
  }
}

:deep(.ant-collapse-content) {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.ant-collapse-content-box) {
  padding: 24px !important;
  background: white;
}

/* 移除最后一个折叠面板的底部间距 */
:deep(.ant-collapse-item:last-child) {
  margin-bottom: 0;
}

/* 添加展开/折叠动画 */
:deep(.ant-collapse-content) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.ant-collapse-content-active {
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 修改 info-card 相关样式 */
:deep(.info-card) {
  position: relative;
  background: white;
  z-index: 1;
  border: none !important; /* 移除原始边框 */
  
  /* 移除 header 的底部边框 */
  .ant-card-head {
    border-bottom: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      #69b1ff,  /* 深蓝色 */
      #7c8eff,  /* 蓝紫色 */
      #9f8fff,  /* 淡紫色 */
      #7c8eff,  /* 蓝紫色 */
      #69b1ff   /* 深蓝色 */
    );
    border-radius: 10px;
    z-index: -1;
    animation: glowing 30s linear infinite;
    background-size: 400%;
    filter: blur(3px);
    opacity: 0.8;
  }

  /* 确保卡片内容区域有正确的背景色和圆角 */
  :deep(.ant-card-body) {
    background: white;
    border-radius: 8px;
    position: relative;
    z-index: 2;
  }
}

@keyframes glowing {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.product-info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  :deep(.ant-card-body) {
    height: calc(100% - 57px);
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  gap: 16px;
}

.info-row .info-item {
  flex: 1;
  min-width: 0; /* 确保flex项目可以缩小到比内容更小 */
}

.info-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px; /* 增加内边距 */
  transition: all 0.3s ease;
  margin-bottom: 8px; /* 增加底部间距 */
}

.info-item:hover {
  background: #f0f0f0;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600; /* 加粗标签 */
  font-size: 16px; /* 增加标签字号 */
  color: #262626;
  margin-bottom: 16px; /* 增加与内容的间距 */
}

.info-content {
  font-size: 18px; /* 进一步增加字体大小 */
  font-weight: 500;
  line-height: 1.6; /* 增加行高 */
  color: #262626; /* 加深颜色提高对比度 */
}

.website-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  line-height: 1.6; /* 增加行高 */
  font-size: 16px; /* 增加字号 */
}

.website-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #1890ff;
  font-size: 16px; /* 增加链接字号 */
  font-weight: 500;
}

.pages-stats-horizontal {
  display: flex;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.competitors-stats-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* 增加间距 */
}

.competitor-tag {
  margin: 0;
  font-size: 16px; /* 进一步增加竞争对手标签的字体大小 */
  padding: 6px 14px; /* 增加内边距使标签更大 */
  line-height: 1.6; /* 增加行高 */
}

.competitor-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  font-size: 16px; /* 增加链接字号 */
  line-height: 1.6; /* 增加行高 */
}

.no-competitors {
  color: #8c8c8c;
  font-style: italic;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background: linear-gradient(145deg, #f0f7ff, #e6f4ff);
  border: 1px solid rgba(24, 144, 255, 0.2);
  color: #1890ff;
  font-weight: 500;
  transition: all 0.3s;
  
  &:hover {
    background: linear-gradient(145deg, #e6f4ff, #d6e8ff);
    border-color: rgba(24, 144, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
  }
  
  :deep(.anticon) {
    font-size: 14px;
  }
}

.verify-button {
  padding: 0 12px;
  height: 24px;
  border-radius: 4px;
  
  &:hover {
    background: #e6f4ff;
  }
}

.features-text {
  max-height: 120px; /* 增加最大高度 */
  overflow-y: auto;
  padding-right: 8px;
  line-height: 1.6; /* 增加行高 */
  font-size: 16px; /* 增加字号 */
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 2px;
  }
}

.competitors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* 增加间距 */
}

.competitor-tag {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid rgba(24, 144, 255, 0.08);
  border-radius: 6px;
  padding: 4px 12px;
  transition: all 0.3s;
  
  &:hover {
    background: linear-gradient(145deg, #f8fafc, #f0f7ff);
    border-color: rgba(24, 144, 255, 0.15);
    transform: translateY(-1px);
  }
  
  a {
    color: #4b5563;
    font-weight: 500;
    
    &:hover {
      color: #1890ff;
    }
  }
}

.empty-text {
  color: #8c8c8c;
  font-style: italic;
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  min-height: 56px;
}

:deep(.ant-card-body) {
  padding: 24px;
}
/* 优化过渡动画 */
.panel-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.setup-progress-panel {
  /* ... existing styles ... */
  
  /* 添加初始显示时的动画 */
  animation: panelAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes panelAppear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 更新 header-actions 样式 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 移除旧的 edit-button 样式 */
.edit-button {
  display: none;
}

:deep(.ant-btn-link) {
  padding: 4px 8px;
  height: auto;
  
  .anticon {
    font-size: 14px;
  }
  
  &.ant-btn-dangerous {
    color: #ff4d4f;
    
    &:hover {
      color: #ff7875;
    }
  }
}

/* 更新样式 */
.form-bottom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.switch-account-wrapper {
  text-align: center;
}

.switch-account-btn {
  font-size: 13px;
  padding: 0;
  height: auto;
  color: #8c8c8c;
}

.switch-account-btn:hover {
  color: #1890ff;
}

/* Update existing styles */
.website-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.website-prefix {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 11px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-right: none;
  border-radius: 6px 0 0 6px;
}

.website-input {
  width: calc(100% - 90px) !important;
  
  :deep(.ant-input) {
    border-radius: 0 6px 6px 0;
    height: 32px;
  }
}

.domain-status {
  display: flex;
  align-items: center;
  
  :deep(.ant-tag) {
    margin: 0;
    font-size: 12px;
    line-height: 20px;
    height: 22px;
    padding: 0 8px;
    display: flex;
    align-items: center;
  }
}

/* 主容器样式 */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 64px); /* 减去顶部导航栏高度 */
}

/* Discord横幅样式 */
.discord-banner {
  flex: 0 0 auto; /* 不伸缩，保持原始大小 */
  margin-bottom: 16px;
}

/* 主要内容区域 - 卡片行，占据所有剩余空间 */
.card-row {
  display: flex;
  flex: 1 1 0; /* 占据所有剩余空间，可伸缩，基础大小为0 */
  min-height: 0; /* 关键：允许flex项在容器内收缩 */
  overflow: hidden; /* 防止溢出 */
  margin: 0 -8px; /* 抵消内部padding */
}

/* 卡片列样式 */
.card-col {
  display: flex;
  flex-direction: column;
  flex: 1 1 0; /* 平均分配空间，可伸缩 */
  min-width: 0; /* 允许内容在必要时收缩 */
  padding: 0 8px;
  height: 100%; /* 确保高度填满父容器 */
}

/* 卡片样式 - 确保填满整个列高度 */
.product-info-card,
.sitemap-card {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto; /* 填满可用空间 */
  height: 100%; /* 确保高度填满父容器 */
  overflow: hidden; /* 防止内容溢出 */
}

/* 卡片头部样式 - 固定高度 */
:deep(.ant-card-head) {
  flex: 0 0 auto; /* 不伸缩，保持原始大小 */
  min-height: 56px; /* 固定头部高度 */
}

/* 卡片内容区域 - 可滚动 */
:deep(.ant-card-body) {
  flex: 1 1 auto; /* 占据卡片中所有剩余空间 */
  height: 0; /* 关键：强制内容区域收缩并允许滚动 */
  min-height: 0; /* 允许内容区域收缩 */
  overflow: auto; /* 内容过多时可滚动 */
  display: flex;
  flex-direction: column;
}

.info-grid {
  flex: 1 1 auto; /* 占据所有可用空间 */
  min-height: 0; /* 允许内容区域收缩 */
  overflow: auto; /* 内容过多时可滚动 */
}

/* 移除可能导致额外高度的边距 */
.info-grid {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

/* 添加到样式部分 */
.stat-value.enlarged {
  font-size: 24px;  /* 放大数字 */
  font-weight: 600;
  color: #1890ff;  /* 使用主题蓝色 */
}

.pages-stats-horizontal {
  display: flex;
  justify-content: space-around;  /* 均匀分布 */
  width: 100%;
  padding: 8px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;  /* 增加左右内边距 */
}

.stat-label {
  font-size: 14px;  /* 稍微放大标签 */
  color: #8c8c8c;
  margin-bottom: 8px;  /* 增加与数值的间距 */
}

/* 产品信息卡片标题区域样式 */
:deep(.ant-card-head) {
  display: flex;
  align-items: center;
}

:deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
}

:deep(.ant-card-extra) {
  display: flex;
  align-items: center;
}

/* 编辑按钮样式 */
.edit-product-btn {
  background: linear-gradient(135deg, #1677ff, #4096ff);
  border: none;
  border-radius: 6px;
  padding: 0 16px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
  transition: all 0.3s;
}

.edit-product-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
  background: linear-gradient(135deg, #4096ff, #1677ff);
}

/* 移除旧的 edit-button 样式 */
.edit-button {
  display: none;
}

/* 更新卡片标题样式 */
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
}

.card-title span {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-divider-vertical) {
  height: 40px;  /* 增加高度 */
  margin: 0 24px;  /* 增加左右间距 */
}

/* 添加产品名称和竞争对手的字号放大样式 */
.info-content {
  font-size: 16px; /* 增加字体大小 */
  font-weight: 500; /* 增加字重 */
}

.competitor-tag {
  font-size: 14px; /* 增加竞争对手标签的字体大小 */
}

.competitor-link {
  font-weight: 500; /* 增加链接的字重 */
}

.table-summary {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f9f9f9;
  border-radius: 4px;
  flex-wrap: wrap;
}

.table-summary > div {
  margin-right: 16px;
  margin-bottom: 4px;
}

/* 确保URL列不会占用太多空间 */
:deep(.ant-table-thead > tr > th.ant-table-column-has-sorters:hover) {
  background: #f5f5f5;
}

:deep(.ant-table-column-title) {
  flex: 1;
  min-width: 0;
}

/* 添加骨架屏样式 */
.dashboard-skeleton {
  width: 100%;
  padding: 16px;
}

.skeleton-header {
  margin-bottom: 16px;
}

:deep(.ant-skeleton-title) {
  margin-bottom: 16px !important;
}

:deep(.ant-skeleton-paragraph li) {
  height: 40px !important;  /* 减小高度，从80px改为40px */
  margin-bottom: 12px !important;  /* 减小间距，从16px改为12px */
  border-radius: 4px;  /* 添加圆角 */
}

:deep(.ant-skeleton-paragraph li:nth-child(2n)) {
  width: 92% !important;  /* 让偶数行宽度不同，更自然 */
}

:deep(.ant-skeleton-paragraph li:nth-child(3n)) {
  width: 88% !important;  /* 让第3的倍数行宽度不同，更自然 */
}

:deep(.ant-skeleton-paragraph li:last-child) {
  width: 60% !important;  /* 最后一行宽度缩短，从100%改为60% */
}
</style>