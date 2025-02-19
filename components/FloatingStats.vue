<template>
  <div class="stats-container" :class="{ 'in-modal': isModal }">
    <div class="stats-header">
      <h3 class="section-title">Content Analysis</h3>
      <a-button 
        type="text" 
        size="small"
        :loading="refreshing"
        @click="handleRefreshConfirm"
      >
        <template #icon><ReloadOutlined /></template>
      </a-button>
    </div>

    <div class="stats-content">
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
            <span class="metric-subtitle">
              {{ keywordsStats?.keywords?.length || 0 }} of {{ keywordsStats?.genKeyword?.length || 0 }}
            </span>
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

        <!-- 添加标题统计卡片 -->
        <div class="metric-card headings-card">
          <div class="metric-icon">
            <OrderedListOutlined />
          </div>
          <div class="metric-info">
            <span class="metric-label">Headings</span>
            <div class="headings-stats">
              <span v-for="(count, tag) in headingStats" :key="tag" class="heading-stat">
                {{ tag.toUpperCase() }}: {{ count }}
              </span>
            </div>
          </div>
        </div>

        <!-- 在 keywords-section 后添加新的组件统计部分 -->
        <div class="component-headings-section">
          <div class="section-header">
            <span class="section-title">Component Headings</span>
          </div>
          <div class="component-stats">
            <div v-for="(stats, component) in componentHeadingStats" 
                 :key="component" 
                 class="component-stat-card">
              <div class="component-name">{{ component }}</div>
              <div class="component-heading-stats">
                <template v-for="(count, tag) in stats" :key="tag">
                  <span v-if="count > 0" 
                        class="heading-stat">
                    {{ tag.toUpperCase() }}: {{ count }}
                  </span>
                </template>
              </div>
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
  InfoCircleOutlined,
  OrderedListOutlined
} from '@ant-design/icons-vue';
import { SECTION_TAGS } from './sections/common/SectionTag';  // 引入 SECTION_TAGS
import { Modal } from 'ant-design-vue';

export default defineComponent({
  name: 'FloatingStats',
  
  components: {
    BarChartOutlined,
    CloseOutlined,
    ReloadOutlined,
    FileTextOutlined,
    TagsOutlined,
    InfoCircleOutlined,
    OrderedListOutlined
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
    },
    sections: {  // 添加新的 prop
      type: Array,
      default: () => []
    },
    isModal: {
      type: Boolean,
      default: false
    }
  },

  emits: ['refresh'],

  setup(props, { emit }) {
    const refreshing = ref(false);

    const keywordsCoverage = computed(() => {
      if (!props.keywordsStats?.genKeyword || !props.keywordsStats?.keywords) {
        return 0;
      }
      
      const total = props.keywordsStats.genKeyword.length;
      const matched = props.keywordsStats.keywords.length;
      return total > 0 ? Math.round((matched / total) * 100) : 0;
    });

    const missingKeywords = computed(() => {
      if (!props.keywordsStats?.genKeyword || !props.keywordsStats?.keywords) {
        return [];
      }
      
      return props.keywordsStats.genKeyword.filter(
        keyword => !props.keywordsStats.keywords.includes(keyword)
      );
    });

    const formatDensity = (density) => {
      return density.toFixed(2);
    };

    const handleRefreshConfirm = () => {
      Modal.confirm({
        title: 'Refresh Analysis',
        content: 'Do you want to refresh the content analysis?',
        okText: 'Refresh',
        cancelText: 'Cancel',
        async onOk() {
          refreshing.value = true;
          try {
            emit('refresh');
          } catch (error) {
            console.error('Failed to refresh analysis:', error);
          } finally {
            refreshing.value = false;
          }
        }
      });
    };

    const headingStats = computed(() => {
      const stats = {
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
        h5: 0
      };

      props.sections.forEach(section => {
        const sectionType = section.componentName;
        const sectionTags = SECTION_TAGS[sectionType] || {};
        
        // 检查 topContent
        if (section.topContent) {
          Object.entries(section.topContent).forEach(([field, value]) => {
            const tag = sectionTags[field];
            if (tag in stats && value) {
              stats[tag]++;
            }
          });
        }

        // 检查 leftContent
        if (section.leftContent) {
          Object.entries(section.leftContent).forEach(([field, value]) => {
            const tag = sectionTags[field];
            if (tag in stats && value) {
              stats[tag]++;
            }
          });
        }

        // 检查 rightContent
        if (Array.isArray(section.rightContent)) {
          section.rightContent.forEach(content => {
            Object.entries(content).forEach(([field, value]) => {
              const tag = sectionTags[field];
              if (tag in stats && value) {
                stats[tag]++;
              }
            });
          });
        }

        // 检查直接属性
        Object.entries(section).forEach(([field, value]) => {
          const tag = sectionTags[field];
          if (tag in stats && value && typeof value === 'string') {
            stats[tag]++;
          }
        });
      });

      return stats;
    });

    const componentHeadingStats = computed(() => {
      const stats = {};
      
      props.sections.forEach(section => {
        const componentName = section.componentName;
        const sectionTags = SECTION_TAGS[componentName] || {};
        
        // 初始化该组件的统计
        if (!stats[componentName]) {
          stats[componentName] = {
            h1: 0,
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0
          };
        }

        // 统计逻辑与之前相同，但现在按组件分类
        const countHeadings = (content) => {
          if (!content) return;
          
          if (Array.isArray(content)) {
            content.forEach(item => {
              Object.entries(item).forEach(([field, value]) => {
                const tag = sectionTags[field];
                if (tag in stats[componentName] && value && typeof value === 'string') {
                  stats[componentName][tag]++;
                }
              });
            });
            return;
          }
          
          Object.entries(content).forEach(([field, value]) => {
            const tag = sectionTags[field];
            if (tag in stats[componentName] && value && typeof value === 'string') {
              stats[componentName][tag]++;
            }
          });
        };

        // 检查所有可能包含标题的内容
        countHeadings(section.topContent);
        countHeadings(section.leftContent);
        countHeadings(section.rightContent);
        
        // 检查直接属性
        Object.entries(section).forEach(([field, value]) => {
          const tag = sectionTags[field];
          if (tag in stats[componentName] && value && typeof value === 'string') {
            stats[componentName][tag]++;
          }
        });
      });

      return stats;
    });

    // 其他可能需要修改的计算属性
    const keywordStats = computed(() => {
      return props.keywordsStats?.keywordStats || [];
    });

    const genKeywords = computed(() => {
      return props.keywordsStats?.genKeyword || [];
    });

    const wordCount = computed(() => {
      return props.keywordsStats?.wordCount || 0;
    });

    // 如果有使用 keywords 的地方也需要添加空值检查
    const keywords = computed(() => {
      return props.keywordsStats?.keywords || [];
    });

    return {
      refreshing,
      handleRefreshConfirm,
      keywordsCoverage,
      missingKeywords,
      formatDensity,
      headingStats,
      componentHeadingStats,
      keywordStats,
      genKeywords,
      wordCount,
      keywords,
    };
  }
});
</script>

<style scoped>
.stats-container {
  width: 100%;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.stats-container.in-modal {
  border: none;
  box-shadow: none;
}

.stats-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  gap: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  flex-grow: 1;
}

.stats-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
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

.headings-card {
  background: #f0f7ff;
  border-color: #60a5fa;
}

.headings-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.heading-stat {
  font-size: 12px;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.component-headings-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.component-headings-section::-webkit-scrollbar {
  width: 6px;
}

.component-headings-section::-webkit-scrollbar-track {
  background: transparent;
}

.component-headings-section::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.component-headings-section::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

.component-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
}

.component-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.component-heading-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

:deep(.ant-btn-text) {
  padding: 4px;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 添加滚动条样式 */
.stats-content::-webkit-scrollbar {
  width: 6px;
}

.stats-content::-webkit-scrollbar-track {
  background: transparent;
}

.stats-content::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.stats-content::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* 调整弹窗中的样式 */
.in-modal .stats-header {
  background: #f8fafc;
}

.in-modal .stats-content {
  max-height: calc(80vh - 120px);
}
</style>