<template>
  <a-layout style="min-height: 100vh; overflow: visible;">
    <a-layout-content style="padding: 0 12px 12px; overflow: visible;">
      <div class="content-wrapper">
        <div class="section-card">
          <!-- 内容区域的滚动容器 -->
          <div class="scrollable-content">
            <div class="content-container">
              <slot></slot>
            </div>
          </div>
          
          <!-- 固定在底部的内容 -->
          <slot name="footer"></slot>
        </div>
      </div>
    </a-layout-content>

    <!-- 添加新的插槽用于渲染 ModuleTutorial -->
    <slot name="tutorial"></slot>
  </a-layout>
</template>

<script>
export default {
  name: 'PageLayout',
  props: {
    icon: {
      type: String,
      default: '✨'
    }
  }
}
</script>

<style scoped>
.page-header {
  padding: 6px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.gradient-text {
  background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #2563EB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 20px;
  font-weight: 600;
}

.sparkle-icon {
  margin-left: 6px;
  font-size: 18px;
}

.page-description {
  margin: 0;
  color: #6B7280;
  font-size: 12px;
}

/* 内容区域包装器 */
.content-wrapper {
  flex: 1;
  position: relative;
  height: calc(100vh - 40px);
  max-width: 100%;
  overflow: visible;
}

/* 白色卡片区域 */
.section-card {
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 100%;
  overflow: visible;
}

/* 可滚动的内容区域 */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  width: 100%;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.content-container {
  max-width: 100%;
  height: 100%;
  padding: 20px;
}

@media (max-width: 768px) {
  .title-wrapper h2 {
    font-size: 18px;
  }
  
  .page-description {
    font-size: 11px;
  }
  
  .scrollable-content {
    padding: 16px;
  }
  
  .a-layout-content {
    padding: 0 16px 16px;
  }
}

.description-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style> 