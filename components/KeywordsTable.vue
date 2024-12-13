<template>
  <div class="keywords-table-wrapper">
    <a-table
      v-if="isTableReady"
      :columns="columns"
      :data-source="tableData"
      :pagination="{ 
        current: pagination?.current || 1,
        pageSize: 10,
        total: pagination?.total || 0,
        showTotal: total => `${total} Records In Total`,
        onChange: handlePageChange,
        class: 'custom-pagination'
      }"
      :loading="loading"
      size="small"
      :key="tableKey"
    >
      <template #keyword="{ text }">
        <span class="keyword-cell">{{ text }}</span>
      </template>
      
      <template #rankingCell="{ record, column }">
        <span>
          {{ record[column.dataIndex] }}
        </span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, nextTick } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => []
    },
    competitorName: {
      type: String,
      default: ''
    },
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        pageSize: 15,
        total: 0
      })
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['change'],
  
  setup(props, { emit }) {
    const tableKey = ref(0)
    const isTableReady = ref(true)
    
    // Improve data change handling
    const handleDataChange = async () => {
      try {
        isTableReady.value = false
        await nextTick()
        tableKey.value += 1
        isTableReady.value = true
      } catch (error) {
        console.error('Data update error:', error)
        isTableReady.value = true
      }
    }
    
    // Watch for data changes
    watch(() => props.data, handleDataChange, { deep: true })
    watch(() => props.competitorName, handleDataChange)

    // 添加数据监听来查看源数据结构
    watch(() => props.data, (newData) => {
    }, { immediate: true })

    const columns = computed(() => [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        fixed: 'left',
        width: 250,
        slots: { customRender: 'keyword' }
      },
      {
        title: 'Search Intent',
        dataIndex: 'intents',
        width: 150
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        width: 120,
        sorter: (a, b) => (a?.volume || 0) - (b?.volume || 0),
      },
      {
        title: 'KD',
        dataIndex: 'difficulty',
        width: 100,
        sorter: (a, b) => (a?.difficulty || 0) - (b?.difficulty || 0),
      },
      {
        title: 'Competition',
        dataIndex: 'competition',
        width: 120,
        sorter: (a, b) => (a?.competition || 0) - (b?.competition || 0),
        customRender: ({ text }) => text ? Number(text).toFixed(2) : '0.00'
      },
      {
        title: 'Kreado AI',
        dataIndex: 'kreadoai.com',
        width: 100,
        slots: { customRender: 'rankingCell' }
      },
      {
        title: 'HeyGen',
        dataIndex: 'heygen.com',
        width: 100,
        slots: { customRender: 'rankingCell' }
      },
      {
        title: 'D-ID',
        dataIndex: 'd-id.com',
        width: 100,
        slots: { customRender: 'rankingCell' }
      },
      {
        title: 'Synthesia',
        dataIndex: 'synthesia.io',
        width: 100,
        slots: { customRender: 'rankingCell' }
      },
      {
        title: 'Creatify',
        dataIndex: 'creatify.ai',
        width: 100,
        slots: { customRender: 'rankingCell' }
      },
      {
        title: 'Results',
        dataIndex: 'results',
        width: 100,
        sorter: (a, b) => (a?.results || 0) - (b?.results || 0),
      }
    ])

    const tableData = computed(() => {
      return Array.isArray(props.data) ? props.data.map(item => ({
        key: Math.random().toString(36).substr(2, 9),
        keyword: item.keyword || item.Keyword,
        intents: item.intents || item.Intents,
        volume: item.volume || item.Volume,
        difficulty: item.difficulty || item['Keyword Difficulty'],
        cpc: item.cpc || item.CPC,
        competition: item.competition || item['Competition Density'],
        'kreadoai.com': item['kreadoai.com'],
        'heygen.com': item['heygen.com'],
        'd-id.com': item['d-id.com'],
        'synthesia.io': item['synthesia.io'],
        'creatify.ai': item['creatify.ai'],
        results: item.results || item.Results
      })) : []
    })

    const getRankingClass = (ranking) => {
      if (ranking === undefined || ranking === null) return 'no-rank'
      const rank = Number(ranking)
      if (isNaN(rank)) return 'no-rank'
      if (rank <= 3) return 'excellent'
      if (rank <= 10) return 'good'
      if (rank <= 30) return 'fair'
      return 'poor'
    }

    const formatRanking = (ranking) => {
      if (ranking === undefined || ranking === null) return 'N/A'
      return String(ranking)
    }

    // 处理分页变化
    const handlePageChange = (page, pageSize) => {
      emit('change', {
        current: page,
        pageSize: pageSize
      })
    }

    return {
      columns,
      tableData,
      getRankingClass,
      formatRanking,
      tableKey,
      isTableReady,
      handlePageChange
    }
  }
})
</script>

<style scoped>
.keywords-table-wrapper {
  position: relative;
  width: 100%;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.keyword-cell {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.rankings-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.competitor-ranking {
  display: flex;
  align-items: center;
  gap: 8px;
}

.competitor-name {
  min-width: 80px;
  font-size: 12px;
  color: #6B7280;
}

.ranking {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.excellent {
  background: #ECFDF5;
  color: #059669;
  border: 1px solid #A7F3D0;
}

.good {
  background: #EFF6FF;
  color: #3B82F6;
  border: 1px solid #BFDBFE;
}

.fair {
  background: #FEF3C7;
  color: #D97706;
  border: 1px solid #FDE68A;
}

.poor {
  background: #FEE2E2;
  color: #DC2626;
  border: 1px solid #FECACA;
}

.no-rank {
  background: #F3F4F6;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

/* Hover effects */
.ranking:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Table header styles */
:deep(.ant-table-thead > tr > th) {
  background: #F9FAFB;
  font-weight: 600;
  color: #374151;
}

/* Table row hover effect */
:deep(.ant-table-tbody > tr:hover > td) {
  background: #F9FAFB;
}

/* 添加以下样式来优化表格在小屏幕下的展示 */
:deep(.ant-table-content) {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}

/* 分页样式 */
:deep(.ant-table-pagination.ant-pagination) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  margin: 16px 0 !important;
  position: sticky;
  right: 0;
  background: white;
}

:deep(.ant-pagination-item),
:deep(.ant-pagination-prev),
:deep(.ant-pagination-next) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 8px !important;
  margin: 0 4px !important;
  min-width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  border: 1px solid #E5E7EB !important;
}

:deep(.ant-pagination-item-active) {
  background: #1890ff !important;
  border-color: #1890ff !important;
}

:deep(.ant-pagination-item-active a) {
  color: white !important;
}

:deep(.ant-pagination-options) {
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-select-selector) {
  height: 32px !important;
  border-radius: 8px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 30px !important;
}

:deep(.ant-pagination-options-quick-jumper input) {
  height: 32px !important;
  border-radius: 8px !important;
  margin: 0 8px !important;
}
</style> 