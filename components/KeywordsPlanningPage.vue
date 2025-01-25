<template>
  <page-layout>
    <smart-banner
      :theme="bannerTheme"
      title="AI-Powered Content Planning"
      description="Leverage advanced AI algorithms to analyze keywords, generate content outlines, and create comprehensive content plans tailored to your audience."
      :badges="[
        { text: 'AI Analysis' },
        { text: 'SEO Optimized' },
        { text: 'Keyword Metrics' }
      ]"
      emoji="🎯"
    />
    
    <a-spin :spinning="loading">
      <template v-if="domainConfigured">
        <template v-if="analysisState !== 'finished'">
          <div class="analysis-loading-state">
            <a-card class="loading-card">
              <!-- Not Started State -->
              <template v-if="analysisState === 'not_started'">
                <div class="loading-content">
                  <LoadingOutlined class="analysis-icon" spin />
                  <h2>Preparing Analysis</h2>
                  <p>Collecting data from SEMrush and Ahrefs...</p>
                </div>
              </template>

              <!-- Processing State -->
              <template v-if="analysisState === 'processing'">
                <div class="loading-content">
                  <LoadingOutlined class="analysis-icon" spin />
                  <h2>Analysis in Progress</h2>
                  
                  <!-- Show current tasks -->
                  <div v-for="task in currentTasks" :key="task.taskName" class="task-item">
                    <div class="task-header">
                      <span>{{ task.taskName }}</span>
                      <span>{{ task.status }}</span>
                    </div>
                    
                    <!-- Show progress if available -->
                    <template v-if="task.progress">
                      <a-progress 
                        :percent="getProgressPercent(task.progress)"
                        :format="() => `${task.progress.current}/${task.progress.total}`"
                      />
                    </template>
                    
                    <!-- Show timing info -->
                    <div class="task-timing">
                      <span>Started: {{ formatTime(task.startTime) }}</span>
                      <span v-if="task.endTime">Completed: {{ formatTime(task.endTime) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </a-card>
          </div>
        </template>

        <template v-else>
          <div class="planning-layout">
            <!-- 左侧垂直步骤导航 -->
            <div class="steps-navigation">
              <div class="step-item" :class="{ active: currentStep === '0' }">
                <div class="step-content" @click="currentStep = '0'">
                  <div class="step-number">1</div>
                  <div class="step-info">
                    <div class="step-title">Select Keywords</div>
                    <div class="step-desc">Choose and analyze keywords</div>
                  </div>
                </div>
                <!-- 连接线 -->
                <div class="step-connector">
                  <div class="connector-line"></div>
                  <div class="connector-arrow"></div>
                </div>
              </div>

              <div class="step-item" :class="{ active: currentStep === '1' }">
                <div class="step-content" @click="currentStep = '1'">
                  <div class="step-number">2</div>
                  <div class="step-info">
                    <div class="step-title">Check Intent & Outline</div>
                    <div class="step-desc">Review and generate content plan</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主内容区域 -->
            <div class="main-content">
              <!-- 工具栏 -->
              <div class="content-toolbar">
                <!-- 只在第一步显示模式切换 -->
                <a-radio-group 
                  v-if="currentStep === '0'"
                  v-model:value="currentMode" 
                  button-style="solid" 
                  size="middle"
                  class="mode-switch"
                >
                  <a-radio-button value="beginner">
                    Beginner
                  </a-radio-button>
                  <a-radio-button value="expert">
                    Expert
                  </a-radio-button>
                </a-radio-group>
                
                <!-- View Selected 按钮在两个步骤都显示 -->
                <a-button 
                  type="primary"
                  @click="showSelectedKeywords"
                  class="view-selected-btn"
                >
                  View Selected
                </a-button>
              </div>

              <!-- 步骤内容 -->
              <div v-show="currentStep === '0'" class="step-panel">
                <!-- 第一步的内容 -->
                <div class="keywords-selection">
                  <!-- 原来第一步的内容 -->
                  <div class="left-panel" :class="{ 'panel-hidden': currentStep > 0 }">
                    <!-- Mode Selector -->
                    <a-card class="mode-selector-card">
                      <div class="mode-selector-wrapper">
                        <div class="mode-controls">
                          <a-popover
                            placement="rightTop"
                            trigger="click"
                            :overlayStyle="{ maxWidth: '400px' }"
                          >
                            <template #content>
                              <div class="analysis-overview-popover">
                                <div class="overview-section">
                                  <div class="section-title">
                                    <span class="number">1</span>
                                    Analysis Overview
                                  </div>
                                  <p class="section-desc">We've completed a comprehensive keyword analysis</p>
                                  <div class="stats-row">
                                    <div class="stat-item">
                                      <div class="stat-label">We've analyzed</div>
                                      <div class="stat-value">{{ overviewData.totalKeywordsAnalyzed }} keywords</div>
                                    </div>
                                    <div class="stat-item">
                                      <div class="stat-label">Compared your site with</div>
                                      <div class="stat-value">{{ overviewData.totalTopPagesAnalyzed }} top pages</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div class="overview-section">
                                  <div class="section-title">
                                    <span class="number">2</span>
                                    What We Found
                                  </div>
                                  <p class="section-desc">Here's what our analysis revealed about your keyword coverage</p>
                                  <div class="findings-tags">
                                    <a-tag color="red">{{overviewData.absence}} keywords you're missing</a-tag>
                                  </div>
                                </div>
                                
                                <div class="overview-section">
                                  <div class="section-title">
                                    <span class="number">3</span>
                                    Recommended Actions
                                  </div>
                                  <p class="section-desc">We've prioritized keywords based on potential impact and effort</p>
                                  <div class="action-steps">
                                    <div class="step-item">
                                      <CheckCircleOutlined />
                                      <span>Review and select keywords below</span>
                                    </div>
                                    <div class="step-item">
                                      <ArrowRightOutlined />
                                      <span>Focus on P0 (Quick Wins) first</span>
                                    </div>
                                    <div class="step-item">
                                      <ArrowRightOutlined />
                                      <span>Then move to higher effort opportunities</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <QuestionCircleOutlined class="help-icon" />
                          </a-popover>
                        </div>
                      </div>
                    </a-card>

                    <!-- Keyword Selection Component -->
                    <div v-if="currentMode === 'beginner'" class="beginner-mode">
                      <a-row :gutter="[24, 24]" class="beginner-content">
                        <!-- Keywords From Comparison Table -->
                        <a-col :span="12">
                          <a-card title="Keywords From Comparison" class="keyword-table-card">
                            <a-tabs 
                              v-model:activeKey="currentPriority"
                              @change="handleTabChange"
                              class="priority-tabs"
                              tabPosition="left"
                            >
                              <a-tab-pane v-for="priority in priorities" :key="priority.level">
                                <template #tab>
                                  <div class="priority-tab">
                                    <div class="priority-indicator" :style="{ backgroundColor: priority.color }"></div>
                                    <span>{{ priority.label }}</span>
                                  </div>
                                </template>
                                
                                <a-table
                                  :dataSource="getKeywordsByPriority(recommendedKeywords, priority.level)"
                                  :columns="comparisonColumns"
                                  :pagination="recommendedPagination"
                                  @change="(page) => handleComparisonPaginationChange(priority.level, page.current, page.pageSize)"
                                  size="small"
                                >
                                  <template #actions="{ record }">
                                    <a-button 
                                      type="text"
                                      @click="handleKeywordFavorite(record)"
                                    >
                                      {{ record.favorited ? 'Remove' : 'Add' }}
                                    </a-button>
                                  </template>
                                </a-table>
                              </a-tab-pane>
                            </a-tabs>
                          </a-card>
                        </a-col>

                        <!-- Keywords From Top Pages Table -->
                        <a-col :span="12">
                          <a-card title="Keywords From Top Pages" class="keyword-table-card">
                            <a-tabs 
                              v-model:activeKey="currentPagePriority"
                              @change="handlePageTabChange"
                              class="priority-tabs"
                              tabPosition="left"
                            >
                              <a-tab-pane v-for="priority in priorities" :key="priority.level">
                                <template #tab>
                                  <div class="priority-tab">
                                    <div class="priority-indicator" :style="{ backgroundColor: priority.color }"></div>
                                    <span>{{ priority.label }}</span>
                                  </div>
                                </template>
                                
                                <a-table
                                  :dataSource="getKeywordsByPriority(pageKeywords, priority.level)"
                                  :columns="comparisonColumns"
                                  :pagination="pagePagination"
                                  @change="(page) => handleTopPagesPaginationChange(priority.level, page.current, page.pageSize)"
                                  size="small"
                                >
                                  <template #actions="{ record }">
                                    <a-button 
                                      type="text"
                                      @click="handleKeywordFavorite(record)"
                                    >
                                      {{ record.favorited ? 'Remove' : 'Add' }}
                                    </a-button>
                                  </template>
                                </a-table>
                              </a-tab-pane>
                            </a-tabs>
                          </a-card>
                        </a-col>
                      </a-row>
                    </div>

                    <!-- Content in expert mode -->
                    <template v-else>
                      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; text-align: center;">
                        <h2 style="font-size: 24px; color: #1890ff; margin-bottom: 16px;">Expert Mode - Coming Soon</h2>
                        <p style="font-size: 16px; color: rgba(0, 0, 0, 0.45);">
                          We're working on something special for our advanced users.
                          <br>Stay tuned for powerful expert features!
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div v-show="currentStep === '1'" class="step-panel">
                <!-- 修改第二步内容的布局结构 -->
                <div class="outline-generation">
                  <div class="step-two-content">
                    <div class="workspace-layout">
                      <!-- 移除原来的关键词列表卡片 -->
                      
                      <!-- Outline 内容部分 -->
                      <div class="plan-section">
                        <!-- Update task progress section -->
                        <div class="task-progress-section">
                          <a-alert
                            :type="outlineGenerationStatus === 'failed' ? 'error' : 'info'"
                            class="task-alert"
                          >
                            <template #icon>
                              <LoadingOutlined v-if="outlineGenerationStatus === 'processing'" spin />
                              <WarningOutlined v-else-if="outlineGenerationStatus === 'failed'" />
                              <CheckCircleOutlined v-else />
                            </template>
                            <template #message>
                              <div class="task-progress-content">
                                <template v-if="outlineGenerationStatus && outlineGenerationStatus !== 'finished'">
                                  <div class="task-info">
                                    <span class="task-status">
                                      {{ getTaskStatusText(outlineGenerationStatus) }}
                                    </span>
                                    <span v-if="taskStartTime" class="task-timing">
                                      Started: {{ formatTime(taskStartTime) }}
                                      <template v-if="taskEndTime">
                                        | Completed: {{ formatTime(taskEndTime) }}
                                      </template>
                                    </span>
                                  </div>
                                  <div v-if="taskDescription" class="task-description">
                                    {{ taskDescription }}
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="task-info">
                                    <!-- 将按钮和状态文本分开，改为垂直布局 -->
                                    <div class="generate-section">
                                      <div class="task-status">
                                        ✨ Everything is ready! You can start page generation with your content plans below.
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </div>
                            </template>
                          </a-alert>
                        </div>

                        <a-tabs 
                          v-model:activeKey="contentPlanTab" 
                          class="content-plan-tabs"
                          @change="handleContentPlanTabChange"
                        >
                          <template #rightExtra>
                            <a-space>
                              <!-- Generate Content Plan button - 使用蓝色系 -->
                              <a-button 
                                type="primary"
                                :loading="isGenerating"
                                :disabled="totalSelectedKeywords === 0"
                                @click="generateContentPlan"
                                style="background: linear-gradient(to right, #1890ff, #40a9ff); 
                                       border: none; 
                                       font-weight: 500;
                                       height: 40px;
                                       padding: 0 24px;
                                       box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);"
                                :class="{ 'hover-effect': !disabled }"
                              >
                                Generate Content Plan
                              </a-button>

                              <a-button 
                                type="primary"
                                :disabled="!contentPlans.length"
                                @click="handlePublishOutlines"
                                style="background: linear-gradient(to right, #52c41a, #73d13d); 
                                       border: none; 
                                       font-weight: 500;
                                       height: 40px;
                                       padding: 0 24px;
                                       box-shadow: 0 2px 8px rgba(82, 196, 26, 0.35);"
                                :class="{ 'hover-effect': !disabled }"
                              >
                                Start Page generation
                              </a-button>

                              <!-- Existing buttons -->
                              <a-button 
                                type="text"
                                :disabled="!contentPlans.length"
                                @click="refreshContentPlans"
                                :loading="isRefreshing"
                              >
                                Refresh
                              </a-button>
                              <a-button 
                                type="text" 
                                danger
                                :disabled="!contentPlans.length"
                                @click="confirmClearAllOutlines"
                              >
                                Clear All
                              </a-button>
                            </a-space>
                          </template>
                          <!-- All Outlines Tab -->
                          <a-tab-pane key="all" tab="All Outlines">
                            <div class="tab-content-wrapper">
                              <div class="outlines-header">
                                <a-checkbox 
                                  :checked="allOutlinesSelected"
                                  :indeterminate="someOutlinesSelected"
                                  @change="handleSelectAllOutlines"
                                >
                                  Select All Outlines
                                </a-checkbox>
                                <span class="selected-count" v-if="selectedOutlinesCount > 0">
                                  ({{ selectedOutlinesCount }} selected)
                                </span>
                              </div>
                              <div class="content-plans-grid">
                                <template v-if="isLoadingOutlines">
                                  <div class="content-plans-loading">
                                    Loading...
                                  </div>
                                </template>
                                <template v-else>
                                  <a-card 
                                    v-for="plan in contentPlans" 
                                    :key="plan.outlineId"
                                    class="plan-card"
                                  >
                                    <div class="card-header">
                                      <div class="card-header-left">
                                        <a-checkbox
                                          :checked="plan.selected"
                                          @change="(e) => handleOutlineSelect(plan, e.target.checked)"
                                        />
                                        <!-- 添加类型标签 -->
                                        <a-tag :color="getTypeColor(plan.pageType)">
                                          {{ plan.pageType }}
                                        </a-tag>
                                      </div>
                                      <div class="card-actions">
                                        <a-button 
                                          type="text"
                                          @click="handleFavorite(plan)"
                                        >
                                          {{ plan.favorited ? 'Remove' : 'Add' }}
                                        </a-button>
                                      </div>
                                    </div>
                                    
                                    <div class="card-content" @click="showPlanDetails(plan)">
                                      <h3 class="plan-title">{{ plan.title }}</h3>
                                      <p class="plan-description">{{ plan.description }}</p>
                                      
                                      <div class="plan-metrics">
                                        <div class="metric-item">
                                          <span class="metric-label">
                                            <FileTextOutlined /> Word Count
                                          </span>
                                          <span class="metric-value">{{ getTotalWordCount(plan).toLocaleString() }}</span>
                                        </div>
                                        <div class="metric-item">
                                          <span class="metric-label">
                                            <OrderedListOutlined /> Sections
                                          </span>
                                          <span class="metric-value">{{ plan.outline.length }}</span>
                                        </div>
                                      </div>

                                      <div class="plan-keywords">
                                        <a-tag 
                                          v-for="keyword in plan.keywords.split(', ').slice(0, 3)" 
                                          :key="keyword"
                                          color="blue"
                                        >
                                          {{ keyword }}
                                        </a-tag>
                                        <a-tag v-if="plan.keywords.split(', ').length > 3">
                                          +{{ plan.keywords.split(', ').length - 3 }} more
                                        </a-tag>
                                      </div>

                                      <div class="plan-actions">
                                        <a-button 
                                          type="primary" 
                                          @click="showPlanDetails(plan)"
                                        >
                                          View Details
                                        </a-button>
                                      </div>
                                    </div>
                                  </a-card>
                                </template>
                              </div>
                              <div class="pagination-container">
                                <a-pagination
                                  v-model:current="contentPlansPagination.current"
                                  :total="contentPlansPagination.total"
                                  :pageSize="contentPlansPagination.pageSize"
                                  @change="handleContentPlansPaginationChange"
                                  show-size-changer
                                  show-quick-jumper
                                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                                />
                              </div>
                            </div>
                          </a-tab-pane>

                          <!-- Selected Outlines Tab -->
                          <a-tab-pane key="selected" tab="Selected Outlines">
                            <div class="tab-content-wrapper">
                              <div class="content-plans-grid">
                                <a-card 
                                  v-for="plan in contentPlans.filter(p => p.favorited)" 
                                  :key="plan.outlineId"
                                  class="plan-card"
                                  :bordered="false"
                                >
                                  <template #extra>
                                    <a-space>
                                      <a-button 
                                        type="text"
                                        @click.stop="handleFavorite(plan)"
                                      >
                                        {{ plan.favorited ? 'Remove' : 'Add' }}
                                      </a-button>
                                    </a-space>
                                  </template>
                                  
                                  <div class="card-content" @click="showPlanDetails(plan)">
                                    <h3 class="plan-title">{{ plan.title }}</h3>
                                    <p class="plan-description">{{ plan.description }}</p>
                                    
                                    <div class="plan-metrics">
                                      <div class="metric-item">
                                        <span class="metric-label">
                                          <FileTextOutlined /> Word Count
                                        </span>
                                        <span class="metric-value">{{ getTotalWordCount(plan).toLocaleString() }}</span>
                                      </div>
                                      <div class="metric-item">
                                        <span class="metric-label">
                                          <OrderedListOutlined /> Sections
                                        </span>
                                        <span class="metric-value">{{ plan.outline.length }}</span>
                                      </div>
                                    </div>

                                    <div class="plan-keywords">
                                      <a-tag 
                                        v-for="keyword in plan.keywords.split(', ').slice(0, 3)" 
                                        :key="keyword"
                                        color="blue"
                                      >
                                        {{ keyword }}
                                      </a-tag>
                                      <a-tag v-if="plan.keywords.split(', ').length > 3">
                                        +{{ plan.keywords.split(', ').length - 3 }} more
                                      </a-tag>
                                    </div>

                                    <div class="plan-actions">
                                      <a-button 
                                        type="primary" 
                                        @click="showPlanDetails(plan)"
                                      >
                                        View Details
                                      </a-button>
                                    </div>
                                  </div>
                                </a-card>
                              </div>
                              <div class="pagination-container">
                                <a-pagination
                                  v-model:current="contentPlansPagination.current"
                                  :total="contentPlansPagination.total"
                                  :pageSize="contentPlansPagination.pageSize"
                                  @change="handleContentPlansPaginationChange"
                                  show-size-changer
                                  show-quick-jumper
                                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                                />
                              </div>
                            </div>
                          </a-tab-pane>
                        </a-tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>

      <template v-else>
        <no-site-configured/>
      </template>
    </a-spin>

    <!-- 添加进度弹窗 -->
    <a-modal
      v-model:open="generationProgressVisible"
      title="Generating Pages"
      :closable="false"
      :maskClosable="false"
      :footer="null"
      width="400px"
    >
      <div class="generation-progress">
        <div class="progress-status">
          <LoadingOutlined v-if="isGeneratingPages" spin />
          <CheckCircleOutlined v-else-if="generationCompleted" style="color: #52c41a" />
          <CloseCircleOutlined v-else-if="generationFailed" style="color: #ff4d4f" />
          <span class="status-text">{{ generationStatusText }}</span>
        </div>
        <a-progress 
          :percent="generationProgress" 
          :status="generationStatus"
        />
        <div class="progress-details">
          {{ generationDetails }}
        </div>
      </div>
    </a-modal>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed, h, watch, nextTick, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { 
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  EyeOutlined,
  BulbOutlined,
  CompassOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  LinkOutlined,
  LineChartOutlined,
  TrophyOutlined,
  ExportOutlined,
  LoadingOutlined,
  WarningOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  InfoCircleOutlined,
  ReloadOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  AimOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import {
  tableColumns,
  competitorColumns,
  tableData,
  recommendedKeywords as importedRecommendedKeywords
} from '../data/keywordPlanningData'
import { message } from 'ant-design-vue'
import api from '../api/api'
import { useRouter } from 'vue-router'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import { Modal } from 'ant-design-vue'
import SmartBanner from './common/SmartBanner.vue'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  components: {
    PageLayout,
    DeleteOutlined,
    PlusOutlined,
    SaveOutlined,
    EyeOutlined,
    BulbOutlined,
    CompassOutlined,
    FileTextOutlined,
    OrderedListOutlined,
    LinkOutlined,
    LineChartOutlined,
    TrophyOutlined,
    ExportOutlined,
    LoadingOutlined,
    WarningOutlined,
    NoSiteConfigured,
    ClockCircleOutlined,
    SearchOutlined,
    HeartOutlined,
    HeartFilled,
    InfoCircleOutlined,
    ReloadOutlined,
    CloudUploadOutlined,
    CloseCircleOutlined,
    SmartBanner,
    ExperimentOutlined,
    ThunderboltOutlined,
    AimOutlined,
    BarChartOutlined,
    UserOutlined
  },
  setup() {
    const currentMode = ref('beginner')
    const selectedKeywords = ref([])
    const isGeneratingTitles = ref(false) 
    const isGeneratingOutline = ref(false) 
    const loading = ref(true) 
    const taskStartTime = ref(null)
    const taskEndTime = ref(null)
    const taskDescription = ref(null)
    const columns = computed(() => tableColumns)
    
    const overviewData = ref({
      totalKeywordsAnalyzed: 0,
      totalTopPagesAnalyzed: 0,
      absence: 0,  
      weak: 0  
    })

    const canProceedToNext = computed(() => {
      return selectedKeywords.value.length > 0;
    });

    const clearSelection = () => {
      selectedKeywords.value = []
      recommendedKeywords.value.forEach(k => k.selected = false)
      pageKeywords.value.forEach(k => k.selected = false)
    }

    const overviewStats = ref({
      totalKeywords: 2500,
      ourTopPages: 30,
      competitorPages: 50
    })

    const priorities = [
      {
        level: '1',
        label: 'P1 - Quick Wins',
        color: '#f50'
      },
      {
        level: '2',
        label: 'P2 - High Priority',
        color: '#fa8c16' 
      },
      {
        level: '3',
        label: 'P3 - Medium Priority',
        color: '#1890ff'
      },
      {
        level: '4',
        label: 'P4 - Low Priority',
        color: '#52c41a'
      },
      {
        level: '5',
        label: 'P5 - Monitor',
        color: '#722ed1'
      }
    ]

    const recommendedKeywords = ref([])
    const pageKeywords = ref([])
    const recommendedPagination = ref({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const pagePagination = ref({
      current: 1,
      pageSize: 10,
      total: 0
    })

    const transformKeywordData = (item) => {
      return {
        id: item.keywordId,
        keyword: item.keyword,
        selected: false,
        favorited: item.status === 'selected',
        krs: Number(item.krsScore).toFixed(2),
        kd: item.kd,
        volume: item.volume,
        cpc: Number(item.cpc).toFixed(2),
        status: getKeywordStatus(item),
        grade: item.grade,
        reason: item.reasoning || 'No specific reason provided',
        relatedOutlines: item.relatedOutlines || [],
        favorited: item.status === 'selected',
      }
    }

    const fetchKeywords = async (source, level, page = 1, limit = 10) => {
      try {
        console.log('Fetching keywords with params:', { source, level, page, limit })
        const response = await api.getPlanningKeywords({
          source,
          level,
          page,
          limit,
          status: ''
        })
        
        if (response?.data) {
          const transformedData = response.data.map(transformKeywordData)
          if (source === 'keywords') {
            recommendedKeywords.value = transformedData
            recommendedPagination.value.total = response.totalCount
          } else if (source === 'top_page_keywords') {
            pageKeywords.value = transformedData
            pagePagination.value.total = response.totalCount
          }
        }
      } catch (error) {
        console.error('Failed to get keywords:', error)
      } finally {
        loading.value = false
      }
    }

    const handleComparisonPaginationChange = (priority, page, pageSize) => {
      console.log('Comparison Pagination change:', { priority, page, pageSize })
      recommendedPagination.value.current = page
      recommendedPagination.value.pageSize = pageSize
      fetchKeywords('keywords', priority, page, pageSize)
    }

    const handleTopPagesPaginationChange = (priority, page, pageSize) => {
      console.log('Top Pages Pagination change:', { priority, page, pageSize })
      pagePagination.value.current = page
      pagePagination.value.pageSize = pageSize
      fetchKeywords('top_page_keywords', priority, page, pageSize)
    }

    onMounted(async () => {
      loading.value = true
      try {
        await checkDomainStatus()

        if (domainConfigured.value) {
          await checkAnalysisStatus()
          
          if (analysisState.value !== 'finished') {
            pollingInterval.value = setInterval(checkAnalysisStatus, 5000)
          }

          initializeSelectedKeywords()
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        message.error('Failed to initialize the page')
      }
    })

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    })

    watch(
      [
        () => recommendedKeywords.value,
        () => pageKeywords.value,
        () => selectedKeywords.value
      ],
      ([newRecommendedKeywords, newPageKeywords, newSelectedKeywords], [oldRecommendedKeywords, oldPageKeywords, oldSelectedKeywords]) => {
        if (newRecommendedKeywords !== oldRecommendedKeywords) {
          console.log('recommendedKeywords changed:', newRecommendedKeywords)
          const selectedOnes = newRecommendedKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newRecommendedKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }

        if (newPageKeywords !== oldPageKeywords) {
          const selectedOnes = newPageKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newPageKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }
      },
      {
        deep: true
      }
    )

    const handleKeywordSelect = (keyword, isSelected) => {
      if (isSelected) {
        if (!selectedKeywords.value.find(k => k.keyword === keyword.keyword)) {
          selectedKeywords.value.push({
            ...keyword,
            selected: true
          })
        }
      } else {
        selectedKeywords.value = selectedKeywords.value.filter(
          k => k.keyword !== keyword.keyword
        )
      }
    }

    const getKeywordsByPriority = (keywords, priority) => {
      if (!keywords || !keywords.length) return []
      
      const priorityToGrade = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5'
      }
      
      const grade = priorityToGrade[priority]
      return keywords.filter(k => k.grade === grade)
    }

    const filters = ref([
      {
        field: 'kd',
        operator: '<',
        value: 50
      }
    ]);

    const addFilter = () => {
      filters.value.push({
        field: 'kd',
        operator: '<',
        value: 50,
        id: Date.now()
      });
    };

    const removeFilter = (index) => {
      filters.value.splice(index, 1);
    };

    const clearFilters = () => {
      filters.value = [];
      currentPreset.value = null;
    };

    const selectedRowKeys = ref([]);

    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (keys, selectedRows) => {
        selectedRowKeys.value = keys;
        console.log(`selectedRowKeys: ${keys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };

    const pagination = {
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    const handleTableChange = (pagination, filters, sorter) => {
      console.log('Table change:', pagination, filters, sorter);
    };

    const currentPreset = ref(null);
    const saveModalVisible = ref(false);
    const newPresetName = ref('');
    const savedPresets = ref([
      { id: 1, name: 'Low KD High Volume', filters: [
        { field: 'kd', operator: '<', value: 30 },
        { field: 'volume', operator: '>', value: 1000 }
      ] },
      { id: 2, name: 'High CPC Keywords', filters: [
        { field: 'cpc', operator: '>', value: 1 }
      ] }
    ]);

    const handlePresetChange = (presetId) => {
      const preset = savedPresets.value.find(p => p.id === presetId);
      if (preset) {
        filters.value = JSON.parse(JSON.stringify(preset.filters));
      }
    };

    const showSaveModal = () => {
      saveModalVisible.value = true;
    };

    const saveCurrentPreset = () => {
      if (newPresetName.value) {
        savedPresets.value.push({
          id: Date.now(),
          name: newPresetName.value,
          filters: JSON.parse(JSON.stringify(filters.value))
        });
        saveModalVisible.value = false;
        newPresetName.value = '';
      }
    };

    const currentStep = ref('0')
    const nextStep = async () => {
      if (!canProceedToNext.value) {
        message.warning('Please select at least one keyword')
        return
      }
      
      if (currentStep.value < '1') {
        currentStep.value = '1'
      }
    }

    const previousStep = () => {
      if (currentStep.value > '0') {
        currentStep.value = '0'
      }
    }

    const showSelectedModal = ref(false)

    const modalTabs = ref([
      { key: 'comparison', label: 'From Comparison' },
      { key: 'top_pages', label: 'From Top Pages' }
    ])
    const currentModalTab = ref('comparison')
    const modalKeywords = ref({
      comparison: [],
      top_pages: []
    })

    const fetchSelectedKeywords = async () => {
      isLoadingModalKeywords.value = true
      try {
        const [keywordsResponse, pageKeywordsResponse] = await Promise.all([
          api.getPlanningKeywords({
            source: 'keywords',
            status: 'selected',
            page: 1,
            limit: 100
          }),
          api.getPlanningKeywords({
            source: 'top_page_keywords',
            status: 'selected',
            page: 1,
            limit: 100
          })
        ])
        
        modalKeywords.value = {
          comparison: (keywordsResponse?.data || []).map(transformKeywordData),
          top_pages: (pageKeywordsResponse?.data || []).map(transformKeywordData)
        }
      } catch (error) {
        console.error('Failed to get selected keywords:', error)
        message.error('Failed to get selected keywords')
      } finally {
        isLoadingModalKeywords.value = false
      }
    }

    const handleModalClose = () => {
      showSelectedModal.value = false
    }

    const isGenerating = ref(false)

    const hasGenerated = ref(false)

    const filteredKeywords = ref(tableData)

    const getRankClass = (rank) => {
      if (rank <= 3) return 'top-3'
      if (rank <= 10) return 'top-10'
      return 'others'
    }

    const initializeSelectedKeywords = () => {
      const preSelectedKeywords = recommendedKeywords.value.filter(k => k.selected)
      selectedKeywords.value = preSelectedKeywords.map(k => ({
        ...k,
        selected: true
      }))
    }

    initializeSelectedKeywords()

    const analysisStatus = ref(null)
    const pollingInterval = ref(null)
    const taskInfo = ref(null)

    const checkAnalysisStatus = async () => {
      if (!domainConfigured.value) {
        loading.value = false;
        return;
      }

      try {
        const response = await api.getAnalysisStatus('analyze_keywords')
        if (response) {
          taskInfo.value = response
          if (response.analysisStatus === 'finished') {
            clearInterval(pollingInterval.value)
            const overview = await api.getKeywordAnalysisOverview()
            if (overview?.data) {
              overviewData.value = {
                totalKeywordsAnalyzed: overview.data.totalKeywordsAnalyzed,
                totalTopPagesAnalyzed: overview.data.totalTopPagesAnalyzed,
                absence: overview.data.keywordsGroup.absence,
                weak: overview.data.keywordsGroup.weak || 0
              }
            }
            await Promise.all([
              fetchKeywords('keywords', currentPriority.value, 1, recommendedPagination.value.pageSize),
              fetchKeywords('top_page_keywords', currentPriority.value, 1, pagePagination.value.pageSize)
            ])
          }
        }
      } catch (error) {
        console.error('Failed to check analysis status:', error)
        message.error('Failed to check analysis status')
      } finally {
        if (taskInfo.value?.analysisStatus !== 'finished') {
          loading.value = false
        }
      }
    }

    const analysisState = computed(() => {
      if (loading.value) return 'loading'
      return taskInfo.value?.analysisStatus || 'not_started'
    })

    const currentTasks = computed(() => {
      if (!taskInfo.value?.data || !Array.isArray(taskInfo.value.data)) return []
      return taskInfo.value.data
    })

    const getProgressPercent = (progress) => {
      if (!progress || !progress.total) return 0
      return Math.round((progress.current / progress.total) * 100)
    }

    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleString()
    }

    const domainConfigured = ref(false)
    const router = useRouter()

    const checkDomainStatus = async () => {
      loading.value = true
      try {
        const response = await api.getProductsByCustomerId()
        domainConfigured.value = response.data?.domainStatus || false
      } catch (error) {
        console.error('Failed to fetch product info:', error)
        domainConfigured.value = false
      } finally {
        loading.value = false
      }
    }

    const getKeywordStatus = (item) => {
      const gradeMap = {
        '1': { text: 'Quick Win Choose', color: 'red' },
        '2': { text: 'High Priority', color: 'orange' },
        '3': { text: 'Medium Priority', color: 'blue' },
        '4': { text: 'Low Priority', color: 'cyan' },
        '5': { text: 'Monitor', color: 'purple' }
      }
      
      return gradeMap[item.grade] || { text: 'Unknown', color: 'default' }
    }

    const currentPriority = ref('1')
    const currentPagePriority = ref('1')

    const handleTabChange = (activeKey) => {
      console.log('Tab changed to:', activeKey)
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        recommendedPagination.value.current = 1
        fetchKeywords('keywords', priority.level, 1, recommendedPagination.value.pageSize)
      }
    }

    const handlePageTabChange = (activeKey) => {
      console.log('Page tab changed to:', activeKey)
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        pagePagination.value.current = 1
        fetchKeywords('top_page_keywords', priority.level, 1, pagePagination.value.pageSize)
      }
    }

    const contentPlans = ref([])

    const selectedPlansCount = computed(() => {
      return contentPlans.value.filter(plan => plan.selected).length
    })

    const generateContentPlan = async () => {
      if (totalSelectedKeywords.value === 0) {
        message.warning('Please select at least one keyword');
        return;
      }

      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Generate Content Plan',
          content: `Are you sure you want to generate a content plan using the currently selected ${totalSelectedKeywords.value} keywords?`,
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      isGenerating.value = true;
      try {
        const selectedIds = [
          ...selectedKeywordsData.value.comparison.map(k => k.id),
          ...selectedKeywordsData.value.top_pages.map(k => k.id)
        ];

        console.log('Submitting generation request...');
        await api.generatePlanningComposite(selectedIds);
        
        message.success('Content plan generation request submitted');
        console.log('Generation request successful, waiting before status check...');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Checking initial status...');
        const statusResponse = await checkOutlineGenerationStatus();
        console.log('Status response:', statusResponse);
        
        if (!statusResponse?.data || statusResponse.data.status !== 'finished') {
          console.log('Starting polling...');
          startPolling();
        }
      } catch (error) {
        console.error('Failed to generate content plan:', error);
        message.error('Failed to generate content plan, please try again');
      } finally {
        isGenerating.value = false;
      }
    };

    const startPolling = () => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
      
      pollingInterval.value = setInterval(async () => {
        const response = await checkOutlineGenerationStatus()
        
        if (response?.data?.status === 'finished' || response?.data?.status === 'failed') {
          clearInterval(pollingInterval.value)
          pollingInterval.value = null
          
          if (response?.data?.status === 'finished') {
            await fetchContentPlans()
            hasGenerated.value = true
          } else {
            message.error('Content plan generation failed')
          }
        }
      }, 5000)
    }

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
      }
    });

    const handlePlanSelect = (plan, checked) => {
      plan.selected = checked
    }

    const confirmSelectedPlans = async () => {
      const selectedPlans = contentPlans.value.filter(plan => plan.selected)
      if (selectedPlans.length) {
        console.log('Selected plans:', selectedPlans)
        message.success('Content plans confirmed')
      }
    }

    const drawerVisible = ref(false)
    const selectedPlan = ref(null)

    const showPlanDetails = (plan) => {
      selectedPlan.value = plan
      drawerVisible.value = true
    }

    const closeDrawer = () => {
      drawerVisible.value = false
      selectedPlan.value = null
    }

    const getTotalWordCount = (plan) => {
      return plan.outline.reduce((total, section) => {
        return total + Number(section.wordCount)
      }, 0)
    }

    watch(currentStep, async (newStep) => {
      if (newStep === '0') {
        await Promise.all([
          fetchKeywords('keywords', currentPriority.value, 1, recommendedPagination.value.pageSize),
          fetchKeywords('top_page_keywords', currentPriority.value, 1, pagePagination.value.pageSize)
        ])
      } else if (newStep === '1') {
        contentPlans.value = []
        hasGenerated.value = false
        isGenerating.value = false
        
        await checkAndStartPolling()
      }
    })

    const checkAndStartPolling = async () => {
      if (pollingInterval.value) return
      
      try {
        const statusResponse = await checkOutlineGenerationStatus()
        
        if (!statusResponse?.data || statusResponse.data.status === 'processing') {
          startPolling()
        } else if (statusResponse.data.status === 'finished') {
          await fetchContentPlans()
        }
      } catch (error) {
        console.error('Failed to check outline status:', error)
        message.error('Failed to check outline status')
      }
    }

    const checkOutlineGenerationStatus = async () => {
      try {
        const response = await api.getAnalysisStatus('composite_generator')
        
        if (response?.code === 200 && response?.data) {
          outlineGenerationStatus.value = response.data.status
          taskStartTime.value = response.data.startTime
          taskEndTime.value = response.data.endTime
          taskDescription.value = formatTaskDescription(response.data.description)
          
          if (response.data.status === 'finished') {
            clearInterval(pollingInterval.value)
            hasGenerated.value = true
            await fetchContentPlans()
          } else if (response.data.status === 'failed') {
            clearInterval(pollingInterval.value)
            message.error('Content plan generation failed')
          }
        }
        return response
      } catch (error) {
        console.error('Failed to check outline generation status:', error)
        message.error('Failed to get outline generation status')
        return null
      }
    }

    const fetchContentPlans = async () => {
      if (isLoadingOutlines.value) return
      
      isLoadingOutlines.value = true
      try {
        const outlinesResponse = await api.getPlanningOutlines({
          status: contentPlanTab.value === 'selected' ? 'selected' : '',
          page: contentPlansPagination.value.current,
          limit: contentPlansPagination.value.pageSize
        })
        
        if (outlinesResponse?.data) {
          contentPlans.value = outlinesResponse.data.map(plan => ({
            ...plan,
            selected: false,
            favorited: plan.status === 'selected'
          }))
          contentPlansPagination.value.total = outlinesResponse.totalCount || 0
          hasGenerated.value = true
        }
      } catch (error) {
        console.error('Failed to fetch content plans:', error)
        message.error('Failed to get content plans')
      } finally {
        isLoadingOutlines.value = false
      }
    }

    const handleContentPlansPaginationChange = async (page, pageSize) => {
      contentPlansPagination.value.current = page
      contentPlansPagination.value.pageSize = pageSize
      await fetchContentPlans()
    }

    const outlineGenerationStatus = ref(null)

    const contentPlansPagination = ref({
      current: 1,
      pageSize: 12,
      total: 0
    })

    const handleFavorite = async (plan, event) => {
      try {
        if (plan.favorited) {
          await api.cancelPlanningOutlines([plan.outlineId]);
          plan.favorited = false;
          message.success('Removed from selection');
        } else {
          await api.selectPlanningOutlines([plan.outlineId]);
          plan.favorited = true;
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    const contentPlanTab = ref('all')

    const handleContentPlanTabChange = async (activeKey) => {
      contentPlanTab.value = activeKey
      contentPlansPagination.value.current = 1
      await fetchContentPlans()
    }

    const isLoadingOutlines = ref(false)

    const handleKeywordFavorite = async (keyword) => {
      try {
        if (keyword.favorited) {
          await api.cancelPlanningKeywords([keyword.id]);
          keyword.favorited = false;
          message.success('Removed from selection');
        } else {
          await api.selectPlanningKeywords([keyword.id]);
          keyword.favorited = true;
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    const handleModalTabChange = (activeKey) => {
      currentModalTab.value = activeKey
    }

    const showSelectedKeywords = async () => {
      showSelectedModal.value = true
      await fetchSelectedKeywords()
    }

    const isLoadingModalKeywords = ref(false)

    const handleCancelSelection = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        const sourceType = currentModalTab.value
        modalKeywords.value[sourceType] = modalKeywords.value[sourceType].filter(k => k.id !== keyword.id)
        message.success('Keyword deselected')
      } catch (error) {
        console.error('Failed to deselect keyword:', error)
        message.error('Failed to deselect keyword')
      }
    }

    const selectedKeywordsTab = ref('comparison')
    const selectedKeywordsData = ref({
      comparison: [],
      top_pages: []
    })
    const isLoadingSelectedKeywords = ref(false)

    watch(currentStep, async (newStep) => {
      if (newStep === '1') {
        await fetchSelectedKeywordsData()
      }
    })

    const fetchSelectedKeywordsData = async () => {
      isLoadingSelectedKeywords.value = true
      try {
        const [keywordsResponse, pageKeywordsResponse] = await Promise.all([
          api.getPlanningKeywords({
            source: 'keywords',
            status: 'selected',
            page: 1,
            limit: 100
          }),
          api.getPlanningKeywords({
            source: 'top_page_keywords',
            status: 'selected',
            page: 1,
            limit: 100
          })
        ])
        
        selectedKeywordsData.value = {
          comparison: (keywordsResponse?.data || []).map(transformKeywordData),
          top_pages: (pageKeywordsResponse?.data || []).map(transformKeywordData)
        }
      } catch (error) {
        console.error('Failed to get selected keywords:', error)
        message.error('Failed to get selected keywords')
      } finally {
        isLoadingSelectedKeywords.value = false
      }
    }

    const handleRemoveKeyword = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        const sourceType = selectedKeywordsTab.value
        selectedKeywordsData.value[sourceType] = selectedKeywordsData.value[sourceType].filter(k => k.id !== keyword.id)
        selectedKeywords.value = selectedKeywords.value.filter(k => k.id !== keyword.id)
        message.success('Keyword removed')
      } catch (error) {
        console.error('Failed to remove keyword:', error)
        message.error('Failed to remove keyword')
      }
    }

    const totalSelectedKeywords = computed(() => {
      return selectedKeywordsData.value.comparison.length + 
             selectedKeywordsData.value.top_pages.length
    })

    const handleDeleteOutline = async (plan) => {
      try {
        const confirmed = await new Promise(resolve => {
          Modal.confirm({
            title: 'Delete Outline',
            content: 'Are you sure you want to delete this outline? This action cannot be undone.',
            okText: 'Delete',
            cancelText: 'Cancel',
            okType: 'danger',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (confirmed) {
          await api.deletePlanningOutline(plan.outlineId);
          message.success('Outline deleted successfully');
          await fetchContentPlans();
        }
      } catch (error) {
        console.error('Failed to delete outline:', error);
        message.error('Failed to delete outline');
      }
    };

    const taskProgress = ref(null)
    const taskMessage = ref('')

    const getTaskStatusText = (status) => {
      const statusMap = {
        'processing': '🚀 AI is crafting your content plans...',
        'failed': '❌ Oops! Content plan generation failed',
        'not_started': '⏳ Getting ready to create your content plans',
        'finished': '✨ Content plans are ready!'
      }
      return statusMap[status] || 'Unknown Status'
    }

    const formatTaskDescription = (description) => {
      if (description?.includes('composite_generator')) {
        if (outlineGenerationStatus.value !== 'failed') {
          return "Our AI is analyzing your keywords and creating personalized content recommendations. This usually takes 1-2 minutes."
        }
        return description
      }
      return description
    }

    const getProgressStatus = (status) => {
      const statusMap = {
        'processing': 'active',
        'failed': 'exception',
        'finished': 'success',
        'not_started': 'normal'
      }
      return statusMap[status] || 'normal'
    }

    const clearAllOutlines = async () => {
      try {
        isLoadingOutlines.value = true
        
        for (const plan of contentPlans.value) {
          await api.deletePlanningOutline(plan.outlineId)
        }
        
        message.success('All outlines have been cleared')
        
        await checkOutlineGenerationStatus()
        await fetchContentPlans()

      } catch (error) {
        console.error('Failed to clear outlines:', error)
        message.error('Failed to clear outlines. Please try again.')
      } finally {
        isLoadingOutlines.value = false
      }
    }

    const confirmClearAllOutlines = () => {
      Modal.confirm({
        title: 'Clear All Outlines',
        content: 'Are you sure you want to delete all outlines? This action cannot be undone.',
        okText: 'Yes, Clear All',
        cancelText: 'Cancel',
        okType: 'danger',
        async onOk() {
          await clearAllOutlines()
        },
        okButtonProps: {
          danger: true
        },
        centered: true,
        maskClosable: false
      })
    }

    const isRefreshing = ref(false)

    const refreshContentPlans = async () => {
      isRefreshing.value = true
      try {
        const statusResponse = await checkOutlineGenerationStatus()
        
        if (statusResponse?.data?.status === 'processing') {
          startPolling()
        } else {
          await fetchContentPlans()
        }
        
        message.success('Content plans refreshed')
      } catch (error) {
        console.error('Failed to refresh content plans:', error)
        message.error('Failed to refresh content plans')
      } finally {
        isRefreshing.value = false
      }
    }

    const proceedToContentPlan = () => {
      handleModalClose();
      currentStep.value = '1';
    };

    const handlePublishOutlines = async () => {
      const selectedOutlines = contentPlans.value.filter(plan => plan.selected)
      if (!selectedOutlines.length) {
        message.warning('Please select at least one outline')
        return
      }

      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Start Page Generation',
          content: h('div', {}, [
            h('p', 'You are about to generate pages for the following outlines:'),
            h('ul', { style: 'margin-top: 8px; padding-left: 20px;' }, 
              selectedOutlines.map(outline => 
                h('li', { style: 'margin-bottom: 4px;' }, [
                  outline.title,
                  h('span', { style: 'color: #8c8c8c; margin-left: 8px;' }, 
                    `(${outline.pageType})`
                  )
                ])
              )
            ),
            h('p', { style: 'margin-top: 12px; color: #ff4d4f;' }, 
              'This action cannot be undone. Are you sure you want to continue?'
            )
          ]),
          okText: 'Generate Pages',
          cancelText: 'Cancel',
          width: 520,
          okButtonProps: {
            type: 'primary',
            danger: false
          },
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      try {
        generationProgressVisible.value = true;
        isGeneratingPages.value = true;
        generationProgress.value = 0;
        generationStatus.value = 'active';
        generationCompleted.value = false;
        generationFailed.value = false;

        const total = selectedOutlines.length;
        let completed = 0;

        for (const outline of selectedOutlines) {
          try {
            generationStatusText.value = `Generating page (${completed + 1}/${total})`
            generationDetails.value = `Processing: "${outline.title}"`
            
            await api.createAIPage(outline.outlineId)
            
            completed++;
            generationProgress.value = Math.floor((completed / total) * 100)
          } catch (error) {
            console.error('Failed to generate page:', error)
            message.error(`Failed to generate page: ${outline.title}`)
          }
        }

        generationCompleted.value = true;
        isGeneratingPages.value = false;
        generationStatus.value = 'success';
        generationStatusText.value = 'All pages generated successfully!';
        generationDetails.value = `Successfully generated ${completed}/${total} pages`;

        setTimeout(() => {
          generationProgressVisible.value = false;
          generationProgress.value = 0;
          generationCompleted.value = false;
          generationFailed.value = false;
        }, 3000);

      } catch (error) {
        console.error('Page generation process failed:', error)
        generationFailed.value = true
        isGeneratingPages.value = false
        generationStatus.value = 'exception'
        generationStatusText.value = 'Generation process failed'
        generationDetails.value = error.message || 'Unknown error'
      }
    }

    const generationProgressVisible = ref(false)
    const generationProgress = ref(0)
    const generationStatus = ref('active')
    const generationStatusText = ref('Preparing to generate pages...')
    const generationDetails = ref('')
    const isGeneratingPages = ref(false)
    const generationCompleted = ref(false)
    const generationFailed = ref(false)

    const allOutlinesSelected = computed(() => {
      return contentPlans.value.length > 0 && 
             contentPlans.value.every(plan => plan.selected)
    })

    const someOutlinesSelected = computed(() => {
      return contentPlans.value.some(plan => plan.selected) && 
             !allOutlinesSelected.value
    })

    const selectedOutlinesCount = computed(() => {
      return contentPlans.value.filter(plan => plan.selected).length
    })

    const handleSelectAllOutlines = (e) => {
      const checked = e.target.checked
      contentPlans.value.forEach(plan => {
        plan.selected = checked
      })
    }

    const handleOutlineSelect = (plan, checked) => {
      plan.selected = checked
    }

    const comparisonColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '25%'
      },
      {
        title: 'KRS',
        dataIndex: 'krs',
        key: 'krs',
        width: '15%'
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        width: '15%'
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        width: '15%'
      },
      {
        title: 'Related Outlines',
        key: 'relatedOutlines',
        width: '20%',
        customRender: () => '-'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '10%',
        slots: {
          customRender: 'actions'
        }
      }
    ]

    const getTypeColor = (type) => {
      const typeColors = {
        'Blog': 'blue',
        'Landing Page': 'green',
      }
      return typeColors[type] || 'default'
    }

    const activeCollapseKeys = ref([])

    const bannerTheme = {
      primary: '#2563EB',
      secondary: '#0EA5E9',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
      textColor: '#FFFFFF',
      descriptionColor: '#E2E8F0',
      badgeColor: '#94A3B8',
      badgeBackground: 'rgba(255, 255, 255, 0.08)',
      badgeHoverBackground: 'rgba(37, 99, 235, 0.15)',
      badgeHoverColor: '#60A5FA',
      iconBackground: 'rgba(37, 99, 235, 0.15)',
    }

    return {
      showSelectedKeywords,
      currentMode,
      selectedKeywords,
      overviewData,
      clearSelection,
      overviewStats: ref(overviewStats),
      priorities,
      recommendedKeywords,
      pageKeywords: ref(pageKeywords),
      savedPresets: ref(savedPresets),
      columns,
      competitorColumns: computed(() => competitorColumns),
      rowSelection,
      pagination,
      handleTableChange,
      currentPreset,
      saveModalVisible,
      newPresetName,
      savedPresets,
      handlePresetChange,
      showSaveModal,
      saveCurrentPreset,
      currentStep,
      nextStep,
      previousStep,
      showSelectedModal,
      showSelectedKeywords,
      handleModalClose,
      getKeywordsByPriority,
      isGenerating,
      isGeneratingTitles,
      isGeneratingOutline,
      hasGenerated,
      filteredKeywords,
      getRankClass,
      handleKeywordSelect,
      addFilter,
      removeFilter,
      filters,
      clearFilters,
      analysisStatus,
      loading,
      analysisState,
      taskInfo,
      currentTasks,
      getProgressPercent,
      formatTime,
      domainConfigured,
      recommendedPagination,
      pagePagination,
      handleComparisonPaginationChange,
      handleTopPagesPaginationChange,
      currentPriority,
      handleTabChange,
      contentPlans,
      selectedPlansCount,
      generateContentPlan,
      handlePlanSelect,
      confirmSelectedPlans,
      canProceedToNext,
      drawerVisible,
      selectedPlan,
      showPlanDetails,
      closeDrawer,
      getTotalWordCount,
      checkOutlineGenerationStatus,
      outlineGenerationStatus,
      contentPlansPagination,
      handleContentPlansPaginationChange,
      handleFavorite,
      contentPlanTab,
      handleContentPlanTabChange,
      isLoadingOutlines,
      handleKeywordFavorite,
      modalKeywords,
      isLoadingModalKeywords,
      modalTabs,
      currentModalTab,
      handleModalTabChange,
      handleCancelSelection,
      selectedKeywordsTab,
      selectedKeywordsData,
      isLoadingSelectedKeywords,
      handleRemoveKeyword,
      totalSelectedKeywords,
      handleDeleteOutline,
      taskProgress,
      taskMessage,
      getTaskStatusText,
      getProgressStatus,
      taskStartTime,
      taskEndTime,
      taskDescription,
      formatTaskDescription,
      confirmClearAllOutlines,
      pollingInterval,
      refreshContentPlans,
      isRefreshing,
      proceedToContentPlan,
      handlePublishOutlines,
      generationProgressVisible,
      generationProgress,
      generationStatus,
      generationStatusText,
      generationDetails,
      isGeneratingPages,
      generationCompleted,
      generationFailed,
      allOutlinesSelected,
      someOutlinesSelected,
      selectedOutlinesCount,
      handleSelectAllOutlines,
      handleOutlineSelect,
      currentPagePriority,
      handlePageTabChange,
      comparisonColumns,
      getTypeColor,
      activeCollapseKeys,
      bannerTheme,
    }
  }
})
</script>

<style scoped>
.planning-layout {
  display: flex;
  gap: 24px;
  height: 100%;
  margin-top: 24px;
}

.steps-navigation {
  flex: 0 0 200px;
  padding: 24px 0;
}

.step-item {
  position: relative;
  padding: 12px;
  cursor: pointer;
}

.step-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: white;
  transition: all 0.3s;
  border: 1px solid #e5e7eb;
}

.step-item.active .step-content {
  background: #f0f7ff;
  border: 1px solid #2563eb;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.step-info {
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
  font-size: 14px;
}

.step-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.3;
}

.step-connector {
  position: absolute;
  left: 35px;
  top: 64px;
  bottom: 0;
  width: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.connector-line {
  flex: 1;
  width: 2px;
  background: #e5e7eb;
}

.connector-arrow {
  width: 12px;
  height: 12px;
  border-right: 2px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb;
  transform: rotate(45deg);
  margin-bottom: -6px;
}

.step-item.active .connector-line,
.step-item.active .connector-arrow {
  background: #2563eb;
  border-color: #2563eb;
}

.main-content {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.content-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.content-toolbar {
  justify-content: flex-start;
}

.step-panel[v-show="currentStep === '0'"] .content-toolbar {
  justify-content: flex-start;
}

.step-panel[v-show="currentStep === '1'"] .content-toolbar {
  justify-content: flex-start;
}

.mode-switch :deep(.ant-radio-button-wrapper) {
  background: #f0f7ff;
  border-color: #2563eb;
  color: #2563eb;
}

.mode-switch :deep(.ant-radio-button-wrapper:hover) {
  color: #1d4ed8;
  background: #e6f0ff;
}

.mode-switch :deep(.ant-radio-button-wrapper-checked) {
  background: #2563eb !important;
  border-color: #2563eb !important;
  color: white !important;
  box-shadow: -1px 0 0 0 #2563eb;
}

.mode-switch :deep(.ant-radio-button-wrapper-checked:hover) {
  background: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
}

.view-selected-btn {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  border: none;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  height: 32px;
  padding: 0 16px;
}

.view-selected-btn:hover {
  background: linear-gradient(to right, #1d4ed8, #2563eb);
  border: none;
}

.step-panel {
  height: 100%;
}
</style>



