<template>
  <page-layout
    title="Dashboard"
    description="Manage your product and track your performance"
    icon="📊"
  >
    <!-- Product info and statistics banner -->
    <div class="dashboard-content">
      <!-- Product Info Card -->
      <a-card class="info-card">
        <template #title>
          <div class="card-title">
            <span>Product Information</span>
            <a-space>
              <a-button 
                type="link" 
                danger 
                @click="deleteProduct" 
                v-if="productInfo?.productId"
              >
                <DeleteOutlined /> Delete
              </a-button>
              <a-button 
                type="link" 
                @click="showSitemapModal" 
                :disabled="!productInfo || loadingSitemap || !productInfo?.projectWebsite || !productInfo?.domainStatus"
                v-if="productInfo?.productId"
              >
                <template v-if="loadingSitemap">Loading...</template>
                <template v-else-if="!productInfo?.projectWebsite || !productInfo?.domainStatus">
                  Add your site to get sitemap automatically →
                </template>
                <template v-else>Sitemap</template>
              </a-button>
              <a-button 
                type="link" 
                @click="editProductInfo"
                :disabled="!productInfo"
                v-if="productInfo?.productId"
              >
                <EditOutlined /> Edit
              </a-button>
            </a-space>
          </div>
        </template>

        <!-- Loading skeleton -->
        <template v-if="!productInfo">
          <a-skeleton active :paragraph="{ rows: 3 }" />
        </template>
        
        <!-- Error state -->
        <template v-else-if="!productInfo.productId">
          <a-result
            status="error"
            title="Failed to load product information"
            sub-title="Please contact support@website-lm.com"
          />
        </template>
        
        <!-- Product info content -->
        <template v-else>
          <a-descriptions>
            <a-descriptions-item label="Product Name">
              {{ productInfo.productName }}
            </a-descriptions-item>

            <a-descriptions-item label="Your Site">
              <template v-if="productInfo.projectWebsite">
                <a-space>
                  <a :href="productInfo.projectWebsite" target="_blank">
                    {{ productInfo.projectWebsite }}
                  </a>
                  <template v-if="productInfo.domainStatus">
                    <a-tag color="success">
                      <CheckCircleOutlined /> Verified
                    </a-tag>
                  </template>
                  <template v-else>
                    <a-button 
                      type="primary" 
                      size="small"
                      @click="openEditWithBasicInfoToVerify"
                      :loading="goStartVerifying"
                    >
                      Go Start Verifying
                    </a-button>
                  </template>
                </a-space>
              </template>
              <template v-else>
                <a-typography-text type="secondary">
                  No site added... <a @click="editProductInfo()">click here to add your site →</a>
                </a-typography-text>
              </template>
            </a-descriptions-item>

            <a-descriptions-item label="Your Competitors">
              <template v-if="competitors.length">
                <a-space wrap>
                  <a-tag 
                    v-for="(comp, index) in competitors" 
                    :key="comp.name"
                    :color="['blue', 'green', 'orange', 'purple'][index % 4]"
                  >
                    <a :href="'https://' + comp.url" target="_blank">
                      {{ comp.name }}
                    </a>
                  </a-tag>
                </a-space>
              </template>
              <template v-else>
                <a-typography-text type="secondary">
                  No competitors added
                </a-typography-text>
              </template>
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </a-card>

      <!-- Metrics Cards -->
      <a-row :gutter="[16, 16]" v-if="productInfo?.productId">
        <a-col :span="8">
          <a-card>
            <template #title>
              <span>📄 Pages</span>
            </template>
            <a-statistic-group>
              <a-statistic 
                title="Generated Pages" 
                :value="generatedPages.length"
              />
              <a-statistic 
                title="Published Pages" 
                :value="publishedPages || 0" 
              />
            </a-statistic-group>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card>
            <template #title>
              <a-space>
                <span>👥 Visits</span>
                <a-typography-text type="secondary" v-if="isGscConnected && gscSites.length > 0">
                  {{ gscSites[0].siteUrl }}
                </a-typography-text>
              </a-space>
            </template>
            <template #extra>
              <a-button 
                type="link" 
                @click="connectGSC"
                :disabled="isGscConnected"
              >
                {{ isGscConnected ? 'Connected!' : 'Connect GSC' }}
              </a-button>
            </template>
            <a-statistic title="Total Visits" value="-">
              <template #suffix>
                <a-tag color="success">↑ -</a-tag>
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card>
            <template #title>
              <a-space>
                <span>🎯 Clicks</span>
                <a-typography-text type="secondary" v-if="isGscConnected && gscSites.length > 0">
                  {{ gscSites[0].siteUrl }}
                </a-typography-text>
              </a-space>
            </template>
            <template #extra>
              <a-button 
                type="link" 
                @click="connectGSC"
                :disabled="isGscConnected"
              >
                {{ isGscConnected ? 'Connected!' : 'Connect GSC' }}
              </a-button>
            </template>
            <a-statistic title="Total Clicks" value="-">
              <template #suffix>
                <a-tag color="success">↑ -</a-tag>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-layout>

  <!-- Add onboarding modal -->
  <a-modal
    v-model:open="onboardingModalVisible"
    :maskClosable="false"
    :closable="!!formState.productId"
    :width="800"
    :footer="null"
    :class="['product-modal']"
  >
    <template #title>
      <div class="modal-title">
        <template v-if="!formState.productId">
          <a-tag color="blue">BETA</a-tag>
          <span>🚀 Welcome to WebsiteLM!</span>
        </template>
        <template v-else>
          <span>✏️ Edit Product Information</span>
        </template>
      </div>
    </template>

    <a-form 
      :model="formState" 
      layout="vertical"
      @finish="handleOnboardingFinish"
      ref="formRef"
    >
      <!-- 基本信息 -->
      <a-form-item 
        label="Product Name" 
        name="productName"
        :rules="[{ required: true, message: 'Please enter product name' }]"
      >
        <a-input 
          v-model:value="formState.productName" 
          placeholder="Enter your product name"
          :maxLength="50"
        />
      </a-form-item>

      <!-- 网站信息和域名验证 -->
      <a-form-item 
        label="Official Website" 
        name="website"
      >
        <a-input-group compact>
          <a-select
            v-model:value="websitePrefix"
            style="width: 90px"
            :disabled="true"
          >
            <a-select-option value="https://">https://</a-select-option>
          </a-select>
          <a-input 
            v-model:value="formState.website" 
            style="width: calc(100% - 90px)"
            placeholder="example.com"
            @change="handleWebsiteChange"
          />
        </a-input-group>

        <!-- 域名验证部分 -->
        <template v-if="formState.productId">
          <template v-if="(!productInfo.domainStatus || formState.website !== productInfo.projectWebsite?.replace('https://', '')) && formState.website">
            <a-typography-text type="secondary" class="mt-3 d-block">
              <InfoCircleOutlined /> Domain verification required for automatic sitemap and content fetching
            </a-typography-text>
            
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
                  <div class="verify-record-row">
                    <span class="verify-label">Host:</span>
                    <a-typography-text code copyable>
                      {{ verifyRecord?.host || '_' }}
                    </a-typography-text>
                  </div>
                  <div class="verify-record-row">
                    <span class="verify-label">Value:</span>
                    <a-typography-text code copyable>
                      {{ verifyRecord?.value || '_' }}
                    </a-typography-text>
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
          <template v-else-if="productInfo.domainStatus && formState.website === productInfo.projectWebsite?.replace('https://', '')">
            <a-tag color="success" class="mt-3">
              <CheckCircleOutlined /> Domain Verified
            </a-tag>
          </template>
        </template>
      </a-form-item>

      <!-- 竞品分析 -->
      <a-form-item label="Competitors">
        <div class="competitors-section">
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

          <a-space class="mt-3">
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
              <template #icon><PlusOutlined /></template>
              Add
            </a-button>
          </a-space>
        </div>
      </a-form-item>

      <!-- 底部按钮 -->
      <a-form-item>
        <a-button 
          type="primary" 
          html-type="submit"
          :loading="loading"
          :disabled="!formState.productName"
          block
        >
          {{ formState.productId ? 'Save Changes' : 'Start Using WebsiteLM' }}
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- Add success modal component -->
  <success-modal
    v-model:open="successModalVisible"
    @close="handleSuccessModalClose"
  />

  <!-- 添加新 Sitemap 模态框 -->
  <a-modal
    v-model:open="sitemapModalVisible"
    title="Website Structure"
    :width="1000"
    :footer="null"
    class="sitemap-modal"
  >
    <div class="sitemap-modal-content">
      <div class="sitemap-container">
        <!-- Left: Tree structure -->
        <div class="tree-section">
          <div class="section-header">
            <SearchOutlined />
            <span>Navigation Tree</span>
          </div>
          <div class="tree-content custom-scrollbar">
            <a-tree 
              :tree-data="sitemapData" 
              @select="handleTreeSelect"
              class="custom-tree"
            />
          </div>
        </div>
        
        <!-- Right: Page details -->
        <div class="pages-section">
          <div class="section-header">
            <FileTextOutlined />
            <span>Page List</span>
          </div>
          <div class="pages-content custom-scrollbar">
            <template v-if="selectedPages.length">
              <div class="page-list">
                <div v-for="page in selectedPages" :key="page.loc" class="page-item">
                  <div class="page-info">
                    <a :href="page.loc" target="_blank" class="page-link">
                      <LinkOutlined />
                      <span class="page-url">{{ page.loc }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="empty-state">
                <FolderOpenOutlined />
                <p>Select a category from the tree to view pages</p>
              </div>
            </template>
          </div>
        </div>
      </div> 
    </div>
  </a-modal>

  <!-- 添加 GSC 连接成功的 Modal -->
  <a-modal
    v-model:open="gscSuccessModalVisible"
    :footer="null"
    :maskClosable="false"
    :closable="false"
    class="gsc-success-modal"
  >
    <div class="success-content">
      <div class="success-icon">✨</div>
      <h3>Connected Successfully!</h3>
      <p>Please close this window and refresh the page</p>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { CopyOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, FileTextOutlined, LineChartOutlined, NodeIndexOutlined } from '@ant-design/icons-vue'
import apiClient from '../api/api'
import SuccessModal from './SuccessModal.vue'
import { CalendarOutlined, LinkOutlined, SearchOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import { GlobalOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

export default defineComponent({
  components: {
    CopyOutlined,
    PageLayout,
    EditOutlined,
    DeleteOutlined,
    ThunderboltOutlined,
    SuccessModal,
    CalendarOutlined,
    LinkOutlined,
    FileTextOutlined,
    LineChartOutlined,
    NodeIndexOutlined,
    SearchOutlined,
    FolderOpenOutlined,
    GlobalOutlined
  },
  data() {
    return {
      traffic: '-',
      clicks: '-',
      purchases: '-',
      productInfo: null,
      onboardingModalVisible: false,
      loading: false,
      websitePrefix: 'https://',
      defaultCompetitors: [],
      formState: {
        productId: undefined,
        productName: '',
        website: '',
        coreFeatures: '',
        competitors: []
      },
      successModalVisible: false,
      currentView: 'sitemap',
      generatedPages: [],
      monthlyNewPages: 0,
      newCompetitor: {
        name: '',
        url: ''
      },
      sitemapData: [],
      allPages: [],
      loadingSitemap: false,
      selectedPages: [],
      sitemapModalVisible: false,
      publishedPages: 0,
      isGscConnected: false,
      gscSites: [],
      gscAnalytics: null,
      gscSuccessModalVisible: false,
      gscCheckInterval: null,
      findingCompetitors: false,
      currentStep: 0, // 添加当前步骤
      showFeatures: false, // 添加新的数据属性
      showVerifyRecord: false,
      verifyRecord: '',
      verifying: false,
      startVerifying: false,
      goStartVerifying: false,
      originalDomainStatus: null, // 新增：保存原始域名验证状态
    }
  },
  created() {
    this.loadProductInfo()
    this.handleGscCallback()
    this.checkGscStatus()
    this.startGscStatusCheck()
  },
  beforeUnmount() {
    if (this.gscCheckInterval) {
      clearInterval(this.gscCheckInterval)
    }
  },
  setup() {
    const showOnboardingModal = ref(false)
    const isComponentMounted = ref(false)
    const pagesTable = ref(null)
    const productModalVisible = ref(false)
    
    onMounted(() => {
      isComponentMounted.value = true
    })

    onUnmounted(() => {
    })

    return {
      showOnboardingModal,
      isComponentMounted,
      pagesTable,
      productModalVisible
    }
  },
  computed: {
    competitors() {
      if (!this.productInfo || !this.productInfo.competeProduct) return []
      return this.productInfo.competeProduct.split(',').map(item => {
        const [name, url] = item.split('|');
        return { name, url };
      });
    }
  },
  methods: {
    async copyRecord(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.$message.success('Copied to clipboard');
      } catch (error) {
        this.$message.error('Failed to copy');
      }
    },

    async checkDomainVerification() {
      if (!this.formState.website) return;

      try {
        this.goStartVerifying = true;
        const domain = this.formState.website.replace(/^https?:\/\//, '');
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getDomain({
          customerId,
          domainName: domain
        });
        if (response?.code === 200 && response.data?.textRecord) {
          // 如果存在TXT记录,显示验证记录
          this.verifyRecord = JSON.parse(response.data.textRecord);
          this.showVerifyRecord = true;
        }
      } catch (error) {
        console.error('检查域名验证状态失败:', error);
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

    editProductInfo() {
      this.originalDomainStatus = this.productInfo?.domainStatus;
      this.formState = {
        productId: this.productInfo.productId,
        productName: this.productInfo.productName,
        website: this.productInfo.projectWebsite?.replace('https://', ''),
        coreFeatures: this.productInfo.productDesc,
        competitors: this.competitors,
        domainStatus: this.productInfo.domainStatus
      };
      this.onboardingModalVisible = true;
    },
    
    async loadProductInfo() {
      try {
        const response = await apiClient.getProductsByCustomerId()
        
        if (response?.code === 200) {
          this.productInfo = response.data
          if (!response.data) {
            // Reset step to 0 when opening onboarding
            this.currentStep = 0;
            this.formState = {
              productId: undefined,
              productName: '',
              website: '',
              coreFeatures: '',
              competitors: []
            }
            this.onboardingModalVisible = true
          } else {
            if (this.productInfo.domainStatus) {
              this.getSitemap()
            }
          }
        } else {
          // Handle error response code
          this.$notification.error({
            message: 'Failed to Load Product',
            description: 'Unable to load product information. Please try again later.'
          });
          this.productInfo = {} // 修改这里: 从 null 改为空对象
        }
      } catch (error) {
        console.error('Failed to load product information:', error)
        this.$notification.error({
          message: 'Failed to Load Product',
          description: 'An error occurred while loading product information. Please try again later.'
        });
        this.productInfo = {} // 修改这里: 从 null 改为空对象
      }
    },
    handleCompetitorChange(value) {
      if (value.length > 4) {
        this.formState.competitors = value.slice(0, 4)
      } else {
        this.formState.competitors = value
      }
    },
    async handleOnboardingFinish() {
      const currentDomain = this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '');
      const isDomainVerified = this.productInfo?.domainStatus;

      // 检查域名是否被修改且之前已验证
      if (isDomainVerified && this.formState.website !== currentDomain && this.formState.website) {
        // 显示确认对话框
        const confirmed = await new Promise(resolve => {
          Modal.confirm({
            title: 'Domain Change Confirmation',
            content: 'Changing the domain will invalidate the existing knowledge base, images, videos, internal links, and subdomains. Do you want to proceed and verify the new domain?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!confirmed) {
          return; // 如果用户取消，则不继续执行
        }
      }

      this.loading = true;
      try {
        const formData = {
          customerId: localStorage.getItem('currentCustomerId'),
          productName: this.formState.productName,
          productDesc: this.formState.coreFeatures,
          competeProduct: this.formState.competitors.map(comp => 
            `${comp.name}|${comp.url}`
          ).join(','),
          website: this.formState.website || '',
          sitemap: '',
          domainStatus: this.formState.website !== currentDomain ? false : this.originalDomainStatus
        };

        let response;
        if (this.formState.productId) {
          // 编辑模式 - 调用更新接口
          response = await apiClient.updateProduct(this.formState.productId, formData);
        } else {
          // Onboarding模式 - 调用创建接口
          response = await apiClient.createProduct(formData);
        }

        if (this.formState.website !== currentDomain && this.formState.website) {
          await this.generateNewVerificationRecord();
        }

        if (response?.code === 200) {
          if (!this.formState.productId) {
            this.successModalVisible = true;
            this.resetFormState();
          } else {
            this.$notification.success({
              message: 'Product Updated',
              description: 'Product information has been updated successfully.'
            });
          }
          
          this.onboardingModalVisible = false;
          await this.loadProductInfo();
        }
      } catch (error) {
        console.error('操作失败:', error);
        this.$notification.error({
          message: this.formState.productId ? '更新失败' : '设置失败',
          description: error.message || '保存品信息失败。请重试。'
        });
      } finally {
        this.loading = false;
        this.originalDomainStatus = null; // 重置原始状态
      }
    },

    // 新增方法：生成新的验证记录
    async generateNewVerificationRecord() {
      try {
        const domain = this.formState.website.replace(/^https?:\/\//, '');
        const response = await apiClient.createDomainWithTXT({
          customerId: localStorage.getItem('currentCustomerId'),
          domainName: domain
        });
        
        if (response?.code === 200) {
          this.verifyRecord = JSON.parse(response.data.txt);
          this.showVerifyRecord = true;
          
          // 显示新的验证记录提示
          this.$notification.info({
            message: 'Domain Verification Required',
            description: 'A new verification record has been generated for your domain. Please add it to your DNS settings.',
            duration: 0
          });
        }
      } catch (error) {
        console.error('Failed to generate verification record:', error);
        this.$notification.error({
          message: 'Verification Record Generation Failed',
          description: error.message || 'Failed to generate new verification record.'
        });
      }
    },

    resetFormState() {
      this.formState = {
        productId: undefined,
        productName: '',
        website: '',
        coreFeatures: '',
        competitors: [],
        domainStatus: false // 确保重置时验证状态为 false
      };
      this.showVerifyRecord = false;
      this.verifyRecord = null;
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
          this.productInfo = null
          this.formState = {
            productId: undefined,
            productName: '',
            website: '',
            coreFeatures: '',
            competitors: []
          }
          this.onboardingModalVisible = true
        }
      } catch (error) {
        this.$notification.error({
          message: 'Delete Failed',
          description: error.message || 'An error occurred while deleting product information'
        })
      }
    },
    handleWebsiteChange(e) {
      const newWebsite = e.target.value.trim();
      const currentDomain = this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '');
      
      if (newWebsite !== currentDomain) {
        // 只修改 formState 中的状态
        this.showVerifyRecord = false;
        this.verifyRecord = null;
        this.formState.domainStatus = false;
      } else {
        // 如果改回原来的域名，使用保存的原始状态
        this.formState.domainStatus = this.originalDomainStatus;
      }
      
      this.formState.website = newWebsite;
    },
    handleSuccessModalClose() {
      this.successModalVisible = false
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
    async getSitemap() {
      if (!this.productInfo?.projectWebsite || !this.productInfo.domainStatus) {
        return;
      }
      
      try {
        this.loadingSitemap = true;
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getSitemap(customerId);

        // 检查响应是否成功但数据为空
        if (response?.code === 200) {
          if (!response.data) {
            // 处理数据为 null 的情况
            this.allPages = [];
            this.sitemapData = [{
              key: 'empty',
              title: 'No pages found',
              selectable: false,
              children: []
            }];
            return;
          }

          const urls = response.data.sitemaps?.[0]?.urlset?.urls || [];
          if (!Array.isArray(urls)) {
            this.allPages = [];
            this.sitemapData = [{
              key: 'empty',
              title: 'No pages found',
              selectable: false,
              children: []
            }];
            return;
          }

          this.allPages = urls;
          this.sitemapData = this.processSitemap(urls);
        } else {
          throw new Error('Failed to get sitemap');
        }
        
      } catch (error) {
        console.error('Failed to get sitemap:', error);
        this.$message.error('Failed to get sitemap, please try again later');
        this.sitemapData = [{
          key: 'error',
          title: 'Failed to load sitemap',
          selectable: false,
          children: []
        }];
      } finally {
        this.loadingSitemap = false;
      }
    },

    processSitemap(urls) {
      const pathMap = new Map();
      const rootPages = [];
      
      urls.forEach(url => {
        const urlObj = new URL(url.loc);
        const pathname = urlObj.pathname;
        const segments = pathname.split('/').filter(Boolean);
        
        if (segments.length === 0 || segments.length === 1) {
          rootPages.push({
            ...url,
            displayPath: urlObj.hostname + pathname
          });
        } else {
          const firstSegment = segments[0];
          if (!pathMap.has(firstSegment)) {
            pathMap.set(firstSegment, {
              pages: []
            });
          }
          pathMap.get(firstSegment).pages.push(url);
        }
      });

      // Build tree structure
      const treeNodes = Array.from(pathMap.entries()).map(([key, value]) => ({
        key,
        title: `${key} (${value.pages.length})`,
        children: value.pages.map(page => ({
          key: page.loc,
          title: new URL(page.loc).pathname
        }))
      }));

      // Add root directory node
      if (rootPages.length > 0) {
        treeNodes.unshift({
          key: 'root',
          title: `Root Directory (${rootPages.length})`,
          children: rootPages.map(page => ({
            key: page.loc,
            title: page.displayPath
          }))
        });
      }
      return treeNodes;
    },
    handleTreeSelect(selectedKeys, { node }) {
      if (selectedKeys.length === 0) {
        this.selectedPages = [];
        return;
      }

      // 获取所有实际存在的页面（过滤掉虚拟目录）
      const getAllPages = (node) => {
        let pages = [];
        
        // 有当节点有实际的URL（不是虚拟目录时才添加
        if (node.key && node.key.startsWith('http')) {
          pages.push({ loc: node.key });
        }
        
        // 递归处理子节点
        if (node.children) {
          node.children.forEach(child => {
            pages = pages.concat(getAllPages(child));
          });
        }
        return pages;
      };

      this.selectedPages = getAllPages(node);
    },
    showSitemapModal() {
      this.sitemapModalVisible = true;
      if (!this.sitemapData) {
        this.getSitemap();
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },
    async connectGSC() {
      if (this.isGscConnected) {
        return // 如果已经连接，不执行任何操作
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
          console.log('GSC Sites loaded:', this.gscSites)
        }
      } catch (error) {
        console.error('Failed to load GSC data:', error)
      }
    },

    async checkGscStatus() {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.checkGscAuth(customerId)
        
        if (response?.code === 1201) {
          this.isGscConnected = false
          this.gscSites = []
          this.gscAnalytics = null
          return
        }
        
        this.isGscConnected = response?.code === 200
        
        if (this.isGscConnected) {
          await this.loadGscData()
        } else {
          this.gscSites = []
          this.gscAnalytics = null
        }
      } catch (error) {
        console.error('Failed to check GSC status:', error)
        this.isGscConnected = false
        this.gscSites = []
        this.gscAnalytics = null
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
    async findCompetitors() {
      if (!this.formState.coreFeatures) {
        this.$message.warning('Please enter product description first');
        return;
      }

      this.findingCompetitors = true;
      try {
        const response = await apiClient.findCompetitors({
          description: this.formState.coreFeatures
        });

        if (response?.code === 200 && response.data) {
          const newCompetitors = response.data.map(comp => ({
            name: comp.name,
            url: comp.url
          }));
          
          this.formState.competitors = [...newCompetitors];
          
          this.$message.success('Successfully found your competitors!');
        }
      } catch (error) {
        this.$message.error('Failed to find competitors: ' + (error.message || 'Unknown error'));
      } finally {
        this.findingCompetitors = false;
      }
    },
    nextStep() {
      if (this.formState.productName) {
        this.currentStep++;
      }
    },
    prevStep() {
      this.currentStep--;
    },
    toggleFeatures() {
      this.showFeatures = !this.showFeatures;
    },
    openEditWithBasicInfoToVerify() {
      this.currentStep = 0;
      this.openEditWithBasicInfo();
    },

    async startVerify() {
      this.startVerifying = true;
      try {
        // 先保存新的域名信息
        const formData = {
          customerId: localStorage.getItem('currentCustomerId'),
          productName: this.formState.productName,
          productDesc: this.formState.coreFeatures,
          competeProduct: this.formState.competitors.map(comp => 
            `${comp.name}|${comp.url}`
          ).join(','),
          website: this.formState.website,
          sitemap: ''
        };

        // 更新产品信息
        const updateResponse = await apiClient.updateProduct(this.formState.productId, formData);
        if (updateResponse?.code !== 200) {
          throw new Error('Failed to update product information');
        }

        // 重新加载产品信息
        await this.loadProductInfo();

        // 继续域名验证流程
        const domain = this.formState.website.replace(/^https?:\/\//, '');
        const response = await apiClient.createDomainWithTXT({
          customerId: localStorage.getItem('currentCustomerId'),
          domainName: domain
        });
        
        if (response?.code === 200) {
          this.verifyRecord = JSON.parse(response.data.txt);
          this.showVerifyRecord = true;
        }
      } catch (error) {
        this.$message.error('Failed to start verification: ' + (error.message || 'Unknown error'));
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
          await this.loadProductInfo();
        } else {
          this.$message.error('Verification failed. If you have added the TXT record correctly, please wait for some seconds and try again.');
        }
      } catch (error) {
        this.$message.error('Verification failed: ' + (error.message || 'Unknown error'));
      } finally {
        this.verifying = false;
      }
    },
    watch: {
      onboardingModalVisible(newVal) {
        if (newVal) {
          // Reset to first step whenever modal is opened
          this.currentStep = 0;
        }
      }
    },
    // 添加关闭弹窗的处理方法
    handleModalClose() {
      const currentDomain = this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '');
      if (this.formState.website === currentDomain) {
        // 使用保存的原始状态
        this.formState.domainStatus = this.originalDomainStatus;
        this.showVerifyRecord = false;
        this.verifyRecord = null;
      }
      this.onboardingModalVisible = false;
      // 重置原始状态
      this.originalDomainStatus = null;
    }
  }
})
</script>

<style scoped>
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 覆盖一些 Ant Design 默认样式 */
:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

:deep(.ant-descriptions-item) {
  padding-bottom: 16px;
}

.d-block {
  display: block;
}

.verify-record-container {
  background: #fafafa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}

.verify-record-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.verify-label {
  min-width: 50px;
  color: #666;
}

/* Add these new styles */
.ant-row .ant-card {
  height: 100%;  /* Make all cards in the row full height */
}

:deep(.ant-card-body) {
  height: calc(100% - 57px);  /* Subtract header height */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.ant-statistic-group) {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

:deep(.ant-card .ant-statistic) {
  text-align: center;
}

/* Sitemap Modal Styles */
.sitemap-modal {
  :deep(.ant-modal-body) {
    padding: 0;
  }
}

.sitemap-modal-content {
  min-height: 600px;
}

.sitemap-container {
  display: flex;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

/* Left Tree Section */
.tree-section {
  width: 40%;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

/* Right Pages Section */
.pages-section {
  width: 60%;
  display: flex;
  flex-direction: column;
}

/* Common Section Header Style */
.section-header {
  padding: 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Content Areas */
.tree-content,
.pages-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Custom Tree Styles */
.custom-tree {
  :deep(.ant-tree-node-content-wrapper) {
    display: flex;
    align-items: center;
  }
}

/* Page List Styles */
.page-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-item {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
  }
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  
  .page-url {
    word-break: break-all;
  }
}

/* Empty State */
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  gap: 16px;
  
  :deep(.anticon) {
    font-size: 32px;
  }
  
  p {
    margin: 0;
  }
}

/* Custom Scrollbar */
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #999;
    }
  }
}

/* 添加或修改以下样式 */
:deep(.ant-typography-secondary) {
  font-size: 12px; /* 调整为你需要的字号 */
}
</style>