<template>
  <PageLayout>
    <a-spin 
      :spinning="loading"
      class="centered-spin"
    >
      <template v-if="domainConfigured">
        <template v-if="analysisState !== 'finished'">
          <div class="analysis-loading-state">
            <a-card class="loading-card">
              <!-- Not Started State -->
              <template v-if="analysisState === 'not_started'">
                <div class="analysis-loading-card" style="display: flex; justify-content: center; align-items: center; min-height: 300px;">
                  <div class="preparing-analysis-content">
                    <LoadingOutlined class="analysis-icon" spin />
                    <h2 class="analysis-title">Initializing Keyword Analysis</h2>
                    <p class="analysis-description">Gathering competitive intelligence from <span class="platform-tag semrush">SEMrush</span>, <span class="platform-tag ahrefs">Ahrefs</span>, <span class="platform-tag google">Google Trends</span>, and <span class="platform-tag social">Social Media</span></p>
                    <div class="loading-tips"> 
                      <ThunderboltOutlined class="tip-icon" />
                      <span class="tip-text">Pro Tip: This initial scan typically takes several minutes</span>
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="analysisState === 'processing'">
                <div class="analysis-loading-card" style="display: flex; justify-content: center; align-items: center; min-height: 300px;">
                  <div class="processing-analysis-content">
                    <div class="analysis-icon-container">
                      <LoadingOutlined class="analysis-icon pulse" spin />
                    </div>
                    <h2 class="analysis-title">Keywords Analysis in Progress</h2>
                    <p class="analysis-description">
                      Your keyword database has been successfully created! We're now analyzing and prioritizing your keywords for maximum impact.
                    </p>
                    <div class="analysis-status">
                      <div v-for="task in currentTasks" :key="task.taskName" class="task-item">
                        <div class="task-header">
                          <span class="task-name">{{ task.taskName }}</span>
                          <span class="task-status" :class="task.status">{{ task.status }}</span>
                        </div>
                        <a-progress 
                          :percent="getProgressPercent(task.progress)" 
                          :status="task.status === 'finished' ? 'success' : 'active'"
                          :strokeColor="{ from: '#108ee9', to: '#87d068' }"
                          size="small"
                        />
                        <div class="task-timing">
                          <span>Started: {{ formatTime(task.startTime) }}</span>
                          <span v-if="task.endTime">Completed: {{ formatTime(task.endTime) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="notification-message">
                      <MailOutlined class="mail-icon" />
                      <span>You'll receive an email notification when the analysis is complete!</span>
                    </div>
                  </div>
                </div>
              </template>
            </a-card>
          </div>
        </template>

        <template v-else>
          <div class="planning-layout">
            <div class="main-content">
              <div v-show="currentStep === '0'" class="step-panel">
                <div class="keywords-selection">
                  <a-tabs 
                    v-model:activeKey="keywordSelectionMode"
                    class="mode-tabs"
                    @change="handleModeChange"
                  >
                    <template #rightExtra>
                      <a-button 
                        type="link"
                        @click="showSelectedKeywords"
                        class="view-keywords-btn"
                      >
                        View Selected Keywords
                      </a-button>
                    </template>
                    
                    <a-tab-pane key="ai" tab="AI Priority Ranking">
                      <div class="beginner-mode">
                        <a-row :gutter="[24, 24]" class="beginner-content">
                          <a-col :span="24">
                            <a-card class="keyword-table-card">
                              <!-- Add filter panel -->
                              <div class="filter-panel">
                                <a-form layout="vertical" :model="filterForm">
                                  <a-row :gutter="16">
                                    <!-- Priority filter -->
                                    <a-col :span="8">
                                      <a-form-item label="Priority">
                                        <a-select
                                          v-model:value="filterForm.priority"
                                          placeholder="Select priority"
                                          style="width: 100%"
                                          allow-clear
                                        >
                                          <a-select-option v-for="priority in priorities" :key="priority.level" :value="priority.level">
                                            {{ priority.label }}
                                          </a-select-option>
                                        </a-select>
                                      </a-form-item>
                                    </a-col>
                                    
                                    <!-- KD range filter -->
                                    <a-col :span="8">
                                      <a-form-item label="Keyword Difficulty (KD)">
                                        <a-row :gutter="8">
                                          <a-col :span="11">
                                            <a-input-number
                                              v-model:value="filterForm.kdMin"
                                              placeholder="Min"
                                              style="width: 100%"
                                              :min="0"
                                              :max="100"
                                            />
                                          </a-col>
                                          <a-col :span="2" style="text-align: center">-</a-col>
                                          <a-col :span="11">
                                            <a-input-number
                                              v-model:value="filterForm.kdMax"
                                              placeholder="Max"
                                              style="width: 100%"
                                              :min="0"
                                              :max="100"
                                            />
                                          </a-col>
                                        </a-row>
                                      </a-form-item>
                                    </a-col>
                                    
                                    <!-- Volume range filter -->
                                    <a-col :span="8">
                                      <a-form-item label="Search Volume">
                                        <a-row :gutter="8">
                                          <a-col :span="11">
                                            <a-input-number
                                              v-model:value="filterForm.volumeMin"
                                              placeholder="Min"
                                              style="width: 100%"
                                              :min="0"
                                            />
                                          </a-col>
                                          <a-col :span="2" style="text-align: center">-</a-col>
                                          <a-col :span="11">
                                            <a-input-number
                                              v-model:value="filterForm.volumeMax"
                                              placeholder="Max"
                                              style="width: 100%"
                                              :min="0"
                                            />
                                          </a-col>
                                        </a-row>
                                      </a-form-item>
                                    </a-col>
                                  </a-row>
                                  
                                  <a-row :gutter="16">
                                    <!-- Related outlines filter -->
                                    <a-col :span="8">
                                      <a-form-item label="Related Outlines">
                                        <a-select
                                          v-model:value="filterForm.hasOutlines"
                                          placeholder="Select status"
                                          style="width: 100%"
                                          allow-clear
                                        >
                                          <a-select-option value="yes">Has Outlines</a-select-option>
                                          <a-select-option value="no">No Outlines</a-select-option>
                                        </a-select>
                                      </a-form-item>
                                    </a-col>
                                    <a-col :span="8">
                                      <a-form-item label="Smart Keyword Search">
                                        <div class="smart-input-container" style="display: flex; align-items: flex-start;">
                                          <div style="flex: 1;">
                                            <a-input
                                              v-model:value="filterForm.searchTerm"
                                              placeholder="Input keywords or questions..."
                                              allow-clear
                                              class="smart-search-input"
                                            />
                                            <div class="input-suggestions">
                                              <div class="suggestion-examples">
                                                <p class="suggestion-title">Try like:</p>
                                                <div class="suggestion-items">
                                                  <div class="suggestion-item" @click="applySuggestion('digital marketing')">
                                                    1. Input a seed keyword: "digital marketing"
                                                  </div>
                                                  <div class="suggestion-item" @click="applySuggestion('Discover low-competition keywords about content marketing')">
                                                    2. Input a hint: "Discover low-competition keywords about content marketing"
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <a-button 
                                            type="primary" 
                                            @click="applyFilters"
                                            style="margin-left: 8px; margin-top: 0;"
                                          >Apply Filters</a-button>
                                        </div>
                                      </a-form-item>
                                    </a-col>
                                  </a-row>
                                </a-form>
                              </div>
                              
                              <a-table
                                :dataSource="recommendedKeywords"
                                :columns="keywordsTableColumns"
                                :pagination="{
                                  current: recommendedPagination.current,
                                  pageSize: recommendedPagination.pageSize,
                                  total: recommendedPagination.total,
                                  showSizeChanger: true,
                                  showQuickJumper: true
                                }"
                                @change="handleKeywordsPaginationChange"
                                size="small"
                                class="keywords-table"
                              >
                                <template #bodyCell="{ column, record }">
                                  <template v-if="column.key === 'actions'">
                                    <a-button 
                                      type="primary"
                                      ghost
                                      :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                                      @click="handleKeywordFavorite(record)"
                                    >
                                      {{ record.favorited ? 'Deselect' : 'Select' }}
                                    </a-button>
                                  </template>
                                </template>
                              </a-table>
                            </a-card>
                          </a-col>
                        </a-row>
                      </div>
                    </a-tab-pane>

                    <a-tab-pane key="manual" tab="Manual Import">
                      <div class="manual-import-content">
                        <a-card class="import-methods-card">
                          <div class="import-method-item">
                            <div class="method-header">
                              <p class="method-desc">Import keywords from a CSV or Excel file</p>
                              <div class="method-actions">
                                <a-upload
                                  :customRequest="handleFileUpload"
                                  :showUploadList="false"
                                  accept=".csv,.xlsx,.xls"
                                >
                                  <a-button type="primary">Upload File</a-button>
                                </a-upload>
                                <a-button @click="downloadTemplate">Download Template</a-button>
                                <a-button type="link" @click="showTemplateInfo">View Guide</a-button>
                              </div>
                            </div>
                          </div>
                        </a-card>
                        <a-card title="Imported Keywords" class="imported-keywords-card">
                          <a-table
                            :dataSource="importedKeywords"
                            :columns="importedKeywordsColumns"
                            :pagination="importedKeywordsPagination"
                            @change="handleImportedKeywordsPaginationChange"
                          >
                            <template #bodyCell="{ column, record }">
                              <template v-if="column.key === 'actions'">
                                <a-space>
                                  <a-button 
                                    type="primary"
                                    ghost
                                    :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                                    @click="handleKeywordFavorite(record)"
                                  >
                                    {{ record.favorited ? 'Deselect' : 'Select' }}
                                  </a-button>
                                  <a-button 
                                    type="link" 
                                    danger 
                                    @click="removeImportedKeyword(record)"
                                  >
                                    <DeleteOutlined />
                                  </a-button>
                                </a-space>
                              </template>
                            </template>
                          </a-table>
                        </a-card>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="input" tab="Manual Input">
                      <div class="coming-soon-container">
                        <div class="coming-soon-content">
                          <EditOutlined class="coming-soon-icon" />
                          <h3 class="coming-soon-title">Coming Soon</h3>
                          <p class="coming-soon-description">Manual keyword input functionality will be available shortly.</p>
                        </div>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </div>

              <div v-show="currentStep === '1'" class="step-panel">
                <div v-if="outlineGenerationStatus === 'processing'" class="task-status-card">
                    <div class="task-status-content">
                      <div class="task-status-icon">
                        <LoadingOutlined spin class="status-icon" />
                      </div>
                      <div class="task-status-info">
                        <h3 class="task-status-title">Page Outline Generation in Progress</h3>
                        <p class="task-status-description">
                          Our AI is analyzing your keywords and creating optimized content plans. This process typically takes 3-5 minutes to complete.
                        </p>
                        <div class="task-timing">
                          <span>Started: {{ formatTime(taskStartTime) }}</span>
                          <span v-if="taskEndTime">Completed: {{ formatTime(taskEndTime) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                <div class="content-toolbar">
                  <div class="toolbar-left">
                    <div class="outline-stats">
                      {{ contentPlans.length }} outlines generated
                    </div>
                  </div>
                  <div class="toolbar-right">
                    <a-button 
                      class="action-button"
                      @click="showHistoryModal"
                      type="default"
                    >
                      Generation History
                    </a-button>
                    <a-button 
                      class="action-button"
                      @click="refreshContentPlans"
                      :loading="isRefreshing"
                      type="default"
                    >
                      Refresh
                    </a-button>
                    <a-button 
                      @click="confirmClearAllOutlines" 
                      type="default" 
                      danger
                      :disabled="contentPlans.length === 0"
                      class="action-button"
                    >
                      Clear All
                    </a-button>
                    <a-button 
                      class="action-button generate-btn"
                      @click="handleGenerateOutlinePlan"
                      :disabled="isGenerating || outlineGenerationStatus === 'processing'"
                      :loading="isGenerating"
                      :title="getAIButtonTooltip"
                    >
                      <ThunderboltOutlined />
                      Generate Content Plans
                    </a-button>
                    <a-button
                      type="primary"
                      @click="handlePublishOutlines"
                      :disabled="selectedOutlinesCount === 0 || isGeneratingPages"
                      class="action-button generate-pages-btn"
                    >
                      <RocketOutlined v-if="!isGeneratingPages" />
                      <LoadingOutlined v-else />
                      Generate Pages
                    </a-button>
                  </div>
                </div>

                <a-tabs 
                  v-model:activeKey="contentPlanTab" 
                  class="content-plan-tabs"
                  @change="handleContentPlanTabChange"
                >
                  <a-tab-pane key="all" tab="All Outlines">
                    <a-table
                      class="content-plans-table"
                      :dataSource="contentPlans"
                      :loading="isLoadingOutlines"
                      :pagination="contentPlansPagination"
                      :rowKey="record => record.outlineId"
                      @change="handleContentPlansPaginationChange"
                      @row-click="showPlanDetails"
                    >
                      <!-- 标题列 -->
                      <a-table-column title="Title" key="title" width="30%">
                        <template #default="{ record }">
                          <div class="outline-title" @click.stop="showPlanDetails(record)">{{ record.title }}</div>
                          <div class="outline-description" v-if="record.description" @click.stop="showPlanDetails(record)">
                            {{ record.description.length > 80 ? record.description.substring(0, 80) + '...' : record.description }}
                          </div>
                        </template>
                      </a-table-column>
                      
                      <!-- 关键词列 -->
                      <a-table-column title="Keywords" key="keywords" width="25%">
                        <template #default="{ record }">
                          <div class="outline-keywords" @click.stop="showPlanDetails(record)">
                            <a-tag v-for="(keyword, index) in record.keywords.split(',').slice(0, 3)" :key="index">
                              {{ keyword.trim() }}
                            </a-tag>
                            <a-tag v-if="record.keywords.split(',').length > 3" class="more-tag">
                              +{{ record.keywords.split(',').length - 3 }}
                            </a-tag>
                          </div>
                        </template>
                      </a-table-column>
                      
                      <!-- 页面类型列 -->
                      <a-table-column title="Type" key="pageType" width="15%">
                        <template #default="{ record }">
                          <a-tag :color="getPageTypeColor(record.pageType)" @click.stop="showPlanDetails(record)">
                            {{ record.pageType }}
                          </a-tag>
                        </template>
                      </a-table-column>
                      
                      <!-- 操作列 -->
                      <a-table-column title="Actions" key="actions" width="15%">
                        <template #default="{ record }">
                          <div class="outline-actions">
                            <a-button 
                              type="text" 
                              @click.stop="handleFavorite(record)"
                              :title="record.favorited ? 'Remove from favorites' : 'Add to favorites'"
                            >
                              <StarFilled v-if="record.favorited" style="color: #faad14;" />
                              <StarOutlined v-else />
                            </a-button>
                            
                            <a-button 
                              type="text" 
                              @click.stop="handleSinglePageGeneration(record)"
                              :disabled="isGeneratingPages || record.status === 'processing'"
                              :title="record.hasRelatedPageTask ? 'Page already exists' : 'Generate page'"
                            >
                              <RocketOutlined :style="{ color: record.hasRelatedPageTask ? '#faad14' : '#1890ff' }" />
                            </a-button>
                            
                            <a-button 
                              type="text" 
                              @click.stop="handleDeleteOutline(record)"
                              title="Delete outline"
                            >
                              <DeleteOutlined style="color: #ff4d4f;" />
                            </a-button>
                          </div>
                        </template>
                      </a-table-column>
                    </a-table>
                  </a-tab-pane>

                  <a-tab-pane key="favorites" tab="Selected Outlines">
                    <!-- 收藏夹的表格，与上面类似但过滤为收藏的内容 -->
                    <a-table
                      class="content-plans-table"
                      :dataSource="contentPlans.filter(plan => plan.favorited)"
                      :loading="isLoadingOutlines"
                      :pagination="contentPlansPagination"
                      :rowKey="record => record.outlineId"
                      @change="handleContentPlansPaginationChange"
                      @row-click="showPlanDetails"
                    >
                      <!-- 与上面相同的列定义 -->
                      <a-table-column title="Title" key="title" width="30%">
                        <template #default="{ record }">
                          <div class="outline-title" @click.stop="showPlanDetails(record)">{{ record.title }}</div>
                          <div class="outline-description" v-if="record.description" @click.stop="showPlanDetails(record)">
                            {{ record.description.length > 80 ? record.description.substring(0, 80) + '...' : record.description }}
                          </div>
                        </template>
                      </a-table-column>
                      
                      <a-table-column title="Keywords" key="keywords" width="25%">
                        <template #default="{ record }">
                          <div class="outline-keywords" @click.stop="showPlanDetails(record)">
                            <a-tag v-for="(keyword, index) in record.keywords.split(',').slice(0, 3)" :key="index">
                              {{ keyword.trim() }}
                            </a-tag>
                            <a-tag v-if="record.keywords.split(',').length > 3" class="more-tag">
                              +{{ record.keywords.split(',').length - 3 }}
                            </a-tag>
                          </div>
                        </template>
                      </a-table-column>
                      
                      <a-table-column title="Type" key="pageType" width="15%">
                        <template #default="{ record }">
                          <a-tag :color="getPageTypeColor(record.pageType)" @click.stop="showPlanDetails(record)">
                            {{ record.pageType }}
                          </a-tag>
                        </template>
                      </a-table-column>
                      
                      <a-table-column title="Actions" key="actions" width="15%">
                        <template #default="{ record }">
                          <div class="outline-actions">
                            <a-button 
                              type="text" 
                              @click.stop="handleFavorite(record)"
                              :title="record.favorited ? 'Remove from favorites' : 'Add to favorites'"
                            >
                              <StarFilled v-if="record.favorited" style="color: #faad14;" />
                              <StarOutlined v-else />
                            </a-button>
                            
                            <a-button 
                              type="text" 
                              @click.stop="handleSinglePageGeneration(record)"
                              :disabled="isGeneratingPages || record.status === 'processing'"
                              :title="record.hasRelatedPageTask ? 'Page already exists' : 'Generate page'"
                            >
                              <RocketOutlined :style="{ color: record.hasRelatedPageTask ? '#faad14' : '#1890ff' }" />
                            </a-button>
                            
                            <a-button 
                              type="text" 
                              @click.stop="handleDeleteOutline(record)"
                              title="Delete outline"
                            >
                              <DeleteOutlined style="color: #ff4d4f;" />
                            </a-button>
                          </div>
                        </template>
                      </a-table-column>
                    </a-table>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </div>
          </div>
        </template>
      </template>

      <template v-else>
        <no-site-configured v-if="!loading"/>
      </template>
    </a-spin>

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

    <a-modal
      v-model:open="showSelectedModal"
      title="Selected Keywords"
      width="700px"
      @cancel="handleModalClose"
    >
      <!-- 添加加载状态显示 -->
      <div v-if="isLoadingModalKeywords" class="loading-keywords">
        <a-spin>
        </a-spin>
        <div class="loading-content">
          <p>Loading selected keywords...</p>
        </div>
      </div>

      <!-- 已选关键词表格,仅在非加载状态显示 -->
      <template v-else>
        <a-table
          :dataSource="modalKeywords.comparison"
          :columns="keywordsTableColumns"
          :pagination="false"
          size="small"
          class="selected-keywords-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <a-button 
                type="primary"
                ghost
                class="deselect-btn"
                @click="handleCancelSelection(record)"
              >
                Deselect
              </a-button>
            </template>
          </template>
        </a-table>
      </template>

      <template #footer>
        <a-button @click="handleModalClose">Close</a-button>
        <a-button 
          type="primary" 
          @click="proceedToContentPlan"
          :disabled="totalSelectedKeywords === 0"
        >
          Proceed to Outlines
        </a-button>
      </template>
    </a-modal>

    <a-drawer
      v-model:open="drawerVisible"
      :title="selectedPlan?.title"
      placement="right"
      :width="720"
      :footer="false"
      @close="closeDrawer"
      class="outline-drawer"
    >
      <template v-if="selectedPlan">
        <div class="drawer-content">
          <!-- Basic Information Section -->
          <section class="drawer-section">
            <h3 class="section-title">
              Basic Information
            </h3>
            <!-- Title -->
            <div class="info-item">
              <span class="info-label">Title</span>
              <div class="editable-title">
                <a-input
                  v-if="isEditingTitle"
                  v-model:value="selectedPlan.title"
                  @pressEnter="saveTitle"
                  @blur="saveTitle"
                  :maxLength="100"
                  class="title-input bordered"
                />
                <div v-else class="title-display" @click="startEditingTitle">
                  <span>{{ selectedPlan.title }}</span>
                  <EditOutlined class="edit-icon" />
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="info-item">
              <span class="info-label">Description</span>
              <div class="editable-description">
                <a-textarea
                  v-if="isEditingDesc"
                  v-model:value="selectedPlan.description"
                  @pressEnter="saveDescription"
                  @blur="saveDescription"
                  :maxLength="500"
                  :autoSize="{ minRows: 3, maxRows: 6 }"
                  class="description-input bordered"
                />
                <div v-else class="description-display" @click="startEditingDesc">
                  <p>{{ selectedPlan.description }}</p>
                  <EditOutlined class="edit-icon" />
                </div>
              </div>
            </div>

            <!-- Keywords -->
            <div class="info-item">
              <span class="info-label">Keywords</span>
              <a-select
                v-model:value="selectedPlan.keywords"
                mode="multiple"
                style="width: 100%"
                placeholder="Select keywords"
                :options="availableKeywords"
                :loading="isUpdatingKeywords"
                @change="handleKeywordsChange"
                @blur="handleBlur"
                @deselect="handleChange"
                @select="handleChange"
              >
                <!-- 移除 tagRender 模板，使用默认的标签样式 -->
              </a-select>
            </div>

            <!-- Other Metadata -->
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Page Type</span>
                <a-tag :color="getTypeColor(selectedPlan.pageType)">
                  {{ selectedPlan.pageType }}
                </a-tag>
              </div>
            </div>
          </section>

          <section class="drawer-section">
            <h3 class="section-title">
              Content Outline
            </h3>
            <div class="outline-tree">
              <a-collapse 
                v-model:activeKey="activeOutlineSections" 
                :bordered="false"
                class="custom-collapse"
              >
                <a-collapse-panel 
                  v-for="(section, index) in selectedPlan.outline" 
                  :key="index"
                >
                  <template #header>
                    <div class="section-header">
                      <span class="section-title">
                        {{ Array.isArray(section.sectionTitle) 
                          ? section.sectionTitle[0] 
                          : section.sectionTitle }}
                      </span>
                      <span class="section-wordcount">{{ section.wordCount }} words</span>
                    </div>
                  </template>

                  <div class="section-details">
                    <!-- Keywords -->
                    <div class="info-row">
                      <span class="info-key">Keywords Distribution:</span>
                      <div class="keyword-distribution">
                        <div 
                          v-for="(count, keyword) in section.keywords" 
                          :key="keyword"
                          class="keyword-item"
                        >
                          <a-tag color="blue">{{ keyword }}</a-tag>
                          <span class="keyword-count">× {{ count }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Subsections if array -->
                    <div v-if="Array.isArray(section.sectionTitle) && section.sectionTitle.length > 1" class="subsections">
                      <div class="info-row">
                        <span class="info-key">Subsections:</span>
                        <div class="subsection-list">
                          <div 
                            v-for="(title, subIndex) in section.sectionTitle.slice(1)" 
                            :key="subIndex"
                            class="subsection-item"
                          >
                            <span class="subsection-number">{{ subIndex + 1 }}.</span>
                            <span class="subsection-title">{{ title }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </section>
        </div>
      </template>
    </a-drawer>

    <a-modal
      v-model:open="historyModalVisible"
      :title="selectedBatchNo ? 'Batch Details' : 'Generation History'"
      width="1200px"
      @cancel="closeHistoryModal"
      :footer="null"
    >
      <div v-if="selectedBatchNo" class="mb-4">
        <a-button @click="backToBatchList">
          Back to List
        </a-button>
      </div>

      <template v-if="!selectedBatchNo">
        <a-table
          :dataSource="historyBatches"
          :columns="batchesColumns"
          :pagination="batchesPagination"
          :loading="isLoadingHistory"
          @change="({ current }) => handleBatchesPaginationChange(current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="viewBatchDetail(record.batchNo)">
              View Used Keywords
              </a-button>
            </template>
          </template>
        </a-table>
      </template>

      <template v-else>
        <a-table
          :dataSource="historyRecords"
          :columns="recordsColumns"
          :pagination="recordsPagination"
          :loading="isLoadingHistory"
          @change="({ current }) => handleRecordsPaginationChange(current)"
        />
      </template>
    </a-modal>

    <a-modal
      v-model:visible="aiSelectionModalVisible"
      title="AI Autopilot"
      @ok="handleAISelection"
      :footer="null"
      :width="600"
      :centered="true"
      :maskClosable="false"
      class="ai-selection-modal"
      :bodyStyle="{ padding: '24px' }"
    >
      <div class="ai-selection-simple">
        <div class="ai-icon-container">
          <ThunderboltFilled class="ai-icon" />
        </div>
        <h3 class="ai-title">Automatic Keyword Selection & Outline Generation</h3>
        <p class="ai-description">
          We'll automatically select 5 keywords with the highest potential impact and generate optimized content outlines for you.
          This helps you jumpstart your content creation process without manual keyword filtering.
        </p>
        
        <div class="ai-action-buttons">
          <a-button class="btn-cancel" @click="aiSelectionModalVisible = false">
            Cancel
          </a-button>
          <a-button 
            class="btn-start" 
            type="primary" 
            :loading="isAISelecting" 
            @click="handleAISelection"
          >
            Start Auto-Generation
          </a-button>
        </div>
      </div>
    </a-modal>
  </PageLayout>
</template>

<script>
import { defineComponent, ref, computed, h, watch, nextTick, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { Tag } from 'ant-design-vue'
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
  ReloadOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  AimOutlined,
  BarChartOutlined,
  UserOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  RobotOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
  RiseOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileAddOutlined,
  RocketOutlined,
  UpOutlined,
  DownOutlined,
  GiftOutlined,
  FileSearchOutlined,
  MailOutlined,
  ThunderboltFilled,
  FundOutlined,
  CheckCircleFilled,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import api from '../api/api'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import { Modal } from 'ant-design-vue'
import SmartBanner from './common/SmartBanner.vue'

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
    SmartBanner,
    ExperimentOutlined,
    ThunderboltOutlined,
    AimOutlined,
    BarChartOutlined,
    UserOutlined,
    TagsOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    RobotOutlined,
    HistoryOutlined,
    ArrowLeftOutlined,
    RiseOutlined,
    EditOutlined,
    UploadOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    EditOutlined,
    UploadOutlined,
    DownloadOutlined,
    QuestionCircleOutlined,
    Tag,
    FileAddOutlined,
    RocketOutlined,
    UpOutlined,
    DownOutlined,
    GiftOutlined,
    FileSearchOutlined,
    MailOutlined,
    ThunderboltFilled,
    FundOutlined,
    CheckCircleFilled,
    StarFilled,
    StarOutlined,
  },
  setup() {
    const selectedKeywords = ref([])
    const isGeneratingTitles = ref(false) 
    const isGeneratingOutline = ref(false) 
    const loading = ref(true) 
    const taskStartTime = ref(null)
    const taskEndTime = ref(null)
    const taskDescription = ref(null)
    const taskProgress = ref(null)
    const columns = computed(() => keywordsTableColumns.value)
    
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
    }

    const overviewStats = ref({
      totalKeywords: 2500,
      ourTopPages: 30,
      competitorPages: 50
    })

    const priorities = [
      {
        level: '1',
        label: 'Low Competition, Considerable Volumn',
        color: '#f50'
      },
      {
        level: '2', 
        label: 'Good Volume, Medium Competition',
        color: '#fa8c16'
      },
      {
        level: '3',
        label: 'Medium Volume & Competition',
        color: '#1890ff'
      },
      {
        level: '4',
        label: 'Lower Volume, Higher Competition',
        color: '#52c41a'
      },
      {
        level: '5',
        label: 'Monitor & Long-term',
        color: '#722ed1'
      }
    ]

    const recommendedKeywords = ref([])
    const recommendedPagination = ref({
      current: 1,
      pageSize: 15,
      total: 0
    })

    const transformKeywordData = (item) => {
      return {
        id: item.keywordId,
        keyword: item.keyword,
        kd: item.kd || 0,
        volume: item.volume || 0,
        cpc: Number(item.cpc || 0).toFixed(2),
        favorited: item.status === 'selected',
        relatedOutlines: item.relatedOutlines || [],
        keywordType: item.keywordType,
        status: item.status,
        priority: item.priority
      }
    }

    const fetchKeywords = async (priority = '1', page = 1, pageSize = 15, searchTerm = '') => {
      console.log('Fetching keywords with priority:', priority, 'page:', page, 'pageSize:', pageSize);
      try {
        const response = await api.getPlanningKeywords({
          level: priority,  // 使用level作为参数名称
          page,
          limit: pageSize
        })
        
        if (response?.data) {
          console.log('API response received, data count:', response.data.length);
          recommendedKeywords.value = response.data.map(transformKeywordData)
          
          // 确保正确设置总数
          recommendedPagination.value.total = response.totalCount || 0
          
        } else {
          recommendedKeywords.value = [];
          recommendedPagination.value.total = 0;
        }
      } catch (error) {
        console.error('Failed to fetch keywords:', error)
        message.error('Failed to load keywords')
        recommendedKeywords.value = [];
        recommendedPagination.value.total = 0;
      }
    }

    const handleComparisonPaginationChange = (priority, page, pageSize) => {
      recommendedPagination.value.current = page
      recommendedPagination.value.pageSize = pageSize
      fetchKeywords(priority, page, pageSize)
    }

    onMounted(async () => {
      loading.value = true
      try {
        await Promise.all([
          checkDomainStatus(),
        ])

        if (domainConfigured.value) {
          await checkAnalysisStatus()
          
          if (analysisState.value !== 'finished') {
            pollingInterval.value = setInterval(checkAnalysisStatus, 5000)
          }

          console.log('Before loading keywords') // 添加日志
          await fetchKeywords('1', 1, recommendedPagination.value.pageSize)
          console.log('After loading keywords, count:', recommendedKeywords.value.length) // 添加日志
          initializeSelectedKeywords()
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        message.error('Failed to initialize the page')
      } finally {
        loading.value = false
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
        () => selectedKeywords.value
      ],
      ([newRecommendedKeywords, newSelectedKeywords], [oldRecommendedKeywords, oldSelectedKeywords]) => {
        if (newRecommendedKeywords !== oldRecommendedKeywords) {
          const selectedOnes = newRecommendedKeywords.filter(k => k.selected)
          selectedKeywords.value = [
            ...selectedKeywords.value.filter(k => !newRecommendedKeywords.find(nk => nk.keyword === k.keyword)),
            ...selectedOnes
          ]
        }

        if (newSelectedKeywords !== oldSelectedKeywords) {
          selectedKeywords.value = newSelectedKeywords
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
      if (!keywords || !keywords.length) {
        return [];
      }
      const filteredKeywords = keywords.filter(k => k.priority === Number(priority));
      return filteredKeywords;
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
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };

    const pagination = {
      pageSize: 15,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    const handleTableChange = (pagination, filters, sorter) => {
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
    const showSelectedModal = ref(false)
    const modalKeywords = ref({
      comparison: [],
    })

    const fetchSelectedKeywords = async () => {
      isLoadingModalKeywords.value = true
      try {
        const response = await api.getPlanningKeywords({
          status: 'selected',
          page: 1,
          limit: 100
        });
        
        if (response?.data) {
          modalKeywords.value.comparison = response.data
            .map(transformKeywordData)
            .filter(k => k.favorited);
        } else {
          modalKeywords.value.comparison = [];
        }
      } catch (error) {
        console.error('Failed to get selected keywords:', error);
        message.error('Failed to load selected keywords');
        modalKeywords.value.comparison = [];
      } finally {
        isLoadingModalKeywords.value = false;
      }
    }

    const handleModalClose = () => {
      showSelectedModal.value = false
    }

    const isGenerating = ref(false)

    const hasGenerated = ref(false)

    const getRankClass = (rank) => {
      if (rank <= 3) return 'top-3'
      if (rank <= 10) return 'top-10'
      return 'others'
    }

    const initializeSelectedKeywords = () => {
      const preSelectedKeywords = recommendedKeywords.value.filter(k => k.favorited)
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
            await fetchKeywords(currentPriority.value, 1, recommendedPagination.value.pageSize)
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

    const formatTime = (isoString) => {
      if (!isoString) return '--'
      try {
        const date = new Date(isoString)
        if (isNaN(date.getTime())) return '--'
        
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(date)
      } catch {
        return '--'
      }
    }

    const domainConfigured = ref(false)

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

    const currentPriority = ref('1')

    const handleTabChange = (activeKey) => {
      const priority = priorities.find(p => p.level === activeKey)
      if (priority) {
        currentPriority.value = priority.level
        recommendedPagination.value.current = 1
        fetchKeywords(priority.level, 1, recommendedPagination.value.pageSize)
      }
    }

    const contentPlans = ref([])

    const selectedPlansCount = computed(() => {
      return contentPlans.value.filter(plan => plan.selected).length
    })

    const generateContentPlan = async () => {
      const selectedIds = recommendedKeywords.value
        .filter(k => k.favorited)
        .map(k => k.id);
      
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
        await api.generatePlanningComposite(selectedIds);
        
        message.success('Content plan generation request submitted');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await checkOutlineGenerationStatus();
        
        if (!statusResponse?.data || statusResponse.data.status !== 'finished') {
          startPolling();
        }
      } catch (error) {
        message.error('Failed to generate content plan, please try again');
      } finally {
        isGenerating.value = false;
      }
    };

    const startPolling = () => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
      
      pollingInterval.value = setInterval(async () => {
        const response = await checkOutlineGenerationStatus()
        
        if (response?.data?.status === 'finished' || response?.data?.status === 'failed') {
          clearInterval(pollingInterval.value)
          pollingInterval.value = null
          
          if (response?.data?.status === 'finished') {
            await fetchContentPlans()
            hasGenerated.value = true
          } 
        }
      }, 5000)
    }

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
      }
    });

    const handlePlanSelect = (plan, checked) => {
      plan.selected = checked
    }

    const drawerVisible = ref(false)
    const selectedPlan = ref(null)

    const showPlanDetails = (plan) => {
      selectedPlan.value = {
        ...plan,
        // 确保关键词是数组形式
        keywords: Array.isArray(plan.keywords) 
          ? [...plan.keywords]
          : plan.keywords?.split(',').filter(Boolean) || [],
        originalKeywords: Array.isArray(plan.keywords)
          ? [...plan.keywords]
          : plan.keywords?.split(',').filter(Boolean) || []
      }
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
        await fetchKeywords(currentPriority.value, 1, recommendedPagination.value.pageSize)
      } else if (newStep === '1') {
        contentPlans.value = []
        hasGenerated.value = false
        isGenerating.value = false
        
        await checkAndStartPolling()
      }
    })

    const checkAndStartPolling = async () => {
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
      isLoadingTaskInfo.value = true
      try {
        // 分别查询两个任务的状态
        const [compositeResponse, autoPilotResponse] = await Promise.all([
          api.getAnalysisStatus('composite_generator'),
          api.getAnalysisStatus('auto_pilot')
        ])
        
        let activeResponse = null;
        let wasProcessing = outlineGenerationStatus.value === 'processing';
        let nowFinished = false;
        
        // 处理 composite_generator 任务
        if (compositeResponse?.code === 200 && compositeResponse.data) {
          // 如果是composite任务在处理中，则它是活动任务
          if (compositeResponse.data.status === 'processing') {
            activeResponse = compositeResponse;
            outlineGenerationStatus.value = 'processing';
            taskStartTime.value = compositeResponse.data.startTime;
            taskEndTime.value = compositeResponse.data.endTime;
            taskDescription.value = formatTaskDescription(compositeResponse.data.description);
            taskProgress.value = 50;
          } 
          // 如果composite任务已完成，且之前状态是处理中，则标记为需要刷新
          else if (compositeResponse.data.status === 'finished' && wasProcessing) {
            nowFinished = true;
            outlineGenerationStatus.value = 'finished';
            taskStartTime.value = compositeResponse.data.startTime;
            taskEndTime.value = compositeResponse.data.endTime;
            taskDescription.value = formatTaskDescription(compositeResponse.data.description);
            taskProgress.value = 100;
          }
        }
        
        // 处理 auto_pilot 任务
        if (autoPilotResponse?.code === 200 && autoPilotResponse.data) {
          // 如果是auto_pilot任务在处理中，则它是活动任务
          if (autoPilotResponse.data.status === 'processing') {
            activeResponse = autoPilotResponse;
            outlineGenerationStatus.value = 'processing';
            taskStartTime.value = autoPilotResponse.data.startTime;
            taskEndTime.value = autoPilotResponse.data.endTime;
            taskDescription.value = formatTaskDescription(autoPilotResponse.data.description);
            taskProgress.value = 50;
          } 
          // 如果auto_pilot任务已完成，且之前状态是处理中，则标记为需要刷新
          else if (autoPilotResponse.data.status === 'finished' && wasProcessing) {
            nowFinished = true;
            outlineGenerationStatus.value = 'finished';
            taskStartTime.value = autoPilotResponse.data.startTime;
            taskEndTime.value = autoPilotResponse.data.endTime;
            taskDescription.value = formatTaskDescription(autoPilotResponse.data.description);
            taskProgress.value = 100;
          }
        }
        
        // 只有当任务状态从processing变为finished时才刷新大纲列表
        if (nowFinished) {
          await fetchContentPlans();
          hasGenerated.value = true;
        }
        
        // 如果没有任务在处理中，清除轮询
        if (pollingInterval.value && !activeResponse) {
          clearInterval(pollingInterval.value);
          pollingInterval.value = null;
        }
        
        // 返回活动任务的响应（如果有）
        return activeResponse || (compositeResponse?.data ? compositeResponse : autoPilotResponse);
        
      } catch (error) {
        message.error('Failed to check task status');
        return null;
      } finally {
        isLoadingTaskInfo.value = false;
      }
    }

    const fetchContentPlans = async () => {
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
          // 确保设置总数
          contentPlansPagination.value.total = outlinesResponse.totalCount || 0
          hasGenerated.value = true
        }
      } catch (error) {
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

    const handleFavorite = async (plan, event) => {
      try {
        if (plan.favorited) {
          await api.cancelPlanningOutlines([plan.outlineId]);
          plan.favorited = false;
          message.success('Removed from selection');
        } else {
          await api.selectPlanningOutlines([plan.outlineId]);
          plan.favorited = true;
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    const contentPlanTab = ref('all')

    const handleContentPlanTabChange = async (activeKey) => {
      contentPlanTab.value = activeKey
      if (activeKey === 'all') {
        contentPlansPagination.value.current = 1
        await fetchContentPlans()
      } else {
        selectedPlansPagination.value.current = 1
        await fetchSelectedContentPlans()
      }
    }

    const isLoadingOutlines = ref(false)

    const handleKeywordFavorite = async (keyword) => {
      try {
        if (keyword.favorited) {
          await api.cancelPlanningKeywords([keyword.id]);
          keyword.favorited = false;
          selectedKeywords.value = selectedKeywords.value.filter(k => k.id !== keyword.id);
          message.success('Removed from selection');
        } else {
          await api.selectPlanningKeywords([keyword.id]);
          keyword.favorited = true;
          if (!selectedKeywords.value.find(k => k.id === keyword.id)) {
            selectedKeywords.value.push({ ...keyword, selected: true });
          }
          message.success('Added to selection');
        }
      } catch (error) {
        console.error('Favorite operation failed:', error);
        message.error('Operation failed');
      }
    };

    const handleModalTabChange = (activeKey) => {
      currentModalTab.value = activeKey
    }

    const showSelectedKeywords = async () => {
      showSelectedModal.value = true
      await fetchSelectedKeywords()
    }

    const isLoadingModalKeywords = ref(false)

    const handleCancelSelection = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id]);
        modalKeywords.value.comparison = modalKeywords.value.comparison.filter(k => k.id !== keyword.id);
        recommendedKeywords.value = recommendedKeywords.value.map(k => {
          if (k.id === keyword.id) {
            return { ...k, favorited: false }
          }
          return k;
        });
        message.success('Keyword deselected');
      } catch (error) {
        console.error('Failed to deselect keyword:', error);
        message.error('Failed to deselect keyword');
      }
    };

    const selectedKeywordsTab = ref('comparison')
    const selectedKeywordsData = ref([])
    const isLoadingSelectedKeywords = ref(false)

    watch(currentStep, async (newStep) => {
      if (newStep === '1') {
        await fetchSelectedKeywordsData()
      }
    })

    const fetchSelectedKeywordsData = async () => {
      isLoadingSelectedKeywords.value = true
      try {
        const response = await api.getPlanningKeywords({
          status: 'selected',
          page: 1,
          limit: 100
        })
        
        selectedKeywordsData.value = response?.data?.map(transformKeywordData) || [];
        
      } catch (error) {
        selectedKeywordsData.value = [];
      } finally {
        isLoadingSelectedKeywords.value = false
      }
    }

    const handleRemoveKeyword = async (keyword) => {
      try {
        await api.cancelPlanningKeywords([keyword.id])
        const sourceType = selectedKeywordsTab.value
        selectedKeywordsData.value[sourceType] = selectedKeywordsData.value[sourceType].filter(k => k.id !== keyword.id)
        selectedKeywords.value = selectedKeywords.value.filter(k => k.id !== keyword.id)
        message.success('Keyword removed')
      } catch (error) {
        console.error('Failed to remove keyword:', error)
        message.error('Failed to remove keyword')
      }
    }

    const totalSelectedKeywords = computed(() => {
      return recommendedKeywords.value.filter(k => k.favorited).length
    })

    const handleDeleteOutline = async (plan) => {
      try {
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
          await fetchContentPlans();
        }
      } catch (error) {
        console.error('Failed to delete outline:', error);
        message.error('Failed to delete outline');
      }
    };

    const taskMessage = ref('')

    const getTaskStatusText = (status) => {
      const statusMap = {
        processing: '🚀 AI is crafting your content plans...',
        failed: '❌ Oops! Content plan generation failed',
        not_started: '⏳ Getting ready to create your content plans',
        finished: '✨ Content plans are ready!'
      }
      return statusMap[status] || 'Unknown Status'
    }

    const formatTaskDescription = (description) => {
      if (description?.includes('composite_generator')) {
        const statusMessages = {
          processing: "Our AI is analyzing your keywords and creating personalized content recommendations. This usually takes 1-2 minutes.",
          finished: "Content plans generation completed! You can review the generated outlines below.",
          failed: description || "Content plan generation failed. Please try again."
        }
        return statusMessages[outlineGenerationStatus.value] || description
      }
      return description
    }

    const getProgressStatus = (status) => {
      const statusMap = {
        processing: 'active',
        failed: 'exception',
        finished: 'success'
      }
      return statusMap[status] || 'normal'
    }

    const clearAllOutlines = async () => {
      try {
        isLoadingOutlines.value = true
        
        for (const plan of contentPlans.value) {
          await api.deletePlanningOutline(plan.outlineId)
        }
        
        message.success('All outlines have been cleared')
        
        await checkOutlineGenerationStatus()
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
          await refreshContentPlans()
        },
        okButtonProps: {
          danger: true
        },
        centered: true,
        maskClosable: false
      })
    }

    const isRefreshing = ref(false)

    const refreshContentPlans = async () => {
      isRefreshing.value = true
      try {
        const statusResponse = await checkOutlineGenerationStatus()
        
        if (statusResponse?.data?.status === 'processing') {
          startPolling()
        } else {
          await fetchContentPlans()
        }
        
        message.success('Outlines refreshed')
      } catch (error) {
        console.error('Failed to refresh outline list:', error)
        message.error('Failed to refresh outline list')
      } finally {
        isRefreshing.value = false
      }
    }

    const proceedToContentPlan = () => {
      handleModalClose();
      currentStep.value = '1';
    };

    const handlePublishOutlines = async () => {
      const selectedOutlines = contentPlans.value.filter(plan => plan.favorited)
      if (!selectedOutlines.length) {
        message.warning('Please select at least one outline')
        return
      }

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

    const generationProgressVisible = ref(false)
    const generationProgress = ref(0)
    const generationStatus = ref('active')
    const generationStatusText = ref('Preparing to generate pages...')
    const generationDetails = ref('')
    const isGeneratingPages = ref(false)
    const generationCompleted = ref(false)
    const generationFailed = ref(false)

    const allOutlinesSelected = computed(() => {
      return contentPlans.value.length > 0 && 
             contentPlans.value.every(plan => plan.selected)
    })

    const someOutlinesSelected = computed(() => {
      return contentPlans.value.some(plan => plan.selected) && 
             !allOutlinesSelected.value
    })

    const selectedOutlinesCount = computed(() => {
      return contentPlans.value.filter(plan => plan.favorited).length
    })

    const handleSelectAllOutlines = async (e) => {
      const checked = e.target.checked
      try {
        const currentPageOutlineIds = contentPlans.value.map(plan => plan.outlineId)
        
        if (checked) {
          // 选中当前页所有大纲
          await api.selectPlanningOutlines(currentPageOutlineIds)
          contentPlans.value = contentPlans.value.map(plan => ({
            ...plan,
            favorited: true,
            selected: true
          }))
          message.success('All outlines on this page have been selected')
        } else {
          // 取消选中当前页所有大纲
          await api.cancelPlanningOutlines(currentPageOutlineIds)
          contentPlans.value = contentPlans.value.map(plan => ({
            ...plan,
            favorited: false,
            selected: false
          }))
          message.success('All outlines on this page have been deselected')
        }
      } catch (error) {
        console.error('Failed to update outlines selection:', error)
        message.error('Failed to update selections')
        // 回滚UI状态
        contentPlans.value = contentPlans.value.map(plan => ({
          ...plan,
          favorited: !checked,
          selected: !checked
        }))
      }
    }

    const handleOutlineSelect = async (plan, checked) => {
      try {
        if (checked) {
          await api.selectPlanningOutlines([plan.outlineId]);
          plan.favorited = true;
          message.success('Added to selection');
        } else {
          await api.cancelPlanningOutlines([plan.outlineId]);
          plan.favorited = false;
          message.success('Removed from selection');
        }
        
        // 如果当前在已选标签页，需要刷新列表
        if (contentPlanTab.value === 'selected') {
          await fetchSelectedContentPlans();
        }
      } catch (error) {
        console.error('Failed to update outline selection:', error);
        message.error('Failed to update selection');
        // 回滚UI状态
        plan.selected = !checked;
      }
    };

    const keywordsTableColumns = ref([
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '35%'
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        width: '15%',
        customRender: ({ text }) => {
          let color, difficulty;
          if (text <= 30) {
            color = 'green';
            difficulty = 'Easy';
          } else if (text <= 70) {
            color = 'orange';
            difficulty = 'Medium';
          } else {
            color = 'red';
            difficulty = 'Hard';
          }
          // 修改这里，使用函数插槽
          return h(Tag, { color }, () => `${text} - ${difficulty}`);
        }
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        width: '15%'
      },
      {
        title: 'Has Related Outlines',
        key: 'relatedOutlines',
        width: '20%',
        customRender: ({ record }) => h('span', [
          h(Tag, {
            color: record.relatedOutlines?.length > 0 ? 'green' : 'red'
          }, {
            default: () => record.relatedOutlines?.length > 0 ? 'Yes' : 'No'
          })
        ])
      },
      {
        title: 'Manual Actions',
        key: 'actions',
        width: '15%'
      }
    ])

    const getTypeColor = (type) => {
      const typeColors = {
        'Blog': 'blue',
        'Landing Page': 'green',
      }
      return typeColors[type] || 'default'
    }

    const activeCollapseKeys = ref([])

    const bannerTheme = {
      primary: '#2563EB',
      secondary: '#0EA5E9',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
      textColor: '#FFFFFF',
      descriptionColor: '#E2E8F0',
      badgeColor: '#94A3B8',
      badgeBackground: 'rgba(255, 255, 255, 0.08)',
      badgeHoverBackground: 'rgba(37, 99, 235, 0.15)',
      badgeHoverColor: '#60A5FA',
      iconBackground: 'rgba(37, 99, 235, 0.15)',
    }

    const shouldShowTaskStatus = computed(() => {
      // 直接检查outlineGenerationStatus.value，不依赖于analysisStatus
      return outlineGenerationStatus.value && 
             ['processing', 'finished', 'failed'].includes(outlineGenerationStatus.value) &&
             currentStep.value === '1'; // 只在第二步显示
    });

    const statusColor = computed(() => {
      return {
        color: {
          processing: '#1890ff',
          finished: '#52c41a',
          failed: '#ff4d4f'
        }[outlineGenerationStatus.value]
      }
    });

    const getStatusTagColor = (status) => {
      const statusColors = {
        processing: 'blue',
        finished: 'green',
        failed: 'red'
      }
      return statusColors[status] || 'default'
    }

    const formatOutlineTree = (outline) => {
      return outline.map((item, index) => {
        const node = {
          key: `${index}`,
          title: item.title,
          wordCount: item.wordCount
        }
        
        if (item.subSections && item.subSections.length) {
          node.children = formatOutlineTree(item.subSections)
        }
        
        return node
      })
    }

    const formatDate = (dateString) => {
      if (!dateString) return '--'
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    const isAISelecting = ref(false)
    
    const showAISelectionConfirm = () => {
      aiSelectionModalVisible.value = true
    }

    const handleAISelection = async () => {
      isAISelecting.value = true;
      try {
        const response = await api.generatePlanningAI();
        if (response && response.code === 200) {
          message.success('AI keyword selection task submitted successfully');
          // 关闭弹窗
          aiSelectionModalVisible.value = false;
          
          const statusResponse = await checkOutlineGenerationStatus();
        
          if (!statusResponse?.data || statusResponse.data.status !== 'finished') {
            startPolling();
          }
        } else if (response && response.code === 429) {
          // 处理 429 错误（在响应体中）
          Modal.info({
            title: 'AI Autopilot is already running',
            content: h('div', {}, [
              h('p', 'An AI Autopilot task is already in progress.'),
              h('p', 'Please wait for the current task to complete before starting a new one.'),
              h('p', { style: 'margin-top: 16px; color: #1890ff;' }, 
                'You can check the progress in the review outlines tab.')
            ]),
            okText: 'OK',
            maskClosable: true
          });
        } else {
          // 处理其他响应错误
          message.error(response?.message || 'AI keyword selection failed, please try again later.');
        }
      } catch (error) {
        // 检查错误响应
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.code === 429 && errorData.message === "auto pilot outline already started") {
            // 显示友好的提示信息
            Modal.info({
              title: 'AI Autopilot is already running',
              content: h('div', {}, [
                h('p', 'An AI Autopilot task is already in progress.'),
                h('p', 'Please wait for the current task to complete before starting a new one.'),
                h('p', { style: 'margin-top: 16px; color: #1890ff;' }, 
                  'You can check the progress in the review outlines tab.')
              ]),
              okText: 'Got it',
              maskClosable: true
            });
          } else {
            // 其他错误
            message.error(errorData.message || 'AI keyword selection failed, please try again later.');
          }
        } else {
          // 一般错误
          message.error('AI keyword selection failed, please try again later.');
        }
      } finally {
        isAISelecting.value = false;
        // 确保弹窗关闭
        aiSelectionModalVisible.value = false;
      }
    };

    const handleGenerateOutlinePlan = () => {
      if (totalSelectedKeywords.value === 0) {
        Modal.confirm({
          title: 'No Keywords Selected',
          content: h('div', {}, [
            h('p', 'You need to select at least one keyword to generate content plans.'),
            h('p', { style: 'margin-top: 12px;' }, [
              'Would you like to:',
              h('ul', { style: 'margin-top: 8px;' }, [
                h('li', 'Select keywords manually, or'),
                h('li', 'Use AI to automatically select keywords and generate outlines')
              ])
            ])
          ]),
          okText: 'Auto Generate with AI',
          cancelText: 'Select Manually',
          onOk: () => {
            showAISelectionConfirm();
          },
          onCancel: () => {
            currentStep.value = '0'; // Go back to keyword selection step
          }
        });
        return;
      }
      
      generateContentPlan();
    };

    const isLoadingTaskInfo = ref(false)
    const historyModalVisible = ref(false)
    const isLoadingHistory = ref(false)
    const historyBatches = ref([])
    const historyRecords = ref([])
    const selectedBatchNo = ref(null)

    const batchesPagination = ref({
      current: 1,
      pageSize: 15,
      total: 0
    })

    const recordsPagination = ref({
      current: 1, 
      pageSize: 15,
      total: 0
    })

    const batchesColumns = [
      {
        title: 'Batch No.',
        dataIndex: 'batchNo',
        key: 'batchNo',
        width: '25%'
      },
      {
        title: 'Keywords',
        dataIndex: 'keywordCount',
        key: 'keywordCount',
        width: '15%'
      },
      {
        title: 'Source',
        dataIndex: 'source',
        key: 'source',
        width: '15%',
        customRender: ({ text }) => text.toUpperCase()
      },
      {
        title: 'Status',
        dataIndex: 'generator_status',
        key: 'generator_status',
        width: '15%',
        customRender: ({ text }) => text.charAt(0).toUpperCase() + text.slice(1)
      },
      {
        title: 'Created',
        dataIndex: 'created',
        key: 'created',
        width: '20%',
        customRender: ({ text }) => formatTime(text)
      },
      {
        title: 'Action',
        key: 'action',
        width: '10%'
      }
    ]

    const recordsColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '30%'
      },
      {
        title: 'Type',
        dataIndex: 'keywordType',
        key: 'keywordType',
        width: '15%',
        customRender: ({ text }) => text.charAt(0).toUpperCase() + text.slice(1)
      },
      {
        title: 'Created',
        dataIndex: 'created',
        key: 'created',
        width: '25%',
        customRender: ({ text }) => formatTime(text)
      }
    ]

    const getHistoryStatusColor = (status) => {
      const statusColors = {
        processing: 'blue',
        completed: 'green',
        failed: 'red'
      }
      return statusColors[status] || 'default'
    }

    const loadHistoryBatches = async (page = 1) => {
      isLoadingHistory.value = true
      try {
        const response = await api.getPlanningOutlineBatches({
          page,
          limit: batchesPagination.value.pageSize
        })
        
        if (response?.data) {
          historyBatches.value = response.data
          batchesPagination.value.total = response.totalCount || 0
        }
      } catch (error) {
        console.error('Failed to load batch history:', error)
        message.error('Failed to load history')
      } finally {
        isLoadingHistory.value = false
      }
    }

    const loadBatchRecords = async (batchNo, page = 1) => {
      isLoadingHistory.value = true
      try {
        const response = await api.getPlanningOutlineBatchRecord({
          batchNo,
          page,
          limit: recordsPagination.value.pageSize
        })
        
        if (response?.data) {
          historyRecords.value = response.data
          recordsPagination.value.total = response.totalCount
        }
      } catch (error) {
        console.error('Failed to load batch records:', error)
        message.error('Failed to load records')
      } finally {
        isLoadingHistory.value = false
      }
    }

    const showHistoryModal = async () => {
      historyModalVisible.value = true
      batchesPagination.value.current = 1
      await loadHistoryBatches(1)
    }

    const viewBatchDetail = async (batchNo) => {
      selectedBatchNo.value = batchNo
      recordsPagination.value.current = 1
      await loadBatchRecords(batchNo, 1)
    }

    const backToBatchList = () => {
      selectedBatchNo.value = null
      historyRecords.value = []
    }

    const handleBatchesPaginationChange = async (page) => {
      batchesPagination.value.current = page
      await loadHistoryBatches(page)
    }

    const handleRecordsPaginationChange = async (page) => {
      recordsPagination.value.current = page
      await loadBatchRecords(selectedBatchNo.value, page)
    }

    const closeHistoryModal = () => {
      historyModalVisible.value = false
      selectedBatchNo.value = null
      historyBatches.value = []
      historyRecords.value = []
    }

    const selectedContentPlans = ref([])
    const isLoadingSelectedOutlines = ref(false)
    const selectedPlansPagination = ref({
      current: 1,
      pageSize: 12,
      total: 0
    })

    const fetchSelectedContentPlans = async () => {
      if (isLoadingSelectedOutlines.value) return
      
      isLoadingSelectedOutlines.value = true
      try {
        const response = await api.getPlanningOutlines({
          status: 'selected',
          page: selectedPlansPagination.value.current,
          limit: selectedPlansPagination.value.pageSize
        })
        
        if (response?.data) {
          selectedContentPlans.value = response.data.map(plan => ({
            ...plan,
            selected: false,
            favorited: true // 已选中的内容计划默认为 favorited
          }))
          selectedPlansPagination.value.total = response.totalCount || 0
        }
      } catch (error) {
        console.error('Failed to fetch selected content plans:', error)
        message.error('Failed to get selected content plans')
      } finally {
        isLoadingSelectedOutlines.value = false
      }
    }

    const handleSelectedPlansPaginationChange = async (page, pageSize) => {
      selectedPlansPagination.value.current = page
      selectedPlansPagination.value.pageSize = pageSize
      await fetchSelectedContentPlans()
    }

    // Add reactive variables for edit states
    const isEditingTitle = ref(false)
    const isEditingDesc = ref(false)
    
    // Start editing title
    const startEditingTitle = () => {
      isEditingTitle.value = true
      nextTick(() => {
        document.querySelector('.title-input')?.focus()
      })
    }
    
    // Start editing description
    const startEditingDesc = () => {
      isEditingDesc.value = true
      nextTick(() => {
        document.querySelector('.description-input')?.focus()
      })
    }
    
    // Save title
    const saveTitle = async () => {
      if (!selectedPlan.value) return
      
      try {
        await api.updatePlanningOutline(selectedPlan.value.outlineId, {
          title: selectedPlan.value.title
        })
        message.success('Title updated successfully')
        isEditingTitle.value = false
      } catch (error) {
        console.error('Failed to update title:', error)
        message.error('Failed to update title')
      }
    }
    
    // Save description
    const saveDescription = async () => {
      if (!selectedPlan.value) return
      
      try {
        await api.updatePlanningOutline(selectedPlan.value.outlineId, {
          description: selectedPlan.value.description
        })
        message.success('Description updated successfully')
        isEditingDesc.value = false
      } catch (error) {
        console.error('Failed to update description:', error)
        message.error('Failed to update description')
      }
    }

    const keywordSelectionMode = ref('ai')
    const importedKeywords = ref([])
    const importedKeywordsPagination = ref({
      current: 1,
      pageSize: 15,
      total: 0
    })
    const importedKeywordsColumns = [
      {
        title: 'Keyword',
        dataIndex: 'keyword',
        key: 'keyword',
        width: '20%'
      },
      {
        title: 'Source',
        dataIndex: 'keywordType',
        key: 'keywordType',
        width: '10%',
        customRender: ({ text }) => {
          const sourceMap = {
            'absence': 'Absence',
            'semrush': 'SEMrush',
            'ahrefs': 'Ahrefs',
            'google': 'Google',
            'manual': 'Manual',
            'import': 'Import'
          }
          return sourceMap[text?.toLowerCase()] || text
        }
      },
      {
        title: 'KD',
        dataIndex: 'kd',
        key: 'kd',
        width: '10%'
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        width: '15%'
      },
      {
        title: 'Related Outlines',
        key: 'relatedOutlines',
        width: '20%',
        customRender: () => '-'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '10%'
      }
    ]

    const handleImportedKeywordsPaginationChange = ({ current }) => {
      importedKeywordsPagination.value.current = current
      fetchImportedKeywords()
    }

    const handleFileUpload = async ({ file }) => {
      // 验证文件类型
      const isCSV = file.type === 'text/csv';
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.type === 'application/vnd.ms-excel';
                      
      if (!isCSV && !isExcel) {
        message.error('Please upload CSV or Excel file only');
        return;
      }

      // 验证文件大小 (例如限制为10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        // 显示上传中的loading
        const uploadingMessage = message.loading({
          content: 'Uploading...',
          duration: 0,
          key: 'uploadingKeywords'
        });

        const response = await api.importKeywords(formData);
        
        // 关闭loading消息
        message.destroy('uploadingKeywords');

        // 检查响应状态
        if (response?.code === 200 || response?.status === 'success') {
          message.success({
            content: `Successfully imported ${response?.data?.count || ''} keywords`,
            duration: 3
          });
          
          // 刷新导入的关键词列表
          await fetchImportedKeywords();
        } else {
          throw new Error(response?.message || 'Import failed');
        }
      } catch (error) {
        console.error('File upload failed:', error);
        message.error({
          content: error.message || 'Failed to import keywords, please try again',
          duration: 3
        });
      }
    };

    const downloadTemplate = async () => {
      try {
        message.loading({ content: 'Preparing template download...', key: 'downloadTemplate' })
        
        const templateUrl = '/templates/keywords-import-template.xlsx'
        const response = await fetch(templateUrl)
        
        if (!response.ok) {
          throw new Error('Template download failed')
        }
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'keywords-import-template.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        message.success({ content: 'Template downloaded successfully!', key: 'downloadTemplate' })
      } catch (error) {
        console.error('Template download failed:', error)
        message.error({ content: 'Failed to download template, please try again', key: 'downloadTemplate' })
      }
    }

    const showTemplateInfo = () => {
      Modal.info({
        title: 'Template Guide',
        content: h('div', { class: 'template-guide' }, [
          h('div', { class: 'guide-section' }, [
            h('h4', { style: 'margin-bottom: 12px; color: #1890ff;' }, '📋 Required Columns'),
            h('div', { class: 'column-info' }, [
              h('strong', 'Keyword'),
              h('span', ' - The target keyword you want to analyze')
            ])
          ]),
          
          h('div', { class: 'guide-section', style: 'margin-top: 16px;' }, [
            h('h4', { style: 'margin-bottom: 12px; color: #52c41a;' }, '📊 Optional Metrics'),
            h('ul', { style: 'list-style: none; padding: 0;' }, [
              h('li', { style: 'margin-bottom: 8px;' }, [
                h('strong', 'KD (Keyword Difficulty) '),
                h('span', '- Indicates ranking competition level')
              ]),
              h('li', { style: 'margin-bottom: 8px;' }, [
                h('strong', 'Volume '),
                h('span', '- Monthly search volume')
              ]),
              h('li', { style: 'margin-bottom: 8px;' }, [
                h('strong', 'CPC '),
                h('span', '- Average cost per click')
              ])
            ])
          ]),
          
          h('div', { class: 'guide-section', style: 'margin-top: 16px;' }, [
            h('h4', { style: 'margin-bottom: 12px; color: #faad14;' }, '⚠️ Important Notes'),
            h('ul', { style: 'list-style: none; padding: 0;' }, [
              h('li', { style: 'margin-bottom: 8px; display: flex; align-items: center;' }, [
                h('span', { style: 'color: #1890ff; margin-right: 8px;' }, '•'),
                h('span', 'Keep the column headers unchanged in row 1')
              ]),
              h('li', { style: 'margin-bottom: 8px; display: flex; align-items: center;' }, [
                h('span', { style: 'color: #1890ff; margin-right: 8px;' }, '•'),
                h('span', 'Enter one keyword per row')
              ]),
              h('li', { style: 'margin-bottom: 8px; display: flex; align-items: center;' }, [
                h('span', { style: 'color: #1890ff; margin-right: 8px;' }, '•'),
                h('span', 'Maximum 1,000 keywords per import')
              ])
            ])
          ]),
          
          h('div', { class: 'guide-section', style: 'margin-top: 16px; background: #f6ffed; padding: 12px; border-radius: 4px;' }, [
            h('h4', { style: 'margin-bottom: 8px; color: #52c41a;' }, '💡 Pro Tips'),
            h('p', { style: 'margin: 0; color: #555;' }, [
              'For best results, include as many metrics as possible. This helps our AI better understand your keywords and generate more accurate content plans.'
            ])
          ])
        ]),
        width: 600,
        maskClosable: true,
        okText: 'Got it'
      })
    }
    const bulkKeywords = ref('')
    const bulkInputVisible = ref(false)
    const isUpdatingKeywords = ref(false)
    // 从已选关键词中获取可用的关键词选项
    const availableKeywords = computed(() => {
      return selectedKeywordsData.value.map(keyword => ({
        label: keyword.keyword,
        value: keyword.keyword,
        krs: keyword.krs,
        kd: keyword.kd,
        volume: keyword.volume
      }))
    })

    // 处理关键词变化
    const handleKeywordsChange = async (newKeywords) => {
      if (!selectedPlan.value) return
      selectedPlan.value.keywords = newKeywords
    }

    // 保存关键词更新
    const saveKeywords = async () => {
      if (!selectedPlan.value || isUpdatingKeywords.value) return
      
      // 确保至少选择了一个关键词
      if (!selectedPlan.value.keywords || selectedPlan.value.keywords.length === 0) {
        message.warning('Please select at least one keyword')
        selectedPlan.value.keywords = [...selectedPlan.value.originalKeywords] || []
        return
      }
      
      try {
        isUpdatingKeywords.value = true
        
        // 将关键词数组转换为逗号分隔的字符串，不带空格
        const keywordsString = selectedPlan.value.keywords.join(',')
        await api.updatePlanningOutline(selectedPlan.value.outlineId, {
          keywords: keywordsString
        })
        
        selectedPlan.value.originalKeywords = [...selectedPlan.value.keywords]
        message.success('Keywords updated successfully')
      } catch (error) {
        console.error('Failed to update keywords:', error)
        message.error('Failed to update keywords')
        selectedPlan.value.keywords = [...selectedPlan.value.originalKeywords] || []
      } finally {
        isUpdatingKeywords.value = false
      }
    }

    // 根据关键词的 KRS 值设置标签颜色
    const getKeywordTagColor = (keyword) => {
      const keywordData = selectedKeywordsData.value.find(k => k.keyword === keyword)
      if (!keywordData) return ''
      
      const krs = parseFloat(keywordData.krs)
      if (krs >= 8) return 'red'
      if (krs >= 6) return 'orange'
      if (krs >= 4) return 'blue'
      return 'default'
    }

    // 添加新的处理函数
    const handleChange = () => {
      // 使用防抖来延迟保存，避免频繁调用
      if (window.saveKeywordsTimeout) {
        clearTimeout(window.saveKeywordsTimeout)
      }
      window.saveKeywordsTimeout = setTimeout(() => {
        saveKeywords()
      }, 500)
    }

    // 处理失焦事件
    const handleBlur = () => {
      if (window.saveKeywordsTimeout) {
        clearTimeout(window.saveKeywordsTimeout)
      }
      saveKeywords()
    }

    // 在组件卸载时清理定时器
    onUnmounted(() => {
      if (window.saveKeywordsTimeout) {
        clearTimeout(window.saveKeywordsTimeout)
      }
    })

    const handleModeChange = async (mode) => {
      if (mode === 'manual') {
        // 当切换到manual模式时，加载imported keywords
        await fetchImportedKeywords()
      }
    }

    const fetchImportedKeywords = async () => {
      try {
        const response = await api.getPlanningKeywords({
          source: 'import',
          page: importedKeywordsPagination.value.current,
          limit: importedKeywordsPagination.value.pageSize
        })
        
        if (response?.data) {
          importedKeywords.value = response.data.map(transformKeywordData)
          importedKeywordsPagination.value.total = response.totalCount || 0
        }
      } catch (error) {
        console.error('Failed to fetch imported keywords:', error)
        message.error('Failed to load imported keywords')
      }
    }

    // 在 setup 中添加计算属性
    const getAIButtonTooltip = computed(() => {
      if (isGenerating.value) {
        return "Please wait until the current content generation is complete"
      }
      if (outlineGenerationStatus.value === 'processing') {
        return "AI is currently processing your request. Please wait until it's finished"
      }
      return "Use AI to automatically select and analyze keywords"
    })

    const handleSinglePageGeneration = async (outline) => {
      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: outline.hasRelatedPageTask ? 'Warning: Page Already Exists' : 'Generate Single Page',
          content: h('div', {}, [
            // Warning message for existing page
            outline.hasRelatedPageTask && h('div', {
              style: 'margin-bottom: 16px; padding: 12px; background: #fff2f0; border: 1px solid #ffccc7; border-radius: 4px;'
            }, [
              h('div', { style: 'display: flex; align-items: center; margin-bottom: 8px;' }, [
                h(WarningOutlined, { style: 'color: #ff4d4f; margin-right: 8px;' }),
                h('span', { style: 'color: #ff4d4f; font-weight: 500;' }, 'This outline already has a generated page')
              ]),
              h('p', { style: 'margin: 0; color: #666;' }, 
                'Generating a new page will create a duplicate. The existing page will remain unchanged. Please ensure this is intended.'
              )
            ]),
            
            // Basic information
            h('p', 'You are about to generate a page for:'),
            h('div', { 
              style: 'margin: 16px 0; padding: 12px; background: #f5f5f5; border-radius: 4px;'
            }, [
              h('strong', outline.title),
              h('div', { style: 'margin-top: 8px; color: #666;' }, [
                h('span', `Type: ${outline.pageType}`),
              ])
            ]),
            
            h('p', { style: 'margin-top: 12px;' }, 
              'Would you like to proceed with page generation?'
            )
          ]),
          okText: outline.hasRelatedPageTask ? 'Generate Anyway' : 'Generate',
          cancelText: 'Cancel',
          width: 500,
          okButtonProps: {
            type: outline.hasRelatedPageTask ? 'danger' : 'primary',
            danger: outline.hasRelatedPageTask
          },
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      try {
        isGeneratingPages.value = true;
        message.loading('Submitting page generation task...');

        await api.createAIPage(outline.outlineId);

        message.success('Page generation task submitted successfully!');
        
        // Refresh the outline list to update status
        await fetchContentPlans();

      } catch (error) {
        console.error('Page generation failed:', error);
        message.error(error.message || 'Failed to submit page generation task');
      } finally {
        isGeneratingPages.value = false;
      }
    };

    const getPageTypeColor = (pageType) => {
      const typeColors = {
        'Blog': 'blue',
        'Landing Page': 'green'
      };
      return typeColors[pageType] || 'default';
    };

    const aiSelectionModalVisible = ref(false)

    // 筛选表单数据
    const filterForm = ref({
      priority: '1',  // 设置默认值为 '1'
      kdMin: null,
      kdMax: null,
      volumeMin: null,
      volumeMax: null,
      hasOutlines: null,
      searchTerm: ''
    })
    
    // 统一的关键词分页
    const keywordsPagination = ref({
      current: 1,
      pageSize: 15,
      total: 0
    });
    
    // 关键词数据
    const filteredKeywords = ref([]);
    
    const applyFilters = async () => {
      recommendedPagination.value.current = 1
      
      const priorityValue = filterForm.value.priority
      const searchTerm = filterForm.value.searchTerm // 获取搜索词
      await fetchKeywords(priorityValue, 1, recommendedPagination.value.pageSize, searchTerm);
    }
    
    const handleKeywordsPaginationChange = (pagination) => {
      recommendedPagination.value.current = pagination.current;
      recommendedPagination.value.pageSize = pagination.pageSize;
      const priorityValue = filterForm.value.priority
      fetchKeywords(
        priorityValue, 
        pagination.current, 
        pagination.pageSize
      );
    };
    
    onMounted(() => {
      fetchKeywords();
    });
    
    // 返回新增的响应式变量和方法
    return {
      taskStartTime,
      taskEndTime,
      taskDescription,
      showSelectedKeywords,
      selectedKeywords,
      overviewData,
      clearSelection,
      overviewStats: ref(overviewStats),
      priorities,
      recommendedKeywords,
      savedPresets: ref(savedPresets),
      columns,
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
      showSelectedModal,
      handleModalClose,
      getKeywordsByPriority,
      isGenerating,
      isGeneratingTitles,
      isGeneratingOutline,
      hasGenerated,
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
      handleComparisonPaginationChange,
      currentPriority,
      handleTabChange,
      contentPlans,
      selectedPlansCount,
      generateContentPlan,
      handlePlanSelect,
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
      formatTaskDescription,
      confirmClearAllOutlines,
      pollingInterval,
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
      keywordsTableColumns,
      getTypeColor,
      activeCollapseKeys,
      bannerTheme,
      getStatusTagColor,
      statusColor,
      formatOutlineTree,
      formatDate,
      isAISelecting,
      showAISelectionConfirm,
      handleAISelection,
      handleGenerateOutlinePlan,
      getProgressStatus,
      isLoadingTaskInfo,
      historyModalVisible,
      historyBatches,
      historyRecords,
      selectedBatchNo,
      batchesPagination,
      recordsPagination,
      batchesColumns,
      recordsColumns,
      isLoadingHistory,
      showHistoryModal,
      closeHistoryModal,
      getHistoryStatusColor,
      loadHistoryBatches,
      loadBatchRecords,
      handleBatchesPaginationChange,
      handleRecordsPaginationChange,
      viewBatchDetail,
      backToBatchList,
      selectedContentPlans,
      isLoadingSelectedOutlines,
      selectedPlansPagination,
      fetchSelectedContentPlans,
      handleSelectedPlansPaginationChange,
      isEditingTitle,
      isEditingDesc,
      startEditingTitle,
      startEditingDesc,
      saveTitle,
      saveDescription,
      keywordSelectionMode,
      importedKeywords,
      importedKeywordsPagination,
      importedKeywordsColumns,
      handleImportedKeywordsPaginationChange,
      handleFileUpload,
      downloadTemplate,
      bulkKeywords,
      bulkInputVisible,
      isUpdatingKeywords,
      availableKeywords,
      handleKeywordsChange,
      saveKeywords,
      getKeywordTagColor,
      handleChange,
      handleBlur,
      handleModeChange,
      fetchImportedKeywords,
      showTemplateInfo,
      getAIButtonTooltip,
      handleSinglePageGeneration,
      getPageTypeColor,
      aiSelectionModalVisible,
      filterForm,
      keywordsPagination,
      filteredKeywords,
      applyFilters,
      handleKeywordsPaginationChange,
      fetchKeywords
    }
  },
  created() {
    // 使用 mitt 或其他事件总线库，或者直接使用 provide/inject
    // 这里我们使用一个简单的方法，将方法暴露到全局
    if (this.$root) {
      this.$root.$switchKeywordsStep = this.switchToStep;
      this.$root.$showAISelectionConfirm = this.showAISelectionConfirm; // 添加这一行
    }
  },
  methods: {
    switchToStep(step) {
      if (step === 'selection') {
        this.currentStep = '0'; // 注意这里使用字符串 '0' 而不是数字 0
      } else if (step === 'outline') {
        this.currentStep = '1'; // 注意这里使用字符串 '1' 而不是数字 1
      }
    }
  },
  beforeDestroy() {
    // 清理全局引用
    if (this.$root) {
      if (this.$root.$switchKeywordsStep) {
        delete this.$root.$switchKeywordsStep;
      }
      if (this.$root.$showAISelectionConfirm) { // 添加这一行
        delete this.$root.$showAISelectionConfirm;
      }
    }
  }
})
</script>

<style scoped>
/* 只添加这一段新代码来防止滚动条闪烁，其余保持原样 */
html {
  /* 始终显示滚动条，防止滚动条出现/消失导致的布局变化 */
  overflow-y: scroll;
  /* 防止水平滚动 */
  overflow-x: hidden;
}

/* 确保内容区域宽度固定，不会因为滚动条出现而变化 */
.main-content {
  box-sizing: border-box;
  max-width: 100%;
  /* 防止内容溢出导致水平滚动 */
  overflow-x: hidden;
}

/* 以下是原有样式，保持不变 */
.planning-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (max-width: 768px) {
  .steps-navigation-horizontal {
    padding: 12px;
  }
  
  .step-number-horizontal {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }
  
  .step-title-horizontal {
    font-size: 14px;
  }
  
  .step-desc-horizontal {
    font-size: 12px;
  }
}

.main-content {
  width: 100%;
}

.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 修复图标和文字对齐 */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.action-button :deep(.anticon) {
  display: flex;
  align-items: center;
}

/* 超级炫彩生成按钮 */
.generate-pages-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  border: none;
  padding: 6px 16px;
  height: 32px;
  box-shadow: 0 2px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.generate-pages-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #40a9ff 0%, #854eca 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

.generate-pages-btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.generate-pages-btn:disabled {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.25);
}

/* 确保图标在禁用状态下也保持居中 */
.generate-pages-btn :deep(.anticon) {
  display: flex;
  align-items: center;
}

.outline-stats {
  color: #666;
  font-size: 13px;
  margin-right: 24px;
}

.outlines-header {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.selected-count {
  margin-left: 8px;
  color: #666;
  font-size: 13px;
}

.content-plan-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.content-plan-tabs :deep(.ant-tabs-tab) {
  padding: 12px 24px;
}

.content-plan-tabs :deep(.ant-tabs-tab-active) {
  background: #f0f7ff;
}

.step-panel {
  width: 100%;
}

/* 新增按钮样式 */
.select-btn {
  color: #1890ff;
  border-color: #1890ff;
}

.select-btn:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

.deselect-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.deselect-btn:hover {
  color: #ff7875;
  border-color: #ff7875;
}

/* 新增错误状态样式 */
.error-status :deep(.ant-alert-message) {
  width: 100%;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.task-status {
  font-size: 15px;
  font-weight: 500;
  color: #ff4d4f;
}

.workflow-tag {
  border-radius: 4px;
  font-size: 12px;
  padding: 2px 8px;
  margin-left: 8px;
}

.timing-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.time-label {
  color: #666;
}

.time-value {
  color: #8c8c8c;
  font-family: monospace;
}

.error-icon :deep(svg) {
  color: #ff4d4f;
  font-size: 18px;
  margin-top: 2px;
}

.task-alert.error-status :deep(.ant-alert) {
  background: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  padding: 12px 16px;
}

.analysis-loading-card {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.preparing-analysis-content {
  text-align: center;
}

.analysis-icon {
  font-size: 48px;
  color: #2563eb;
  margin-bottom: 24px;
}

.analysis-title {
  color: #1e293b;
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.analysis-description {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 32px;
}

.platform-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
  margin: 0 6px;
}

.semrush { background: #f0f4ff; color: #3b82f6; }
.ahrefs { background: #e6f6ff; color: #0ea5e9; }
.google { background: #fff3cd; color: #ffc107; }
.social { background: #d3f2c5; color: #28a745; }

.loading-tips {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tip-icon {
  color: #f59e0b;
}

.tip-text {
  color: #64748b;
  font-size: 14px;
}

/* 添加 centered-spin 样式 */
:deep(.centered-spin) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.centered-spin :deep(.ant-spin-spinning) {
  max-height: none;
}

.content-plans-grid {
  display: none; /* 隐藏原有的卡片网格 */
}

.content-plans-table {
  width: 100%;
  margin-bottom: 24px;
}

.content-plans-table :deep(.ant-table-thead > tr > th) {
  background: #f5f7fa;
  font-weight: 500;
}

.content-plans-table :deep(.ant-table-row:hover) {
  cursor: pointer;
}

.content-plans-table :deep(.ant-table-row-selected) {
  background: #e6f7ff;
}

.content-plans-table :deep(.ant-table-cell) {
  vertical-align: middle;
}

.outline-title {
  font-weight: 500;
  color: #1f2937;
}

.outline-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 300px;
}

.outline-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.plan-card {
  width: 100%;
  min-width: 300px;
  max-width: 100%;
  margin-bottom: 0;
  
  .card-content {
    overflow: hidden;
  }
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.card-actions {
  display: flex;
  gap: 8px;
}

.plan-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plan-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plan-metrics {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  align-items: center;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.metric-item .anticon {
  font-size: 14px;
  color: #8c8c8c;
}

.metric-item .ant-tag {
  margin-right: 0;
  text-transform: capitalize;
}

.plan-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.plan-keywords :deep(.ant-tag) {
  margin: 0;
  border-radius: 4px;
}

.more-tag {
  background: #f3f4f6;
  border: none;
  color: #6b7280;
}

.content-plans-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.loading-text {
  color: #8c8c8c;
  font-size: 14px;
  margin-left: 8px;
}

.outline-drawer :deep(.ant-drawer-body) {
  padding: 8px; /* 从 24px 缩小到 8px */
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
}

.drawer-section {
  margin-bottom: 4px; /* 进一步缩小区块之间的垂直间距 */
  padding: 8px;        /* 内边距也由之前 12px 减小到 8px */
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.drawer-section .section-title {
  margin-bottom: 4px; /* 标题与下方内容之间的间距进一步缩小 */
}

.drawer-section .info-item {
  margin-bottom: 4px; /* 各信息项之间的间距也进一步减小 */
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
}

.content-description {
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.outline-tree {
  background: #f9fafb;
  border-radius: 6px;
  padding: 16px;
}

.tree-node-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 16px;
}

.word-count {
  font-size: 12px;
  color: #6b7280;
}

.drawer-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.custom-collapse {
  background: transparent;
}

.custom-collapse :deep(.ant-collapse-item) {
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px !important;
  overflow: hidden;
}

.custom-collapse :deep(.ant-collapse-header) {
  font-weight: 600;
  background: #f9fafb;
}

.section-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-key {
  color: #6b7280;
  font-weight: 500;
  min-width: 100px;
}

.info-value {
  color: #1f2937;
}

.section-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.subsections {
  margin-top: 16px;
  border-top: 1px dashed #e5e7eb;
  padding-top: 16px;
}

.subsection-item {
  background: #f9fafb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subsection-title {
  font-weight: 500;
  color: #374151;
}

.subsection-wordcount {
  font-size: 12px;
  color: #6b7280;
}

.subsection-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subsection-focus,
.subsection-keywords {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.drawer-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.section-wordcount {
  font-size: 13px;
  color: #6b7280;
  font-weight: normal;
}

.keyword-distribution {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.keyword-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.keyword-count {
  color: #6b7280;
  font-size: 13px;
}

.subsection-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subsection-item {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.subsection-number {
  color: #6b7280;
  font-weight: 500;
  min-width: 24px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-key {
  color: #6b7280;
  font-weight: 500;
}

.custom-collapse :deep(.ant-collapse-header) {
  padding: 16px !important;
}

.custom-collapse :deep(.ant-collapse-content-box) {
  padding: 0 20px 20px 20px !important;
}
.task-alert {
  margin-bottom: 16px;
}

.card-extra {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recommended-times {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 11px;
  white-space: nowrap;
  cursor: help;
}

.time-item :deep(.anticon) {
  font-size: 11px;
}

.plan-card :deep(.ant-card-extra) {
  padding: 0;
  margin: 0;
  width: 100%; /* Make extra section full width */
  display: flex;
  justify-content: space-between;
}

.card-extra {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.recommended-times {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
  flex: 1; /* Take up remaining space */
}

.time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 11px;
  white-space: nowrap;
  cursor: help;
}

.time-item :deep(.anticon) {
  font-size: 11px;
}

/* Ensure button stays on the right */
.card-extra .ant-btn {
  flex-shrink: 0;
}

.ai-select-btn {
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  border: none;
  margin-left: -1px; /* Fix border overlap with group */
  color: #ffffff !important; /* Force white text */
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ai-select-btn:hover {
  background: linear-gradient(135deg, #40a9ff 0%, #854eca 100%);
  opacity: 0.9;
}

.ai-select-btn:active {
  background: linear-gradient(135deg, #096dd9 0%, #531dab 100%);
  border: none;
  color: #ffffff !important;
}

/* Ensure icon is also white */
.ai-select-btn :deep(.anticon) {
  color: #ffffff;
  display: flex;
  align-items: center;
}

.empty-outlines-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #fafafa;
  border-radius: 8px;
}

.empty-content {
  text-align: center;
  padding: 32px;
}

.empty-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.empty-content h3 {
  font-size: 20px;
  color: #262626;
  margin-bottom: 8px;
}

.empty-content p {
  color: #8c8c8c;
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  overflow: visible !important; /* 确保溢出内容可见 */
  justify-content: center; /* 确保按钮居中 */
}

/* AI Autopilot 按钮样式 */
.generate-btn {
  background: linear-gradient(-45deg, #2563eb, #7c3aed, #2563eb);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  border: none;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3),
              0 0 20px rgba(37, 99, 235, 0.2),
              inset 0 0 8px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  color: white !important;  /* 添加 !important */
}

.generate-btn :deep(span) {  /* 添加这个选择器 */
  color: white !important;
}

.generate-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4),
              0 0 30px rgba(37, 99, 235, 0.3),
              inset 0 0 12px rgba(255, 255, 255, 0.3);
}

.generate-btn:active {
  transform: translateY(1px) scale(0.98);
}

.generate-btn:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  transform: rotate(45deg);
  animation: shine 3s infinite;
  pointer-events: none;
}

.generate-btn :deep(.anticon) {
  font-size: 18px;
  margin-right: 8px;
  animation: pulse 2s infinite;
}

/* 加载状态特效 */
.generate-btn:loading {
  background: linear-gradient(-45deg, #64748b, #94a3b8, #64748b);
  animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes shine {
  0% { transform: rotate(45deg) translateY(-100%); }
  100% { transform: rotate(45deg) translateY(100%); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 添加新的样式 */
.navigation-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.help-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.3s;
  font-size: 11px;  /* 保持一致的文字大小 */
}

.help-button:hover {
  background: #f0f7ff;
  border-color: #2563eb;
  color: #2563eb;
}

.history-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;  /* 减小图标和文字的间距 */
  height: 36px;  /* 稍微降低按钮高度 */
  border-radius: 8px;
  transition: all 0.3s;
  font-size: 11px;  /* 减小文字大小 */
}

.history-button:hover {
  background: #f0f7ff;
  border-color: #2563eb;
  color: #2563eb;
}

.history-content {
  margin: -24px;
}

.history-content :deep(.ant-table-pagination) {
  margin: 16px 24px;
}

.history-content {
  .back-header {
    margin-bottom: 16px;
  }
}

/* 工具栏中的 generate-btn 特殊调整 */
.action-button.generate-btn {
  height: 32px !important;
  padding: 0 16px !important;
  border-radius: 6px !important;
}

.action-button.generate-btn :deep(.anticon) {
  font-size: 14px;
  margin-right: 6px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  padding: 6px 8px;
  background: white;
  border-radius: 6px;
  font-size: 12px;
}

.benefit-item :deep(.anticon) {
  color: #2563eb;
  font-size: 14px;
  background: rgba(37, 99, 235, 0.08);
  padding: 4px;
  border-radius: 4px;
}

.priority-legend {
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.legend-item {
  background: white;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
}

.legend-desc {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.3;
}

.priority-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 确保表格分页样式统一 */
:deep(.ant-pagination-options) {
  display: none;
}

/* 添加新的样式 */
.editable-title,
.editable-description {
  position: relative;
  margin-bottom: 4px; /* 将原来的间距从 16px 缩小到 4px */
}

.title-display,
.description-display {
  position: relative;
  padding: 4px 6px; /* 将内边距从 8px 缩小到 4px（垂直）和 6px（水平） */
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.title-display:hover,
.description-display:hover {
  background: #f9f9f9;
}

.edit-icon {
  right: 4px;      /* 缩小图标与右侧的距离 */
  font-size: 12px; /* 缩小图标尺寸 */
}

.title-input,
.description-input {
  margin-bottom: 8px;
}

.description-display {
  min-height: 60px;
}

.description-display p {
  margin: 0;
  padding-right: 24px;
}

.mode-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.mode-tabs :deep(.ant-tabs-tab) {
  padding: 12px 24px;
}

.mode-tabs :deep(.ant-tabs-tab-active) {
  background: #f0f7ff;
}

.manual-import-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.import-methods-card {
  .import-method-item {
    border-radius: 8px;
    
    .method-header {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .method-desc {
        flex-grow: 1;
        color: #8c8c8c;
        margin: 0; 
      }
      
      .method-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        white-space: nowrap;
      }
    }
  }
}

.imported-keywords-card {
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .keyword-count {
      color: #8c8c8c;
    }
  }
}

.bulk-input-container {
  .bulk-input-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: #8c8c8c;
    
    .anticon {
      color: #1890ff;
    }
  }
}

.drawer-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-item {
    margin-bottom: 16px;

    .info-label {
      display: block;
      color: #8c8c8c;
      margin-bottom: 8px;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
  }

  .editable-title,
  .editable-description {
    position: relative;
    
    .edit-icon {
      opacity: 0;
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      transition: opacity 0.2s;
    }

    &:hover .edit-icon {
      opacity: 1;
    }
  }

  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.drawer-section .ant-select {
  margin-top: 8px;
}

:deep(.ant-select-dropdown) {
  .ant-select-item-option-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .keyword-metrics {
    font-size: 12px;
    color: #8c8c8c;
    
    span {
      margin-left: 8px;
      
      &:first-child {
        margin-left: 0;
      }
    }
  }
}

/* 添加加载状态显示 */
.loading-keywords {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #fafafa;
  border-radius: 8px;
}

.loading-content {
  text-align: center;
  padding: 32px;
}

.loading-text {
  color: #8c8c8c;
  font-size: 14px;
  margin-top: 16px;
}

.selected-keywords-table {
  margin-top: 16px;
}

.bordered {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 4px 11px;
  width: 100%;
  
  &:hover, &:focus {
    border-color: #40a9ff;
  }
}

.title-display, .description-display {
  border: 1px solid #d9d9d9;
  padding: 4px 11px;
  border-radius: 2px;
  cursor: pointer;
  
  &:hover {
    border-color: #40a9ff;
    background-color: #fafafa;
  }
}

.edit-icon {
  margin-left: 8px;
  color: #bfbfbf;
  opacity: 0;
  transition: opacity 0.3s;
}

.title-display:hover .edit-icon,
.description-display:hover .edit-icon {
  opacity: 1;
}

.page-status-tag {
  margin-left: 8px;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  overflow: visible !important; /* 确保溢出内容可见 */
}

.action-buttons .ant-btn {
  min-width: auto;
}

.action-buttons .ant-btn[disabled] {
  cursor: not-allowed;
}

.package-status-section {
  margin: 16px 0;
  padding: 0 12px;
}

.status-card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-content {
  margin-top: 12px;
}

.status-content h4 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.status-content p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #595959;
}

.upgrade-btn {
  margin-top: 12px;
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
}

.ai-autopilot-btn {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
    animation: subtle-rotate 8s linear infinite;
    z-index: 0;
  }

  .btn-text {
    position: relative;
    z-index: 1;
  }
}

@keyframes subtle-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ai-autopilot-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.ai-autopilot-btn:active {
  transform: translateY(0);
}

.ai-autopilot-btn .anticon {
  font-size: 16px;
}

.ai-badge {
  position: absolute;
  top: -10px;
  right: -30px;
  background: #22c55e;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
  animation: bounce 1s infinite;
  white-space: nowrap;
  z-index: 10; /* 提高 z-index */
  pointer-events: none; /* 防止badge影响按钮点击 */
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  }
  100% {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* 禁用状态样式 */
.ai-autopilot-btn[disabled] {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: rgba(255, 255, 255, 0.8);
  box-shadow: none;
  animation: none;
}

.ai-autopilot-btn[disabled] .ai-badge {
  background: #94a3b8;
  animation: none;
}

/* 确保所有可能的父容器都不会裁剪内容 */
:deep(.ant-btn) {
  overflow: visible !important;
}

:deep(.ant-tooltip) {
  overflow: visible !important;
}
/* 修改分页器容器样式 */
:deep(.ant-pagination) {
  text-align: center; /* 居中对齐 */
}

/* 确保内容区域有足够的底部间距 */
.main-content {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 8px;
  padding: 0 24px 24px 24px;
  display: flex; /* 添加弹性布局 */
  flex-direction: column; /* 垂直方向排列 */
}

/* 添加内容和分页器之间的间距容器 */
.content-container {
  flex: 1; /* 占用剩余空间 */
  display: flex;
  flex-direction: column;
  min-height: 0; /* 确保内容可以滚动 */
}

.processing-analysis-content {
  text-align: center;
}

.analysis-icon-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

@keyframes ripple {
  0% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.65);
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

.notification-message {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
  padding: 12px;
}

.mail-icon {
  color: #1890ff;
  font-size: 18px;
  margin-right: 8px;
}

/* 添加任务状态显示区域 */
.task-status-card {
  margin-bottom: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}

.task-status-content {
  display: flex;
  align-items: center;
}

.task-status-icon {
  margin-right: 20px;
}

.status-icon {
  font-size: 32px;
  color: #1890ff;
}

.task-status-info {
  flex: 1;
}

.task-status-title {
  margin-bottom: 8px;
  color: #262626;
}

.task-status-description {
  margin-bottom: 12px;
  color: #595959;
}

.task-timing {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #8c8c8c;
  font-size: 12px;
}

.ai-selection-modal-content {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-selection-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.ai-visual-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.ai-visual-rays {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.01%);
  background-size: 200% 200%;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.ai-selection-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.ai-selection-title {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-right: 16px;
}

.ai-selection-description {
  font-size: 16px;
  color: #6b7280;
}

.ai-value-proposition {
  margin-bottom: 24px;
}

.ai-value-proposition h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.ai-value-proposition p {
  font-size: 16px;
  color: #6b7280;
}

.ai-feature-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.ai-feature-card {
  flex: 1;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.ai-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 16px;
}

.feature-content {
  text-align: center;
}

.feature-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.feature-content p {
  font-size: 16px;
  color: #6b7280;
}

.ai-social-proof {
  display: flex;
  align-items: center;
  margin-top: 24px;
}

.proof-icon {
  font-size: 24px;
  color: #28a745;
  margin-right: 16px;
}

.ai-social-proof p {
  font-size: 16px;
  color: #6b7280;
}

.btn-cancel, .btn-start {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-cancel {
  background: #f0f7ff;
  border: 1px solid #1890ff;
  color: #1890ff;
}

.btn-cancel:hover {
  background: #e6f3ff;
  border-color: #40a9ff;
}

.btn-start {
  background: linear-gradient(135deg, #28a745 0%, #4caf50 100%);
  border: none;
  color: white;
}

.btn-start:hover {
  background: linear-gradient(135deg, #38b249 0%, #45a049 100%);
}

/* AI Selection Modal Styles */
.ai-selection-modal .ant-modal-content {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
}

.ai-selection-modal-content {
  position: relative;
}

/* Premium visual header */
.ai-selection-visual {
  position: relative;
  height: 160px;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: white;
}

.ai-visual-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  animation: pulse 8s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.2); }
}

.ai-visual-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 2%),
    radial-gradient(circle at 50% 70%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 3%),
    radial-gradient(circle at 80% 40%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 2%),
    radial-gradient(circle at 10% 60%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 2%),
    radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 3%);
}

.ai-visual-icon {
  position: absolute;
  top: 30px;
  right: 48px;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.ai-visual-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ai-visual-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  max-width: 80%;
  line-height: 1.5;
}

/* Main content area */
.ai-selection-body {
  padding: 32px 40px;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
}

/* Feature grid */
.ai-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.ai-feature-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  height: 100%;
}

.ai-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.ai-feature-card:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: inherit;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-discover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.feature-analyze {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
  color: white;
}

.feature-create {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.feature-content h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1a202c;
}

.feature-content p {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 auto 0;
  line-height: 1.5;
  flex-grow: 1; /* 确保所有卡片的描述文本区域高度一致 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 63px; /* 固定高度，确保所有卡片描述区域一致 */
}
/* Action buttons */
.ai-action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 16px;
}

.btn-cancel {
  min-width: 100px;
  height: 40px;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-start {
  position: relative;
  min-width: 200px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%) !important;
  border: none !important;
  box-shadow: 0 8px 16px rgba(71, 118, 230, 0.3) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  /* 移除 overflow: hidden 以避免光影效果被截断 */
}

.btn-start:hover {
  background: linear-gradient(135deg, #5985f7 0%, #9d63fa 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(71, 118, 230, 0.4) !important;
}

.btn-start:active {
  transform: translateY(0);
  box-shadow: 0 8px 12px rgba(71, 118, 230, 0.3) !important;
}

/* 移除光影效果，因为它会溢出按钮 */

/* 添加相应的 CSS 样式 */
.coming-soon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f9fafb;
  border-radius: 8px;
}

.coming-soon-content {
  text-align: center;
  padding: 40px;
}

.coming-soon-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.coming-soon-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.coming-soon-description {
  font-size: 16px;
  color: #6b7280;
  max-width: 400px;
}

/* 添加新的简化样式 */
.ai-selection-simple {
  text-align: center;
  padding: 20px 0;
}

.ai-icon-container {
  margin-bottom: 16px;
}

.ai-icon {
  font-size: 48px;
  color: #1890ff;
}

.ai-title {
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 500;
}

.ai-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.ai-action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-cancel {
  min-width: 100px;
}

.btn-start {
  min-width: 140px;
}

.outline-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.selection-controls {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.view-keywords-btn {
  margin-left: 8px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.secondary-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.primary-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Add to existing styles */
.outline-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.selection-controls {
  margin-right: 16px;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.secondary-actions {
  display: flex;
  gap: 4px;
  margin-right: 12px;
}

.primary-actions {
  display: flex;
  gap: 8px;
}

.generate-pages-btn {
  background-color: #52c41a;
  border-color: #52c41a;
}

.generate-pages-btn:hover:not(:disabled) {
  background-color: #73d13d;
  border-color: #73d13d;
}

.generate-pages-btn:disabled {
  background-color: #d9f7be;
  border-color: #d9f7be;
}

.keyword-table-card {
  height: 100%;
  max-height: 70vh; /* 限制卡片的最大高度为视口高度的70% */
  display: flex;
  flex-direction: column; /* 使用列布局 */
}

.keywords-table {
  flex: 1; /* 表格占用剩余空间 */
  overflow: auto; /* 添加滚动条 */
  min-height: 400px; /* 设置最小高度 */
}

/* 确保分页器固定在底部 */
.keywords-table :deep(.ant-table-pagination) {
  position: sticky;
  bottom: 0;
  background: white;
  margin: 16px 0 !important;
  padding: 12px 0;
  z-index: 10;
}

/* 确保表格内容区域可以滚动 */
.keywords-table :deep(.ant-table-body) {
  overflow-y: auto !important;
  max-height: calc(70vh - 120px); /* 减去头部和分页器的高度 */
}

/* 确保表格容器有足够的高度 */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}

.beginner-mode .beginner-content {
  min-height: 800px; /* 确保内容区域有足够的高度 */
}

.priority-tabs .ant-tabs-content {
  min-height: 800px; /* 确保标签内容区域有足够的高度 */
}

/* 筛选面板样式 */
.filter-panel {
  margin-bottom: 20px;
}

.filter-panel .ant-collapse-header {
  font-weight: 500;
  color: #1890ff;
}

.filter-panel .ant-collapse-content {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 0 0 4px 4px;
}

/* 表格样式优化 */
.keywords-table {
  margin-top: 16px;
}

/* 筛选按钮样式 */
.select-btn {
  color: #1890ff;
  border-color: #1890ff;
}

.select-btn:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

.deselect-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.deselect-btn:hover {
  color: #ff7875;
  border-color: #ff7875;
}

.smart-input-container {
  position: relative;
}

.smart-search-input {
  width: 100%;
}

.input-suggestions {
  display: none;
  position: absolute;
  width: 100%;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-top: 4px;
  padding: 12px;
}

.smart-input-container:hover .input-suggestions,
.smart-search-input:focus + .input-suggestions {
  display: block;
}

.suggestion-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: #666;
}

.suggestion-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.search-actions {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.help-icon {
  margin-left: 8px;
  color: #1890ff;
  cursor: pointer;
}

/* Add these styles */
.filter-panel {
  margin-bottom: 16px;
}

.filter-panel :deep(.ant-collapse-header) {
  font-weight: 500;
  color: #1890ff;
  display: flex;
  align-items: center;
  cursor: pointer; /* 确保整个标题区域都有点击光标 */
}

.filter-panel :deep(.ant-collapse-header-text) {
  width: 100%; /* 让文本区域占据整个宽度 */
  cursor: pointer; /* 确保文本区域有点击光标 */
}

.filter-panel :deep(.ant-collapse-arrow) {
  font-size: 20px !important; 
  cursor: pointer; /* 确保箭头有点击光标 */
}

.filter-panel :deep(.ant-collapse-content) {
  background-color: #fafafa;
  border-radius: 0 0 4px 4px;
  padding: 12px;
}

.filter-header {
  font-weight: 500;
}

</style>