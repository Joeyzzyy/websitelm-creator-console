<template>
  <div class="floating-stats" :class="{ 'is-collapsed': isCollapsed }">
    <div class="stats-header">
      <!-- 标题移到最左侧 -->
      <h3 class="section-title" v-if="!isCollapsed">Basic Statistics</h3>

      <!-- 刷新按钮紧跟标题 -->
      <a-button 
        v-if="!isCollapsed"
        type="text" 
        size="small"
        :loading="refreshing"
        @click="handleRefresh"
      >
        <template #icon><ReloadOutlined /></template>
      </a-button>

      <!-- 关闭按钮保持在右侧 -->
      <div class="toggle-button" @click="toggleCollapse">
        <BarChartOutlined v-if="isCollapsed" />
        <CloseOutlined v-else />
      </div>
    </div>

    <div class="stats-content" v-show="!isCollapsed">
      <div class="metrics-grid">
        <!-- Headings 统计 -->
        <div class="metric-card headings-card">
          <div class="metric-icon">
            <UnorderedListOutlined />
          </div>
          <div class="metric-info">
            <div class="heading-stats">
              <div class="heading-stat">
                <span class="stat-label">H1</span>
                <span class="stat-value">{{ metrics.h1Count }}</span>
              </div>
              <div class="heading-stat">
                <span class="stat-label">H2</span>
                <span class="stat-value">{{ metrics.h2Count }}</span>
              </div>
              <div class="heading-stat">
                <span class="stat-label">H3</span>
                <span class="stat-value">{{ metrics.h3Count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Paragraphs 和 Images -->
        <div class="metric-row">
          <div class="metric-card">
            <div class="metric-icon">
              <AlignLeftOutlined />
            </div>
            <div class="metric-info">
              <span class="metric-label">Paragraphs</span>
              <span class="metric-value">{{ metrics.paragraphsCount }}</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">
              <PictureOutlined />
            </div>
            <div class="metric-info">
              <span class="metric-label">Images</span>
              <span class="metric-value">{{ metrics.imagesCount }}</span>
            </div>
          </div>
        </div>

        <!-- Word Count -->
        <div class="metric-card word-count-card">
          <div class="metric-icon">
            <FileTextOutlined />
          </div>
          <div class="metric-info">
            <span class="metric-label">Total Words</span>
            <span class="metric-value">{{ metrics.wordCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { 
  BarChartOutlined,
  CloseOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PictureOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'FloatingStats',
  
  components: {
    BarChartOutlined,
    CloseOutlined,
    ReloadOutlined,
    FileTextOutlined,
    PictureOutlined,
    UnorderedListOutlined,
    AlignLeftOutlined,
  },

  props: {
    metrics: {
      type: Object,
      required: true
    },
    keywordsStats: {
      type: Object,
      default: () => ({
        genKeyword: [],
        keywordStats: []
      })
    }
  },

  emits: ['refresh'],

  setup(props, { emit }) {
    const isCollapsed = ref(false);
    const refreshing = ref(false);

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const handleRefresh = async () => {
      refreshing.value = true;
      await emit('refresh');
      refreshing.value = false;
    };

    return {
      isCollapsed,
      refreshing,
      toggleCollapse,
      handleRefresh
    };
  }
});
</script>

<style scoped>
.floating-stats {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s ease;
}

.floating-stats.is-collapsed {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}

.toggle-button {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
  z-index: 2;
}

/* 添加折叠状态下的按钮样式 */
.is-collapsed .toggle-button {
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  width: 48px;
  height: 48px;
  font-size: 20px;
  color: #38BDF8;
}

.toggle-button:hover {
  color: #38BDF8;
}

.stats-content {
  padding: 16px;
}

/* 复用原有的统计样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.metric-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 6px;
  color: #38BDF8;
  font-size: 14px;
}

.metric-info {
  flex: 1;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 1px;
}

.metric-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.headings-card .heading-stats {
  display: flex;
  gap: 12px;
}

.heading-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.word-count-card {
  background: #f0f9ff;
  border-color: #38BDF8;
}

.word-count-card .metric-value {
  color: #0284c7;
}

.stats-header {
  display: flex;
  align-items: center;
  padding: 12px 12px 0;
  gap: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  /* 移除文本居中对齐 */
  text-align: left;
}

.toggle-button {
  cursor: pointer;
  color: #666;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.is-collapsed .stats-header {
  padding: 0;
}

.is-collapsed .toggle-button {
  width: 100%;
  height: 100%;
  color: #38BDF8;
  font-size: 20px;
}

/* 调整内容区域的padding */
.stats-content {
  padding: 12px 16px 16px;
}
</style> 