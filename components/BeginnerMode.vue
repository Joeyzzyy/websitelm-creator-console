<template>
    <div class="beginner-mode">
      <!-- Search and Filter Bar -->
      <div class="action-bar">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Search keywords..."
          style="width: 300px"
          @search="handleSearch"
        />
        <a-space>
          <a-select
            v-model:value="filterStatus"
            style="width: 120px"
            placeholder="Status"
          >
            <a-select-option value="all">All Status</a-select-option>
            <a-select-option value="missing">Missing</a-select-option>
            <a-select-option value="weak">Weak</a-select-option>
            <a-select-option value="strong">Strong</a-select-option>
          </a-select>
          <a-select
            v-model:value="sortBy"
            style="width: 150px"
            placeholder="Sort by"
          >
            <a-select-option value="volume">Search Volume</a-select-option>
            <a-select-option value="difficulty">Difficulty</a-select-option>
            <a-select-option value="relevance">Relevance</a-select-option>
          </a-select>
        </a-space>
      </div>
  
      <!-- Keywords Table -->
      <a-table
        :columns="columns"
        :data-source="filteredKeywords"
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <!-- Keyword Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'keyword'">
            <div class="keyword-cell">
              <span>{{ record.keyword }}</span>
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status }}
              </a-tag>
            </div>
          </template>
  
          <!-- Volume Column -->
          <template v-else-if="column.key === 'volume'">
            <div class="volume-cell">
              {{ formatNumber(record.volume) }}
              <a-progress 
                :percent="getVolumePercent(record.volume)" 
                :show-info="false"
                size="small"
              />
            </div>
          </template>
  
          <!-- Difficulty Column -->
          <template v-else-if="column.key === 'difficulty'">
            <a-progress
              :percent="record.difficulty"
              size="small"
              :status="getDifficultyStatus(record.difficulty)"
            />
          </template>
  
          <!-- Actions Column -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-tooltip title="View Details">
                <a-button type="link" size="small" @click="viewDetails(record)">
                  <template #icon><EyeOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Add to Plan">
                <a-button type="link" size="small" @click="addToPlan(record)">
                  <template #icon><PlusOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
  
      <!-- Keyword Details Modal -->
      <a-modal
        v-model:visible="detailsModalVisible"
        title="Keyword Details"
        :footer="null"
        width="800px"
      >
        <template v-if="selectedKeywordDetails">
          <a-descriptions bordered>
            <a-descriptions-item label="Keyword" span="3">
              {{ selectedKeywordDetails.keyword }}
            </a-descriptions-item>
            <a-descriptions-item label="Search Volume">
              {{ formatNumber(selectedKeywordDetails.volume) }}
            </a-descriptions-item>
            <a-descriptions-item label="Difficulty">
              {{ selectedKeywordDetails.difficulty }}%
            </a-descriptions-item>
            <a-descriptions-item label="Status">
              <a-tag :color="getStatusColor(selectedKeywordDetails.status)">
                {{ selectedKeywordDetails.status }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
  
          <div class="trends-chart" ref="trendsChartRef"></div>
  
          <a-divider />
  
          <div class="serp-preview">
            <h4>Search Results Preview</h4>
            <a-list
              :data-source="selectedKeywordDetails.serpResults"
              size="small"
              bordered
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <div class="serp-item">
                    <div class="serp-title">{{ item.title }}</div>
                    <div class="serp-url">{{ item.url }}</div>
                    <div class="serp-snippet">{{ item.snippet }}</div>
                  </div>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </template>
      </a-modal>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed, watch, onMounted } from 'vue'
  import { EyeOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import * as echarts from 'echarts'
  
  export default defineComponent({
    name: 'BeginnerMode',
    components: {
      EyeOutlined,
      PlusOutlined
    },
    props: {
      selectedKeywords: {
        type: Array,
        required: true
      }
    },
    emits: ['update:selectedKeywords'],
    setup(props, { emit }) {
      const searchQuery = ref('')
      const filterStatus = ref('all')
      const sortBy = ref('volume')
      const loading = ref(false)
      const detailsModalVisible = ref(false)
      const selectedKeywordDetails = ref(null)
      const trendsChart = ref(null)
      const trendsChartRef = ref(null)
  
      // 模拟数据
      const keywords = ref([
        {
          id: 1,
          keyword: 'digital marketing',
          volume: 135000,
          difficulty: 75,
          status: 'strong',
          trends: [110, 120, 118, 125, 132, 135, 140, 138, 135, 142, 145, 135]
        },
        // ... 更多关键词数据
      ])
  
      const columns = [
        {
          title: 'Keyword',
          dataIndex: 'keyword',
          key: 'keyword',
          sorter: true
        },
        {
          title: 'Search Volume',
          dataIndex: 'volume',
          key: 'volume',
          sorter: true,
          width: 200
        },
        {
          title: 'Difficulty',
          dataIndex: 'difficulty',
          key: 'difficulty',
          sorter: true,
          width: 150
        },
        {
          title: 'Actions',
          key: 'action',
          width: 100
        }
      ]
  
      const pagination = {
        total: 200,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`
      }
  
      const rowSelection = {
        selectedRowKeys: computed(() => props.selectedKeywords.map(k => k.id)),
        onChange: (selectedRowKeys, selectedRows) => {
          emit('update:selectedKeywords', selectedRows)
        }
      }
  
      const filteredKeywords = computed(() => {
        let result = [...keywords.value]
        
        // 应用搜索过滤
        if (searchQuery.value) {
          result = result.filter(k => 
            k.keyword.toLowerCase().includes(searchQuery.value.toLowerCase())
          )
        }
  
        // 应用状态过滤
        if (filterStatus.value !== 'all') {
          result = result.filter(k => k.status === filterStatus.value)
        }
  
        // 应用排序
        result.sort((a, b) => {
          switch (sortBy.value) {
            case 'volume':
              return b.volume - a.volume
            case 'difficulty':
              return b.difficulty - a.difficulty
            default:
              return 0
          }
        })
  
        return result
      })
  
      const getStatusColor = (status) => {
        const colors = {
          missing: 'error',
          weak: 'warning',
          strong: 'success'
        }
        return colors[status] || 'default'
      }
  
      const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num)
      }
  
      const getVolumePercent = (volume) => {
        const max = Math.max(...keywords.value.map(k => k.volume))
        return Math.round((volume / max) * 100)
      }
  
      const getDifficultyStatus = (difficulty) => {
        if (difficulty >= 75) return 'exception'
        if (difficulty >= 50) return 'normal'
        return 'success'
      }
  
      const handleSearch = () => {
        loading.value = true
        // 模拟API调用
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
  
      const handleTableChange = (pag, filters, sorter) => {
        loading.value = true
        // 模拟API调用
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
  
      const viewDetails = (record) => {
        selectedKeywordDetails.value = {
          ...record,
          serpResults: [
            {
              title: 'Digital Marketing Guide 2024',
              url: 'https://example.com/guide',
              snippet: 'Comprehensive guide to digital marketing strategies and best practices...'
            },
            // ... 更多搜索结果
          ]
        }
        detailsModalVisible.value = true
      }
  
      const addToPlan = (record) => {
        const newSelection = [...props.selectedKeywords]
        if (!newSelection.find(k => k.id === record.id)) {
          newSelection.push(record)
          emit('update:selectedKeywords', newSelection)
        }
      }
  
      // 初始化趋势图表
      const initTrendsChart = () => {
        if (trendsChartRef.value && selectedKeywordDetails.value) {
          if (trendsChart.value) {
            trendsChart.value.dispose()
          }
  
          trendsChart.value = echarts.init(trendsChartRef.value)
          const option = {
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: selectedKeywordDetails.value.trends,
              type: 'line',
              smooth: true
            }]
          }
          trendsChart.value.setOption(option)
        }
      }
  
      watch(() => detailsModalVisible.value, (visible) => {
        if (visible) {
          setTimeout(initTrendsChart, 100)
        }
      })
  
      return {
        searchQuery,
        filterStatus,
        sortBy,
        loading,
        columns,
        filteredKeywords,
        pagination,
        rowSelection,
        detailsModalVisible,
        selectedKeywordDetails,
        trendsChartRef,
        getStatusColor,
        formatNumber,
        getVolumePercent,
        getDifficultyStatus,
        handleSearch,
        handleTableChange,
        viewDetails,
        addToPlan
      }
    }
  })
  </script>
  
  <style scoped>
  .beginner-mode {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .keyword-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .volume-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .trends-chart {
    height: 300px;
    margin: 24px 0;
  }
  
  .serp-preview {
    margin-top: 16px;
  }
  
  .serp-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .serp-title {
    color: #1a0dab;
    font-size: 16px;
  }
  
  .serp-url {
    color: #006621;
    font-size: 12px;
  }
  
  .serp-snippet {
    color: #545454;
    font-size: 13px;
  }
  
  :deep(.ant-table-pagination) {
    margin-top: 16px !important;
  }
  </style>