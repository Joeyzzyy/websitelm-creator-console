<template>
  <PageLayout>
    <a-spin 
      :spinning="loading"
      class="centered-spin"
    >
      <template v-if="domainConfigured">
        <template v-if="analysisState !== 'finished'">
          <div class="analysis-loading-state">
            <a-card class="loading-card">
              <!-- Not Started State -->
              <template v-if="analysisState === 'not_started'">
                <div class="analysis-loading-card" style="display: flex; justify-content: center; align-items: center; min-height: 300px;">
                  <div class="preparing-analysis-content">
                    <LoadingOutlined class="analysis-icon" spin />
                    <h2 class="analysis-title">Initializing Keyword Library</h2>
                    <p class="analysis-description">Gathering competitive intelligence from <span class="platform-tag semrush">SEMrush</span>, <span class="platform-tag ahrefs">Ahrefs</span>, <span class="platform-tag google">Google Trends</span>, and <span class="platform-tag social">Social Media</span></p>
                    <div class="loading-tips"> 
                      <ThunderboltOutlined class="tip-icon" />
                      <span class="tip-text">Pro Tip: This initial scan typically takes several minutes</span>
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="analysisState === 'processing'">
                <div class="analysis-loading-card" style="display: flex; justify-content: center; align-items: center; min-height: 300px;">
                  <div class="processing-analysis-content">
                    <div class="analysis-icon-container">
                      <LoadingOutlined class="analysis-icon pulse" spin />
                    </div>
                    <h2 class="analysis-title">Keywords Analysis in Progress</h2>
                    <p class="analysis-description">
                      Your keyword database has been successfully created! We're now analyzing and prioritizing your keywords for maximum impact.
                    </p>
                    <div class="analysis-status">
                      <div v-for="task in currentTasks" :key="task.taskName" class="task-item">
                        <div class="task-header">
                          <span class="task-name">{{ task.taskName }}</span>
                          <span class="task-status" :class="task.status">{{ task.status }}</span>
                        </div>
                        <a-progress 
                          :percent="getProgressPercent(task.progress)" 
                          :status="task.status === 'finished' ? 'success' : 'active'"
                          :strokeColor="{ from: '#108ee9', to: '#87d068' }"
                          size="small"
                        />
                        <div class="task-timing">
                          <span>Started: {{ formatTime(task.startTime) }}</span>
                          <span v-if="task.endTime">Completed: {{ formatTime(task.endTime) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="notification-message">
                      <MailOutlined class="mail-icon" />
                      <span>You'll receive an email notification when the analysis is complete!</span>
                    </div>
                  </div>
                </div>
              </template>
            </a-card>
          </div>
        </template>

        <template v-else>
          <div class="planning-layout">
            <div class="main-content">
              <div class="keywords-selection">
                <a-tabs 
                  v-model:activeKey="keywordSelectionMode"
                  class="mode-tabs"
                  @change="handleModeChange"
                >
                  <template #rightExtra>
                    <a-button 
                      type="link"
                      @click="showSelectedKeywords"
                      class="view-keywords-btn"
                    >
                      View Selected Keywords
                    </a-button>
                  </template>

                  <a-tab-pane key="ai" tab="Keywords Library">
                    <div class="beginner-mode">
                      <a-row :gutter="[24, 24]" class="beginner-content">
                        <a-col :span="6">
                          <!-- Library description -->
                          <div class="library-description">
                            <div class="library-header">
                              <h3>Welcome To Your Keywords Library</h3>
                              <p>Access our collection of high-quality keywords from:</p>
                            </div>
                            <div class="data-sources">
                              <div class="source-item">
                                <span class="source-tag semrush">
                                  <SearchOutlined /> SEMrush
                                </span>
                              </div>
                              <div class="source-item">
                                <span class="source-tag ahrefs">
                                  <LineChartOutlined /> Ahrefs
                                </span>
                              </div>
                            </div>
                            <div class="library-tip">
                              <BulbOutlined />
                              <span>Pro tip: Use Smart Priority filter for AI-recommended keywords based on traffic potential and competition analysis</span>
                            </div>
                          </div>
                          <!-- Filter panel -->
                          <div class="filter-sidebar">
                            <h3 class="filter-title">Filter Options</h3>
                            <a-form layout="vertical" :model="filterForm" class="sidebar-filter-form">
                              <!-- Smart keyword search -->
                              <a-form-item label="Smart Keyword Search">
                                <div class="smart-search-container">
                                  <a-input
                                    v-model:value="filterForm.searchTerm"
                                    placeholder="Input keywords or questions..."
                                    allow-clear
                                    class="smart-search-input"
                                    @pressEnter="applyFilters"
                                  />
                                  <div class="search-examples-popup">
                                    <div class="search-examples-content">
                                      <div class="search-examples-title">Smart Semantic Search:</div>
                                      <span class="search-example">Enter any semantic prompt or seed keyword</span>
                                      <div class="search-examples-title">Try prompts like:</div>
                                      <span class="search-example">"low competition keywords about content marketing"</span>
                                      <span class="search-example">"trending topics in digital marketing for 2025"</span>
                                      <div class="search-examples-title">Or simple seed keywords:</div>
                                      <span class="search-example">"SEO" or "email marketing" or "social media strategy"</span>
                                      <div class="search-examples-title">Our AI will intelligently interpret your input and find relevant keywords</div>
                                    </div>
                                  </div>
                                </div>
                              </a-form-item>
                              
                              <!-- Priority filter -->
                              <a-form-item label="Smart Priority Category">
                                <a-select
                                  v-model:value="filterForm.priority"
                                  placeholder="Select priority"
                                  style="width: 100%"
                                  allow-clear
                                >
                                  <a-select-option v-for="priority in priorities" :key="priority.level" :value="priority.level">
                                    {{ priority.label }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              
                              <!-- Keyword difficulty filter -->
                              <a-form-item label="Keyword Difficulty (KD)">
                                <a-row :gutter="8">
                                  <a-col :span="11">
                                    <a-input-number
                                      v-model:value="filterForm.kdMin"
                                      placeholder="Min"
                                      style="width: 100%"
                                      :min="0"
                                      :max="100"
                                    />
                                  </a-col>
                                  <a-col :span="2" style="text-align: center">-</a-col>
                                  <a-col :span="11">
                                    <a-input-number
                                      v-model:value="filterForm.kdMax"
                                      placeholder="Max"
                                      style="width: 100%"
                                      :min="0"
                                      :max="100"
                                    />
                                  </a-col>
                                </a-row>
                              </a-form-item>
                              
                              <!-- Search volume filter -->
                              <a-form-item label="Search Volume">
                                <a-row :gutter="8">
                                  <a-col :span="11">
                                    <a-input-number
                                      v-model:value="filterForm.volumeMin"
                                      placeholder="Min"
                                      style="width: 100%"
                                      :min="0"
                                    />
                                  </a-col>
                                  <a-col :span="2" style="text-align: center">-</a-col>
                                  <a-col :span="11">
                                    <a-input-number
                                      v-model:value="filterForm.volumeMax"
                                      placeholder="Max"
                                      style="width: 100%"
                                      :min="0"
                                    />
                                  </a-col>
                                </a-row>
                              </a-form-item>
                              
                              <!-- Related outlines filter -->
                              <a-form-item label="Related Outlines">
                                <a-select
                                  v-model:value="filterForm.hasOutlines"
                                  placeholder="Select status"
                                  style="width: 100%"
                                  allow-clear
                                >
                                  <a-select-option value="yes">Has Outlines</a-select-option>
                                  <a-select-option value="no">No Outlines</a-select-option>
                                </a-select>
                              </a-form-item>
                              
                              <!-- Filter buttons -->
                              <div class="filter-actions">
                                <a-button 
                                  type="primary" 
                                  block
                                  @click="applyFilters"
                                >Apply Filters</a-button>
                                <a-button 
                                  block
                                  @click="resetFilters"
                                  style="margin-top: 8px;"
                                >Reset Filters</a-button>
                              </div>
                            </a-form>
                          </div>
                        </a-col>
                        
                        <a-col :span="18">
                          <!-- Right side table -->
                          <a-card class="keyword-table-card">
                            <template #title>
                              <div class="table-header">
                                <span>{{ totalRecordsText }}</span>
                              </div>
                            </template>
                            
                            <a-table
                              :dataSource="recommendedKeywords"
                              :columns="keywordsTableColumns"
                              :pagination="{
                                current: recommendedPagination.current,
                                pageSize: recommendedPagination.pageSize,
                                total: recommendedPagination.total,
                                showSizeChanger: true,
                                showQuickJumper: true,
                              }"
                              @change="handleKeywordsPaginationChange"
                              size="small"
                              class="keywords-table"
                            >
                              <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'actions'">
                                  <a-button 
                                    type="primary"
                                    ghost
                                    :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                                    @click="handleKeywordFavorite(record)"
                                  >
                                    {{ record.favorited ? 'Deselect' : 'Select' }}
                                  </a-button>
                                </template>
                              </template>
                            </a-table>
                          </a-card>
                        </a-col>
                      </a-row>
                    </div>
                  </a-tab-pane>

                  <a-tab-pane key="import" tab="Manual Import">
                    <div class="manual-import-content">
                      <a-card class="import-methods-card">
                        <div class="import-method-item">
                          <div class="method-header">
                            <p class="method-desc">Import keywords from a CSV or Excel file</p>
                            <div class="method-actions">
                              <a-upload
                                :customRequest="handleFileUpload"
                                :showUploadList="false"
                                accept=".csv,.xlsx,.xls"
                              >
                                <a-button type="primary">Upload File</a-button>
                              </a-upload>
                              <a-button @click="downloadTemplate">Download Template</a-button>
                              <a-button type="link" @click="showTemplateInfo">View Guide</a-button>
                            </div>
                          </div>
                        </div>
                      </a-card>
                      <a-card title="Imported Keywords" class="imported-keywords-card">
                        <a-table
                          :dataSource="importedKeywords"
                          :columns="importedKeywordsColumns"
                          :pagination="importedKeywordsPagination"
                          :loading="importedTableLoading"
                          @change="handleImportedKeywordsPaginationChange"
                        >
                          <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'actions'">
                              <a-space>
                                <a-button 
                                  type="primary"
                                  ghost
                                  :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                                  @click="handleKeywordFavorite(record)"
                                >
                                  {{ record.favorited ? 'Deselect' : 'Select' }}
                                </a-button>
                                <a-button 
                                  type="link" 
                                  danger 
                                  @click="removeManualKeyword(record)"
                                >
                                  <DeleteOutlined />
                                </a-button>
                              </a-space>
                            </template>
                          </template>
                        </a-table>
                      </a-card>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="input" tab="Manual Input">
                    <div class="manual-input-container">
                      <a-card class="manual-input-card">
                        <div class="input-section">
                          <div class="input-header">
                            <h3 class="input-title">
                              Add Keywords 
                              <span class="input-subtitle">Enter one keyword per line</span>
                            </h3>
                          </div>
                          
                          <a-form layout="vertical">
                            <a-form-item>
                              <template #label>
                                <span class="textarea-label">Keywords</span>
                                <span class="format-hint">
                                  <InfoCircleOutlined />
                                  Format: keyword, KD (optional), volume (optional)
                                </span>
                              </template>
                              <a-textarea
                                v-model:value="bulkKeywords"
                                placeholder="Example:
digital marketing
content strategy, 25, 1200
seo tools, 45"
                                :autoSize="{ minRows: 4, maxRows: 8 }"
                                class="bulk-textarea"
                              />
                            </a-form-item>
                            <a-form-item>
                              <a-button 
                                type="primary" 
                                @click="addManualKeywords"
                                :loading="isAddingKeywords"
                              >
                                Add Keywords
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                      </a-card>
                      
                      <a-card title="Added Keywords" class="manual-keywords-card">
                        <a-table
                          :dataSource="manualKeywords"
                          :columns="manualKeywordsColumns"
                          :pagination="manualKeywordsPagination"
                          :loading="manualTableLoading"
                          @change="handleManualKeywordsPaginationChange"
                          :rowKey="record => record.id || record.keyword"
                        >
                          <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'actions'">
                              <a-space>
                                <a-button 
                                  type="primary"
                                  ghost
                                  :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                                  @click="handleKeywordFavorite(record)"
                                >
                                  {{ record.favorited ? 'Deselect' : 'Select' }}
                                </a-button>
                                <a-button 
                                  type="link" 
                                  danger 
                                  @click="removeManualKeyword(record)"
                                >
                                  <DeleteOutlined />
                                </a-button>
                              </a-space>
                            </template>
                          </template>
                        </a-table>
                      </a-card>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </div>
          </div>
        </template>
      </template>

      <template v-else>
        <no-site-configured v-if="!loading"/>
      </template>
    </a-spin>

    <a-modal
      v-model:open="showSelectedModal"
      title="Selected Keywords"
      width="700px"
      @cancel="handleModalClose"
    >
      <!-- Add loading state display -->
      <div v-if="isLoadingModalKeywords" class="loading-keywords">
        <a-spin>
        </a-spin>
        <div class="loading-content">
          <p>Loading selected keywords...</p>
        </div>
      </div>

      <!-- Selected keywords table, only shown when not loading -->
      <template v-else>
        <a-table
          :dataSource="modalKeywords.comparison"
          :columns="keywordsTableColumns"
          :pagination="false"
          size="small"
          class="selected-keywords-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <a-button 
                type="primary"
                ghost
                class="deselect-btn"
                @click="handleCancelSelection(record)"
              >
                Deselect
              </a-button>
            </template>
          </template>
        </a-table>
      </template>

      <template #footer>
        <a-button @click="handleModalClose">Close</a-button>
        <a-button 
          type="primary" 
          @click="proceedToContentPlan"
          :disabled="totalSelectedKeywords === 0"
        >
          Proceed to Outlines
        </a-button>
      </template>
    </a-modal>
  </PageLayout>
</template>
<script>
import { defineComponent, ref, computed, h, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { Tag } from 'ant-design-vue'
import {
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  MailOutlined,
  SearchOutlined,
  LineChartOutlined,
  BulbOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import api from '../api/api'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  components: {
    PageLayout,
    DeleteOutlined,
    PlusOutlined,
    LoadingOutlined,
    InfoCircleOutlined,
    NoSiteConfigured,
    ThunderboltOutlined,
    MailOutlined,
    SearchOutlined,
    LineChartOutlined,
    BulbOutlined
  },
  setup() {
    const router = useRouter()
    const selectedKeywords = ref([])
    const loading = ref(true) 
    const keywordSelectionMode = ref('ai')
    
    // Domain and analysis state
    const domainConfigured = ref(false)
    const analysisState = computed(() => {
      if (loading.value) return 'loading'
      return taskInfo.value?.analysisStatus || 'not_started'
    })
    const taskInfo = ref(null)
    const pollingInterval = ref(null)
    
    // Keywords data
    const recommendedKeywords = ref([])
    const importedKeywords = ref([])
    const manualKeywords = ref([])
    const bulkKeywords = ref('')
    const isAddingKeywords = ref(false)
    
    // Pagination
    const recommendedPagination = ref({
      current: 1,
      pageSize: 15,
      total: 0
    })
    
    const importedKeywordsPagination = ref({
      current: 1,
      pageSize: 10,
      total: 0
    })
    
    const manualKeywordsPagination = ref({
      current: 1,
      pageSize: 10,
      total: 0
    })
    
    // Filter form
    const filterForm = ref({
      priority: null,
      kdMin: null,
      kdMax: null,
      volumeMin: null,
      volumeMax: null,
      hasOutlines: null,
      searchTerm: ''
    })
    
    // Selected keywords modal
    const showSelectedModal = ref(false)
    const isLoadingModalKeywords = ref(false)
    const modalKeywords = ref({
      comparison: []
    })
    
    // Priority categories
    const priorities = [
      {
        level: '1',
        label: 'Low Competition, Considerable Volume',
        color: '#f50'
      },
      {
        level: '2', 
        label: 'Good Volume, Medium Competition',
        color: '#fa8c16'
      },
      {
        level: '3',
        label: 'Medium Volume & Competition',
        color: '#1890ff'
      },
      {
        level: '4',
        label: 'Lower Volume, Higher Competition',
        color: '#52c41a'
      },
      {
        level: '5',
        label: 'Monitor & Long-term',
        color: '#722ed1'
      }
    ]
    
    // Table columns
    const keywordsTableColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        sorter: (a, b) => a.keyword.localeCompare(b.keyword),
        width: '30%'
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        sorter: (a, b) => a.kd - b.kd,
        width: '15%',
        render: (text) => {
          let color = 'green'
          if (text > 70) color = 'red'
          else if (text > 40) color = 'orange'
          
          return h(Tag, { color }, () => `${text}`)
        }
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        sorter: (a, b) => a.volume - b.volume,
        width: '15%',
        render: (text) => text.toLocaleString()
      },
      {
        title: 'CPC ($)',
        dataIndex: 'cpc',
        key: 'cpc',
        sorter: (a, b) => a.cpc - b.cpc,
        width: '15%'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '15%'
      }
    ]
    
    const importedKeywordsColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword'
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        width: 100
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        width: 120
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 200
      }
    ]
    
    const manualKeywordsColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword'
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        width: 100
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        width: 120
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 200
      }
    ]
    
    // Computed properties
    const totalRecordsText = computed(() => {
      return `Total: ${recommendedPagination.value.total} keywords`;
    })
    
    const totalSelectedKeywords = computed(() => {
      return modalKeywords.value.comparison.length;
    })
    
    const currentTasks = computed(() => {
      if (!taskInfo.value?.data || !Array.isArray(taskInfo.value.data)) return []
      return taskInfo.value.data
    })
    
    // Methods
    const transformKeywordData = (item) => {
      return {
        id: item.keywordId,
        keyword: item.keyword,
        kd: item.kd || 0,
        volume: item.volume || 0,
        cpc: Number(item.cpc || 0).toFixed(2),
        favorited: item.status === 'selected',
        relatedOutlines: item.relatedOutlines || [],
        keywordType: item.keywordType,
        status: item.status,
        priority: item.priority
      }
    }
    
    const fetchKeywords = async (priority = null, page = 1, pageSize = 15, filters = {}) => {
      try {
        const params = {
          page,
          limit: pageSize,
          ...filters
        };
        
        if (priority) {
          params.level = priority;
        }
        
        const response = await api.getPlanningKeywords(params);
        
        if (response?.data) {
          recommendedKeywords.value = response.data.map(transformKeywordData);
          recommendedPagination.value.total = response.totalCount || 0;
        } else {
          recommendedKeywords.value = [];
          recommendedPagination.value.total = 0;
        }
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
        message.error('Failed to load keywords');
        recommendedKeywords.value = [];
        recommendedPagination.value.total = 0;
      }
    }
    
    const importedTableLoading = ref(false)
    const fetchImportedKeywords = async () => {
      importedTableLoading.value = true
      try {
        const response = await api.getPlanningKeywords({
          source: 'manual_import',
          page: importedKeywordsPagination.value.current,
          limit: importedKeywordsPagination.value.pageSize
        })
        
        if (response?.data) {
          importedKeywords.value = response.data.map(transformKeywordData)
          importedKeywordsPagination.value.total = response.totalCount || 0
        }
      } catch (error) {
        console.error('Failed to fetch imported keywords:', error)
        message.error('Failed to load imported keywords')
      } finally {
        importedTableLoading.value = false
      }
    }
    
    const manualTableLoading = ref(false)
    const fetchManualKeywords = async () => {
      manualTableLoading.value = true
      try {
        const response = await api.getPlanningKeywords({
          source: 'manual_input',
          page: manualKeywordsPagination.value.current,
          limit: manualKeywordsPagination.value.pageSize
        })
        
        if (response?.data) {
          manualKeywords.value = response.data.map(transformKeywordData)
          manualKeywordsPagination.value.total = response.totalCount || 0
        }
      } catch (error) {
        console.error('Failed to get manual keywords list:', error)
        message.error('Failed to load keywords list')
      } finally {
        manualTableLoading.value = false
      }
    }
    
    const handleKeywordsPaginationChange = (pagination) => {
      recommendedPagination.value.current = pagination.current;
      recommendedPagination.value.pageSize = pagination.pageSize;
      fetchKeywords(filterForm.value.priority, pagination.current, pagination.pageSize, getFilterParams());
    }
    
    const handleImportedKeywordsPaginationChange = (pagination) => {
      fetchImportedKeywords(pagination.current, pagination.pageSize)
    }
    
    const handleManualKeywordsPaginationChange = (pagination) => {
      fetchManualKeywords(pagination.current, pagination.pageSize)
    }
    
    const handleModeChange = (mode) => {
      keywordSelectionMode.value = mode;
      
      if (mode === 'import') {
        fetchImportedKeywords();
      } else if (mode === 'input') {
        fetchManualKeywords();
      }
    }
    
    const handleKeywordFavorite = async (keyword) => {
      try {
        if (keyword.favorited) {
          await api.cancelPlanningKeywords([keyword.id]);
          keyword.favorited = false;
          selectedKeywords.value = selectedKeywords.value.filter(k => k.id !== keyword.id);
          message.success('Removed from selection');
        } else {
          await api.selectPlanningKeywords([keyword.id]);
          keyword.favorited = true;
          if (!selectedKeywords.value.find(k => k.id === keyword.id)) {
            selectedKeywords.value.push({ ...keyword, selected: true });
          }
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    }
    
    const handleCancelSelection = async (keyword) => {
      try {
        await api.deselectKeyword(keyword.id);
        
        // Remove from modal list
        modalKeywords.value.comparison = modalKeywords.value.comparison.filter(k => k.id !== keyword.id);
        
        // Update in main list if visible
        const keywordInList = recommendedKeywords.value.find(k => k.id === keyword.id);
        if (keywordInList) {
          keywordInList.favorited = false;
        }
      } catch (error) {
        console.error('Failed to deselect keyword:', error);
        message.error('Failed to deselect keyword');
      }
    }
    
    const showSelectedKeywords = () => {
      showSelectedModal.value = true;
      fetchSelectedKeywords();
    }
    
    const fetchSelectedKeywords = async () => {
      isLoadingModalKeywords.value = true;
      try {
        const response = await api.getPlanningKeywords({
          status: 'selected',
          page: 1,
          limit: 100
        });
        
        if (response?.data) {
          modalKeywords.value.comparison = response.data
            .map(transformKeywordData)
            .filter(k => k.favorited);
        } else {
          modalKeywords.value.comparison = [];
        }
      } catch (error) {
        console.error('Failed to get selected keywords:', error);
        message.error('Failed to load selected keywords');
        modalKeywords.value.comparison = [];
      } finally {
        isLoadingModalKeywords.value = false;
      }
    }
    
    const handleModalClose = () => {
      showSelectedModal.value = false;
    }
    
    const proceedToContentPlan = () => {
      router.push('/content-planning');
    }
    
    const getFilterParams = () => {
      const params = {};
      
      if (filterForm.value.priority) {
        params.level = filterForm.value.priority;
      }
      
      if (filterForm.value.kdMin !== null) {
        params.kdMin = filterForm.value.kdMin;
      }
      
      if (filterForm.value.kdMax !== null) {
        params.kdMax = filterForm.value.kdMax;
      }
      
      if (filterForm.value.volumeMin !== null) {
        params.volumeMin = filterForm.value.volumeMin;
      }
      
      if (filterForm.value.volumeMax !== null) {
        params.volumeMax = filterForm.value.volumeMax;
      }
      
      if (filterForm.value.hasOutlines) {
        params.hasOutlines = filterForm.value.hasOutlines === 'yes';
      }
      
      if (filterForm.value.searchTerm) {
        params.search = filterForm.value.searchTerm;
      }
      
      return params;
    }
    
    const applyFilters = () => {
      recommendedPagination.value.current = 1;
      fetchKeywords(filterForm.value.priority, 1, recommendedPagination.value.pageSize, getFilterParams());
    }
    
    const resetFilters = () => {
      filterForm.value = {
        priority: null,
        kdMin: null,
        kdMax: null,
        volumeMin: null,
        volumeMax: null,
        hasOutlines: null,
        searchTerm: ''
      };
      
      recommendedPagination.value.current = 1;
      fetchKeywords(null, 1, recommendedPagination.value.pageSize);
    }
    
    const addManualKeywords = async () => {
      if (!bulkKeywords.value.trim()) {
        message.warning('Please enter at least one keyword');
        return;
      }
      
      isAddingKeywords.value = true;
      try {
        const keywordsArray = bulkKeywords.value
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            const parts = line.split(',').map(part => part.trim());
            return {
              keyword: parts[0],
              kd: parts[1] ? parseInt(parts[1]) : null,
              volume: parts[2] ? parseInt(parts[2]) : null
            };
          });
        
        await api.inputKeywords(keywordsArray);
        message.success('Keywords added successfully');
        bulkKeywords.value = '';
        
        // Refresh the manual keywords list
        fetchManualKeywords();
      } catch (error) {
        console.error('Failed to add keywords:', error);
        message.error('Failed to add keywords');
      } finally {
        isAddingKeywords.value = false;
      }
    }
    
    const removeManualKeyword = async (record) => {
      try {
        const response = await api.deletePlanningKeyword(record.id);
        if (response?.code === 1007) {
          message.error('Keyword not found, please try other keywords');
        } else {
          if (keywordSelectionMode.value === 'input') {
            message.success('Keyword deleted successfully');
            await fetchManualKeywords();
          } else {
            message.success('Keyword deleted successfully');
            await fetchImportedKeywords();
          }
        }
      } catch (error) {
        console.error('Failed to delete keyword:', error);
        message.error('Failed to delete keyword');
      }
    }
    
    const handleFileUpload = async ({ file }) => {
      // 验证文件类型
      const isCSV = file.type === 'text/csv';
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.type === 'application/vnd.ms-excel';
                      
      if (!isCSV && !isExcel) {
        message.error('Please upload CSV or Excel file only');
        return;
      }

      // 验证文件大小 (例如限制为10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        // 显示上传中的loading
        const uploadingMessage = message.loading({
          content: 'Uploading...',
          duration: 0,
          key: 'uploadingKeywords'
        });

        const response = await api.importKeywords(formData);
        
        // 关闭loading消息
        message.destroy('uploadingKeywords');

        // 检查响应状态
        if (response?.code === 200 || response?.status === 'success') {
          message.success({
            content: `Successfully imported ${response?.data?.count || ''} keywords`,
            duration: 3
          });
          
          // 刷新导入的关键词列表
          await fetchImportedKeywords();
        } else {
          throw new Error(response?.message || 'Import failed');
        }
      } catch (error) {
        console.error('File upload failed:', error);
        message.error({
          content: error.message || 'Failed to import keywords, please try again',
          duration: 3
        });
      }
    }
    
    const downloadTemplate = async () => {
      try {
        message.loading({ content: 'Preparing template download...', key: 'downloadTemplate' })
        
        const templateUrl = '/templates/keywords-import-template.xlsx'
        const response = await fetch(templateUrl)
        
        if (!response.ok) {
          throw new Error('Template download failed')
        }
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'keywords-import-template.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        message.success({ content: 'Template downloaded successfully!', key: 'downloadTemplate' })
      } catch (error) {
        console.error('Template download failed:', error)
        message.error({ content: 'Failed to download template, please try again', key: 'downloadTemplate' })
      }
    }
    
    const showTemplateInfo = () => {
      Modal.info({
        title: 'Import Template Guide',
        content: h('div', {}, [
          h('p', 'Please prepare your CSV or Excel file in the following format:'),
          h('ul', {}, [
            h('li', 'Column 1: Keyword (required)'),
            h('li', 'Column 2: Keyword Difficulty KD (optional)'),
            h('li', 'Column 3: Search Volume (optional)')
          ]),
          h('p', 'Example:'),
          h('pre', 'keyword,kd,volume\ndigital marketing,45,1200\ncontent marketing,30,800\nseo optimization,55,2500')
        ]),
        width: 500
      });
    }
    
    // Analysis status methods
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
            await fetchKeywords(filterForm.value.priority, 1, recommendedPagination.value.pageSize)
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
    
    const getProgressPercent = (progress) => {
      if (!progress || !progress.total) return 0
      return Math.round((progress.current / progress.total) * 100)
    }
    
    const formatTime = (isoString) => {
      if (!isoString) return '--'
      try {
        const date = new Date(isoString)
        if (isNaN(date.getTime())) return '--'
        
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(date)
      } catch {
        return '--'
      }
    }
    
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
    
    // Lifecycle hooks
    onMounted(async () => {
      loading.value = true
      try {
        await checkDomainStatus()

        if (domainConfigured.value) {
          await checkAnalysisStatus()
          
          if (analysisState.value !== 'finished') {
            pollingInterval.value = setInterval(checkAnalysisStatus, 5000)
          }

          await fetchKeywords(filterForm.value.priority, 1, recommendedPagination.value.pageSize)
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        message.error('Failed to initialize the page')
      } finally {
        loading.value = false
      }
    })

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    })
    
    return {
      // State
      loading,
      domainConfigured,
      analysisState,
      currentTasks,
      keywordSelectionMode,
      recommendedKeywords,
      importedKeywords,
      manualKeywords,
      bulkKeywords,
      isAddingKeywords,
      recommendedPagination,
      importedKeywordsPagination,
      manualKeywordsPagination,
      filterForm,
      priorities,
      showSelectedModal,
      isLoadingModalKeywords,
      modalKeywords,
      
      // Computed
      totalRecordsText,
      totalSelectedKeywords,
      
      // Methods
      handleKeywordsPaginationChange,
      handleImportedKeywordsPaginationChange,
      handleManualKeywordsPaginationChange,
      handleModeChange,
      handleKeywordFavorite,
      handleCancelSelection,
      showSelectedKeywords,
      handleModalClose,
      proceedToContentPlan,
      applyFilters,
      resetFilters,
      addManualKeywords,
      removeManualKeyword,
      handleFileUpload,
      downloadTemplate,
      showTemplateInfo,
      getProgressPercent,
      formatTime,
      
      // Table columns
      keywordsTableColumns,
      importedKeywordsColumns,
      manualKeywordsColumns,
      importedTableLoading,
      manualTableLoading
    }
  }
})
</script>

<style scoped>
.planning-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-content {
  background: #fff;
  border-radius: 8px;
}

.centered-spin {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.analysis-loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.loading-card {
  width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analysis-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 24px;
}

.analysis-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.analysis-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
  max-width: 600px;
}

.platform-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.platform-tag.semrush {
  background-color: #ff642d;
  color: white;
}

.platform-tag.ahrefs {
  background-color: #0a53e4;
  color: white;
}

.platform-tag.google {
  background-color: #4285f4;
  color: white;
}

.platform-tag.social {
  background-color: #1da1f2;
  color: white;
}

.loading-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f7ff;
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
}

.tip-icon {
  color: #1890ff;
  font-size: 18px;
  margin-right: 8px;
}

.tip-text {
  color: #333;
  font-size: 14px;
}

.analysis-status {
  margin-top: 24px;
  width: 100%;
}

.task-item {
  margin-bottom: 16px;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.task-name {
  font-weight: 500;
}

.task-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.task-status.processing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.task-status.finished {
  background-color: #f6ffed;
  color: #52c41a;
}

.task-timing {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}

.notification-message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  color: #666;
}

.mail-icon {
  margin-right: 8px;
  color: #1890ff;
}

.mode-tabs {
  margin-bottom: 24px;
}

.beginner-content {
  padding: 0 16px;
}

.library-description {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.library-header h3 {
  font-size: 16px;
  margin-bottom: 4px;
  color: #1f1f1f;
}

.library-header p {
  color: #666;
  margin-bottom: 12px;
  font-size: 14px;
}

.data-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.source-item {
  margin-right: 8px;
}

.source-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s ease;
}

.source-tag.semrush {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.source-tag.semrush:hover {
  background: #fff7f6;
}

.source-tag.ahrefs {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.source-tag.ahrefs:hover {
  background: #f0faff;
}

.library-tip {
  background: #fffbe6;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #8c6c16;
  border: 1px solid #ffe58f;
}

.library-tip :deep(.anticon) {
  color: #faad14;
  font-size: 14px;
}

.filter-sidebar {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.filter-title {
  font-size: 16px;
  margin-bottom: 16px;
}

.sidebar-filter-form {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

.sidebar-filter-form :deep(.ant-form-item) {
  margin-bottom: 16px;
  width: 100%;
}

.sidebar-filter-form :deep(.ant-input),
.sidebar-filter-form :deep(.ant-input-number),
.sidebar-filter-form :deep(.ant-select) {
  width: 100%;
  max-width: 100%;
}

.sidebar-filter-form :deep(.ant-row) {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.smart-search-container {
  position: relative;
}

.search-examples-popup {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.search-examples-content {
  max-width: 100%;
}

.smart-search-input:focus + .search-examples-popup,
.smart-search-input:focus-within + .search-examples-popup {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.search-examples-title {
  color: #333;
  font-weight: 500;
  margin: 8px 0 4px;
}

.search-examples-title:first-child {
  margin-top: 0;
}

.search-example {
  display: block;
  color: #666;
  margin: 4px 0;
  font-size: 13px;
}

.filter-actions {
  margin-top: 24px;
}

.keyword-table-card {
  height: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-keywords-btn {
  font-weight: 500;
}

.keywords-table {
  margin-top: 8px;
}

.select-btn {
  color: #1890ff;
  border-color: #1890ff;
}

.deselect-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.manual-import-content,
.manual-input-container {
  padding: 0 16px;
}

.import-methods-card {
  margin-bottom: 24px;
}

.method-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.method-desc {
  font-size: 16px;
  margin: 0;
}

.method-actions {
  display: flex;
  gap: 8px;
}

.imported-keywords-card,
.manual-keywords-card {
  margin-bottom: 24px;
}

.manual-input-card {
  margin-bottom: 24px;
}

.input-section {
  padding: 0;
}

.input-header {
  margin-bottom: 12px;
}

.input-title {
  font-size: 16px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-subtitle {
  font-size: 13px;
  color: #666;
  font-weight: normal;
}

.textarea-label {
  margin-right: 8px;
}

.format-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 13px;
  font-weight: normal;
}

.format-hint .anticon {
  color: #1890ff;
}

.bulk-textarea {
  font-family: monospace;
  resize: vertical;
  margin-top: 4px;
}

/* 调整表单项间距 */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item):last-child {
  margin-bottom: 0;
}

:deep(.ant-card-body) {
  padding: 16px;
}

.loading-keywords {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-content {
  margin-top: 16px;
  color: #666;
}

.selected-keywords-table {
  margin-top: 16px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pulse {
  animation: pulse 2s infinite;
}

.analysis-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.processing-analysis-content,
.preparing-analysis-content {
  max-width: 700px;
  padding: 32px;
  text-align: center;
}

@media (max-width: 1200px) {
  .beginner-content {
    flex-direction: column;
  }
  
  .filter-sidebar,
  .keyword-table-card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .method-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .method-actions {
    margin-top: 16px;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-keywords-btn {
    margin-top: 8px;
  }
}
</style>