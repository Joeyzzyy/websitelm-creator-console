<template>
  <page-layout
    title="Keyword Planning"
    description="Plan and generate content strategically"
    icon="🎯"
  >
    
    <!-- Domain Not Configured Notice -->
    <template v-if="!domainConfigured">
      <no-site-configured />
    </template>

    <!-- Main Content (Only shown when domain is configured) -->
    <template v-else>
      <!-- Analysis States -->
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
        <a-card class="workflow-card">
          <div class="steps-container">
            <a-steps :current="currentStep" direction="horizontal" class="compact-steps">
              <a-step>
                <template #title>
                  <span class="step-title">1. Select Keywords</span>
                </template>
                <template #description>
                  <span class="step-desc">Choose keywords from different modes</span>
                </template>
              </a-step>
              <a-step>
                <template #title>
                  <span class="step-title">2. Generate Topic Title and Outline</span>
                </template>
                <template #description>
                  <span class="step-desc">Create and optimize content structure</span>
                </template>
              </a-step>
            </a-steps>
          </div>
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
                
                <!-- Mode Selector moved here -->
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
                            <div class="stat-value compact">{{ overviewData.totalKeywordsAnalyzed }} keywords</div>
                          </div>
                        </a-col>
                        <a-col :span="12">
                          <div class="stat-item">
                            <div class="stat-label">Compared your site with</div>
                            <div class="stat-value compact">{{ overviewData.totalTopPagesAnalyzed }} top pages from your competitors</div>
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
                          {{overviewData.absence}} keywords you're missing
                        </a-tag>
                        <!-- <a-tag color="orange">
                          {{overviewData.weak}} keywords need improvement
                        </a-tag> -->
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
              <a-space direction="vertical" style="width: 100%">
                <div class="selection-header">
                  <span class="selection-count">
                    {{ selectedKeywords.length }} keywords selected
                  </span>
                  <a-space>
                    <a-button type="link" @click="clearSelection">
                      Clear All
                    </a-button>
                    <a-button 
                      v-if="selectedKeywords.length"
                      @click="showSelectedKeywords"
                    >View Selected ({{ selectedKeywords.length }})
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
                                <a-space align="start" class="keyword-header">
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
                                </a-space>
                                
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
                                <a-space align="start" class="keyword-header">
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
                                </a-space>
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

          <!-- 步骤二的内容区域 -->
          <div v-show="currentStep > 0">
            <!-- 顶部操作栏 -->
            <div class="step-actions">
              <a-space>
                <a-button @click="previousStep">
                  <LeftOutlined /> Previous
                </a-button>
                <a-button 
                  v-if="hasGenerated"
                  type="primary"
                  :loading="isGenerating"
                  :disabled="!selectedKeywords.length"
                  @click="generateContent"
                >
                  <ThunderboltOutlined /> Regenerate Content Plan
                </a-button>
              </a-space>
            </div>

            <!-- 内容区域 -->
            <div class="workspace-layout">
              <!-- 左侧已选关键词列表 -->
              <a-card 
                class="selected-keywords-card"
                :bordered="false"
              >
                <template #title>
                  <div class="card-title">
                    <CheckCircleOutlined /> Selected Keywords
                    <a-tag>{{ selectedKeywords.length }} keywords</a-tag>
                  </div>
                </template>

                <a-list
                  :data-source="selectedKeywords"
                  size="small"
                  class="selected-keywords-list"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <div class="selected-keyword-item">
                        <div class="keyword-text">"{{ item.keyword }}"</div>
                        <div class="keyword-metrics">
                          <a-tag class="krs-tag">KRS={{ item.krs || 65 }}</a-tag>
                          <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                          <a-tag color="purple">Vol={{ item.volume }}</a-tag>
                        </div>
                      </div>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>

              <!-- 添加纵向导航 -->
              <div class="vertical-nav">
                <a-anchor :affix="false" :bounds="50" :items="anchorItems" />
              </div>

              <!-- 右侧生成内容区域 -->
              <div class="generation-flow">
                <!-- 添加引导按钮 -->
                <div v-if="!hasGenerated" class="empty-state">
                  <div class="empty-content">
                    <ThunderboltOutlined class="empty-icon" />
                    <div class="empty-title">Ready to create your content plan?</div>
                    <div class="empty-description">
                      Generate a strategic content plan based on your {{ selectedKeywords.length }} selected keywords
                    </div>
                    <a-button 
                      type="primary"
                      size="large"
                      :loading="isGenerating"
                      :disabled="!selectedKeywords.length"
                      @click="generateContent"
                    >
                      <ThunderboltOutlined /> Generate Content Plan
                    </a-button>
                  </div>
                </div>

                <!-- 现有的内容卡片 -->
                <template v-else>
                  <!-- 2. Topic 建议 -->
                  <a-card v-if="suggestedTopics.length" id="suggested-topics" class="result-card">
                    <template #title>
                      <div class="card-title">
                        <CompassOutlined /> Content Strategy & Topics
                      </div>
                    </template>
                    
                    <div class="content-topics-list">
                      <div v-for="topic in suggestedTopics" :key="topic.id" class="content-topic-card">
                        <a-checkbox 
                          v-model:checked="topic.selected"
                          @change="(checked) => handleTopicSelect(topic, checked)"
                        >
                          <div class="content-topic-header">
                            <div class="content-topic-title">{{ topic.main }}</div>
                            <div class="content-topic-tags">
                              <a-tag :color="topic.pageType.color">{{ topic.pageType.name }}</a-tag>
                              <a-tag :color="topic.intent.color">{{ topic.intent.name }}</a-tag>
                            </div>
                          </div>
                          
                          <div class="content-topic-body">
                            <div class="content-topic-section">
                              <div class="content-section-label">User Intent</div>
                              <div class="content-section-text">{{ topic.intent.description }}</div>
                            </div>
                            <div class="content-topic-section">
                              <div class="content-section-label">Problem Solved</div>
                              <div class="content-section-text">{{ topic.problemSolved }}</div>
                            </div>
                            <div class="content-topic-section">
                              <div class="content-section-label">Related Keywords</div>
                              <div class="content-keyword-tags">
                                <a-tag v-for="kw in topic.targetKeywords" :key="kw" color="blue">
                                  {{ kw }}
                                </a-tag>
                              </div>
                            </div>
                          </div>
                        </a-checkbox>
                      </div>
                    </div>
                    
                    <!-- 添加确认按钮 -->
                    <div class="action-footer">
                      <a-button 
                        type="primary"
                        :disabled="!selectedTopicsCount"
                        :loading="isGeneratingTitles"
                        @click="confirmTopics"
                      >
                        Generate Titles <RightOutlined v-if="!isGeneratingTitles" />
                      </a-button>
                    </div>
                  </a-card>

                  <!-- 3. Title 建议 -->
                  <a-card v-if="suggestedTitles.length" id="suggested-titles" class="result-card">
                    <template #title>
                      <div class="card-title">
                        <FileTextOutlined /> Suggested TDK
                      </div>
                    </template>
                    
                    <div class="tdk-list">
                      <div v-for="tdk in suggestedTitles" :key="tdk.id" class="tdk-item">
                        <a-checkbox 
                          v-model:checked="tdk.selected"
                          @change="(checked) => handleTitleSelect(tdk, checked)"
                        >
                          <div class="tdk-content">
                            <div class="tdk-main">
                              <div class="tdk-section">
                                <div class="tdk-label">Title</div>
                                <div class="tdk-text">{{ tdk.title }}</div>
                              </div>
                              <div class="tdk-section">
                                <div class="tdk-label">Description</div>
                                <div class="tdk-text">{{ tdk.description }}</div>
                              </div>
                              <div class="tdk-section">
                                <div class="tdk-label">Keywords</div>
                                <div class="tdk-keywords">
                                  <a-tag v-for="kw in tdk.keywords" :key="kw" color="blue">{{ kw }}</a-tag>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a-checkbox>
                      </div>
                    </div>

                    <!-- 添加操作按钮区域 -->
                    <div class="action-footer">
                      <a-button 
                        type="primary"
                        :disabled="!selectedTitlesCount"
                        :loading="isGeneratingOutline"
                        @click="confirmTitles"
                      >
                        Generate Outline <RightOutlined v-if="!isGeneratingOutline" />
                      </a-button>
                    </div>
                  </a-card>

                  <!-- 4. Outline -->
                  <a-card v-if="generatedOutline" id="content-outline" class="result-card">
                    <template #title>
                      <div class="card-title">
                        <OrderedListOutlined /> Content Outline
                      </div>
                    </template>
                    
                    <div class="outline-content">
                      <div v-for="(section, index) in generatedOutline" :key="index" class="outline-section">
                        <div class="section-header">
                          <div class="section-title">{{ section.title }}</div>
                          <div class="section-keywords">
                            <a-tag v-for="keyword in section.keywords" :key="keyword" color="blue">
                              {{ keyword }}
                            </a-tag>
                          </div>
                        </div>
                        <div class="section-points">
                          <div v-for="(point, pIndex) in section.points" :key="pIndex" class="point-item">
                            • {{ point }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-card>
                </template>
              </div>
            </div>
          </div>
        </div>

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
          <a-list
            :data-source="selectedKeywords"
            class="selected-keywords-list"
          >
            <template #header>
              <div class="list-header">
                <span>Total Selected: {{ selectedKeywords.length }} keywords</span>
              </div>
            </template>
            
            <template #renderItem="{ item }">
              <a-list-item>
                <div class="selected-keyword-item">
                  <div class="keyword-main">
                    <span class="keyword-text">"{{ item.keyword }}"</span>
                    <div class="keyword-metrics">
                      <a-tag class="krs-tag">KRS={{ item.krs || 65 }}</a-tag>
                      <a-tag color="cyan">KD={{ item.kd }}</a-tag>
                      <a-tag color="purple">Volume={{ item.volume }}</a-tag>
                      <a-tag :color="item.status.color">{{ item.status.text }}</a-tag>
                    </div>
                  </div>
                  <div class="keyword-reason">
                    <BulbOutlined />
                    <div class="reason-content">
                      <span class="reason-highlight">High potential: </span>
                      <span class="reason-value">{{ item.reason }}</span>
                    </div>
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
          
          <template #footer>
            <a-button @click="handleModalClose">Close</a-button>
          </template>
        </a-modal>
      </template>
    </template>
  </page-layout>
</template>

<script>
import { defineComponent, ref, computed, h, watch, nextTick, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import BeginnerMode from './BeginnerMode.vue'
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
  WarningOutlined
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

export default defineComponent({
  name: 'KeywordsPlanningPage',
  components: {
    PageLayout,
    BeginnerMode,
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
    NoSiteConfigured
  },
  setup() {
    const currentMode = ref('beginner')
    const selectedKeywords = ref([])
    const isGeneratingTitles = ref(false) 
    const isGeneratingOutline = ref(false) 
    
    const columns = computed(() => tableColumns)
    
    const overviewData = ref({
      totalKeywordsAnalyzed: 0,
      totalTopPagesAnalyzed: 0,
      absence: 0,  // 添加 absence 字段
      weak: 0      // 保留 weak 字段以备后用
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
      recommendedKeywords.value.forEach(k => k.selected = false)
      pageKeywords.value.forEach(k => k.selected = false)
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
          limit
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
      }
    }

    // 添加 Top Pages tab 切换处理
    const handlePageTabChange = (activeKey) => {
      console.log('Page Tab changed to:', activeKey)
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        pagePagination.value.current = 1
        fetchKeywords('top_page_keywords', priority.level, 1, pagePagination.value.pageSize)
      }
    }

    // 修改函数名称以区分两个不同来源的分页处理
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

    // 2. 确保组件挂载时获取初始数据
    onMounted(() => {
      console.log('组件挂载，开始获取数据')
      // 默认获取 level 1 (P0) 的数据
      fetchKeywords('keywords', '1', 1, recommendedPagination.value.pageSize)
      fetchKeywords('top_page_keywords', '1', 1, pagePagination.value.pageSize)
    })

    // 3. 添加监听器来观察数据变化
    watch(recommendedKeywords, (newVal) => {
      console.log('recommendedKeywords变化:', newVal)
    }, { deep: true })

    // 4. 修改分页处理方法，添加 priority 参数
    const handleRecommendedPaginationChange = (priority, page, pageSize) => {
      console.log('Pagination change:', { priority, page, pageSize }) // 添加日志
      recommendedPagination.value.current = page
      recommendedPagination.value.pageSize = pageSize
      fetchKeywords('keywords', priority, page, pageSize)
    }

    const handlePagePaginationChange = (page, pageSize) => {
      pagePagination.value.current = page
      pagePagination.value.pageSize = pageSize
      fetchKeywords('top_page_keywords', page, pageSize)
    }

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

    // 修改 handleKeywordSelect 方法
    const handleKeywordSelect = (keyword, isSelected) => {
      // 更新 selectedKeywords
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

    // 分别监听两个数据源
    watch(
      () => recommendedKeywords.value,
      (newKeywords) => {
        // 只同步选中的关键词到 selectedKeywords
        const selectedOnes = newKeywords.filter(k => k.selected)
        selectedKeywords.value = [
          ...selectedKeywords.value.filter(k => !newKeywords.find(nk => nk.keyword === k.keyword)),
          ...selectedOnes
        ]
      },
      { deep: true }
    )

    watch(
      () => pageKeywords.value,
      (newKeywords) => {
        // 只同步选中的关键词到 selectedKeywords
        const selectedOnes = newKeywords.filter(k => k.selected)
        selectedKeywords.value = [
          ...selectedKeywords.value.filter(k => !newKeywords.find(nk => nk.keyword === k.keyword)),
          ...selectedOnes
        ]
      },
      { deep: true }
    )

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

    const clearFilters = () => {
      // 完全清空所有筛选条件
      filters.value = [];

      // 清除已保存的预设选择
      currentPreset.value = null;
    };

    const saveFilterConfig = () => {
      // TODO: 实现保存配置逻辑
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

    // Modal control
    const showSelectedModal = ref(false)

    // Methods
    const showSelectedKeywords = () => {
      showSelectedModal.value = true
    }

    const handleModalClose = () => {
      showSelectedModal.value = false
    }

    const isGenerating = ref(false)
    const contentPlan = ref(null)
    const suggestedTopics = ref([])
    const suggestedTitles = ref([])
    const generatedOutline = ref(null)
    const selectedTopic = ref(null)
    const selectedTitle = ref(null)

    const scrollToElement = (elementId) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // 监听内容生成完成后，滚动到主题建议
    watch(contentPlan, (newValue) => {
      if (newValue) {
        setTimeout(() => {
          scrollToElement('suggested-topics')
        }, 100)
      }
    })

    // 修改数据结构
    const selectedTopics = ref([])
    const selectedTitles = ref([])

    // 处理 topic 选择
    const handleTopicSelect = (topic, checked) => {
      if (checked) {
        selectedTopics.value.push(topic.id)
      } else {
        selectedTopics.value = selectedTopics.value.filter(id => id !== topic.id)
      }
    }

    // 处理 title 选择
    const handleTitleSelect = (tdk, checked) => {
      if (checked) {
        selectedTitles.value.push(tdk.id)
      } else {
        selectedTitles.value = selectedTitles.value.filter(id => id !== tdk.id)
      }
    }

    // 添加确认处理方法
    const confirmTopics = async () => {
      if (selectedTopicsCount.value) {
        isGeneratingTitles.value = true
        try {
          await generateTitles() // 直接调用生成标题的方法
          await nextTick()
          scrollToElement('suggested-titles')
        } catch (error) {
          console.error('Error generating titles:', error)
          message.error('Failed to generate titles')
        } finally {
          isGeneratingTitles.value = false
        }
      }
    }

    const confirmTitles = async () => {
      if (selectedTitlesCount.value) {
        isGeneratingOutline.value = true
        try {
          // 生成新的大纲
          await new Promise(resolve => setTimeout(resolve, 1000))
          generatedOutline.value = [
            {
              title: '1. Introduction to Cloud Storage',
              keywords: ['cloud storage', 'digital storage'],
              points: [
                'What is cloud storage?',
                'Why businesses need cloud storage solutions',
                'Key benefits of cloud storage'
              ]
            },
            {
              title: '2. Types of Cloud Storage Solutions',
              keywords: ['storage solutions', 'enterprise storage'],
              points: [
                'Personal cloud storage',
                'Business cloud storage',
                'Enterprise cloud storage solutions'
              ]
            }
          ]
          
          await nextTick()
          scrollToElement('content-outline')
        } catch (error) {
          console.error('Error generating outline:', error)
          message.error('Failed to generate outline')
        } finally {
          isGeneratingOutline.value = false
        }
      }
    }

    // 修改生成内容的方法
    const generateContent = async () => {
      console.log('Before generation - layout height:', document.querySelector('.content-wrapper')?.offsetHeight)
      console.log('Before generation - section-card height:', document.querySelector('.section-card')?.offsetHeight)
      
      isGenerating.value = true
      try {
        await generateTopics()
        hasGenerated.value = true
        
        await nextTick()
        
        console.log('After generation - layout height:', document.querySelector('.content-wrapper')?.offsetHeight)
        console.log('After generation - section-card height:', document.querySelector('.section-card')?.offsetHeight)
        // 检查生成后的 DOM 变化
        console.log('Content Strategy container:', document.querySelector('.content-strategy-container'))
      } catch (error) {
        console.error('Generation error:', error)
      } finally {
        isGenerating.value = false
      }
    }

    const generateTopics = async () => {
      // 模拟 API 调用
      suggestedTopics.value = [
        {
          id: 1,
          main: 'Cloud Storage Solutions Comparison Guide',
          selected: false,
          pageType: {
            name: 'Informational',
            color: 'blue',
            description: 'Comprehensive guide page'
          },
          intent: {
            name: 'Research',
            color: 'purple',
            description: 'Users are comparing different cloud storage solutions to make an informed decision'
          },
          problemSolved: 'Helps users understand and compare different cloud storage options to choose the best solution for their needs',
          targetKeywords: [
            'cloud storage comparison',
            'best cloud storage solutions',
            'cloud storage providers'
          ]
        },
        {
          id: 2,
          main: 'Enterprise Cloud Storage Security Guide',
          selected: false,
          pageType: {
            name: 'Commercial',
            color: 'green',
            description: 'Product feature page'
          },
          intent: {
            name: 'Solution Awareness',
            color: 'orange',
            description: 'Users are seeking secure enterprise storage solutions'
          },
          problemSolved: 'Addresses enterprise concerns about cloud storage security and compliance requirements',
          targetKeywords: [
            'enterprise cloud storage',
            'secure cloud storage',
            'cloud storage security'
          ]
        }
      ]
    }

    const generateTitles = async () => {
      try {
        // 模拟 API 调用生成标题建议
        suggestedTitles.value = [
          {
            id: 1,
            title: 'Cloud Storage Solutions in 2024: The Ultimate Guide',
            description: 'Comprehensive guide to cloud storage solutions. Compare features, pricing, and security options to find the best cloud storage for your needs.',
            keywords: ['cloud storage', 'storage solutions', 'cloud comparison'],
            selected: false,
            metrics: {
              ctr: 4.5,
              seoScore: 92
            }
          },
          {
            id: 2,
            title: 'Best Cloud Storage Solutions: A Complete Guide for Businesses',
            description: 'Expert analysis of enterprise cloud storage solutions. Learn about security features, compliance requirements, and integration options.',
            keywords: ['business cloud storage', 'enterprise solutions', 'secure storage'],
            selected: false,
            metrics: {
              ctr: 4.2,
              seoScore: 89
            }
          }
        ]
      } catch (error) {
        console.error('Error generating titles:', error)
        message.error('Failed to generate TDK suggestions')
      }
    }

    // 添加计算属性来处理选中状态
    const selectedTopicsCount = computed(() => {
      return suggestedTopics.value.filter(topic => topic.selected).length
    })

    const selectedTitlesCount = computed(() => {
      return suggestedTitles.value.filter(title => title.selected).length
    })

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

    // 添加 anchorItems 数据
    const anchorItems = computed(() => [
      {
        key: 'suggested-topics',
        href: '#suggested-topics',
        title: 'Suggested Topics',
        class: !suggestedTopics.value.length ? 'nav-disabled' : ''
      },
      {
        key: 'suggested-titles',
        href: '#suggested-titles',
        title: 'Suggested TDK',
        class: !suggestedTitles.value.length ? 'nav-disabled' : ''
      },
      {
        key: 'content-outline',
        href: '#content-outline',
        title: 'Content Outline',
        class: !generatedOutline.value ? 'nav-disabled' : ''
      }
    ])

    // 监听 filters 的变化，自动应用筛选
    watch(
      () => filters.value,
      () => {
        applyFiltersImmediately();
      },
      { deep: true }
    );

    const applyFiltersImmediately = () => {
      // 在这里实现筛选逻辑
      // ... 筛选实现代码 ...
    };

    // Add new reactive variables
    const analysisStatus = ref(null)
    const isLoading = ref(true)
    const pollingInterval = ref(null)
    const taskInfo = ref(null)

    // 修改 checkAnalysisStatus 函数
    const checkAnalysisStatus = async () => {
      if (!domainConfigured.value) {
        isLoading.value = false;
        return;
      }

      try {
        const response = await api.getAnalysisStatus()
        if (response) {
          taskInfo.value = response
          if (response.analysisStatus === 'finished') {
            clearInterval(pollingInterval.value)
            // 获取概览数据
            const overview = await api.getKeywordAnalysisOverview()
            if (overview?.data) {
              // 正确映射 API 返回的数据结构
              overviewData.value = {
                totalKeywordsAnalyzed: overview.data.totalKeywordsAnalyzed,
                totalTopPagesAnalyzed: overview.data.totalTopPagesAnalyzed,
                absence: overview.data.keywordsGroup.absence,  // 从 keywordsGroup 中获取 absence
                weak: overview.data.keywordsGroup.weak || 0    // 如果 API 返回了 weak 数据
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to check analysis status:', error)
        message.error('Failed to check analysis status')
      } finally {
        isLoading.value = false
      }
    }

    // 修改 startPolling 函数
    const startPolling = () => {
      // 如果域名未配置,不启动轮询
      if (!domainConfigured.value) {
        return;
      }

      // Clear any existing interval
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
      
      // Start polling every 30 seconds
      pollingInterval.value = setInterval(checkAnalysisStatus, 30000)
    }

    // 修改 onMounted 钩子
    onMounted(async () => {
      await checkDomainStatus()
      // 只有在域名已配置的情况下才检查分析状态和启动轮询
      if (domainConfigured.value) {
        checkAnalysisStatus()
        startPolling()
      }
    })

    // Clean up interval on component unmount
    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    })

    // Computed property to determine what to display
    const analysisState = computed(() => {
      if (isLoading.value) return 'loading'
      return taskInfo.value?.analysisStatus || 'not_started'
    })

    // 添加 showLoadingState 函数
    const showLoadingState = computed(() => {
      if (isLoading.value) {
        return true
      }
      
      if (analysisState.value === 'processing') {
        return true
      }
      
      return false
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
      try {
        const response = await api.getProductsByCustomerId()
        domainConfigured.value = response.data?.domainStatus || false
      } catch (error) {
        console.error('Failed to fetch product info:', error)
        domainConfigured.value = false
      }
    }

    // 导航到设置页面
    const goToDashboard = () => {
      router.push('/dashboard')
    }

    // 导航到帮助中心
    const goToHelpCenter = () => {
      router.push('/help-center')
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

    return {
      currentMode,
      selectedKeywords,
      overviewData,
      currentModeComponent,
      getCategoryPercent,
      viewSelected,
      clearSelection,
      overviewStats: ref(overviewStats),
      categories: ref(categories),
      priorities,
      recommendedKeywords,  // 确保在 return 中暴露
      pageKeywords: ref(pageKeywords),
      savedPresets: ref(savedPresets),
      columns,
      competitorColumns: computed(() => competitorColumns),
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
      showSelectedModal,
      showSelectedKeywords,
      handleModalClose,
      getKeywordsByPriority,
      isGenerating,
      contentPlan,
      suggestedTopics,
      suggestedTitles,
      generatedOutline,
      selectedTopic,
      selectedTitle,
      generateContent,
      selectedTopicsCount,
      selectedTitlesCount,
      handleTopicSelect,
      handleTitleSelect,
      confirmTopics,  // 确保这些方法被返回
      confirmTitles,
      scrollToElement,
      isGeneratingTitles,
      isGeneratingOutline,
      hasGenerated,
      generateTitles,
      filteredKeywords,
      getRankClass,
      handleKeywordSelect,
      addFilter,
      removeFilter,
      filters,
      anchorItems,
      clearFilters,
      showLoadingState,
      analysisStatus,
      isLoading,
      analysisState,
      taskInfo,
      currentTasks,
      getProgressPercent,
      formatTime,
      domainConfigured,
      goToDashboard,
      goToHelpCenter,
      recommendedPagination,
      pagePagination,
      handleComparisonPaginationChange,
      handleTopPagesPaginationChange,
      currentPriority,
      handleTabChange
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
  flex-direction: column;
  gap: 12px;
}

.keyword-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keyword-text {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.keyword-metrics {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.keyword-reason {
  display: flex;
  align-items: flex-start;
  gap: 8px;
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

.generation-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.workspace-layout {
  display: flex;
  gap: 24px;
  height: calc(100vh - 200px);
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

.step-actions {
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.workspace-layout {
  display: flex;
  gap: 24px;
  height: calc(100vh - 200px);
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

.generation-flow {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
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
  height: calc(100vh - 200px);
}

.generation-flow {
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e8e8e8;
    border-radius: 3px;
    
    &:hover {
      background: #d9d9d9;
    }
  }
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

.action-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.topic-list,
.title-list {
  margin-bottom: 0; /* 移除底部边距，因为现在有了 action-footer */
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
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

@keyframes iconPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
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
  padding: 0 0 16px 0; /* 修改头部内边距 */
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

.competitor-table {
  :deep(.ant-table-body) {
    min-height: 400px;  /* 设置最小高度 */
  }
  
  :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
    padding: 12px 16px;
  }
  
  :deep(.ant-table-tbody > tr > td) {
    padding: 12px 16px;
  }
}

.rank-cell {
  display: flex;
  align-items: center;
  gap: 6px;
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
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
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

/* 修改生成流程容器的样式 */
.generation-flow {
  flex: 1;
  padding: 0 24px 24px; /* 添加左右和底部内边距 */
  overflow-y: auto;
  max-height: calc(100vh - 200px); /* 设置最大高度，确保可滚动 */
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
  min-height: calc(100vh - 300px);
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

.step-title {
  font-weight: 500;
  margin-right: 8px;
}

.step-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}
</style>


