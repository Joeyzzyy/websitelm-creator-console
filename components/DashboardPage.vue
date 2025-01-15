<template>
  <page-layout
    title="Dashboard"
    description="Manage your product and track your performance"
    icon="📊"
  >
   
    <!-- Product info and statistics banner -->
    <div class="dashboard-content">
        <!-- 添加测试按钮 -->
      <!-- Product Info Card -->
      <a-card class="info-card">
        <template #title>
          <div class="card-title">
            <span>🎯 Product Information</span>
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
              <div class="card-title">
                <span>🗺️ Website Structure</span>
                <a-space>
                  <a-button 
                    type="link" 
                    size="small"
                    @click="handleRefreshSitemap"
                    :loading="loadingSitemap"
                  >
                    Refresh
                  </a-button>
                  <a-button
                    type="link"
                    size="small"
                    @click="collectPublishedUrls"
                    :disabled="!productInfo?.productId"
                  >
                    Submit Sitemap
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
                  :value="pagesDashboard?.generatorCount || 0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix>
                    <a-tag size="small" color="success" v-if="pagesDashboard?.generatedChange">
                      <span style="font-size: 12px">↑ {{ pagesDashboard.generatedChange }}%</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="24">
                <a-statistic 
                  title="Published" 
                  :value="pagesDashboard?.publishCount || 0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix v-if="pagesDashboard?.publishCount === 0">
                    <a-tag size="small">
                      <span style="font-size: 12px">Not published</span>
                    </a-tag>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="24">
                <a-statistic 
                  title="Indexed Pages Published By WebsiteLM" 
                  :value="pagesDashboard?.indexedCount || 0"
                  :value-style="{ fontSize: '16px' }"
                  :title-style="{ fontSize: '12px' }"
                >
                  <template #suffix v-if="pagesDashboard?.indexedCount === 0">
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
              <div class="card-title">
                <span>📈 Traffic Analytics</span>
                <a-select 
                  v-model:value="selectedSiteUrl" 
                  style="width: 200px"
                  @change="handleSiteChange"
                >
                  <a-select-option 
                    v-for="site in gscSites" 
                    :key="site.siteUrl" 
                    :value="site.siteUrl"
                  >
                    {{ site.siteUrl }}
                  </a-select-option>
                </a-select>
              </div>
            </template>
            <!-- 未连接 GSC 时显示提示 -->
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
                  :value="gscAnalytics?.impressions ?? 'No data'"
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
                  :value="gscAnalytics?.clicks ?? 'No data'"
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
            <!-- 添加无数据状态 -->
            <div v-else-if="!gscAnalytics?.dailyData?.length" class="traffic-analytics">
              <a-empty 
                description="No data available" 
                class="centered-empty-state"
              />
            </div>
            <!-- 数据加载完成后显示图表 -->
            <div v-else ref="chartRef" style="height: 500px; width: 100%;"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>

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
        @finish="handleOnboardingFinish"
        ref="formRef"
      >
        <!-- 基本信息 -->
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
          <p class="help-text">This name will be used throughout your content generation.</p>
        </a-form-item>

        <!-- 网站信息和域名验证 -->
        <a-form-item 
          label="Official Website" 
          name="website"
        >
          <p class="step-description">Enter your product's website URL to help us better understand and promote your product.</p>
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
          <p class="help-text">Make sure to enter the main domain of your product (e.g. example.com).</p>

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
                    <div class="verify-record-title">
                      <InfoCircleOutlined /> Please add the following TXT record to your DNS settings:
                    </div>
                    <div class="verify-record-table">
                      <div class="verify-record-row">
                        <div class="verify-record-cell">
                          <span class="verify-label">Type:</span>
                          <a-typography-text>TXT</a-typography-text>
                        </div>
                      </div>
                      <div class="verify-record-row">
                        <div class="verify-record-cell">
                          <span class="verify-label">Host:</span>
                          <a-typography-text code copyable class="record-value">
                            {{ verifyRecord?.host || '_' }}
                          </a-typography-text>
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
                      <ul>
                        <li>DNS changes may take up to several minutes to propagate</li>
                        <li>Make sure to copy the exact value without any modifications</li>
                      </ul>
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
          <p class="step-description">Add up to 4 main competitors to help us understand your market positioning.</p>
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

    <!-- 添加 Sitemap Modal -->
    <a-modal
      v-model:visible="sitemapModal.visible"
      title="Submit URLs to Google Search Console"
      width="800px"
      @ok="handleSubmitUrls"
      @cancel="closeSitemapModal"
      :confirmLoading="submitLoading"
      :okText="'Submit to Google'"
      :cancelText="'Cancel'"
    >
      <div class="sitemap-preview">
        <div class="preview-header">
          <a-alert
            message="Below are all published page URLs. Confirm to submit to Google Search Console"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <div class="url-count">
            Found {{ publishedUrls.length }} published pages
          </div>
        </div>
        
        <a-list
          :data-source="publishedUrls"
          :bordered="true"
          size="small"
          class="url-list"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <div class="url-item">
                <span class="url-text">{{ item }}</span>
                <a-button 
                  type="link" 
                  size="small"
                  @click="openPreview(item)"
                >
                  View
                </a-button>
              </div>
            </a-list-item>
          </template>
        </a-list>
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
            <a-button type="primary" @click="handleConnectGSC">
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

    <!-- 在 template 最后添加，body 级别 -->
    <transition name="panel">
      <div class="setup-progress-panel" v-if="!allStepsCompleted">
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
                @click="handleConnectGSC"
                :disabled="!isDomainVerified"
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
                :disabled="!isGscConnected"
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
  </page-layout>
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
  CheckCircleOutlined,
  ClockCircleOutlined,
  GoogleOutlined,
  CompassOutlined,
  ReloadOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { Modal, message } from 'ant-design-vue'
import * as echarts from 'echarts' // 需要安装 echarts
import { CheckCircleFilled } from '@ant-design/icons-vue'

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
    PlusOutlined,
    ClockCircleOutlined,
    GoogleOutlined,
    CompassOutlined,
    ReloadOutlined,
    QuestionCircleOutlined
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
      selectedSiteUrl: '', // 当前选中的站点URL
      sitemapModal: {
        visible: false,
        publishedUrls: []
      },
      submitLoading: false,
      publishedUrls: [],
      pagesDashboard: null,
      isDomainVerified: false,
      hasTourCompleted: false // 修改初始值
    }
  },
  created() {
    this.loadProductInfo()
    this.handleGscCallback()
    this.checkGscStatus()
    this.startGscStatusCheck()
    
    // 从 localStorage 或其他存储中获取功能导览状态
    // this.hasTourCompleted = localStorage.getItem('tourCompleted') === 'true';
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
    },
    completedSteps() {
      let completed = 0;
      
      // 检查域名验证状态
      if (this.productInfo?.domainStatus) {
        completed++;
      }
      
      // 检查 GSC 连接状态
      if (this.isGscConnected) {
        completed++;
      }
      
      // 检查功能导览完成状态 - 修改这里
      if (this.productInfo?.onboarding) {  // 改用 productInfo.onboarding 替代 hasTourCompleted
        completed++;
      }
      
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
              this.loadPagesDashboard() // 替换原来的 loadPublishedPagesCount
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
      this.loading = true;
      try {
        console.log('开始处理 onboarding');
        console.log('Form State:', this.formState);
        
        const formData = {
          customerId: localStorage.getItem('currentCustomerId'),
          productName: this.formState.productName,
          productDesc: this.formState.coreFeatures,
          competeProduct: this.formState.competitors.map(comp => 
            `${comp.name}|${comp.url}`
          ).join(','),
          website: this.formState.website || '',
          sitemap: '',
          domainStatus: this.formState.website !== (this.productInfo?.projectWebsite?.replace(/^https?:\/\//, '') || '') 
            ? false 
            : this.originalDomainStatus
        };

        let response;
        if (this.formState.productId) {
          console.log('Updating existing product');
          response = await apiClient.updateProduct(this.formState.productId, formData);
        } else {
          console.log('Creating new product');
          response = await apiClient.createProduct(formData);
        }

        console.log('API Response:', response); // 检查API响应

        if (response?.code === 200) {
          if (!this.formState.productId) {
            console.log('API 调用成功，准备显示 modal');
            // 先重置其他状态
            this.onboardingModalVisible = false;
            await this.$nextTick();
            
            // 延迟显示 success modal
            setTimeout(() => {
              this.successModalVisible = true;
              console.log('设置 successModalVisible:', this.successModalVisible);
            }, 100);

            this.resetFormState();
          } else {
            console.log('Updating existing product success');
            this.$notification.success({
              message: 'Product Updated',
              description: 'Product information has been updated successfully.'
            });
          }
          
          this.onboardingModalVisible = false;
          await this.loadProductInfo();
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
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

      return sitemapData.map(folder => {
        // 处理 URLs，确保它们都是有效的 URL
        const processedUrls = folder.urls.map(url => {
          try {
            // 如果 URL 不包含协议，添加 https://
            const fullUrl = url.startsWith('http') ? url : `https://${url}`;
            const urlObj = new URL(fullUrl);
            return {
              key: url, // 保持原始 URL 作为 key
              title: urlObj.pathname || '/',
              fullUrl: fullUrl // 添加完整 URL 用于访问
            };
          } catch (e) {
            console.warn('Invalid URL:', url);
            return {
              key: url,
              title: url,
              fullUrl: url
            };
          }
        });

        return {
          key: `folder_${folder.websiteId}`, // 使用 websiteId 作为文件夹的唯一标识
          title: `${folder.name} (${folder.childNum})`,
          children: processedUrls
        };
      });
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
          console.log('GSC Sites loaded:', this.gscSites) // 添加日志
          
          // 如果有站点数据，自动选择第一个
          if (this.gscSites.length > 0) {
            this.selectedSiteUrl = this.gscSites[0].siteUrl
            await this.loadGscAnalytics()
          }
        }
      } catch (error) {
        console.error('Failed to load GSC data:', error)
      }
    },

    async checkGscStatus() {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.checkGscAuth(customerId)
        
        console.log('GSC Status:', response) // 添加日志
        
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
          this.hasTourCompleted = !!newVal; // 将 onboarding 状态同步到 hasTourCompleted
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
        // 使用选中的 siteUrl
        const siteUrl = this.selectedSiteUrl;
        
        const response = await apiClient.getGscAnalytics(
          customerId,
          siteUrl
        );
        
        if (response?.code === 200 && response.data) {
          const analyticsData = this.processGscAnalytics(response.data);
          this.gscAnalytics = analyticsData;
          
          // 确保图表更新
          this.$nextTick(() => {
            this.updateChart(); // 更新图表
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

    async handleSiteChange(siteUrl) {
      this.selectedSiteUrl = siteUrl;
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getGscAnalytics(
          customerId,
          siteUrl
        );
        
        if (response?.code === 200) {
          if (!response.data || response.data.length === 0) {
            // 如果数据为空，设置为 null 或默认值
            this.gscAnalytics = {
              impressions: 'No data',
              clicks: 'No data',
              ctr: 'No data',
              impressionsChange: null,
              clicksChange: null,
              dailyData: []
            };
          } else {
            // 有数据时正常处理
            this.gscAnalytics = this.processGscAnalytics(response.data);
          }
          
          // 确保图表更新
          this.$nextTick(() => {
            this.updateChart();
          });
        }
      } catch (error) {
        console.error('Failed to load GSC analytics:', error);
        // 在错误时显示 No data
        this.gscAnalytics = {
          impressions: 'No data',
          clicks: 'No data',
          ctr: 'No data',
          impressionsChange: null,
          clicksChange: null,
          dailyData: []
        };
      }
    },

    async collectPublishedUrls() {
      try {
        this.loading = true;
        const response = await apiClient.getPublishUrls();
        
        if (response?.code === 200) {
          const urls = response.data || [];
          
          if (urls.length === 0) {
            message.warning('No published pages found');
            return;
          }

          this.publishedUrls = urls;
          this.sitemapModal.visible = true;
        } else {
          throw new Error(response?.message || 'Failed to get published URLs');
        }
      } catch (error) {
        console.error('Failed to collect published URLs:', error);
        message.error(error.message || 'Failed to get published URLs');
      } finally {
        this.loading = false;
      }
    },

    async handleSubmitUrls() {
      if (this.publishedUrls.length === 0) {
        message.warning('No URLs available for submission');
        return;
      }

      this.submitLoading = true;
      try {
        const response = await apiClient.publishSitemapAndUrls();
        
        if (response?.code === 200) {
          message.success('Successfully submitted URLs to Google Search Console');
          this.sitemapModal.visible = false;
        } else {
          throw new Error(response?.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Failed to submit URLs:', error);
        message.error(error.message || 'Submission failed');
      } finally {
        this.submitLoading = false;
      }
    },

    closeSitemapModal() {
      this.sitemapModal.visible = false;
      this.publishedUrls = [];
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
      // 添加其他处理逻辑
    },
    
    // 处理连接 GSC
    handleConnectGSC() {
      console.log('连接 GSC');
      this.successModalVisible = false;
      // 添加其他处理逻辑
    },
    
    // 处理功能导览
    handleExploreTour() {
      this.successModalVisible = false;
      this.openGuideModeDialog();
    },
    
    // 关闭成功弹窗
    handleSuccessModalClose() {
      console.log('关闭 success modal');
      this.successModalVisible = false;
    },

    // 添加测试方法
    testShowModal() {
      console.log('点击测试按钮');
      this.successModalVisible = true;
      console.log('当前 modal 状态:', this.successModalVisible);
    },

    openGuideModeDialog() {
      // 通过事件触发父组件的方法
      this.$emit('open-guide-mode');
    }
  },

  // 如果使用组合式 API，也可以这样写：
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


.d-block {
  display: block;
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
  padding: 8px 12px;
  background: #f0f7ff;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  
  ul {
    margin: 0;
    padding-left: 16px;
    
    li {
      margin: 4px 0;
    }
  }
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

.traffic-section {
  margin-bottom: 24px;
}

.traffic-analytics {
  height: 400px;
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
    
    &::before {
      content: '💡';
      font-size: 13px;
    }
  }

  .help-text {
    color: #8c8c8c;  /* 改为更浅的灰色 */
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &::before {
      content: 'ℹ️';
      font-size: 12px;
    }
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

/* 添加进度状态的样式 */
.progress-status {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4px 12px;
  border-radius: 12px;
}
</style>