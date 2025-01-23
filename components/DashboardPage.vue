<template>
  <page-layout
    title="Dashboard"
    description="Manage your product and track your performance"
    icon="📊"
  >
    <!-- Make sure the slot name matches exactly -->
    <template #title-extra>
      <a-button 
        class="tutorial-trigger"
        type="text"
        size="middle"
        @click="showTutorial"
      >
       What can i do with Dashboard?
      </a-button>
    </template>

    <!-- Tutorial component -->
    <ModuleTutorial
      v-model:visible="tutorialVisible"
      :steps="dashboardTutorial.steps"
      @complete="onTutorialComplete"
    />
    
    <!-- Rest of the content -->
    <div class="dashboard-content">
      <!-- Add test button -->
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

      <!-- Quick Access Panel -->
      <a-card class="quick-access-panel">
        <template #title>
          <span style="color: white;">⚡ Smart Recommendations</span>
        </template>
        <div class="quick-links">
          <div class="quick-link-item">
            <div class="quick-link-icon">
              <CalendarOutlined />
            </div>
            <div class="quick-link-content">
              <div class="quick-link-header">
                <div class="quick-link-title">Keywords Planner</div>
                <a-tag color="success" v-if="productInfo?.domainStatus">
                  {{ pagesDashboard?.keywordOpportunities || 3 }} Opportunities
                </a-tag>
              </div>
              <div class="quick-link-desc">
                Based on your product analysis, we've identified high-potential traffic opportunities and crafted a customized keyword strategy.
              </div>
              <div class="quick-link-action">
                <router-link to="/keywords" class="action-link">
                  View Recommendations
                  <RightOutlined />
                </router-link>
              </div>
            </div>
          </div>

          <div class="quick-link-item">
            <div class="quick-link-icon">
              <CheckSquareOutlined />
            </div>
            <div class="quick-link-content">
              <div class="quick-link-header">
                <div class="quick-link-title">Content Tasks</div>
                <a-tag color="warning" v-if="productInfo?.domainStatus">
                  {{ pagesDashboard?.pendingTasks || 2 }} Pending
                </a-tag>
              </div>
              <div class="quick-link-desc">
                We've analyzed your site's indexing status and identified content gaps. Let's create a strategic publishing plan.
              </div>
              <div class="quick-link-action">
                <router-link to="/task-management" class="action-link">
                  View Tasks
                  <RightOutlined />
                </router-link>
              </div>
            </div>
          </div>

          <div class="quick-link-item">
            <div class="quick-link-icon">
              <AppstoreOutlined />
            </div>
            <div class="quick-link-content">
              <div class="quick-link-header">
                <div class="quick-link-title">Brand Assets</div>
                <a-tag color="processing" v-if="productInfo?.domainStatus">
                  {{ pagesDashboard?.missingAssets || 4 }} Recommended
                </a-tag>
              </div>
              <div class="quick-link-desc">
                Enhance your content quality with comprehensive brand assets. We've prepared suggestions based on your site analysis.
              </div>
              <div class="quick-link-action">
                <router-link to="/assets" class="action-link">
                  Manage Assets
                  <RightOutlined />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <!-- Sitemap and Pages Row -->
      <a-row :gutter="[16, 16]" v-if="productInfo?.productId">
        <!-- Sitemap Panel - occupies 2/3 width -->
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
              <template v-else>
                <a-empty 
                  description="No pages found" 
                  class="centered-empty-state"
                />
              </template>
            </template>
          </a-card>
        </a-col>

        <!-- Pages Card - occupies 1/3 width -->
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
        <!-- Traffic card - occupies full width -->
        <a-col :span="24">
          <a-card class="analytics-card">
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
            <div class="traffic-analytics-content">
              <!-- Notice when not connected to GSC -->
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
              <!-- Data content -->
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
            </div>
          </a-card>
        </a-col>

        <!-- Chart card -->
        <a-col :span="24">
          <a-card>
            <template #title>
              <span>📈 Traffic Analytics (Last 15 Days)</span>
            </template>
            
            <template v-if="!isGscConnected">
              <!-- GSC not connected state -->
              <a-empty class="centered-empty-state">
                <template #description>
                  <span>Connect Google Search Console to view analytics</span>
                </template>
                <a-button 
                  type="primary" 
                  @click="connectGSC"
                >
                  Connect Google Search Console
                </a-button>
              </a-empty>
            </template>
            
            <template v-else-if="!gscAnalytics?.dailyData?.length">
              <!-- No data state -->
              <a-empty 
                description="No data available" 
                class="centered-empty-state"
              />
            </template>
            
            <template v-else>
              <!-- Chart container -->
              <div class="chart-wrapper">
                <div id="trafficChart" ref="chartRef" class="chart-container"></div>
              </div>
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
          <p class="help-text">This name will be used throughout your content generation.</p>
        </a-form-item>

        <!-- Website info and domain verification -->
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

          <!-- Domain verification section -->
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

    <!-- Add Sitemap modal -->
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
      <div class="setup-progress-panel" v-if="shouldShowSetupPanel">
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
  QuestionCircleOutlined,
  RightOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { Modal, message } from 'ant-design-vue'
import * as echarts from 'echarts'
import ModuleTutorial from '../components/common/ModuleTutorial.vue'
import { dashboardTutorial } from '../config/tutorials/dashboard'

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
    QuestionCircleOutlined,
    ModuleTutorial,
    RightOutlined,
    CheckSquareOutlined,
    AppstoreOutlined,
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
      hasTourCompleted: false, // 修改初始值
      tutorialVisible: false,
      dashboardTutorial: dashboardTutorial, // 添加到 data 中
      expandedKeys: [], // 添加新的数据属性
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
    const chartInstance = ref(null)
    
    const initChart = () => {
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }
      chartInstance.value = echarts.init(chartRef.value)
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
      // 只有当产品信息加载完成且未完成所有步骤时才显示
      return (
        this.productInfo && 
        !this.allStepsCompleted && 
        !this.loading
      );
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
        
        console.log('GSC Status:', response)
        
        if (response?.code === 1201) {
          this.isGscConnected = false
          this.gscSites = []
          this.gscAnalytics = null
          return
        }
        
        // 只更新连接状态
        this.isGscConnected = response?.code === 200
        
        // 仅在首次连接成功时加载数据
        if (this.isGscConnected && !this.gscSites.length) {
          await this.loadGscData()
          await this.loadGscAnalytics()
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
      },
      'gscAnalytics.dailyData': {
        handler(newVal) {
          if (newVal?.length) {
            this.$nextTick(() => {
              this.initOrUpdateChart();
            });
          }
        },
        deep: true
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
        const siteUrl = this.selectedSiteUrl;
        
        const response = await apiClient.getGscAnalytics(
          customerId,
          siteUrl
        );

        if (response?.code === 200) {
          this.gscAnalytics = response.data ? this.processGscAnalytics(response.data) : null;
          
          // 等待下一个 tick，确保 DOM 已更新
          await this.$nextTick();
          
          // 更新图表
          this.initOrUpdateChart();
        }
      } catch (error) {
        console.error('Failed to load GSC analytics:', error);
        // 发生错误时清除图表
        if (this.chartInstance) {
          this.chartInstance.clear();
        }
      }
    },

    async initOrUpdateChart() {
      try {
        // 确保有容器元素
        const chartContainer = document.getElementById('trafficChart');
        if (!chartContainer) {
          console.log('Chart container not found');
          return;
        }

        // 销毁现有实例
        if (this.chartInstance) {
          this.chartInstance.dispose();
          this.chartInstance = null;
        }

        // 创建新实例
        this.chartInstance = echarts.init(chartContainer);
        console.log('New chart instance created:', this.chartInstance);

        // 如果有数据，立即更新图表
        if (this.gscAnalytics?.dailyData?.length) {
          await this.$nextTick();
          this.updateChart();
        }

        // 添加窗口大小变化监听
        window.addEventListener('resize', () => {
          if (this.chartInstance) {
            this.chartInstance.resize();
          }
        });

      } catch (error) {
        console.error('Failed to initialize/update chart:', error);
      }
    },

    processGscAnalytics(data) {
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('Invalid or empty analytics data');
        return null;
      }

      // 添加日志以检查数据
      console.log('Raw analytics data:', data);

      // 按日期排序
      data.sort((a, b) => new Date(a.keys[1]) - new Date(b.keys[1]));

      // 提取每日数据
      const dailyData = data.map(item => ({
        date: item.keys[1],
        impressions: Number(item.impressions) || 0,
        clicks: Number(item.clicks) || 0,
        ctr: Number(item.ctr) || 0,
        position: Number(item.position) || 0
      }));

      // 添加日志以检查处理后的数据
      console.log('Processed daily data:', dailyData);

      // 计算总量
      const totals = {
        impressions: data.reduce((sum, item) => sum + (item.impressions || 0), 0),
        clicks: data.reduce((sum, item) => sum + (item.clicks || 0), 0),
        ctr: 0
      };

      totals.ctr = totals.clicks > 0 ? 
        ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0;

      // 计算环比
      const halfLength = Math.floor(data.length / 2);
      const firstHalf = {
        impressions: data.slice(0, halfLength).reduce((sum, item) => sum + (item.impressions || 0), 0),
        clicks: data.slice(0, halfLength).reduce((sum, item) => sum + (item.clicks || 0), 0)
      };
      const secondHalf = {
        impressions: data.slice(halfLength).reduce((sum, item) => sum + (item.impressions || 0), 0),
        clicks: data.slice(halfLength).reduce((sum, item) => sum + (item.clicks || 0), 0)
      };

      const impressionsChange = firstHalf.impressions > 0 ?
        (((secondHalf.impressions - firstHalf.impressions) / firstHalf.impressions) * 100).toFixed(1) : 0;
      
      const clicksChange = firstHalf.clicks > 0 ?
        (((secondHalf.clicks - firstHalf.clicks) / firstHalf.clicks) * 100).toFixed(1) : 0;

      console.log('Processed analytics data:', {
        dailyData,
        totals,
        changes: { impressionsChange, clicksChange }
      });

      return {
        impressions: totals.impressions,
        clicks: totals.clicks,
        ctr: totals.ctr,
        impressionsChange: impressionsChange > 0 ? impressionsChange : null,
        clicksChange: clicksChange > 0 ? clicksChange : null,
        dailyData
      };
    },

    updateChart() {
      if (!this.chartInstance || !this.gscAnalytics?.dailyData?.length) {
        console.warn('Cannot update chart: missing instance or data');
        return;
      }

      console.log('Updating chart with data:', this.gscAnalytics.dailyData);

      const data = this.gscAnalytics.dailyData;
      
      const option = {
        grid: {
          top: 50,
          right: 30,
          bottom: 50,
          left: 60
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const date = params[0].axisValue;
            const impressions = params.find(p => p.seriesName === 'Impressions')?.value || 0;
            const clicks = params.find(p => p.seriesName === 'Clicks')?.value || 0;
            const ctr = clicks > 0 ? ((clicks / impressions) * 100).toFixed(1) : 0;
            return `${date}<br/>
                    Impressions: ${impressions}<br/>
                    Clicks: ${clicks}<br/>
                    CTR: ${ctr}%`;
          }
        },
        legend: {
          data: ['Impressions', 'Clicks'],
          top: 10
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: [
          {
            type: 'value',
            name: 'Count',
            position: 'left'
          }
        ],
        series: [
          {
            name: 'Impressions',
            type: 'line',
            data: data.map(item => item.impressions),
            smooth: true,
            itemStyle: {
              color: '#1890ff'
            }
          },
          {
            name: 'Clicks',
            type: 'line',
            data: data.map(item => item.clicks),
            smooth: true,
            itemStyle: {
              color: '#52c41a'
            }
          }
        ]
      };

      try {
        console.log('Setting chart option');
        this.chartInstance.setOption(option);
        console.log('Chart option set successfully');
      } catch (error) {
        console.error('Failed to update chart:', error);
      }
    },

    mounted() {
      // 在组件挂载后初始化图表
      this.$nextTick(() => {
        this.initOrUpdateChart();
        // 添加 resize 事件监听
        window.addEventListener('resize', this.handleResize);
      });
    },

    beforeUnmount() {
      // 清理图表实例
      if (this.chartInstance) {
        this.chartInstance.dispose();
        this.chartInstance = null;
      }
      
      // 移除 resize 事件监听
      window.removeEventListener('resize', this.handleResize);
      
      // 清理 GSC 检查间隔
      if (this.gscCheckInterval) {
        clearInterval(this.gscCheckInterval);
      }
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
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

    async handleSiteChange(value) {
      console.log('Site changed to:', value);
      this.selectedSiteUrl = value;
      
      // 加载新数据前先清空图表
      if (this.chartInstance) {
        this.chartInstance.clear();
      }
      
      await this.loadGscAnalytics();
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
    },

    showTutorial() {
      this.tutorialVisible = true;
    },

    onTutorialComplete() {
      message.success('Tutorial completed! Click the tutorial button in the title bar to view it again.');
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
  
  :deep(.ant-card-head) {
    background: linear-gradient(to right, #f0f7ff, #f8fafc);
    border-radius: 16px 16px 0 0;
    padding: 24px;
    border-bottom: 2px solid #e6f4ff;
  }
  
  :deep(.ant-card-body) {
    padding: 24px !important;
    height: calc(100% - 76px); 
    overflow-y: auto;
    
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

.progress-status {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4px 12px;
  border-radius: 12px;
}

.tutorial-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  padding: 0;
  height: auto;
  transition: all 0.3s ease;
  text-shadow: 0 0 1px rgba(24, 144, 255, 0.1);
  position: relative;
  
  /* 柔和的发光动画 */
  animation: glow 3s ease-in-out infinite alternate;
  
  &:hover {
    color: #40a9ff;
    background: transparent;
    text-shadow: 0 0 6px rgba(24, 144, 255, 0.3);
    
    :deep(.anticon) {
      transform: rotate(12deg);
      filter: drop-shadow(0 0 4px rgba(24, 144, 255, 0.2));
    }
  }
  
  :deep(.anticon) {
    font-size: 16px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 2px rgba(24, 144, 255, 0.2));
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 1px rgba(24, 144, 255, 0.1),
                 0 0 2px rgba(24, 144, 255, 0.1);
  }
  to {
    text-shadow: 0 0 2px rgba(24, 144, 255, 0.2),
                 0 0 4px rgba(24, 144, 255, 0.2);
  }
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
  margin-bottom: 24px;
  border: none !important;
  /* 使用更高级的渐变配色，从深邃的靛蓝过渡到神秘的紫色 */
  background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%) !important;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.3) !important;
  border-radius: 16px !important;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* 添加更精致的光晕效果 */
    background: 
      radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 50%),
      radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.15), transparent 50%),
      radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 40%);
    pointer-events: none;
  }

  :deep(.ant-card-head) {
    padding: 20px 24px;
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .ant-card-head-title {
      span {
        font-size: 22px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }
  }

  :deep(.ant-card-body) {
    background: transparent;
    padding: 24px;
  }

  :deep(.ant-card-head-title) {
    /* 修改: 使用白色系的颜色 */
    color: rgba(255, 255, 255, 0.95) !important;
    /* 添加: 文字阴影提高可读性 */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;
  z-index: 1;
}

.quick-link-item {
  display: flex;
  align-items: flex-start;
  padding: 24px;
  /* 使用更高级的半透明背景 */
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* 更细腻的边框效果 */
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 12px 28px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1);

    .quick-link-icon {
      transform: scale(1.05);
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      box-shadow: 
        0 8px 20px rgba(79, 70, 229, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    }
  }
}

.quick-link-icon {
  flex: none;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  /* 更高级的图标渐变 */
  background: linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%);
  border-radius: 8px;
  margin-right: 16px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.25);
}

.quick-link-title {
  font-weight: 600;
  font-size: 16px;
  /* 更柔和的文字颜色 */
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.quick-link-desc {
  font-size: 14px;
  /* 更柔和的描述文字颜色 */
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 8px 0;
}

.quick-link-action {
  margin-top: 12px;

  .action-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    /* 更明亮的操作链接颜色 */
    color: #818CF8;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;

    .anticon {
      font-size: 12px;
      transition: transform 0.3s ease;
    }

    &:hover {
      color: #A5B4FC;
      gap: 8px;
      .anticon {
        transform: translateX(4px);
      }
    }
  }
}

.chart-wrapper {
  width: 100%;
  height: 400px;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
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
</style>