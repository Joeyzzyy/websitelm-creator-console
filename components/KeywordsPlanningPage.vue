<template>
  <page-layout
    title="Keyword Planning"
    description="Plan and generate content strategically"
    icon="🎯"
  >
    <!-- Workflow Steps -->
    <a-card class="workflow-card">
      <a-steps :current="currentStep">
        <a-step title="Select Keywords" description="Choose keywords from different modes" />
        <a-step title="Generate Topics" description="Create content topics from keywords" />
        <a-step title="Optimize Titles" description="Generate and optimize page titles" />
        <a-step title="Review & Publish" description="Preview and confirm tasks" />
      </a-steps>
    </a-card>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Left Panel: Keyword Selection -->
      <div class="left-panel" :class="{ 'panel-collapsed': currentStep > 0 }">
        <!-- Mode Selector -->
        <a-card class="mode-selector-card">
          <div class="mode-selector-wrapper">
            <a-radio-group v-model:value="currentMode" button-style="solid" size="large">
              <a-radio-button value="beginner">
                <template #icon><UserOutlined /></template>
                Beginner
              </a-radio-button>
              <a-radio-button value="expert">
                <template #icon><ExperimentOutlined /></template>
                Expert
              </a-radio-button>
            </a-radio-group>
            
            <!-- 移动到这里的按钮 -->
            <div class="header-actions">
              <a-button 
                v-if="currentStep > 0" 
                @click="previousStep"
              >
                <LeftOutlined /> Previous
              </a-button>
              <a-button 
                type="primary" 
                @click="nextStep"
                :disabled="!canProceed"
              >
                {{ currentStep === 3 ? 'Publish' : 'Next' }}
                <RightOutlined />
              </a-button>
            </div>
          </div>
        </a-card>

        <!-- Analytics Overview -->
        <a-card class="analytics-card" :bordered="false">
          <!-- 只在 beginner 模式下显示分析信息 -->
          <template v-if="currentMode === 'beginner'">
            <!-- 第一步：分析概况 -->
            <div class="analysis-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-title">Analysis Overview</div>
                <a-row :gutter="[16, 16]">
                  <a-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">We've analyzed</div>
                      <div class="stat-value compact">2,500 keywords</div>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Compared your site with</div>
                      <div class="stat-value compact">30 of 50 competitor pages</div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>

            <a-divider style="margin: 12px 0" />
            
            <!-- 第二步：发现的问题 -->
            <div class="analysis-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-title">What We Found</div>
                <div class="difference-tags">
                  <a-tag color="red">
                    <InfoCircleOutlined /> 200 keywords you're missing
                  </a-tag>
                  <a-tag color="orange">
                    <WarningOutlined /> 150 keywords need improvement
                  </a-tag>
                  <a-tag color="green">
                    <CheckCircleOutlined /> 80 keywords performing well
                  </a-tag>
                </div>
              </div>
            </div>

            <a-divider style="margin: 12px 0" />

            <!-- 第三步：建议行动 -->
            <div class="analysis-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-title">Next Steps</div>
                <div class="step-description">
                  We've prepared a list of recommended keywords below. Select the ones you want to focus on first.
                </div>
              </div>
            </div>
          </template>
          <!-- expert 模式下不显示任何内容 -->
        </a-card>

        <!-- Selection Status -->
        <a-card 
          v-if="selectedKeywords.length"
          class="selection-card"
          :bordered="false"
        >
          <template #title>
            <span class="card-title">
              <CheckCircleOutlined /> Selected Keywords
            </span>
          </template>
          <a-space direction="vertical" style="width: 100%">
            <div class="selection-header">
              <span class="selection-count">
                {{ selectedKeywords.length }} keywords selected
              </span>
              <a-space>
                <a-button type="link" @click="clearSelection">
                  Clear All
                </a-button>
                <a-button type="primary" @click="exportSelected">
                  <ExportOutlined /> Export
                </a-button>
              </a-space>
            </div>
            <a-divider style="margin: 12px 0" />
            <!-- Selected keywords list -->
          </a-space>
        </a-card>

        <!-- Keyword Selection Component -->
        <div v-if="currentMode === 'beginner'" class="beginner-mode">
          <!-- 选中状态提示 -->
          <a-alert
            v-if="selectedKeywords.length === 0"
            message="Selected Keywords: 0"
            type="info"
            class="selection-alert"
          />

          <!-- 新手友好区域 - 两列布局 -->
          <a-row :gutter="[24, 24]">
            <!-- System Recommendations 列 -->
            <a-col :span="12">
              <a-card title="Keywords From Comparison" class="beginner-card">
                <p class="recommendation-text">We selected "20 easiest keywords" for you</p>
                
                <a-list
                  :data-source="recommendedKeywords"
                  size="small"
                  class="keywords-list"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <div class="keyword-item">
                        <a-space align="start" class="keyword-header">
                          <a-checkbox v-model:checked="item.selected">
                            "{{ item.keyword }}"
                          </a-checkbox>
                          <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                          <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                          <a-tag :color="item.status.color">{{ item.status.text }}</a-tag>
                        </a-space>
                        <div class="keyword-reason">
                          <InfoCircleOutlined /> {{ item.reason }}
                        </div>
                      </div>
                    </a-list-item>
                  </template>
                </a-list>

                <div class="action-buttons">
                  <a-button @click="selectAllRecommended">
                    Select All 20 Keywords
                  </a-button>
                </div>
              </a-card>
            </a-col>

            <!-- Top Pages Optimization Tips 列 -->
            <a-col :span="12">
              <a-card title="Keywords From Top Pages Optimization" class="optimization-card">
                <p class="recommendation-text">★ Found 3 high-traffic pages for optimization:</p>
                
                <a-list
                  :data-source="recommendedKeywords"
                  size="small"
                  class="keywords-list"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <div class="keyword-item">
                        <a-space align="start" class="keyword-header">
                          <a-checkbox v-model:checked="item.selected">
                            "{{ item.keyword }}"
                          </a-checkbox>
                          <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                          <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                          <a-tag :color="item.status.color">{{ item.status.text }}</a-tag>
                        </a-space>
                        <div class="keyword-reason">
                          <InfoCircleOutlined /> {{ item.pageReason }}
                        </div>
                      </div>
                    </a-list-item>
                  </template>
                </a-list>

                <div class="action-buttons">
                  <a-button @click="selectAllPages">
                    Select All {{ getTotalPageKeywords }} Keywords
                  </a-button>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>

      <!-- Right Panel: Workspace -->
      <div class="right-panel" v-show="currentStep > 0">
        <a-card 
          :bordered="false"
          class="workspace-card"
        >
          <template #title>
            <span class="card-title">
              {{ workspaceTitle }}
            </span>
          </template>
          
          <!-- Workspace Content -->
          <component
            :is="currentWorkspaceComponent"
            :keywords="selectedKeywords"
            :topics="generatedTopics"
            :titles="optimizedTitles"
            @update:data="handleWorkspaceUpdate"
          />
        </a-card>
      </div>
    </div>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import BeginnerMode from './BeginnerMode.vue'
// import ExpertMode from './keyword-modes/ExpertMode.vue'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  components: {
    PageLayout,
    BeginnerMode,
    // ExpertMode
  },
  setup() {
    const currentMode = ref('beginner')
    const selectedKeywords = ref([])
    
    const overviewData = ref({
      totalKeywords: 1234,
      keywordsChange: 15,
      ourTopPages: 45,
      competitorTopPages: 67,
      categories: {
        missing: 234,
        weak: 345,
        strong: 655
      }
    })

    const currentModeComponent = computed(() => {
      const modes = {
        beginner: 'BeginnerMode',
        expert: 'ExpertMode'
      }
      return modes[currentMode.value]
    })

    const getCategoryPercent = (category) => {
      const total = Object.values(overviewData.value.categories).reduce((a, b) => a + b, 0)
      return Math.round((overviewData.value.categories[category] / total) * 100)
    }

    const viewSelected = () => {
      // Implement view selected keywords logic
    }

    const clearSelection = () => {
      selectedKeywords.value = []
    }

    const exportSelected = () => {
      // Implement export logic
    }

    // 添加新的数据结构
    const overviewStats = ref({
      totalKeywords: 2500,
      ourTopPages: 30,
      competitorPages: 50
    })

    const categories = ref([
      { name: 'Missing', count: 200, color: 'red' },
      { name: 'Weak', count: 150, color: 'orange' },
      { name: 'Strong', count: 80, color: 'green' },
      { name: 'Common', count: 300, color: 'blue' },
      { name: 'Unique', count: 40, color: 'purple' }
    ])

    const recommendedKeywords = ref([
      {
        keyword: 'cloud storage',
        kd: 35,
        volume: 1200,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        reason: 'Low competition (KD=35) with high search volume. Your competitors rank well for this term.',
        pageReason: 'This keyword appears in your top page "/cloud-guide" but is not optimized.'
      },
      {
        keyword: 'online backup',
        kd: 40,
        volume: 900,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        reason: 'You already rank on page 2. Small optimization could bring big traffic gains.',
        pageReason: 'Your page "/backup-solution" ranks #15. Adding this keyword could improve ranking.'
      },
      // ... 可以添加更多推荐关键词
    ])

    const topPages = ref([
      {
        url: '/blog/cloud-storage-guide',
        description: 'Missing Keywords: 5',
        keywords: [
          {
            id: 1,
            text: 'cloud storage solutions',
            kd: 35,
            volume: 1200,
            selected: false
          },
          {
            id: 2,
            text: 'best cloud storage',
            kd: 45,
            volume: 2500,
            selected: false
          }
        ]
      },
      {
        url: '/product/backup-solution',
        description: 'Weak Keywords: 7',
      },
      {
        url: '/landing/cloud-security',
        description: 'Expandable Long-tail: 3',
      }
    ])

    // 添加新的方法
    const selectAllRecommended = () => {
      recommendedKeywords.value.forEach(kw => kw.selected = true)
    }

    const showAllKeywords = () => {
      // 实现查看所有关键词的逻辑
    }

    const selectAllPages = () => {
      // 实现选择所有页面的逻辑
    }

    const handleKeywordSelect = (keyword) => {
      // 处理关键词选择逻辑
    }

    // 添加计算属性来获取所有页面关键词的总数
    const getTotalPageKeywords = computed(() => {
      return topPages.value.reduce((total, page) => {
        return total + (page.keywords?.length || 0)
      }, 0)
    })

    return {
      currentMode,
      selectedKeywords,
      overviewData,
      currentModeComponent,
      getCategoryPercent,
      viewSelected,
      clearSelection,
      exportSelected,
      overviewStats,
      categories,
      recommendedKeywords,
      topPages,
      selectAllRecommended,
      showAllKeywords,
      selectAllPages,
      handleKeywordSelect,
      getTotalPageKeywords
    }
  }
})
</script>

<style scoped>
.workflow-card {
  margin-bottom: 24px;
  background: #fafafa;
}

.main-content {
  display: flex;
  gap: 24px;
}

.left-panel {
  flex: 1;
  transition: all 0.3s ease;
}

.panel-collapsed {
  flex: 0 0 380px;
}

.right-panel {
  flex: 2;
}

.mode-selector-card {
  margin-bottom: 24px;
  background: #fafafa;
}

.analytics-card,
.selection-card,
.workspace-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f1f1f;
}

.highlight-statistic {
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-count {
  font-size: 14px;
  color: #595959;
}

:deep(.ant-card-head) {
  min-height: 48px;
}

:deep(.ant-card-head-title) {
  padding: 12px 0;
}

:deep(.ant-statistic-title) {
  color: #595959;
}

:deep(.ant-statistic-content) {
  font-size: 24px;
  font-weight: 600;
}

.beginner-mode {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.overview-section {
  margin-bottom: 16px;
}

.pages-comparison {
  display: flex;
  gap: 8px;
  align-items: center;
}

.category-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.selection-alert {
  margin-bottom: 16px;
}

.beginner-card,
.optimization-card {
  height: 100%; /* 确保两个卡片高度一致 */
}

.keywords-list {
  margin: 16px 0;
  min-height: 200px; /* 给列表一个最小高度以保持对齐 */
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: auto; /* 让按钮固定在底部 */
  justify-content: flex-end; /* 按钮右对齐 */
}

.page-item {
  display: flex;
  flex-direction: column;
}

.page-url {
  color: #1890ff;
}

.page-stats {
  font-size: 12px;
  color: #666;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comparison-divider {
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.45);
}

.analytics-card {
  :deep(.ant-card-body) {
    padding: 12px 24px; /* 减小内边距 */
  }
}

.stat-item {
  gap: 4px; /* 减小标签和数值之间的间距 */
}

.page-keywords {
  margin-top: 8px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.page-item {
  gap: 8px; /* 添加各元素之间的间距 */
}

.mode-selector-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mode-selector-card {
  margin-bottom: 24px;
  background: #fafafa;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stat-value.compact {
  font-size: 16px; /* 进一步减小数字大小 */
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
}

.keyword-differences {
  padding: 0 8px;
}

.difference-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
  font-weight: 500;
}

.difference-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  :deep(.ant-tag) {
    margin-right: 0;
    font-size: 13px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    .anticon {
      font-size: 14px;
    }
  }
}

.analytics-card {
  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.analysis-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 4px 0;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.step-description {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 4px;
}

.stat-value.compact {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
}

.difference-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  :deep(.ant-tag) {
    margin-right: 0;
    font-size: 13px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.analytics-card {
  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.keyword-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.keyword-header {
  width: 100%;
}

.keyword-reason {
  padding-left: 24px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  gap: 6px;
  
  .anticon {
    color: #1890ff;
  }
}
</style>
