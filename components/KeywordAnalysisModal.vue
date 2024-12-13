<template>
  <a-modal
    :open="open"
    title="Keywords Analysis"
    :footer="null"
    width="1200px"
    @cancel="handleClose"
    class="cluster-analysis-modal"
  >
    <a-spin :spinning="loading">
      <div class="analysis-content">
        <!-- Priority Legend -->
        <div class="priority-legend">
          <div class="legend-item p0-legend">
            <span class="dot"></span>
            <span class="text">P0: Immediate Priority - Critical Business Keywords</span>
          </div>
          <div class="legend-item p1-legend">
            <span class="dot"></span>
            <span class="text">P1: Confident Priority - Strong Potential</span>
          </div>
          <div class="legend-item p2-legend">
            <span class="dot"></span>
            <span class="text">P2: Potential Opportunity - Promising Results</span>
          </div>
          <div class="legend-item p3-legend">
            <span class="dot"></span>
            <span class="text">P3: Future Opportunity - Long-term Keywords</span>
          </div>
        </div>
        
        <!-- 竞争潜力统计卡片 -->
        <div class="overview-stats">
          <div 
            v-for="(count, priority) in priorityCounts" 
            :key="priority" 
            class="stat-item"
            :class="{ 
              active: activePriority === priority,
              'p0-priority': priority === 'P0',
              'p1-priority': priority === 'P1',
              'p2-priority': priority === 'P2',
              'p3-priority': priority === 'P3'
            }"
            @click="activePriority = priority"
          >
            <span class="stat-label">Priority {{ priority }}</span>
            <span class="stat-value">{{ count }}</span>
          </div>
        </div>

        <!-- 搜索和过滤区域 -->
        <div class="filters-section">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search keywords..."
            class="search-input"
          />
          <a-select
            v-model:value="selectedSeoType"
            placeholder="SEO Type"
            class="filter-select"
          >
            <a-select-option value="">All Types</a-select-option>
            <a-select-option value="Core">Core</a-select-option>
            <a-select-option value="Modified">Modified</a-select-option>
            <a-select-option value="Long-tail">Long-tail</a-select-option>
          </a-select>
        </div>

        <!-- 关键词表格 -->
        <div class="table-section">
          <a-table
            :columns="columns"
            :data-source="filteredKeywords"
            :pagination="{
              pageSize: 10,
              showQuickJumper: true
            }"
            :scroll="{ y: 500 }"
          >
            <!-- 竞争潜力列 -->
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'priority'">
                <a-tag :class="getPriorityClass(record.priority)">
                  {{ record.priority }}
                </a-tag>
              </template>
              <!-- SEO类型列 -->
              <template v-if="column.key === 'seo_type'">
                <a-tag :class="getSeoTypeClass(record.seo_type)">
                  {{ record.seo_type }}
                </a-tag>
              </template>
              <!-- 指标列 -->
              <template v-if="column.key === 'metrics'">
                <div class="metrics-cell">
                  <span>Volume: {{ record.attributes.volume }}</span>
                  <span>Difficulty: {{ record.attributes.difficulty }}</span>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import commonKeywordAnalysis from '../assets/data/ai-keywords-analyze-modal/common_keyword_analysis.json'
import missingKeywordAnalysis from '../assets/data/ai-keywords-analyze-modal/missing_keyword_analysis.json'

export default defineComponent({
  props: {
    open: Boolean,
    loading: Boolean,
    analysisType: {
      type: String,
      default: 'common',
      validator: (value) => ['common', 'missing'].includes(value)
    }
  },
  
  emits: ['update:open'],
  
  setup(props, { emit }) {
    const searchText = ref('')
    const activePriority = ref('P0')
    const selectedSeoType = ref('')

    // 根据类型获取数据
    const getAnalysisData = computed(() => {
      return props.analysisType === 'common' ? commonKeywordAnalysis : missingKeywordAnalysis
    })

    // 定义表格列
    const columns = computed(() => [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '20%',
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: '10%',
      },
      {
        title: 'SEO Type',
        dataIndex: 'seo_type',
        key: 'seo_type',
        width: '10%',
      },
      {
        title: 'Key Metrics',
        key: 'metrics',
        width: '20%',
      },
      {
        title: props.analysisType === 'missing' ? 'Opportunity' : 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        width: '40%',
      }
    ])

    // 计算竞争潜力统计
    const priorityCounts = computed(() => {
      const counts = { P0: 0, P1: 0, P2: 0, P3: 0 }
      getAnalysisData.value.forEach(item => {
        counts[item.priority] = (counts[item.priority] || 0) + 1
      })
      return counts
    })

    // 过滤关键词
    const filteredKeywords = computed(() => {
      return getAnalysisData.value
        .filter(item => {
          const matchesPriority = item.priority === activePriority.value
          const matchesSearch = !searchText.value || 
            item.keyword.toLowerCase().includes(searchText.value.toLowerCase())
          const matchesSeoType = !selectedSeoType.value || 
            item.seo_type === selectedSeoType.value
          return matchesPriority && matchesSearch && matchesSeoType
        })
        .map(item => ({
          ...item,
          key: item.keyword
        }))
    })

    // 样式辅助函数
    const getPriorityClass = (priority) => {
      return {
        'p0-tag': priority === 'P0',
        'p1-tag': priority === 'P1',
        'p2-tag': priority === 'P2',
        'p3-tag': priority === 'P3'
      }
    }

    const getSeoTypeClass = (type) => {
      return {
        'core-tag': type === 'Core',
        'modified-tag': type === 'Modified',
        'longtail-tag': type === 'Long-tail'
      }
    }

    return {
      searchText,
      activePriority,
      selectedSeoType,
      columns,
      priorityCounts,
      filteredKeywords,
      getPriorityClass,
      getSeoTypeClass,
      handleClose: () => emit('update:open', false)
    }
  }
})
</script>

<style scoped>
.cluster-analysis-modal {
  :deep(.ant-modal-content) {
    border-radius: 16px;
    overflow: hidden;
  }

  :deep(.ant-modal-header) {
    padding: 24px;
    border-bottom: 1px solid #E5E7EB;
    
    .ant-modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    }
  }

  :deep(.ant-modal-body) {
    padding: 24px;
  }
}

.analysis-content {
  .overview-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;

    .stat-item {
      flex: 1;
      padding: 12px 16px;
      border-radius: 8px;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 4px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      }

      &.active {
        color: white;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .stat-label {
        font-size: 13px;
        font-weight: 500;
      }

      .stat-value {
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}

/* 优先级标签样式 */
:deep(.p0-tag) {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
}

:deep(.p1-tag) {
  background: linear-gradient(135deg, #6366F1, #1890ff);
  color: white;
}

:deep(.p2-tag) {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white;
}

:deep(.p3-tag) {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white;
}

/* 统计卡片优先级样式 */
.stat-item.p0-priority.active {
  background: linear-gradient(145deg, #10B981, #059669);
}

.stat-item.p1-priority.active {
  background: linear-gradient(145deg, #6366F1, #1890ff);
}

.stat-item.p2-priority.active {
  background: linear-gradient(145deg, #F59E0B, #D97706);
}

.stat-item.p3-priority.active {
  background: linear-gradient(145deg, #EF4444, #DC2626);
}

/* 过滤区域样式优化 */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  .search-input {
    width: 300px;
    
    :deep(.ant-input) {
      border-radius: 8px;
      padding: 8px 16px;
    }
    
    :deep(.ant-input-search-button) {
      border-radius: 0 8px 8px 0;
      height: 40px;
    }
  }
  
  .filter-select {
    width: 200px;
    
    :deep(.ant-select-selector) {
      border-radius: 8px;
      height: 40px;
      padding: 4px 16px;
      
      .ant-select-selection-item {
        line-height: 32px;
      }
    }
  }
}

/* 表格样式优化 */
.table-section {
  :deep(.ant-table) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    .ant-table-thead > tr > th {
      background: #F9FAFB;
      padding: 16px;
      font-weight: 600;
    }
    
    .ant-table-tbody > tr > td {
      padding: 16px;
    }
  }

  :deep(.ant-pagination) {
    .ant-pagination-item-active {
      border-color: #6366F1;
      background: #6366F1;
      
      a {
        color: white;
      }
    }

    .ant-pagination-item:hover,
    .ant-pagination-prev:hover .ant-pagination-item-link,
    .ant-pagination-next:hover .ant-pagination-item-link,
    .ant-pagination-jump-prev:hover .ant-pagination-item-link,
    .ant-pagination-jump-next:hover .ant-pagination-item-link {
      border-color: #6366F1;
      color: #6366F1;
    }

    .ant-select:hover .ant-select-selector {
      border-color: #6366F1;
    }

    .ant-select-focused .ant-select-selector {
      border-color: #6366F1 !important;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }
}

/* 指标单元格样式优化 */
.metrics-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  span {
    display: inline-flex;
    align-items: center;
    background: #F3F4F6;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: #374151;
    font-weight: 500;
    
    &:hover {
      background: #E5E7EB;
    }
  }
}

/* 添加响应式阴影效果 */
.stat-item, :deep(.ant-tag), .metrics-cell span {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* Priority legend styles */
.priority-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #4B5563;
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .text {
      white-space: nowrap;
    }
  }
  
  .p0-legend .dot {
    background: linear-gradient(135deg, #10B981, #059669);
  }
  
  .p1-legend .dot {
    background: linear-gradient(135deg, #6366F1, #1890ff);
  }
  
  .p2-legend .dot {
    background: linear-gradient(135deg, #F59E0B, #D97706);
  }
  
  .p3-legend .dot {
    background: linear-gradient(135deg, #EF4444, #DC2626);
  }
}
</style>
