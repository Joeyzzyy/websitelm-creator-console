<template>
  <div class="intermediate-mode">
    <!-- Advanced Filters -->
    <a-card class="filter-card">
      <a-form layout="inline">
        <a-form-item label="Search">
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search keywords..."
            @search="handleSearch"
            style="width: 250px"
          />
        </a-form-item>
        
        <a-form-item label="Volume Range">
          <a-space>
            <a-input-number
              v-model:value="filters.volumeMin"
              placeholder="Min"
              style="width: 100px"
            />
            <span>-</span>
            <a-input-number
              v-model:value="filters.volumeMax"
              placeholder="Max"
              style="width: 100px"
            />
          </a-space>
        </a-form-item>

        <a-form-item label="Difficulty">
          <a-select
            v-model:value="filters.difficulty"
            style="width: 120px"
            mode="multiple"
            placeholder="Select"
          >
            <a-select-option value="easy">Easy</a-select-option>
            <a-select-option value="medium">Medium</a-select-option>
            <a-select-option value="hard">Hard</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="applyFilters">
            Apply Filters
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Main Content Area -->
    <a-row :gutter="[16, 16]">
      <!-- Keywords Analysis Table -->
      <a-col :span="16">
        <a-card title="Keyword Analysis" :loading="loading">
          <template #extra>
            <a-space>
              <a-radio-group v-model:value="viewMode" size="small">
                <a-radio-button value="table">Table</a-radio-button>
                <a-radio-button value="chart">Chart</a-radio-button>
              </a-radio-group>
              <a-button size="small" @click="refreshData">
                <template #icon><ReloadOutlined /></template>
              </a-button>
            </a-space>
          </template>

          <!-- Table View -->
          <div v-show="viewMode === 'table'" class="table-view">
            <a-table
              :columns="columns"
              :data-source="filteredKeywords"
              :row-selection="rowSelection"
              :pagination="pagination"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <!-- Keyword Column -->
                <template v-if="column.key === 'keyword'">
                  <div class="keyword-cell">
                    <span>{{ record.keyword }}</span>
                    <a-tag :color="getCompetitorStatus(record).color">
                      {{ getCompetitorStatus(record).text }}
                    </a-tag>
                  </div>
                </template>

                <!-- Trend Column -->
                <template v-if="column.key === 'trend'">
                  <mini-trend :data="record.trendData" />
                </template>

                <!-- Competition Column -->
                <template v-if="column.key === 'competition'">
                  <competition-indicator 
                    :our-rank="record.ourRank"
                    :competitor-ranks="record.competitorRanks"
                  />
                </template>

                <!-- Actions Column -->
                <template v-if="column.key === 'action'">
                  <a-space>
                    <a-tooltip title="View Details">
                      <a-button type="link" @click="viewDetails(record)">
                        <template #icon><EyeOutlined /></template>
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="Compare">
                      <a-button type="link" @click="compareKeyword(record)">
                        <template #icon><SwapOutlined /></template>
                      </a-button>
                    </a-tooltip>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>

          <!-- Chart View -->
          <div v-show="viewMode === 'chart'" class="chart-view">
            <div ref="scatterChartRef" style="height: 400px"></div>
          </div>
        </a-card>
      </a-col>

      <!-- Analysis Panel -->
      <a-col :span="8">
        <a-card title="Competitive Analysis" :loading="loading">
          <!-- Competitor Overview -->
          <div class="competitor-overview">
            <h4>Top Competitors</h4>
            <a-list size="small">
              <a-list-item v-for="comp in competitors" :key="comp.domain">
                <div class="competitor-item">
                  <span class="domain">{{ comp.domain }}</span>
                  <div class="stats">
                    <a-tag color="blue">{{ comp.sharedKeywords }} shared</a-tag>
                    <a-tag color="green">{{ comp.ranking }} avg. rank</a-tag>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>

          <!-- Opportunity Score -->
          <div class="opportunity-score">
            <h4>Opportunity Score</h4>
            <a-progress
              type="circle"
              :percent="opportunityScore"
              :format="percent => `${percent}/100`"
              :width="120"
            />
            <div class="score-details">
              <a-descriptions size="small" :column="1">
                <a-descriptions-item label="Potential Traffic">
                  {{ formatNumber(potentialTraffic) }}
                </a-descriptions-item>
                <a-descriptions-item label="Estimated Effort">
                  {{ effortLevel }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Keyword Details Modal -->
    <a-modal
      v-model:visible="detailsModal.visible"
      title="Keyword Details"
      width="800px"
      :footer="null"
    >
      <template v-if="detailsModal.data">
        <a-tabs>
          <!-- Overview Tab -->
          <a-tab-pane key="overview" tab="Overview">
            <a-descriptions bordered>
              <a-descriptions-item label="Keyword" span="3">
                {{ detailsModal.data.keyword }}
              </a-descriptions-item>
              <a-descriptions-item label="Search Volume">
                {{ formatNumber(detailsModal.data.volume) }}
              </a-descriptions-item>
              <a-descriptions-item label="Difficulty">
                {{ detailsModal.data.difficulty }}%
              </a-descriptions-item>
              <a-descriptions-item label="Our Rank">
                {{ detailsModal.data.ourRank || 'Not Ranking' }}
              </a-descriptions-item>
            </a-descriptions>

            <!-- Trend Chart -->
            <div ref="detailsTrendChartRef" style="height: 300px; margin: 20px 0"></div>
          </a-tab-pane>

          <!-- SERP Analysis Tab -->
          <a-tab-pane key="serp" tab="SERP Analysis">
            <a-table
              :columns="serpColumns"
              :data-source="detailsModal.data.serpData"
              size="small"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'url'">
                  <a :href="record.url" target="_blank">{{ record.url }}</a>
                </template>
              </template>
            </a-table>
          </a-tab-pane>

          <!-- Content Analysis Tab -->
          <a-tab-pane key="content" tab="Content Analysis">
            <a-card class="content-suggestions">
              <template #title>
                <span>Content Optimization Suggestions</span>
              </template>
              <a-list size="small">
                <a-list-item v-for="(suggestion, index) in contentSuggestions" :key="index">
                  <a-tag color="blue" v-if="suggestion.type === 'topic'">Topic</a-tag>
                  <a-tag color="green" v-if="suggestion.type === 'keyword'">Keyword</a-tag>
                  <span>{{ suggestion.text }}</span>
                </a-list-item>
              </a-list>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { 
  EyeOutlined, 
  SwapOutlined, 
  ReloadOutlined 
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import MiniTrend from './components/MiniTrend.vue'
import CompetitionIndicator from './components/CompetitionIndicator.vue'

export default defineComponent({
  name: 'IntermediateMode',
  components: {
    EyeOutlined,
    SwapOutlined,
    ReloadOutlined,
    MiniTrend,
    CompetitionIndicator
  },
  props: {
    selectedKeywords: {
      type: Array,
      required: true
    }
  },
  emits: ['update:selectedKeywords'],
  
  setup(props, { emit }) {
    // 状态管理
    const loading = ref(false)
    const viewMode = ref('table')
    const filters = ref({
      search: '',
      volumeMin: null,
      volumeMax: null,
      difficulty: []
    })

    // 图表引用
    const scatterChartRef = ref(null)
    const detailsTrendChartRef = ref(null)
    let scatterChart = null
    let detailsTrendChart = null

    // 模态框状态
    const detailsModal = ref({
      visible: false,
      data: null
    })

    // 模拟数据
    const keywords = ref([
      {
        id: 1,
        keyword: 'digital marketing strategy',
        volume: 22000,
        difficulty: 65,
        ourRank: 8,
        competitorRanks: [1, 3, 5],
        trendData: [110, 120, 115, 125, 130, 125],
        serpData: [
          { rank: 1, url: 'competitor1.com', title: 'Digital Marketing Guide' },
          { rank: 2, url: 'competitor2.com', title: 'Strategy Overview' }
        ]
      },
      // ... 更多关键词数据
    ])

    const competitors = ref([
      {
        domain: 'competitor1.com',
        sharedKeywords: 450,
        ranking: 3.2
      },
      // ... 更多竞争对手数据
    ])

    // 计算属性
    const filteredKeywords = computed(() => {
      let result = [...keywords.value]
      
      if (filters.value.search) {
        result = result.filter(k => 
          k.keyword.toLowerCase().includes(filters.value.search.toLowerCase())
        )
      }

      if (filters.value.volumeMin) {
        result = result.filter(k => k.volume >= filters.value.volumeMin)
      }

      if (filters.value.volumeMax) {
        result = result.filter(k => k.volume <= filters.value.volumeMax)
      }

      if (filters.value.difficulty.length) {
        result = result.filter(k => {
          const diff = k.difficulty
          return filters.value.difficulty.some(level => {
            switch(level) {
              case 'easy': return diff < 30
              case 'medium': return diff >= 30 && diff < 70
              case 'hard': return diff >= 70
            }
          })
        })
      }

      return result
    })

    const opportunityScore = computed(() => 75) // 示例得分
    const potentialTraffic = computed(() => 125000)
    const effortLevel = computed(() => 'Medium')

    // 表格配置
    const columns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        sorter: true
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        sorter: true,
        width: 120
      },
      {
        title: 'Trend',
        key: 'trend',
        width: 150
      },
      {
        title: 'Competition',
        key: 'competition',
        width: 200
      },
      {
        title: 'Actions',
        key: 'action',
        width: 100,
        fixed: 'right'
      }
    ]

    const serpColumns = [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        width: 80
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      }
    ]

    const pagination = {
      total: 200,
      current: 1,
      pageSize: 10
    }

    const rowSelection = {
      selectedRowKeys: computed(() => props.selectedKeywords.map(k => k.id)),
      onChange: (selectedRowKeys, selectedRows) => {
        emit('update:selectedKeywords', selectedRows)
      }
    }

    // 方法
    const initCharts = () => {
      if (viewMode.value === 'chart' && scatterChartRef.value) {
        scatterChart = echarts.init(scatterChartRef.value)
        updateScatterChart()
      }
    }

    const updateScatterChart = () => {
      if (!scatterChart) return

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.data.keyword}<br/>
                    Volume: ${params.data.volume}<br/>
                    Difficulty: ${params.data.difficulty}`
          }
        },
        xAxis: {
          type: 'value',
          name: 'Search Volume',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: 'Difficulty',
          nameLocation: 'middle',
          nameGap: 30
        },
        series: [{
          type: 'scatter',
          data: filteredKeywords.value.map(k => ({
            ...k,
            value: [k.volume, k.difficulty]
          })),
          symbolSize: function (data) {
            return Math.sqrt(data[0]) / 10
          }
        }]
      }

      scatterChart.setOption(option)
    }

    const handleSearch = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    const applyFilters = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    const refreshData = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    const viewDetails = (record) => {
      detailsModal.value = {
        visible: true,
        data: record
      }
    }

    const compareKeyword = (record) => {
      // 实现关键词对比逻辑
    }

    const getCompetitorStatus = (record) => {
      if (!record.ourRank) return { color: 'error', text: 'Missing' }
      if (record.ourRank > Math.min(...record.competitorRanks)) {
        return { color: 'warning', text: 'Behind' }
      }
      return { color: 'success', text: 'Leading' }
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num)
    }

    // 生命周期钩子
    onMounted(() => {
      initCharts()
    })

    watch(viewMode, (newMode) => {
      if (newMode === 'chart') {
        setTimeout(initCharts, 100)
      }
    })

    watch(() => detailsModal.value.visible, (visible) => {
      if (visible && detailsModal.value.data) {
        setTimeout(() => {
          if (detailsTrendChartRef.value) {
            detailsTrendChart = echarts.init(detailsTrendChartRef.value)
            const option = {
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: detailsModal.value.data.trendData,
                type: 'line',
                smooth: true
              }]
            }
            detailsTrendChart.setOption(option)
          }
        }, 100)
      }
    })

    return {
      loading,
      viewMode,
      filters,
      detailsModal,
      columns,
      serpColumns,
      pagination,
      rowSelection,
      filteredKeywords,
      competitors,
      opportunityScore,
      potentialTraffic,
      effortLevel,
      scatterChartRef,
      detailsTrendChartRef,
      handleSearch,
      applyFilters,
      refreshData,
      viewDetails,
      compareKeyword,
      getCompetitorStatus,
      formatNumber
    }
  }
})
</script>

<style scoped>
.intermediate-mode {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  margin-bottom: 16px;
}

.keyword-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.competitor-overview {
  margin-bottom: 24px;
}

.competitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.domain {
  font-weight: 500;
}

.stats {
  display: flex;
  gap: 8px;
}

.opportunity-score {
  text-align: center;
  padding: 16px 0;
}

.score-details {
  margin-top: 16px;
}

.content-suggestions {
  margin-top: 16px;
}

:deep(.ant-card-head) {
  min-height: 48px;
}

:deep(.ant-card-head-title) {
  padding: 8px 0;
}

:deep(.ant-card-extra) {
  padding: 8px 0;
}

.chart-view {
  height: 400px;
  margin-top: 16px;
}
</style> 