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
                        
                        <!-- 将按钮移到这里并改为 primary 类型 -->
                        <a-button 
                          type="primary"
                          @click="showSelectedKeywords"
                        >
                          View Selected
                        </a-button>
                        
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
                    </div>
                  </a-card>

                  <!-- Keyword Selection Component -->
                  <div v-if="currentMode === 'beginner'" class="beginner-mode">
                    <a-row :gutter="[24, 24]" class="beginner-content">
                      <!-- Keywords From Comparison Table -->
                      <a-col :span="12">
                        <a-card title="Keywords From Comparison" class="keyword-table-card">
                          <a-tabs 
                            v-model:activeKey="currentPriority"
                            @change="handleTabChange"
                            class="priority-tabs"
                            tabPosition="left"
                          >
                            <a-tab-pane v-for="priority in priorities" :key="priority.level">
                              <template #tab>
                                <div class="priority-tab">
                                  <div class="priority-indicator" :style="{ backgroundColor: priority.color }"></div>
                                  <span>{{ priority.label }}</span>
                                </div>
                              </template>
                              
                              <a-table
                                :dataSource="getKeywordsByPriority(recommendedKeywords, priority.level)"
                                :columns="comparisonColumns"
                                :pagination="recommendedPagination"
                                @change="(page) => handleComparisonPaginationChange(priority.level, page.current, page.pageSize)"
                                size="small"
                              >
                                <template #actions="{ record }">
                                  <a-button 
                                    type="text"
                                    @click="handleKeywordFavorite(record)"
                                  >
                                    <template #icon>
                                      <HeartFilled v-if="record.favorited" style="color: #ff4d4f;" />
                                      <HeartOutlined v-else />
                                    </template>
                                  </a-button>
                                </template>
                              </a-table>
                            </a-tab-pane>
                          </a-tabs>
                        </a-card>
                      </a-col>

                      <!-- Keywords From Top Pages Table -->
                      <a-col :span="12">
                        <a-card title="Keywords From Top Pages" class="keyword-table-card">
                          <a-tabs 
                            v-model:activeKey="currentPagePriority"
                            @change="handlePageTabChange"
                            class="priority-tabs"
                            tabPosition="left"
                          >
                            <a-tab-pane v-for="priority in priorities" :key="priority.level">
                              <template #tab>
                                <div class="priority-tab">
                                  <div class="priority-indicator" :style="{ backgroundColor: priority.color }"></div>
                                  <span>{{ priority.label }}</span>
                                </div>
                              </template>
                              
                              <a-table
                                :dataSource="getKeywordsByPriority(pageKeywords, priority.level)"
                                :columns="comparisonColumns"
                                :pagination="pagePagination"
                                @change="(page) => handleTopPagesPaginationChange(priority.level, page.current, page.pageSize)"
                                size="small"
                              >
                                <template #actions="{ record }">
                                  <a-button 
                                    type="text"
                                    @click="handleKeywordFavorite(record)"
                                  >
                                    <template #icon>
                                      <HeartFilled v-if="record.favorited" style="color: #ff4d4f;" />
                                      <HeartOutlined v-else />
                                    </template>
                                  </a-button>
                                </template>
                              </a-table>
                            </a-tab-pane>
                          </a-tabs>
                        </a-card>
                      </a-col>
                    </a-row>
                  </div>

                  <!-- Content in expert mode -->
                  <template v-else>
                    <!-- Advanced Filters -->
                    <a-card class="filter-card" :bordered="false">
                      <div class="advanced-filters">
                        <!-- Align all controls to the left -->
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

                    <!-- Detailed Difference & Top Pages Table -->
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
                              <!-- Corresponding Pages Section -->
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

                              <!-- Competitor Ranking Comparison Section -->
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
              
              <!-- 修改第二步内容的布局结构 -->
              <div class="step-two-content">
                <div class="workspace-layout">
                  <!-- 关键词列表卡片 -->
                  <a-card 
                    class="selected-keywords-card"
                    :bordered="false"
                  >
                    <template v-if="isLoadingSelectedKeywords">
                      <div class="loading-container">
                        <a-spin />
                      </div>
                    </template>
                    <template v-else>
                      <a-row :gutter="16">
                        <a-col :span="12">
                          <div class="table-section">
                            <div class="table-title">Selected from Comparison ({{ selectedKeywordsData.comparison.length }})</div>
                            <a-table
                              :data-source="selectedKeywordsData.comparison"
                              :columns="comparisonColumns"
                              :pagination="{ pageSize: 5, size: 'small' }"
                              size="small"
                              class="compact-table"
                            >
                              <template #actions="{ record }">
                                <a-button 
                                  type="text"
                                  @click="handleRemoveKeyword(record)"
                                >
                                  <template #icon>
                                    <DeleteOutlined style="color: #ff4d4f;" />
                                  </template>
                                </a-button>
                              </template>
                            </a-table>
                          </div>
                        </a-col>
                        
                        <a-col :span="12">
                          <div class="table-section">
                            <div class="table-title">Selected from Top Pages ({{ selectedKeywordsData.top_pages.length }})</div>
                            <a-table
                              :data-source="selectedKeywordsData.top_pages"
                              :columns="comparisonColumns"
                              :pagination="{ pageSize: 5, size: 'small' }"
                              size="small"
                              class="compact-table"
                            >
                              <template #actions="{ record }">
                                <a-button 
                                  type="text"
                                  @click="handleRemoveKeyword(record)"
                                >
                                  <template #icon>
                                    <DeleteOutlined style="color: #ff4d4f;" />
                                  </template>
                                </a-button>
                              </template>
                            </a-table>
                          </div>
                        </a-col>
                      </a-row>
                    </template>
                  </a-card>
                  
                  <!-- Outline 内容部分 -->
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
                                <!-- 将按钮和状态文本分开，改为垂直布局 -->
                                <div class="generate-section">
                                  <a-button 
                                    type="primary"
                                    size="large"
                                    :loading="isGenerating"
                                    :disabled="totalSelectedKeywords === 0"
                                    @click="generateContentPlan"
                                    class="generate-btn"
                                  >
                                    <ThunderboltOutlined /> Generate Content Plan
                                  </a-button>
                                  
                                  <div class="task-status">
                                    ✨ Everything is ready! You can start exploring your content plans below.
                                  </div>
                                </div>
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
                        <a-space>
                          <!-- Add publish button -->
                          <a-button 
                            type="primary"
                            :disabled="!contentPlans.length"
                            @click="handlePublishOutlines"
                          >
                            <template #icon>
                              <CloudUploadOutlined />
                            </template>
                            Start Page generation
                          </a-button>
                          <!-- Existing buttons -->
                          <a-button 
                            type="text"
                            :disabled="!contentPlans.length"
                            @click="refreshContentPlans"
                            :loading="isRefreshing"
                          >
                            Refresh
                          </a-button>
                          <a-button 
                            type="text" 
                            danger
                            :disabled="!contentPlans.length"
                            @click="confirmClearAllOutlines"
                          >
                            Clear All
                          </a-button>
                        </a-space>
                      </template>
                      <!-- All Outlines Tab -->
                      <a-tab-pane key="all" tab="All Outlines">
                        <div class="tab-content-wrapper">
                          <div class="outlines-header">
                            <a-checkbox 
                              :checked="allOutlinesSelected"
                              :indeterminate="someOutlinesSelected"
                              @change="handleSelectAllOutlines"
                            >
                              Select All Outlines
                            </a-checkbox>
                            <span class="selected-count" v-if="selectedOutlinesCount > 0">
                              ({{ selectedOutlinesCount }} selected)
                            </span>
                          </div>
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
                              >
                                <div class="card-header">
                                  <div class="card-header-left">
                                    <a-checkbox
                                      :checked="plan.selected"
                                      @change="(e) => handleOutlineSelect(plan, e.target.checked)"
                                    />
                                    <!-- 添加类型标签 -->
                                    <a-tag :color="getTypeColor(plan.pageType)">
                                      {{ plan.pageType }}
                                    </a-tag>
                                  </div>
                                  <div class="card-actions">
                                    <HeartOutlined
                                      v-if="!plan.favorited"
                                      @click="handleFavorite(plan, $event)"
                                    />
                                    <HeartFilled
                                      v-else
                                      style="color: #ff4d4f"
                                      @click="handleFavorite(plan, $event)"
                                    />
                                    <DeleteOutlined
                                      @click="handleDeleteOutline(plan)"
                                      style="color: #ff4d4f; margin-left: 8px"
                                    />
                                  </div>
                                </div>
                                
                                <div class="card-content" @click="showPlanDetails(plan)">
                                  <h3 class="plan-title">{{ plan.title }}</h3>
                                  <p class="plan-description">{{ plan.description }}</p>
                                  
                                  <div class="plan-metrics">
                                    <div class="metric-item">
                                      <span class="metric-label">
                                        <FileTextOutlined /> Word Count
                                      </span>
                                      <span class="metric-value">{{ getTotalWordCount(plan).toLocaleString() }}</span>
                                    </div>
                                    <div class="metric-item">
                                      <span class="metric-label">
                                        <OrderedListOutlined /> Sections
                                      </span>
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
                                    <span class="metric-label">
                                      <FileTextOutlined /> Word Count
                                    </span>
                                    <span class="metric-value">{{ getTotalWordCount(plan).toLocaleString() }}</span>
                                  </div>
                                  <div class="metric-item">
                                    <span class="metric-label">
                                      <OrderedListOutlined /> Sections
                                    </span>
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
                    class="content-plan-drawer"
                  >
                    <template v-if="selectedPlan">
                      <!-- Intent Section -->
                      <section class="drawer-section">
                        <h4 class="section-title">
                          <CompassOutlined /> Intent & Value
                        </h4>
                        <div class="section-content">
                          <div class="content-item">
                            <div class="item-label">User Intent</div>
                            <div class="item-value intent-value">{{ selectedPlan.userIntent }}</div>
                          </div>
                          <div class="content-item">
                            <div class="item-label">Problem Solved</div>
                            <div class="item-value problem-value">{{ selectedPlan.problemSolved }}</div>
                          </div>
                          <div class="content-tags">
                            <div class="tags-label">Related Keywords:</div>
                            <div class="tags-wrapper">
                              <a-tag 
                                v-for="keyword in selectedPlan.relatedKeywords.split(', ')" 
                                :key="keyword"
                                color="blue"
                              >
                                {{ keyword }}
                              </a-tag>
                            </div>
                          </div>
                        </div>
                      </section>

                      <!-- TDK Section -->
                      <section class="drawer-section">
                        <h4 class="section-title">
                          <FileTextOutlined /> Page Metadata
                        </h4>
                        <div class="section-content">
                          <div class="content-item">
                            <div class="item-label">Title</div>
                            <div class="item-value title-value">{{ selectedPlan.title }}</div>
                          </div>
                          <div class="content-item">
                            <div class="item-label">Description</div>
                            <div class="item-value description-value">{{ selectedPlan.description }}</div>
                          </div>
                          <div class="content-item">
                            <div class="item-label">Target Keywords</div>
                            <div class="tags-wrapper keywords-tags">
                              <a-tag 
                                v-for="keyword in selectedPlan.keywords.split(', ')" 
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
                          <div 
                            v-for="section in selectedPlan.outline" 
                            :key="section.sequence" 
                            class="outline-item"
                          >
                            <div class="outline-header">
                              <div class="sequence-badge">{{ section.sequence }}</div>
                              <div class="outline-info">
                                <div class="outline-title">{{ section.sectionTitle }}</div>
                                <div class="outline-meta">
                                  <span class="word-count">
                                    <FileTextOutlined /> {{ section.wordCount.toLocaleString() }} words
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="outline-keywords" v-if="section.keywordsUsageRequirements">
                              <div class="keywords-label">Keywords to Include:</div>
                              <div class="keywords-list">
                                <a-tag 
                                  v-for="(count, keyword) in section.keywordsUsageRequirements" 
                                  :key="keyword"
                                  color="blue"
                                >
                                  {{ keyword }} ({{ count }}×)
                                </a-tag>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </template>
                  </a-drawer>
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

          <!-- 修改 modal 内容部分 -->
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
                  :tab="`${tab.label} (${modalKeywords[tab.key].length})`"
                >
                  <a-table
                    :data-source="modalKeywords[tab.key]"
                    :columns="comparisonColumns"
                    :pagination="{ pageSize: 10 }"
                    size="small"
                  >
                    <template #actions="{ record }">
                      <a-button 
                        type="text"
                        @click="handleCancelSelection(record)"
                      >
                        <template #icon>
                          <HeartFilled style="color: #ff4d4f;" />
                        </template>
                      </a-button>
                    </template>
                  </a-table>
                </a-tab-pane>
              </a-tabs>
            </template>
            
            <template #footer>
              <div class="modal-footer">
                <a-space>
                  <a-button 
                    type="primary"
                    @click="proceedToContentPlan"
                  >
                    Proceed to Content Plan
                  </a-button>
                  <a-button @click="handleModalClose">Close</a-button>
                </a-space>
              </div>
            </template>
          </a-modal>
        </template>
      </template>

      <template v-else>
        <no-site-configured/>
      </template>
    </a-spin>

    <!-- 添加进度弹窗 -->
    <a-modal
      v-model:open="generationProgressVisible"
      title="Generating Pages"
      :closable="false"
      :maskClosable="false"
      :footer="null"
      width="400px"
    >
      <div class="generation-progress">
        <div class="progress-status">
          <LoadingOutlined v-if="isGeneratingPages" spin />
          <CheckCircleOutlined v-else-if="generationCompleted" style="color: #52c41a" />
          <CloseCircleOutlined v-else-if="generationFailed" style="color: #ff4d4f" />
          <span class="status-text">{{ generationStatusText }}</span>
        </div>
        <a-progress 
          :percent="generationProgress" 
          :status="generationStatus"
        />
        <div class="progress-details">
          {{ generationDetails }}
        </div>
      </div>
    </a-modal>
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
  InfoCircleOutlined,
  ReloadOutlined, // Add this import
  CloudUploadOutlined,
  CloseCircleOutlined,
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
    InfoCircleOutlined,
    ReloadOutlined,
    CloudUploadOutlined,
    CloseCircleOutlined,
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

    const overviewStats = ref({
      totalKeywords: 2500,
      ourTopPages: 30,
      competitorPages: 50
    })

    const priorities = [
      {
        level: '1',
        label: 'P1 - Quick Wins',
        color: '#f50'
      },
      {
        level: '2',
        label: 'P2 - High Priority',
        color: '#fa8c16' 
      },
      {
        level: '3',
        label: 'P3 - Medium Priority',
        color: '#1890ff'
      },
      {
        level: '4',
        label: 'P4 - Low Priority',
        color: '#52c41a'
      },
      {
        level: '5',
        label: 'P5 - Monitor',
        color: '#722ed1'
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

    const transformKeywordData = (item) => {
      return {
        id: item.keywordId,
        keyword: item.keyword,
        selected: false,
        favorited: item.status === 'selected',
        krs: Number(item.krsScore).toFixed(2),
        kd: item.kd,
        volume: item.volume,
        cpc: Number(item.cpc).toFixed(2),
        status: getKeywordStatus(item),
        grade: item.grade,
        reason: item.reasoning || 'No specific reason provided',
        pages: [],
        competitors: [],
        favorited: item.status === 'selected',
      }
    }

    const fetchKeywords = async (source, level, page = 1, limit = 10) => {
      try {
        console.log('Fetching keywords with params:', { source, level, page, limit })
        const response = await api.getPlanningKeywords({
          source,
          level,
          page,
          limit,
          status: ''
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
        console.error('Failed to get keywords:', error)
      } finally {
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

    onMounted(async () => {
      loading.value = true
      try {
        await checkDomainStatus()

        if (domainConfigured.value) {
          await checkAnalysisStatus()
          
          if (analysisState.value !== 'finished') {
            pollingInterval.value = setInterval(checkAnalysisStatus, 5000)
          }

          initializeSelectedKeywords()
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        message.error('Failed to initialize the page')
      }
    })

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    })

    watch(
      [
        () => recommendedKeywords.value,
        () => pageKeywords.value,
        () => selectedKeywords.value
      ],
      ([newRecommendedKeywords, newPageKeywords, newSelectedKeywords], [oldRecommendedKeywords, oldPageKeywords, oldSelectedKeywords]) => {
        if (newRecommendedKeywords !== oldRecommendedKeywords) {
          console.log('recommendedKeywords changed:', newRecommendedKeywords)
          const selectedOnes = newRecommendedKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newRecommendedKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }

        if (newPageKeywords !== oldPageKeywords) {
          const selectedOnes = newPageKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newPageKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }
      },
      {
        deep: true
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
      
      const priorityToGrade = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5'
      }
      
      const grade = priorityToGrade[priority]
      return keywords.filter(k => k.grade === grade)
    }

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
        id: Date.now()
      });
    };

    const removeFilter = (index) => {
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
        message.warning('Please select at least one keyword')
        return
      }
      
      if (currentStep.value < '1') {
        currentStep.value = '1'
      }
    }

    const previousStep = () => {
      if (currentStep.value > '0') {
        currentStep.value = '0'
      }
    }

    const showSelectedModal = ref(false)

    const modalTabs = ref([
      { key: 'comparison', label: 'From Comparison' },
      { key: 'top_pages', label: 'From Top Pages' }
    ])
    const currentModalTab = ref('comparison')
    const modalKeywords = ref({
      comparison: [],
      top_pages: []
    })

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
        console.error('Failed to get selected keywords:', error)
        message.error('Failed to get selected keywords')
      } finally {
        isLoadingModalKeywords.value = false
      }
    }

    const handleModalClose = () => {
      showSelectedModal.value = false
    }

    const isGenerating = ref(false)

    const hasGenerated = ref(false)

    const filteredKeywords = ref(tableData)

    const getRankClass = (rank) => {
      if (rank <= 3) return 'top-3'
      if (rank <= 10) return 'top-10'
      return 'others'
    }

    const initializeSelectedKeywords = () => {
      const preSelectedKeywords = recommendedKeywords.value.filter(k => k.selected)
      selectedKeywords.value = preSelectedKeywords.map(k => ({
        ...k,
        selected: true
      }))
    }

    initializeSelectedKeywords()

    const analysisStatus = ref(null)
    const pollingInterval = ref(null)
    const taskInfo = ref(null)

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
            const overview = await api.getKeywordAnalysisOverview()
            if (overview?.data) {
              overviewData.value = {
                totalKeywordsAnalyzed: overview.data.totalKeywordsAnalyzed,
                totalTopPagesAnalyzed: overview.data.totalTopPagesAnalyzed,
                absence: overview.data.keywordsGroup.absence,
                weak: overview.data.keywordsGroup.weak || 0
              }
            }
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
        if (taskInfo.value?.analysisStatus !== 'finished') {
          loading.value = false
        }
      }
    }

    const analysisState = computed(() => {
      if (loading.value) return 'loading'
      return taskInfo.value?.analysisStatus || 'not_started'
    })

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

    const getKeywordStatus = (item) => {
      const gradeMap = {
        '1': { text: 'Quick Win Choose', color: 'red' },
        '2': { text: 'High Priority', color: 'orange' },
        '3': { text: 'Medium Priority', color: 'blue' },
        '4': { text: 'Low Priority', color: 'cyan' },
        '5': { text: 'Monitor', color: 'purple' }
      }
      
      return gradeMap[item.grade] || { text: 'Unknown', color: 'default' }
    }

    const currentPriority = ref('1')
    const currentPagePriority = ref('1')  // 添加这个变量

    const handleTabChange = (activeKey) => {
      console.log('Tab changed to:', activeKey)
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        recommendedPagination.value.current = 1
        fetchKeywords('keywords', priority.level, 1, recommendedPagination.value.pageSize)
      }
    }

    const handlePageTabChange = (activeKey) => {
      console.log('Page tab changed to:', activeKey)
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        pagePagination.value.current = 1
        fetchKeywords('top_page_keywords', priority.level, 1, pagePagination.value.pageSize)
      }
    }

    const contentPlans = ref([])

    const selectedPlansCount = computed(() => {
      return contentPlans.value.filter(plan => plan.selected).length
    })

    const generateContentPlan = async () => {
      if (totalSelectedKeywords.value === 0) {
        message.warning('Please select at least one keyword');
        return;
      }

      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Generate Content Plan',
          content: `Are you sure you want to generate a content plan using the currently selected ${totalSelectedKeywords.value} keywords?`,
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      isGenerating.value = true;
      try {
        const selectedIds = [
          ...selectedKeywordsData.value.comparison.map(k => k.id),
          ...selectedKeywordsData.value.top_pages.map(k => k.id)
        ];

        console.log('Submitting generation request...');
        await api.generatePlanningComposite(selectedIds);
        
        message.success('Content plan generation request submitted');
        console.log('Generation request successful, waiting before status check...');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Checking initial status...');
        const statusResponse = await checkOutlineGenerationStatus();
        console.log('Status response:', statusResponse);
        
        if (!statusResponse?.data || statusResponse.data.status !== 'finished') {
          console.log('Starting polling...');
          startPolling();
        }
      } catch (error) {
        console.error('Failed to generate content plan:', error);
        message.error('Failed to generate content plan, please try again');
      } finally {
        isGenerating.value = false;
      }
    };

    const startPolling = () => {
      // 先清除已存在的轮询
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
      
      pollingInterval.value = setInterval(async () => {
        const response = await checkOutlineGenerationStatus()
        
        // 如果状态是完成或失败，停止轮询
        if (response?.data?.status === 'finished' || response?.data?.status === 'failed') {
          clearInterval(pollingInterval.value)
          pollingInterval.value = null // 重置轮询变量
          
          if (response?.data?.status === 'finished') {
            await fetchContentPlans()
            hasGenerated.value = true
          } else {
            message.error('Content plan generation failed')
          }
        }
      }, 5000) // 增加轮询间隔到 5 秒
    }

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
      }
    });

    const handlePlanSelect = (plan, checked) => {
      plan.selected = checked
    }

    const confirmSelectedPlans = async () => {
      const selectedPlans = contentPlans.value.filter(plan => plan.selected)
      if (selectedPlans.length) {
        console.log('Selected plans:', selectedPlans)
        message.success('Content plans confirmed')
      }
    }

    const drawerVisible = ref(false)
    const selectedPlan = ref(null)

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

    watch(currentStep, async (newStep) => {
      if (newStep === '0') {
        await Promise.all([
          fetchKeywords('keywords', currentPriority.value, 1, recommendedPagination.value.pageSize),
          fetchKeywords('top_page_keywords', currentPriority.value, 1, pagePagination.value.pageSize)
        ])
      } else if (newStep === '1') {
        contentPlans.value = []
        hasGenerated.value = false
        isGenerating.value = false
        
        // 检查生成状态并启动轮询
        await checkAndStartPolling()
      }
    })

    // 修改 checkAndStartPolling 方法
    const checkAndStartPolling = async () => {
      // 如果已经在轮询中，不重复启动
      if (pollingInterval.value) return
      
      try {
        const statusResponse = await checkOutlineGenerationStatus()
        
        if (!statusResponse?.data || statusResponse.data.status === 'processing') {
          startPolling()
        } else if (statusResponse.data.status === 'finished') {
          await fetchContentPlans()
        }
      } catch (error) {
        console.error('Failed to check outline status:', error)
        message.error('Failed to check outline status')
      }
    }

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
          } else if (response.data.status === 'failed') {
            clearInterval(pollingInterval.value)
            message.error('Content plan generation failed')
          }
        }
        return response
      } catch (error) {
        console.error('Failed to check outline generation status:', error)
        message.error('Failed to get outline generation status')
        return null
      }
    }

    const fetchContentPlans = async () => {
      // 如果正在加载，不重复请求
      if (isLoadingOutlines.value) return
      
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
        }
      } catch (error) {
        console.error('Failed to fetch content plans:', error)
        message.error('Failed to get content plans')
      } finally {
        isLoadingOutlines.value = false
      }
    }

    const handleContentPlansPaginationChange = async (page, pageSize) => {
      contentPlansPagination.value.current = page
      contentPlansPagination.value.pageSize = pageSize
      await fetchContentPlans()
    }

    const outlineGenerationStatus = ref(null)

    const contentPlansPagination = ref({
      current: 1,
      pageSize: 12,
      total: 0
    })

    // Add new methods
    const handleFavorite = async (plan, event) => {
      try {
        if (plan.favorited) {
          // Cancel favorite
          await api.cancelPlanningOutlines([plan.outlineId]);
          plan.favorited = false;
          message.success('Removed from selection');
        } else {
          // Add to favorites
          await api.selectPlanningOutlines([plan.outlineId]);
          plan.favorited = true;
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    // Add contentPlanTab definition
    const contentPlanTab = ref('all')

    // Add tab switch handling method
    const handleContentPlanTabChange = async (activeKey) => {
      contentPlanTab.value = activeKey
      // 重置分页
      contentPlansPagination.value.current = 1
      // 获取数据并检查状态
      await fetchContentPlans()
    }

    // Add loading state
    const isLoadingOutlines = ref(false)

    // Add favorite/unfavorite keyword method
    const handleKeywordFavorite = async (keyword) => {
      try {
        if (keyword.favorited) {
          // Unfavorite
          await api.cancelPlanningKeywords([keyword.id]);
          keyword.favorited = false;
          message.success('Removed from selection');
        } else {
          // Favorite
          await api.selectPlanningKeywords([keyword.id]);
          keyword.favorited = true;
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    // Add tab switch handling method
    const handleModalTabChange = (activeKey) => {
      currentModalTab.value = activeKey
    }

    // Add showSelectedKeywords method
    const showSelectedKeywords = async () => {
      showSelectedModal.value = true
      await fetchSelectedKeywords()
    }

    // Add loading state variable
    const isLoadingModalKeywords = ref(false)

    // Add cancel selection method
    const handleCancelSelection = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        // Remove keyword from list
        const sourceType = currentModalTab.value
        modalKeywords.value[sourceType] = modalKeywords.value[sourceType].filter(k => k.id !== keyword.id)
        message.success('Keyword deselected')
      } catch (error) {
        console.error('Failed to deselect keyword:', error)
        message.error('Failed to deselect keyword')
      }
    }

    // Add new reactive variables
    const selectedKeywordsTab = ref('comparison')
    const selectedKeywordsData = ref({
      comparison: [],
      top_pages: []
    })
    const isLoadingSelectedKeywords = ref(false)

    // Modify watch to sync data
    watch(currentStep, async (newStep) => {
      if (newStep === '1') {
        // When switching to outline tab, load selected keywords
        await fetchSelectedKeywordsData()
      }
    })

    // Add get selected keywords method
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
        console.error('Failed to get selected keywords:', error)
        message.error('Failed to get selected keywords')
      } finally {
        isLoadingSelectedKeywords.value = false
      }
    }

    // New remove keyword method
    const handleRemoveKeyword = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        // Remove keyword from both lists
        const sourceType = selectedKeywordsTab.value
        selectedKeywordsData.value[sourceType] = selectedKeywordsData.value[sourceType].filter(k => k.id !== keyword.id)
        // Also update selectedKeywords
        selectedKeywords.value = selectedKeywords.value.filter(k => k.id !== keyword.id)
        message.success('Keyword removed')
      } catch (error) {
        console.error('Failed to remove keyword:', error)
        message.error('Failed to remove keyword')
      }
    }

    // Add computed property to get total number of selected keywords
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

    // Add new ref for refresh loading state
    const isRefreshing = ref(false)

    // Modify refresh method
    const refreshContentPlans = async () => {
      isRefreshing.value = true
      try {
        // First check the generation status
        const statusResponse = await checkOutlineGenerationStatus()
        
        // If still processing, start polling
        if (statusResponse?.data?.status === 'processing') {
          startPolling()
        } else {
          // If not processing, just fetch the content plans
          await fetchContentPlans()
        }
        
        message.success('Content plans refreshed')
      } catch (error) {
        console.error('Failed to refresh content plans:', error)
        message.error('Failed to refresh content plans')
      } finally {
        isRefreshing.value = false
      }
    }

    // Add jump method
    const proceedToContentPlan = () => {
      handleModalClose(); // Close the modal first
      currentStep.value = '1'; // Switch to outline tab
    };

    const handlePublishOutlines = async () => {
      const selectedOutlines = contentPlans.value.filter(plan => plan.selected)
      if (!selectedOutlines.length) {
        message.warning('Please select at least one outline')
        return
      }

      // Add confirmation dialog
      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Start Page Generation',
          content: h('div', {}, [
            h('p', 'You are about to generate pages for the following outlines:'),
            h('ul', { style: 'margin-top: 8px; padding-left: 20px;' }, 
              selectedOutlines.map(outline => 
                h('li', { style: 'margin-bottom: 4px;' }, [
                  outline.title,
                  h('span', { style: 'color: #8c8c8c; margin-left: 8px;' }, 
                    `(${outline.pageType})`
                  )
                ])
              )
            ),
            h('p', { style: 'margin-top: 12px; color: #ff4d4f;' }, 
              'This action cannot be undone. Are you sure you want to continue?'
            )
          ]),
          okText: 'Generate Pages',
          cancelText: 'Cancel',
          width: 520,
          okButtonProps: {
            type: 'primary',
            danger: false
          },
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      try {
        generationProgressVisible.value = true;
        isGeneratingPages.value = true;
        generationProgress.value = 0;
        generationStatus.value = 'active';
        generationCompleted.value = false;
        generationFailed.value = false;

        const total = selectedOutlines.length;
        let completed = 0;

        for (const outline of selectedOutlines) {
          try {
            generationStatusText.value = `Generating page (${completed + 1}/${total})`
            generationDetails.value = `Processing: "${outline.title}"`
            
            await api.createAIPage(outline.outlineId)
            
            completed++;
            generationProgress.value = Math.floor((completed / total) * 100)
          } catch (error) {
            console.error('Failed to generate page:', error)
            message.error(`Failed to generate page: ${outline.title}`)
          }
        }

        generationCompleted.value = true;
        isGeneratingPages.value = false;
        generationStatus.value = 'success';
        generationStatusText.value = 'All pages generated successfully!';
        generationDetails.value = `Successfully generated ${completed}/${total} pages`;

        setTimeout(() => {
          generationProgressVisible.value = false;
          generationProgress.value = 0;
          generationCompleted.value = false;
          generationFailed.value = false;
        }, 3000);

      } catch (error) {
        console.error('Page generation process failed:', error)
        generationFailed.value = true
        isGeneratingPages.value = false
        generationStatus.value = 'exception'
        generationStatusText.value = 'Generation process failed'
        generationDetails.value = error.message || 'Unknown error'
      }
    }

    // Add new reactive variables
    const generationProgressVisible = ref(false)
    const generationProgress = ref(0)
    const generationStatus = ref('active')
    const generationStatusText = ref('Preparing to generate pages...')
    const generationDetails = ref('')
    const isGeneratingPages = ref(false)
    const generationCompleted = ref(false)
    const generationFailed = ref(false)

    // Add new reactive variables
    const allOutlinesSelected = computed(() => {
      return contentPlans.value.length > 0 && 
             contentPlans.value.every(plan => plan.selected)
    })

    const someOutlinesSelected = computed(() => {
      return contentPlans.value.some(plan => plan.selected) && 
             !allOutlinesSelected.value
    })

    const selectedOutlinesCount = computed(() => {
      return contentPlans.value.filter(plan => plan.selected).length
    })

    // Add new methods
    const handleSelectAllOutlines = (e) => {
      const checked = e.target.checked
      contentPlans.value.forEach(plan => {
        plan.selected = checked
      })
    }

    const handleOutlineSelect = (plan, checked) => {
      plan.selected = checked
    }

    // 在 setup 函数内部定义 comparisonColumns
    const comparisonColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '30%'
      },
      {
        title: 'KRS',
        dataIndex: 'krs',
        key: 'krs',
        width: '20%'
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        width: '20%'
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        width: '20%'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '10%',
        slots: {
          customRender: 'actions'
        }
      }
    ]

    // 在 setup 函数中添加
    const getTypeColor = (type) => {
      const typeColors = {
        'Blog': 'blue',
        'Landing Page': 'green',
        // 可以添加更多类型的颜色映射
      }
      return typeColors[type] || 'default'
    }

    return {
      showSelectedKeywords,
      currentMode,
      selectedKeywords,
      overviewData,
      clearSelection,
      overviewStats: ref(overviewStats),
      priorities,
      recommendedKeywords,  // Ensure exposed in return
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
      pollingInterval, // If needed in template
      refreshContentPlans,
      isRefreshing,
      proceedToContentPlan,
      handlePublishOutlines,
      generationProgressVisible,
      generationProgress,
      generationStatus,
      generationStatusText,
      generationDetails,
      isGeneratingPages,
      generationCompleted,
      generationFailed,
      allOutlinesSelected,
      someOutlinesSelected,
      selectedOutlinesCount,
      handleSelectAllOutlines,
      handleOutlineSelect,
      currentPagePriority,
      handlePageTabChange,
      comparisonColumns,
      getTypeColor,
    }
  }
})
</script>

<style scoped>
/* Workspace layout */
.workspace-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  width: 100%;
  overflow: visible; /* Changed to visible */
}

/* Content plans area */
.content-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 16px;
}

.plan-card {
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  height: auto;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.plan-card :deep(.ant-card-body) {
  padding: 12px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.plan-description {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.section-header {
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 8px 8px 0 0;
}

.keywords-content {
  flex: 1;
  overflow-y: auto; /* 添加垂直滚动 */
  padding: 16px;
}

/* 美化滚动条 */
.keywords-content::-webkit-scrollbar {
  width: 6px;
}

.keywords-content::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 3px;
}

.keywords-content::-webkit-scrollbar-track {
  background-color: #f0f0f0;
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

/* Task progress area */
.task-progress-section {
  margin-bottom: 16px;
}

.task-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 24px;
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
/* Ant Design component styles override */
:deep(.ant-tabs-nav) {
  margin-bottom: 8px;
  padding: 0 16px;
}

:deep(.ant-tabs-tab) {
  padding: 8px 0;
  font-size: 13px;
}

:deep(.ant-alert) {
  display: flex;
  align-items: center;
  margin: 0;
}

:deep(.ant-alert-message) {
  margin: 0;
  display: flex;
  align-items: center;
}

:deep(.ant-alert-icon) {
  display: flex;
  align-items: center;
  margin-top: 0;
}

:deep(.ant-list-item) {
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.ant-list-item:last-child) {
  border-bottom: none !important;
}

/* Add styles for step two content container */
.step-two-content {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 250px); /* Adjust height calculation */
}

/* Adjust pagination container position */
.pagination-container {
  background: white;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto; /* Keep pagination at the bottom of the content */
}

/* Ensure plan area can display content fully */
.plan-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Allow content area to shrink */
}

/* Ensure tab content area can scroll properly */
.tab-content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Allow content area to shrink */
}

/* Adjust mode-controls style to fit new layout */
.mode-controls {
  display: flex;
  align-items: center;
  gap: 16px; /* Increase gap between components */
}
/* Ensure tags and icons are vertically aligned */
:deep(.ant-tag) {
  margin-right: 0;
  display: inline-flex;
  align-items: center;
}

/* Optimize keyword item layout */
.keyword-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

/* Ensure checkbox text doesn't wrap */
:deep(.ant-checkbox-wrapper) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Add footer styles */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Add prominent button styles */
.generate-btn {
  background: linear-gradient(to right, #1890ff, #40a9ff);
  border: none;
  font-weight: 500;
  height: 40px;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: linear-gradient(to right, #40a9ff, #69c0ff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.45);
}

.generate-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.35);
}

/* Ensure disabled state also has appropriate styles */
.generate-btn[disabled] {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.25);
}

/* Adjust task status text style */
.task-status {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

/* Add new layout container styles */
.generate-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

/* 调整状态文本样式 */
.task-status {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-left: 4px; /* 添加少许左边距 */
}

/* 添加新的样式 */
.generation-progress {
  padding: 20px 0;
}

.progress-status {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 16px;
  font-weight: 500;
}

.progress-details {
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

/* Add new styles */
.outlines-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.selected-count {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 调整类型标签样式 */
.card-header-left :deep(.ant-tag) {
  margin: 0;
  text-transform: capitalize;
  font-size: 12px;
  line-height: 20px;
  height: 22px;
  padding: 0 8px;
}

.card-actions {
  display: flex;
  align-items: center;
}

/* 优先级标签样式 */
.priority-tab {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 调整列表容器样式 */
.keywords-list {
  height: calc(100% - 40px); /* 减去标题和分页的高度 */
  overflow-y: auto;
}

.content-plan-drawer :deep(.ant-drawer-header) {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.content-plan-drawer :deep(.ant-drawer-title) {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.drawer-section {
  margin-bottom: 24px;
}

.drawer-section:last-child {
 
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.section-title :deep(.anticon) {
  color: #1890ff;
  font-size: 16px;
}

.section-content {
  padding: 0 4px;
}

.content-item {
  margin-bottom: 16px;
}

.content-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}

.item-value {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.85);
}

.intent-value,
.problem-value {
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.title-value {
  font-size: 15px;
  font-weight: 500;
}

.description-value {
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.content-tags,
.outline-keywords {
  margin-top: 16px;
}

.tags-label,
.keywords-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags-wrapper :deep(.ant-tag) {
  margin: 0;
  padding: 4px 8px;
  font-size: 12px;
}

.outline-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
}

.outline-item:last-child {
  margin-bottom: 0;
}

.outline-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.sequence-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.outline-info {
  flex: 1;
  min-width: 0;
}

.outline-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
  line-height: 1.5;
}

.outline-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.word-count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  gap: 4px;
}

.word-count :deep(.anticon) {
  font-size: 12px;
}

.outline-keywords {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e8e8e8;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-keywords-card :deep(.ant-card-body) {
  padding: 0;
}

.selected-keywords-card :deep(.ant-tabs-nav) {
  margin: 0;
  padding: 0 16px;
}

.selected-keywords-card :deep(.ant-table-pagination) {
  margin: 16px;
}

/* 调整表格内边距 */
.selected-keywords-card :deep(.ant-table-wrapper) {
  padding: 0 16px;
}

/* 调整表格行高 */
.selected-keywords-card :deep(.ant-table-small) .ant-table-thead > tr > th,
.selected-keywords-card :deep(.ant-table-small) .ant-table-tbody > tr > td {
  padding: 8px 16px;
}

.selected-keywords-card :deep(.ant-card-body) {
  padding: 0;
}

.selected-keywords-card :deep(.ant-tabs-nav) {
  margin: 0;
  padding: 8px 16px 0;
}

.selected-keywords-card :deep(.ant-table-pagination) {
  margin: 8px 16px;
}

/* 调整表格内边距 */
.selected-keywords-card :deep(.ant-table-wrapper) {
  padding: 0 16px;
}

/* 进一步缩小表格行高和内边距 */
.selected-keywords-card :deep(.compact-table) {
  /* 调整表头 */
  .ant-table-thead > tr > th {
    padding: 4px 8px;
    font-size: 13px;
  }
  
  /* 调整表格内容 */
  .ant-table-tbody > tr > td {
    padding: 2px 8px;
    font-size: 13px;
  }
  
  /* 调整行高 */
  .ant-table-tbody > tr {
    height: 32px;
  }
  
  /* 调整分页器样式 */
  .ant-pagination {
    font-size: 12px;
    
    .ant-pagination-item {
      min-width: 24px;
      height: 24px;
      line-height: 22px;
    }
    
    .ant-select-selector {
      height: 24px !important;
      
      .ant-select-selection-item {
        line-height: 22px;
      }
    }
  }
}

/* 优化按钮样式 */
.selected-keywords-card :deep(.ant-btn-text) {
  padding: 0 4px;
  height: 24px;
  line-height: 24px;
}

.selected-keywords-card :deep(.ant-card-body) {
  padding: 16px;
}

.table-section {
  background: #fafafa;
  border-radius: 4px;
  padding: 8px;
}

.table-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  padding: 0 8px;
  color: #1f1f1f;
}

/* 调整表格样式 */
.selected-keywords-card :deep(.compact-table) {
  /* 调整表头 */
  .ant-table-thead > tr > th {
    padding: 4px 8px;
    font-size: 13px;
    background: #f5f5f5;
  }
  
  /* 调整表格内容 */
  .ant-table-tbody > tr > td {
    padding: 2px 8px;
    font-size: 13px;
  }
  
  /* 调整行高 */
  .ant-table-tbody > tr {
    height: 32px;
  }
  
  /* 调整分页器样式 */
  .ant-pagination {
    font-size: 12px;
    margin: 8px 0 0 0;
    
    .ant-pagination-item {
      min-width: 24px;
      height: 24px;
      line-height: 22px;
    }
    
    .ant-select-selector {
      height: 24px !important;
      
      .ant-select-selection-item {
        line-height: 22px;
      }
    }
  }
}

/* 优化按钮样式 */
.selected-keywords-card :deep(.ant-btn-text) {
  padding: 0 4px;
  height: 24px;
  line-height: 24px;
}

/* 移除表格外边框 */
.selected-keywords-card :deep(.ant-table) {
  border-radius: 4px;
  overflow: hidden;
}

/* 移除 priority-tabs 的左右内边距 */
:deep(.priority-tabs .ant-tabs-nav) {
  padding: 0;
}

/* 如果需要调整 tab 内容的样式 */
:deep(.priority-tabs .ant-tabs-tab) {
  padding: 8px 12px;  /* 可以根据需要调整内部的内边距 */
}
</style>



