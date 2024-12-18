<template>
  <div class="page-skeleton">
    <!-- 标签页骨架 -->
    <div v-if="showTabs" class="tabs-skeleton">
      <div class="tab-items">
        <div 
          class="tab-item" 
          v-for="i in tabCount" 
          :key="i"
        >
          <a-skeleton-button :active="true" size="small" />
        </div>
      </div>
      <a-skeleton-button 
        v-if="showAction" 
        :active="true" 
        size="small" 
        class="action-btn" 
      />
    </div>

    <!-- 内容区域骨架 -->
    <div class="content-skeleton">
      <!-- 网格布局骨架 -->
      <template v-if="layout === 'grid'">
        <a-row :gutter="[16, 16]">
          <a-col 
            v-for="i in itemCount" 
            :key="i" 
            v-bind="colSpan"
          >
            <div class="skeleton-card">
              <template v-if="cardType === 'media'">
                <a-skeleton-image class="skeleton-preview" />
                <div class="card-info">
                  <a-skeleton :paragraph="false" :active="true">
                    <template #title>
                      <h4 class="skeleton-title"></h4>
                    </template>
                  </a-skeleton>
                  <a-skeleton-input class="skeleton-description" active size="small" />
                </div>
              </template>
              
              <template v-else-if="cardType === 'task'">
                <div class="task-header">
                  <a-skeleton-input :active="true" size="small" class="task-title" />
                  <a-skeleton-button :active="true" size="small" class="task-status" />
                </div>
                <a-skeleton :active="true" :paragraph="{ rows: 2 }" class="task-content" />
              </template>

              <template v-else-if="cardType === 'planner'">
                <div class="planner-header">
                  <a-skeleton-input :active="true" size="small" class="planner-title" />
                  <a-skeleton :active="true" :paragraph="{ rows: 1 }" />
                </div>
                <a-skeleton-image class="planner-preview" />
              </template>
            </div>
          </a-col>
        </a-row>
      </template>

      <!-- 列表布局骨架 -->
      <template v-else-if="layout === 'list'">
        <div class="list-skeleton">
          <div 
            v-for="i in itemCount" 
            :key="i" 
            class="list-item-skeleton"
          >
            <a-skeleton :active="true" :paragraph="{ rows: 1 }" />
          </div>
        </div>
      </template>

      <!-- 表格布局骨架 -->
      <template v-else-if="layout === 'table'">
        <a-skeleton :active="true" :paragraph="{ rows: itemCount }" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageSkeleton',
  props: {
    // 布局类型: 'grid' | 'list' | 'table'
    layout: {
      type: String,
      default: 'grid'
    },
    // 卡片类型: 'media' | 'task' | 'planner'
    cardType: {
      type: String,
      default: 'media'
    },
    // 是否显示标签页
    showTabs: {
      type: Boolean,
      default: true
    },
    // 标签数量
    tabCount: {
      type: Number,
      default: 4
    },
    // 是否显示操作按钮
    showAction: {
      type: Boolean,
      default: true
    },
    // 项目数量
    itemCount: {
      type: Number,
      default: 8
    },
    // 列布局配置
    colSpan: {
      type: Object,
      default: () => ({
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      })
    }
  }
}
</script>

<style scoped>
.page-skeleton {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.tabs-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.tab-items {
  display: flex;
  gap: 32px;
}

.tab-item {
  width: 100px;
}

.action-btn {
  width: 120px !important;
}

/* 卡片通用样式 */
.skeleton-card {
  height: 100%;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
}

/* 媒体卡片样式 */
.skeleton-preview {
  height: 160px !important;
  width: 100% !important;
}

.card-info {
  padding: 12px;
}

.skeleton-title {
  height: 20px;
  margin: 8px 0;
}

.skeleton-description {
  width: 100%;
  height: 16px !important;
  margin-top: 8px;
}

/* 任务卡片样式 */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.task-title {
  width: 60% !important;
}

.task-status {
  width: 80px !important;
}

/* 计划卡片样式 */
.planner-header {
  margin-bottom: 16px;
}

.planner-title {
  width: 70% !important;
  margin-bottom: 8px;
}

.planner-preview {
  height: 120px !important;
}

/* 列表样式 */
.list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-item-skeleton {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

/* Ant Design 深度选择器覆盖 */
:deep(.ant-skeleton-image) {
  width: 100% !important;
  height: 100% !important;
  border-radius: 0;
  margin: 0;
}

:deep(.ant-skeleton-title) {
  margin: 0 !important;
}

:deep(.ant-skeleton-button) {
  min-width: unset !important;
}

:deep(.ant-skeleton-paragraph) {
  margin: 0 !important;
}
</style> 