<template>
  <div class="article-editor">
    <!-- 加载状态遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>

    <div v-else>
      <!-- 左侧面板 -->
      <div class="side-nav">
        <a-tabs 
          v-model:activeKey="activeTab"
          class="compact-tabs"
        >
          <!-- 添加 Basic Info tab -->
          <a-tab-pane key="basicInfo" tab="Info">
            <div class="basic-info-form">
              <a-form layout="vertical">
                <a-form-item label="Title" required>
                  <a-textarea
                    v-model:value="articleData.title"
                    placeholder="Enter page title"
                    :rows="2"
                    :auto-size="{ minRows: 2, maxRows: 4 }"
                    class="title-input"
                  />
                </a-form-item>

                <a-form-item label="Subtitle" required>
                  <a-textarea
                    v-model:value="articleData.subTitle"
                    placeholder="Enter page subtitle"
                    :rows="2"
                    :auto-size="{ minRows: 2, maxRows: 4 }"
                    class="subtitle-input"
                  />
                </a-form-item>

                <a-form-item label="Description" required>
                  <a-textarea
                    v-model:value="articleData.description"
                    placeholder="Enter page description"
                    :rows="4"
                  />
                </a-form-item>

                <a-form-item label="Summary">
                  <a-textarea
                    v-model:value="articleData.summary"
                    placeholder="Enter page summary"
                    :rows="4"
                  />
                </a-form-item>

                <a-form-item label="Topic">
                  <a-input
                    v-model:value="articleData.topic"
                    placeholder="Enter topic"
                  />
                </a-form-item>

                <a-form-item v-if="isEditMode" label="URL Suffix">
                  <a-input
                    v-model:value="articleData.urlSuffix"
                    placeholder="Enter URL suffix"
                  />
                </a-form-item>

                <a-form-item label="Keywords">
                  <a-select
                    v-model:value="articleData.keywords"
                    mode="tags"
                    placeholder="Enter keywords"
                    :token-separators="[',']"
                  />
                </a-form-item>

                <a-form-item label="Page Type">
                  <template v-if="isEditMode">
                    <div class="readonly-field">
                      {{ articleData.articleType }}
                    </div>
                  </template>
                  <a-select
                    v-else
                    v-model:value="articleData.articleType"
                    allowClear
                    placeholder="Select page type"
                  >
                    <a-select-option value="Blog">Blog</a-select-option>
                    <a-select-option value="Landing Page">Landing Page</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="Language">
                  <template v-if="isEditMode">
                    <div class="readonly-field">
                      {{ getLanguageLabel(articleData.language) }}
                    </div>
                  </template>
                  <a-select
                    v-else
                    v-model:value="articleData.language"
                  >
                    <a-select-option value="en">English</a-select-option>
                    <a-select-option value="zh">中文</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 组件选择面板 -->
          <a-tab-pane key="components" tab="Add">
            <div class="components-list">
              <a-collapse v-model:activeKey="activeCategories">
                <a-collapse-panel 
                  v-for="category in availableComponents" 
                  :key="category.category" 
                  :header="category.category"
                >
                  <div 
                    v-for="component in category.items" 
                    :key="component.type"
                    class="component-item"
                    draggable="true"
                    @dragstart="handleDragStart($event, component)"
                    @click="addComponent(component)"
                  >
                    <span>{{ component.label }}</span>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-tab-pane>

          <!-- 新增：Selected Components tab -->
          <a-tab-pane key="selectedComponents" tab="Selected">
            <div class="selected-components-list">
              <!-- 空态提示 -->
              <div v-if="articleData.sections.length === 0" class="empty-hint">
                <p>No components added yet</p>
              </div>

              <!-- 已选组件列表：保留拖拽排序功能 -->
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

      <!-- 顶部操作栏 -->
      <div class="editor-header">
        <a-button type="link" @click="handleBack">
          <ArrowLeftOutlined /> Back
        </a-button>
        
        <div class="header-actions">
          <template v-if="isEditMode">
            <a-button 
              type="default"
              @click="handlePreview"
              :style="{ height: '36px' }"
            >
              <EyeOutlined /> Preview
            </a-button>
            <a-tooltip :title="getPublishTooltip(articleData)">
              <a-button
                :type="articleData.publishStatus === 'publish' ? 'default' : 'primary'"
                @click="handlePublish"
                :disabled="!canPublish"
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
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="editor-content" @dragover.prevent @drop="handleDrop">
        <div class="sections-container">
          <!-- 空状态提示 -->
          <div v-if="articleData.sections.length === 0" class="empty-state">
            <p>Drag or click components from the left to start creating</p>
          </div>

          <!-- 组件列表：移除 draggable 和拖拽相关事件 -->
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
                danger
                class="delete-btn"
                @click="removeSection(index)"
              >
                <DeleteOutlined />
              </a-button>
            </div>
            <component 
              :is="section.componentName"
              :section="section"
              @update="(updatedSection) => handleSectionUpdate(updatedSection, index)"
            />
          </div>
        </div>
      </div>

      <floating-stats 
        :metrics="contentMetrics"
        :keywords-stats="articleData?.pageStats"
        @refresh="handleRefreshMetrics"
        :defaultCollapsed="true"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, nextTick, computed, onMounted, reactive } from 'vue';
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
  
} from '@ant-design/icons-vue';
import SectionWrapper from './sections/index.vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '../api/api';
import FloatingStats from './FloatingStats.vue';
import TitleSection from './sections/templates/TitleSection.vue';
import TitleSectionWithImage from './sections/templates/TitleSectionWithImage.vue';
import HeroSectionWithVideo from './sections/templates/HeroSectionWithVideo.vue';
import HeroSectionWithMultipleTexts from './sections/templates/HeroSectionWithMultipleTexts.vue';
import WhyChooseUsWithSmallBlocks from './sections/templates/WhyChooseUsWithSmallBlocks.vue';
import WhyChooseUsWithBlocks from './sections/templates/WhyChooseUsWithBlocks.vue';
import HowItWorksWithWorkflow from './sections/templates/HowItWorksWithWorkflow.vue';
import ProductBenefitsWithBlocks from './sections/templates/ProductBenefitsWithBlocks.vue';
import UserReviewsWithMovingCards from './sections/templates/UserReviewsWithMovingCards.vue';
import Faqs from './sections/templates/Faqs.vue';
import CallToActionComplex from './sections/templates/CallToActionComplex.vue';
import WhyChooseUsWithStory from './sections/templates/WhyChooseUsWithStory.vue';
import FeaturesTabbed from './sections/templates/FeaturesTabbed.vue';
import { createCleanComponentData } from '../utils/componentDataFactory';
import { availableComponents } from '../config/availableComponents';
import MeetOurTeam from './sections/templates/MeetOurTeam.vue';
import JobList from './sections/templates/JobList.vue';
import CallToActionWithEmailInput from './sections/templates/CallToActionWithEmailInput.vue';
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
    SectionWrapper,
    TitleSection,
    TitleSectionWithImage,
    HeroSectionWithVideo,
    HeroSectionWithMultipleTexts,
    WhyChooseUsWithSmallBlocks,
    WhyChooseUsWithBlocks,
    WhyChooseUsWithStory,
    HowItWorksWithWorkflow,
    ProductBenefitsWithBlocks,
    UserReviewsWithMovingCards,
    Faqs,
    CallToActionComplex,
    FeaturesTabbed,
    FloatingStats,
    MeetOurTeam,
    JobList,
    CallToActionWithEmailInput
  },

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

    // 在组件挂载时初始化数据
    onMounted(async () => {
      await loadProductInfo();
      await loadVerifiedDomains();
      try {
        if (isEditMode.value) {
          console.log('Edit mode detected, fetching article data...');
          const response = await apiClient.getArticleById(pageId.value);
          
          if (response?.code === 200 && response.data) {
            console.log('Original articleType:', response.data.articleType);

            const articleDataWithSections = {
              ...response.data,
              sections: response.data.sections || [],
              urlSuffix: response.data.suffixURL || '',
              keywords: response.data.relatedKeyword ? response.data.relatedKeyword.split(',') : [],
              topic: response.data.topic || '',
              articleType: response.data.articleType || '',
              language: response.data.language || 'en',
            };

            console.log('Processed articleType:', articleDataWithSections.articleType);
            
            originalArticle.value = JSON.parse(JSON.stringify(articleDataWithSections));
            articleData.value = articleDataWithSections;
            
            console.log('Final articleType:', articleData.value.articleType);
          } else {
            throw new Error(response?.message || 'Invalid response data');
          }
        }
      } catch (error) {
        console.error('Initialize error:', error);
        message.error('Failed to initialize: ' + (error.message || 'Unknown error'));
        // 初始化失败时，设置默认值
        originalArticle.value = {
          title: '',
          subTitle: '',
          description: '',
          sections: []
        };
        articleData.value = {
          title: '',
          subTitle: '',
          description: '',
          sections: []
        };
      } finally {
        loading.value = false;
      }
    });

    const saving = ref(false);
    const activeTab = ref('basicInfo');
    const activeCategories = ref(['basic']);
    const articleData = ref({
      title: '',
      subTitle: '',
      description: '',
      summary: '',
      sections: [],
      pageStats: {
        genKeyword: [],
        wordCount: 0,
        keywords: [],
        keywordStats: []
      }
    });

    // Content metrics
    const contentMetrics = ref({
      h1Count: 0,
      h2Count: 0,
      h3Count: 0,
      paragraphsCount: 0,
      imagesCount: 0,
      wordCount: 0
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

    // 修改为只处理组件列表中的拖拽排序
    const handleSectionDragStart = (event, index) => {
      dragSourceIndex.value = index;
      event.dataTransfer.effectAllowed = 'move';
    };

    const handleSectionDrop = (event, targetIndex) => {
      event.preventDefault();
      
      if (dragSourceIndex.value !== null && dragSourceIndex.value !== targetIndex) {
        // 获取要移动的组件
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

    // 添加新响应式变量来跟踪拖拽的源引
    const dragSourceIndex = ref(null);

    // 添加组件到文章
    const addComponent = (component, index = null) => {
      console.log('Adding component:', component); // 添加这行
      try {
        // 检查组件是否已存在
        const componentExists = articleData.value.sections.some(
          section => section.componentName === component.type
        );

        if (componentExists) {
          message.warning(`This component "${component.label}" has already been added`);
          return;
        }

        // 使用 createCleanComponentData 创建干净的组件数据
        const newSection = createCleanComponentData(component.type);

        // 添加新组件到指定位或末尾
        if (index !== null) {
          articleData.value.sections.splice(index + 1, 0, newSection);
        } else {
          articleData.value.sections.push(newSection);
        }

        calculateContentMetrics();

        // 加滚动逻辑
        nextTick(() => {
          const sections = document.querySelectorAll('.section-wrapper');
          const lastSection = sections[sections.length - 1];
          if (lastSection) {
            lastSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      } catch (error) {
        console.error('Add component error:', error);
        message.error('Failed to add component');
      }
    };

    // 移除组件
    const removeSection = (index) => {
      articleData.value.sections.splice(index, 1);
      calculateContentMetrics();
    };

    // 修改 handleSectionUpdate 方法
    const handleSectionUpdate = (updatedSection, index) => {
      try {
        // 直接更新数据，不进行验证
        articleData.value.sections[index] = {
          ...articleData.value.sections[index],
          ...updatedSection
        };
        calculateContentMetrics();
      } catch (error) {
        console.error('Section update error:', error);
        message.error(`Failed to update section: ${error.message}`);
      }
    };

    // 计算内容统计指标
    const calculateContentMetrics = () => {
      let metrics = {
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        paragraphsCount: 0,
        imagesCount: 0,
        wordCount: 0
      };

      articleData.value.sections.forEach(section => {
        // 根据不同组件类型统计
        switch (section.componentName) {
          case 'TitleSection':
          case 'TitleSectionWithImage':
            if (section.title) metrics.h1Count++;
            if (section.subTitle) metrics.h2Count++;
            break;
          
          case 'HeroSectionWithVideo':
          case 'HeroSectionWithMutipleTexts':
            if (section.topContent?.title) metrics.h1Count++;
            if (section.topContent?.description) {
              metrics.paragraphsCount++;
              metrics.wordCount += section.topContent.description.split(/\s+/).length;
            }
            break;

          case 'WhyChooseUsWithSmallBlocks':
          case 'WhyChooseUsWithBlocks':
            if (section.topContent?.title) metrics.h2Count++;
            section.bottomContent?.forEach(item => {
              if (item.content) {
                metrics.paragraphsCount++;
                metrics.wordCount += item.content.split(/\s+/).length;
              }
              if (item.imageUrl) metrics.imagesCount++;
            });
            break;

          case 'CallToActionComplex':
            if (section.title) metrics.h2Count++;
            if (section.subTitle) metrics.h3Count++;
            
            // 统计部内容
            if (section.topContent?.title) metrics.h2Count++;
            if (section.topContent?.description) {
              metrics.paragraphsCount++;
              metrics.wordCount += section.topContent.description.split(/\s+/).length;
            }
            
            // 统计底部内容
            if (section.bottomContent?.title) metrics.h3Count++;
            section.bottomContent?.content?.forEach(item => {
              if (item.description) {
                metrics.paragraphsCount++;
                metrics.wordCount += item.description.split(/\s+/).length;
              }
            });
            break;

          // 可以根据需要添加更多组件类型的统计
        }
      });

      contentMetrics.value = metrics;
    };

    // 监听 sections 变化时更新统计
    watch(() => articleData.value.sections, () => {
      calculateContentMetrics();
    }, { deep: true });

    const handleSave = async (shouldQuit = false) => {
      try {
        // 基本信息验证
        if (!articleData.value.title) {
          message.error('Page title is required');
          return;
        }
        if (!articleData.value.subTitle) {
          message.error('Page subtitle is required');
          return;
        }
        if (!articleData.value.description) {
          message.error('Page description is required');
          return;
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
          // 编辑模式：使用全量更新
          const updatePromises = [];

          // 直接更新页面所有信息
          const pageUpdateData = {
            title: articleData.value.title,
            subTitle: articleData.value.subTitle,
            description: articleData.value.description,
            summary: articleData.value.summary,
            topic: articleData.value.topic,
            articleType: articleData.value.articleType,
            suffixURL: articleData.value.urlSuffix,
            relatedKeyword: processedKeywords,
          };
          
          console.log('Saving page data:', pageUpdateData); // 添加日志
          
          // 添加更新页面信息的请求
          updatePromises.push(
            apiClient.updatePage(pageId.value, pageUpdateData)
          );

          // 添加更新sections请求
          updatePromises.push(
            apiClient.updateFullSections(pageId.value, {sections: articleData.value.sections})
          );

          // 并行执行所有更新请求
          response = await Promise.all(updatePromises);
        } else {
          const requestData = {
            page: {
              author: '',
              customerId: customerId,
              description: articleData.value.description || '',
              language: articleData.value.language,
              subTitle: articleData.value.subTitle,
              summary: articleData.value.summary || '',
              title: articleData.value.title,
              suffixURL: articleData.value.urlSuffix || '',
              topic: articleData.value.topic,
              articleType: articleData.value.articleType,
              relatedKeyword: processedKeywords,
            },
            sections: articleData.value.sections
          };

          response = await apiClient.createManualPage(requestData);
        }

        hide();
        message.success('Saved successfully');

        // 如果需要退出，则返回列表页
        if (shouldQuit) {
          router.push('/task-management');
        } else if (!isEditMode.value) {
          const batchId = response.data.batchId
          const pageId = response.data.pageId
          router.push(`/page-writer?mode=edit&id=${pageId}&batchId=${batchId}&lang=${articleData.value.language}`);
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

    // 添加关键词统计的计算方法
    const calculateKeywordStats = () => {
      if (!articleData.value.sections || articleData.value.sections.length === 0) {
        return;
      }

      // 初始化 pageStats 如果不存在
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

      // 计���关键词统计
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

    // 监听 sections 变化，更新关键词统计
    watch(() => articleData.value.sections, () => {
      calculateKeywordStats();
    }, { deep: true });

    const refreshingMetrics = ref(false);
    
    const handleRefreshMetrics = async () => {
      refreshingMetrics.value = true;
      try {
        // 新算统计数据
        calculateContentMetrics();
        // 添加动画效果
        await new Promise(resolve => setTimeout(resolve, 500));
        message.success('Statistics updated');
      } catch (error) {
        console.error('Failed to refresh metrics:', error);
        message.error('Failed to update statistics');
      } finally {
        refreshingMetrics.value = false;
      }
    };

    const scrollToSection = (sectionId) => {
      nextTick(() => {
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
          const headerHeight = 64; // 顶部导航栏高度
          const scrollContainer = document.querySelector('.editor-content');
          const rect = targetSection.getBoundingClientRect();
          
          // 添加日志用于调试
          console.log('Scrolling to section:', {
            sectionId,
            targetTop: rect.top,
            scrollTop: scrollContainer.scrollTop,
            headerHeight
          });
          
          const targetPosition = rect.top + scrollContainer.scrollTop - headerHeight - 20;
          
          scrollContainer.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } else {
          console.warn('Target section not found:', sectionId);
        }
      });
    };

    // 添加语言标签获取方法
    const getLanguageLabel = (langCode) => {
      const languages = {
        'en': 'English',
        'zh': '中文'
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
        productInfo.value = {}; // 设置为空对象而不是 null
      }
    };

    const getPreviewUrl = (article) => {
      return `${config.domains.preview}${article.language === 'zh' ? 'zh/' : 'en/'}${article.previewId}`;
    };

    const handlePreview = () => {
      const previewUrl = getPreviewUrl({
        previewId: articleData.value.previewId,
        language: articleData.value.language
      });
      window.open(previewUrl, '_blank');
    };

    // 添加新的响应式变量
    const publishing = ref(false)
    const publishModal = reactive({
      visible: false,
      title: '',
      content: '',
      action: null
    })

    // 添加发布相关的方法
    const canPublish = computed(() => {
      return verifiedDomains.value.length > 0
    })

    const getPublishTooltip = (article) => {
      if (!canPublish.value) {
        return 'No verified sub-domain available. Please verify a domain in Settings first.'
      }
      return ''
    }

    const handlePublish = () => {
      const isPublished = articleData.value.publishStatus === 'publish'
      
      if (!isPublished && !canPublish.value) {
        message.error('No verified sub-domain available. Please verify a domain in Settings first.')
        return
      }

      publishModal.visible = true
      publishModal.title = isPublished ? 'Confirm Unpublish' : 'Confirm Publish'
      publishModal.content = isPublished 
        ? 'Are you sure you want to unpublish this page?' 
        : 'Are you sure you want to publish this page?'
      publishModal.action = isPublished ? 'unpublish' : 'publish'
    }

    const confirmPublish = async () => {
      try {
        publishing.value = true
        const pageId = route.query.id || route.params.id
        
        await apiClient.updatePageStatus(pageId, publishModal.action)
        
        // 更新本地状态
        articleData.value.publishStatus = publishModal.action === 'publish' ? 'publish' : 'create'
        
        message.success(`${publishModal.action === 'publish' ? 'Published' : 'Unpublished'} successfully`)
        publishModal.visible = false
      } catch (error) {
        console.error('Publish action failed:', error)
        message.error('Operation failed: ' + (error.message || 'Unknown error'))
      } finally {
        publishing.value = false
      }
    }

    // 添加 verifiedDomains 响应式变量
    const verifiedDomains = ref([])

    // 添加加载域名信息的方法
    const loadVerifiedDomains = async () => {
      try {
        const projectId = 'prj_ySV5jK2SgENiBpE5D2aTaeI3KfAo'
        
        const response = await apiClient.getVercelDomainInfo(projectId)
        
        // 确保 productInfo 已加载
        if (!productInfo.value) {
          await loadProductInfo()
        }
        
        // 查找所有已验证的域名
        verifiedDomains.value = response?.domains
          ?.filter(domain => {
            const isVerified = domain.verified || !domain.configDetails?.misconfigured
            const hasProductInfo = productInfo.value?.projectWebsite === domain.name && productInfo.value?.domainStatus
            return isVerified && hasProductInfo
          })
          ?.map(domain => domain.name) || []
      } catch (error) {
        console.error('Failed to load domain info:', error)
      }
    }

    return {
      loading,
      saving,
      activeTab,
      activeCategories,
      articleData,
      contentMetrics,
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
      verifiedDomains,
      loadVerifiedDomains,
    };
  }
});
</script>

<style scoped>
/* 保持与 EditPage 相同的基础布样式 */
.article-editor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
}

/* 左侧导航式增强 */
.side-nav {
  position: fixed;
  left: 24px;
  top: 88px;
  bottom: 24px;
  width: 300px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 组件列表样式 */
.components-list {
  padding: 16px;
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.components-section {
  background: #ffffff;
  border-radius: 12px;
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
}

.component-item:hover {
  background: rgba(56, 189, 248, 0.05);
  border-color: #38BDF8;
  transform: translateX(4px);
}

.component-item:active {
  transform: translateX(4px) scale(0.98);
}

.component-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 8px;
  color: #38BDF8;
}

.component-info {
  flex: 1;
}

.component-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.component-desc {
  font-size: 12px;
  color: #6b7280;
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

/* 放相关样式 */
.section-wrapper {
  position: relative;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;
  padding-top: 10px;
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
}

.delete-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.delete-btn:hover {
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
  padding: 12px 16px !important;
  background: #f8fafc;
  border-radius: 8px !important;
  font-weight: 500;
  color: #1f2937 !important;
}

:deep(.ant-collapse-content) {
  border: none;
  background: transparent;
}

:deep(.ant-collapse-content-box) {
  padding: 16px 8px !important;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  height: 100vh;
  padding: 88px 32px 32px;
  margin-left: 320px;
  max-width: 1500px; /* 增加内容区最大宽度 */
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

/* 响应式调整 */
@media (max-width: 1300px) {
  .side-nav {
    left: 24px;
  }
  
  .editor-content {
    margin-left: 324px;
    width: calc(100% - 324px);
  }
}

@media (max-width: 1200px) {
  .side-nav {
    display: none;
  }
  
  .editor-content {
    margin-left: 0;
    width: 100%;
    padding: 88px 16px 24px;
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
  margin: 0 auto;
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

/* 添加批次信息样式 */
.batch-info {
  flex: 1;
  margin: 0 24px;
}

/* 调整顶部操作栏高度 */
.editor-header {
  height: auto;
  min-height: 64px;
  padding: 12px 32px;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

:deep(.ant-form-item-label) {
  label {
    color: #6b7280;
    font-size: 13px;
  }
}

/* 加 Basic Info 表单样式 */
.basic-info-form {
  padding: 16px;
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.basic-info-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.basic-info-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.basic-info-form :deep(.ant-form-item-label > label) {
  color: #374151;
  font-weight: 500;
}

.basic-info-form :deep(.ant-input),
.basic-info-form :deep(.ant-select) {
  border-radius: 6px;
}

.basic-info-form :deep(.ant-input:hover),
.basic-info-form :deep(.ant-select:hover) {
  border-color: #38BDF8;
}

.basic-info-form :deep(.ant-input:focus),
.basic-info-form :deep(.ant-select-focused) {
  border-color: #38BDF8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

/* 添加新的样式 */
.selected-components-list {
  padding: 16px;
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.empty-hint {
  text-align: center;
  color: #999;
  padding: 20px;
}

.selected-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: move;
}

.selected-item:hover {
  background: #f1f5f9;
  border-color: #38BDF8;
}

.item-name {
  font-size: 14px;
  color: #374151;
}

.item-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.selected-item:hover .item-actions {
  opacity: 1;
}

/* 添加紧凑型 tabs 样式 */
.compact-tabs {
  :deep(.ant-tabs-nav) {
    margin: 0;
    padding: 8px 8px 0;
  }

  :deep(.ant-tabs-tab) {
    padding: 8px 12px !important;
    margin: 0 2px !important;
    min-width: 80px;
    justify-content: center;
  }

  :deep(.ant-tabs-tab-btn) {
    font-size: 13px;
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }

  :deep(.ant-tabs-tab-active) {
    background: #e0f2fe;
    border-radius: 4px;
  }

  :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #0284c7 !important;
    font-weight: 500;
  }

  :deep(.ant-tabs-nav-list) {
    width: 100%;
    justify-content: space-between;
  }
}

/* 添加关键词相关样式 */
.keywords-section {
  padding: 16px;
}

.keywords-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keyword-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.keyword-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.keyword-density {
  font-size: 12px;
  color: #6b7280;
}

.count-number,
.density-number {
  color: #38BDF8;
  font-weight: 500;
}

.keywords-section {
  padding: 16px;
}

.keywords-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keyword-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.keyword-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.keyword-density {
  font-size: 12px;
  color: #6b7280;
}

.count-number,
.density-number {
  color: #38BDF8;
  font-weight: 500;
}

/* 添加更紧凑的统计指标样式 */
.guideline-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 12px;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.metric-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 6px;
  color: #38BDF8;
  font-size: 14px;
}

.metric-info {
  flex: 1;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 1px;
}

.metric-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.headings-card .heading-stats {
  display: flex;
  gap: 12px;
}

.heading-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.word-count-card {
  background: #f0f9ff;
  border-color: #38BDF8;
}

.word-count-card .metric-value {
  color: #0284c7;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  margin-bottom: 0; /* 覆盖原来的 margin-bottom */
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

/* 修改按钮样式 */
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
</style>
