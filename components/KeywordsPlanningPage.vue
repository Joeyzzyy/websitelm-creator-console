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
        <a-step title="Generate Topic Title and Outline" description="Create and optimize content structure" />
      </a-steps>
    </a-card>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Left Panel: Keyword Selection -->
      <div class="left-panel" :class="{ 'panel-hidden': currentStep > 0 }">
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
                :disabled="false"
              >
                {{ currentStep === 1 ? 'Generate' : 'Next' }}
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
                        <div class="stat-value compact">50 top pages from your competitors</div>
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
          <a-row :gutter="[24, 24]" class="beginner-content">
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
                              <a-tag class="krs-tag">KRS={{ item.krs || 65 }}</a-tag>
                              <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                              <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                              <a-tag :color="item.status.color">{{ item.status.text }}</a-tag>
                            </a-space>
                            <div class="keyword-reason">
                              <BulbOutlined />
                              <div class="reason-content">
                                <span class="reason-highlight">High potential: </span>
                                <span class="reason-detail">Low competition (</span>
                                <span class="reason-value">KD=35</span>
                                <span class="reason-detail">) with </span>
                                <span class="reason-value">high search volume</span>
                                <span class="reason-detail">. Your competitors rank well for this term.</span>
                              </div>
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
                              <a-tag class="krs-tag">KRS={{ item.krs || 65 }}</a-tag>
                              <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                              <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                              <a-tag :color="item.status.color">{{ item.status.text }}</a-tag>
                            </a-space>
                            <div class="keyword-reason">
                              <BulbOutlined />
                              <span class="reason-text">{{ item.pageReason }}</span>
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

        <!-- 在 expert 模式下的内容 -->
        <template v-else>
          <!-- A. 高级筛选器 -->
          <a-card class="filter-card" :bordered="false">
            <div class="advanced-filters">
              <!-- 将所有控件靠左对齐 -->
              <div class="filter-header">
                <a-space>
                  <a-select
                    v-model:value="currentPreset"
                    style="width: 200px"
                    placeholder="Select saved filter"
                    @change="handlePresetChange"
                  >
                    <a-select-option v-for="preset in savedPresets" :key="preset.id" :value="preset.id">
                      {{ preset.name }}
                    </a-select-option>
                  </a-select>
                  
                  <a-button type="primary" @click="addFilter">
                    <PlusOutlined /> Add Filter
                  </a-button>
                  <a-button @click="clearFilters">Clear All</a-button>
                  <a-button @click="showSaveModal">Save as Preset</a-button>
                  <a-button type="primary" @click="applyFilters">Apply Filters</a-button>
                </a-space>
              </div>

              <!-- 筛选条件网格布局 -->
              <div class="filter-rows">
                <template v-for="(filter, index) in filters" :key="index">
                  <!-- 添加 & 符号 -->
                  <div v-if="index > 0" class="filter-connector">
                    &
                  </div>
                  
                  <div class="filter-row">
                    <a-select 
                      v-model:value="filter.field" 
                      class="ant-select-field"
                      @change="() => handleFieldChange(index)"
                    >
                      <a-select-option value="kd">KD</a-select-option>
                      <a-select-option value="volume">Volume</a-select-option>
                      <a-select-option value="cpc">CPC</a-select-option>
                      <a-select-option value="coverage">Competitor Coverage</a-select-option>
                      <a-select-option value="relevance">Business Relevance</a-select-option>
                      <a-select-option value="krs">KRS</a-select-option>
                      <a-select-option value="source">Source</a-select-option>
                    </a-select>
                    
                    <!-- 特殊处理 Source 字段的选择器 -->
                    <template v-if="filter.field === 'source'">
                      <a-select
                        v-model:value="filter.value"
                        class="source-value-selector"
                      >
                        <a-select-option value="difference">From Keywords Difference</a-select-option>
                        <a-select-option value="competitor">From Competitor's Top Pages</a-select-option>
                      </a-select>
                    </template>
                    <template v-else>
                      <!-- 原有的操作符和值输入 -->
                      <a-select 
                        v-model:value="filter.operator" 
                        class="ant-select-operator"
                      >
                        <a-select-option value="<"><</a-select-option>
                        <a-select-option value="<=">≤</a-select-option>
                        <a-select-option value=">">></a-select-option>
                        <a-select-option value=">=">≥</a-select-option>
                        <a-select-option value="==">=</a-select-option>
                        <a-select-option value="!=">≠</a-select-option>
                      </a-select>
                      <a-input-number 
                        v-model:value="filter.value" 
                        class="ant-input-value"
                      />
                    </template>

                    <a-button 
                      type="text" 
                      danger
                      @click="removeFilter(index)"
                    >
                      Delete
                    </a-button>
                  </div>
                </template>
              </div>
            </div>
          </a-card>

          <!-- B. 详细差异 & Top Pages 表格 -->
          <a-card class="table-card" :bordered="false">
            <div class="table-wrapper">
              <a-table
                :data-source="filteredKeywords"
                :columns="columns"
                :row-selection="rowSelection"
                :pagination="pagination"
                :scroll="{ x: 'max-content' }"
                @change="handleTableChange"
              >
                <template #expandedRowRender="{ record }">
                  <div class="expanded-row">
                    <div class="expanded-section">
                      <div class="section-title">对应页面</div>
                      <div class="section-content">
                        <a-space direction="vertical">
                          <a-tag v-for="page in record.pages" :key="page.url">
                            {{ page.url }}
                          </a-tag>
                        </a-space>
                      </div>
                    </div>
                    <div class="expanded-section">
                      <div class="section-title">竞品排名对比</div>
                      <div class="section-content">
                        <a-table
                          :data-source="record.competitors"
                          :columns="competitorColumns"
                          :pagination="false"
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </a-table>
            </div>
          </a-card>
        </template>
      </div>

      <!-- Right Panel: Workspace -->
      <div class="right-panel" v-show="currentStep > 0">
        <a-card 
          :bordered="false"
          class="workspace-card"
        >
          <template #title>
            <div class="workspace-header">
              <a-button @click="previousStep">
                <LeftOutlined /> Previous
              </a-button>
              <span class="card-title">
                {{ workspaceTitle }}
              </span>
            </div>
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

    <!-- 添加保存配置的模态框 -->
    <a-modal
      v-model:visible="saveModalVisible"
      title="Save Filter Preset"
      @ok="saveCurrentPreset"
    >
      <a-input v-model:value="newPresetName" placeholder="Enter preset name" />
    </a-modal>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed, h } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import BeginnerMode from './BeginnerMode.vue'
import { 
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  // ... 其他已使用的图标
} from '@ant-design/icons-vue'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  components: {
    PageLayout,
    BeginnerMode,
    DeleteOutlined,
    PlusOutlined,
    SaveOutlined,
    // ... 其他已使用的图标
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
      { name: 'Unique', color: 'purple' }
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
        krs: 78,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P0',
        reason: 'Low competition (KD=35) with high search volume. Your competitors rank well for this term.'
      },
      {
        keyword: 'online backup',
        kd: 40,
        volume: 900,
        krs: 72,
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
        krs: 85,
        status: { text: 'Missing', color: 'red' },
        selected: false,
        priority: 'P0',
        pageReason: 'aiseo.ai\'s page "aiseo.ai/cloud-guide" ranks #15. High potential for quick improvement.'
      },
      {
        keyword: 'business cloud storage',
        kd: 42,
        volume: 1800,
        status: { text: 'Weak', color: 'orange' },
        selected: false,
        priority: 'P0',
        pageReason: 'surferseo.com\'s page "surferseo.com/business-solutions" ranks #8. Close to first page.'
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
      const index = selectedKeywords.value.findIndex(k => k.keyword === keyword.keyword)
      if (index === -1) {
        selectedKeywords.value.push(keyword)
      } else {
        selectedKeywords.value.splice(index, 1)
      }
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

    // 在 expert 模式下的内容
    const filters = ref([
      {
        field: 'kd',
        operator: '<',
        value: 50
      }
    ]);

    const addFilter = () => {
      filters.value.push({
        field: 'kd',
        operator: '<',
        value: 50
      });
    };

    const removeFilter = (index) => {
      filters.value.splice(index, 1);
    };

    const handleFieldChange = (index) => {
      const filter = filters.value[index];
      if (filter.field === 'source') {
        filter.operator = '==';
        filter.value = 'difference';
      } else {
        // 原有的处理逻辑
        switch (filter.field) {
          case 'cpc':
            filter.value = 0.2;
            break;
          case 'relevance':
            filter.value = 3;
            break;
          case 'krs':
            filter.value = 50;
            break;
          default:
            filter.value = 50;
        }
      }
    };

    const applyFilters = () => {
      // TODO: 实现筛选逻辑
    };

    const clearFilters = () => {
      filters.value = [{
        field: 'kd',
        operator: '<',
        value: 50
      }];
    };

    const saveFilterConfig = () => {
      // TODO: 实现保存配置逻辑
    };

    const columns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        width: 200,
        fixed: 'left',
        customRender: ({ text }) => {
          return h('strong', text);
        }
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        width: 80,
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        width: 100,
      },
      {
        title: 'CPC',
        dataIndex: 'cpc',
        width: 100,
      },
      {
        title: 'Competitor Coverage',
        dataIndex: 'coverage',
        width: 120,
        customRender: ({ text }) => {
          return h('span', `${text} competitors`);
        }
      },
      {
        title: 'Business Relevance',
        dataIndex: 'relevance',
        width: 140,
        customRender: ({ text }) => {
          const colors = ['#ff4d4f', '#faad14', '#52c41a'];
          const score = parseInt(text);
          return h('span', {
            style: {
              color: colors[Math.min(Math.floor(score/2), 2)]
            }
          }, `${score}/5`);
        }
      },
      {
        title: 'KRS',
        dataIndex: 'krs',
        width: 100,
        customRender: ({ text }) => {
          return h('span', {
            style: {
              color: text >= 70 ? '#52c41a' : text >= 40 ? '#faad14' : '#ff4d4f'
            }
          }, text);
        }
      },
      {
        title: 'Pages',
        dataIndex: 'pages',
        width: 200,
        customRender: ({ text, record }) => {
          return h('a', {
            onClick: () => handlePageClick(record)
          }, `${text.length} pages`);
        }
      },
      {
        title: 'Actions',
        key: 'action',
        fixed: 'right',
        width: 100,
        customRender: ({ record }) => {
          return h('a-space', { size: 'middle' }, [
            h('a', {
              onClick: () => handleEdit(record)
            }, 'Edit'),
            h('a', {
              onClick: () => handleDelete(record)
            }, 'Delete')
          ]);
        }
      },
      {
        title: 'From URL',
        dataIndex: 'fromUrl',
        width: 200,
        ellipsis: true, // 超长时显示省略号
        customRender: ({ text }) => {
          if (!text) return '-';
          return h('a-tooltip', { title: text }, () => [
            h('a', { href: text, target: '_blank' }, text)
          ]);
        }
      },
    ];

    const competitorColumns = [
      {
        title: 'Competitor',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: 'Rank',
        dataIndex: 'rank',
        width: 80,
      },
      {
        title: 'URL',
        dataIndex: 'url',
        width: 200,
      },
    ];

    const selectedRowKeys = ref([]);

    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (keys, selectedRows) => {
        selectedRowKeys.value = keys;
        console.log(`selectedRowKeys: ${keys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };

    const pagination = {
      pageSizeOptions: ['10', '20', '30', '40'],
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    const handleTableChange = (pagination, filters, sorter) => {
      console.log('Table change:', pagination, filters, sorter);
    };

    const handlePageClick = (record) => {
      console.log('Clicked page:', record);
    };

    const handleEdit = (record) => {
      console.log('Edit:', record);
    };

    const handleDelete = (record) => {
      console.log('Delete:', record);
    };

    const currentPreset = ref(null);
    const saveModalVisible = ref(false);
    const newPresetName = ref('');
    const savedPresets = ref([
      { id: 1, name: 'Low KD High Volume', filters: [
        { field: 'kd', operator: '<', value: 30 },
        { field: 'volume', operator: '>', value: 1000 }
      ] },
      { id: 2, name: 'High CPC Keywords', filters: [
        { field: 'cpc', operator: '>', value: 1 }
      ] }
    ]);

    const handlePresetChange = (presetId) => {
      const preset = savedPresets.value.find(p => p.id === presetId);
      if (preset) {
        filters.value = JSON.parse(JSON.stringify(preset.filters));
      }
    };

    const showSaveModal = () => {
      saveModalVisible.value = true;
    };

    const saveCurrentPreset = () => {
      if (newPresetName.value) {
        savedPresets.value.push({
          id: Date.now(),
          name: newPresetName.value,
          filters: JSON.parse(JSON.stringify(filters.value))
        });
        saveModalVisible.value = false;
        newPresetName.value = '';
      }
    };

    const currentStep = ref(0)
    
    const nextStep = () => {
      if (currentStep.value < 1) {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
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
      pageKeywords,
      filters,
      addFilter,
      removeFilter,
      handleFieldChange,
      applyFilters,
      clearFilters,
      saveFilterConfig,
      columns,
      competitorColumns,
      rowSelection,
      pagination,
      handleTableChange,
      handlePageClick,
      handleEdit,
      handleDelete,
      currentPreset,
      saveModalVisible,
      newPresetName,
      savedPresets,
      handlePresetChange,
      showSaveModal,
      saveCurrentPreset,
      currentStep,
      nextStep,
      previousStep,
    }
  }
})
</script>

<style scoped>
.workflow-card {
  margin-bottom: 16px;
  background: #fafafa;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  :deep(.ant-card-body) {
    padding: 8px 24px;
  }
}

.horizontal-steps {
  padding: 0;
}

:deep(.ant-steps-horizontal) {
  display: flex;
  width: 100%;
  justify-content: space-between;
  
  .ant-steps-item-title {
    font-size: 14px;
    line-height: 20px;
  }
  
  .ant-steps-item-description {
    font-size: 12px;
    line-height: 16px;
  }
  
  .ant-steps-icon {
    font-size: 14px;
  }
}

.main-content {
  display: flex;
  gap: 24px;
}

.left-panel {
  flex: 1;
  transition: all 0.3s ease;
}

.panel-hidden {
  display: none;
}

.right-panel {
  flex: 1;
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
  padding-bottom: 24px;
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
  height: 100%;
  margin-bottom: 24px;
}

.keywords-list {
  margin: 16px 0;
  min-height: 200px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: auto;
  justify-content: flex-end;
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
    padding: 12px 24px;
  }
}

.stat-item {
  gap: 4px;
}

.page-keywords {
  margin-top: 8px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.page-item {
  gap: 8px;
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
  font-size: 16px;
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
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-left: 24px;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(24, 144, 255, 0.04);
  border-left: 3px solid #1890ff;
  border-radius: 0 4px 4px 0;
  
  .anticon {
    color: #1890ff;
    font-size: 16px;
    margin-top: 2px;
  }
}

.reason-content {
  font-size: 14px;
  line-height: 1.6;
}

.reason-highlight {
  color: #1890ff;
  font-weight: 600;
}

.reason-value {
  color: #262626;
  font-weight: 500;
  background: rgba(24, 144, 255, 0.1);
  padding: 0 4px;
  border-radius: 2px;
}

.reason-detail {
  color: #595959;
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

:deep(.ant-tabs-tab) {
  padding: 8px 16px;
}

:deep(.ant-tabs-tab-btn) {
  font-size: 13px;
}

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

:deep(.ant-radio-group) {
  display: flex;
  
  .ant-radio-button-wrapper {
    height: 32px;
    padding: 0 16px;
    line-height: 30px;
    
    .anticon {
      font-size: 14px;
      margin-right: 4px;
    }
  }
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

.expert-mode-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.expert-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.expert-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 500;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}

.filter-card {
  :deep(.ant-card-body) {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

.advanced-filters {
  .filter-rows {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
  }

  .filter-connector {
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.45);
    padding: 0 4px;
  }

  .filter-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    background: #fafafa;
    border-radius: 4px;
    
    .ant-select-field {
      width: 200px;
    }
    
    .ant-select-operator {
      width: 45px;
    }
    
    .ant-input-number {
      width: 80px;
    }
    
    .delete-btn {
      padding: 4px;
      margin-left: 4px;
    }
  }
}

.filter-actions {
  margin: 16px 0;
  
  .ant-btn {
    height: 32px;
    
    &:hover {
      color: #1890ff;
      border-color: #1890ff;
    }
  }
}

.filter-operations {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  
  .ant-space {
    width: 100%;
    justify-content: flex-end;
  }
}

.source-value-selector {
  width: 220px;
}

:deep(.ant-select-operator .ant-select-selection-item) {
  text-align: center;
  padding: 0;
}

.filter-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  
  .ant-space {
    gap: 8px;
  }
}

.beginner-content {
  margin-bottom: 24px;
}

.a-row:last-child {
  margin-bottom: 0;
}

/* 添加 KRS 标签的呼吸效果 */
.krs-tag {
  background: linear-gradient(135deg, #1890ff, #722ed1);
  border: none;
  color: white;
  font-weight: 500;
  animation: gradientBreath 3s ease-in-out infinite;
}

@keyframes gradientBreath {
  0%, 100% {
    background: linear-gradient(135deg, #1890ff, #722ed1);
    opacity: 1;
  }
  50% {
    background: linear-gradient(135deg, #40a9ff, #9254de);
    opacity: 0.8;
  }
}

/* 覆盖 ant-design-vue 的默认标签样式 */
:deep(.krs-tag.ant-tag) {
  border: none;
  padding: 2px 8px;
}
</style>

