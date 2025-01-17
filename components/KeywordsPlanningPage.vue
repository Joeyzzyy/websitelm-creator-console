<template>
  <page-layout
    title="Keyword & Content Planner"
    description="Plan and generate content strategically"
    icon="🎯"
  >
    <a-spin :spinning="loading">
      <template v-if="domainConfigured">
        <template v-if="analysisState !== 'finished'">
          <div class="analysis-loading-state">
            <a-card class="loading-card">
              <!-- Not Started State -->
              <template v-if="analysisState === 'not_started'">
                <div class="loading-content">
                  <LoadingOutlined class="analysis-icon" spin />
                  <h2>Preparing Analysis</h2>
                  <p>Collecting data from SEMrush and Ahrefs...</p>
                </div>
              </template>

              <!-- Processing State -->
              <template v-if="analysisState === 'processing'">
                <div class="loading-content">
                  <LoadingOutlined class="analysis-icon" spin />
                  <h2>Analysis in Progress</h2>
                  
                  <!-- Show current tasks -->
                  <div v-for="task in currentTasks" :key="task.taskName" class="task-item">
                    <div class="task-header">
                      <span>{{ task.taskName }}</span>
                      <span>{{ task.status }}</span>
                    </div>
                    
                    <!-- Show progress if available -->
                    <template v-if="task.progress">
                      <a-progress 
                        :percent="getProgressPercent(task.progress)"
                        :format="() => `${task.progress.current}/${task.progress.total}`"
                      />
                    </template>
                    
                    <!-- Show timing info -->
                    <div class="task-timing">
                      <span>Started: {{ formatTime(task.startTime) }}</span>
                      <span v-if="task.endTime">Completed: {{ formatTime(task.endTime) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </a-card>
          </div>
        </template>

        <template v-else>
          <!-- 将 steps 替换为 tabs -->
          <a-tabs v-model:activeKey="currentStep" class="planning-tabs" :defaultActiveKey="'0'">
            <a-tab-pane key="0">
              <template #tab>
                <span class="tab-title">
                  Select Keywords
                </span>
              </template>
              
              <!-- 第一步内容 -->
              <div class="left-panel">
                <!-- 原来第一步的内容 -->
                <div class="left-panel" :class="{ 'panel-hidden': currentStep > 0 }">
                  <!-- Mode Selector -->
                  <a-card class="mode-selector-card">
                    <div class="mode-selector-wrapper">
                      <div class="mode-controls">
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
                        
                        <a-popover
                          placement="rightTop"
                          trigger="click"
                          :overlayStyle="{ maxWidth: '400px' }"
                        >
                          <template #content>
                            <div class="analysis-overview-popover">
                              <div class="overview-section">
                                <div class="section-title">
                                  <span class="number">1</span>
                                  Analysis Overview
                                </div>
                                <p class="section-desc">We've completed a comprehensive keyword analysis</p>
                                <div class="stats-row">
                                  <div class="stat-item">
                                    <div class="stat-label">We've analyzed</div>
                                    <div class="stat-value">{{ overviewData.totalKeywordsAnalyzed }} keywords</div>
                                  </div>
                                  <div class="stat-item">
                                    <div class="stat-label">Compared your site with</div>
                                    <div class="stat-value">{{ overviewData.totalTopPagesAnalyzed }} top pages</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div class="overview-section">
                                <div class="section-title">
                                  <span class="number">2</span>
                                  What We Found
                                </div>
                                <p class="section-desc">Here's what our analysis revealed about your keyword coverage</p>
                                <div class="findings-tags">
                                  <a-tag color="red">{{overviewData.absence}} keywords you're missing</a-tag>
                                </div>
                              </div>
                              
                              <div class="overview-section">
                                <div class="section-title">
                                  <span class="number">3</span>
                                  Recommended Actions
                                </div>
                                <p class="section-desc">We've prioritized keywords based on potential impact and effort</p>
                                <div class="action-steps">
                                  <div class="step-item">
                                    <CheckCircleOutlined />
                                    <span>Review and select keywords below</span>
                                  </div>
                                  <div class="step-item">
                                    <ArrowRightOutlined />
                                    <span>Focus on P0 (Quick Wins) first</span>
                                  </div>
                                  <div class="step-item">
                                    <ArrowRightOutlined />
                                    <span>Then move to higher effort opportunities</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                          <QuestionCircleOutlined class="help-icon" />
                        </a-popover>
                      </div>

                      <!-- 将选择状态卡片移到这里 -->
                      <div class="selection-status">
                        <a-space>
                          <a-button 
                            @click="showSelectedKeywords"
                          >View Selected
                          </a-button>
                        </a-space>
                      </div>
                    </div>
                  </a-card>

      

                  <!-- Keyword Selection Component -->
                  <div v-if="currentMode === 'beginner'" class="beginner-mode">
                    <a-row :gutter="[24, 24]" class="beginner-content">
                      <!-- System Recommendations 列 -->
                      <a-col :span="12">
                        <a-card title="Keywords From Comparison" class="beginner-card">
                          <p class="recommendation-text">We analyzed and prioritized keywords by opportunity:</p>
                          <a-tabs 
                            v-model:activeKey="currentPriority"
                            @change="handleTabChange"
                          >
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
                                      <div class="keyword-header">
                                        <div class="keyword-info">
                                          <a-checkbox 
                                            v-model:checked="item.selected"
                                            @change="(checked) => handleKeywordSelect(item, checked)"
                                          >
                                            "{{ item.keyword }}"
                                          </a-checkbox>
                                          <a-tag class="krs-tag">KRS={{ item.krs }}</a-tag>
                                          <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                                          <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                                          <a-tag :color="item.status?.color">{{ item.status?.text }}</a-tag>
                                        </div>
                                        <!-- Move favorite button to the right -->
                                        <a-button 
                                          type="text"
                                          @click.stop="handleKeywordFavorite(item)"
                                          class="favorite-btn"
                                        >
                                          <template #icon>
                                            <HeartFilled v-if="item.favorited" style="color: #ff4d4f;" />
                                            <HeartOutlined v-else />
                                          </template>
                                        </a-button>
                                      </div>
                                      
                                      <!-- 添加推荐理由显示 -->
                                      <div class="keyword-reason" v-if="item.reason">
                                        <BulbOutlined />
                                        <div class="reason-content">
                                          <span class="reason-highlight">Reason: </span>
                                          <span class="reason-value">{{ item.reason }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </a-list-item>
                                </template>
                              </a-list>
                              <!-- 添加分页器 -->
                              <div class="pagination-wrapper">
                                <a-pagination
                                  v-model:current="recommendedPagination.current"
                                  :total="recommendedPagination.total"
                                  :pageSize="recommendedPagination.pageSize"
                                  :show-total="(total) => `Total ${total} items`"
                                  @change="(page, pageSize) => handleComparisonPaginationChange(priority.level, page, pageSize)"
                                />
                              </div>
                            </a-tab-pane>
                          </a-tabs>
                        </a-card>
                      </a-col>

                      <!-- Top Pages Optimization Tips 列 -->
                      <a-col :span="12">
                        <a-card title="Keywords From Top Pages Optimization" class="optimization-card">
                          <p class="recommendation-text">Optimization opportunities by priority:</p>
                          
                          <a-tabs 
                            v-model:activeKey="currentPagePriority"
                            @change="handlePageTabChange"
                            class="compact-tabs"
                            >
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
                                      <div class="keyword-header">
                                        <div class="keyword-info">
                                          <a-checkbox 
                                            v-model:checked="item.selected"
                                            @change="(checked) => handleKeywordSelect(item, checked)"
                                          >
                                            "{{ item.keyword }}"
                                          </a-checkbox>
                                          <a-tag class="krs-tag">KRS={{ item.krs }}</a-tag>
                                          <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                                          <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                                          <a-tag :color="item.status?.color">{{ item.status?.text }}</a-tag>
                                        </div>
                                        <!-- Move favorite button to the right -->
                                        <a-button 
                                          type="text"
                                          @click.stop="handleKeywordFavorite(item)"
                                          class="favorite-btn"
                                        >
                                          <template #icon>
                                            <HeartFilled v-if="item.favorited" style="color: #ff4d4f;" />
                                            <HeartOutlined v-else />
                                          </template>
                                        </a-button>
                                      </div>
                                      <!-- 添加 reasoning 显示 -->
                                      <div class="keyword-reason" v-if="item.reason">
                                        <BulbOutlined />
                                        <div class="reason-content">
                                          <span class="reason-highlight">Reason: </span>
                                          <span class="reason-value">{{ item.reason }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </a-list-item>
                                </template>
                              </a-list>
                              <div class="pagination-wrapper">
                                <a-pagination
                                  v-model:current="pagePagination.current"
                                  :total="pagePagination.total"
                                  :pageSize="pagePagination.pageSize"
                                  :show-total="(total) => `Total ${total} items`"
                                  @change="(page, pageSize) => handleTopPagesPaginationChange(priority.level, page, pageSize)"
                                />
                              </div>
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
                              Add Filter
                            </a-button>
                            <a-button @click="clearFilters">Clear All</a-button>
                            <a-button @click="showSaveModal">Save as Preset</a-button>
                          </a-space>
                        </div>

                        <!-- 筛选条件网格布局 -->
                        <div class="filter-rows">
                          <div class="filter-row">
                            <template v-for="(filter, index) in filters" :key="index">
                              <!-- 添加 & 符号 -->
                              <span v-if="index > 0" class="filter-connector">&</span>
                              
                              <div class="filter-item">
                                <a-select 
                                  v-model:value="filter.field" 
                                  class="ant-select-field"
                                  @change="() => handleFieldChange(index)"
                                >
                                  <a-select-option value="kd">KD</a-select-option>
                                  <a-select-option value="volume">Volume</a-select-option>
                                  <a-select-option value="cpc">CPC</a-select-option>
                                  <a-select-option value="coverage">Coverage</a-select-option>
                                  <a-select-option value="relevance">Relevance</a-select-option>
                                  <a-select-option value="krs">KRS</a-select-option>
                                  <a-select-option value="source">Source</a-select-option>
                                </a-select>
                                
                                <template v-if="filter.field === 'source'">
                                  <a-select
                                    v-model:value="filter.value"
                                    class="source-value-selector"
                                  >
                                    <a-select-option value="difference">From Difference</a-select-option>
                                    <a-select-option value="competitor">From Competitor</a-select-option>
                                  </a-select>
                                </template>
                                <template v-else>
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
                                  <DeleteOutlined />
                                </a-button>
                              </div>
                            </template>
                          </div>
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
                              <!-- 对应页面部分 -->
                              <div class="expanded-section">
                                <div class="section-header">
                                  <LinkOutlined class="section-icon" />
                                  <span class="section-title">Corresponding Pages</span>
                                </div>
                                <div class="section-content">
                                  <div class="page-list">
                                    <a-tag 
                                      v-for="page in record.pages" 
                                      :key="page.url"
                                      class="page-tag"
                                    >
                                      <LinkOutlined class="page-icon" />
                                      {{ page.url }}
                                    </a-tag>
                                  </div>
                                </div>
                              </div>

                              <!-- 竞争对手排名对比部分 -->
                              <div class="expanded-section">
                                <div class="section-header">
                                  <LineChartOutlined class="section-icon" />
                                  <span class="section-title">Competitor Ranking Comparison</span>
                                </div>
                                <div class="section-content">
                                  <a-table
                                    :data-source="record.competitors"
                                    :columns="competitorColumns"
                                    :pagination="false"
                                    size="small"
                                    class="competitor-table"
                                  >
                                    <template #bodyCell="{ column, text }">
                                      <template v-if="column.dataIndex === 'rank'">
                                        <span class="rank-cell">
                                          <TrophyOutlined class="rank-icon" />
                                          <span :class="['rank-number', getRankClass(text)]">#{{ text }}</span>
                                        </span>
                                      </template>
                                      <template v-else-if="column.dataIndex === 'url'">
                                        <a :href="text" target="_blank" class="url-link">
                                          {{ text }}
                                          <ExportOutlined class="url-icon" />
                                        </a>
                                      </template>
                                      <template v-else>
                                        {{ text }}
                                      </template>
                                    </template>
                                  </a-table>
                                </div>
                              </div>
                            </div>
                          </template>
                        </a-table>
                      </div>
                    </a-card>
                  </template>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="1">
              <template #tab>
                <span class="tab-title">
                  Check Page Intent & Outline
                </span>
              </template>
              
              <!-- 第二步内容 -->
              <div class="step-two-content">
                <!-- 内容区域 -->
                <div class="workspace-layout">
                  <!-- 左侧已选关键词列表 -->
                  <a-card 
                    class="selected-keywords-card"
                    :bordered="false"
                  >
                    <div class="generate-button-wrapper">
                      <a-button 
                        type="primary"
                        size="small"
                        :loading="isGenerating"
                        :disabled="totalSelectedKeywords === 0"
                        @click="generateContentPlan"
                      >
                        <ThunderboltOutlined /> Generate Content Plan
                      </a-button>
                    </div>

                    <template v-if="isLoadingSelectedKeywords">
                      <div class="loading-container">
                        <a-spin />
                      </div>
                    </template>
                    <template v-else>
                      <a-tabs
                        v-model:activeKey="selectedKeywordsTab"
                        class="selected-keywords-tabs"
                        size="small"
                      >
                        <a-tab-pane
                          v-for="tab in modalTabs"
                          :key="tab.key"
                          :tab="tab.label"
                        >
                          <div class="list-header">
                            <span class="total-count">{{ selectedKeywordsData[tab.key].length }} keywords</span>
                          </div>
                          
                          <a-list
                            :data-source="selectedKeywordsData[tab.key]"
                            class="selected-keywords-list"
                            size="small"
                          >
                            <template #renderItem="{ item }">
                              <a-list-item class="compact-list-item">
                                <div class="selected-keyword-item">
                                  <a-tooltip 
                                    v-if="item.reason" 
                                    :title="item.reason"
                                    placement="right"
                                  >
                                    <div class="keyword-main">
                                      <div class="keyword-content">
                                        <div class="keyword-header">
                                          <span class="keyword-text" :title="item.keyword">"{{ item.keyword }}"</span>
                                          <a-button 
                                            type="link" 
                                            danger
                                            size="small"
                                            class="remove-btn"
                                            @click="handleRemoveKeyword(item)"
                                          >
                                            <DeleteOutlined />
                                          </a-button>
                                        </div>
                                        <div class="keyword-metrics">
                                          <a-tooltip title="Keyword Ranking Score">
                                            <a-tag class="metric-tag">KRS {{ item.krs }}</a-tag>
                                          </a-tooltip>
                                          <a-tooltip title="Keyword Difficulty">
                                            <a-tag class="metric-tag" color="cyan">KD {{ item.kd }}</a-tag>
                                          </a-tooltip>
                                          <a-tooltip title="Search Volume">
                                            <a-tag class="metric-tag" color="purple">Vol {{ item.volume }}</a-tag>
                                          </a-tooltip>
                                        </div>
                                      </div>
                                    </div>
                                  </a-tooltip>
                                  <div v-else class="keyword-main">
                                    <div class="keyword-content">
                                      <div class="keyword-header">
                                        <span class="keyword-text" :title="item.keyword">"{{ item.keyword }}"</span>
                                        <a-button 
                                          type="link" 
                                          danger
                                          size="small"
                                          class="remove-btn"
                                          @click="handleRemoveKeyword(item)"
                                        >
                                          <DeleteOutlined />
                                        </a-button>
                                      </div>
                                      <div class="keyword-metrics">
                                        <a-tooltip title="Keyword Ranking Score">
                                          <a-tag class="metric-tag">KRS {{ item.krs }}</a-tag>
                                        </a-tooltip>
                                        <a-tooltip title="Keyword Difficulty">
                                          <a-tag class="metric-tag" color="cyan">KD {{ item.kd }}</a-tag>
                                        </a-tooltip>
                                        <a-tooltip title="Search Volume">
                                          <a-tag class="metric-tag" color="purple">Vol {{ item.volume }}</a-tag>
                                        </a-tooltip>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a-list-item>
                            </template>
                          </a-list>
                        </a-tab-pane>
                      </a-tabs>
                    </template>
                  </a-card>
                  <!-- Add guide button -->
                  <div v-if="!hasGenerated" class="empty-state">
                    <div class="empty-content">
                      <ThunderboltOutlined class="empty-icon" />
                      <div class="empty-title">Ready to create your content plan?</div>
                      <div class="empty-description">
                        Generate a complete content plan based on your {{ selectedKeywords.length }} selected keywords
                      </div>
                    </div>
                  </div>
                  <!-- Update content display cards -->
                  <template v-else>
                    <div class="plan-section">
                      <!-- Update task progress section -->
                      <div class="task-progress-section">
                        <a-alert
                          :type="outlineGenerationStatus === 'failed' ? 'error' : 'info'"
                          class="task-alert"
                        >
                          <template #icon>
                            <LoadingOutlined v-if="outlineGenerationStatus === 'processing'" spin />
                            <WarningOutlined v-else-if="outlineGenerationStatus === 'failed'" />
                            <CheckCircleOutlined v-else />
                          </template>
                          <template #message>
                            <div class="task-progress-content">
                              <template v-if="outlineGenerationStatus && outlineGenerationStatus !== 'finished'">
                                <div class="task-info">
                                  <span class="task-status">
                                    {{ getTaskStatusText(outlineGenerationStatus) }}
                                  </span>
                                  <span v-if="taskStartTime" class="task-timing">
                                    Started: {{ formatTime(taskStartTime) }}
                                    <template v-if="taskEndTime">
                                      | Completed: {{ formatTime(taskEndTime) }}
                                    </template>
                                  </span>
                                </div>
                                <div v-if="taskDescription" class="task-description">
                                  {{ taskDescription }}
                                </div>
                              </template>
                              <template v-else>
                                <div class="task-info">
                                  <span class="task-status">
                                    ✨ Everything is ready! You can start exploring your content plans below.
                                  </span>
                                </div>
                              </template>
                            </div>
                          </template>
                        </a-alert>
                      </div>

                      <a-tabs 
                        v-model:activeKey="contentPlanTab" 
                        class="content-plan-tabs"
                        @change="handleContentPlanTabChange"
                      >
                        <template #rightExtra>
                          <a-button 
                            type="text" 
                            danger
                            :disabled="!contentPlans.length"
                            @click="confirmClearAllOutlines"
                          >
                            Clear All
                          </a-button>
                        </template>
                        <!-- All Outlines Tab -->
                        <a-tab-pane key="all" tab="All Outlines">
                          <div class="tab-content-wrapper">
                            <div class="content-plans-grid">
                              <template v-if="isLoadingOutlines">
                                <div class="content-plans-loading">
                                  <LoadingOutlined style="font-size: 24px; color: #1890ff;" spin />
                                </div>
                              </template>
                              <template v-else>
                                <a-card 
                                  v-for="plan in contentPlans" 
                                  :key="plan.outlineId"
                                  class="plan-card"
                                  :bordered="false"
                                >
                                  <template #extra>
                                    <a-space>
                                      <a-button 
                                        type="text"
                                        @click.stop="handleFavorite(plan)"
                                      >
                                        <template #icon>
                                          <HeartFilled v-if="plan.favorited" style="color: #ff4d4f;" />
                                          <HeartOutlined v-else />
                                        </template>
                                      </a-button>
                                      <a-button
                                        type="text"
                                        danger
                                        @click.stop="handleDeleteOutline(plan)"
                                      >
                                        <template #icon>
                                          <DeleteOutlined />
                                        </template>
                                      </a-button>
                                    </a-space>
                                  </template>
                                  
                                  <div class="card-content" @click="showPlanDetails(plan)">
                                    <h3 class="plan-title">{{ plan.title }}</h3>
                                    <p class="plan-description">{{ plan.description }}</p>
                                    
                                    <div class="plan-metrics">
                                      <div class="metric-item">
                                        <span class="metric-label">Word Count</span>
                                        <span class="metric-value">{{ getTotalWordCount(plan) }}</span>
                                      </div>
                                      <div class="metric-item">
                                        <span class="metric-label">Sections</span>
                                        <span class="metric-value">{{ plan.outline.length }}</span>
                                      </div>
                                    </div>

                                    <div class="plan-keywords">
                                      <a-tag 
                                        v-for="keyword in plan.keywords.split(', ').slice(0, 3)" 
                                        :key="keyword"
                                        color="blue"
                                      >
                                        {{ keyword }}
                                      </a-tag>
                                      <a-tag v-if="plan.keywords.split(', ').length > 3">
                                        +{{ plan.keywords.split(', ').length - 3 }} more
                                      </a-tag>
                                    </div>

                                    <div class="plan-actions">
                                      <a-button 
                                        type="primary" 
                                        @click="showPlanDetails(plan)"
                                      >
                                        View Details
                                      </a-button>
                                    </div>
                                  </div>
                                </a-card>
                              </template>
                            </div>
                            <div class="pagination-container">
                              <a-pagination
                                v-model:current="contentPlansPagination.current"
                                :total="contentPlansPagination.total"
                                :pageSize="contentPlansPagination.pageSize"
                                @change="handleContentPlansPaginationChange"
                                show-size-changer
                                show-quick-jumper
                                :pageSizeOptions="['12', '24', '36', '48']"
                                :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                              />
                            </div>
                          </div>
                        </a-tab-pane>

                        <!-- Selected Outlines Tab -->
                        <a-tab-pane key="selected" tab="Selected Outlines">
                          <div class="tab-content-wrapper">
                            <div class="content-plans-grid">
                              <a-card 
                                v-for="plan in contentPlans.filter(p => p.favorited)" 
                                :key="plan.outlineId"
                                class="plan-card"
                                :bordered="false"
                              >
                                <template #extra>
                                  <a-space>
                                    <a-button 
                                      type="text"
                                      @click.stop="handleFavorite(plan)"
                                    >
                                      <template #icon>
                                        <HeartFilled v-if="plan.favorited" style="color: #ff4d4f;" />
                                        <HeartOutlined v-else />
                                      </template>
                                    </a-button>
                                    <a-button
                                      type="text"
                                      danger
                                      @click.stop="handleDeleteOutline(plan)"
                                    >
                                      <template #icon>
                                        <DeleteOutlined />
                                      </template>
                                    </a-button>
                                  </a-space>
                                </template>
                                
                                <div class="card-content" @click="showPlanDetails(plan)">
                                  <h3 class="plan-title">{{ plan.title }}</h3>
                                  <p class="plan-description">{{ plan.description }}</p>
                                  
                                  <div class="plan-metrics">
                                    <div class="metric-item">
                                      <span class="metric-label">Word Count</span>
                                      <span class="metric-value">{{ getTotalWordCount(plan) }}</span>
                                    </div>
                                    <div class="metric-item">
                                      <span class="metric-label">Sections</span>
                                      <span class="metric-value">{{ plan.outline.length }}</span>
                                    </div>
                                  </div>

                                  <div class="plan-keywords">
                                    <a-tag 
                                      v-for="keyword in plan.keywords.split(', ').slice(0, 3)" 
                                      :key="keyword"
                                      color="blue"
                                    >
                                      {{ keyword }}
                                    </a-tag>
                                    <a-tag v-if="plan.keywords.split(', ').length > 3">
                                      +{{ plan.keywords.split(', ').length - 3 }} more
                                    </a-tag>
                                  </div>

                                  <div class="plan-actions">
                                    <a-button 
                                      type="primary" 
                                      @click="showPlanDetails(plan)"
                                    >
                                      View Details
                                    </a-button>
                                  </div>
                                </div>
                              </a-card>
                            </div>
                            <div class="pagination-container">
                              <a-pagination
                                v-model:current="contentPlansPagination.current"
                                :total="contentPlansPagination.total"
                                :pageSize="contentPlansPagination.pageSize"
                                @change="handleContentPlansPaginationChange"
                                show-size-changer
                                show-quick-jumper
                                :pageSizeOptions="['12', '24', '36', '48']"
                                :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                              />
                            </div>
                          </div>
                        </a-tab-pane>
                      </a-tabs>
                    </div>

                    <!-- 添加右侧抽屉 -->
                    <a-drawer
                      :visible="drawerVisible"
                      :width="600"
                      placement="right"
                      @close="closeDrawer"
                      :title="selectedPlan?.title || 'Content Plan Details'"
                    >
                      <template v-if="selectedPlan">
                        <!-- Intent Section -->
                        <section class="drawer-section">
                          <h4 class="section-title">
                            <CompassOutlined /> User Intent & Problem
                          </h4>
                          <div class="section-content">
                            <div class="content-item">
                              <strong>Intent:</strong> {{ selectedPlan.userIntent }}
                            </div>
                            <div class="content-item">
                              <strong>Problem Solved:</strong> {{ selectedPlan.problemSolved }}
                            </div>
                            <div class="content-tags">
                              <a-tag v-for="keyword in selectedPlan.relatedKeywords.split(', ')" 
                                :key="keyword"
                                color="blue"
                              >
                                {{ keyword }}
                              </a-tag>
                            </div>
                          </div>
                        </section>

                        <!-- TDK Section -->
                        <section class="drawer-section">
                          <h4 class="section-title">
                            <FileTextOutlined /> Title, Description & Keywords
                          </h4>
                          <div class="section-content">
                            <div class="content-item">
                              <div class="item-label">Title</div>
                              <div class="item-text">{{ selectedPlan.title }}</div>
                            </div>
                            <div class="content-item">
                              <div class="item-label">Description</div>
                              <div class="item-text">{{ selectedPlan.description }}</div>
                            </div>
                            <div class="content-item">
                              <div class="item-label">Keywords</div>
                              <div class="content-tags">
                                <a-tag v-for="keyword in selectedPlan.keywords.split(', ')" 
                                  :key="keyword"
                                  color="green"
                                >
                                  {{ keyword }}
                                </a-tag>
                              </div>
                            </div>
                          </div>
                        </section>

                        <!-- Outline Section -->
                        <section class="drawer-section">
                          <h4 class="section-title">
                            <OrderedListOutlined /> Content Outline
                          </h4>
                          <div class="section-content">
                            <div v-for="section in selectedPlan.outline" 
                              :key="section.sequence" 
                              class="outline-item"
                            >
                              <div class="outline-header">
                                <div class="outline-title">
                                  Section {{ section.sequence }}: {{ section.sectionTitle }}
                                </div>
                                <div class="outline-meta">
                                  {{ section.wordCount }} words
                                </div>
                              </div>
                              <div class="outline-keywords">
                                <template v-if="section.keywordsUsageRequirements">
                                  <a-tag v-for="(count, keyword) in section.keywordsUsageRequirements" 
                                    :key="keyword"
                                    color="blue"
                                  >
                                    {{ keyword }} ({{ count }})
                                  </a-tag>
                                </template>
                              </div>
                            </div>
                          </div>
                        </section>
                      </template>
                    </a-drawer>
                  </template>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>

          <!-- 添加保存配置的模态框 -->
          <a-modal
            v-model:open="saveModalVisible"
            title="Save Filter Preset"
            @ok="saveCurrentPreset"
          >
            <a-input v-model:value="newPresetName" placeholder="Enter preset name" />
          </a-modal>

          <!-- Add modal for selected keywords -->
          <a-modal
            v-model:open="showSelectedModal"
            title="Selected Keywords"
            width="800px"
            @cancel="handleModalClose"
          >
            <template v-if="isLoadingModalKeywords">
              <div class="loading-container">
                <a-spin />
              </div>
            </template>
            <template v-else>
              <a-tabs
                v-model:activeKey="currentModalTab"
                @change="handleModalTabChange"
              >
                <a-tab-pane
                  v-for="tab in modalTabs"
                  :key="tab.key"
                  :tab="tab.label"
                >
                  <div class="list-header">
                    <span>Total Selected: {{ modalKeywords[tab.key].length }} keywords</span>
                  </div>
                  
                  <a-list
                    :data-source="modalKeywords[tab.key]"
                    class="selected-keywords-list"
                  >
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <div class="selected-keyword-item">
                          <div class="keyword-main">
                            <div class="keyword-header">
                              <span class="keyword-text">"{{ item.keyword }}"</span>
                              <a-button 
                                type="link" 
                                danger
                                size="small"
                                @click="handleCancelSelection(item)"
                              >
                                Remove from list
                              </a-button>
                            </div>
                            <div class="keyword-metrics">
                              <a-tag class="krs-tag">KRS={{ item.krs }}</a-tag>
                              <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                              <a-tag color="purple">Volume={{ item.volume }}</a-tag>
                              <a-tag :color="item.status?.color">{{ item.status?.text }}</a-tag>
                            </div>
                          </div>
                          <div class="keyword-reason" v-if="item.reason">
                            <BulbOutlined />
                            <div class="reason-content">
                              <span class="reason-highlight">Reason: </span>
                              <span class="reason-value">{{ item.reason }}</span>
                            </div>
                          </div>
                        </div>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-tab-pane>
              </a-tabs>
            </template>
            
            <template #footer>
              <a-button @click="handleModalClose">Close</a-button>
            </template>
          </a-modal>
        </template>
      </template>

      <template v-else>
        <no-site-configured/>
      </template>
    </a-spin>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed, h, watch, nextTick, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { 
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  EyeOutlined,
  BulbOutlined,
  CompassOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  LinkOutlined,
  LineChartOutlined,
  TrophyOutlined,
  ExportOutlined,
  LoadingOutlined,
  WarningOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import {
  tableColumns,
  competitorColumns,
  tableData,
  recommendedKeywords as importedRecommendedKeywords  // 重命名导入
} from '../data/keywordPlanningData'
import { message } from 'ant-design-vue'
import api from '../api/api'
import { useRouter } from 'vue-router'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import { Modal } from 'ant-design-vue'

export default defineComponent({
  name: 'KeywordsPlanningPage',
  components: {
    PageLayout,
    DeleteOutlined,
    PlusOutlined,
    SaveOutlined,
    EyeOutlined,
    BulbOutlined,
    CompassOutlined,
    FileTextOutlined,
    OrderedListOutlined,
    LinkOutlined,
    LineChartOutlined,
    TrophyOutlined,
    ExportOutlined,
    LoadingOutlined,
    WarningOutlined,
    NoSiteConfigured,
    ClockCircleOutlined,
    SearchOutlined,
    HeartOutlined,
    HeartFilled,
    InfoCircleOutlined
  },
  setup() {
    const currentMode = ref('beginner')
    const selectedKeywords = ref([])
    const isGeneratingTitles = ref(false) 
    const isGeneratingOutline = ref(false) 
    const loading = ref(true) 
    const taskStartTime = ref(null)
    const taskEndTime = ref(null)
    const taskDescription = ref(null)
    const columns = computed(() => tableColumns)
    
    const overviewData = ref({
      totalKeywordsAnalyzed: 0,
      totalTopPagesAnalyzed: 0,
      absence: 0,  
      weak: 0  
    })

    const canProceedToNext = computed(() => {
      return selectedKeywords.value.length > 0;
    });

    const clearSelection = () => {
      selectedKeywords.value = []
      recommendedKeywords.value.forEach(k => k.selected = false)
      pageKeywords.value.forEach(k => k.selected = false)
    }

    // 添加新的数据结构
    const overviewStats = ref({
      totalKeywords: 2500,
      ourTopPages: 30,
      competitorPages: 50
    })

    // 修改 priorities 数组,level 改为 1-5
    const priorities = [
      {
        level: '1',
        label: 'P1 - Quick Wins', // 改为 P1
        color: '#f50',
        description: 'High impact, low effort opportunities'
      },
      {
        level: '2',
        label: 'P2 - High Priority', // 改为 P2
        color: '#fa8c16', 
        description: 'Important terms with good potential'
      },
      {
        level: '3',
        label: 'P3 - Medium Priority', // 改为 P3
        color: '#1890ff',
        description: 'Valuable but requires more effort'
      },
      {
        level: '4',
        label: 'P4 - Low Priority', // 改为 P4
        color: '#52c41a',
        description: 'Long-term opportunities'
      },
      {
        level: '5',
        label: 'P5 - Monitor', // 改为 P5
        color: '#722ed1',
        description: 'Keep an eye on these terms'
      }
    ]

    const recommendedKeywords = ref([])
    const pageKeywords = ref([])
    const recommendedPagination = ref({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const pagePagination = ref({
      current: 1,
      pageSize: 10,
      total: 0
    })

    // 修改数据转换方法
    const transformKeywordData = (item) => {
      return {
        id: item.keywordId,
        keyword: item.keyword,
        selected: false,
        favorited: item.status === 'selected', // 添加favorited字段
        krs: Number(item.krsScore).toFixed(2), // 使用 krsScore 字段，保留两位小数
        kd: item.kd, // 直接使用 kd 字段
        volume: item.volume, // 直接使用 volume 字段
        cpc: Number(item.cpc).toFixed(2), // 添加 cpc 字段，保留两位小数
        status: getKeywordStatus(item),
        grade: item.grade,
        reason: item.reasoning || 'No specific reason provided', // 使用 reasoning 字段，如果为空则提供默认值
        pages: [], // 页面信息
        competitors: [] // 竞争对手信息
      }
    }

    // 1. 修改 fetchKeywords 方法，确保正确发送 level 参数
    const fetchKeywords = async (source, level, page = 1, limit = 10) => {
      try {
        console.log('Fetching keywords with params:', { source, level, page, limit })
        const response = await api.getPlanningKeywords({
          source,
          level,
          page,
          limit,
          status: '' // 默认获取所有关键词
        })
        
        if (response?.data) {
          const transformedData = response.data.map(transformKeywordData)
          if (source === 'keywords') {
            recommendedKeywords.value = transformedData
            recommendedPagination.value.total = response.totalCount
          } else if (source === 'top_page_keywords') {
            pageKeywords.value = transformedData
            pagePagination.value.total = response.totalCount
          }
        }
      } catch (error) {
        console.error('获取关键词失败:', error)
      } finally {
        // 所有数据加载完成后，关闭 loading
        loading.value = false
      }
    }

    const handleComparisonPaginationChange = (priority, page, pageSize) => {
      console.log('Comparison Pagination change:', { priority, page, pageSize })
      recommendedPagination.value.current = page
      recommendedPagination.value.pageSize = pageSize
      fetchKeywords('keywords', priority, page, pageSize)
    }

    const handleTopPagesPaginationChange = (priority, page, pageSize) => {
      console.log('Top Pages Pagination change:', { priority, page, pageSize })
      pagePagination.value.current = page
      pagePagination.value.pageSize = pageSize
      fetchKeywords('top_page_keywords', priority, page, pageSize)
    }

    // 将原来分散的 onMounted 逻辑合并到一个地方
    onMounted(async () => {
      loading.value = true
      try {
        // 1. 检查域名配置状态
        await checkDomainStatus()

        // 2. 如果域名已配置,执行后续初始化
        if (domainConfigured.value) {
          // 检查分析状态
          await checkAnalysisStatus()
          
          // 启动轮询(如果需要)
          if (analysisState.value !== 'finished') {
            pollingInterval.value = setInterval(checkAnalysisStatus, 5000)
          }

          // 初始化已选关键词
          initializeSelectedKeywords()
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        message.error('Failed to initialize the page')
      } finally {
        // 移除这里的 loading.value = false，
        // 让它在 checkAnalysisStatus 中处理
      }
    })

    // 确保在组件卸载时清理轮询
    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    })

    // 合并所有的 watch 逻辑
    watch(
      // 监听多个数据源
      [
        () => recommendedKeywords.value,
        () => pageKeywords.value,
        () => selectedKeywords.value
      ],
      ([newRecommendedKeywords, newPageKeywords, newSelectedKeywords], [oldRecommendedKeywords, oldPageKeywords, oldSelectedKeywords]) => {
        // 1. 处理推荐关键词变化
        if (newRecommendedKeywords !== oldRecommendedKeywords) {
          console.log('recommendedKeywords变化:', newRecommendedKeywords)
          // 只同步选中的关键词到 selectedKeywords
          const selectedOnes = newRecommendedKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newRecommendedKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }

        // 2. 处理页面关键词变化
        if (newPageKeywords !== oldPageKeywords) {
          // 只同步选中的关键词到 selectedKeywords
          const selectedOnes = newPageKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newPageKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }
      },
      {
        deep: true // 深度监听对象变化
      }
    )

    const handleKeywordSelect = (keyword, isSelected) => {
      if (isSelected) {
        if (!selectedKeywords.value.find(k => k.keyword === keyword.keyword)) {
          selectedKeywords.value.push({
            ...keyword,
            selected: true
          })
        }
      } else {
        selectedKeywords.value = selectedKeywords.value.filter(
          k => k.keyword !== keyword.keyword
        )
      }
    }

    const getKeywordsByPriority = (keywords, priority) => {
      if (!keywords || !keywords.length) return []
      
      // 将priority等级映射到grade
      const priorityToGrade = {
        '1': '1', // P0
        '2': '2', // P1
        '3': '3', // P2
        '4': '4', // P3
        '5': '5'  // P4
      }
      
      const grade = priorityToGrade[priority]
      return keywords.filter(k => k.grade === grade)
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
        value: 50,
        id: Date.now() // 添加唯一ID以帮助Vue追踪数组变化
      });
    };

    const removeFilter = (index) => {
      // 直接删除指定索引的筛选条件，不需要检查数量
      filters.value.splice(index, 1);
    };

    const clearFilters = () => {
      filters.value = [];
      currentPreset.value = null;
    };

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

    const currentStep = ref('0')
    const nextStep = async () => {
      if (!canProceedToNext.value) {
        message.warning('请至少选择一个关键词')
        return
      }
      
      if (currentStep.value < '1') {
        currentStep.value = '1'
      }
    }

    const previousStep = () => {
      if (currentStep.value > '0') {  // 修改这里的比较
        currentStep.value = '0'  // 修改这里为字符串
      }
    }

    // Modal control
    const showSelectedModal = ref(false)

    // 修改数据结构
    const modalTabs = ref([
      { key: 'comparison', label: 'From Comparison' },
      { key: 'top_pages', label: 'From Top Pages' }
    ])
    const currentModalTab = ref('comparison')
    const modalKeywords = ref({
      comparison: [],
      top_pages: []
    })

    // 修改 fetchSelectedKeywords 方法
    const fetchSelectedKeywords = async () => {
      isLoadingModalKeywords.value = true
      try {
        const [keywordsResponse, pageKeywordsResponse] = await Promise.all([
          api.getPlanningKeywords({
            source: 'keywords',
            status: 'selected',
            page: 1,
            limit: 100
          }),
          api.getPlanningKeywords({
            source: 'top_page_keywords',
            status: 'selected',
            page: 1,
            limit: 100
          })
        ])
        
        modalKeywords.value = {
          comparison: (keywordsResponse?.data || []).map(transformKeywordData),
          top_pages: (pageKeywordsResponse?.data || []).map(transformKeywordData)
        }
      } catch (error) {
        console.error('获取已选关键词失败:', error)
        message.error('获取已选关键词失败')
      } finally {
        isLoadingModalKeywords.value = false
      }
    }

    const handleModalClose = () => {
      showSelectedModal.value = false
    }

    const isGenerating = ref(false)

    // 添加生成状态追踪
    const hasGenerated = ref(false)

    // 修改 filteredKeywords 的定义
    const filteredKeywords = ref(tableData)

    // 添加新的方法
    const getRankClass = (rank) => {
      if (rank <= 3) return 'top-3'
      if (rank <= 10) return 'top-10'
      return 'others'
    }

    // 添加初始化函数来同步已选中的关键词
    const initializeSelectedKeywords = () => {
      const preSelectedKeywords = recommendedKeywords.value.filter(k => k.selected)
      selectedKeywords.value = preSelectedKeywords.map(k => ({
        ...k,
        selected: true
      }))
    }

    // 在组件创建时立即执行初始化
    initializeSelectedKeywords()

    const analysisStatus = ref(null)
    const pollingInterval = ref(null)
    const taskInfo = ref(null)

    // 修改: 检查关键词分析状态的方法
    const checkAnalysisStatus = async () => {
      if (!domainConfigured.value) {
        loading.value = false;
        return;
      }

      try {
        const response = await api.getAnalysisStatus('analyze_keywords')
        if (response) {
          taskInfo.value = response
          if (response.analysisStatus === 'finished') {
            clearInterval(pollingInterval.value)
            // 获取概览数据
            const overview = await api.getKeywordAnalysisOverview()
            if (overview?.data) {
              overviewData.value = {
                totalKeywordsAnalyzed: overview.data.totalKeywordsAnalyzed,
                totalTopPagesAnalyzed: overview.data.totalTopPagesAnalyzed,
                absence: overview.data.keywordsGroup.absence,
                weak: overview.data.keywordsGroup.weak || 0
              }
            }
            // 分析完成后，加载关键词数据
            await Promise.all([
              fetchKeywords('keywords', currentPriority.value, 1, recommendedPagination.value.pageSize),
              fetchKeywords('top_page_keywords', currentPriority.value, 1, pagePagination.value.pageSize)
            ])
          }
        }
      } catch (error) {
        console.error('Failed to check analysis status:', error)
        message.error('Failed to check analysis status')
      } finally {
        // 只有在所有数据都加载完成后，才关闭 loading
        if (taskInfo.value?.analysisStatus !== 'finished') {
          loading.value = false
        }
      }
    }

    // Computed property to determine what to display
    const analysisState = computed(() => {
      if (loading.value) return 'loading'
      return taskInfo.value?.analysisStatus || 'not_started'
    })

    // Add a computed property for current tasks
    const currentTasks = computed(() => {
      if (!taskInfo.value?.data || !Array.isArray(taskInfo.value.data)) return []
      return taskInfo.value.data
    })

    const getProgressPercent = (progress) => {
      if (!progress || !progress.total) return 0
      return Math.round((progress.current / progress.total) * 100)
    }

    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleString()
    }

    const domainConfigured = ref(false)
    const router = useRouter()

    // 检查域名配置状态
    const checkDomainStatus = async () => {
      loading.value = true
      try {
        const response = await api.getProductsByCustomerId()
        domainConfigured.value = response.data?.domainStatus || false
      } catch (error) {
        console.error('Failed to fetch product info:', error)
        domainConfigured.value = false
      } finally {
        loading.value = false
      }
    }

    // 修改状态判断方法
    const getKeywordStatus = (item) => {
      // 根据grade判断状态
      const gradeMap = {
        '1': { text: 'Quick Win Choose', color: 'red' },
        '2': { text: 'High Priority', color: 'orange' },
        '3': { text: 'Medium Priority', color: 'blue' },
        '4': { text: 'Low Priority', color: 'cyan' },
        '5': { text: 'Monitor', color: 'purple' }
      }
      
      return gradeMap[item.grade] || { text: 'Unknown', color: 'default' }
    }

    // 添加响应式变量存储当前选中的 priority
    const currentPriority = ref('1') // 默认选中 P0

    // 添加 tab 切换处理函数
    const handleTabChange = (activeKey) => {
      console.log('Tab changed to:', activeKey)
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        // 重置分页到第一页
        recommendedPagination.value.current = 1
        // 重新获取数据
        fetchKeywords('keywords', priority.level, 1, recommendedPagination.value.pageSize)
      }
    }

    // Add new refs
    const contentPlans = ref([])

    // Add new computed property
    const selectedPlansCount = computed(() => {
      return contentPlans.value.filter(plan => plan.selected).length
    })

    const generateContentPlan = async () => {
      if (totalSelectedKeywords.value === 0) {
        message.warning('Please select at least one keyword');
        return;
      }

      isGenerating.value = true;
      try {
        // Get IDs of all selected keywords from both sources
        const selectedIds = [
          ...selectedKeywordsData.value.comparison.map(k => k.id),
          ...selectedKeywordsData.value.top_pages.map(k => k.id)
        ];

        // Call API to generate content plan
        const response = await api.generatePlanningComposite(selectedIds);
        
        if (response?.data) {
          // Update content plans list
          contentPlans.value = response.data.map(plan => ({
            ...plan,
            selected: false,
            favorited: plan.status === 'selected'
          }));
          
          hasGenerated.value = true;
          message.success('Content plan generated successfully');
          
          // Auto switch to "All Outlines" tab
          contentPlanTab.value = 'all';
          
          // Reset pagination
          contentPlansPagination.value.current = 1;
        }
      } catch (error) {
        console.error('Failed to generate content plan:', error);
        message.error('Failed to generate content plan. Please try again.');
      } finally {
        isGenerating.value = false;
      }
    };

    const handlePlanSelect = (plan, checked) => {
      plan.selected = checked
    }

    const confirmSelectedPlans = async () => {
      const selectedPlans = contentPlans.value.filter(plan => plan.selected)
      if (selectedPlans.length) {
        // Handle selected plans confirmation
        console.log('Selected plans:', selectedPlans)
        message.success('Content plans confirmed')
      }
    }

    // 添加新的响应式变量
    const drawerVisible = ref(false)
    const selectedPlan = ref(null)

    // 添加新的方法
    const showPlanDetails = (plan) => {
      selectedPlan.value = plan
      drawerVisible.value = true
    }

    const closeDrawer = () => {
      drawerVisible.value = false
      selectedPlan.value = null
    }

    const getTotalWordCount = (plan) => {
      return plan.outline.reduce((total, section) => {
        return total + Number(section.wordCount)
      }, 0)
    }

    // 修改 watch，添加对 tab 切换的处理
    watch(currentStep, async (newStep) => {
      if (newStep === '0') {
        // 切换到 Select Keywords tab，重新加载关键词数据
        await Promise.all([
          fetchKeywords('keywords', currentPriority.value, 1, recommendedPagination.value.pageSize),
          fetchKeywords('top_page_keywords', currentPriority.value, 1, pagePagination.value.pageSize)
        ])
      } else if (newStep === '1') {
        // 重置第二步相关的状态
        contentPlans.value = []
        hasGenerated.value = false
        isGenerating.value = false
        
        // 移除重复的 fetchContentPlans 调用，只在 status 未完成时才调用
        const statusResponse = await checkOutlineGenerationStatus()
        if (!statusResponse?.data || statusResponse.data.status !== 'finished') {
          await fetchContentPlans()
        }
      }
    })

    const checkOutlineGenerationStatus = async () => {
      try {
        const response = await api.getAnalysisStatus('composite_generator')
        
        if (response?.code === 200 && response?.data) {
          outlineGenerationStatus.value = response.data.status
          taskStartTime.value = response.data.startTime
          taskEndTime.value = response.data.endTime
          taskDescription.value = formatTaskDescription(response.data.description)
          
          if (response.data.status === 'finished') {
            clearInterval(pollingInterval.value)
            hasGenerated.value = true
            await fetchContentPlans()
          }
        } else {
          message.error('获取大纲生成状态失败')
        }
        return response
      } catch (error) {
        console.error('Failed to check outline generation status:', error)
        message.error('检查大纲生成状态失败')
        return null
      }
    }

    // 获取内容计划的方法
    const fetchContentPlans = async () => {
      isLoadingOutlines.value = true
      try {
        const outlinesResponse = await api.getPlanningOutlines({
          status: contentPlanTab.value === 'selected' ? 'selected' : '',
          page: contentPlansPagination.value.current,
          limit: contentPlansPagination.value.pageSize
        })
        
        if (outlinesResponse?.data) {
          contentPlans.value = outlinesResponse.data.map(plan => ({
            ...plan,
            selected: false,
            favorited: plan.status === 'selected'
          }))
          contentPlansPagination.value.total = outlinesResponse.totalCount || 0
          hasGenerated.value = true
        } else {
          message.error('获取大纲列表失败')
        }
      } catch (error) {
        console.error('Failed to fetch content plans:', error)
        message.error('获取内容计划失败')
      } finally {
        isLoadingOutlines.value = false
      }
    }

    // 新增: 处理分页变化的方法
    const handleContentPlansPaginationChange = async (page, pageSize) => {
      contentPlansPagination.value.current = page
      contentPlansPagination.value.pageSize = pageSize
      await fetchContentPlans()
    }

    // 添加 outlineGenerationStatus 的定义
    const outlineGenerationStatus = ref(null)

    const contentPlansPagination = ref({
      current: 1,
      pageSize: 12,
      total: 0
    })

    // 添加相关的方法
    const handleFavorite = async (plan, event) => {
      try {
        if (plan.favorited) {
          // Cancel favorite
          await api.cancelPlanningOutlines([plan.outlineId]);
          plan.favorited = false;
          message.success('Removed from favorites');
        } else {
          // Add to favorites
          await api.selectPlanningOutlines([plan.outlineId]);
          plan.favorited = true;
          message.success('Added to favorites');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    // 添加 contentPlanTab 的定义
    const contentPlanTab = ref('all')

    // 添加 tab 切换处理方法
    const handleContentPlanTabChange = (activeKey) => {
      contentPlanTab.value = activeKey
      // 重置分页
      contentPlansPagination.value.current = 1
      // 重新获取数据
      fetchContentPlans()
    }

    // 添加loading状态
    const isLoadingOutlines = ref(false)

    // 添加收藏/取消收藏关键词的方法
    const handleKeywordFavorite = async (keyword) => {
      try {
        if (keyword.favorited) {
          // 取消收藏
          await api.cancelPlanningKeywords([keyword.id]);
          keyword.favorited = false;
          message.success('Removed from favorites');
        } else {
          // 添加收藏
          await api.selectPlanningKeywords([keyword.id]);
          keyword.favorited = true;
          message.success('Added to favorites');
        }
      } catch (error) {
        console.error('收藏操作失败:', error);
        message.error('操作失败');
      }
    };

    // 添加 tab 切换处理方法
    const handleModalTabChange = (activeKey) => {
      currentModalTab.value = activeKey
    }

    // 添加 showSelectedKeywords 方法
    const showSelectedKeywords = async () => {
      showSelectedModal.value = true
      await fetchSelectedKeywords()
    }

    // 添加 loading 状态变量
    const isLoadingModalKeywords = ref(false)

    // 添加取消选择方法
    const handleCancelSelection = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        // 从列表中移除该关键词
        const sourceType = currentModalTab.value
        modalKeywords.value[sourceType] = modalKeywords.value[sourceType].filter(k => k.id !== keyword.id)
        message.success('关键词已取消选择')
      } catch (error) {
        console.error('取消选择失败:', error)
        message.error('取消选择失败')
      }
    }

    // 添加新的响应式变量
    const selectedKeywordsTab = ref('comparison')
    const selectedKeywordsData = ref({
      comparison: [],
      top_pages: []
    })
    const isLoadingSelectedKeywords = ref(false)

    // 修改 watch 以同步数据
    watch(currentStep, async (newStep) => {
      if (newStep === '1') {
        // 当切换到 outline tab 时，加载已选关键词
        await fetchSelectedKeywordsData()
      }
    })

    // 添加获取已选关键词的方法
    const fetchSelectedKeywordsData = async () => {
      isLoadingSelectedKeywords.value = true
      try {
        const [keywordsResponse, pageKeywordsResponse] = await Promise.all([
          api.getPlanningKeywords({
            source: 'keywords',
            status: 'selected',
            page: 1,
            limit: 100
          }),
          api.getPlanningKeywords({
            source: 'top_page_keywords',
            status: 'selected',
            page: 1,
            limit: 100
          })
        ])
        
        selectedKeywordsData.value = {
          comparison: (keywordsResponse?.data || []).map(transformKeywordData),
          top_pages: (pageKeywordsResponse?.data || []).map(transformKeywordData)
        }
      } catch (error) {
        console.error('获取已选关键词失败:', error)
        message.error('获取已选关键词失败')
      } finally {
        isLoadingSelectedKeywords.value = false
      }
    }

    // 新的移除关键词方法
    const handleRemoveKeyword = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        // 从两个列表中移除该关键词
        const sourceType = selectedKeywordsTab.value
        selectedKeywordsData.value[sourceType] = selectedKeywordsData.value[sourceType].filter(k => k.id !== keyword.id)
        // 同时更新 selectedKeywords
        selectedKeywords.value = selectedKeywords.value.filter(k => k.id !== keyword.id)
        message.success('关键词已移除')
      } catch (error) {
        console.error('移除关键词失败:', error)
        message.error('移除关键词失败')
      }
    }

    // 添加计算属性来获取所有已选关键词的总数
    const totalSelectedKeywords = computed(() => {
      return selectedKeywordsData.value.comparison.length + 
             selectedKeywordsData.value.top_pages.length
    })

    const handleDeleteOutline = async (plan) => {
      try {
        // Show confirmation modal
        const confirmed = await new Promise(resolve => {
          Modal.confirm({
            title: 'Delete Outline',
            content: 'Are you sure you want to delete this outline? This action cannot be undone.',
            okText: 'Delete',
            cancelText: 'Cancel',
            okType: 'danger',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (confirmed) {
          await api.deletePlanningOutline(plan.outlineId);
          message.success('Outline deleted successfully');
          // Refresh the outlines list
          await fetchContentPlans();
        }
      } catch (error) {
        console.error('Failed to delete outline:', error);
        message.error('Failed to delete outline');
      }
    };

    // Add new refs and methods in setup
    const taskProgress = ref(null)
    const taskMessage = ref('')

    const getTaskStatusText = (status) => {
      const statusMap = {
        'processing': '🚀 AI is crafting your content plans...',
        'failed': '❌ Oops! Content plan generation failed',
        'not_started': '⏳ Getting ready to create your content plans',
        'finished': '✨ Content plans are ready!'
      }
      return statusMap[status] || 'Unknown Status'
    }

    const formatTaskDescription = (description) => {
      if (description?.includes('composite_generator')) {
        return "Our AI is analyzing your keywords and creating personalized content recommendations. This usually takes 1-2 minutes."
      }
      return description
    }

    const getProgressStatus = (status) => {
      const statusMap = {
        'processing': 'active',
        'failed': 'exception',
        'finished': 'success',
        'not_started': 'normal'
      }
      return statusMap[status] || 'normal'
    }

    const clearAllOutlines = async () => {
      try {
        isLoadingOutlines.value = true
        
        // Delete outlines one by one in current page
        for (const plan of contentPlans.value) {
          await api.deletePlanningOutline(plan.outlineId)
        }
        
        message.success('All outlines have been cleared')
        
        // Refresh the content plans list
        await fetchContentPlans()
      } catch (error) {
        console.error('Failed to clear outlines:', error)
        message.error('Failed to clear outlines. Please try again.')
      } finally {
        isLoadingOutlines.value = false
      }
    }

    const confirmClearAllOutlines = () => {
      Modal.confirm({
        title: 'Clear All Outlines',
        content: 'Are you sure you want to delete all outlines? This action cannot be undone.',
        okText: 'Yes, Clear All',
        cancelText: 'Cancel',
        okType: 'danger',
        async onOk() {
          await clearAllOutlines()
        },
        okButtonProps: {
          danger: true
        },
        centered: true,
        maskClosable: false
      })
    }

    return {
      showSelectedKeywords,
      currentMode,
      selectedKeywords,
      overviewData,
      clearSelection,
      overviewStats: ref(overviewStats),
      priorities,
      recommendedKeywords,  // 确保在 return 中暴露
      pageKeywords: ref(pageKeywords),
      savedPresets: ref(savedPresets),
      columns,
      competitorColumns: computed(() => competitorColumns),
      rowSelection,
      pagination,
      handleTableChange,
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
      showSelectedModal,
      showSelectedKeywords,
      handleModalClose,
      getKeywordsByPriority,
      isGenerating,
      isGeneratingTitles,
      isGeneratingOutline,
      hasGenerated,
      filteredKeywords,
      getRankClass,
      handleKeywordSelect,
      addFilter,
      removeFilter,
      filters,
      clearFilters,
      analysisStatus,
      loading,
      analysisState,
      taskInfo,
      currentTasks,
      getProgressPercent,
      formatTime,
      domainConfigured,
      recommendedPagination,
      pagePagination,
      handleComparisonPaginationChange,
      handleTopPagesPaginationChange,
      currentPriority,
      handleTabChange,
      contentPlans,
      selectedPlansCount,
      generateContentPlan,
      handlePlanSelect,
      confirmSelectedPlans,
      canProceedToNext,
      drawerVisible,
      selectedPlan,
      showPlanDetails,
      closeDrawer,
      getTotalWordCount,
      checkOutlineGenerationStatus,
      outlineGenerationStatus,
      contentPlansPagination,
      handleContentPlansPaginationChange,
      handleFavorite,
      contentPlanTab,
      handleContentPlanTabChange,
      isLoadingOutlines,
      handleKeywordFavorite,
      modalKeywords,
      isLoadingModalKeywords,
      modalTabs,
      currentModalTab,
      handleModalTabChange,
      handleCancelSelection,
      selectedKeywordsTab,
      selectedKeywordsData,
      isLoadingSelectedKeywords,
      handleRemoveKeyword,
      totalSelectedKeywords,
      handleDeleteOutline,
      taskProgress,
      taskMessage,
      getTaskStatusText,
      getProgressStatus,
      taskStartTime,
      taskEndTime,
      taskDescription,
      formatTaskDescription,
      confirmClearAllOutlines,
    }
  }
})
</script>

<style scoped>
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

.mode-selector-card {
  margin-bottom: 16px;
  
  :deep(.ant-card-body) {
    padding: 16px 24px;
  }
}

.mode-selector-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: 24px;
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
  display: flex;
  flex-direction: column;
  gap: 16px; /* 减小内部间距 */
}

.filter-rows {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 减小筛选条件之间的间距 */
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-connector {
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.45);
  font-weight: 500;
}

.ant-select-field {
  width: 120px;  /* 减小宽度 */
}

.ant-select-operator {
  width: 50px;  /* 减小宽度 */
}

.ant-input-value {
  width: 80px;  /* 减小宽度 */
}

.source-value-selector {
  width: 140px;  /* 减小宽度 */
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

.selected-keywords-list {
  max-height: 600px;
  overflow-y: auto;
}

.list-header {
  font-size: 14px;
  color: #8c8c8c;
  padding: 8px 0;
}

.selected-keyword-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.keyword-main {
  flex: 1;
  min-width: 0;
  cursor: help; /* Add cursor hint for items with tooltip */
}

.keyword-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.keyword-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.keyword-text {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.keyword-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.metric-tag {
  margin: 0;
  font-size: 11px;
  line-height: 16px;
  padding: 0 4px;
}

.remove-btn {
  padding: 0;
  height: auto;
  min-width: 24px;
}

/* Remove the old reason-related styles */

/* 添加空状态的样式 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 48px;
  flex: 1; /* 添加这行 */
  width: 100%; /* 添加这行 */
  background: #fff; /* 添加背景色 */
  border-radius: 8px; /* 添加圆角 */
  margin-left: 24px; /* 与左侧列表保持一致的间距 */
}

.empty-content {
  text-align: center;
  max-width: 480px;
  width: 100%; /* 添加这行 */
}

.empty-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.result-card {
  background: #fff;
  border-radius: 8px;
  
  :deep(.ant-card-head) {
    min-height: 48px;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  
  .anticon {
    color: #1890ff;
  }
}

.topic-list,
.title-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-item,
.title-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: #fafafa;
  }
  
  :deep(.ant-checkbox-wrapper) {
    width: 100%;
    
    .ant-checkbox {
      top: 2px;
    }
  }
}

.topic-content,
.title-content {
  margin-left: 8px;
}

.topic-main,
.title-main {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.topic-reason {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.title-metrics {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.outline-section {
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.section-keywords {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.point-item {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 8px;
  padding-left: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.selected-keywords-card {
  width: 320px;
  flex-shrink: 0;
  height: fit-content;
  
  :deep(.ant-card-body) {
    padding: 0;
    max-height: calc(100vh - 280px);
    overflow-y: auto;
  }
}

.selected-keywords-list {
  :deep(.ant-list-item) {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.selected-keyword-item {
  width: 100%;
  
  .keyword-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }
  
  .keyword-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .ant-tag {
      margin-right: 0;
    }
  }
}

.workspace-card {
  flex: 1;
  min-width: 0; 
}

.workspace-layout {
  display: flex;
  gap: 24px;
  height: calc(100vh - 200px); /* 确保占满剩余高度 */
  overflow: hidden; /* 防止溢出 */
}
/* 添加纵向导航样式 */
.vertical-nav {
  position: sticky;
  top: 24px;
  height: fit-content;
  padding: 16px 0;
  margin: 0 16px;
  border-left: 1px solid #f0f0f0;
  
  :deep(.ant-anchor) {
    padding-left: 0;
    
    &::before {
      display: none;
    }
    
    .ant-anchor-link {
      padding: 4px 0 4px 16px;
      
      .ant-anchor-link-title {
        color: rgba(0, 0, 0, 0.45);
        font-size: 13px;
        transition: all 0.3s;
        
        &:hover {
          color: #1890ff;
        }
      }
      
      &-active {
        background: rgba(24, 144, 255, 0.04);
        border-left: 2px solid #1890ff;
        margin-left: -1px;
        
        .ant-anchor-link-title {
          color: #1890ff;
          font-weight: 500;
        }
      }
    }
  }
}

/* 修改工作区布局样式 */
.workspace-layout {
  display: flex;
  gap: 24px;
  height: calc(100vh - 200px); /* 确保占满剩余高度 */
  overflow: hidden; /* 防止溢出 */
}
/* 确保结果卡片有足够的下边距 */
.result-card {
  margin-bottom: 24px;
  scroll-margin-top: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.vertical-nav {
  :deep(.nav-disabled) {
    cursor: not-allowed;
    opacity: 0.5;
    
    .ant-anchor-link-title {
      color: rgba(0, 0, 0, 0.25) !important;
      pointer-events: none;
    }
    
    &:hover {
      background: none;
    }
  }
}

.topic-list,
.title-list {
  margin-bottom: 0; /* 移除底部边距，因为现在有了 action-footer */
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.empty-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 24px;
}

.empty-actions {
  display: flex;
  justify-content: center;
}

.configure-btn {
  background: linear-gradient(135deg, #1890ff, #3B82F6);
  border: none;
}
.content-topics-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
  padding: 16px; /* 添加整体列表的内边距 */
}

.content-topic-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 20px; /* 添加卡片的内边距 */
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
}

.content-topic-header {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px; /* 添加底部外边距 */
}

.content-topic-title {
  font-size: 15px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
}

.content-topic-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.content-topic-body {
  padding: 0; /* 重置body内边距,因为已经有卡片内边距 */
}

.content-topic-section {
  margin-bottom: 16px; /* 增加section间距 */
  
  &:last-child {
    margin-bottom: 0;
  }
}

.content-section-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.content-section-text {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
}

.content-keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tdk-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.tdk-item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 20px;
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
}

.tdk-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tdk-section {
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.tdk-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.tdk-text {
  font-size: 14px;
  color: #262626;
  line-height: 1.5;
}

.tdk-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tdk-metrics {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* 添加新的样式 */
.expanded-row {
  display: flex;
  gap: 32px;
  padding: 16px 24px;
  background: #fafafa;
}

.expanded-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.section-icon {
  color: #1890ff;
  font-size: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.page-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.page-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s;
  
  &:hover {
    background: #e6f7ff;
    border-color: #91d5ff;
  }
}

.page-icon {
  font-size: 12px;
  color: #1890ff;
}

.rank-icon {
  font-size: 14px;
  color: #faad14;
}

.rank-number {
  font-weight: 500;
  
  &.top-3 {
    color: #52c41a;
  }
  
  &.top-10 {
    color: #1890ff;
  }
  
  &.others {
    color: rgba(0, 0, 0, 0.65);
  }
}

.url-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #1890ff;
  transition: all 0.3s;
  
  &:hover {
    color: #40a9ff;
    
    .url-icon {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.url-icon {
  font-size: 12px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s;
}

.action-footer {
  display: none;
}

.tdk-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tdk-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f7ff;
  }
}

.tdk-content {
  margin-left: 24px;
}

.tdk-section {
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.tdk-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}

.tdk-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
}

.tdk-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 修改结果卡片的样式 */
.result-card {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  :deep(.ant-card-body) {
    padding: 24px;
  }
}

/* 大纲内容样式 */
.outline-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 16px; /* 添加底部内边距 */
}

.outline-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.section-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.section-points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.point-item {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.6;
  padding-left: 8px;
}

/* 确保工作区布局有足够的空间 */
.workspace-layout {
  display: flex;
  gap: 24px;
  min-height: calc(100vh - 240px);
  padding-bottom: 24px; /* 添加底部内边距 */
}

/* Add new styles */
.analysis-loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
}

.loading-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.loading-content {
  text-align: center;
  padding: 32px;
}

.analysis-pending {
  padding: 40px 24px;
  text-align: center;
}

.analysis-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 16px;
}

.analysis-progress {
  max-width: 400px;
  margin: 24px auto;
}

.analysis-tip {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-top: 8px;
}

h2 {
  margin: 16px 0;
  color: #262626;
  font-size: 24px;
}

p {
  color: #595959;
  font-size: 16px;
  line-height: 1.5;
  margin: 8px 0;
}

.analysis-waiting,
.analysis-processing,
.analysis-error {
  padding: 40px 24px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #ff4d4f;
  margin-bottom: 24px;
}

.analysis-progress {
  max-width: 400px;
  margin: 24px auto;
}

.analysis-tip {
  color: #666;
  margin-top: 16px;
}

h2 {
  margin: 16px 0;
  color: #262626;
  font-size: 24px;
}

p {
  color: #595959;
  font-size: 16px;
  line-height: 1.5;
  margin: 8px 0;
}

/* Add minimal required styles */
.loading-content {
  padding: 24px;
  text-align: center;
}

.task-item {
  margin: 16px 0;
  text-align: left;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.task-timing {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-result) {
  padding: 48px 32px;
}

:deep(.ant-result-title) {
  color: #1a1a1a;
}

:deep(.ant-result-subtitle) {
  color: #6b7280;
}

.pagination-wrapper {
  margin-top: 16px;
  text-align: right;
}

/* 添加表格容器高度样式 */
.keywords-table-container {
  height: 600px; /* 设置一个固定高度 */
  
  :deep(.ant-table-wrapper) {
    height: 100%;
  }
  
  :deep(.ant-spin-nested-loading),
  :deep(.ant-spin-container),
  :deep(.ant-table) {
    height: 100%;
  }
  
  :deep(.ant-table-container) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  :deep(.ant-table-body) {
    flex: 1;
    overflow: auto;
  }
}

/* 确保分页器在表格底部 */
.pagination-wrapper {
  margin-top: 16px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.workflow-card {
  margin-bottom: 16px;
}

.steps-container {
  padding: 8px 0;
}

:deep(.compact-steps) {
  min-height: auto;
}

:deep(.compact-steps .ant-steps-item) {
  padding-inline-start: 8px;
  min-height: auto;
}

:deep(.compact-steps .ant-steps-item-container) {
  display: flex;
  align-items: center;
}

:deep(.compact-steps .ant-steps-item-content) {
  display: flex;
  align-items: center;
  min-height: auto;
}

:deep(.compact-steps .ant-steps-item-title) {
  line-height: 24px;
  margin-right: 8px;
  padding-right: 8px;
}

:deep(.compact-steps .ant-steps-item-title::after) {
  top: 12px;
}

:deep(.compact-steps .ant-steps-item-description) {
  margin-top: 0;
  padding-bottom: 0;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.compact-steps .ant-steps-item-icon) {
  margin-top: 0;
}

.step-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}

/* 添加以下样式 */
:deep(.ant-spin) {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
}

:deep(.ant-spin-spinning) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.plan-title {
  font-size: 16px;
  font-weight: 500;
}

.plan-section {
  margin-bottom: 24px;
  width: 100%;
}
.intent-content,
.tdk-content,
.outline-content {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.intent-tags {
  margin-bottom: 8px;
}

.intent-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.tdk-item {
  margin-bottom: 12px;
}

.tdk-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}

.tdk-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.outline-section {
  margin-bottom: 16px;
}

.section-header {
  margin-bottom: 8px;
}

.section-keywords {
  margin-top: 4px;
}

.point-item {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 4px;
}

.action-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.mode-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.help-icon {
  color: #8c8c8c;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #1890ff;
  }
}

.analysis-overview-popover {
  max-width: 400px;
  padding: 8px;
}

.section-desc {
  color: #595959;
  font-size: 13px;
  margin-bottom: 12px;
}

.stats-row {
  display: flex;
  gap: 16px;
}

.stat-item {
  .stat-label {
    font-size: 12px;
    color: #8c8c8c;
  }
  
  .stat-value {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  }
}

.findings-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .step-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #595959;
    
    .anticon {
      color: #1890ff;
    }
  }
}

.steps-wrapper {
  padding: 16px 24px;
  background: #fff;
}

/* 添加新的样式 */
.content-plans {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.plan-section {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-meta {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}

/* 网格布局样式 */
.content-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* 减小卡片宽度 */
  gap: 16px; /* 减小卡片间距 */
  padding: 16px;
}

.plan-card {
  cursor: pointer;
  transition: all 0.3s ease;
  
  :deep(.ant-card-body) {
    padding: 12px; /* 减小内边距 */
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 8px; /* 减小内容间距 */
  }
  
  /* 修改标题样式 */
  .plan-title {
    font-size: 14px; /* 减小标题字体 */
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 4px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* 修改描述样式 */
  .plan-description {
    font-size: 12px; /* 减小描述字体 */
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* 修改指标样式 */
  .plan-metrics {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
    
    .metric-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      .metric-label {
        font-size: 11px; /* 减小标签字体 */
        color: rgba(0, 0, 0, 0.45);
      }
      
      .metric-value {
        font-size: 13px; /* 减小数值字体 */
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
  
  /* 修改关键词标签样式 */
  .plan-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
    
    :deep(.ant-tag) {
      font-size: 11px; /* 减小标签字体 */
      padding: 0 6px;
      margin: 0;
      line-height: 18px;
    }
  }
  
  /* 修改操作按钮样式 */
  .plan-actions {
    margin-top: auto;
    
    .ant-btn {
      font-size: 12px; /* 减小按钮字体 */
      height: 28px; /* 减小按钮高度 */
      padding: 0 12px;
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* 修改分页容器样式 */
.pagination-container {
  padding: 16px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  
  :deep(.ant-pagination) {
    font-size: 12px; /* 减小分页字体 */
    
    .ant-pagination-item,
    .ant-pagination-prev,
    .ant-pagination-next {
      min-width: 28px; /* 减小分页按钮大小 */
      height: 28px;
      line-height: 26px;
    }
  }
}

.drawer-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}
.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-item {
  .item-label {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 4px;
  }
  
  .item-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 1.5;
  }
}

.content-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.outline-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.outline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.outline-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.outline-meta {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.outline-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 修改布局相关样式 */
.workspace-layout {
  display: flex;
  gap: 24px;
  width: 100%;
  min-height: calc(100vh - 180px); /* 减去头部和其他固定元素的高度 */
}

.selected-keywords-card {
  width: 320px; /* 固定宽度 */
  flex-shrink: 0; /* 防止压缩 */
}

.content-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  width: 100%;
}

/* 添加新的样式 */
.step-two-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.workspace-layout {
  flex: 1;
  width: 100%;
  display: flex;
  gap: 24px;
  padding: 24px;
  min-height: 0; /* 修改这里，允许内容自适应 */
}

.mode-selector-card {
  margin-bottom: 16px;
  
  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.mode-selector-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.mode-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.help-icon {
  color: #8c8c8c;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #1890ff;
  }
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.content-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 0;
}

.content-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.plan-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 添加 tab 相关样式 */
.planning-tabs {
  :deep(.ant-tabs-tab) {
    padding: 12px 24px;
    
    .tab-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      
      .anticon {
        font-size: 16px;
      }
    }
  }
}

/* 移除原有的 steps 相关样式 */
.steps-wrapper {
  display: none;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.favorite-icon {
  font-size: 16px;
  color: #d9d9d9;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: #ff4d4f;
    transform: scale(1.1);
  }
  
  &.favorited {
    color: #ff4d4f;
  }
}

.plan-card {
  position: relative;
  
  :deep(.ant-card-extra) {
    margin-left: 0;
  }
}

/* Update existing styles */
.content-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* Reduced from previous value */
  gap: 16px;
  margin-bottom: 24px; /* Add margin for pagination */
}

.plan-card {
  height: auto;
  
  :deep(.ant-card-body) {
    padding: 12px;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-title {
  font-size: 14px; /* Reduced from previous value */
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
  line-height: 1.4;
}

.plan-description {
  font-size: 12px; /* Reduced from previous value */
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plan-meta {
  display: flex;
  gap: 16px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    
    .anticon {
      font-size: 12px;
    }
  }
}

.plan-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  
  :deep(.ant-tag) {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    padding: 0 4px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* 添加分页容器样式 */
.pagination-wrapper {
  margin-top: 24px;
  padding: 16px 0;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  
  :deep(.ant-pagination) {
    text-align: center;
    
    .ant-pagination-options {
      margin-left: 16px;
    }
  }
}

.content-plans-grid {
  min-height: 200px; /* 确保网格区域有最小高度 */
}

/* 保留之前的样式并添加新的样式 */
.plan-section {
  height: 100%;
}

.content-plan-tabs {
  height: 100%;
  
  :deep(.ant-tabs-content) {
    height: 100%;
  }
  
  :deep(.ant-tabs-tabpane) {
    height: 100%;
  }
}

.tab-content-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
  min-height: 500px;
}

.content-plans-grid {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  background: #f0f2f5;
}

.pagination-container {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.plan-card {
  height: 100%;
  background: #fff;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.ant-card-body) {
    height: 100%;
    padding: 20px;
  }
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.plan-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plan-metrics {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.metric-value {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.plan-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.plan-actions {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

/* 添加loading状态的样式 */
.content-plans-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
}

.loading-container {
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.45);
}

/* Add new styles */
.generate-button-wrapper {
  margin-bottom: 16px;
  text-align: center;
}

/* 添加收藏按钮样式 */
.keyword-header .ant-btn-text {
  padding: 0 4px;
}

.keyword-header .ant-btn-text:hover {
  background: transparent;
}

/* Update keyword header styles */
.keyword-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.keyword-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.favorite-btn {
  padding: 4px 8px;
  margin-left: 8px;
}

.favorite-btn:hover {
  background: transparent;
}

/* 添加新的样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.keyword-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.selected-keyword-item {
  width: 100%;
}

:deep(.ant-btn-link.ant-btn-dangerous) {
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

/* 添加新的样式 */
.selected-keywords-tabs {
  :deep(.ant-tabs-nav) {
    margin-bottom: 8px;
    padding: 0 16px;
  }
  
  :deep(.ant-tabs-tab) {
    padding: 8px 0;
    font-size: 13px;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

/* Add new styles */
.task-progress-section {
  margin-bottom: 16px;
}

.task-alert {
  border-radius: 4px;
}

.task-progress-content {
  width: 100%;
}

.task-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 24px; /* Add minimum height for consistent alignment */
}

.task-status {
  font-weight: 500;
}

.task-timing {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.task-description {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 4px;
}

:deep(.ant-alert-message) {
  flex: 1;
}

/* Add these new styles */
:deep(.ant-alert) {
  display: flex;
  align-items: center;
}

:deep(.ant-alert-message) {
  margin: 0; /* Remove default margin */
  display: flex;
  align-items: center;
}

:deep(.ant-alert-icon) {
  display: flex;
  align-items: center;
  margin-top: 0; /* Remove default margin */
}

/* Add new styles */
:deep(.ant-tabs-extra-content) {
  margin-left: 16px;
}

:deep(.ant-btn-text.ant-btn-dangerous) {
  &:hover {
    background-color: #fff1f0;
  }
  
  &:disabled {
    color: rgba(0, 0, 0, 0.25);
    background: transparent;
    
    &:hover {
      background: transparent;
    }
  }
}

.selected-keywords-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.keyword-count {
  margin-left: auto;
  font-size: 12px;
}

.generate-button-wrapper {
  margin-bottom: 12px;
  text-align: center;
}

.selected-keywords-tabs {
  flex: 1;
  overflow: auto;
}

.list-header {
  padding: 4px 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.compact-list-item {
  padding: 8px !important;
}

.selected-keyword-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.keyword-main {
  flex: 1;
  min-width: 0; /* Enable text truncation */
}

.keyword-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.keyword-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.keyword-text {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  padding: 0;
  height: auto;
  min-width: 24px;
}

.keyword-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.metric-tag {
  margin: 0;
  font-size: 11px;
  line-height: 16px;
  padding: 0 4px;
}

.keyword-reason {
  flex-shrink: 0;
}

.reason-icon {
  color: #1890ff;
  font-size: 14px;
  cursor: help;
}

:deep(.ant-list-item) {
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.ant-tabs-small > .ant-tabs-nav .ant-tabs-tab) {
  padding: 4px 8px;
}

:deep(.ant-list-split .ant-list-item:last-child) {
  border-bottom: none !important;
}
</style>



