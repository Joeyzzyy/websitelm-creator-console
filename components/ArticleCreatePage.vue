<template>
  <div class="article-editor">
    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>

    <div v-else>
      <!-- Left sidebar -->
      <div class="side-nav" :class="{ 'collapsed': isSideNavCollapsed }">
        <div class="collapse-button" @click="toggleSideNav">
          <div class="collapse-icon">
            <LeftOutlined :class="{ 'rotated': isSideNavCollapsed }" />
          </div>
        </div>
        
        <a-tabs 
          v-model:activeKey="activeTab"
          class="compact-tabs"
        >
          <!-- Component selection panel -->
          <a-tab-pane key="components" tab="All Components">
            <div class="components-list">
              <a-collapse v-model:activeKey="activeCategories">
                <a-collapse-panel 
                  v-for="category in availableComponents" 
                  :key="category.category" 
                >
                  <template #header>
                    <div class="add-category-header">
                      <span>{{ category.category }}</span>
                      <span class="add-category-count">{{ category.items.length }}</span>
                    </div>
                  </template>
                  <div 
                    v-for="component in category.items" 
                    :key="component.type"
                    class="component-item"
                    draggable="true"
                    @dragstart="handleDragStart($event, component)"
                    @click="addComponent(component)"
                    @mouseenter="showComponentPreview(component)"
                    @mouseleave="hideComponentPreview"
                  >
                    <span>{{ component.label }}</span>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-tab-pane>

          <!-- Selected Components tab -->
          <a-tab-pane key="selectedComponents" tab="Selected">
            <div class="selected-components-list">
              <!-- Empty state hint -->
              <div v-if="articleData.sections.length === 0" class="empty-hint">
                <p>No components added yet</p>
              </div>

              <!-- Selected components list -->
              <div 
                v-else
                class="selected-items"
              >
                <div 
                  v-for="(section, index) in articleData.sections"
                  :key="index"
                  class="selected-item"
                  draggable="true"
                  @dragstart="handleSectionDragStart($event, index)"
                  @dragover.prevent
                  @drop="(e) => handleSectionDrop(e, index)"
                  @click="scrollToSection(`section-${index}`)"
                >
                  <span class="item-name">{{ formatComponentName(section.componentName) }}</span>
                  <div class="item-actions">
                    <a-button 
                      type="text" 
                      danger
                      size="small"
                      @click.stop="removeSection(index)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- Header toolbar -->
      <div class="editor-header">
        <a-button type="link" @click="handleBack">
          <ArrowLeftOutlined /> Back
        </a-button>
        
        <div class="header-actions">
          <template v-if="isEditMode">
            <!-- 修改查看已发布页面的按钮 -->
            <a-button
              v-if="articleData.publishStatus === 'publish'"
              type="default"showComponentPreview
              @click="handleViewPublished"
              :style="{ height: '36px' }"
            >
              View Published Page
            </a-button>
            
            <a-button 
              type="default"
              @click="handlePreview"
              :style="{ height: '36px' }"
            >
              Preview Page
            </a-button>
            
            <a-tooltip :title="getPublishTooltip(articleData)">
              <a-button
                :type="articleData.publishStatus === 'publish' ? 'default' : 'primary'"
                @click="handlePublish"
                :disabled="!canPublish()"
                :loading="publishing"
                :style="{ height: '36px' }"
              >
                {{ articleData.publishStatus === 'publish' ? 'Unpublish' : 'Publish' }}
              </a-button>
            </a-tooltip>
            
            <a-button 
              type="primary"
              @click="() => handleSave(false)"
              :loading="saving"
              :style="{ height: '36px' }"
            >
              Save Page
            </a-button>
          </template>
          <template v-else>
            <a-button 
              type="primary"
              @click="() => handleSave(false)"
              :loading="saving"
              :style="{ height: '36px' }"
            >
              Save Page
            </a-button>
          </template>

          <!-- 添加分析按钮 -->
          <a-button
            type="default"
            @click="showAnalysisModal"
            :style="{ height: '36px' }"
          >
            Page Analysis
          </a-button>
        </div>
      </div>

      <!-- Content area -->
      <div class="editor-content" :class="{ 'expanded': isSideNavCollapsed }" @dragover.prevent @drop="handleDrop">
        <div class="sections-container">
          <!-- Fixed compact Info component -->
          <div class="section-wrapper info-section">
            <div class="component-label">Page Information</div>
            <div class="basic-info-form">
              <a-form layout="vertical">
                <div class="form-grid">
                  <!-- 将内容分为两列 -->
                  <div class="form-columns">
                    <!-- TDK 分组 - 左侧 -->
                    <div class="tdk-section">
                      <div class="tdk-label">TDK Information</div>
                      
                      <!-- Title -->
                      <a-form-item label="Title" required>
                        <a-input
                          v-model:value="articleData.title"
                          placeholder="Enter page title"
                        />
                      </a-form-item>

                      <!-- Description -->
                      <a-form-item label="Description" required>
                        <a-textarea
                          v-model:value="articleData.description"
                          placeholder="Enter page description"
                          :rows="4"
                          :auto-size="{ minRows: 4, maxRows: 6 }"
                          style="min-height: 80px;"
                        />
                      </a-form-item>

                      <!-- Keywords -->
                      <a-form-item label="Keywords" required>
                        <a-select
                          v-model:value="articleData.keywords"
                          mode="tags"
                          placeholder="Enter keywords"
                          :token-separators="[',']"
                          style="min-height: 80px;"
                          @paste="handleKeywordsPaste"
                        >
                          <template #suffixIcon>
                            <PlusOutlined />
                          </template>
                          <template #clearIcon>
                            <DeleteOutlined />
                          </template>
                          <a-select-option v-for="keyword in articleData.keywords" :key="keyword" :value="keyword">
                            {{ keyword }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>

                    <!-- 其他字段 - 右列 -->
                    <div class="other-fields-section">
                      <div class="section-label">Other Information</div>
                      <div class="other-fields-grid">
                        <a-form-item label="Type" required>
                          <template v-if="isEditMode">
                            <div class="readonly-field">{{ articleData.pageType }}</div>
                          </template>
                          <a-select v-else v-model:value="articleData.pageType" allowClear>
                            <a-select-option value="Blog">Blog</a-select-option>
                            <a-select-option value="Landing Page">Landing Page</a-select-option>
                          </a-select>
                        </a-form-item>

                        <a-form-item label="Lang" required>
                          <template v-if="isEditMode">
                            <div class="readonly-field">{{ getLanguageLabel(articleData.language) }}</div>
                          </template>
                          <a-select v-else v-model:value="articleData.language">
                            <a-select-option value="en">English</a-select-option>
                          </a-select>
                        </a-form-item>

                        <a-form-item label="Author" required>
                          <a-input
                            v-model:value="articleData.author"
                            placeholder="Enter author name"
                          />
                        </a-form-item>

                        <a-form-item label="Topic">
                          <a-input
                            v-model:value="articleData.topic"
                            placeholder="Enter topic"
                          />
                        </a-form-item>

                        <!-- 修改 slug 表单项，添加 v-if -->
                        <a-form-item label="Slug" required v-if="isEditMode">
                          <a-input
                            v-model:value="articleData.slug"
                            placeholder="Enter page slug here"
                            @blur="handleSlugBlur"
                            :status="slugStatus"
                          />
                          <div v-if="slugError" class="slug-error">
                            {{ slugError }}
                          </div>
                          <div class="slug-hint">
                            Note: If this page is the website's root page, please set the slug to "home". The system will automatically handle redirects.
                          </div>
                        </a-form-item>
                      </div>

                      <!-- 将 Deployment Method 改为 Publish URL -->
                      <a-form-item 
                        label="Publish URL"
                        style="margin-top: 24px;"
                      >
                        <a-select
                          v-model:value="articleData.publishUrl"
                          placeholder="Select publish URL"
                          :loading="loadingDeployTargets"
                          style="width: 100%;"
                          allowClear
                        >
                          <a-select-option 
                            v-for="domain in availablePublishUrls" 
                            :key="domain"
                            :value="domain"
                          >
                            {{ domain }}
                          </a-select-option>
                        </a-select>

                        <!-- 修改预览URL显示逻辑 -->
                        <div class="preview-url-hint" v-if="articleData.publishUrl">
                          <div class="hint-label">This page will be published to:</div>
                          <div class="preview-url">{{ getPreviewPublishUrl }}</div>
                        </div>
                      </a-form-item>

                      <!-- Summary 放在 Deployment Method 下面 -->
                      <a-form-item 
                        label="Summary"
                        style="margin-top: 24px;"
                      >
                        <a-textarea
                          v-model:value="articleData.summary"
                          placeholder="Enter page summary"
                          :rows="4"
                          :auto-size="{ minRows: 4, maxRows: 6 }"
                          style="min-height: 80px;"
                        />
                      </a-form-item>
                    </div>
                  </div>
                </div>
              </a-form>
            </div>
          </div>

          <!-- Empty state hint - only shown when no components exist -->
          <div v-if="articleData.sections.length === 0" class="empty-state">
            <p>Drag or click components from the left to start creating</p>
          </div>

          <!-- Other components list -->
          <div 
            v-for="(section, index) in articleData.sections" 
            :key="index"
            :id="`section-${index}`"
            class="section-wrapper"
          >
            <div class="component-label">
              {{ formatComponentName(section.componentName) }}
            </div>
            
            <div class="section-actions">
              <a-button 
                type="text"
                class="action-btn"
                @click="toggleImmersiveMode(index)"
              >
                <ExpandOutlined v-if="currentImmersiveSection !== index" />
                <CompressOutlined v-else />
              </a-button>
              <a-button 
                type="text" 
                danger
                class="action-btn"
                @click="removeSection(index)"
              >
                <DeleteOutlined />
              </a-button>
            </div>
            
            <!-- 添加过渡效果的包装器 -->
            <div 
              :class="[
                'section-content-wrapper',
                { 'immersive': currentImmersiveSection === index }
              ]"
            >
              <component 
                :is="section.componentName"
                :section="section"
                @update="(updatedSection) => handleSectionUpdate(updatedSection, index)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 添加分析弹窗 -->
      <a-modal
        v-model:open="analysisModal.visible"
        title="Page Analysis"
        :width="800"
        :footer="null"
        @cancel="hideAnalysisModal"
      >
        <div class="analysis-content">
          <FloatingStats
            :keywords-stats="articleData.pageStats"
            :sections="articleData.sections"
            @refresh="handleRefreshMetrics"
            :is-modal="true"
          />
        </div>
      </a-modal>

      <!-- 添加悬浮预览组件 -->
      <div 
        v-if="hoverPreview.visible" 
        class="hover-preview"
        :style="hoverPreview.position"
      >
        <div class="preview-content">
          <component 
            :is="`${hoverPreview.componentName}Preview`"
            :section="hoverPreview.componentData"
            :styles="themeConfig.normal"
          />
        </div>
      </div>

      <!-- 修改发布确认弹窗 -->
      <a-modal
        v-model:open="publishModal.visible"
        :title="publishModal.title"
        :confirm-loading="publishModal.loading"
        @ok="confirmPublish"
        @cancel="handlePublishCancel"
        :footer="articleData.publishUrl ? undefined : null"
      >
        <template v-if="!articleData.publishUrl">
          <p>Please select a publish URL before publishing this page.</p>
          <div style="text-align: right; margin-top: 24px;">
            <a-button @click="handlePublishCancel">OK</a-button>
          </div>
        </template>
        <template v-else>
          <p>Are you sure you want to {{ articleData.publishStatus === 'publish' ? 'unpublish' : 'publish' }} this page?</p>
          <p v-if="articleData.publishStatus !== 'publish'">
            The page will be published to:
            <br/>
            <strong>{{ getPreviewPublishUrl }}</strong>
          </p>
        </template>
      </a-modal>

      <!-- 添加全屏遮罩 -->
      <div 
        v-if="currentImmersiveSection !== null" 
        class="immersive-overlay"
        @click="exitImmersiveMode"
      >
        <div class="immersive-content" @click.stop>
          <!-- 全屏模式的顶部工具栏 -->
          <div class="immersive-toolbar">
            <span class="component-name">
              {{ formatComponentName(articleData.sections[currentImmersiveSection]?.componentName) }}
            </span>
            <div class="toolbar-actions">
              <a-button type="text" @click="exitImmersiveMode">
                <CompressOutlined />
              </a-button>
            </div>
          </div>
          
          <!-- 全屏模式的内容 -->
          <div class="immersive-body">
            <component 
              v-if="currentImmersiveSection !== null"
              :is="articleData.sections[currentImmersiveSection]?.componentName"
              :section="articleData.sections[currentImmersiveSection]"
              @update="(updatedSection) => handleSectionUpdate(updatedSection, currentImmersiveSection)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, nextTick, computed, onMounted, reactive, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { 
  ArrowLeftOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  FileTextOutlined,
  PictureOutlined,
  TableOutlined,
  VideoCameraOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  ReloadOutlined,
  EyeOutlined,
  LeftOutlined,
  ExpandOutlined,
  CompressOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue';
import SectionWrapper from './sections/index.vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '../api/api';
import FloatingStats from './FloatingStats.vue';
import TitleSection from './sections/templates/TitleSection.vue';
import TitleSectionPreview from './sections/templates/TitleSectionPreview.vue';
import TitleSectionWithImage from './sections/templates/TitleSectionWithImage.vue';
import TitleSectionWithImagePreview from './sections/templates/TitleSectionWithImagePreview.vue';
import HeroSectionWithVideo from './sections/templates/HeroSectionWithVideo.vue';
import HeroSectionWithVideoPreview from './sections/templates/HeroSectionWithVideoPreview.vue';
import HeroSectionWithMultipleTexts from './sections/templates/HeroSectionWithMultipleTexts.vue';
import HeroSectionWithMultipleTextsPreview from './sections/templates/HeroSectionWithMultipleTextsPreview.vue';
import WhyChooseUsWithSmallBlocks from './sections/templates/WhyChooseUsWithSmallBlocks.vue';
import WhyChooseUsWithBlocks from './sections/templates/WhyChooseUsWithBlocks.vue';
import WhyChooseUsWithBlocksPreview from './sections/templates/WhyChooseUsWithBlocksPreview.vue';
import HowItWorksWithWorkflow from './sections/templates/HowItWorksWithWorkflow.vue';
import HowItWorksWithWorkflowPreview from './sections/templates/HowItWorksWithWorkflowPreview.vue';
import HowItWorksWithBlocks from './sections/templates/HowItWorksWithBlocks.vue';
import HowItWorksWithBlocksPreview from './sections/templates/HowItWorksWithBlocksPreview.vue';
import ProductBenefitsWithBlocks from './sections/templates/ProductBenefitsWithBlocks.vue';
import ProductBenefitsWithBlocksPreview from './sections/templates/ProductBenefitsWithBlocksPreview.vue';
import UserReviewsWithMovingCards from './sections/templates/UserReviewsWithMovingCards.vue';
import UserReviewsWithMovingCardsPreview from './sections/templates/UserReviewsWithMovingCardsPreview.vue';
import SubscriptionCard from './sections/templates/SubscriptionCard.vue';
import SubscriptionCardPreview from './sections/templates/SubscriptionCardPreview.vue';
import Faqs from './sections/templates/Faqs.vue';
import FaqsPreview from './sections/templates/FaqsPreview.vue';
import CallToActionComplex from './sections/templates/CallToActionComplex.vue';
import CallToActionComplexPreview from './sections/templates/CallToActionComplexPreview.vue';
import WhyChooseUsWithStory from './sections/templates/WhyChooseUsWithStory.vue';
import WhyChooseUsWithStoryPreview from './sections/templates/WhyChooseUsWithStoryPreview.vue';
import FeaturesTabbed from './sections/templates/FeaturesTabbed.vue';
import FeaturesTabbedPreview from './sections/templates/FeaturesTabbedPreview.vue';
import MeetOurTeam from './sections/templates/MeetOurTeam.vue';
import MeetOurTeamPreview from './sections/templates/MeetOurTeamPreview.vue';
import JobList from './sections/templates/JobList.vue';
import JobListPreview from './sections/templates/JobListPreview.vue';
import CallToAction from './sections/templates/CallToAction.vue';
import CallToActionPreview from './sections/templates/CallToActionPreview.vue';
import CallToActionWithEmailInput from './sections/templates/CallToActionWithEmailInput.vue';
import CallToActionWithEmailInputPreview from './sections/templates/CallToActionWithEmailInputPreview.vue';
import KeyResultsWithTextBlock from './sections/templates/KeyResultsWithTextBlock.vue';
import KeyResultsWithTextBlockPreview from './sections/templates/KeyResultsWithTextBlockPreview.vue';
import WhyChooseUsWithSmallBlocksPreview from './sections/templates/WhyChooseUsWithSmallBlocksPreview.vue';
import ProductBenefitsWithTable from './sections/templates/ProductBenefitsWithTable.vue';
import ProductBenefitsWithTablePreview from './sections/templates/ProductBenefitsWithTablePreview.vue';
import KeyResultsWithImage from './sections/templates/KeyResultsWithImage.vue';
import KeyResultsWithImagePreview from './sections/templates/KeyResultsWithImagePreview.vue';
import KeyResultsWithCards from './sections/templates/KeyResultsWithCards.vue';
import KeyResultsWithCardsPreview from './sections/templates/KeyResultsWithCardsPreview.vue';
import PageListCard from './sections/templates/PageListCard.vue';
import PageListCardPreview from './sections/templates/PageListCardPreview.vue';
import FeatureComparisonTable from './sections/templates/FeatureComparisonTable.vue';
import FeatureComparisonTablePreview from './sections/templates/FeatureComparisonTablePreview.vue';
import { VERCEL_CONFIG } from '../config/vercelConfig';
import { createCleanComponentData } from '../utils/componentDataFactory';
import { availableComponents } from '../config/availableComponents';
import themeConfig from '../assets/config/themeConfig';
import config from '../config/settings';

export default defineComponent({
  name: 'ArticleCreatePage',
  components: {
    ArrowLeftOutlined,
    DeleteOutlined,
    PlusOutlined,
    FileTextOutlined,
    PictureOutlined,
    TableOutlined,
    VideoCameraOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    AlignLeftOutlined,
    ReloadOutlined,
    EyeOutlined,
    LeftOutlined,
    ExpandOutlined,
    CompressOutlined,
    BarChartOutlined,
    SectionWrapper,
    FloatingStats,
    TitleSection,
    TitleSectionWithImage,
    HeroSectionWithVideo,
    HeroSectionWithMultipleTexts,
    WhyChooseUsWithSmallBlocks,
    WhyChooseUsWithBlocks,
    WhyChooseUsWithStory,
    HowItWorksWithWorkflow,
    HowItWorksWithBlocks,
    ProductBenefitsWithBlocks,
    UserReviewsWithMovingCards,
    Faqs,
    CallToActionComplex,
    FeaturesTabbed,
    KeyResultsWithTextBlock,
    MeetOurTeam,
    JobList,
    CallToActionWithEmailInput,
    ProductBenefitsWithTable,
    KeyResultsWithImage,
    KeyResultsWithCards,
    CallToAction,
    PageListCard,
    TitleSectionPreview,
    TitleSectionWithImagePreview,
    HeroSectionWithVideoPreview,
    HeroSectionWithMultipleTextsPreview,
    WhyChooseUsWithSmallBlocksPreview,
    WhyChooseUsWithBlocksPreview,
    WhyChooseUsWithStoryPreview,
    FeaturesTabbedPreview,
    FaqsPreview,
    CallToActionComplexPreview,
    KeyResultsWithTextBlockPreview,
    MeetOurTeamPreview,
    JobListPreview,
    CallToActionWithEmailInputPreview, 
    HowItWorksWithWorkflowPreview,
    HowItWorksWithBlocksPreview,
    ProductBenefitsWithBlocksPreview,
    UserReviewsWithMovingCardsPreview,
    ProductBenefitsWithTablePreview,
    CallToActionPreview,
    KeyResultsWithImagePreview,
    KeyResultsWithCardsPreview,
    PageListCardPreview,
    SubscriptionCardPreview,
    SubscriptionCard,
    FeatureComparisonTable,
    FeatureComparisonTablePreview
  },

  // 添加 emits 声明
  emits: ['update'],

  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // 将 pageId 的声明移到最前面
    const pageId = computed(() => {
      return route.query.id || route.params.id;
    });
    
    const isEditMode = computed(() => {
      return route.query.mode === 'edit';
    });

    const loading = ref(true);
    const originalArticle = ref(null);
    const n = 1;

    onMounted(async () => {
      try {
        loading.value = true;
        
        // 无论是否编辑模式,都先加载基础信息
        await loadProductInfo();
        await loadVerifiedDomains();
        
        if (isEditMode.value) {
          const response = await apiClient.getArticleById(pageId.value);
          if (response?.code === 200 && response.data) {
            initializeArticleData(response.data);
          }
        }
      } catch (error) {
        console.error('Initialize error:', error);
      } finally {
        loading.value = false;
      }
    });

    const saving = ref(false);
    const activeTab = ref('components');
    const activeCategories = ref(['basic']);
    const articleData = ref({
      title: '',
      subTitle: '',
      description: '',
      summary: '',
      sections: [],
      deploymentMethod: 'subfolder',
      deployTarget: null,
      language: 'en',
      slug: '',
      author: '',
      pageStats: {
        genKeyword: [],
        wordCount: 0,
        keywords: [],
        keywordStats: []
      },
      pageType: 'Landing Page'
    });

    // 格式化件名称显示
    const formatComponentName = (name) => {
      return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // 处理组件拖动开始
    const handleDragStart = (event, component) => {
      // 确保据被确设置
      const data = JSON.stringify(component);
      event.dataTransfer.setData('text/plain', data);
      event.dataTransfer.effectAllowed = 'move';
    };

    // 修改为只处理组件列表中拖拽排序
    const handleSectionDragStart = (event, index) => {
      dragSourceIndex.value = index;
      event.dataTransfer.effectAllowed = 'move';
    };

    const handleSectionDrop = (event, targetIndex) => {
      event.preventDefault();
      
      if (dragSourceIndex.value !== null && dragSourceIndex.value !== targetIndex) {
        // 获取要移动的组
        const movedSection = articleData.value.sections[dragSourceIndex.value];
        
        // 从原位置删除
        articleData.value.sections.splice(dragSourceIndex.value, 1);
        
        // 插入到新位置
        articleData.value.sections.splice(targetIndex, 0, movedSection);
      }
      
      dragSourceIndex.value = null;
    };

    // 主内容只处理新组件的添加
    const handleDrop = (event) => {
      event.preventDefault();
      try {
        const data = event.dataTransfer.getData('text/plain');
        if (!data) return;
        
        const componentData = JSON.parse(data);
        addComponent(componentData);
      } catch (error) {
        console.error('Drop error:', error);
        message.error('Failed to add component');
      }
    };

    const dragSourceIndex = ref(null);

    // 添加组件到文章
    const addComponent = (component, index = null) => {
      try {
        const newSection = createCleanComponentData(component.type);

        if (index !== null) {
          articleData.value.sections.splice(index + 1, 0, newSection);
        } else {
          articleData.value.sections.push(newSection);
        }

        nextTick(() => {
          const sections = document.querySelectorAll('.section-wrapper');
          const lastSection = sections[sections.length - 1];
          if (lastSection) {
            lastSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      } catch (error) {
        message.error('Failed to add component');
      }
    };

    // 移除组件
    const removeSection = (index) => {
      articleData.value.sections.splice(index, 1);
    };

    // 修改 handleSectionUpdate 方法
    const handleSectionUpdate = (updatedSection, index) => {
      try {
        articleData.value.sections[index] = {
          ...articleData.value.sections[index],
          ...updatedSection
        };
      } catch (error) {
        console.error('Section update error:', error);
        message.error(`Failed to update section: ${error.message}`);
      }
    };

    const handleSave = async (shouldQuit = false) => {
      try {
        // Check if slug contains spaces
        if (articleData.value.slug && articleData.value.slug.includes(' ')) {
          message.error('Page slug cannot contain spaces');
          return;
        }

        // 如果是编辑模式，检查 slug
        if (isEditMode.value) {
          // 主动触发 slug 检查
          await handleSlugBlur();
          
          // 如果 slug 无效，阻止保存
          if (!isSlugValid.value) {
            message.error('Slug is duplicated');
            return;
          }

          // 编辑模式下检查 slug
          if (!articleData.value.slug) {
            message.error('Page slug is required');
            return;
          }
        }

        // 修改必填字段验证 - 移除 slug 验证
        const requiredFields = {
          title: 'Page title',
          description: 'Page description',
          pageType: 'Type',
          language: 'Language',
          author: 'Author',
          keywords: 'Keywords'
        };

        // 检查所有必填字段
        for (const [field, label] of Object.entries(requiredFields)) {
          if (field === 'keywords') {
            // 特殊处理 keywords 数组
            if (!articleData.value[field] || !articleData.value[field].length) {
              message.error(`${label} is required`);
              return;
            }
          } else if (!articleData.value[field]) {
            message.error(`${label} is required`);
            return;
          }
        }

        saving.value = true;
        const hide = message.loading('Saving...', 0);

        const customerId = localStorage.getItem('currentCustomerId');
        if (!customerId) {
          throw new Error('Customer ID not found');
        }

        // 处理 keywords将数组转换为逗号分隔的字符串
        const processedKeywords = Array.isArray(articleData.value.keywords)
          ? articleData.value.keywords.filter(k => k).join(',')
          : (articleData.value.keywords || '');

        let response;
        
        if (isEditMode.value) {
          // 编辑模式使用全量更新
          const updatePromises = [];

          // 直接更新页面所有信息
          const pageUpdateData = {
            title: articleData.value.title,
            subTitle: articleData.value.subTitle,
            description: articleData.value.description,
            summary: articleData.value.summary,
            topic: articleData.value.topic,
            pageType: articleData.value.pageType,
            slug: articleData.value.slug,
            author: articleData.value.author,  // 确保使用表单中的 author
            publishUrl: articleData.value.publishUrl, // 添加 publishUrl
            relatedKeyword: processedKeywords,
            numberOfWords: 2000
          };
          
          updatePromises.push(
            apiClient.updatePage(pageId.value, pageUpdateData)
          );

          updatePromises.push(
            apiClient.updateFullSections(pageId.value, {sections: articleData.value.sections})
          );

          response = await Promise.all(updatePromises);
        } else {
          const requestData = {
            page: {
              author: articleData.value.author,  // 确保使用表单中的 author
              customerId: customerId,
              description: articleData.value.description || '',
              language: articleData.value.language,
              subTitle: articleData.value.subTitle,
              summary: articleData.value.summary || '',
              title: articleData.value.title,
              slug: articleData.value.slug || '',
              topic: articleData.value.topic,
              pageType: articleData.value.pageType,
              publishUrl: articleData.value.publishUrl, // 添加 publishUrl
              relatedKeyword: processedKeywords,
              numberOfWords: 2000
            },
            sections: articleData.value.sections
          };

          response = await apiClient.createManualPage(requestData);
        }

        hide();
        message.success('Saved successfully');

        if (shouldQuit) {
          router.push('/task-management');
        } else if (!isEditMode.value) {
          const pageId = response.data.pageId
          // 使用 window.location.href 来进行真实的页面跳转
          window.location.href = `/page-writer?mode=edit&id=${pageId}&lang=${articleData.value.language}&refresh=true`;
        }

      } catch (error) {
        console.error('Save failed:', error);
        message.error('Save failed: ' + (error.message || 'Unknown error'));
      } finally {
        saving.value = false;
      }
    };

    // 回上一页
    const handleBack = () => {
      router.push('/task-management');
    };

    // 添加关键词统计方法
    const getKeywordStats = (keyword) => {
      const stats = articleData.value?.pageStats?.keywordStats?.find(stat => 
        stat.keyword.toLowerCase() === keyword.toLowerCase()
      );
      return stats;
    };

    // 添加关键词统计的计算��法
    const calculateKeywordStats = () => {
      if (!articleData.value.sections || articleData.value.sections.length === 0) {
        return;
      }

      // 始化 pageStats 如果不存在
      if (!articleData.value.pageStats) {
        articleData.value.pageStats = {
          genKeyword: [],
          wordCount: 0,
          keywords: [],
          keywordStats: []
        };
      }

      // 获取所有文本内容
      let allContent = '';
      articleData.value.sections.forEach(section => {
        // 递归获取所有文本内容
        const extractText = (obj) => {
          if (!obj) return '';
          if (typeof obj === 'string') return obj + ' ';
          if (Array.isArray(obj)) {
            return obj.map(item => extractText(item)).join(' ');
          }
          return Object.values(obj).map(value => extractText(value)).join(' ');
        };
        
        allContent += extractText(section) + ' ';
      });

      // 计算关键词统计
      const words = allContent.toLowerCase().split(/\s+/);
      const totalWords = words.length;

      articleData.value.pageStats.keywordStats = 
        (articleData.value.pageStats.genKeyword || []).map(keyword => {
          const keywordLower = keyword.toLowerCase();
          const wordCount = words.filter(word => word === keywordLower).length;
          const density = (wordCount / totalWords) * 100;
          
          return {
            keyword,
            wordCount,
            density
          };
        });

      articleData.value.pageStats.wordCount = totalWords;
    };

    const refreshingMetrics = ref(false);
    
    const handleRefreshMetrics = async () => {
      refreshingMetrics.value = true;
      try {
        calculateKeywordStats();
        await new Promise(resolve => setTimeout(resolve, 500));
        message.success('Statistics updated');
      } catch (error) {
        message.error('Failed to update statistics');
      } finally {
        refreshingMetrics.value = false;
      }
    };

    const scrollToSection = (sectionId) => {
      nextTick(() => {
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
          const headerHeight = 64;
          const scrollContainer = document.querySelector('.editor-content');
          const rect = targetSection.getBoundingClientRect();
          
          const targetPosition = rect.top + scrollContainer.scrollTop - headerHeight - 20;
          
          scrollContainer.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    };

    // 添加语言标签获取方法
    const getLanguageLabel = (langCode) => {
      const languages = {
        'en': 'English'
      };
      return languages[langCode] || langCode;
    };

    const productInfo = ref(null);

    const loadProductInfo = async () => {
      try {
        const response = await apiClient.getProductsByCustomerId();
        
        if (response?.code === 200) {
          productInfo.value = response.data;
        } else {
          // 处理错误应
          message.error('Failed to load product information');
          productInfo.value = {}; // 设置为空对象而不是 null
        }
      } catch (error) {
        console.error('Failed to load product information:', error);
        message.error('Failed to load product information: ' + (error.message || 'Unknown error'));
        productInfo.value = {}; // 设置空对象而不是 null
      }
    };

    const getPreviewUrl = (article) => {
      if (!article?.slug || !article?.language) {
        return '';
      }
      
      // 使用 productInfo 中的 projectWebsite 作为 userDomain
      const userDomain = productInfo.value?.projectWebsite || '';
      const previewDomain = config.domains.preview.replace(/\/$/, '');
      
      // 构建预览 URL，将 userDomain 放在最后
      return `${previewDomain}/${article.language}/${article.slug}/${userDomain}`;
    };

    const handlePreview = () => {
      const previewUrl = getPreviewUrl({
        slug: articleData.value.slug,
        language: articleData.value.language
      });
      window.open(previewUrl, '_blank');
    };

    // 添加新的响应式变量
    const publishing = ref(false)
    const publishModal = ref({
      visible: false,
      title: '',
      content: '',
      action: null,
      loading: false
    });

    const getPublishBlockReasons = () => {
      const reasons = [];

      // 检查是否有已验证的域名
      if (verifiedDomains.value.length === 0) {
        reasons.push('No verified domain available. Please verify a domain in Settings first.');
      }

      const requiredFields = {
        title: 'Title',
        description: 'Description',
        pageType: 'Type',
        language: 'Language',
        author: 'Author',
        keywords: 'Keywords'
      };

      // 检查所有必填字段
      for (const [field, label] of Object.entries(requiredFields)) {
        const value = articleData.value[field];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          reasons.push(`${label} is required`);
        }
      }

      // 检查 slug
      if (!articleData.value.slug) {
        reasons.push('Page Slug is required');
      }

      // 检查内容部分
      if (!articleData.value.sections || articleData.value.sections.length === 0) {
        reasons.push('At least one content section is required');
      }

      return reasons;
    };

    const getPublishTooltip = () => {
      const reasons = getPublishBlockReasons();
      if (reasons.length > 0) {
        return 'Cannot publish because:\n' + reasons.join('\n');
      }
      return '';
    };

    const canPublish = () => {
      return getPublishBlockReasons().length === 0;
    };

    const handlePublish = async () => {
      // 检查是否可以发布
      if (!canPublish()) {
        message.error('Please fill in all required fields before publishing');
        return;
      }

      // 设置弹窗状态
      publishModal.value = {
        visible: true,
        title: articleData.value.publishStatus === 'publish' ? 'Confirm Unpublish' : 'Confirm Publish',
        loading: false
      };
    };

    const confirmPublish = async () => {
      if (!articleData.value.publishUrl) {
        publishModal.value.visible = false;
        return;
      }

      try {
        publishing.value = true;
        publishModal.value.loading = true;
        const isPublished = articleData.value.publishStatus === 'publish';
        
        // 只有非英语语言才添加语言路径
        const langPath = articleData.value.language === 'en' ? '' : `/${articleData.value.language}`;
        const fullPublishURL = `${articleData.value.publishUrl}${langPath}/${articleData.value.slug}`;

        if (isPublished) {
          await apiClient.updatePageStatus(pageId.value, 'unpublish', fullPublishURL);
          message.success('Unpublished successfully');
          articleData.value.publishStatus = 'create';
        } else {
          await apiClient.updatePageStatus(pageId.value, 'publish', fullPublishURL);
          message.success('Published successfully');
          articleData.value.publishStatus = 'publish';
        }

      } catch (error) {
        console.error('Publish action failed:', error);
        message.error('Operation failed: ' + (error.message || 'Unknown error'));
      } finally {
        publishing.value = false;
        publishModal.value.loading = false;
        publishModal.value.visible = false;
      }
    };

    const handlePublishCancel = () => {
      publishModal.value.visible = false;
    };

    // 添加 verifiedDomains 响应式变量
    const verifiedDomains = ref([])

    // 添加加载域名信息的方法
    const loadVerifiedDomains = async () => {
      try {
        const projectId = VERCEL_CONFIG.PROJECT_ID;
        const response = await apiClient.getVercelDomainInfo(projectId);
        
        // 确保 productInfo 已加载
        if (!productInfo.value) {
          await loadProductInfo();
        }
        
        // 获取验证过的域名
        const domains = response?.domains
          ?.filter(domain => {
            const isVerified = domain.verified || !domain.configDetails?.misconfigured;
            const hasProductInfo = productInfo.value?.projectWebsite === domain.apexName && productInfo.value?.domainStatus;
            return isVerified && hasProductInfo;
          })
          ?.map(domain => domain.name) || [];

        // 加载子文件夹
        await loadSubfolders();
        
        // 合并域名和子文件夹路径
        verifiedDomains.value = [
          ...domains,
          ...(subfolders.value.map(subfolder => `${productInfo.value?.projectWebsite}/${subfolder}`))
        ];

        // 更新 availablePublishUrls
        availablePublishUrls.value = [...verifiedDomains.value];
        
        // 关键修改：在所有URL加载完成后，如果当前是编辑模式且有 publishUrl，
        // 检查并确保它在可用列表中
        if (isEditMode.value && articleData.value.publishUrl) {
          if (!availablePublishUrls.value.includes(articleData.value.publishUrl)) {
            // 如果当前的 publishUrl 不在可用列表中，将其添加到列表中
            availablePublishUrls.value.push(articleData.value.publishUrl);
          }
        }

      } catch (error) {
        message.error('Failed to load publish URL options');
      }
    };

    // 添加新的响应式变量
    const isSideNavCollapsed = ref(false);
    
    // 添加切换边栏的方法
    const toggleSideNav = () => {
      isSideNavCollapsed.value = !isSideNavCollapsed.value;
    };

    // 1. 首先声明所有需要的响应式变量
    const subfolders = ref([]);
    const hasLoadedSubfolders = ref(false);
    const loadingDeployTargets = ref(false);
    const availableSubdomains = ref([]);
    const availableSubfolders = ref([]);

    // 2. 定义 loadSubfolders 函数
    const loadSubfolders = async () => {
      // 如果已经加载过，直接返回
      if (hasLoadedSubfolders.value) {
        return;
      }

      try {
        const response = await apiClient.getSubfolders();
        if (response?.code === 200 && response?.data) {
          subfolders.value = response.data;
          hasLoadedSubfolders.value = true;
        }
      } catch (error) {
        console.error('Failed to load subfolders:', error);
        message.error('Failed to load subfolder options');
      }
    };

    // 3. 然后再定义 loadDeployTargets 函数
    const loadDeployTargets = async (method) => {
      loadingDeployTargets.value = true;
      try {
        if (method === 'subdomain') {
          const projectId = VERCEL_CONFIG.PROJECT_ID;
          const response = await apiClient.getVercelDomainInfo(projectId);
          
          if (response?.domains) {
            // 先清现有数据
            availableSubdomains.value = [];
            
            // 过滤有效域名，只留当前客户域名相关的子域名
            const filteredDomains = response.domains.filter(domain => {
              const isVerified = domain.verified || !domain.configDetails?.misconfigured;
              const belongsToCustomer = domain.apexName === productInfo.value?.projectWebsite;
              return isVerified && domain.name && belongsToCustomer;
            });

            // 确保数据更新是响应式的
            availableSubdomains.value = [...filteredDomains];
            
            // 如果有可用域名，设置第一个为默认值
            if (filteredDomains.length > 0) {
              const defaultDomain = filteredDomains[0].name;
              articleData.value.deployTarget = defaultDomain;
            }
          }
        } else {
          // 确保 subfolders 已加载
          if (!hasLoadedSubfolders.value) {
            await loadSubfolders();
          }
          
          // 使用已加载的 subfolders 数据
          const folders = subfolders.value.map(folder => ({
            text: folder
          }));
          
          availableSubfolders.value = [...folders];
          
          if (folders.length > 0) {
            await nextTick();
            articleData.value = {
              ...articleData.value,
              deployTarget: folders[0].text
            };
          }
        }
      } catch (error) {
        console.error('Failed to load deploy targets:', error);
        message.error('Failed to load deployment options');
      } finally {
        loadingDeployTargets.value = false;
      }
    };

    watch(() => articleData.value.deploymentMethod, (newMethod) => {
      if (newMethod) {
        loadDeployTargets(newMethod);
      }
    }, { immediate: true });

    watch(() => availableSubfolders.value, (newFolders) => {
      if (newFolders?.length > 0) {
        nextTick(() => {
          articleData.value.deployTarget = newFolders[0].text;
        });
      }
    }, { deep: true });

    // 在编辑模式下初始化数据时添加部署相关信息
    const initializeArticleData = (data) => {
      articleData.value = {
        ...data,
        sections: data.sections || [],
        slug: data.slug || '',
        keywords: data.relatedKeyword ? data.relatedKeyword.split(',') : [],
        topic: data.topic || '',
        pageType: data.pageType || 'Landing Page',
        language: data.language || 'en',
        publishUrl: data.publishURL || null,
        pageStats: JSON.parse(JSON.stringify(data.pageStats))
      };
    };

    // 添加新的响应式变量
    const availablePublishUrls = ref([]);

    // 添加预览弹窗相关的响应式数据
    const previewModal = reactive({
      visible: false,
      title: '',
      componentName: '',
      componentData: null,
      selectedComponent: null
    });

    // 添加防抖函数
    const debounce = (fn, delay) => {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    };

    // 修改显示预览的方法
    const showComponentPreview = debounce((component, event) => {
      const componentData = createCleanComponentData(component.type);
      
      hoverPreview.value = {
        visible: true,
        componentName: component.type,
        componentData,
        position: {
          top: `${window.innerHeight / 2}px`,
          left: `${window.innerWidth / 2}px`
        }
      };
    }, 100); // 100ms 的防抖延迟

    // 修改隐藏预览的方法
    const hideComponentPreview = debounce(() => {
      hoverPreview.value.visible = false;
    }, 200); // 稍微长一点的延迟，防止鼠标移动时闪烁

    // 处理预览取消
    const handlePreviewCancel = () => {
      previewModal.visible = false;
    };

    // 处理预览中的添加操作
    const handlePreviewAdd = () => {
      if (previewModal.selectedComponent) {
        addComponent(previewModal.selectedComponent);
      }
      previewModal.visible = false;
    };

    // 添加处理粘贴事件的方法
    const handleKeywordsPaste = (event) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData('text');
      const keywords = pastedText
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword);
      
      // 更新关键词数组，确保不重复
      articleData.value.keywords = [
        ...new Set([
          ...(articleData.value.keywords || []),
          ...keywords
        ])
      ];
    };

    // 添加新的响应式变量
    const slugStatus = ref('');
    const slugError = ref('');
    const isSlugValid = ref(true);

    // 添加 slug 检查方法
    const handleSlugBlur = async () => {
      const slug = articleData.value.slug?.trim();
      
      // 重置状态
      slugStatus.value = '';
      slugError.value = '';
      isSlugValid.value = true;

      // 如果 slug 为空，不进行检查
      if (!slug) {
        return;
      }

      try {
        const response = await apiClient.checkSlugExists(slug, pageId.value);
        
        if (response.code === 200) {
          // data 为 true 表示重复，false 表示不重复
          if (response.data === true) {
            slugStatus.value = 'error';
            slugError.value = 'This slug is already in use, please choose another one';
            isSlugValid.value = false;
          } else {
            // slug 不重复，可以使用
            slugStatus.value = 'success';
            slugError.value = '';
            isSlugValid.value = true;
          }
        } else {
          // API 返回非 200 状态码
          throw new Error(response.message || 'Failed to check slug');
        }
      } catch (error) {
        console.error('Check slug failed:', error);
        message.error('Failed to check slug: ' + (error.message || 'Unknown error'));
        // 发生错误时设置为无效状态
        slugStatus.value = 'error';
        isSlugValid.value = false;
      }
    };

    // 添加自动保存相关的响应式变量
    const autoSaveInterval = ref(null);
    const lastAutoSaveTime = ref(null);

    // 检查必填字段是否都已填写
    const checkRequiredFields = () => {
      const requiredFields = {
        title: 'Page title',
        description: 'Page description',
        pageType: 'Type',
        language: 'Language',
        author: 'Author',
        keywords: 'Keywords'
      };

      // 检查所有必填字段
      for (const [field, label] of Object.entries(requiredFields)) {
        if (field === 'keywords') {
          // 特殊处理 keywords 数组
          if (!articleData.value[field] || !articleData.value[field].length) {
            return false;
          }
        } else if (!articleData.value[field]) {
          return false;
        }
      }

      // 编辑模式下检查 slug，但如果是根页面则跳过检查
      if (isEditMode.value && !articleData.value.slug) {
        return false;
      }

      return true;
    };

    // 修改自动保存方法
    const autoSave = async () => {
      // 如果不是编辑模式,直接返回
      if (!isEditMode.value) {
        return;
      }

      try {
        // Check if slug contains spaces
        if (articleData.value.slug && articleData.value.slug.includes(' ')) {
          return;
        }

        // 检查是否满足自动保存条件
        if (!checkRequiredFields()) {
          return;
        }

        // 检查是否有内容sections
        if (!articleData.value.sections || articleData.value.sections.length === 0) {
          return;
        }

        // 新增: 主动触发 slug 检查
        await handleSlugBlur();
        
        // 新增: 检查 slug 是否有效
        if (!isSlugValid.value) {
          return;
        }

        const customerId = localStorage.getItem('currentCustomerId');
        if (!customerId) {
          return;
        }

        // 处理关键词
        const processedKeywords = Array.isArray(articleData.value.keywords)
          ? articleData.value.keywords.filter(k => k).join(',')
          : (articleData.value.keywords || '');

        // 编辑模式下的自动保存
        const updatePromises = [];

        const pageUpdateData = {
          title: articleData.value.title,
          subTitle: articleData.value.subTitle,
          description: articleData.value.description,
          summary: articleData.value.summary,
          topic: articleData.value.topic,
          pageType: articleData.value.pageType,
          slug: articleData.value.slug,
          author: articleData.value.author,
          publishUrl: articleData.value.publishUrl,
          relatedKeyword: processedKeywords,
          numberOfWords: 2000
        };

        updatePromises.push(
          apiClient.updatePage(pageId.value, pageUpdateData)
        );

        updatePromises.push(
          apiClient.updateFullSections(pageId.value, {sections: articleData.value.sections})
        );

        await Promise.all(updatePromises);

        lastAutoSaveTime.value = new Date();
        
        message.success({
          content: 'Auto-saved successfully',
          duration: 2,
          class: 'auto-save-message'
        });

      } catch (error) {
        console.error('Auto-save failed:', error);
        message.error({
          content: 'Auto-save failed',
          duration: 2
        });
      }
    };

    // 将多个 onUnmounted 合并为一个
    onUnmounted(() => {
      // 清除自动保存定时器
      if (autoSaveInterval.value) {
        clearInterval(autoSaveInterval.value);
      }
    });

    // 监听文章数据变化
    watch(() => articleData.value, () => {
      // 当数据发生变化时，可以在这里添加额外的逻辑
    }, { deep: true });

    // 添加 getPreviewPublishUrl 计算属性
    const getPreviewPublishUrl = computed(() => {
      if (!articleData.value.publishUrl) {
        return '';
      }

      const baseUrl = articleData.value.publishUrl;
      // 只有非英语语言才添加语言路径
      const langPath = articleData.value.language === 'en' ? '' : `/${articleData.value.language}`;
      const slug = articleData.value.slug || '[slug]';

      return `${baseUrl}${langPath}/${slug}`;
    });

    // 添加新的方法来格式化分类标题
    const getCategoryHeader = (category) => {
      return `${category.category}`;
    };

    // 修改必填字段验证
    const requiredFields = computed(() => {
      const fields = {
        title: 'Page title',
        description: 'Page description',
        pageType: 'Type',
        language: 'Language',
        author: 'Author',
        keywords: 'Keywords'
      };
      
      // 只在编辑模式下添加 slug 验证
      if (isEditMode.value) {
        fields.slug = 'Slug';
      }
      
      return fields;
    });

    // 添加启动自动保存的逻辑
    onMounted(() => {
      // 只在编辑模式下启动自动保存
      if (isEditMode.value) {
        // 设置 5 分钟自动保存一次
        autoSaveInterval.value = setInterval(autoSave, 1 * 60 * 1000);
        
        // 监听页面关闭事件
        window.addEventListener('beforeunload', () => {
          if (autoSaveInterval.value) {
            clearInterval(autoSaveInterval.value);
          }
        });
      }
    });

    // 添加沉浸式模式相关的响应式变量
    const currentImmersiveSection = ref(null);
    
    // 切换沉浸式模式
    const toggleImmersiveMode = (index) => {
      if (currentImmersiveSection.value === index) {
        exitImmersiveMode();
      } else {
        currentImmersiveSection.value = index;
        // 禁用body滚动
        document.body.style.overflow = 'hidden';
      }
    };
    
    // 退出沉浸式模式
    const exitImmersiveMode = () => {
      currentImmersiveSection.value = null;
      // 恢复body滚动
      document.body.style.overflow = '';
    };
    
    // 监听 ESC 键退出全屏
    onMounted(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape' && currentImmersiveSection.value !== null) {
          exitImmersiveMode();
        }
      };
      
      window.addEventListener('keydown', handleEsc);
      
      onUnmounted(() => {
        window.removeEventListener('keydown', handleEsc);
      });
    });

    // 添加查看已发布页面的方法
    const handleViewPublished = () => {
      if (articleData.value.publishStatus === 'publish' && articleData.value.publishUrl) {
        const baseUrl = articleData.value.publishUrl.startsWith('http') 
          ? articleData.value.publishUrl 
          : `https://${articleData.value.publishUrl}`;
          
        // 只有非英语语言才添加语言路径
        const langPath = articleData.value.language === 'en' ? '' : `/${articleData.value.language}`;
        const publishedUrl = `${baseUrl}${langPath}/${articleData.value.slug}`;
        window.open(publishedUrl, '_blank');
      }
    };

    // 添加分析弹窗相关的响应式变量
    const analysisModal = ref({
      visible: false
    });
    
    // 显示分析弹窗
    const showAnalysisModal = () => {
      analysisModal.value.visible = true;
    };
    
    // 隐藏分析弹窗
    const hideAnalysisModal = () => {
      analysisModal.value.visible = false;
    };

    // 替换原有的预览相关变量
    const hoverPreview = ref({
      visible: false,
      componentName: '',
      componentData: null,
      position: {
        top: '0px',
        left: '0px'
      }
    });

    return {
      loading,
      saving,
      activeTab,
      activeCategories,
      articleData,
      formatComponentName,
      handleDragStart,
      handleDrop,
      handleSectionDragStart,
      handleSectionDrop,
      addComponent,
      removeSection,
      handleSectionUpdate,
      handleSave,
      handleBack,
      availableComponents,
      getKeywordStats,
      calculateKeywordStats,
      refreshingMetrics,
      handleRefreshMetrics,
      scrollToSection,
      isEditMode,
      pageId,
      getLanguageLabel,
      originalArticle,
      productInfo,
      handlePreview,
      publishing,
      publishModal,
      canPublish,
      getPublishTooltip,
      handlePublish,
      confirmPublish,
      handlePublishCancel,
      verifiedDomains,
      loadVerifiedDomains,
      isSideNavCollapsed,
      toggleSideNav,
      loadingDeployTargets,
      availableSubdomains,
      availableSubfolders,
      previewModal,
      showComponentPreview,
      handlePreviewCancel,
      handlePreviewAdd,
      themeConfig,
      handleKeywordsPaste,
      subfolders,
      loadSubfolders,
      availablePublishUrls,
      slugStatus,
      slugError,
      handleSlugBlur,
      lastAutoSaveTime,
      getPreviewPublishUrl,
      getCategoryHeader, // 添加到返回对象中
      requiredFields,
      currentImmersiveSection,
      toggleImmersiveMode,
      exitImmersiveMode,
      handleViewPublished,
      analysisModal,
      showAnalysisModal,
      hideAnalysisModal,
      hoverPreview,
      hideComponentPreview
    };
  }
});
</script>

<style scoped>
/* 修改最外层容器样式 */
.article-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  width: 100%;
  overflow-x: auto;
}

/* 修改主内容区域样式 */
.editor-content {
  position: relative;
  flex: 1 1 auto; /* 让它可以自动扩展填充空间 */
  overflow-y: auto;
  height: 100vh;
  padding: 88px 32px 32px;
  margin-left: 356px;
  width: calc(100% - 356px);
}

.editor-content.expanded {
  margin-left: 104px;
  width: calc(100% - 104px);
}

/* 确保内容容器自动撑满 */
.sections-container {
  width: 100%;
  max-width: none;
}

/* 修改基础信息表单样式 */
.info-section {
  width: 100%;
  margin-bottom: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

/* 修改表单网格布局 */
.form-grid {
  width: 100%;
}

/* 左侧导航式增强 */
.side-nav {
  position: fixed;
  left: 40px;
  top: 88px;
  bottom: 24px;
  width: 300px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-nav.collapsed {
  width: 48px;
  overflow: hidden;
}

.collapse-button {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.collapse-button:hover {
  background: #f0f9ff;
  border-color: #38BDF8;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.2);
}

.collapse-button:active {
  transform: translateY(-50%) scale(0.95);
}

.collapse-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: #64748b;
  transition: all 0.3s ease;
}

.collapse-button:hover .collapse-icon {
  color: #38BDF8;
}

.collapse-icon .anticon {
  font-size: 10px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-icon .anticon.rotated {
  transform: rotate(180deg);
}

/* 优化收缩动画 */
.side-nav {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-nav.collapsed .collapse-button {
  right: 0px;
}

/* 组件列表样式 */
.components-list {
  padding: 16px;
  height: calc(100vh - 180px);
  overflow-y: auto;
}

/* 组件项样式 */
.component-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  position: relative;
}

.component-item:hover {
  background: rgba(56, 189, 248, 0.05);
  border-color: #38BDF8;
  transform: translateX(4px);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.2);
}

.component-item:active {
  transform: translateX(4px) scale(0.98);
}

/* 空状态提示 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #f8fafc;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  margin: 24px 0;
}

.empty-state p {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  padding: 16px 24px;
  background: rgba(56, 189, 248, 0.05);
  border-radius: 8px;
  text-align: center;
  line-height: 1.5;
}

/* 放相样式 */
.section-wrapper {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  /* 移除多余的阴影和overflow */
  box-shadow: none;
  overflow: visible;
}

.section-wrapper[data-drag-over="true"]::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: #38BDF8;
  bottom: -2px;
}

/* Section 头部样式增强 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.section-actions {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 10;
  display: flex; /* 使用 flex 布局 */
  gap: 8px; /* 设置按钮之间的间距 */
}

.action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.action-btn.ant-btn-dangerous:hover {
  background: #fff2f0;
  color: #ff4d4f;
}

/* Collapse 面板样式优化 */
:deep(.ant-collapse) {
  border: none;
  background: transparent;
}

:deep(.ant-collapse-item) {
  border: none;
  margin-bottom: 8px;
}

:deep(.ant-collapse-header) {
  display: flex !important;
  align-items: center !important;
  padding: 12px 16px !important;
  background: #f8fafc;
  border-radius: 8px !important;
  line-height: 1 !important; /* 添加这行 */
}

:deep(.ant-collapse-expand-icon) {
  padding-inline-end: 8px !important;
  padding-inline-start: 0 !important;
  margin-top: 0 !important; /* 添加这行 */
  height: auto !important; /* 添加这行 */
}

:deep(.ant-collapse-header-text) {
  flex: 1 !important;
  font-weight: 500;
  color: #1f2937;
  line-height: 1 !important; /* 添加这行 */
  display: flex !important; /* 添加这行 */
  align-items: center !important; /* 添加这行 */
}

:deep(.ant-collapse-content) {
  border: none;
  background: transparent;
}

:deep(.ant-collapse-content-box) {
  padding: 16px 8px !important;
}

/* 顶部操作栏样式 */
.editor-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 64px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid transparent;
  border-radius: 50%;
  border-top-color: #38BDF8;
  border-right-color: #0EA5E9;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式布局调整 */
@media screen and (max-width: 1400px) {
  .side-nav {
    width: 280px;
  }
  
  .editor-content {
    margin-left: 336px;
  }
  
  .editor-content.expanded {
    margin-left: 84px;
  }
}

@media screen and (max-width: 1200px) {
  .side-nav {
    width: 240px;
  }
  
  .editor-content {
    margin-left: 296px;
    padding: 88px 24px 24px;
  }
}

@media screen and (max-width: 1024px) {
  .article-editor {
    min-width: 900px; /* 设置较小屏下的最小宽度 */
  }
  
  .editor-content {
    min-width: 500px;
  }
}

/* 按钮式优化 */
:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #38BDF8, #0EA5E9);
  border: none;
  height: 36px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

:deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #0EA5E9, #0284C7);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(56, 189, 248, 0.2);
}

/* 滚动条美化 */
.editor-content::-webkit-scrollbar {
  width: 6px;
}

.editor-content::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Tabs 样式优化 */
:deep(.ant-tabs) {
  height: 100%;
}

:deep(.ant-tabs-nav) {
  margin: 0;
  padding: 8px 8px 0;
  background: #ffffff;
}

:deep(.ant-tabs-tab) {
  padding: 8px 16px;
  margin: 0 4px !important;
}

:deep(.ant-tabs-tab-active) {
  background: #38BDF8 !important;
  border-radius: 6px;
}

:deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #ffffff !important;
  font-weight: 500;
}

:deep(.ant-tabs-ink-bar) {
  display: none;
}

/* 修改样式 */
.sections-container {
  width: 100%;
  max-width: none;
  min-width: 1100px; /* 增加最小宽度 */
}

.section-wrapper {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

.section-actions {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 10;
  display: flex; /* 使用 flex 布局 */
  gap: 8px; /* 设置按钮之间的间距 */
}

.action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.action-btn.ant-btn-dangerous:hover {
  background: #fff2f0;
  color: #ff4d4f;
}

/* 美组列表的滚动条 */
.components-list::-webkit-scrollbar {
  width: 6px;
}

.components-list::-webkit-scrollbar-track {
  background: transparent;
}

.components-list::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.components-list::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* 添加拖拽相关样式 */
.section-wrapper[draggable="true"] {
  cursor: move;
}

.section-wrapper[draggable="true"]:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-wrapper.dragging {
  opacity: 0.5;
}

/* 添加组件标签样式 */
.component-label {
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 10;
  background: rgba(56, 189, 248, 0.1);
  color: #0284C7;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 调整顶部操作栏高 */
.editor-header {
  height: auto;
  min-height: 64px;
  padding: 12px 32px;
}

:deep(.anticon-reload) {
  font-size: 14px;
}

:deep(.ant-btn-text) {
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-btn-text:hover) {
  background: rgba(56, 189, 248, 0.1);
  color: #38BDF8;
}

/* 添加只读字段样式 */
.readonly-field {
  padding: 4px 11px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #595959;
  min-height: 32px;
  display: flex;
  align-items: center;
}

/* 改按钮样式 */
.header-actions {
  display: flex;
  gap: 12px;
}

:deep(.ant-btn-default) {
  border-color: #d9d9d9;
  color: #595959;
}

:deep(.ant-btn-default:hover) {
  color: #38BDF8;
  border-color: #38BDF8;
}

/* 添加输入框样式 */
:deep(.title-input), :deep(.subtitle-input) {
  .ant-input {
    font-size: 16px;
    padding: 12px;
    line-height: 1.5;
    border-radius: 8px;
  }
  
  .ant-input:focus {
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  }
}

/* Info section 样式 */
.info-section {
  margin-bottom: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.info-section .basic-info-form {
  padding: 32px 12px 8px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.ant-form-item-label) {
  padding: 0;
  line-height: 24px;
  
  label {
    font-size: 12px;
    color: #4b5563;
    height: 20px;
  }
}

:deep(.ant-form-item-control-input) {
  min-height: 28px;
}

:deep(.ant-input), :deep(.ant-select-selector) {
  height: 28px !important;
  padding: 0 8px !important;
  font-size: 13px;
}

:deep(.ant-select-selection-search-input) {
  height: 26px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 26px !important;
}

.readonly-field {
  padding: 0 8px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  height: 28px;
  display: flex;
  align-items: center;
  font-size: 13px;
}

.component-label {
  position: absolute;
  left: 12px;
  top: 8px;
  z-index: 10;
  background: rgba(56, 189, 248, 0.1);
  color: #0284C7;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 添加 textarea 相关样式 */
:deep(.ant-input[type="textarea"]) {
  padding: 4px 8px !important;
  font-size: 13px;
  line-height: 1.5;
  min-height: auto !important;
}

:deep(.ant-input-textarea-show-count::after) {
  font-size: 12px;
  margin-top: 2px;
}

/* TDK 区域样式增强 */
.tdk-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.tdk-label {
  font-size: 14px;
  font-weight: 600;
  color: #0284C7;
  margin-bottom: 12px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tdk-label::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #38BDF8;
  border-radius: 2px;
  display: inline-block;
}

/* TDK 输入框样式增强 */
.tdk-section :deep(.ant-form-item) {
  margin-bottom: 12px;
}

.tdk-section :deep(.ant-input),
.tdk-section :deep(.ant-select-selector) {
  border-color: #e5e7eb;
  background: #ffffff;
  transition: all 0.3s ease;
}

.tdk-section :deep(.ant-input:hover),
.tdk-section :deep(.ant-select-selector:hover) {
  border-color: #38BDF8;
  background: #f0f9ff;
}

.tdk-section :deep(.ant-input:focus),
.tdk-section :deep(.ant-select-focused .ant-select-selector) {
  border-color: #38BDF8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  background: #ffffff;
}

.tdk-section :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.tdk-section :deep(.ant-form-item-label > label) {
  color: #1f2937;
  font-weight: 500;
  font-size: 13px;
  height: auto;
}

.tdk-section :deep(.ant-form-item-required::before) {
  color: #f43f5e !important;
}

/* 修改表单网布局 */
.form-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

/* TDK 区域样式调整 */
.tdk-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
}

/* 其他字段区域样式 */
.other-fields-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #0284C7;
  margin-bottom: 12px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #38BDF8;
  border-radius: 2px;
  display: inline-block;
}

.other-fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* 调整表单项间距 */
:deep(.ant-form-item) {
  margin-bottom: 12px;
}

/* 确保最后一个表单项没有底部间距 */
:deep(.ant-form-item:last-child) {
  margin-bottom: 0;
}

/* 确保两列等高 */
.form-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

.tdk-section,
.other-fields-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  height: 100%; /* 确保两列等高 */
  display: flex;
  flex-direction: column;
}

/* 调整文本框样式 */
:deep(.ant-input-textarea) {
  height: 100%;
}

:deep(.ant-input-textarea textarea) {
  min-height: 80px !important;
  resize: vertical;
}

:deep(.ant-select-multiple .ant-select-selector) {
  min-height: 80px !important;
  height: auto !important;
}

/* 确保选择框内的���签正确换行显示 */
:deep(.ant-select-multiple .ant-select-selection-overflow) {
  flex-wrap: wrap;
  padding: 4px 0;
}

:deep(.ant-select-multiple .ant-select-selection-item) {
  margin-top: 2px;
  margin-bottom: 2px;
}

/* 添加部署��择相关样式 */
.deployment-options {
  margin-top: 8px;
}

:deep(.ant-radio-group) {
  display: flex;
  gap: 24px;
}

:deep(.ant-radio-wrapper) {
  font-size: 14px;
}

.preview-url-hint {
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.hint-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.preview-url {
  font-family: monospace;
  font-size: 13px;
  color: #0284c7;
  word-break: break-all;
  padding: 4px 8px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
}

.url-note {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
  margin-top: 8px;
  line-height: 1.4;
}

/* Selected Components List Styles */
.selected-components-list {
  padding: 16px;
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.empty-hint {
  text-align: center;
  padding: 24px 16px;
  color: #94a3b8;
  font-size: 14px;
}

.selected-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: move;
  transition: all 0.3s ease;
}

.selected-item:hover {
  background: rgba(56, 189, 248, 0.05);
  border-color: #38BDF8;
  transform: translateX(4px);
}

.selected-item:active {
  transform: translateX(4px) scale(0.98);
}

.item-name {
  font-size: 14px;
  color: #1f2937;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 美化滚动条 */
.selected-components-list::-webkit-scrollbar {
  width: 6px;
}

.selected-components-list::-webkit-scrollbar-track {
  background: transparent;
}

.selected-components-list::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.selected-components-list::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* 添加预览气泡相��样式 */
:deep(.component-preview-tooltip) {
  max-width: 400px;
  padding: 0;
}

:deep(.ant-tooltip-inner) {
  padding: 0;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.preview-content {
  width: 360px;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.preview-info {
  padding: 16px;
}

.preview-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.preview-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 优化组件项的悬浮效果 */
.component-item {
  position: relative;
}

.component-item:hover {
  z-index: 1;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.2);
}

/* 添加预览弹窗相关样式 */
.preview-modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-component-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  /* 移除固定的 min-height 和 max-height */
  padding: 48px 24px;
  margin-bottom: 24px;
}

/* 美化预览区域的滚动条 */
.preview-component-wrapper::-webkit-scrollbar {
  width: 6px;
}

.preview-component-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.preview-component-wrapper::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.preview-component-wrapper::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

:deep(.ant-modal-content) {
  padding: 24px;
  border-radius: 16px;
}

:deep(.ant-modal-body) {
  padding: 24px 0 0 0;
  max-height: calc(90vh - 120px); /* 限制最大高度 */
}

/* 修改预览弹窗底部按钮样式 */
.preview-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.preview-modal-footer :deep(.ant-btn) {
  height: 36px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 调整预览弹窗内容区域的上下间距 */
.preview-modal-content {
  display: flex;
  flex-direction: column;
  gap: 0; /* 移除原有的 gap */
}

/* 调整预览组件容器的样式 */
.preview-component-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  /* 移除固定的 min-height 和 max-height */
  padding: 48px 24px;
  margin-bottom: 24px;
}

/* Keywords 标签样式优化 */
:deep(.ant-select-multiple .ant-select-selection-item) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  margin: 2px;
  background: #f0f9ff;
  border-color: #38bdf8;
  border-radius: 4px;
  color: #0284c7;
  font-size: 13px;
  line-height: 22px;
  height: 24px;
}

:deep(.ant-select-multiple .ant-select-selection-item-remove) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  color: #0284c7;
  font-size: 12px;
  height: 16px;
  width: 16px;
  line-height: 1;
}

:deep(.ant-select-multiple .ant-select-selection-item-remove:hover) {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
}

:deep(.ant-select-multiple .ant-select-selection-item-content) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

/* 调整 form-item 样式 */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-vertical .ant-form-item-label) {
  padding: 0 0 4px;
}

:deep(.ant-form-item-label > label) {
  height: auto;
  margin: 0;
  color: #1f2937;
  font-size: 13px;
  font-weight: 500;
}

:deep(.ant-form-item-required::before) {
  color: #f43f5e !important;
  margin-right: 4px;
}

/* 输入框样式保持不变 */
:deep(.ant-input),
:deep(.ant-select-selector) {
  border-color: #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
}

:deep(.ant-input:hover),
:deep(.ant-select-selector:hover) {
  border-color: #38BDF8;
  background: #f0f9ff;
}

:deep(.ant-input:focus),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #38BDF8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  background: #ffffff;
}

/* 添加 slug 错误提示样式 */
.slug-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

:deep(.ant-input-status-error) {
  border-color: #ff4d4f !important;
}

:deep(.ant-input-status-error:hover) {
  border-color: #ff7875 !important;
}

:deep(.ant-input-status-error:focus) {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
}

/* 添加分类标题样式 */
:deep(.ant-collapse-header) {
  display: flex !important;
  align-items: center !important;
  padding: 12px 16px !important;
  background: #f8fafc;
  border-radius: 8px !important;
}

:deep(.ant-collapse-expand-icon) {
  padding-inline-end: 8px !important;
  padding-inline-start: 0 !important;
}

:deep(.ant-collapse-header-text) {
  flex: 1 !important;
  font-weight: 500;
  color: #1f2937;
}

.add-category-header {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  line-height: 1 !important;
  justify-content: space-between !important; /* 添加这行 */
}

.add-category-count {
  color: #64748b;
  font-size: 14px;
  margin-left: 4px;
}

.category-title {
  flex: 1 !important;
  font-weight: 500;
  color: #1f2937;
}

.category-count {
  flex-shrink: 0 !important;
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px !important;
}

:deep(.floating-stats-enhanced .stats-toggle-button) {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  border: 2px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

:deep(.floating-stats-enhanced .stats-toggle-button:hover) {
  transform: translateX(-2px);
}

:deep(.floating-stats-enhanced .stats-toggle-button .anticon) {
  color: white;
  font-size: 16px;
}

/* 只在折叠状态下显示发光效果 */
:deep(.floating-stats-enhanced.is-collapsed .stats-toggle-button) {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6),
              0 0 40px rgba(99, 102, 241, 0.4),
              0 0 60px rgba(99, 102, 241, 0.2);
  animation: strongPulse 2s infinite;
}

/* 增强的脉冲动画 */
@keyframes strongPulse {
  0% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6),
                0 0 40px rgba(99, 102, 241, 0.4),
                0 0 60px rgba(99, 102, 241, 0.2);
  }
  50% {
    box-shadow: 0 0 25px rgba(99, 102, 241, 0.8),
                0 0 50px rgba(99, 102, 241, 0.6),
                0 0 75px rgba(99, 102, 241, 0.4);
  }
  100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6),
                0 0 40px rgba(99, 102, 241, 0.4),
                0 0 60px rgba(99, 102, 241, 0.2);
  }
}

/* 展开状态恢复正常样式 */
:deep(.floating-stats-enhanced:not(.is-collapsed) .stats-toggle-button) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: none;
}

.slug-hint {
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
  font-style: italic;
}

/* 沉浸式模式相关样式 */
.immersive-btn {
  margin-right: 8px;
}

.section-content-wrapper {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 0 0 12px 12px;
  /* 移除可能存在的重叠背景和阴影 */
  box-shadow: none;
}

.immersive-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.immersive-content {
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.immersive-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.component-name {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.immersive-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 添加进入/退出动画 */
.immersive-overlay-enter-active,
.immersive-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.immersive-overlay-enter-from,
.immersive-overlay-leave-to {
  opacity: 0;
}

.immersive-content-enter-active,
.immersive-content-leave-active {
  transition: transform 0.3s ease;
}

.immersive-content-enter-from,
.immersive-content-leave-to {
  transform: scale(0.95);
}

/* 添加按钮样式 */
:deep(.ant-btn-default) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  .anticon {
    font-size: 14px;
  }
}

/* 添加 Page Information 固定项样式 */
.page-info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f9ff; /* 使用略微不同的背景色以示区分 */
  border: 1px solid #38BDF8;
  border-radius: 8px;
  margin-bottom: 16px; /* 与其他项之间留出间距 */
}

.page-info-name {
  font-size: 14px;
  color: #0284C7;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info-icon {
  color: #38BDF8;
}

/* 添加分隔线 */
.components-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0 16px;
}

/* 添加分析弹窗内容样式 */
.analysis-content {
  padding: 16px;
  max-height: 80vh;
  overflow-y: auto;
}

.analysis-content::-webkit-scrollbar {
  width: 6px;
}

.analysis-content::-webkit-scrollbar-track {
  background: transparent;
}

.analysis-content::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.analysis-content::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* 添加悬浮预览样式 */
.hover-preview {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中定位 */
  z-index: 1000;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 1000px; /* 参考 TitleSectionPreview 的宽度设置 */
  max-width: 90vw; /* 防止在小屏幕上溢出 */
  max-height: 80vh;
  overflow: auto;
  border: 1px solid #e5e7eb;
  pointer-events: none; /* 添加这行，使预览框不影响鼠标事件 */
}

.preview-content {
  width: 100%;
  padding: 32px;
  background: white;
  transition: all 0.2s;
}

/* 内容包装器样式，参考 TitleSectionPreview */
.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 添加滚动条样式 */
.hover-preview::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.hover-preview::-webkit-scrollbar-track {
  background: transparent;
}

.hover-preview::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.hover-preview::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* 添加预览遮罩层 */
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
  pointer-events: none; /* 添加这行，使遮罩层不影响鼠标事件 */
}
</style>
