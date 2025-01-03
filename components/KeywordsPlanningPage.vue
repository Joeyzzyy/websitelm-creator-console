<template>
  <page-layout
    title="Keywords Analysis & Planning"
    description="Analyze competitors and plan your SEO keywords"
    icon="📊"
  >

    <!-- Domain not configured notice -->
    <template v-if="!domainConfigured">
      <div class="domain-notice">
        <div class="notice-content">
          <exclamation-circle-outlined class="notice-icon" />
          <h2>No Site Configured</h2>
          <p>Please configure your domain in settings to use the keyword planning features</p>
          <a-button type="primary" @click="goToDashboard">
            Configure Domain
          </a-button>
        </div>
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
                  <a-statistic 
                    :value="keywordsCount"
                    :valueStyle="{ color: '#3B82F6', fontSize: '24px' }"
                    class="source-stat"
                  />
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
                  <a-statistic 
                    :value="pagesCount"
                    :valueStyle="{ color: '#3B82F6', fontSize: '24px' }"
                    class="source-stat"
                  />
                </div>
              </div>
            </div>

            <!-- 内容区域 -->
            <div class="source-content">
              <transition name="fade" mode="out-in">
                <!-- Keywords Analysis Content -->
                <div v-if="activeSource === 'keywords'" key="keywords">
                  <div class="coming-soon">
                    <a-empty description="Keywords analysis coming soon..." />
                  </div>
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
                <a-radio-group v-model:value="planningView" size="small">
                  <a-radio-button value="list">List</a-radio-button>
                  <a-radio-button value="calendar">Calendar</a-radio-button>
                </a-radio-group>
              </div>
            </div>

            <!-- 视图切换 -->
            <transition name="fade" mode="out-in">
              <!-- 列表视图 -->
              <div v-if="planningView === 'list'" key="list">
                <a-table
                  :dataSource="firstArticlesData"
                  :columns="columns"
                  :rowKey="record => record.id || record.Title"
                  :pagination="false"
                  :row-selection="rowSelection"
                >
                  <template #taskStatus="{ record }">
                    <a-tag :color="getTaskStatusColor(record.taskStatus)">
                      {{ getTaskStatusLabel(record.taskStatus) }}
                    </a-tag>
                  </template>
                  <template #dates="{ record }">
                    <div class="date-info">
                      <div class="date-row">
                        <calendar-outlined /> Writing: 
                        <span class="recommended-date">{{ formatDate(getRecommendedDates(record).writeDate) }}</span>
                      </div>
                      <div class="date-row">
                        <clock-circle-outlined /> Publishing: 
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
                        ghost
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
                  <template v-slot:dateCellRender="{ current }">
                    <div 
                      class="date-cell" 
                      @click="showTaskDetails(current)"
                    >
                      <template v-for="task in getTasksByDate(current)" :key="task.id">
                        <div 
                          class="task-item"
                          :class="[
                            `status-${task.taskStatus}`,
                            { 'is-write-date': isWriteDate(current, task) }
                          ]"
                        >
                          <div class="task-title">{{ task.Title }}</div>
                          <div class="task-meta">
                            <a-tag size="small">{{ task.Category }}</a-tag>
                            <span class="task-type">
                              {{ isWriteDate(current, task) ? 'Writing' : 'Publishing' }}
                            </span>
                          </div>
                        </div>
                      </template>
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
  ExclamationCircleOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/api'
import PageLayout from './layout/PageLayout.vue'
import confirmedFirst50Titles from '../assets/data/ai-keywords-planning/confirmed-first-50-titles.json'
import dayjs from 'dayjs'

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
    ClockCircleOutlined
  },

  setup() {
    const router = useRouter()
    const domainConfigured = ref(false)
    
    // 基础状态
    const loading = ref(false)
    const activeTabKey = ref('analysis')
    const comparisonType = ref('common')
    const keywordsData = ref([])
    const selectedCompetitor = ref(null)
    const productInfo = ref(null)
    const analysisModalVisible = ref(false)
    const analysisLoading = ref(false)
    const firstArticlesData = ref(confirmedFirst50Titles)
    
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
        title: 'Task Status',
        key: 'taskStatus',
        width: 120,
        slots: { customRender: 'taskStatus' }
      },
      {
        title: 'Category',
        dataIndex: 'Category',
        width: 100,
        filters: [...new Set(confirmedFirst50Titles.map(item => item.Category))].map(category => ({
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
        title: 'Keywords',
        dataIndex: 'Keywords',
        ellipsis: true
      },
      {
        title: 'Recommended Dates',
        key: 'dates',
        width: 280,
        slots: { customRender: 'dates' }
      },
      {
        title: 'Action',
        key: 'action',
        width: 180,
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
        message.error('请输入任务名称')
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
    }
  }
})
</script>

<style>
.domain-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background: #fff;
  border-radius: 16px;
}

.notice-content {
  text-align: center;
  padding: 40px;
}

.notice-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 24px;
}

.notice-content h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.notice-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.notice-content .ant-btn {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  height: 40px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 20px;
}

.notice-content .ant-btn:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
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
  border-radius: 8px;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
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

/* 数据源切换样式 */
.source-tabs {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
}

.source-tab {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 20px;
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
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  border-radius: 12px;
}

.tab-content {
  flex: 1;
}

.tab-content h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.tab-content p {
  margin: 0;
  color: #6B7280;
  font-size: 14px;
}

.source-stat {
  margin-top: 8px;
}

/* 漏斗形状样式 */
.funnel-shape {
  position: relative;
  height: 120px;
  margin: 0 auto;
  max-width: 800px;
}

.funnel-line {
  position: absolute;
  top: 0;
  width: 45%;
  height: 100%;
  overflow: hidden;
}

.funnel-line.left {
  left: 5%;
  transform: skew(45deg);
  border-radius: 4px 0 0 4px;
}

.funnel-line.right {
  right: 5%;
  transform: skew(-45deg);
  border-radius: 0 4px 4px 0;
}

.funnel-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
  opacity: 0.15;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.funnel-line::before,
.funnel-line::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #3B82F6;
  opacity: 0.2;
}

.funnel-line::before {
  top: 0;
}

.funnel-line::after {
  bottom: 0;
}

.funnel-stats {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

/* 添加流动动画效果 */
.funnel-gradient {
  animation: gradientFlow 3s ease-in-out infinite;
  background-size: 200% 200%;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
    opacity: 0.1;
  }
  50% {
    background-position: 100% 50%;
    opacity: 0.2;
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .funnel-shape {
    max-width: 100%;
    height: 60px;
  }
  
  .stats-content {
    flex-direction: column;
    align-items: center;
    padding: 8px;
  }
}

/* 转场动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 临时占位样式 */
.coming-soon {
  padding: 48px;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  margin-top: 16px;
}

:deep(.ant-empty) {
  margin: 32px 0;
}

:deep(.ant-empty-description) {
  color: #6B7280;
}

/* 日历视图样式 */
.calendar-view {
  padding: 24px;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  min-height: unset; /* 移除最小高度 */
  height: auto; /* 自动高度 */
}

.task-item {
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  margin-bottom: 4px; /* 添加底部间距 */
}

.task-item:hover {
  transform: translateY(-1px);
}

/* 写作任务样式 */
.task-item.is-write-date {
  background: #eef2ff;
  border-left-color: #4f46e5;
}

.task-item.is-write-date:hover {
  background: #e0e7ff;
}

/* 发布任务样式 */
.task-item:not(.is-write-date) {
  background: #f0fdf4;
  border-left-color: #6366f1;
}

.task-item:not(.is-write-date):hover {
  background: #ecfdf5;
}

.task-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-type {
  font-size: 11px;
  color: #6b7280;
}

:deep(.ant-picker-calendar) {
  background: #fff;
  border-radius: 8px;
}

:deep(.ant-picker-calendar-header) {
  padding: 12px 16px;
}

/* 添加任务详情抽屉样式 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-detail-item {
  padding: 16px;
  background: #f8faff;
  border-radius: 8px;
  border: 1px solid #e5e7ff;
}

.task-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-detail-title {
  font-weight: 500;
  color: #1f2937;
}

.task-detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-detail-row .label {
  font-size: 12px;
  color: #6b7280;
}

.task-detail-row .value {
  color: #374151;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

/* 更新抽屉样式 */
:deep(.ant-drawer-header) {
  border-bottom: 1px solid #e5e7ff;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}

/* 更新日历样式以适应内容 */
:deep(.ant-picker-calendar-date-content) {
  height: auto !important; /* 覆盖 antd 默认样式 */
  overflow: visible !important; /* 确保内容不会被截断 */
}

:deep(.ant-picker-calendar-date) {
  height: auto !important;
}

/* 最后一个任务项不需要底部间距 */
.task-item:last-child {
  margin-bottom: 0;
}

/* 添加日期信息样式 */
.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
}

.date-row .anticon {
  font-size: 14px;
  color: #8B5CF6;
}

/* 添加推荐日期样式 */
.recommended-date {
  color: #3B82F6;
  font-weight: 500;
}

/* 操作按钮样式 */
:deep(.ant-btn-sm) {
  font-size: 12px;
  height: 24px;
  padding: 0 8px;
}
</style>