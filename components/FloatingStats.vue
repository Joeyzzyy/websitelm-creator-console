<template>
  <div class="floating-stats" :class="{ 'is-collapsed': isCollapsed }">
    <div class="stats-header">
      <h3 class="section-title" v-if="!isCollapsed">Content Analysis</h3>
      <a-button 
        v-if="!isCollapsed"
        type="text" 
        size="small"
        :loading="refreshing"
        @click="handleRefreshConfirm"
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
    defaultCollapsed: {
      type: Boolean,
      default: true  // 默认为折叠状态
    }
  },

  emits: ['refresh'],

  setup(props, { emit }) {
    const isCollapsed = ref(props.defaultCollapsed);
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

    const handleRefreshConfirm = () => {
      // 使用 ant-design-vue 的 Modal.confirm
      Modal.confirm({
        title: 'Refresh Page',
        content: 'Refreshing will reload the current page. Please make sure you have saved your changes.',
        okText: 'Refresh',
        cancelText: 'Cancel',
        async onOk() {
          refreshing.value = true;
          try {
            window.location.reload();
          } catch (error) {
            console.error('Failed to refresh page:', error);
          } finally {
            refreshing.value = false;
          }
        }
      });
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

    // 添加标题统计的计算属性
    const headingStats = computed(() => {
      const stats = {
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
        h5: 0
      };

      props.sections.forEach(section => {
        const sectionType = section.componentName;  // 改用 componentName 替代 type
        const sectionTags = SECTION_TAGS[sectionType] || {};
        
        console.log('Processing section:', {
          componentName: sectionType,
          tags: sectionTags,
          sectionData: section
        });

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

      console.log('Final heading stats:', stats);
      return stats;
    });

    // 添加按组件分类的标题统计
    const componentHeadingStats = computed(() => {
      // 在入口处打印完整的传入数据
      console.log('FloatingStats 接收到的完整数据：', {
        sections: props.sections
      });
      
      const stats = {};
      
      props.sections.forEach(section => {
        const componentName = section.componentName;
        const sectionTags = SECTION_TAGS[componentName] || {};
        
        // 打印每个 section 的信息
        console.log('处理 section:', {
          componentName,
          tags: sectionTags,
          sectionData: section
        });

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

      // 打印最终统计结果
      console.log('最终统计结果:', stats);
      
      // 修改过滤逻辑：直接返回 stats，因为已经有数据了
      return stats;
    });

    return {
      isCollapsed,
      refreshing,
      toggleCollapse,
      handleRefreshConfirm,
      keywordsCoverage,
      missingKeywords,
      formatDensity,
      headingStats,
      componentHeadingStats,
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
  max-height: calc(100vh - 180px);
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.floating-stats.is-collapsed {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4F46E5, #38BDF8);
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.floating-stats.is-collapsed .stats-header {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.floating-stats.is-collapsed .toggle-button {
  color: #ffffff;
}

.floating-stats.is-collapsed:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(79, 70, 229, 0.4);
  background: linear-gradient(135deg, #6366F1, #60A5FA);
}

.stats-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
  max-height: calc(100vh - 280px);
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
</style>