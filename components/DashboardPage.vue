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
                class="align-button"
              >
                <DeleteOutlined /> Delete
              </a-button>
              <a-button 
                type="link" 
                @click.stop="getSitemap(true)"
                :disabled="!productInfo || loadingSitemap || !productInfo?.projectWebsite || !productInfo?.domainStatus"
                v-if="productInfo?.productId"
              >
                <template v-if="loadingSitemap">Loading...</template>
                <template v-else-if="!productInfo?.projectWebsite || !productInfo?.domainStatus">
                  Add your site to get sitemap automatically →
                </template>
              </a-button>
              <a-button 
                type="link" 
                @click="editProductInfo"
                :disabled="!productInfo"
                v-if="productInfo?.productId"
                class="align-button"
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
                  <a :href="'https://' + productInfo.projectWebsite" target="_blank">
                    {{ productInfo.projectWebsite }}
                  </a>
                  <template v-if="productInfo.domainStatus">
                    <a-tag color="success">
                      Verified
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
                <div class="competitors-tags">
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
                </div>
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

      <!-- Sitemap and Pages Row -->
      <a-row :gutter="[16, 16]" v-if="productInfo?.productId">
        <!-- Sitemap Panel - 占据 2/3 宽度 -->
        <a-col :span="16">
          <a-card class="sitemap-card">
            <template #title>
              <div class="panel-header">
                <span>🗺️ Website Structure</span>
                <a-space>
                  <a-tag style="font-size: 12px" v-if="allPages?.length" color="blue">
                    {{ allPages.length }} Pages
                  </a-tag>
                  <a-button 
                    type="link" 
                    size="small"
                    :disabled="!productInfo || loadingSitemap || !productInfo?.projectWebsite || !productInfo?.domainStatus"
                    @click="handleRefreshSitemap"
                  >
                    <template v-if="loadingSitemap">Loading...</template>
                    <template v-else-if="!productInfo?.projectWebsite || !productInfo?.domainStatus">
                      Add your site to get sitemap automatically →
                    </template>
                    <template v-else>Refresh Sitemap</template>
                  </a-button>
                </a-space>
              </div>
            </template>

            <!-- Loading skeleton -->
            <template v-if="loadingSitemap">
              <a-skeleton active :paragraph="{ rows: 2 }" />
            </template>

            <!-- Content -->
            <template v-else>
              <template v-if="!productInfo?.projectWebsite || !productInfo?.domainStatus">
                <a-empty 
                  description="Add and verify your site to get sitemap automatically"
                  class="centered-empty-state"
                >
                  <template #extra>
                    <a-button type="primary" @click="openEditWithBasicInfoToVerify">
                      Add Your Site
                    </a-button>
                  </template>
                </a-empty>
              </template>
              <template v-else-if="sitemapData?.length">
                <div class="sitemap-content">
                  <a-tree
                    :tree-data="sitemapData"
                    :default-expanded-keys="['root']"
                    class="sitemap-tree"
                    @select="handleTreeSelect"
                  >
                    <template #title="{ title, key }">
                      <div class="tree-node-title">
                        <span>{{ title }}</span>
                        <a-space>
                          <a-button
                            v-if="!key.includes('folder_')"
                            :href="getVisitUrl(key)"
                            target="_blank"
                            class="visit-link"
                            @click.stop
                            type="link"
                            size="small"
                          >
                            <GlobalOutlined /> Visit
                          </a-button>
                          <a-spin v-if="loadingUrls[key]" size="small" />
                          <template v-if="nodeUrls[key]">
                            <a-button
                              v-for="url in nodeUrls[key]"
                              :key="url"
                              :href="url"
                              target="_blank"
                              type="link"
                              size="small"
                              class="url-link"
                            >
                              <LinkOutlined />
                            </a-button>
                          </template>
                        </a-space>
                      </div>
                    </template>
                  </a-tree>
                </div>
              </template>
              <template v-else>
                <a-empty 
                  description="No pages found" 
                  class="centered-empty-state"
                />
              </template>
            </template>
          </a-card>
        </a-col>

        <!-- Pages Card - 占据 1/3 宽度 -->
        <a-col :span="8">
          <a-card class="pages-card">
            <template #title>
              <span>📄 Pages</span>
            </template>
            <a-row :gutter="[16, 16]">
              <a-col :span="24">
                <a-statistic 
                  title="Generated" 
                  :value="productInfo?.generatedPages || 0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix>
                    <a-tag size="small" color="success" v-if="productInfo?.generatedPagesChange">
                      <span style="font-size: 12px">↑ {{ productInfo.generatedPagesChange }}%</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="24">
                <a-statistic 
                  title="Published" 
                  :value="0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix>
                    <a-tag size="small">
                      <span style="font-size: 12px">Not published</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="24">
                <a-statistic 
                  title="Indexed" 
                  :value="0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix>
                    <a-tag size="small">
                      <span style="font-size: 12px">Not indexed</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>

      <!-- Metrics Cards -->
      <a-row :gutter="[16, 16]" v-if="productInfo?.productId">
        <!-- Traffic 卡片 - 占满一行 -->
        <a-col :span="24">
          <a-card>
            <template #title>
              <span>👥 Traffic </span>
              <a-typography-text type="secondary" v-if="isGscConnected && gscSites.length > 0">
                {{ gscSites[0].siteUrl }}
              </a-typography-text>
            </template>
            <!-- 未连接 GSC 时显示��示 -->
            <div v-if="!isGscConnected" class="not-connected-notice">
              <a-empty>
                <a-button 
                  type="primary" 
                  @click="connectGSC"
                >
                  Connect Google Search Console
                </a-button>
              </a-empty>
            </div>
            <!-- 数据内容 -->
            <a-row v-else :gutter="[16, 8]">
              <a-col :span="8">
                <a-statistic 
                  title="Impressions" 
                  :value="gscAnalytics?.impressions || 0"
                  :precision="0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix>
                    <a-tag size="small" color="success" v-if="gscAnalytics?.impressionsChange">
                      <span style="font-size: 12px">↑ {{ gscAnalytics.impressionsChange }}%</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="8">
                <a-statistic 
                  title="Clicks" 
                  :value="gscAnalytics?.clicks || 0"
                  :precision="0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix>
                    <a-tag size="small" color="success" v-if="gscAnalytics?.clicksChange">
                      <span style="font-size: 12px">↑ {{ gscAnalytics.clicksChange }}%</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
            </a-row>
          </a-card>
        </a-col>

        <!-- 图表卡片 -->
        <a-col :span="24">
          <a-card>
            <template #title>
              <span>📈 Traffic Analytics (Last 15 Days)</span>
            </template>
            <!-- 未连接 GSC 时显示提示 -->
            <div v-if="!isGscConnected" class="traffic-analytics">
              <a-empty class="centered-empty-state">
                <a-button 
                  type="primary" 
                  @click="connectGSC"
                >
                  Connect Google Search Console
                </a-button>
              </a-empty>
            </div>
            <!-- 数据加载完成后显示图表 -->
            <div v-else ref="chartRef" style="height: 500px; width: 100%;"></div>
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
          <!-- 第一行: 添加的竞品标签 -->
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

          <!-- 第二行: 输入框和添加按钮 -->
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
                <template #icon><PlusOutlined /></template>
                Add
              </a-button>
            </a-space>
          </div>
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

  <!-- 添加 GSC 连接成功的 Modal -->
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
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { 
  CopyOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ThunderboltOutlined, 
  FileTextOutlined, 
  LineChartOutlined, 
  NodeIndexOutlined,
  CalendarOutlined, 
  LinkOutlined, 
  SearchOutlined, 
  FolderOpenOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import SuccessModal from './SuccessModal.vue'
import { Modal } from 'ant-design-vue'
import * as echarts from 'echarts' // 需要安装 echarts

export default defineComponent({
  components: {
    CopyOutlined,
    PageLayout,
    EditOutlined,
    DeleteOutlined,
    ThunderboltOutlined,
    FileTextOutlined,
    LineChartOutlined,
    NodeIndexOutlined,
    CalendarOutlined,
    LinkOutlined,
    SearchOutlined,
    FolderOpenOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    PlusOutlined
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
      chart: null, // 添加到 data 中，使其成为响应式数据
      loadingUrls: {}, // 新增: 记录每个节点的加载状态
      nodeUrls: {}, // 新增: 缓存每个节点的URLs
      activeCollapseKeys: ['sitemap'],
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
    const chartRef = ref(null)
    let chart = null
    
    const initChart = () => {
      if (chart) {
        chart.dispose()
      }
      chart = echarts.init(chartRef.value)
    }
    
    onMounted(() => {
      isComponentMounted.value = true
      if (chartRef.value) {
        initChart()
      }
    })

    onUnmounted(() => {
    })

    return {
      showOnboardingModal,
      isComponentMounted,
      pagesTable,
      productModalVisible,
      chartRef
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
          return;
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
          // 如果域名改变强制设置为未验证状态
          domainStatus: this.formState.website !== currentDomain ? false : this.originalDomainStatus
        };

        let response;
        if (this.formState.productId) {
          response = await apiClient.updateProduct(this.formState.productId, formData);
        } else {
          response = await apiClient.createProduct(formData);
        }

        // 如果域名改变，生成新的验证记录
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
          await this.loadProductInfo(); // 重新加载产品信息
        }
      } catch (error) {
        console.error('操作失败:', error);
        this.$notification.error({
          message: this.formState.productId ? '更新失败' : '设置失败',
          description: error.message || '保存产品信息失败。请重试。'
        });
      } finally {
        this.loading = false;
        this.originalDomainStatus = null; // 重置原始状态
      }
    },

    // 新方法：生成新的验证记录
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
        domainStatus: false // 确保重置验证状态 false
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
      
      // 立即重置所有相关状态
      if (newWebsite !== currentDomain) {
        // 立即重置所有验证相关的状态
        this.showVerifyRecord = false;
        this.verifyRecord = null;
        
        // 立即更新 formState
        this.formState = {
          ...this.formState,
          website: newWebsite,
          domainStatus: false
        };
        
        // 立即更新 productInfo
        if (this.productInfo) {
          this.productInfo = {
            ...this.productInfo,
            projectWebsite: newWebsite,
            domainStatus: false
          };
        }
      } else {
        // 如果改回原来的域名，使用保存的原始状态
        this.formState = {
          ...this.formState,
          website: newWebsite,
          domainStatus: this.originalDomainStatus
        };
        
        if (this.productInfo) {
          this.productInfo = {
            ...this.productInfo,
            projectWebsite: newWebsite,
            domainStatus: this.originalDomainStatus
          };
        }
      }
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
    async getSitemap(isRefresh = false) {
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
            this.sitemapData = [{
              key: 'empty',
              title: 'No pages found',
              selectable: false,
              children: []
            }];
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

    processSitemap(sitemapData) {
      if (!Array.isArray(sitemapData)) {
        return [{
          key: 'empty',
          title: 'No pages found',
          selectable: false,
          children: []
        }];
      }

      // 处理新的数据格式
      return sitemapData.map(folder => ({
        key: folder.name,
        title: `${folder.name} (${folder.childNum})`,
        children: folder.urls.map(url => ({
          key: url,
          title: new URL(url).pathname || '/'
        }))
      }));
    },
    async handleTreeSelect(selectedKeys, { node }) {
      if (!selectedKeys.length || !node?.key) return;
      
      // 设置加载状态
      this.loadingUrls[node.key] = true;

      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getSitemapUrls({
          customerId,
          websiteId: node.key, // 使用节点的 key 作为 websiteId
          page: 1,
          limit: 100,
          folder: node.key
        });

        if (response?.code === 200) {
          this.nodeUrls[node.key] = response.data;
        }
      } catch (error) {
        console.error('Failed to get sitemap URLs:', error);
        this.$message.error('Failed to load URLs');
      } finally {
        this.loadingUrls[node.key] = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
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
          await this.loadGscAnalytics()
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
        const currentDomain = this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '');
        const domain = this.formState.website.replace(/^https?:\/\//, '');

        // 如果域名发生变化，先更新产品信息
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
            domainStatus: false // 确保新域名的验证状态为 false
          };

          // 更新产品信息
          const updateResponse = await apiClient.updateProduct(this.formState.productId, formData);
          if (updateResponse?.code !== 200) {
            throw new Error('Failed to update product information');
          }

          // 重新加载产品信息
          await this.loadProductInfo();
        }

        // 获取验证记录
        const response = await apiClient.createDomainWithTXT({
          customerId: localStorage.getItem('currentCustomerId'),
          domainName: domain
        });
        
        if (response?.code === 200) {
          this.verifyRecord = JSON.parse(response.data.txt);
          this.showVerifyRecord = true;
          
          // 确保产��信息中的验证状态为 false
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
        this.$message.error('Failed to start verification: ' + (error.message || 'Unknown error'));
        // 确保在失败时也重置验证状态
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
    },
    async loadGscAnalytics() {
      if (!this.isGscConnected || !this.gscSites.length) {
        return;
      }

      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getGscAnalytics(
          customerId,
          this.gscSites[0].siteUrl
        );
        
        if (response?.code === 200 && response.data) {
          console.log('Raw analytics data:', response.data) // 添加调试日志
          const analyticsData = this.processGscAnalytics(response.data);
          console.log('Processed analytics data:', analyticsData) // 添加调试日志
          this.gscAnalytics = analyticsData;
          
          this.$nextTick(() => {
            this.initChart(); // 改为调用 initChart
          });
        }
      } catch (error) {
        console.error('Failed to load GSC analytics:', error);
      }
    },

    // 添加处理方法
    processGscAnalytics(data) {
      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      // 按日期排序
      data.sort((a, b) => new Date(a.keys[1]) - new Date(b.keys[1]));

      // 提取每日数据
      const dailyData = data.map(item => ({
        date: item.keys[1],
        impressions: item.impressions || 0,
        clicks: item.clicks || 0,
        ctr: item.ctr || 0
      }));

      // 计算总量和环比（保持原逻辑）
      const totals = {
        impressions: 0,
        clicks: 0,
        ctr: 0
      };

      const halfLength = Math.floor(data.length / 2);
      const firstHalf = {
        impressions: 0,
        clicks: 0
      };
      const secondHalf = {
        impressions: 0,
        clicks: 0
      };

      data.forEach((item, index) => {
        totals.impressions += item.impressions || 0;
        totals.clicks += item.clicks || 0;

        if (index < halfLength) {
          firstHalf.impressions += item.impressions || 0;
          firstHalf.clicks += item.clicks || 0;
        } else {
          secondHalf.impressions += item.impressions || 0;
          secondHalf.clicks += item.clicks || 0;
        }
      });

      totals.ctr = totals.clicks > 0 ? 
        ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0;

      const impressionsChange = firstHalf.impressions > 0 ?
        (((secondHalf.impressions - firstHalf.impressions) / firstHalf.impressions) * 100).toFixed(1) : 0;
      
      const clicksChange = firstHalf.clicks > 0 ?
        (((secondHalf.clicks - firstHalf.clicks) / firstHalf.clicks) * 100).toFixed(1) : 0;

      return {
        impressions: totals.impressions,
        clicks: totals.clicks,
        ctr: totals.ctr,
        impressionsChange: impressionsChange > 0 ? impressionsChange : null,
        clicksChange: clicksChange > 0 ? clicksChange : null,
        dailyData // 添加每日数据
      };
    },

    // 添加图表新方法
    updateChart() {
      if (!this.chart || !this.gscAnalytics?.dailyData) {
        console.log('No chart or no data available')
        return
      }

      const data = this.gscAnalytics.dailyData
      const maxValue = Math.max(
        ...data.map(item => item.impressions),
        ...data.map(item => item.clicks)
      )
      const yAxisMax = Math.ceil(maxValue * 1.1)

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.seriesName}: ${params.value}`
          }
        },
        legend: {
          data: ['Impressions', 'Clicks'],
          selected: {
            'Impressions': true,
            'Clicks': true
          },
          top: 10,
          left: 'center',
          icon: 'circle',
          selectedMode: false  // 禁用图例点击交互
        },
        grid: {
          left: 60,
          right: 60,
          bottom: 100,
          top: 50,
          containLabel: true,
          height: 450
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date),
          axisLabel: {
            rotate: 45,
            formatter: function(value) {
              const dayData = data.find(item => item.date === value)
              if (!dayData) return value
              return [
                `${value}`,
                `{ctrStyle|CTR: ${(dayData.ctr * 100).toFixed(1)}%}`
              ].join('\n')
            },
            rich: {
              ctrStyle: {
                color: '#1890ff',     // 改用蓝色
                fontWeight: 'bold',
                fontSize: 12
              }
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Impressions & Clicks',
          min: 0,
          max: yAxisMax,
          axisLine: { show: true },
          axisLabel: { formatter: '{value}' },
          splitLine: {
            show: true,
            lineStyle: { type: 'dashed' }
          }
        },
        series: [
          {
            name: 'Impressions',
            type: 'line',
            data: data.map(item => item.impressions),
            color: '#1890ff',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          },
          {
            name: 'Clicks',
            type: 'line',
            data: data.map(item => item.clicks),
            color: '#52c41a',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          }
        ]
      }

      this.chart.setOption(option, { notMerge: true })
    },

    // 监听口小变化，调整图表大小
    '$window.innerWidth'() {
      if (this.chart) {
        this.chart.resize();
      }
    },

    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      if (this.chartRef) {
        this.chart = echarts.init(this.chartRef)
        this.updateChart() // 始化后立即更新数据
      }
    },

    mounted() {
      this.initChart()
      window.addEventListener('resize', this.handleResize)
    },

    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize)
      if (this.chart) {
        this.chart.dispose()
      }
    },

    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },

    async handleRefreshSitemap(e) {
      // 阻止事件冒泡
      e.stopPropagation();
      
      // 确保 sitemap 面板保持展开状态
      if (!this.activeCollapseKeys.includes('sitemap')) {
        this.activeCollapseKeys = ['sitemap'];
      }
      
      // 执行刷新操作
      await this.getSitemap(true);
    },

    getVisitUrl(key) {
      if (key === 'root') {
        return `https://${this.productInfo?.projectWebsite}`;
      }
      return key;
    },
  }
})
</script>

<style scoped>
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 0 24px;
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

:deep(.ant-statistic-group) {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

:deep(.ant-card .ant-statistic) {
  text-align: center;
}

/* 修改 descriptions 组件的样式，移除所有底部间距 */
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
    font-weight: 500;
    color: #666;
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
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sitemap 面板样式 */
.sitemap-card {
  height: 100%;
  
  :deep(.ant-card-head) {
    background: linear-gradient(to right, #f0f7ff, #f8fafc);
    border-radius: 16px 16px 0 0;
    padding: 24px;
    border-bottom: 2px solid #e6f4ff;
  }
  
  :deep(.ant-card-body) {
    padding: 24px !important;
    height: calc(100% - 76px); /* 减去头部高度 */
    overflow-y: auto;
    
    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f8fafc;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #bfdbfe;
      border-radius: 4px;
      border: 2px solid #f8fafc;
      
      &:hover {
        background: #1890ff;
      }
    }
  }
}

/* 确保行布局正确 */
.ant-row {
  margin: 0 -8px;
  
  .ant-col {
    padding: 0 8px;
  }
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
      transition: transform 0.3s;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}

.tree-node-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.visit-link {
  opacity: 1 !important;
  color: #1890ff;
  
  &:hover {
    color: #40a9ff;
  }
}

.url-link {
  color: #52c41a;
  
  &:hover {
    color: #73d13d;
  }
}

/* 更新树节点样式 */
.sitemap-tree {
  :deep(.ant-tree-node-content-wrapper) {
    width: 100%;
    display: flex;
    align-items: center;
  }
}

/* 添加新的样式 */
.centered-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;  /* 设置最小高度确保有足够空间居中 */
}

/* 确保父容器也支持flex布局 */
.sitemap-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
}
</style>