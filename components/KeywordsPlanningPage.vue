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
      <!-- 主标签页 -->
    <a-tabs v-model:activeKey="activeTabKey">
      <template #rightExtra>
        <a-button 
          v-if="activeTabKey === 'analysis'"
          type="primary"
          @click="handleAIAnalyze"
        >
          AI Keywords Analyze
          <span>BETA</span>
        </a-button>

        <a-button 
          v-if="activeTabKey === 'planning'"
          type="primary"
          @click="handleSubmitTasks"
        >
          Submit Tasks ({{ selectedRows?.length || 0 }})
          <RobotOutlined />
        </a-button>
      </template>

      <!-- 分析标签页 -->
      <a-tab-pane key="analysis" tab="Semrush Keywords Analysis">
        <a-tabs 
          v-model:activeKey="comparisonType" 
          @change="handleTypeChange"
        >
          <a-tab-pane 
            v-for="type in comparisonTypes" 
            :key="type.key" 
            :tab="type.label"
          >
            <keywords-table 
              :data="keywordsData" 
              :loading="loading"
              :pagination="pagination"
              :competitor-name="selectedCompetitor ? getCompetitorName(selectedCompetitor) : null"
              @change="handleTableChange"
            />
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>

      <!-- 规划标签页 -->
      <a-tab-pane key="planning" tab="Page Planning">
        <a-table
          :dataSource="firstArticlesData"
          :columns="columns"
          :rowKey="record => record.id || record['English Title']"
          :pagination="false"
          :row-selection="rowSelection"
        >
          <template #taskStatus="{ record }">
            <a-tag :color="getTaskStatusColor(record.taskStatus)">
              {{ getTaskStatusLabel(record.taskStatus) }}
            </a-tag>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <!-- 分析弹窗 -->
    <keyword-analysis-modal
      :open="analysisModalVisible"
      :loading="analysisLoading"
      :analysis-type="comparisonType === 'missing' ? 'missing' : 'common'"
      @update:open="analysisModalVisible = $event"
    />

    <!-- 任务预览弹窗 -->
    <a-modal
      v-model:visible="taskPreviewVisible"
      title="Create AI Tasks"
      width="600px"
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

            <!-- 基��信息 -->
            <a-form-item label="Basic Information">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Article Type</div>
                  <div class="info-value">
                    <a-tag :color="selectedRows[currentTaskIndex].Category === 'Blog' ? '#10B981' : '#3B82F6'">
                      {{ selectedRows[currentTaskIndex].Category }}
                    </a-tag>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Number of Articles</div>
                  <div class="info-value">1</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Word Count</div>
                  <div class="info-value">1200 words</div>
                </div>
              </div>
            </a-form-item>

            <!-- 语言选择 -->
            <a-form-item label="Languages">
              <a-checkbox-group v-model:value="selectedLanguages" :options="languageOptions" />
            </a-form-item>

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
              <span>Create AI Tasks  </span>
              <RobotOutlined />
            </span>
          </a-button>
        </div>
      </template>
    </a-modal>

    <!-- 进度弹窗 -->
    <a-modal
      v-model:visible="progressVisible"
      :footer="null"
      :closable="false"
    >
      <a-space direction="vertical" align="center" style="width: 100%">
        <LoadingOutlined spin />
        <div>Creating AI Tasks</div>
        <div>Processing task {{ currentTaskIndex + 1 }} of {{ selectedRows.length }}</div>
      </a-space>
    </a-modal>
    </template>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { 
  RobotOutlined,
  LeftOutlined,
  RightOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import KeywordsTable from './KeywordsTable.vue'
import KeywordAnalysisModal from './KeywordAnalysisModal.vue'
import apiClient from '../api/api'
import PageLayout from './layout/PageLayout.vue'

// 导入数据
import commonData from '../assets/data/semrush-keywords-data/common.json'
import uniqueData from '../assets/data/semrush-keywords-data/unique.json'
import weakData from '../assets/data/semrush-keywords-data/weak.json'
import strongData from '../assets/data/semrush-keywords-data/strong.json'
import missingData from '../assets/data/semrush-keywords-data/missing.json'
import allData from '../assets/data/semrush-keywords-data/all.json'
import undevelopedData from '../assets/data/semrush-keywords-data/undeveloped.json'
import confirmedFirst50Titles from '../assets/data/ai-keywords-planning/confirmed-first-50-titles.json'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  
  components: {
    PageLayout,
    KeywordsTable,
    KeywordAnalysisModal,
    RobotOutlined,
    LeftOutlined,
    RightOutlined,
    LoadingOutlined
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
    const selectedLanguages = ref(['en', 'zh']) // 默认全选

    const languageOptions = [
      { label: 'English', value: 'en', disabled: true }, // 语必选
      { label: '中文', value: 'zh' }
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

    // Add domain status check
    const checkDomainStatus = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getProductsByCustomerId(customerId)
        domainConfigured.value = response.data?.domainStatus || false
      } catch (error) {
        console.error('Failed to fetch product info:', error)
        domainConfigured.value = false
      }
    }

    // Add navigation to settings
    const goToDashboard = () => {
      router.push('/dashboard')
    }

    // Modify onMounted to check domain status first
    onMounted(async () => {
      await checkDomainStatus()
      if (domainConfigured.value) {
        // Only load data if domain is configured
        loadProductInfo()
        fetchKeywordsData('common', 1)
      }
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
        title: 'English Title',
        dataIndex: 'English Title',
        ellipsis: true
      },
      {
        title: 'Chinese Title',
        dataIndex: 'Chinese Title',
        ellipsis: true
      },
      {
        title: 'Keywords',
        dataIndex: 'Keywords',
        ellipsis: true
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
    const loadProductInfo = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getProductsByCustomerId(customerId)
        if (response?.code === 200) {
          productInfo.value = response.data
        }
      } catch (error) {
        message.error('Failed to load product info')
      }
    }

    const getCompetitorName = (competitorId) => {
      const competitor = competitors.value.find(comp => comp.id === competitorId)
      return competitor?.name || ''
    }

    const fetchKeywordsData = async (type, page = 1) => {
      loading.value = true
      keywordsData.value = []

      try {
        const dataMap = {
          all: allData.Sheet1,
          common: commonData.Sheet1,
          unique: uniqueData.Sheet1,
          weak: weakData.Sheet1,
          strong: strongData.Sheet1,
          missing: missingData.Sheet1,
          undeveloped: undevelopedData.Sheet1
        }

        if (dataMap[type]) {
          const startIndex = (page - 1) * paginationStates.value[type].pageSize
          const endIndex = startIndex + paginationStates.value[type].pageSize
          keywordsData.value = dataMap[type].slice(startIndex, endIndex).map(item => ({
            keyword: item.Keyword,
            intents: item.Intents,
            volume: item.Volume,
            difficulty: item['Keyword Difficulty'],
            competition: item['Competition Density'],
            'kreadoai.com': item['kreadoai.com'],
            'heygen.com': item['heygen.com'],
            'd-id.com': item['d-id.com'],
            'synthesia.io': item['synthesia.io'],
            'creatify.ai': item['creatify.ai'],
            results: item.Results
          }))

          paginationStates.value[type] = {
            ...paginationStates.value[type],
            current: page,
            total: dataMap[type].length
          }
        }
      } catch (error) {
        message.error('Failed to load keywords data')
      } finally {
        loading.value = false
      }
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
        `${task['English Title']}-${new Date().toLocaleString()}`
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
          await apiClient.createBatchTask({
            batchId: Date.now().toString(),
            batchName: taskNames.value[i],
            createdAt: new Date().toISOString(),
            customerId: localStorage.getItem('currentCustomerId'),
            generationStatus: "pending",
            articleType: task.Category === 'Blog' ? 'Blog' : 'Landing Page',
            relatedKeyword: task.Keywords,
            topic: task['English Title'],
            publishStatus: "unpublished",
            publishedCount: 0,
            totalPages: 1,
            updatedAt: new Date().toISOString(),
            numberOfWords: 1200,
            languages: selectedLanguages.value.join(',')
          })
          
          currentTaskIndex.value = i
        }

        message.success(`Successfully created ${selectedRows.value.length} tasks`)
      } catch (error) {
        message.error('Failed to create tasks')
      } finally {
        selectedRows.value = []
        selectedRowKeys.value = []
        progressVisible.value = false
      }
    }

    const getTaskStatusColor = (status) => status === 'has_task' ? '#10B981' : '#F43F5E'
    const getTaskStatusLabel = (status) => status === 'has_task' ? 'Task Created' : 'No Task'

    // 监听数据变化
    watch(batchData)

    // 组件挂载
    onMounted(() => {
      loadProductInfo()
      fetchKeywordsData('common', 1)
    })

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
      languageOptions
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

.progress-text {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: #F9FAFB;
  padding: 16px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  color: #6B7280;
  font-size: 12px;
}

.info-value {
  color: #111827;
  font-size: 14px;
  font-weight: 500;
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

</style>