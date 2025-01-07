<template>
  <page-layout
    title="Keywords Analysis & Planning"
    description="Analyze competitors and plan your SEO keywords"
    icon="📊"
  >
    <!-- Domain not configured notice -->
    <template v-if="!domainConfigured">
      <div class="domain-container">
        <a-spin :spinning="loading">
          <div class="domain-notice">
            <div class="notice-content" v-show="!loading">
              <exclamation-circle-outlined class="notice-icon" />
              <h2>No Site Configured</h2>
              <p>Please configure your domain in settings to use the keyword planning features</p>
              <a-button type="primary" @click="goToDashboard">
                Configure Domain
              </a-button>
            </div>
          </div>
        </a-spin>
      </div>
    </template>

    <template v-else>
      <a-row justify="center" class="funnel-container">
        <!-- 第一层：关键词研究 - 分成左右两个数据源 -->
        <a-col :span="24">
          <div class="funnel-level-1">
            <!-- 数据源切换 -->
            <div class="source-tabs">
              <div 
                class="source-tab"
                :class="{ active: activeSource === 'keywords' }"
                @click="activeSource = 'keywords'"
              >
                <div class="tab-icon">🔍</div>
                <div class="tab-content">
                  <h3>Keywords Analysis</h3>
                  <p>Analyze competitor keywords</p>
                </div>
              </div>
              <div 
                class="source-tab"
                :class="{ active: activeSource === 'pages' }"
                @click="activeSource = 'pages'"
              >
                <div class="tab-icon">📄</div>
                <div class="tab-content">
                  <h3>Top Pages Analysis</h3>
                  <p>Extract keywords from top pages</p>
                </div>
              </div>
            </div>

            <!-- 内容区域 -->
            <div class="source-content">
              <!-- 添加模式切换到内容区域顶部 -->
              <div class="mode-switch-container">
                <div class="mode-switch">
                  <span class="mode-label" :class="{ active: !expertMode }">Basic</span>
                  <a-switch
                    v-model:checked="expertMode"
                    size="small"
                    class="custom-switch"
                  />
                  <span class="mode-label" :class="{ active: expertMode }">Expert</span>
                </div>
              </div>

              <transition name="fade" mode="out-in">
                <!-- Keywords Analysis Content -->
                <div v-if="activeSource === 'keywords'" key="keywords">
                  <!-- 关键词分析总览 -->
                  <a-card class="analysis-overview" :bodyStyle="{ padding: '12px' }">
                    <template #title>
                      <div class="card-header">
                        <span class="card-title">Keywords Analysis Overview</span>
                        <a-tag color="blue">{{ totalAnalyzedKeywords }} Keywords Analyzed</a-tag>
                      </div>
                    </template>
                    
                    <!-- 分类统计 -->
                    <div class="keywords-stats">
                      <a-row :gutter="[8, 8]">
                        <a-col :span="4" v-for="stat in keywordStats" :key="stat.type">
                          <a-statistic
                            :title="stat.label"
                            :value="stat.count"
                            :valueStyle="{ color: stat.color }"
                          />
                        </a-col>
                      </a-row>
                    </div>
                  </a-card>

                  <!-- 推荐关键词列表 -->
                  <a-card class="recommended-keywords" style="margin-top: 12px" :bodyStyle="{ padding: '12px' }">
                    <template #title>
                      <div class="card-header">
                        <span class="card-title">Recommended Keywords</span>
                        <a-tag color="blue">Priority Sorted by KRS Score</a-tag>
                      </div>
                    </template>

                    <a-table
                      :columns="keywordColumns"
                      :dataSource="mockKeywordsData"
                      :pagination="{ pageSize: 10, size: 'small' }"
                      :loading="loading"
                      size="small"
                    >
                      <!-- KRS Score Column -->
                      <template #krsScore="{ text }">
                        <div class="krs-score">
                          <a-progress
                            :percent="text"
                            :showInfo="false"
                            :strokeColor="getKRSColor(text)"
                            size="small"
                            :strokeWidth="4"
                          />
                          <span class="score-text">{{ text }}</span>
                        </div>
                      </template>

                      <!-- Volume Column -->
                      <template #searchVolume="{ text }">
                        {{ formatNumber(text) }}
                      </template>

                      <!-- KD Column -->
                      <template #keywordDifficulty="{ text }">
                        <a-tag :color="getKDColor(text)">
                          {{ text }}
                        </a-tag>
                      </template>

                      <!-- CPC Column -->
                      <template #cpcValue="{ text }">
                        ${{ text.toFixed(2) }}
                      </template>
                    </a-table>
                  </a-card>

                  <!-- 专家模式详情 -->
                  <a-card v-if="expertMode" class="category-details" style="margin-top: 12px">
                    <template #title>
                      <div class="category-header">
                        <a-radio-group 
                          v-model:value="selectedCategory" 
                          size="small"
                          class="category-radio-group"
                        >
                          <a-radio-button 
                            v-for="(cat, key) in categoryDetails" 
                            :key="key" 
                            :value="key"
                            class="category-radio"
                          >
                            <div class="radio-content">
                              <span class="radio-label">{{ cat.name }}</span>
                              <span class="radio-count">({{ cat.count }})</span>
                            </div>
                          </a-radio-button>
                        </a-radio-group>
                        <div class="category-stats">
                          <span>Avg KD: {{ currentCategory.avgKD }}</span>
                          <span>Avg Volume: {{ formatNumber(currentCategory.avgVolume) }}</span>
                        </div>
                      </div>
                    </template>

                    <!-- 高级筛选 -->
                    <div class="advanced-filters">
                      <div class="filter-group">
                        <span class="filter-label">KD Range:</span>
                        <a-slider
                          v-model:value="kdRange"
                          range
                          :max="100"
                          size="small"
                          style="width: 200px"
                        />
                      </div>
                      <div class="filter-group">
                        <span class="filter-label">Min Volume:</span>
                        <a-input-number
                          v-model:value="minVolume"
                          size="small"
                          style="width: 100px"
                        />
                      </div>
                      <a-button type="primary" size="small" @click="applyFilters">
                        Apply Filters
                      </a-button>
                    </div>

                    <!-- 关键词表格 -->
                    <a-table
                      :columns="categoryColumns"
                      :dataSource="filteredCategoryKeywords"
                      size="small"
                      :pagination="{ pageSize: 10, size: 'small' }"
                      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    >
                      <!-- KD Column -->
                      <template #keywordDifficulty="{ text }">
                        <a-tag :color="getKDColor(text)">
                          {{ text }}
                        </a-tag>
                      </template>

                      <!-- Volume Column -->
                      <template #searchVolume="{ text }">
                        {{ formatNumber(text) }}
                      </template>

                      <!-- KRS Score Column -->
                      <template #krsScore="{ text }">
                        <div class="krs-score">
                          <a-progress
                            :percent="text"
                            :showInfo="false"
                            :strokeColor="getKRSColor(text)"
                            size="small"
                            :strokeWidth="4"
                          />
                          <span class="score-text">{{ text }}</span>
                        </div>
                      </template>

                      <!-- CPC Column -->
                      <template #cpcValue="{ text }">
                        ${{ text.toFixed(2) }}
                      </template>
                    </a-table>
                  </a-card>
                </div>

                <!-- Pages Analysis Content -->
                <div v-else key="pages">
                  <div class="coming-soon">
                    <a-empty description="Pages analysis coming soon..." />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </a-col>

        <!-- 漏斗连接器 -->
        <a-col :span="24" class="funnel-connector">
          <div class="funnel-shape">
            <div class="funnel-line left">
              <div class="funnel-gradient"></div>
            </div>
            <div class="funnel-stats">
              <div class="stats-content">
                <arrow-down-outlined class="stats-icon" />
                <a-tag color="blue">0% Selected</a-tag>
                <div class="stats-detail">0 / 0</div>
              </div>
            </div>
            <div class="funnel-line right">
              <div class="funnel-gradient"></div>
            </div>
          </div>
        </a-col>

        <!-- 第二层：内容规划 - 调整宽度 -->
        <a-col :span="22">
          <a-card class="funnel-level-2">
            <div class="level-header">
              <div class="level-title">
                <h2>Content Generation Planning</h2>
              </div>
              <div class="level-actions">
                <a-space>
                  <a-button 
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="handleSubmitTasks"
                  >
                    Batch Create ({{ selectedRowKeys.length }})
                  </a-button>
                  <a-radio-group v-model:value="planningView" size="small">
                    <a-radio-button value="list">List</a-radio-button>
                    <a-radio-button value="calendar">Calendar</a-radio-button>
                  </a-radio-group>
                </a-space>
              </div>
            </div>

            <!-- 视图切换 -->
            <transition name="fade" mode="out-in">
              <!-- 列表视图 -->
              <div v-if="planningView === 'list'" key="list" class="table-container">
                <a-table
                  :dataSource="firstArticlesData"
                  :columns="columns"
                  :rowKey="record => record.id || record.Title"
                  :pagination="false"
                  :row-selection="rowSelection"
                  :scroll="{ x: 'max-content' }"
                >
                  <template #taskStatus="{ record }">
                    <a-tag :color="getTaskStatusColor(record.taskStatus)">
                      {{ getTaskStatusLabel(record.taskStatus) }}
                    </a-tag>
                  </template>
                  <template #dates="{ record }">
                    <div class="date-info">
                      <div class="date-row">
                        Writing: 
                        <span class="recommended-date">{{ formatDate(getRecommendedDates(record).writeDate) }}</span>
                      </div>
                      <div class="date-row">
                        Publishing: 
                        <span class="recommended-date">{{ formatDate(getRecommendedDates(record).publishDate) }}</span>
                      </div>
                    </div>
                  </template>
                  <template #action="{ record }">
                    <a-space>
                      <a-button 
                        type="primary" 
                        size="small"
                        :disabled="record.taskStatus === 'has_task'"
                        @click="handleGenerate(record)"
                      >
                        Generate
                      </a-button>
                      <a-button 
                        type="primary" 
                        size="small"
                        :disabled="record.taskStatus !== 'has_task'"
                        @click="handlePublish(record)"
                      >
                        Go Publish
                      </a-button>
                    </a-space>
                  </template>
                </a-table>
              </div>

              <!-- 日历视图 -->
              <div v-else key="calendar" class="calendar-view">
                <a-calendar>
                  <template #dateFullCellRender="{ current }">
                    <div class="calendar-cell">
                      <div class="cell-date">{{ current.date() }}</div>
                      <div class="cell-content">
                        <template v-for="task in getTasksByDate(current)" :key="task.id">
                          <div 
                            class="task-item"
                            :class="[
                              `status-${task.taskStatus}`,
                              { 'is-write-date': isWriteDate(current, task) }
                            ]"
                            @click.stop="showTaskDetails(current)"
                          >
                            <div class="task-header">
                              <template v-if="isWriteDate(current, task)">
                                <a-checkbox
                                  :value="task.Title"
                                  :checked="selectedRowKeys.includes(task.Title)"
                                  @click.stop
                                  @change="(e) => handleCalendarTaskSelect(e, task)"
                                />
                              </template>
                              <template v-else>
                                <div style="width: 16px;"></div>
                              </template>
                              <div class="task-title">{{ task.Title }}</div>
                            </div>
                            <div class="task-meta">
                              <a-tag size="small">{{ task.Category }}</a-tag>
                              <span class="task-type" :class="{ 'publishing': !isWriteDate(current, task) }">
                                {{ isWriteDate(current, task) ? 'Writing' : 'Publishing' }}
                              </span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </a-calendar>
              </div>
            </transition>
          </a-card>
        </a-col>
      </a-row>

      <!-- 保持所有现有的 modals -->
      <keyword-analysis-modal
        :open="analysisModalVisible"
        :loading="analysisLoading"
        :analysis-type="comparisonType === 'missing' ? 'missing' : 'common'"
        @update:open="analysisModalVisible = $event"
      />

      <!-- Task Preview Modal -->
      <a-modal
        v-model:open="taskPreviewVisible"
        title="Create Page Generation Tasks"
        width="800px"
        class="task-preview-modal"
        @cancel="cancelTaskPreview"
      >
        <template #default>
          <div v-if="selectedRows?.length" class="task-preview-content">
            <a-form layout="vertical">
              <!-- 任务名称 -->
              <a-form-item 
                label="Task Name" 
                :validateStatus="!taskNames[currentTaskIndex] ? 'error' : ''"
                :help="!taskNames[currentTaskIndex] ? 'Task name is required' : ''"
              >
                <a-input
                  v-model:value="taskNames[currentTaskIndex]"
                  placeholder="Please enter task name"
                  size="large"
                  :maxLength="100"
                  show-count
                />
              </a-form-item>

              <!-- 文章类型和语言选择并排显示 -->
              <div class="form-row">
                <!-- 文章类型 -->
                <a-form-item label="Article Type" class="form-col">
                  <a-tag :color="selectedRows[currentTaskIndex].Category === 'Blog' ? '#10B981' : '#3B82F6'">
                    {{ selectedRows[currentTaskIndex].Category }}
                  </a-tag>
                </a-form-item>

                <!-- 语言选择 -->
                <a-form-item label="Language" class="form-col">
                  <a-checkbox-group v-model:value="selectedLanguages" :options="languageOptions" />
                </a-form-item>
              </div>

              <!-- 关键词 -->
              <a-form-item label="Target Keywords">
                <div class="keywords-container">
                  <a-tag 
                    v-for="keyword in selectedRows[currentTaskIndex].Keywords?.split(',')"
                    :key="keyword"
                    class="keyword-tag"
                  >
                    {{ keyword.trim() }}
                  </a-tag>
                </div>
              </a-form-item>
            </a-form>

            <!-- 任务导航 -->
            <div class="task-navigation">
              <a-button 
                @click="prevTask" 
                :disabled="currentTaskIndex === 0"
                type="text"
              >
                <LeftOutlined />
              </a-button>
              <span class="task-counter">{{ currentTaskIndex + 1 }} / {{ selectedRows.length }}</span>
              <a-button 
                @click="nextTask" 
                :disabled="currentTaskIndex === selectedRows.length - 1"
                type="text"
              >
                <RightOutlined />
              </a-button>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="modal-footer">
            <a-button @click="cancelTaskPreview">Cancel</a-button>
            <a-button 
              type="primary" 
              @click="startBatchSubmit"
              :disabled="!taskNames[currentTaskIndex]"
            >
              <span class="submit-button-content">
                <span>Create Now</span>
              </span>
            </a-button>
          </div>
        </template>
      </a-modal>

      <!-- Progress Modal -->
      <a-modal
        v-model:open="progressVisible"
        :footer="null"
        :closable="false"
      >
        <a-space direction="vertical" align="center" style="width: 100%">
          <LoadingOutlined spin />
          <div>Creating AI Tasks</div>
          <div>Processing task {{ currentTaskIndex + 1 }} of {{ selectedRows.length }}</div>
        </a-space>
      </a-modal>

      <!-- 任务详情抽屉 -->
      <a-drawer
        v-model:open="taskDrawerVisible"
        :title="selectedDate ? `Tasks for ${formatDate(selectedDate)}` : 'Tasks'"
        placement="right"
        width="400"
      >
        <template v-if="selectedDate && currentDateTasks.length">
          <div class="task-list">
            <div v-for="task in currentDateTasks" :key="task.Title" class="task-detail-item">
              <div class="task-detail-header">
                <span class="task-detail-title">{{ task.Title }}</span>
                <a-tag :color="isWriteDate(selectedDate, task) ? 'blue' : 'cyan'">
                  {{ isWriteDate(selectedDate, task) ? 'Writing Task' : 'Publishing Task' }}
                </a-tag>
              </div>
              <div class="task-detail-content">
                <div class="task-detail-row">
                  <span class="label">Category:</span>
                  <span class="value">{{ task.Category }}</span>
                </div>
                <div class="task-detail-row">
                  <span class="label">Keywords:</span>
                  <div class="keywords-list">
                    <a-tag 
                      v-for="keyword in task.Keywords?.split(',')"
                      :key="keyword"
                      color="blue"
                    >
                      {{ keyword.trim() }}
                    </a-tag>
                  </div>
                </div>
                <div class="task-detail-row">
                  <span class="label">Task Status:</span>
                  <span class="value">
                    <a-tag :color="task.taskStatus === 'has_task' ? 'success' : 'warning'">
                      {{ task.taskStatus === 'has_task' ? 'Created' : 'Not Created' }}
                    </a-tag>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <a-empty description="No tasks for this date" />
        </template>
      </a-drawer>
    </template>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { 
  RobotOutlined,
  LeftOutlined,
  RightOutlined,
  LoadingOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/api'
import PageLayout from './layout/PageLayout.vue'
import testingTenTitles from '../assets/data/ai-keywords-planning/testing-ten-titles.json'
import dayjs from 'dayjs'
import mockData from '../assets/data/ai-keywords-planning/mock-keywords-data.json'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  
  components: {
    PageLayout,
    RobotOutlined,
    LeftOutlined,
    RightOutlined,
    LoadingOutlined,
    ArrowDownOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    PlusOutlined
  },

  setup() {
    const router = useRouter()
    const domainConfigured = ref(false)
    const loading = ref(true)
    
    // 基础状态
    const activeTabKey = ref('analysis')
    const comparisonType = ref('common')
    const keywordsData = ref([])
    const selectedCompetitor = ref(null)
    const productInfo = ref(null)
    const analysisModalVisible = ref(false)
    const analysisLoading = ref(false)
    const firstArticlesData = ref(testingTenTitles)
    
    // 任务相关状态
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const taskPreviewVisible = ref(false)
    const progressVisible = ref(false)
    const currentTaskIndex = ref(0)
    const taskNames = ref([])
    const batchData = ref([])
    const selectedLanguages = ref(['en']) // 修改为只默认英文

    const languageOptions = [
      { label: 'English', value: 'en', disabled: true } // 移除中文选项
    ]

    // 分页状态
    const paginationStates = ref({
      all: { current: 1, pageSize: 10, total: 0 },
      common: { current: 1, pageSize: 10, total: 0 },
      missing: { current: 1, pageSize: 10, total: 0 },
      strong: { current: 1, pageSize: 10, total: 0 },
      undeveloped: { current: 1, pageSize: 10, total: 0 },
      unique: { current: 1, pageSize: 10, total: 0 },
      weak: { current: 1, pageSize: 10, total: 0 }
    })

    const initializeData = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getProductsByCustomerId(customerId)
        
        if (response?.code === 200) {
          domainConfigured.value = response.data?.domainStatus || false
          productInfo.value = response.data
          
          if (domainConfigured.value) {
            fetchKeywordsData('common', 1)
            fetchTaskList()
          }
        } else {
          domainConfigured.value = false
        }
      } catch (error) {
        console.error('Failed to fetch product info:', error)
        domainConfigured.value = false
        message.error('Failed to load product info')
      } finally {
        loading.value = false
      }
    }

    // Add navigation to settings
    const goToDashboard = () => {
      router.push('/dashboard')
    }

    // 修改 onMounted
    onMounted(() => {
      initializeData()
    })

    // 计算属性
    const competitors = computed(() => {
      if (!productInfo.value?.competeProduct) return []
      return productInfo.value.competeProduct.split(',').map(item => {
        const [name, url] = item.split('|')
        return { id: url, name }
      })
    })

    const currentPagination = computed(() => {
      return paginationStates.value[comparisonType.value]
    })

    const rowSelection = computed(() => ({
      selectedRowKeys: selectedRowKeys.value,
      onChange: (newSelectedRowKeys, newSelectedRows) => {
        selectedRowKeys.value = newSelectedRowKeys
        selectedRows.value = newSelectedRows
      }
    }))

    // 表格列定义
    const columns = [
      {
        title: 'No.',
        dataIndex: 'No',
        width: 60,
        align: 'center',
        customRender: ({ index }) => index + 1
      },
      {
        title: 'Keywords',
        dataIndex: 'Keywords',
        key: 'keywords',
        slots: { customRender: 'keywords' },
        width: '280px'
      },
      {
        title: 'Task Status',
        key: 'taskStatus',
        width: 120,
        slots: { customRender: 'taskStatus' }
      },
      {
        title: 'Category',
        dataIndex: 'Category',
        width: 100,
        filters: [...new Set(testingTenTitles.map(item => item.Category))].map(category => ({
          text: category,
          value: category,
        })),
        onFilter: (value, record) => record.Category === value
      },
      {
        title: 'Title',
        dataIndex: 'Title',
        ellipsis: true
      },
      {
        title: 'Recommended Dates',
        key: 'dates',
        width: 200,
        fixed: 'right',
        slots: { customRender: 'dates' }
      },
      {
        title: 'Action',
        key: 'action',
        width: 140,
        fixed: 'right',
        slots: { customRender: 'action' }
      }
    ]

    const comparisonTypes = [
      { key: 'common', label: 'Common Keywords' },
      { key: 'missing', label: 'Missing Keywords' },
      { key: 'all', label: 'All Keywords' },
      { key: 'unique', label: 'Unique Keywords' },
      { key: 'undeveloped', label: 'Undeveloped Keywords' },
      { key: 'weak', label: 'Weak Rankings' },
      { key: 'strong', label: 'Strong Rankings' }
    ]

    // 方法定义
    const getCompetitorName = (competitorId) => {
      const competitor = competitors.value.find(comp => comp.id === competitorId)
      return competitor?.name || ''
    }

    const fetchKeywordsData = async (type, page = 1) => {
      
    }

    const handleTableChange = (pagination) => {
      paginationStates.value[comparisonType.value].current = pagination.current
      fetchKeywordsData(comparisonType.value, pagination.current)
    }

    const handleTypeChange = (type) => {
      comparisonType.value = type
      if (paginationStates.value[type].current === 1 && !keywordsData.value.length) {
        fetchKeywordsData(type, 1)
      } else {
        fetchKeywordsData(type, paginationStates.value[type].current)
      }
    }

    const handleAIAnalyze = () => {
      if (!['common', 'missing'].includes(comparisonType.value)) {
        message.warning('AI Analysis is only available for Common Keywords and Missing Keywords')
        return
      }
      analysisModalVisible.value = true
      analysisLoading.value = true
      setTimeout(() => {
        analysisLoading.value = false
      }, 2000)
    }

    const handleSubmitTasks = () => {
      if (!selectedRows.value?.length) {
        message.warning('Please select at least one task')
        return
      }
      taskNames.value = selectedRows.value.map(task => 
        `${task.Title}-${new Date().toLocaleString()}`
      )
      currentTaskIndex.value = 0
      taskPreviewVisible.value = true
    }

    const prevTask = () => {
      if (currentTaskIndex.value > 0) {
        currentTaskIndex.value--
      }
    }

    const nextTask = () => {
      if (currentTaskIndex.value < selectedRows.value.length - 1) {
        currentTaskIndex.value++
      }
    }

    const cancelTaskPreview = () => {
      taskPreviewVisible.value = false
      currentTaskIndex.value = 0
    }

    const startBatchSubmit = async () => {
      if (!taskNames.value[currentTaskIndex.value]) {
        message.error('Please enter a task name')
        return
      }

      taskPreviewVisible.value = false
      progressVisible.value = true
      currentTaskIndex.value = 0

      try {
        for (let i = 0; i < selectedRows.value.length; i++) {
          const task = selectedRows.value[i]
          currentTaskIndex.value = i

          const response = await apiClient.createAIPage({
            pageType: task.Category,
            author: '',
            coverImage: '',
            customerId: localStorage.getItem('currentCustomerId'),
            description: '',
            language: selectedLanguages.value[0],
            numberOfWords: 2500,
            publishURL: '',
            relatedKeyword: task.Keywords,
            subTitle: '',
            title: task.Title,
            topic: task.Title
          })

          if (!response || response.code !== 200) {
            throw new Error(response?.message || `Failed to create the ${i + 1}th task`)
          }
        }

        message.success(`Successfully created ${selectedRows.value.length} tasks`)
        await fetchTaskList()
        
        // 添加跳转逻辑
        router.push('/task-management')
        
      } catch (error) {
        message.error(`Task creation failed: ${error.message}`)
      } finally {
        selectedRows.value = []
        selectedRowKeys.value = []
        progressVisible.value = false
      }
    }

    const getTaskStatusColor = (status) => status === 'has_task' ? '#10B981' : '#F43F5E'
    const getTaskStatusLabel = (status) => status === 'has_task' ? 'Task Created' : 'No Task'

    // 监听数据变化
    watchEffect(() => {
      if (batchData.value) {
        // 处理相关逻辑
      }
    })

    const fetchTaskList = async () => {
      try {
        const userId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getPages({
          customerId: userId,
          page: 1, 
          limit: 100
        })
        
        if (response?.code === 200 && response?.data) {
          // 获取任务列表后更新文章状态
          updateArticlesTaskStatus(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch task list:', error)
      }
    }

    const updateArticlesTaskStatus = (taskList) => {
      firstArticlesData.value = firstArticlesData.value.map(article => {
        const hasTask = taskList.some(task => task.title === article.Title)
        return {
          ...article,
          taskStatus: hasTask ? 'has_task' : 'no_task'
        }
      })
    }

    // 新增状态
    const totalKeywords = ref(0)
    const selectedKeywords = ref(0)
    const plannedContent = ref(0)

    // 计算转化率
    const conversionRate = computed(() => {
      if (!totalKeywords.value) return 0
      return Math.round((selectedKeywords.value / totalKeywords.value) * 100)
    })

    // 处理关键词选择变化
    const handleSelectionChange = (selection) => {
      selectedKeywords.value = selection.length
    }

    // 监听数据变化
    watch(() => keywordsData.value, (newData) => {
      totalKeywords.value = newData.length
    })

    watch(() => firstArticlesData.value, (newData) => {
      plannedContent.value = newData.filter(item => item.taskStatus === 'has_task').length
    })

    const activeSource = ref('keywords')
    const analyzedPages = ref(0)
    const extractedKeywords = ref(0)
    const keywordsCount = ref(0)
    const pagesCount = ref(0)

    // 监听数据源变化
    watch(activeSource, (newSource) => {
      // 根据数据源切换加载相应数据
    })

    // 新增状态
    const planningView = ref('list')
    const taskDates = ref(new Map()) // 存储任务日期

    // 初始化任务日期
    const initializeTaskDates = () => {
      const currentDate = new Date()
      firstArticlesData.value.forEach((task, index) => {
        // 每天安排2-3个任务
        const writeDate = new Date(currentDate)
        writeDate.setDate(currentDate.getDate() + Math.floor(index / 2))
        
        const publishDate = new Date(writeDate)
        publishDate.setDate(writeDate.getDate() + 3)
        
        taskDates.value.set(task.Title, {
          writeDate: writeDate,
          publishDate: publishDate
        })
      })
    }

    // 获取指定日期的任务
    const getTasksByDate = (date) => {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      return firstArticlesData.value.filter(task => {
        const taskDate = taskDates.value.get(task.Title)
        if (!taskDate) return false
        
        const writeDate = dayjs(taskDate.writeDate).format('YYYY-MM-DD')
        const publishDate = dayjs(taskDate.publishDate).format('YYYY-MM-DD')
        
        return formattedDate === writeDate || formattedDate === publishDate
      })
    }

    // 判断是否为写作日期
    const isWriteDate = (date, task) => {
      const taskDate = taskDates.value.get(task.Title)
      if (!taskDate) return false
      
      const currentDate = dayjs(date).format('YYYY-MM-DD')
      const writeDate = dayjs(taskDate.writeDate).format('YYYY-MM-DD')
      
      return currentDate === writeDate
    }

    // 日期比较辅助函数
    const isSameDay = (date1, date2) => {
      const d1 = dayjs.isDayjs(date1) ? date1 : dayjs(date1)
      const d2 = dayjs(date2)
      
      return d1.isSame(d2, 'day')
    }

    // 简化显示任务详情方法
    const showTaskDetails = (date) => {
      selectedDate.value = date
      taskDrawerVisible.value = true
    }

    // 监听数据变化，初始化日期
    watch(() => firstArticlesData.value, () => {
      initializeTaskDates()
    }, { immediate: true })

    const taskDrawerVisible = ref(false)
    const selectedDate = ref(null)
    const currentDateTasks = computed(() => {
      if (!selectedDate.value) return []
      return getTasksByDate(selectedDate.value)
    })

    // 格式化日期
    const formatDate = (date) => {
      if (!date) return 'Not set'  // 改为英文
      return dayjs(date).format('YYYY-MM-DD')
    }

    // 获取任务日期
    const getTaskDates = (task) => {
      return taskDates.value.get(task.Title) || {}
    }

    // 获取推荐日期
    const getRecommendedDates = (task) => {
      // 这里可以根据实际需求调整推荐日期的计算逻辑
      const writeDate = dayjs('2025-01-02')
      const publishDate = dayjs('2025-01-05')
      
      return {
        writeDate: writeDate,
        publishDate: publishDate
      }
    }

    // 修改处理生成操作的方法
    const handleGenerate = (record) => {
      // 设置选中的行
      selectedRows.value = [record]
      currentTaskIndex.value = 0
      
      // 设置任务名称
      taskNames.value = [
        `${record.Title}-${new Date().toLocaleString()}`
      ]
      
      // 显示任务预览弹窗
      taskPreviewVisible.value = true
    }

    // 处理发布操作
    const handlePublish = (record) => {
      // 处理发布逻辑
      console.log('Publish:', record)
    }

    // 添加日历视图任务选择处理方法
    const handleCalendarTaskSelect = (e, task) => {
      const checked = e.target.checked;
      if (checked) {
        selectedRowKeys.value = [...selectedRowKeys.value, task.Title];
        selectedRows.value = [...selectedRows.value, task];
      } else {
        selectedRowKeys.value = selectedRowKeys.value.filter(key => key !== task.Title);
        selectedRows.value = selectedRows.value.filter(row => row.Title !== task.Title);
      }
    }

    // 获取写作任务数量
    const getWritingTasksCount = (date) => {
      return getTasksByDate(date).filter(task => isWriteDate(date, task)).length;
    }

    // 获取发布任务数量
    const getPublishingTasksCount = (date) => {
      return getTasksByDate(date).filter(task => !isWriteDate(date, task)).length;
    }

    // 获取所有日期中最大的任务数量
    const getMaxTasksCount = computed(() => {
      let maxCount = 0;
      const today = dayjs();
      const startOfMonth = today.startOf('month');
      const endOfMonth = today.endOf('month');

      for (let date = startOfMonth; date.isBefore(endOfMonth); date = date.add(1, 'day')) {
        const tasksCount = getTasksByDate(date).length;
        maxCount = Math.max(maxCount, tasksCount);
      }

      return maxCount;
    });

    const totalAnalyzedKeywords = ref(mockData.overview.totalKeywords)
    const keywordStats = ref(mockData.overview.stats)
    const mockKeywordsData = ref(mockData.recommendedKeywords)

    const sortBy = ref('krs')
    const sortOrder = ref('desc')

    const keywordColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '30%'
      },
      {
        title: 'KRS Score',
        dataIndex: 'krsScore',
        key: 'krsScore',
        slots: { customRender: 'krsScore' },
        sorter: true,
        width: '20%'
      },
      {
        title: 'Volume',
        dataIndex: 'searchVolume',
        key: 'searchVolume',
        slots: { customRender: 'searchVolume' },
        sorter: true,
        width: '15%'
      },
      {
        title: 'KD',
        dataIndex: 'keywordDifficulty',
        key: 'keywordDifficulty',
        slots: { customRender: 'keywordDifficulty' },
        sorter: true,
        width: '15%'
      },
      {
        title: 'CPC',
        dataIndex: 'cpcValue',
        key: 'cpcValue',
        slots: { customRender: 'cpcValue' },
        sorter: true,
        width: '15%'
      }
    ]

    // 辅助函数
    const getKRSColor = (score) => {
      if (score >= 80) return '#52c41a'
      if (score >= 60) return '#1890ff'
      if (score >= 40) return '#faad14'
      return '#f5222d'
    }

    const getKDColor = (kd) => {
      if (kd <= 30) return 'success'
      if (kd <= 60) return 'warning'
      return 'error'
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num)
    }

    // 计算排序后的关键词列表
    const sortedKeywords = computed(() => {
      if (!keywordsData.value) return []
      
      return [...keywordsData.value].sort((a, b) => {
        const factor = sortOrder.value === 'desc' ? -1 : 1
        return factor * (a[sortBy.value] - b[sortBy.value])
      })
    })

    const expertMode = ref(false)
    const selectedCategory = ref('missing')
    const kdRange = ref([0, 60])
    const minVolume = ref(100)
    
    // 从 mock 数据中获取分类详情
    const categoryDetails = ref(mockData.categoryDetails)
    
    // 计算当前选中的分类数据
    const currentCategory = computed(() => {
      return categoryDetails.value[selectedCategory.value]
    })

    // 计算过滤后的关键词列表
    const filteredCategoryKeywords = computed(() => {
      if (!currentCategory.value?.keywords) return []
      
      return currentCategory.value.keywords.filter(kw => {
        return kw.keywordDifficulty >= kdRange.value[0] &&
               kw.keywordDifficulty <= kdRange.value[1] &&
               kw.searchVolume >= minVolume.value
      })
    })

    // 分类表格列定义
    const categoryColumns = [
      {
        title: '',
        dataIndex: 'selected',
        width: 40,
        slots: {
          customRender: 'selected'
        }
      },
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
      },
      {
        title: 'KD',
        dataIndex: 'keywordDifficulty',
        key: 'keywordDifficulty',
        slots: { customRender: 'keywordDifficulty' }
      },
      {
        title: 'Volume',
        dataIndex: 'searchVolume',
        key: 'searchVolume',
        slots: { customRender: 'searchVolume' }
      },
      {
        title: 'KRS',
        dataIndex: 'krsScore',
        key: 'krsScore',
        slots: { customRender: 'krsScore' }
      },
      {
        title: 'CPC',
        dataIndex: 'cpcValue',
        key: 'cpcValue',
        slots: { customRender: 'cpcValue' }
      }
    ]

    const applyFilters = () => {
      // 实现筛选应用逻辑
    }

    return {
      domainConfigured,
      goToDashboard,
      loading,
      activeTabKey,
      comparisonType,
      keywordsData,
      selectedCompetitor,
      competitors,
      pagination: currentPagination,
      columns,
      comparisonTypes,
      analysisModalVisible,
      analysisLoading,
      firstArticlesData,
      selectedRowKeys,
      selectedRows,
      rowSelection,
      taskPreviewVisible,
      progressVisible,
      currentTaskIndex,
      taskNames,
      handleTableChange,
      handleTypeChange,
      getCompetitorName,
      handleAIAnalyze,
      handleSubmitTasks,
      prevTask,
      nextTask,
      cancelTaskPreview,
      startBatchSubmit,
      getTaskStatusColor,
      getTaskStatusLabel,
      selectedLanguages,
      languageOptions,
      fetchTaskList,
      updateArticlesTaskStatus,
      totalKeywords,
      selectedKeywords,
      plannedContent,
      conversionRate,
      handleSelectionChange,
      activeSource,
      analyzedPages,
      extractedKeywords,
      keywordsCount,
      pagesCount,
      planningView,
      getTasksByDate,
      isWriteDate,
      showTaskDetails,
      taskDrawerVisible,
      selectedDate,
      currentDateTasks,
      formatDate,
      getTaskDates,
      getRecommendedDates,
      handleGenerate,
      handlePublish,
      handleCalendarTaskSelect,
      getWritingTasksCount,
      getPublishingTasksCount,
      getMaxTasksCount,
      totalAnalyzedKeywords,
      keywordStats,
      sortBy,
      sortOrder,
      keywordColumns,
      getKRSColor,
      getKDColor,
      formatNumber,
      sortedKeywords,
      mockKeywordsData,
      expertMode,
      selectedCategory,
      kdRange,
      minVolume,
      categoryDetails,
      categoryColumns,
      currentCategory,
      filteredCategoryKeywords,
      applyFilters
    }
  }
})
</script>

<style>
.domain-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.domain-notice {
  width: 100%;
  background: #fff;
  border-radius: 16px;
}

:deep(.ant-spin) {
  max-height: none;
}

:deep(.ant-spin-container) {
  height: 100%;
}

/* 最小必要的样式 */
.ant-tag {
  margin: 2px;
}

/* 确保表格在 PageLayout 中正确显示 */
:deep(.ant-table-wrapper) {
  height: 100%;
}

:deep(.ant-tabs-content) {
  height: 100%;
}

/* 任务预览弹窗样式 */
.task-preview-modal {
  :deep(.ant-modal-content) {
    border-radius: 12px;
    overflow: hidden;
  }
  
  :deep(.ant-modal-header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  :deep(.ant-modal-body) {
    padding: 24px;
  }
}

.task-preview-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  min-height: 80px;
}

.keyword-tag {
  border: none !important;
  color: #6cb8ff !important;
  padding: 4px 12px !important;
  border-radius: 16px !important;
  font-size: 12px !important;
}

.task-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.task-counter {
  min-width: 60px;
  text-align: center;
  color: #6B7280;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.submit-button-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

/* 添加新的样式 */
.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: -24px; /* 抵消最后一个form-item的margin */
}

.form-col {
  flex: 1;
}

/* 调整关键词容器样式 */
.keywords-container {
  min-height: 60px; /* 减小最小高度 */
  max-height: 120px; /* 添加最大高度 */
  overflow-y: auto; /* 超出时显示滚动条 */
}

/* 优化标签样式 */
.keyword-tag {
  margin: 4px !important;
  background: #f0f7ff !important;
}

/* 任务导航样式优化 */
.task-navigation {
  margin-top: 16px;
  padding-top: 16px;
}

/* 表单项标签样式优化 */
:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #1f2937;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.beta-tag {
  font-size: 12px;
  padding: 2px 6px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  margin-left: 8px;
}

/* 漏斗容器样式 */
.funnel-container {
  padding: 24px;
}

/* 漏斗层级样式 */
.funnel-level-1 {
  margin-bottom: 24px;
}

.funnel-level-2 {
  margin: 0 auto;
  border-radius: 8px;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 层级头部样式 */
.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.level-title {
  display: flex;
  align-items: center;
  gap: 24px;
}

.level-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

/* 漏斗连接器样式 */
.funnel-connector {
  position: relative;
  height: 40px;
  margin-bottom: 24px;
}

/* 统计数字样式优化 */
:deep(.ant-statistic) {
  margin-bottom: 0;
}

:deep(.ant-statistic-title) {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

:deep(.ant-statistic-content) {
  font-size: 20px;
  font-weight: 600;
}

/* Beta标签样式 */
.beta-tag {
  font-size: 12px;
  padding: 2px 6px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  margin-left: 8px;
}

/* 表格样式优化 */
:deep(.ant-table-wrapper) {
  margin-top: 16px;
  width: 100%;
}

:deep(.ant-table) {
  overflow-x: auto;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
  white-space: nowrap;
}

:deep(.ant-table-cell:last-child) {
  min-width: 180px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .funnel-level-2 {
    width: 100%;
  }
  
  .level-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .level-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* 更新数据源切换样式 */
.source-tabs {
  display: flex;
  gap: 16px;
  padding: 16px; /* 减小内边距 */
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
}

.source-tab {
  flex: 1;
  display: flex;
  gap: 12px; /* 减小间距 */
  padding: 12px 16px; /* 减小内边距 */
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.source-tab.active {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.source-tab:hover:not(.active) {
  background: #F9FAFB;
}

.tab-icon {
  font-size: 20px; /* 减小图标大小 */
  width: 36px; /* 减小图标容器大小 */
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  border-radius: 8px;
}

.tab-content h3 {
  margin: 0 0 2px; /* 减小标题下边距 */
  font-size: 14px; /* 减小标题字体大小 */
}

.tab-content p {
  margin: 0;
  color: #6B7280;
  font-size: 12px; /* 减小描述文字大小 */
}

/* 移除统计数字相关样式 */
.source-stat {
  display: none;
}

/* 漏斗形状样式 */
.funnel-shape {
  position: relative;
  height: 120px;
  margin: 0 auto;
  max-width: 800px;
  padding: 0 40px;
}

.funnel-line {
  position: absolute;
  top: 0;
  width: 45%;
  height: 100%;
  overflow: hidden;
  background: #F3F4F6;
  border: 2px solid #E5E7EB;
}

.funnel-line.left {
  left: 5%;
  transform: skew(30deg);
  border-radius: 8px 0 0 8px;
}

.funnel-line.right {
  right: 5%;
  transform: skew(-30deg);
  border-radius: 0 8px 8px 0;
}

.funnel-gradient {
  position: absolute;
  top: -100%;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(59, 130, 246, 0.1) 20%,
    rgba(59, 130, 246, 0.2) 50%,
    rgba(59, 130, 246, 0.1) 80%,
    transparent
  );
  animation: flowDown 2s ease-in-out infinite;
}

@keyframes flowDown {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(200%);
  }
}

/* 移除旧的发光效果和渐变动画 */
.funnel-line::after {
  display: none;
}

@keyframes gradientFlow {
  /* 移除旧的动画 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .funnel-shape {
    height: 80px;
    padding: 0 20px;
  }
  
  .stats-content {
    padding: 8px 16px;
  }
  
  .stats-icon {
    font-size: 16px;
  }
  
  .stats-detail {
    font-size: 12px;
  }
}

.level-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.ant-btn-primary) {
  background: #3B82F6;
  border-color: #3B82F6;
}

:deep(.ant-btn-primary:hover) {
  background: #2563EB;
  border-color: #2563EB;
}

:deep(.ant-btn-primary[disabled]) {
  background: #E5E7EB;
  border-color: #E5E7EB;
}

/* 更新任务项样式以适应 checkbox */
.task-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 6px;
}

.task-header .ant-checkbox-wrapper {
  margin-top: 2px; /* 微调 checkbox 位置 */
}

.task-item {
  padding: 8px 12px;
  border-radius: 8px;
  background: #ffffff;
  border-left: 3px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  margin-bottom: 6px;
  
  /* 根据任务类型设置不同的边框和背景色 */
  &.is-write-date {
    border-left-color: #3B82F6; /* 写作任务使用蓝色 */
    background: linear-gradient(to right, #EFF6FF, #ffffff);
  }
  
  &:not(.is-write-date) {
    border-left-color: #10B981; /* 发布任务使用绿色 */
    background: linear-gradient(to right, #ECFDF5, #ffffff);
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
}

.task-title {
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  
  .ant-tag {
    background: #F3F4F6;
    border: none;
    color: #6B7280;
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 4px;
  }
  
  .task-type {
    font-size: 11px;
    color: #3B82F6; /* 写作任务文字颜色 */
    font-weight: 500;
    
    &.publishing {
      color: #10B981; /* 发布任务文字颜色 */
    }
  }
}

/* 抽屉样式优化 */
:deep(.ant-drawer-content) {
  background: #F9FAFB;
}

:deep(.ant-drawer-header) {
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #E5E7EB;
  
  .ant-drawer-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
}

.task-detail-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.task-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  
  .task-detail-title {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    line-height: 1.4;
  }
  
  .ant-tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 500;
    
    &.ant-tag-blue {
      background: #EBF5FF;
      border-color: #BAE3FF;
      color: #2563EB;
    }
    
    &.ant-tag-cyan {
      background: #ECFEFF;
      border-color: #B5E8F7;
      color: #0891B2;
    }
  }
}

.task-detail-content {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 12px;
}

.task-detail-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .label {
    width: 80px;
    font-size: 12px;
    color: #6B7280;
    flex-shrink: 0;
  }
  
  .value {
    flex: 1;
    font-size: 13px;
    color: #374151;
  }
  
  .keywords-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    
    .ant-tag {
      font-size: 11px;
      padding: 1px 8px;
      border-radius: 4px;
      background: #EFF6FF;
      border: none;
      color: #3B82F6;
    }
  }
}

/* 添加新的样式 */
.mode-switch-container {
  display: flex;
  justify-content: flex-end;
}

.mode-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F3F4F6;
  padding: 4px 12px;
  border-radius: 20px;
}

.mode-label {
  font-size: 13px;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &.active {
    color: #111827;
    font-weight: 500;
  }
}

:deep(.custom-switch) {
  min-width: 28px;
  height: 16px;
  
  .ant-switch-handle {
    width: 12px;
    height: 12px;
  }
}

/* 移除旧的模式切换样式 */
.recommended-keywords .mode-switch {
  display: none;
}

/* 添加新的标题样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* 移除旧的样式 */
.overview-header,
.header-actions {
  display: none;
}

/* 标签样式优化 */
:deep(.ant-tag) {
  margin: 0;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: normal;
  height: 22px;
  line-height: 18px;
}

/* 分类标签样式优化 */
.category-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.category-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-radio {
  border-radius: 6px !important;
  
  &:first-child {
    border-radius: 6px !important;
  }
  
  &:last-child {
    border-radius: 6px !important;
  }
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
}

.radio-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.radio-count {
  font-size: 12px;
  color: #6B7280;
}

/* 统计信息样式 */
.category-stats {
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  background: #F3F4F6;
  border-radius: 6px;
  
  span {
    font-size: 13px;
    color: #4B5563;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #3B82F6;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    &:last-child::before {
      background: #10B981;
    }
  }
}

:deep(.ant-radio-group-small .ant-radio-button-wrapper) {
  padding: 2px 12px;
  height: 28px;
  line-height: 24px;
}

:deep(.ant-radio-button-wrapper-checked) {
  background: #EFF6FF !important;
  border-color: #3B82F6 !important;
  
  &::before {
    background-color: #3B82F6 !important;
  }
  
  .radio-label {
    color: #2563EB;
  }
  
  .radio-count {
    color: #3B82F6;
  }
}

/* 内容区域间距 */
.source-content {
  padding-top: 24px;
}

/* 高级筛选样式优化 */
.advanced-filters {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 13px;
  color: #4B5563;
  font-weight: 500;
  white-space: nowrap;
  min-width: 80px;
}

:deep(.ant-slider) {
  margin: 0;
}

:deep(.ant-input-number-sm) {
  width: 100px;
}

/* 确保按钮垂直对齐 */
.advanced-filters .ant-btn {
  margin-left: auto;
}
</style>