<template>
  <div class="priority-table-container">
    <a-table
      :columns="columns"
      :data-source="data"
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
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PriorityGroupTable',
  props: {
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
  },
  
  emits: ['change'],
  
  setup(props, { emit }) {
    const columns = [
      {
        title: 'Keyword',
        dataIndex: 'Keyword',
        key: 'keyword',
        sorter: true
      },
      {
        title: 'Original Priority',
        dataIndex: 'OriginalPriority',
        key: 'priority'
      },
      {
        title: 'Volume',
        dataIndex: 'Volume',
        key: 'volume',
        sorter: true
      },
      {
        title: 'Difficulty',
        dataIndex: 'Difficulty',
        key: 'difficulty',
        sorter: true
      },
      {
        title: 'Intent',
        dataIndex: 'Intent',
        key: 'intent'
      },
      {
        title: 'CPC',
        dataIndex: 'CPC',
        key: 'cpc',
        sorter: true
      }
    ]

    const handlePageChange = (page, pageSize) => {
      emit('change', {
        pagination: {
          current: page,
          pageSize: pageSize
        }
      })
    }

    return {
      columns,
      handlePageChange
    }
  }
})
</script>

<style scoped>
.priority-table-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

/* 表格样式 */
:deep(.ant-table-thead > tr > th) {
  background: #F9FAFB;
  font-weight: 600;
  color: #374151;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #F9FAFB;
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

/* 表格内容横向滚动 */
:deep(.ant-table-content) {
  overflow-x: auto;
}
</style> 