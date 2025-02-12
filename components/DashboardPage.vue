<template>
  <page-layout
    title="Dashboard"
    description="Manage your product and track your performance"
    icon="📊"
  >
    <!-- Rest of the content -->
    <div class="dashboard-content">
      <a-card class="quick-access-panel">
            <template #title>
              <span class="quick-access-title">
                Once you have set up your product and domain verification, please check the following steps:
              </span>
            </template>
            <div class="quick-links-row">
              <div class="quick-link-item horizontal">
                <div class="quick-link-icon planner">
                  <CalendarOutlined />
                </div>
                <div class="quick-link-content">
                  <div class="quick-link-header">
                    <span class="quick-link-title">
                      1. Use Our Smart SEO Keywords Planner
                    </span>
                  </div>
                  <div class="quick-link-desc">AI-powered keywords pick and outline generation</div>
                  <router-link to="/keywords" class="action-link">
                    Start Planning <RightOutlined />
                  </router-link>
                </div>
              </div>

              <div class="quick-link-item horizontal">
                <div class="quick-link-icon manager">
                  <CheckSquareOutlined />
                </div>
                <div class="quick-link-content">
                  <div class="quick-link-header">
                    <span class="quick-link-title">
                      2. Use Our Content Manager
                    </span>
                  </div>
                  <div class="quick-link-desc">To generate, review & publish content in one place</div>
                  <router-link to="/task-management" class="action-link">
                    Manage Content <RightOutlined />
                  </router-link>
                </div>
              </div>

              <div class="quick-link-item horizontal">
                <div class="quick-link-icon profile">
                  <AppstoreOutlined />
                </div>
                <div class="quick-link-content">
                  <div class="quick-link-header">
                    <span class="quick-link-title">
                      3. Instantly Update Your Product Profile
                    </span>
                  </div>
                  <div class="quick-link-desc">Complete product details from all angles</div>
                  <router-link to="/assets" class="action-link">
                    Complete Profile <RightOutlined />
                  </router-link>
                </div>
              </div>
            </div>
          </a-card>

      <!-- Quick Access Panel and Sitemap Row -->
      <a-row :gutter="[16, 16]" v-if="productInfo?.productId">
        <a-col :span="12">
          <a-card class="product-info-card">
            <template #title>
              <div class="info-card-header">
                <div class="info-card-title">
                  Product Information
                </div>
                <div class="header-actions">
                  <a-button 
                    type="link"
                    @click="editProductInfo"
                    size="small"
                  >
                    Edit
                  </a-button>
                  <a-button 
                    type="link" 
                    @click="deleteProduct"
                    size="small"
                    danger
                  >
                    Delete
                  </a-button>
                </div>
              </div>
            </template>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">
                  <AppstoreOutlined />
                  <span>Product Name</span>
                </div>
                <div class="info-content">
                  {{ productInfo?.productName || 'Not set' }}
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  <GlobalOutlined />
                  Website
                  <a-tag v-if="productInfo?.domainStatus" color="success" class="status-tag">Verified</a-tag>
                  <a-tag v-else color="warning" class="status-tag">Unverified</a-tag>
                </div>
                <div class="info-content">
                  <div class="website-content">
                    <a :href="'https://' + productInfo?.projectWebsite" target="_blank" class="website-link">
                      {{ productInfo?.projectWebsite }}
                      <icon-external-link />
                    </a>
                    <!-- 添加条件渲染的验证按钮 -->
                    <template v-if="!productInfo?.domainStatus">
                      <a-button 
                        type="primary"
                        size="small"
                        @click="openEditWithBasicInfoToVerify"
                        :loading="goStartVerifying"
                      >
                        Go Verify
                      </a-button>
                    </template>
                    <template v-else>
                      <a-button 
                        type="primary"
                        size="small"
                        @click="showGscData"
                      >
                        View Traffic Data
                      </a-button>
                    </template>
                  </div>
                </div>
              </div>

              <div class="info-item compact">
                <div class="info-label">
                  <FileTextOutlined />
                  Pages Overview
                </div>
                <div class="info-content">
                  <div class="pages-stats-horizontal">
                    <div class="stat-item">
                      <span class="stat-label">Generated</span>
                      <span class="stat-value">{{ pagesDashboard?.generatorCount || 0 }}</span>
                    </div>
                    <a-divider type="vertical" />
                    <div class="stat-item">
                      <span class="stat-label">Published</span>
                      <span class="stat-value">{{ pagesDashboard?.publishCount || 0 }}</span>
                    </div>
                    <a-divider type="vertical" />
                    <div class="stat-item">
                      <span class="stat-label">Indexed</span>
                      <span class="stat-value">{{ pagesDashboard?.indexedCount || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  <NodeIndexOutlined />
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
                          <RightOutlined />
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
          </a-card>
        </a-col>

        <a-col :span="12">
          <!-- Website Structure -->
          <a-card class="sitemap-card">
            <template #title>
              <div class="card-title">
                <span>Website Structure (Sitemap)</span>
                <a-space>
                  <a-button 
                    type="link" 
                    size="small"
                    @click="handleRefreshSitemap"
                    :loading="loadingSitemap"
                  >
                    Refresh
                  </a-button>
                  <!-- 添加 Disconnect 按钮 -->
                  <a-button
                    type="link"
                    size="small"
                    danger
                    @click="disconnectGSC"
                    v-if="isGscConnected"
                  >
                    Disconnect Google Search Console
                  </a-button>
                </a-space>
              </div>
            </template>

            <!-- Loading skeleton -->
            <template v-if="loadingSitemap || checkingGscStatus">
              <a-skeleton active :paragraph="{ rows: 2 }" />
            </template>

            <!-- Content -->
            <template v-else>
              <!-- 第一步：检查网站是否添加和验证 -->
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
              <!-- 第二步：检查 GSC 是否连接 -->
              <template v-else-if="!isGscConnected">
                <a-empty 
                  description="Connect Google Search Console to manage sitemap and analytics"
                  class="centered-empty-state"
                >
                  <a-button type="primary" @click="connectGSC">
                    Connect Google Search Console
                  </a-button>
                </a-empty>
              </template>
              <!-- 第三步：显示 sitemap 数据 -->
              <template v-else-if="sitemapData?.length">
                <div class="sitemap-content">
                  <a-tree
                    :tree-data="sitemapData"
                    :default-expanded-keys="expandedKeys"
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
              <!-- 最后：如果都满足条件但没有数据 -->
              <template v-else>
                <a-empty 
                  description="No pages found" 
                  class="centered-empty-state"
                />
              </template>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Add onboarding modal -->
    <a-modal
      v-model:open="onboardingModalVisible"
      :maskClosable="false"
      :closable="!!formState.productId"
      :width="1000"
      :footer="null"
      :class="['product-modal']"
    >
      <template #title>
        <div class="modal-title">
          <template v-if="!formState.productId">
            <div class="welcome-title">
              <span class="beta-tag">BETA</span>
              <span class="title-text">Welcome to WebsiteLM!</span>
            </div>
          </template>
          <template v-else>
            <span>✏️ Edit Product Information</span>
          </template>
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
          <a-input-group compact>
            <span 
              style="
                display: inline-flex;
                align-items: center;
                padding: 0 11px;
                width: 90px;
                height: 32px;
                color: rgba(0, 0, 0, 0.88);
                background-color: rgb(245, 245, 245);
                border: 1px solid #d9d9d9;
                border-right: none;
                border-radius: 6px 0 0 6px;
              "
            >
              https://
            </span>
            <a-input 
              v-model:value="formState.website" 
              style="width: calc(100% - 90px); border-radius: 0 6px 6px 0;"
              placeholder="example.com"
              @change="handleWebsiteChange"
              :disabled="verifying"
            />
          </a-input-group>
          <template v-if="formState.productId">
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
            <template v-else-if="productInfo.domainStatus && formState.website === productInfo.projectWebsite?.replace('https://', '')">
              <a-tag color="success" class="mt-3">
              Domain Verified
              </a-tag>
            </template>
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

    <a-modal
      v-model:visible="successModalVisible"
      title="Welcome to WebsiteLM!"
      :footer="null"
      :maskClosable="false"
    >
      <div class="success-content">
        <div class="success-icon">🎉</div>
        <p>Your product has been set up successfully. Here are the next steps:</p>
        
        <div class="todo-list">
          <div class="todo-item">
            <div class="todo-info">
              <span class="todo-title">1. Verify Your Domain</span>
              <span class="todo-desc">Enable automatic sitemap and content fetching</span>
            </div>
            <a-button type="primary" @click="handleVerifyDomain">
              Start Verify
            </a-button>
          </div>

          <div class="todo-item">
            <div class="todo-info">
              <span class="todo-title">2. Connect Google Search Console</span>
              <span class="todo-desc">Track your website performance</span>
            </div>
            <a-button type="primary" @click="connectGSC">
              Connect Now
            </a-button>
          </div>

          <div class="todo-item">
            <div class="todo-info">
              <span class="todo-title">3. Explore Features</span>
              <span class="todo-desc">Learn about all available features</span>
            </div>
            <a-button type="primary" @click="handleExploreTour">
              Start Tour
            </a-button>
          </div>
        </div>

        <div class="skip-action">
          <a-button @click="handleSuccessModalClose">Skip for now</a-button>
        </div>
      </div>
    </a-modal>

    <transition name="panel">
      <div class="setup-progress-panel" v-if="shouldShowSetupPanel && isPanelReady">
        <div class="panel-header">
          <div class="panel-title">
            <CheckCircleOutlined v-if="allStepsCompleted" />
            <ClockCircleOutlined v-else />
            Setup Progress
          </div>
          <div class="progress-status">
            {{ completedSteps }}/3
          </div>
        </div>
        
        <div class="progress-steps">
          <!-- Domain Verification -->
          <div 
            class="progress-step"
            :class="{ 'completed': productInfo?.domainStatus }"
          >
            <div 
              class="step-icon"
              :class="productInfo?.domainStatus ? 'completed' : 'pending'"
            >
              <GlobalOutlined />
            </div>
            <div class="step-content">
              <div class="step-title">Verify Domain</div>
              <div class="step-desc">Enable automatic sitemap</div>
            </div>
            <div class="step-action">
              <template v-if="!productInfo?.domainStatus">
                <a-button 
                  type="link" 
                  size="small"
                  @click="openEditWithBasicInfoToVerify"
                  :loading="goStartVerifying"
                >
                  Start
                </a-button>
              </template>
              <template v-else>
                <CheckCircleOutlined style="color: #52c41a" />
              </template>
            </div>
          </div>

          <!-- GSC Connection -->
          <div 
            class="progress-step"
            :class="{ 'completed': isGscConnected }"
          >
            <div 
              class="step-icon"
              :class="isGscConnected ? 'completed' : 'pending'"
            >
              <GoogleOutlined />
            </div>
            <div class="step-content">
              <div class="step-title">Connect GSC</div>
              <div class="step-desc">Track performance</div>
            </div>
            <div class="step-action">
              <a-button 
                type="link" 
                size="small"
                @click="connectGSC"
                v-if="!isGscConnected"
              >
                Connect
              </a-button>
              <CheckCircleOutlined v-else style="color: #52c41a" />
            </div>
          </div>

          <!-- Feature Tour -->
          <div 
            class="progress-step"
            :class="{ 'completed': productInfo?.onboarding }"  
          >
            <div 
              class="step-icon"
              :class="productInfo?.onboarding ? 'completed' : 'pending'"
            >
              <CompassOutlined />
            </div>
            <div class="step-content">
              <div class="step-title">Take a Tour</div>
              <div class="step-desc">Learn key features</div>
            </div>
            <div class="step-action">
              <a-button 
                type="link" 
                size="small"
                @click="handleExploreTour"
                v-if="!productInfo?.onboarding"
              >
                Start
              </a-button>
              <CheckCircleOutlined v-else style="color: #52c41a" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 添加 GSC 数据弹窗 -->
    <a-modal
      v-model:visible="gscDataModalVisible"
      title="Google Search Console Data"
      :footer="null"
      width="600px"
    >
      <div v-if="loadingGscData" class="centered-empty-state">
        <a-spin />
      </div>
      <div v-else-if="gscData && gscData.length" class="gsc-data-container">
        <a-table 
          :dataSource="gscData" 
          :columns="columns"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'date'">
              {{ formatDate(record.keys[1]) }}
            </template>
            <template v-else-if="column.dataIndex === 'ctr'">
              {{ (record.ctr * 100).toFixed(2) }}%
            </template>
          </template>
        </a-table>
      </div>
      <div v-else class="centered-empty-state">
        No data available
      </div>
    </a-modal>
  </page-layout>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
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
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { Modal, message } from 'ant-design-vue'
import * as echarts from 'echarts'

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
  },
  data() {
    return {
      productInfo: null,
      onboardingModalVisible: false,
      loading: false,
      websitePrefix: 'https://',
      formState: {
        productId: undefined,
        productName: '',
        website: '',
        coreFeatures: '',
        competitors: []
      },
      successModalVisible: false,
      newCompetitor: {
        name: '',
        url: ''
      },
      sitemapData: [],
      loadingSitemap: false,
      publishedPages: 0,
      isGscConnected: false,
      gscSites: [],
      gscSuccessModalVisible: false,
      gscCheckInterval: null,
      showVerifyRecord: false,
      verifyRecord: '',
      verifying: false,
      startVerifying: false,
      goStartVerifying: false,
      originalDomainStatus: null, // 新增：保存原始域名验证状态
      chart: null, // 添加到 data 中，使其成为响应式数据
      loadingUrls: {}, // 新增: 记录每个节点的加载状态
      nodeUrls: {}, // 新增: 缓存每个节点的URLs
      activeCollapseKeys: [], // 默认全部折叠
      sitemapModal: {
        visible: false,
        publishedUrls: []
      },
      submitLoading: false,
      publishedUrls: [],
      pagesDashboard: null,
      isDomainVerified: false,
      expandedKeys: [], // 添加新的数据属性
      hasTourCompleted: false, // 添加新的数据属性
      originalWebsite: '', // 新增：保存原始域名
      gscDataModalVisible: false,
      gscData: null,
      loadingGscData: false,
      columns: [
        {
          title: 'Date',
          dataIndex: 'date',
          width: '100px',
        },
        {
          title: 'Clicks',
          dataIndex: 'clicks',
          width: '80px',
        },
        {
          title: 'Impressions',
          dataIndex: 'impressions',
          width: '100px',
        },
        {
          title: 'CTR',
          dataIndex: 'ctr',
          width: '80px',
        },
        {
          title: 'Position',
          dataIndex: 'position',
          width: '80px',
        },
      ],
      checkingGscStatus: false, // 添加新的状态
      isPanelReady: false, // 添加新的状态控制面板是否准备好显示
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

    editProductInfo() {
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
      this.onboardingModalVisible = true;
    },
    
    async loadProductInfo() {
      console.log('loadProductInfo called from:', new Error().stack);
      try {
        const response = await apiClient.getProductsByCustomerId()
        
        if (response?.code === 200) {
          this.productInfo = response.data
          if (!response.data) {
            // 只保留新用户设置产品的逻辑
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
            // 加载所有必要数据
            await Promise.all([
              this.checkGscStatus(),
              this.loadPagesDashboard()
            ]);

            if (this.productInfo.domainStatus) {
              await this.getSitemap();
              
              if (this.isGscConnected) {
                await this.loadGscData();
              }
            }

            // 所有数据加载完成后，再设置面板就绪状态
            this.$nextTick(() => {
              this.isPanelReady = true;
            });
          }
        }
      } catch (error) {
        console.error('Failed to load product information:', error);
        this.$notification.error({
          message: 'Failed to Load Product',
          description: 'An error occurred while loading product information. Please try again later.'
        });
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
      if (this.formState.productId) {
        await this.handleProductEdit();
      } else {
        await this.handleOnboarding();
      }
    },

    // 处理新用户 onboarding
    async handleOnboarding() {
      this.loading = true;
      try {
        const formData = this.prepareFormData();
        const response = await apiClient.createProduct(formData);
        
        if (response?.code === 200) {
          console.log('API 调用成功，准备显示 modal');
          this.onboardingModalVisible = false;
          await this.$nextTick();
          
          // 延迟显示 success modal
          setTimeout(() => {
            this.successModalVisible = true;
            console.log('设置 successModalVisible:', this.successModalVisible);
          }, 100);
          
          this.resetFormState();
          await this.loadProductInfo();
        }
      } catch (error) {
        console.error('Error during onboarding:', error);
        this.$notification.error({
          message: 'Onboarding Failed',
          description: error.message || 'Failed to create product'
        });
      } finally {
        this.loading = false;
      }
    },

    // 处理产品编辑
    async handleProductEdit() {
      this.loading = true;
      try {
        // 使用保存的原始域名进行对比
        const isWebsiteChanged = this.formState.website !== this.originalWebsite;
        
        console.log('Domain comparison:', {
          formStateWebsite: this.formState.website,
          originalWebsite: this.originalWebsite,
          isWebsiteChanged,
          comparison: `'${this.formState.website}' !== '${this.originalWebsite}'`
        });
        
        if (isWebsiteChanged) {
          // 添加初始状态日志
          console.log('Domain change detected, preparing to reset verification');
          // 先调用 startVerify 接口重置域名
          const domain = this.formState.website.replace(/^https?:\/\//, '');
          console.log('Domain to verify:', domain);
          
          const verifyResponse = await apiClient.createDomainWithTXT({
            customerId: localStorage.getItem('currentCustomerId'),
            domainName: domain
          });
          
          if (verifyResponse?.code !== 200) {
            throw new Error('Failed to initialize domain verification');
          }
          
          // 更新验证记录状态
          this.verifyRecord = JSON.parse(verifyResponse.data.txt);
          this.showVerifyRecord = true;
        }

        // 准备表单数据，确保域名变更时重置验证状态
        const formData = {
          ...this.prepareFormData(),
          domainStatus: isWebsiteChanged ? false : this.formState.domainStatus
        };

        const response = await apiClient.updateProduct(this.formState.productId, formData);
        
        if (response?.code === 200) {
          // 如果域名已变更，显示验证提示
          if (isWebsiteChanged) {
            this.$notification.info({
              message: 'Domain Verification Required',
              description: 'Please verify your new domain to enable all features.',
              duration: 0
            });
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

    // 重置表单状态的方法
    resetFormState() {
      this.formState = {
        productId: undefined,
        productName: '',
        website: '',
        coreFeatures: '',
        competitors: [],
        domainStatus: false
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
      console.log('关闭 success modal');
      this.successModalVisible = false;
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
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
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
            domainStatus: false // 确保新域名的验证状态为 false
          };

          const updateResponse = await apiClient.updateProduct(this.formState.productId, formData);
          if (updateResponse?.code !== 200) {
            throw new Error('Failed to update product information');
          }

          // 重新加载产品信息
          await this.loadProductInfo();
        }

        const response = await apiClient.createDomainWithTXT({
          customerId: localStorage.getItem('currentCustomerId'),
          domainName: domain
        });
        
        if (response?.code === 200) {
          this.verifyRecord = JSON.parse(response.data.txt);
          this.showVerifyRecord = true;
          
          // 确保产品信息中的验证状态为 false
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
    watch: {
      onboardingModalVisible(newVal) {
        if (newVal) {
          // Reset to first step whenever modal is opened
          this.currentStep = 0;
        }
      },
      successModalVisible: {
        handler(newVal) {
          console.log('successModalVisible 变化:', newVal);
        },
        immediate: true
      },
      // 添加对 productInfo 的监听
      'productInfo.onboarding': {
        immediate: true,
        handler(newVal) {
          if (this.productInfo) {
            this.hasTourCompleted = !!newVal;
            
            // 这里的逻辑可能有问题，让我们移除它
            // if (!newVal && this.productInfo.productId) {
            //   this.$nextTick(() => {
            //     this.openGuideModeDialog();
            //   });
            // }
          }
        }
      },
      // 监听影响面板显示的关键状态变化
      'productInfo.domainStatus'() {
        this.handleStateChange();
      },
      isGscConnected() {
        this.handleStateChange();
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

    async loadPagesDashboard() {
      try {
        const response = await apiClient.getPagesDashboard();
        if (response?.code === 200) {
          this.pagesDashboard = response.data;
        }
      } catch (error) {
        console.error('Failed to load pages dashboard:', error);
      }
    },

    openPreview(url) {
      if (typeof window !== 'undefined') {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(fullUrl, '_blank');
      }
    },
    
    // 处理验证域名
    handleVerifyDomain() {
      console.log('验证域名');
      this.successModalVisible = false;
    },
    
    // 处理功能导览
    handleExploreTour() {
      this.successModalVisible = false;
      this.openGuideModeDialog();
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

    async showGscData() {
      this.gscDataModalVisible = true;
      this.loadingGscData = true;
      
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const currentDomain = this.productInfo.projectWebsite;
        
        // 从 gscSites 中查找匹配的域名
        const matchedSite = this.gscSites.find(site => {
          const googleDomain = site.siteUrl.replace('sc-domain:', '');
          return googleDomain === currentDomain;
        });
        
        if (!matchedSite) {
          this.$message.warning('This domain is not added to Google Search Console yet');
          this.loadingGscData = false;
          return;
        }
        
        // 使用 Google 格式的域名请求数据
        const response = await apiClient.getGscAnalytics(
          customerId,
          matchedSite.siteUrl  // 使用完整的 Google 格式域名
        );
        
        if (response?.code === 200) {
          this.gscData = response.data;
        }
      } catch (error) {
        console.error('Failed to load GSC data:', error);
        this.$message.error('Failed to load GSC data');
      } finally {
        this.loadingGscData = false;
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
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.sitemap-card {
  height: 100%;
  max-height: 600px; /* 设置最大高度 */
  
  :deep(.ant-card-body) {
    height: calc(100% - 57px); /* 减去卡片头部高度 */
    padding: 0 !important; /* 移除默认内边距 */
    display: flex;
    flex-direction: column;
  }
}

/* 添加树容器样式 */
.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  
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
      transition: background-color 0.3s; /* 只保留背景色过渡效果 */
      
      &:hover {
        transform: none; /* 移除位移效果 */
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
  :deep(.ant-tree) {
    /* 设置合适的行高，避免节点太密集 */
    .ant-tree-treenode {
      padding: 4px 0;
    }
    
    /* 优化展开/折叠图标的可点击区域 */
    .ant-tree-switcher {
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    
    /* 优化节点内容的样式 */
    .ant-tree-node-content-wrapper {
      min-height: 24px;
      line-height: 24px;
      padding: 0 8px;
    }
  }
}

/* 添加新的样式 */
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

/* 添加到现有样式中 */
.sitemap-preview {
  .preview-header {
    margin-bottom: 16px;
  }

  .url-count {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .url-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .url-text {
    flex: 1;
    margin-right: 16px;
    word-break: break-all;
  }
}

:deep(.url-list) {
  max-height: 400px;
  overflow-y: auto;
}

/* 添加一些辅助说明文字的样式 */
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
    margin-bottom: 16px;
    
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
  right: 24px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12),
              0 0 0 1px rgba(24, 144, 255, 0.1),
              0 0 20px rgba(24, 144, 255, 0.2); /* 添加蓝色发光效果 */
  padding: 16px;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: pulse 2s infinite; /* 添加脉冲动画 */
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(24, 144, 255, 0.2),
                0 0 30px rgba(24, 144, 255, 0.3); /* 悬停时加强发光效果 */
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

/* Quick Access Panel Styles */
.quick-access-panel {
  border-radius: 12px;
  background: linear-gradient(145deg, #f6f9fe, #edf3fc); 
  border: 1px solid rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(24, 144, 255, 0.08);
    border-color: rgba(24, 144, 255, 0.2);
  }

  :deep(.ant-card-head) {
    padding: 16px 20px;
    background: linear-gradient(135deg, #1677ff, #4096ff);
    border-radius: 12px 12px 0 0;
    border: none;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
      animation: rotateGradient 8s linear infinite;
    }
    
    .ant-card-head-title {
      color: white;
      font-size: 16px;
      padding: 4px 0;
    }
  }

  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.quick-links-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 4px;
}

.quick-link-item.horizontal {
  background: white;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(24, 144, 255, 0.08);
  
  /* 添加重点突出的背景效果 */
  background: linear-gradient(
    145deg,
    white,
    rgba(24, 144, 255, 0.02)
  );
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(24, 144, 255, 0.2);
    background: linear-gradient(
      145deg,
      white,
      rgba(24, 144, 255, 0.05)
    );
    
    .quick-link-icon {
      transform: scale(1.05);
    }
  }
  
  /* 优化装饰性背景 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(24,144,255,0.03) 0%, transparent 70%);
    transform: translate(30%, -30%);
  }
}

.quick-link-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  
  &.planner {
    background: linear-gradient(135deg, #f6ffed, #d9f7be);
    color: #389e0d;
  }
  
  &.manager {
    background: linear-gradient(135deg, #e6f7ff, #bae7ff);
    color: #096dd9;
  }
  
  &.profile {
    background: linear-gradient(135deg, #f9f0ff, #efdbff);
    color: #531dab;
  }
}

.quick-link-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
}

.quick-link-desc {
  color: #666;
  font-size: 13px;
  line-height: 1.5;
}

.action-link {
  margin-top: 12px;
  color: #1890ff;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    gap: 6px;
    
    .anticon {
      transform: translateX(2px);
    }
  }
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
  max-height: 600px;
  
  :deep(.ant-card-body) {
    height: calc(100% - 57px);
    padding: 16px;
    overflow-y: auto;
  }
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  
  :deep(.anticon) {
    color: #1890ff;
  }
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

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  width: 100%;
}

.info-item.full-width {
  width: 100%;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1f2937;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  
  :deep(.anticon) {
    color: #1890ff;
    font-size: 16px;
    opacity: 0.9;
  }
}

.info-content {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

.website-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.website-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1890ff;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(24, 144, 255, 0.06);
  transition: all 0.3s;
  
  &:hover {
    background: rgba(24, 144, 255, 0.1);
    text-decoration: none;
    transform: translateX(2px);
    
    .anticon {
      transform: translateX(2px);
    }
  }
  
  .anticon {
    font-size: 14px;
    transition: transform 0.3s;
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
  max-height: 80px;
  overflow-y: auto;
  padding-right: 8px;
  
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
  gap: 8px;
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

.pages-stats-horizontal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-label {
  color: #8c8c8c;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

:deep(.ant-divider-vertical) {
  height: 32px;
  margin: 0 16px;
}

.competitors-content {
  display: flex;
  align-items: center;
  min-height: 40px; /* 确保有最小高度以便垂直居中 */
}

.competitors-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  padding: 4px 0;
}

.competitor-tag {
  margin: 0 !important;
  height: 32px !important; /* 增加标签高度 */
  line-height: 30px !important; /* 调整行高以配合新高度 */
  padding: 0 12px !important; /* 增加水平内边距 */
  border-radius: 6px !important; /* 稍微增加圆角 */
  background: #f5f5f5 !important;
  border: 1px solid #e8e8e8 !important;
  
  &:hover {
    background: #f0f0f0 !important;
    border-color: #d9d9d9 !important;
  }
}

.competitor-link {
  color: #595959;
  font-size: 14px; /* 增加字体大小 */
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: #1890ff;
  }
  
  .anticon {
    font-size: 12px;
  }
}

.no-competitors {
  color: #8c8c8c;
  font-size: 14px;
}

.competitors-stats-horizontal {
  display: flex;
  align-items: center; /* 垂直居中 */
  flex-wrap: wrap;
  gap: 12px; /* 统一的间距 */
  min-height: 48px; /* 与 Pages Overview 保持一致的高度 */
  padding: 8px 0;
}

.competitor-tag {
  margin: 0 !important;
  height: 32px !important;
  line-height: 30px !important;
  padding: 0 16px !important;
  border-radius: 6px !important;
  background: #f5f5f5 !important;
  border: 1px solid #e8e8e8 !important;
  
  &:hover {
    background: #f0f0f0 !important;
    border-color: #d9d9d9 !important;
  }
}

.competitor-link {
  color: #595959;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: #1890ff;
  }
  
  .anticon {
    font-size: 12px;
  }
}

.no-competitors {
  color: #8c8c8c;
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 32px; /* 与标签高度保持一致 */
}

.record-value-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.host-divider {
  position: relative;
  text-align: center;
  margin: 8px 0;
}

.divider-text {
  background: white;
  padding: 0 12px;
  color: #999;
  font-size: 12px;
  position: relative;
  z-index: 1;
}

.host-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #f0f0f0;
  z-index: 0;
}

.record-note {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-top: -4px;
}

.record-value {
  font-family: monospace;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.verify-record-help ul {
  margin: 0;
  padding-left: 16px;
}

.verify-record-help li {
  margin: 4px 0;
}

.verify-record-cell {
  padding: 12px;
}

.verify-record-row {
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.record-value-container.horizontal {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.host-option {
  flex: 1;
}

.website-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gsc-data-container {
  padding: 8px;
}

.sitemap-content {
  overflow-y: auto;
  height: 500px;
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
</style>