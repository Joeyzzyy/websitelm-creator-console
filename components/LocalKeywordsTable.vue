<template>
  <div class="keywords-table-wrapper">
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      size="small"
      :pagination="{ 
        current: pagination?.current || 1,
        pageSize: pagination?.pageSize || 10,
        total: pagination?.total || 0,
        showSizeChanger: true,
        showTotal: total => `${total} Records in Total`
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text }">
        <!-- Search Volume Column -->
        <template v-if="column.dataIndex === 'SV'">
          <span>{{ formatNumber(text) }}</span>
        </template>
        
        <!-- Difficulty Column -->
        <template v-if="column.dataIndex === 'KD'">
          <span :style="{ color: getDifficultyColor(text) }" class="difficulty-value">
            {{ text ? `${text}` : '-' }}
          </span>
        </template>

        <!-- SERP Features Column -->
        <template v-if="column.dataIndex === 'SERPFeatures'">
          <div class="serp-features">
            <a-tooltip v-if="text" :title="text">
              <div class="serp-tags">
                {{ text.split(',')[0] }}...
              </div>
            </a-tooltip>
            <span v-else>-</span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
// 分别定义两列的筛选选项
const originalPriorityOptions = [
  { text: '核心关键词', value: '核心关键词' },
  { text: 'P1', value: 'P1' },
  { text: 'P2', value: 'P2' },
  { text: 'P3', value: 'P3' },
  { text: 'P4', value: 'P4' }
]

const recommendedPriorityOptions = [
  { text: 'Core', value: 'Core' },
  { text: 'P1', value: 'P1' },
  { text: 'P2', value: 'P2' },
  { text: 'P3', value: 'P3' },
  { text: 'P4', value: 'P4' }
]

const columns = [
  {
    title: 'Keyword',
    dataIndex: 'Keyword',
    width: 300,
    fixed: 'left',
  },
  {
    title: 'Keyword Category',
    dataIndex: 'Category',
    width: 130,
  },
  {
    title: 'Search Volume',
    dataIndex: 'SV',
    width: 120,
    sorter: (a, b) => a.SV - b.SV,
  },
  {
    title: 'Difficulty',
    dataIndex: 'KD',
    width: 120,
    sorter: (a, b) => a.KD - b.KD,
  },
  {
    title: 'SERP Features',
    dataIndex: 'SERPFeatures',
    width: 200,
  },
  {
    title: 'Original Priority',
    dataIndex: 'OriginalPriority',
    width: 130,
    filters: originalPriorityOptions,
    onFilter: (value, record) => {
      if (value === '核心关键词') {
        return record.OriginalPriority === '核心关键词'
      }
      return record.OriginalPriority === value
    },
    filterMultiple: true
  },
  {
    title: 'Recommended Priority',
    dataIndex: 'RecommendedPriority',
    width: 150,
    filters: recommendedPriorityOptions,
    onFilter: (value, record) => {
      if (value === 'Core') {
        return record.RecommendedPriority === 'Core'
      }
      return record.RecommendedPriority === value
    },
    filterMultiple: true
  },
  {
    title: 'Competitor URL',
    dataIndex: 'CompetitorURL',
    width: 250,
    ellipsis: true,
  }
]

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['change'])

// 修改表格变化处理函数
const handleTableChange = (pag, filters, sorter) => {
  console.log('表格变化:', pag)
  emit('change', {
    current: pag.current,
    pageSize: pag.pageSize,
    total: props.pagination?.total
  })
}

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '-'
  return new Intl.NumberFormat().format(num)
}

// 修改难度颜色逻辑
const getDifficultyColor = (value) => {
  if (!value) return '#d9d9d9'
  if (value >= 80) return '#ff4d4f' // 高难度 - 红色
  if (value >= 60) return '#ffa940' // 中高难度 - 橙色
  if (value >= 40) return '#fadb14' // 中等难度 - 黄色
  return '#52c41a'                  // 低难度 - 绿色
}

// 修改优先级颜色映射函数
const getPriorityColor = (priority) => {
  switch (priority) {
    case '核心关键词':
    case 'Core':
      return 'purple'
    case 'P1':
      return 'blue'
    case 'P2':
      return 'cyan'
    case 'P3':
      return 'green'
    case 'P4':
      return 'orange'
    default:
      return 'default'
  }
}
</script>

<style scoped>
.keywords-table-wrapper {
  position: relative;
  width: 100%;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.serp-features {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.serp-tags {
  cursor: pointer;
  color: #1890ff;
}

.difficulty-value {
  font-weight: 500;
}

:deep(.ant-progress) {
  flex: 1;
  margin: 0;
}

:deep(.ant-progress-bg) {
  height: 8px !important;
}

:deep(.ant-table-thead > tr > th) {
  padding: 8px 16px !important;
  background: #F9FAFB;
  font-weight: 600;
  color: #374151;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 8px 16px !important;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #F9FAFB;
}

:deep(.ant-table-content) {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

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

/* 基础标签样式 */
:deep(.ant-tag) {
  margin: 0;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 优先级标签样式 */
:deep(.priority-tag-purple) {
  color: #722ED1;
  background: #F9F0FF;
  border-color: #D3ADF7;
}

:deep(.priority-tag-blue) {
  color: #1677FF;
  background: #E6F4FF;
  border-color: #91CAFF;
}

:deep(.priority-tag-cyan) {
  color: #13C2C2;
  background: #E6FFFB;
  border-color: #87E8DE;
}

:deep(.priority-tag-green) {
  color: #52C41A;
  background: #F6FFED;
  border-color: #B7EB8F;
}

:deep(.priority-tag-orange) {
  color: #FA8C16;
  background: #FFF7E6;
  border-color: #FFD591;
}
</style> 