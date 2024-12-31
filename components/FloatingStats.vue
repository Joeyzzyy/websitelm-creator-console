<template>
  <div class="floating-stats" :class="{ 'is-collapsed': isCollapsed }">
    <div class="stats-header">
      <h3 class="section-title" v-if="!isCollapsed">Content Analysis</h3>
      <a-button 
        v-if="!isCollapsed"
        type="text" 
        size="small"
        :loading="refreshing"
        @click="handleRefresh"
      >
        <template #icon><ReloadOutlined /></template>
      </a-button>
      <div class="toggle-button" @click="toggleCollapse">
        <BarChartOutlined v-if="isCollapsed" />
        <CloseOutlined v-else />
      </div>
    </div>

    <div class="stats-content" v-show="!isCollapsed">
      <div class="metrics-grid">
        <!-- Word Count Card -->
        <div class="metric-card word-count-card">
          <div class="metric-icon">
            <FileTextOutlined />
          </div>
          <div class="metric-info">
            <span class="metric-label">Total Words</span>
            <span class="metric-value">{{ keywordsStats.wordCount }}</span>
          </div>
        </div>

        <!-- Keywords Coverage -->
        <div class="metric-card keywords-coverage-card">
          <div class="metric-icon">
            <TagsOutlined />
          </div>
          <div class="metric-info">
            <span class="metric-label">Keywords Coverage</span>
            <span class="metric-value">{{ keywordsCoverage }}%</span>
            <span class="metric-subtitle">{{ keywordsStats.keywords.length }} of {{ keywordsStats.genKeyword.length }}</span>
          </div>
        </div>

        <!-- Keywords Analysis -->
        <div class="keywords-section">
          <div class="section-header">
            <span class="section-title">Keywords Analysis</span>
          </div>
          
          <!-- Keywords Stats Table -->
          <div class="keywords-table">
            <div class="table-header">
              <span class="keyword-col">Keyword</span>
              <span class="count-col">Count</span>
              <span class="density-col">Density</span>
            </div>
            <div class="table-body">
              <div v-for="stat in keywordsStats.keywordStats" :key="stat.keyword" class="table-row">
                <span class="keyword-col" :class="{ 'matched-keyword': keywordsStats.keywords.includes(stat.keyword) }">
                  {{ stat.keyword }}
                </span>
                <span class="count-col">{{ stat.wordCount }}</span>
                <span class="density-col">{{ formatDensity(stat.density) }}%</span>
              </div>
            </div>
          </div>

          <!-- Missing Keywords -->
          <div v-if="missingKeywords.length > 0" class="missing-keywords">
            <div class="missing-keywords-header">
              <span class="section-subtitle">Missing Keywords</span>
              <a-tooltip title="Keywords that haven't been used in the content">
                <InfoCircleOutlined />
              </a-tooltip>
            </div>
            <div class="missing-keywords-list">
              <a-tag v-for="keyword in missingKeywords" :key="keyword">
                {{ keyword }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { 
  BarChartOutlined,
  CloseOutlined,
  ReloadOutlined,
  FileTextOutlined,
  TagsOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'FloatingStats',
  
  components: {
    BarChartOutlined,
    CloseOutlined,
    ReloadOutlined,
    FileTextOutlined,
    TagsOutlined,
    InfoCircleOutlined
  },

  props: {
    keywordsStats: {
      type: Object,
      default: () => ({
        genKeyword: [],
        wordCount: 0,
        keywords: [],
        keywordStats: []
      })
    }
  },

  emits: ['refresh'],

  setup(props, { emit }) {
    const isCollapsed = ref(false);
    const refreshing = ref(false);

    // 在入口处打印完整的传入数据
    console.log('FloatingStats 接收到的完整数据：', {
      wordCount: props.keywordsStats.wordCount,
      genKeyword: props.keywordsStats.genKeyword,
      keywords: props.keywordsStats.keywords,
      keywordStats: props.keywordsStats.keywordStats
    });

    // 打印关键词统计详情
    console.log('关键词统计详情：');
    props.keywordsStats.keywordStats?.forEach(stat => {
      console.log(`${stat.keyword}: ${stat.wordCount}次, 密度${stat.density.toFixed(2)}%`);
    });

    // 计算关键词覆盖率
    const keywordsCoverage = computed(() => {
      const total = props.keywordsStats.genKeyword.length;
      const matched = props.keywordsStats.keywords.length;
      return total > 0 ? Math.round((matched / total) * 100) : 0;
    });

    // 计算未使用的关键词
    const missingKeywords = computed(() => {
      return props.keywordsStats.genKeyword.filter(
        keyword => !props.keywordsStats.keywords.includes(keyword)
      );
    });

    const formatDensity = (density) => {
      return density.toFixed(2);
    };

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const handleRefresh = async () => {
      refreshing.value = true;
      try {
        // 刷新整个页面
        window.location.reload();
      } catch (error) {
        console.error('刷新页面失败:', error);
      } finally {
        refreshing.value = false;
      }
    };

    // 添加 watch 来监控数据变化
    watch(() => props.keywordsStats, (newStats) => {
      console.log('数据更新 - 新的统计数据：', {
        wordCount: newStats.wordCount,
        genKeyword: newStats.genKeyword,
        keywords: newStats.keywords,
        keywordStats: newStats.keywordStats
      });
    }, { deep: true });

    return {
      isCollapsed,
      refreshing,
      toggleCollapse,
      handleRefresh,
      keywordsCoverage,
      missingKeywords,
      formatDensity
    };
  }
});
</script>

<style scoped>
.floating-stats {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 420px;
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

.stats-header {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  flex-grow: 1;
}

.toggle-button {
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.stats-content {
  padding: 0 16px 16px;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 12px;
}

.word-count-card,
.keywords-coverage-card {
  background: #f0f9ff;
  border-color: #38BDF8;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 8px;
  color: #38BDF8;
}

.metric-info {
  flex-grow: 1;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.metric-value {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.metric-subtitle {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.keywords-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.keywords-table {
  font-size: 13px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-weight: 500;
}

.table-body {
  max-height: 200px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.keyword-col {
  padding-right: 8px;
}

.count-col,
.density-col {
  text-align: center;
}

.matched-keyword {
  color: #0284c7;
  font-weight: 500;
}

.missing-keywords {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.missing-keywords-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.missing-keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

:deep(.ant-tag) {
  margin: 0;
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}
</style>