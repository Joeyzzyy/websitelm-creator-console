<template>
  <page-layout
    title="Keyword Planning"
    description="Plan and generate content strategically"
    icon="🎯"
  >
    <!-- Workflow Steps -->
    <a-card class="workflow-card">
      <a-steps :current="currentStep" direction="horizontal" class="horizontal-steps">
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
          <template v-if="currentMode === 'beginner'">
            <div class="analysis-steps-container">
              <!-- 第一步：分析概况 -->
              <div class="analysis-step-horizontal">
                <div class="step-badge">
                  <SearchOutlined class="step-icon" />
                  <div class="step-number">1</div>
                </div>
                <div class="step-content">
                  <div class="step-title">Analysis Overview</div>
                  <div class="step-subtitle">We've completed a comprehensive keyword analysis</div>
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

              <!-- 第二步：发现的问题 -->
              <div class="analysis-step-horizontal">
                <div class="step-badge">
                  <BulbOutlined class="step-icon" />
                  <div class="step-number">2</div>
                </div>
                <div class="step-content">
                  <div class="step-title">What We Found</div>
                  <div class="step-subtitle">Here's what our analysis revealed about your keyword coverage</div>
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

              <!-- 第三步：建议行动 -->
              <div class="analysis-step-horizontal">
                <div class="step-badge">
                  <ThunderboltOutlined class="step-icon" />
                  <div class="step-number">3</div>
                </div>
                <div class="step-content">
                  <div class="step-title">Recommended Actions</div>
                  <div class="step-subtitle">We've prioritized keywords based on potential impact and effort</div>
                  <div class="step-description">
                    <CheckCircleOutlined class="action-icon" /> Review and select keywords below
                    <ArrowRightOutlined class="arrow-icon" /> Focus on P0 (Quick Wins) first
                    <ArrowRightOutlined class="arrow-icon" /> Then move to higher effort opportunities
                  </div>
                </div>
              </div>
            </div>

            <!-- 添加新的引导部分 -->
            <div class="next-step-guide">
              <div class="guide-content">
                <ArrowDownOutlined class="guide-arrow" />
                <div class="guide-text">
                  <div class="guide-title">Ready to get started?</div>
                  <div class="guide-description">Review our recommended keywords below and select the ones you want to target</div>
                </div>
              </div>
              <div class="guide-decorative-arrows">
                <div class="decorative-arrow"></div>
                <div class="decorative-arrow"></div>
                <div class="decorative-arrow"></div>
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
                <p class="recommendation-text">We analyzed and prioritized keywords by opportunity:</p>
                
                <a-tabs>
                  <a-tab-pane v-for="priority in priorities" :key="priority.level" :tab="priority.label">
                    <div class="priority-description">{{ priority.description }}</div>
                    <a-list
                      :data-source="getKeywordsByPriority(recommendedKeywords, priority.level)"
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
                  </a-tab-pane>
                </a-tabs>
              </a-card>
            </a-col>

            <!-- Top Pages Optimization Tips 列 -->
            <a-col :span="12">
              <a-card title="Keywords From Top Pages Optimization" class="optimization-card">
                <p class="recommendation-text">★ Optimization opportunities by priority:</p>
                
                <a-tabs v-if="pageKeywords && pageKeywords.length">
                  <a-tab-pane v-for="priority in priorities" :key="priority.level" :tab="priority.label">
                    <div class="priority-description">{{ priority.description }}</div>
                    <a-list
                      :data-source="getKeywordsByPriority(pageKeywords, priority.level)"
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
                  </a-tab-pane>
                </a-tabs>
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

    const priorities = [
      {
        level: 'P0',
        label: 'P0 - Quick Wins',
        color: '#f50',
        description: 'High impact, low effort opportunities'
      },
      {
        level: 'P1',
        label: 'P1 - High Priority',
        color: '#fa8c16',
        description: 'Important terms with good potential'
      },
      {
        level: 'P2',
        label: 'P2 - Medium Priority',
        color: '#1890ff',
        description: 'Valuable but requires more effort'
      },
      {
        level: 'P3',
        label: 'P3 - Low Priority',
        color: '#52c41a',
        description: 'Long-term opportunities'
      },
      {
        level: 'P4',
        label: 'P4 - Monitor',
        color: '#722ed1',
        description: 'Keep an eye on these terms'
      }
    ]

    const recommendedKeywords = ref([
      {
        keyword: 'cloud storage',
        kd: 35,
        volume: 1200,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P0',
        reason: 'Low competition (KD=35) with high search volume. Your competitors rank well for this term.'
      },
      {
        keyword: 'online backup',
        kd: 40,
        volume: 900,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P0',
        reason: 'You already rank on page 2. Small optimization could bring big traffic gains.'
      },
      {
        keyword: 'best cloud storage providers',
        kd: 45,
        volume: 2500,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P1',
        reason: 'High-volume term that your competitors are targeting successfully.'
      },
      {
        keyword: 'secure cloud backup',
        kd: 38,
        volume: 800,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P1',
        reason: 'Currently ranking #12, good opportunity to reach first page.'
      },
      {
        keyword: 'enterprise cloud storage',
        kd: 55,
        volume: 1500,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P2',
        reason: 'Higher competition but matches your product offering well.'
      },
      {
        keyword: 'cloud storage comparison',
        kd: 42,
        volume: 1100,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P2',
        reason: 'Popular comparison term that could drive qualified traffic.'
      },
      {
        keyword: 'personal cloud storage',
        kd: 30,
        volume: 600,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P3',
        reason: 'Lower volume but very relevant to your service.'
      },
      {
        keyword: 'cloud storage pricing',
        kd: 25,
        volume: 450,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P4',
        reason: 'Commercial intent keyword worth monitoring.'
      }
    ])

    const pageKeywords = ref([
      // P0 优先级关键词
      {
        keyword: 'cloud storage solutions',
        kd: 35,
        volume: 1200,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P0',
        pageReason: 'Your page "/cloud-guide" ranks #15. High potential for quick improvement.'
      },
      {
        keyword: 'business cloud storage',
        kd: 42,
        volume: 1800,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P0',
        pageReason: 'Your page "/business-solutions" ranks #8. Close to first page.'
      },
      // P1 优先级关键词
      {
        keyword: 'cloud backup services',
        kd: 38,
        volume: 1400,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P1',
        pageReason: 'Perfect fit for your "/services" page. Currently not targeting this term.'
      },
      {
        keyword: 'cloud storage security',
        kd: 45,
        volume: 2000,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P1',
        pageReason: 'Your "/security" page needs optimization for this key term.'
      },
      // P2 优先级关键词
      {
        keyword: 'cloud file sharing',
        kd: 50,
        volume: 1600,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P2',
        pageReason: 'Good opportunity for your "/features" page to target this term.'
      },
      {
        keyword: 'enterprise backup solutions',
        kd: 48,
        volume: 900,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P2',
        pageReason: 'Your "/enterprise" page could rank better for this term.'
      },
      // P3 优先级关键词
      {
        keyword: 'cloud storage reviews',
        kd: 35,
        volume: 800,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P3',
        pageReason: 'Consider creating a dedicated review comparison page.'
      },
      // P4 优先级关键词
      {
        keyword: 'cloud backup pricing',
        kd: 30,
        volume: 500,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P4',
        pageReason: 'Your "/pricing" page could better target this commercial term.'
      }
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

    // 按优先级过滤关键词的方法
    const getKeywordsByPriority = (keywords, priority) => {
      if (!keywords || !keywords.length) return []
      return keywords.value ? keywords.value.filter(k => k.priority === priority) : keywords.filter(k => k.priority === priority)
    }

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
      getTotalPageKeywords,
      priorities,
      getKeywordsByPriority,
      pageKeywords
    }
  }
})
</script>

<style scoped>
.workflow-card {
  margin-bottom: 24px;
  background: #fafafa;
}

.horizontal-steps {
  padding: 12px 24px;
}

:deep(.ant-steps-horizontal) {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

:deep(.ant-steps-item) {
  flex: 1;
  margin-right: 0 !important;
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
  margin-bottom: 16px;
  background: #fafafa;
  
  :deep(.ant-card-body) {
    padding: 12px 16px;
  }
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
  gap: 8px;
  
  .ant-btn {
    height: 32px;
    padding: 0 12px;
    
    .anticon {
      font-size: 14px;
    }
  }
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
  gap: 16px;
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
  padding: 8px 0;
  position: relative;
}

.step-badge {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.step-icon {
  color: white;
  font-size: 18px;
}

.step-number {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #fff;
  border: 2px solid #1890ff;
  color: #1890ff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.step-subtitle {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
}

.step-description {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  
  .action-icon {
    color: #52c41a;
  }
  
  .arrow-icon {
    color: #1890ff;
  }
}

.difference-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  
  :deep(.ant-tag) {
    margin-right: 0;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
  }
}

.stat-value.compact {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 8px;
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

.priority-section {
  margin-bottom: 24px;
}

.priority-header {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-description {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 16px;
}

.keywords-list {
  margin-top: 8px;
}

/* 调整 tab 样式 */
:deep(.ant-tabs-tab) {
  padding: 8px 16px;
}

:deep(.ant-tabs-tab-btn) {
  font-size: 13px;
}

/* 可以给不同优先级的 tab 添加对应的颜色 */
:deep(.ant-tabs-tab[data-node-key="P0"]) {
  color: #f50;
}

:deep(.ant-tabs-tab[data-node-key="P1"]) {
  color: #fa8c16;
}

:deep(.ant-tabs-tab[data-node-key="P2"]) {
  color: #1890ff;
}

:deep(.ant-tabs-tab[data-node-key="P3"]) {
  color: #52c41a;
}

:deep(.ant-tabs-tab[data-node-key="P4"]) {
  color: #722ed1;
}

.analysis-flow {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flow-number {
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
}

.flow-content {
  flex: 1;
}

.flow-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.flow-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlight {
  font-weight: 600;
  color: #1890ff;
}

.divider {
  color: rgba(0, 0, 0, 0.45);
}

.flow-arrow {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.flow-hint {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.gap-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.missing {
  background-color: #ff4d4f;
  color: white;
}

.weak {
  background-color: #faad14;
  color: white;
}

.strong {
  background-color: #52c41a;
  color: white;
}

/* 添加新的横向布局样式 */
.analysis-steps-container {
  display: flex;
  gap: 16px;
  align-items: stretch;
  margin-bottom: 0;
}

.analysis-step-horizontal {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  min-width: 0;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    border-top: 2px solid #1890ff;
    border-right: 2px solid #1890ff;
  }
}

.step-badge {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 0;

  .step-icon {
    font-size: 14px;
  }

  .step-number {
    position: absolute;
    right: -3px;
    bottom: -3px;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    font-size: 11px;
  }
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}

.step-subtitle {
  font-size: 12px;
  margin-bottom: 6px;
  color: rgba(0, 0, 0, 0.65);
}

.stat-item {
  margin-top: 4px;
  
  .stat-label {
    font-size: 12px;
    line-height: 1.2;
  }
  
  .stat-value.compact {
    font-size: 13px;
    line-height: 1.2;
  }
}

.difference-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;

  :deep(.ant-tag) {
    font-size: 12px;
    padding: 2px 6px;
    margin: 0;
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    gap: 2px;

    .anticon {
      font-size: 12px;
    }
  }
}

.step-description {
  font-size: 12px;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .action-icon,
  .arrow-icon {
    font-size: 12px;
  }
}

/* 添加新的引导样式 */
.next-step-guide {
  text-align: center;
  padding: 32px 0;
  position: relative;
  background: linear-gradient(180deg, rgba(24,144,255,0.08) 0%, rgba(24,144,255,0) 100%);
}

.guide-content {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  position: relative;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  }
}

.guide-arrow {
  font-size: 24px;
  color: #1890ff;
  animation: floatArrow 2s ease-in-out infinite;
}

.guide-text {
  text-align: left;
}

.guide-title {
  font-size: 16px;
  font-weight: 500;
  color: #1890ff;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    width: 4px;
    height: 4px;
    background: #1890ff;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

.guide-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  position: relative;
}

@keyframes floatArrow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 添加多个装饰性箭头 */
.guide-decorative-arrows {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.decorative-arrow {
  width: 2px;
  height: 16px;
  background: #1890ff;
  opacity: 0.3;
  animation: fadeInOut 1.5s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes fadeInOut {
  0% {
    transform: scaleY(0.4);
    opacity: 0.2;
  }
  50% {
    transform: scaleY(1);
    opacity: 0.8;
  }
  100% {
    transform: scaleY(0.4);
    opacity: 0.2;
  }
}

/* 优化单选按钮组样式 */
:deep(.ant-radio-group) {
  display: flex;
  
  .ant-radio-button-wrapper {
    height: 32px;
    padding: 0 16px;
    line-height: 30px;
    
    /* 优化图标样式 */
    .anticon {
      font-size: 14px;
      margin-right: 4px;
    }
  }
}

/* 优化操作按钮样式 */
.header-actions {
  display: flex;
  gap: 8px;
  
  .ant-btn {
    height: 32px;
    padding: 0 12px;
    
    .anticon {
      font-size: 14px;
    }
  }
}
</style>

