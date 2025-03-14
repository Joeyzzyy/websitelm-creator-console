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
                    <h2 class="analysis-title">Initializing Keyword Library</h2>
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
              
              <a-tabs 
                v-model:activeKey="contentPlanTab" 
                class="content-plan-tabs"
                @change="handleContentPlanTabChange"
              >
                <template #tabBarExtraContent>
                  <div class="toolbar-right">
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
                      Generate Outlines
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
                </template>
                
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
                    <!-- Title column -->
                    <a-table-column title="Title" key="title" width="30%">
                      <template #default="{ record }">
                        <div class="outline-title" @click.stop="showPlanDetails(record)">{{ record.title }}</div>
                        <div class="outline-description" v-if="record.description" @click.stop="showPlanDetails(record)">
                          {{ record.description.length > 80 ? record.description.substring(0, 80) + '...' : record.description }}
                        </div>
                      </template>
                    </a-table-column>
                    
                    <!-- Keywords column -->
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
                    
                    <!-- Page type column -->
                    <a-table-column title="Type" key="pageType" width="15%">
                      <template #default="{ record }">
                        <div @click.stop="showPlanDetails(record)">
                          <a-tag :color="getPageTypeColor(record.pageType)">
                            {{ record.pageType }}
                          </a-tag>
                          <a-tag 
                            v-if="record.hasRelatedPageTask" 
                            color="gold" 
                            style="margin-left: 4px;"
                          >
                            Page Created
                          </a-tag>
                        </div>
                      </template>
                    </a-table-column>
                    
                    <!-- Actions column -->
                    <a-table-column title="Actions" key="actions" width="15%">
                      <template #default="{ record }">
                        <div class="outline-actions">
                          <a-button 
                            type="primary"
                            ghost
                            :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                            @click.stop="handleFavorite(record)"
                            :title="record.favorited ? 'Remove from selection' : 'Add to selection'"
                          >
                            {{ record.favorited ? 'Deselect' : 'Select' }}
                          </a-button>
                          
                          <a-button 
                            type="primary"
                            @click.stop="handleSinglePageGeneration(record)"
                            :disabled="isGeneratingPages || record.status === 'processing'"
                            :title="record.hasRelatedPageTask ? 'Page already exists' : 'Generate page'"
                          >
                            Generate Page
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
                  <!-- Favorites table, similar to the one above but filtered for favorites -->
                  <a-table
                    class="content-plans-table"
                    :dataSource="contentPlans.filter(plan => plan.favorited)"
                    :loading="isLoadingOutlines"
                    :pagination="contentPlansPagination"
                    :rowKey="record => record.outlineId"
                    @change="handleContentPlansPaginationChange"
                    @row-click="showPlanDetails"
                  >
                    <!-- Same column definitions as above -->
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
                        <div @click.stop="showPlanDetails(record)">
                          <a-tag :color="getPageTypeColor(record.pageType)">
                            {{ record.pageType }}
                          </a-tag>
                          <a-tag 
                            v-if="record.hasRelatedPageTask" 
                            color="gold" 
                            style="margin-left: 4px;"
                          >
                            Page Created
                          </a-tag>
                        </div>
                      </template>
                    </a-table-column>
                    
                    <a-table-column title="Actions" key="actions" width="15%">
                      <template #default="{ record }">
                        <div class="outline-actions">
                          <a-button 
                            type="primary"
                            ghost
                            :class="record.favorited ? 'deselect-btn' : 'select-btn'"
                            @click.stop="handleFavorite(record)"
                            :title="record.favorited ? 'Remove from selection' : 'Add to selection'"
                          >
                            {{ record.favorited ? 'Deselect' : 'Select' }}
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
        </template>
      </template>

      <template v-else>
        <no-site-configured v-if="!loading"/>
      </template>
    </a-spin>

    <a-modal
      v-model:open="generationProgressVisible"
      title="Submitting Generation Tasks"
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
          <span class="status-text">&nbsp; {{ generationStatusText }}</span>
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
                <!-- Removed tagRender template, using default tag style -->
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
      v-model:visible="aiSelectionModalVisible"
      title="AI Autopilot"
      @ok="handleAISelection"
      :footer="null"
      :width="600"
      :centered="true"
      :maskClosable="false"
      :closable="true"
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
  LoadingOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  EditOutlined,
  RocketOutlined,
  MailOutlined,
  ThunderboltFilled,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import api from '../api/api'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'OutlinePlanningPage',
  components: {
    PageLayout,
    DeleteOutlined,
    LoadingOutlined,
    CloseCircleOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    EditOutlined,
    RocketOutlined,
    MailOutlined,
    ThunderboltFilled,
    NoSiteConfigured,
    Tag,
  },
  setup() {
    const loading = ref(true) 
    const taskStartTime = ref(null)
    const taskEndTime = ref(null)
    const taskDescription = ref(null)
    const taskProgress = ref(null)
    
    const formatTime = (isoString) => {
      if (!isoString) return '--'
      try {
        const date = new Date(isoString)
        if (isNaN(date.getTime())) return '--'
        
        return new Intl.DateTimeFormat('en-US', {
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

    const contentPlans = ref([])

    const selectedOutlinesCount = computed(() => {
      return contentPlans.value.filter(plan => plan.favorited).length
    })

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
          } 
        }
      }, 5000)
    }

    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
      }
    });

    const drawerVisible = ref(false)
    const selectedPlan = ref(null)
    const isEditingTitle = ref(false)
    const isEditingDesc = ref(false)
    const isUpdatingKeywords = ref(false)
    const availableKeywords = ref([])
    const activeOutlineSections = ref([])

    const showPlanDetails = (plan) => {
      selectedPlan.value = {
        ...plan,
        // Ensure keywords are in array form
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

    const startEditingTitle = () => {
      isEditingTitle.value = true
      nextTick(() => {
        document.querySelector('.title-input').focus()
      })
    }

    const saveTitle = async () => {
      isEditingTitle.value = false
      if (!selectedPlan.value) return
      
      try {
        await api.updatePlanningOutline(selectedPlan.value.outlineId, {
          title: selectedPlan.value.title
        })
        message.success('Title updated successfully')
        
        // Update the title in the content plans list
        contentPlans.value = contentPlans.value.map(plan => {
          if (plan.outlineId === selectedPlan.value.outlineId) {
            return { ...plan, title: selectedPlan.value.title }
          }
          return plan
        })
      } catch (error) {
        message.error('Failed to update title')
      }
    }

    const startEditingDesc = () => {
      isEditingDesc.value = true
      nextTick(() => {
        document.querySelector('.description-input').focus()
      })
    }

    const saveDescription = async () => {
      isEditingDesc.value = false
      if (!selectedPlan.value) return
      
      try {
        await api.updatePlanningOutline(selectedPlan.value.outlineId, {
          description: selectedPlan.value.description
        })
        message.success('Description updated successfully')
        
        // Update the description in the content plans list
        contentPlans.value = contentPlans.value.map(plan => {
          if (plan.outlineId === selectedPlan.value.outlineId) {
            return { ...plan, description: selectedPlan.value.description }
          }
          return plan
        })
      } catch (error) {
        message.error('Failed to update description')
      }
    }

    const handleKeywordsChange = async (newKeywords) => {
      if (!selectedPlan.value) return
      
      isUpdatingKeywords.value = true
      try {
        // ... existing code ...
        await api.updatePlanningOutline(selectedPlan.value.outlineId, {
          keywords: newKeywords.join(',')
        })
        message.success('Keywords updated successfully')
        
        // Update the keywords in the content plans list
        contentPlans.value = contentPlans.value.map(plan => {
          if (plan.outlineId === selectedPlan.value.outlineId) {
            return { ...plan, keywords: newKeywords.join(',') }
          }
          return plan
        })
      } catch (error) {
        message.error('Failed to update keywords')
      } finally {
        isUpdatingKeywords.value = false
      }
    }

    const handleBlur = () => {
      // Handle blur event if needed
    }

    const handleChange = () => {
      // Handle change event if needed
    }

    const getTypeColor = (type) => {
      const typeColors = {
        'blog': 'blue',
        'article': 'green',
        'landing': 'purple',
        'product': 'orange',
        'guide': 'cyan',
        'review': 'magenta',
        'comparison': 'gold',
        'how-to': 'lime'
      }
      return typeColors[type?.toLowerCase()] || 'default'
    }

    const checkOutlineGenerationStatus = async () => {
      const isLoadingTaskInfo = ref(false)
      isLoadingTaskInfo.value = true
      try {
        // Query status for both tasks
        const [compositeResponse, autoPilotResponse] = await Promise.all([
          api.getAnalysisStatus('composite_generator'),
          api.getAnalysisStatus('auto_pilot')
        ])
        
        let activeResponse = null;
        let wasProcessing = outlineGenerationStatus.value === 'processing';
        let nowFinished = false;
        
        // Handle composite_generator task
        if (compositeResponse?.code === 200 && compositeResponse.data) {
          // If composite task is processing, it's the active task
          if (compositeResponse.data.status === 'processing') {
            activeResponse = compositeResponse;
            outlineGenerationStatus.value = 'processing';
            taskStartTime.value = compositeResponse.data.startTime;
            taskEndTime.value = compositeResponse.data.endTime;
            taskDescription.value = formatTaskDescription(compositeResponse.data.description);
            taskProgress.value = 50;
          } 
          // If composite task is finished and previous state was processing, mark for refresh
          else if (compositeResponse.data.status === 'finished' && wasProcessing) {
            nowFinished = true;
            outlineGenerationStatus.value = 'finished';
            taskStartTime.value = compositeResponse.data.startTime;
            taskEndTime.value = compositeResponse.data.endTime;
            taskDescription.value = formatTaskDescription(compositeResponse.data.description);
            taskProgress.value = 100;
          }
        }
        
        // Handle auto_pilot task
        if (autoPilotResponse?.code === 200 && autoPilotResponse.data) {
          // If auto_pilot task is processing, it's the active task
          if (autoPilotResponse.data.status === 'processing') {
            activeResponse = autoPilotResponse;
            outlineGenerationStatus.value = 'processing';
            taskStartTime.value = autoPilotResponse.data.startTime;
            taskEndTime.value = autoPilotResponse.data.endTime;
            taskDescription.value = formatTaskDescription(autoPilotResponse.data.description);
            taskProgress.value = 50;
          } 
          // If auto_pilot task is finished and previous state was processing, mark for refresh
          else if (autoPilotResponse.data.status === 'finished' && wasProcessing) {
            nowFinished = true;
            outlineGenerationStatus.value = 'finished';
            taskStartTime.value = autoPilotResponse.data.startTime;
            taskEndTime.value = autoPilotResponse.data.endTime;
            taskDescription.value = formatTaskDescription(autoPilotResponse.data.description);
            taskProgress.value = 100;
          }
        }
        
        // Only refresh outline list when task status changes from processing to finished
        if (nowFinished) {
          await fetchContentPlans();
        }
        
        // If no task is processing, clear polling
        if (pollingInterval.value && !activeResponse) {
          clearInterval(pollingInterval.value);
          pollingInterval.value = null;
        }
        
        // Return active task response (if any)
        return activeResponse || (compositeResponse?.data ? compositeResponse : autoPilotResponse);
        
      } catch (error) {
        message.error('Failed to check task status');
        return null;
      } finally {
        isLoadingTaskInfo.value = false;
      }
    }

    const formatTaskDescription = (description) => {
      return description || 'Processing your request...';
    }

    const fetchContentPlans = async () => {
      const isLoadingOutlines = ref(false)
      if (isLoadingOutlines.value) return
      
      isLoadingOutlines.value = true
      try {
        const outlinesResponse = await api.getPlanningOutlines({
          status: contentPlanTab.value === 'favorites' ? 'selected' : '',
          page: contentPlansPagination.value.current,
          limit: contentPlansPagination.value.pageSize
        })
        
        if (outlinesResponse?.data) {
          contentPlans.value = outlinesResponse.data.map(plan => ({
            ...plan,
            favorited: plan.status === 'selected'
          }))
          // Ensure total count is set
          contentPlansPagination.value.total = outlinesResponse.totalCount || 0
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

    const handleFavorite = async (plan) => {
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
      contentPlansPagination.value.current = 1
      await fetchContentPlans()
    }

    const handleDeleteOutline = async (plan) => {
      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Delete Outline',
          content: `Are you sure you want to delete "${plan.title}"?`,
          okText: 'Delete',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      try {
        await api.deletePlanningOutline(plan.outlineId);
        message.success('Outline deleted successfully');
        
        // Remove the deleted outline from the list
        contentPlans.value = contentPlans.value.filter(p => p.outlineId !== plan.outlineId);
        
        // Close drawer if the deleted outline was being viewed
        if (selectedPlan.value?.outlineId === plan.outlineId) {
          closeDrawer();
        }
      } catch (error) {
        message.error('Failed to delete outline');
      }
    };

    const confirmClearAllOutlines = () => {
      Modal.confirm({
        title: 'Clear All Outlines',
        content: 'Are you sure you want to delete all outlines? This action cannot be undone.',
        okText: 'Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: clearAllOutlines,
      });
    };

    const clearAllOutlines = async () => {
      try {
        await api.clearPlanningOutlines();
        message.success('All outlines cleared successfully');
        contentPlans.value = [];
        closeDrawer();
      } catch (error) {
        message.error('Failed to clear outlines');
      }
    };

    const refreshContentPlans = async () => {
      const isRefreshing = ref(false)
      isRefreshing.value = true;
      try {
        await fetchContentPlans();
        message.success('Outlines refreshed');
      } catch (error) {
        message.error('Failed to refresh outlines');
      } finally {
        isRefreshing.value = false;
      }
    };

    const handleGenerateOutlinePlan = () => {
      aiSelectionModalVisible.value = true;
    };

    const aiSelectionModalVisible = ref(false);
    const isAISelecting = ref(false);

    const handleAISelection = async () => {
      isAISelecting.value = true;
      try {
        await api.generateAutoPilot();
        message.success('Auto-generation started');
        aiSelectionModalVisible.value = false;
        
        // Check status and start polling
        const statusResponse = await checkOutlineGenerationStatus();
        if (!statusResponse?.data || statusResponse.data.status !== 'finished') {
          startPolling();
        }
      } catch (error) {
        message.error('Failed to start auto-generation');
      } finally {
        isAISelecting.value = false;
      }
    };

    const getAIButtonTooltip = computed(() => {
      if (outlineGenerationStatus.value === 'processing') {
        return 'Outline generation is already in progress';
      }
      return 'Generate outlines using AI';
    });

    const handleSinglePageGeneration = async (outline) => {
      if (outline.hasRelatedPageTask) {
        message.info('Page has already been created for this outline');
        return;
      }

      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Generate Page',
          content: `Are you sure you want to generate a page for "${outline.title}"?`,
          okText: 'Generate',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      generationProgressVisible.value = true;
      isGeneratingPages.value = true;
      generationProgress.value = 0;
      generationStatus.value = 'active';
      generationStatusText.value = 'Submitting page generation task...';
      generationDetails.value = 'Please wait while we prepare your page...';

      try {
        await api.generatePageFromOutline(outline.outlineId);
        
        generationProgress.value = 100;
        generationStatus.value = 'success';
        generationStatusText.value = 'Page generation task submitted successfully!';
        generationDetails.value = 'Your page will be created in the background. You can check its status in the Pages section.';
        generationCompleted.value = true;
        
        // Update the outline to show it has a related page task
        contentPlans.value = contentPlans.value.map(plan => {
          if (plan.outlineId === outline.outlineId) {
            return { ...plan, hasRelatedPageTask: true };
          }
          return plan;
        });
        
        setTimeout(() => {
          generationProgressVisible.value = false;
        }, 2000);
      } catch (error) {
        generationProgress.value = 100;
        generationStatus.value = 'exception';
        generationStatusText.value = 'Failed to submit page generation task';
        generationDetails.value = 'Please try again later or contact support if the issue persists.';
        generationFailed.value = true;
      } finally {
        isGeneratingPages.value = false;
      }
    };

    const handlePublishOutlines = async () => {
      const selectedOutlines = contentPlans.value.filter(plan => plan.favorited);
      
      if (selectedOutlines.length === 0) {
        message.warning('Please select at least one outline');
        return;
      }

      const confirmed = await new Promise(resolve => {
        Modal.confirm({
          title: 'Generate Pages',
          content: `Are you sure you want to generate pages for ${selectedOutlines.length} selected outlines?`,
          okText: 'Generate',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      generationProgressVisible.value = true;
      isGeneratingPages.value = true;
      generationProgress.value = 0;
      generationStatus.value = 'active';
      generationStatusText.value = 'Submitting page generation tasks...';
      generationDetails.value = `Processing ${selectedOutlines.length} outlines...`;

      try {
        const outlineIds = selectedOutlines.map(outline => outline.outlineId);
        await api.generatePagesFromOutlines(outlineIds);
        
        generationProgress.value = 100;
        generationStatus.value = 'success';
        generationStatusText.value = 'Page generation tasks submitted successfully!';
        generationDetails.value = 'Your pages will be created in the background. You can check their status in the Pages section.';
        generationCompleted.value = true;
        
        // Update the outlines to show they have related page tasks
        contentPlans.value = contentPlans.value.map(plan => {
          if (outlineIds.includes(plan.outlineId)) {
            return { ...plan, hasRelatedPageTask: true };
          }
          return plan;
        });
        
        setTimeout(() => {
          generationProgressVisible.value = false;
        }, 2000);
      } catch (error) {
        generationProgress.value = 100;
        generationStatus.value = 'exception';
        generationStatusText.value = 'Failed to submit page generation tasks';
        generationDetails.value = 'Please try again later or contact support if the issue persists.';
        generationFailed.value = true;
      } finally {
        isGeneratingPages.value = false;
      }
    };

    const generationProgressVisible = ref(false);
    const isGeneratingPages = ref(false);
    const generationProgress = ref(0);
    const generationStatus = ref('active');
    const generationStatusText = ref('');
    const generationDetails = ref('');
    const generationCompleted = ref(false);
    const generationFailed = ref(false);

    const getPageTypeColor = (type) => {
      const typeColors = {
        'blog': 'blue',
        'article': 'green',
        'landing': 'purple',
        'product': 'orange',
        'guide': 'cyan',
        'review': 'magenta',
        'comparison': 'gold',
        'how-to': 'lime'
      }
      return typeColors[type?.toLowerCase()] || 'default'
    }

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

    onMounted(async () => {
      loading.value = true
      try {
        await checkDomainStatus()

        if (domainConfigured.value) {
          await checkAnalysisStatus()
          
          if (analysisState.value !== 'finished') {
            pollingInterval.value = setInterval(checkAnalysisStatus, 5000)
          } else {
            await fetchContentPlans()
            await checkAndStartPolling()
          }
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        message.error('Failed to initialize the page')
      } finally {
        loading.value = false
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

    return {
      loading,
      domainConfigured,
      analysisState,
      currentTasks,
      getProgressPercent,
      formatTime,
      taskStartTime,
      taskEndTime,
      contentPlans,
      contentPlanTab,
      contentPlansPagination,
      handleContentPlanTabChange,
      handleContentPlansPaginationChange,
      showPlanDetails,
      handleFavorite,
      handleDeleteOutline,
      confirmClearAllOutlines,
      refreshContentPlans,
      handleGenerateOutlinePlan,
      handlePublishOutlines,
      selectedOutlinesCount,
      outlineGenerationStatus,
      isGeneratingPages,
      getAIButtonTooltip,
      handleSinglePageGeneration,
      drawerVisible,
      selectedPlan,
      closeDrawer,
      isEditingTitle,
      isEditingDesc,
      startEditingTitle,
      startEditingDesc,
      saveTitle,
      saveDescription,
      isUpdatingKeywords,
      availableKeywords,
      handleKeywordsChange,
      handleBlur,
      handleChange,
      getTypeColor,
      activeOutlineSections,
      generationProgressVisible,
      generationProgress,
      generationStatus,
      generationStatusText,
      generationDetails,
      generationCompleted,
      generationFailed,
      getPageTypeColor,
      aiSelectionModalVisible,
      isAISelecting,
      handleAISelection,
    }
  }
})
</script>

<style scoped>
/* Main layout styles */
.planning-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.step-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Loading and analysis states */
.centered-spin {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.analysis-loading-state {
  padding: 24px;
}

.loading-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analysis-loading-card {
  padding: 32px;
  text-align: center;
}

.analysis-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 24px;
}

.analysis-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #262626;
}

.analysis-description {
  font-size: 16px;
  color: #595959;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.platform-tag {
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 4px;
}

.semrush {
  background-color: #ff642d;
  color: white;
}

.ahrefs {
  background-color: #0a53e4;
  color: white;
}

.google {
  background-color: #4285f4;
  color: white;
}

.social {
  background-color: #1da1f2;
  color: white;
}

.loading-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f7ff;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 24px;
}

.tip-icon {
  color: #1890ff;
  font-size: 18px;
  margin-right: 8px;
}

.tip-text {
  color: #1890ff;
  font-weight: 500;
}

.analysis-icon-container {
  margin-bottom: 24px;
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.analysis-status {
  margin-top: 24px;
  margin-bottom: 24px;
  text-align: left;
}

.task-item {
  margin-bottom: 16px;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.task-name {
  font-weight: 500;
  color: #262626;
}

.task-status {
  font-weight: 600;
  text-transform: capitalize;
}

.task-status.processing {
  color: #1890ff;
}

.task-status.finished {
  color: #52c41a;
}

.task-status.failed {
  color: #f5222d;
}

.task-timing {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
}

.notification-message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  color: #595959;
}

.mail-icon {
  margin-right: 8px;
  color: #1890ff;
}

/* Task status card */
.task-status-card {
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.task-status-content {
  display: flex;
  align-items: flex-start;
}

.task-status-icon {
  margin-right: 16px;
}

.status-icon {
  font-size: 24px;
  color: #1890ff;
}

.task-status-info {
  flex: 1;
}

.task-status-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #262626;
}

.task-status-description {
  color: #595959;
  margin-bottom: 8px;
}

/* Content toolbar */
.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.outline-stats {
  font-size: 14px;
  color: #595959;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.action-button {
  margin-left: 8px;
}

.generate-btn {
  background-color: #faad14;
  border-color: #faad14;
  color: #fff;
}

.generate-btn:hover:not(:disabled) {
  background-color: #ffc53d;
  border-color: #ffc53d;
  color: #fff;
}

.generate-pages-btn {
  background-color: #1890ff;
  border-color: #1890ff;
}

/* Content plans table */
.content-plans-table {
  margin-top: 16px;
}

.outline-title {
  font-weight: 500;
  color: #262626;
  cursor: pointer;
}

.outline-description {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
  cursor: pointer;
}

.outline-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  cursor: pointer;
}

.more-tag {
  background-color: #f0f0f0;
  color: #595959;
}

.outline-actions {
  display: flex;
  gap: 8px;
}

.select-btn {
  color: #1890ff;
  border-color: #1890ff;
}

.deselect-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

/* Drawer styles */
.outline-drawer :deep(.ant-drawer-body) {
  padding: 24px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.drawer-section {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #262626;
}

.info-item {
  margin-bottom: 16px;
}

.info-label {
  display: block;
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.editable-title, .editable-description {
  position: relative;
}

.title-display, .description-display {
  padding: 8px 12px;
  border: 1px dashed transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-display:hover, .description-display:hover {
  border-color: #d9d9d9;
  background-color: #fafafa;
}

.edit-icon {
  color: #bfbfbf;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.title-display:hover .edit-icon, .description-display:hover .edit-icon {
  opacity: 1;
}

.description-display p {
  margin: 0;
  flex: 1;
}

.bordered {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* Outline tree */
.outline-tree {
  margin-top: 16px;
}

.custom-collapse :deep(.ant-collapse-header) {
  padding: 12px 16px !important;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.section-title {
  font-weight: 500;
  color: #262626;
}

.section-wordcount {
  font-size: 12px;
  color: #8c8c8c;
}

.section-details {
  padding: 0 16px 16px;
}

.info-row {
  margin-bottom: 16px;
}

.info-key {
  display: block;
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.keyword-distribution {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.keyword-count {
  font-size: 12px;
  color: #8c8c8c;
}

.subsections {
  margin-top: 16px;
}

.subsection-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subsection-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.subsection-number {
  color: #8c8c8c;
  font-size: 14px;
}

.subsection-title {
  color: #262626;
  font-size: 14px;
}

/* Generation progress modal */
.generation-progress {
  padding: 16px;
}

.progress-status {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.status-text {
  font-size: 16px;
  font-weight: 500;
}

.progress-details {
  margin-top: 16px;
  color: #595959;
}

/* AI Selection Modal */
.ai-selection-modal :deep(.ant-modal-body) {
  padding: 0;
}

.ai-selection-simple {
  padding: 32px;
  text-align: center;
}

.ai-icon-container {
  margin-bottom: 24px;
}

.ai-icon {
  font-size: 48px;
  color: #faad14;
}

.ai-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #262626;
}

.ai-description {
  font-size: 14px;
  color: #595959;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.ai-action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-cancel {
  min-width: 120px;
}

.btn-start {
  min-width: 160px;
  background-color: #faad14;
  border-color: #faad14;
}

.btn-start:hover {
  background-color: #ffc53d;
  border-color: #ffc53d;
}
</style>