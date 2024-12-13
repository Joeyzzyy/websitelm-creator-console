<template>
    <div class="article-editor">
      <!-- 添加加载状态遮罩 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
      
      <!-- 现有内容 -->
      <div v-else>
        <!-- 左侧导航栏 -->
        <div class="side-nav">
          <!-- 添加 Tab 导航 -->
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="guidelines" tab="Guidelines">
              <div class="guidelines-content">
                <div class="guideline-section">
                  <h3 class="section-title">Basic Statistics</h3>
                  <div class="metrics-grid">
                    <!-- 第一行：Headings 统计 -->
                    <div class="metric-card headings-card">
                      <div class="metric-icon">
                        <UnorderedListOutlined />
                      </div>
                      <div class="metric-info">
                        <div class="heading-stats">
                          <div class="heading-stat">
                            <span class="stat-label">H1</span>
                            <span class="stat-value">{{ contentMetrics.h1Count }}</span>
                          </div>
                          <div class="heading-stat">
                            <span class="stat-label">H2</span>
                            <span class="stat-value">{{ contentMetrics.h2Count }}</span>
                          </div>
                          <div class="heading-stat">
                            <span class="stat-label">H3</span>
                            <span class="stat-value">{{ contentMetrics.h3Count }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 第二行：Paragraphs 和 Images -->
                    <div class="metric-row">
                      <div class="metric-card">
                        <div class="metric-icon">
                          <AlignLeftOutlined />
                        </div>
                        <div class="metric-info">
                          <span class="metric-label">Paragraphs</span>
                          <span class="metric-value">{{ contentMetrics.paragraphsCount }}</span>
                        </div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-icon">
                          <PictureOutlined />
                        </div>
                        <div class="metric-info">
                          <span class="metric-label">Images</span>
                          <span class="metric-value">{{ contentMetrics.imagesCount }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 第三行：Word Count -->
                    <div class="metric-card word-count-card">
                      <div class="metric-icon">
                        <FileTextOutlined />
                      </div>
                      <div class="metric-info">
                        <span class="metric-label">Total Words</span>
                        <span class="metric-value">{{ contentMetrics.wordCount }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 添加 Document Structure -->
                  <div class="document-structure">
                    <h3 class="section-title">Main Structure</h3>
                    <div class="structure-tree">
                      <div 
                        v-for="section in documentStructure" 
                        :key="section.sectionName"
                        class="tree-section"
                        @click="scrollToSection(section.sectionId)"
                        role="button"
                        tabindex="0"
                      >
                        <div class="section-content">
                          <div class="section-name">{{ section.sectionName }}</div>
                          <div class="section-tags">
                            <span 
                              v-for="tag in section.tags" 
                              :key="tag.id"
                              class="tag-badge"
                            >
                              {{ tag.type }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            
            <a-tab-pane key="outline" tab="Keywords">
              <div class="nav-sections">
                <div class="keywords-section">
                  <h3 class="section-title">Keywords Analysis</h3>
                  <div class="debug-info" style="font-size: 12px; color: #666; margin-bottom: 8px;">
                    Keywords Count: {{ articleData?.pageStats?.genKeyword?.length || 0 }}
                  </div>
                  <div class="keywords-list">
                    <div 
                      v-for="keyword in articleData?.pageStats?.genKeyword || []" 
                      :key="keyword"
                      class="keyword-item"
                    >
                      <div class="keyword-info">
                        <div class="keyword-name">{{ keyword }}</div>
                        <div 
                          v-if="getKeywordStats(keyword)" 
                          class="keyword-density"
                        >
                          Occurrences: <span class="count-number">{{ getKeywordStats(keyword)?.wordCount || 0 }}</span> | 
                          Density: <span class="density-number">{{ (getKeywordStats(keyword)?.density || 0).toFixed(2) }}%</span>
                        </div>
                      </div>
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
            <div class="preview-link">
              <span>Preview From:</span>
              <a :href="previewUrl" target="_blank">{{ previewUrl }}</a>
            </div>
            <!-- 发布状态和按钮 -->
            <template v-if="articleData.publishStatus === 'publish'">
              <a-tag color="green">Published</a-tag>
              <a-button 
                type="link" 
                @click="showUnpublishModal"
                class="unpublish-article-btn"
              >
                <CloudDownloadOutlined />
                Unpublish
              </a-button>
            </template>
            <template v-else>
              <a-tag color="orange">Unpublished</a-tag>
              <a-button 
                type="link" 
                @click="showPublishModal"
                class="publish-article-btn"
              >
                <CloudUploadOutlined />
                Publish
              </a-button>
            </template>
            <a-button 
              type="primary"
              @click="handleSave"
              :loading="saving"
            >
              Save Changes
            </a-button>
          </div>
        </div>
    
        <!-- 章内容区 -->
        <div class="editor-content">
          <!-- Sections容器直��容 -->
          <div class="sections-container">
            <template v-for="(section, index) in articleData.sections" :key="section.sectionId">
              <div class="section-wrapper" :data-section-id="section.sectionId">
                <div class="section-header">
                  <h3>{{ formatSectionName(section.componentName) }}</h3>
                </div>
                <section-wrapper
                  :section="section"
                  @update="(updatedSection) => handleSectionUpdate(updatedSection, index)"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 添加发布确认弹窗 -->
    <a-modal
      v-model:open="isPublishModalVisible"
      title="Publish Article"
      @ok="handlePublish"
      @cancel="cancelPublish"
      :confirmLoading="publishLoading"
      wrapClassName="custom-modal"
    >
      <div class="confirmation-content">
        <div class="confirmation-section">
          <h4>Confirm Publication</h4>
          <div class="confirmation-item">
            <div class="item-label">Article Title</div>
            <div class="item-value">{{ articleData.title }}</div>
          </div>
          <div class="item-description">
            Publishing this article will make it visible to the public. Are you sure you want to proceed?
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 添加取消发布确认弹窗 -->
    <a-modal
      v-model:open="isUnpublishModalVisible"
      title="Unpublish Article"
      @ok="handleUnpublish"
      @cancel="cancelUnpublish"
      :confirmLoading="unpublishLoading"
      wrapClassName="custom-modal warning-modal"
    >
      <div class="confirmation-content">
        <div class="confirmation-section">
          <h4>Confirm Unpublication</h4>
          <div class="confirmation-item">
            <div class="item-label">Article Title</div>
            <div class="item-value">{{ articleData.title }}</div>
          </div>
          <div class="item-description warning-text">
            Unpublishing this article will make it invisible to the public. Are you sure you want to proceed?
          </div>
        </div>
      </div>
    </a-modal>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, computed, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { ArrowLeftOutlined, OrderedListOutlined, CloudUploadOutlined, CloudDownloadOutlined, FileTextOutlined, AlignLeftOutlined, PictureOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import SectionWrapper from './sections/index.vue';
  import apiClient from '../api/api';
  import { useRoute, useRouter } from 'vue-router';
  import { Modal } from 'ant-design-vue';
  import { getSectionTags } from './sections/common/SectionTag';
  import config from '../config/settings'
  
  export default defineComponent({
    name: 'ArticleEditor',
    
    components: {
      ArrowLeftOutlined,
      OrderedListOutlined,
      CloudUploadOutlined,
      CloudDownloadOutlined,
      FileTextOutlined,
      AlignLeftOutlined,
      PictureOutlined,
      UnorderedListOutlined,
      PlusOutlined,
      SectionWrapper,
      AModal: Modal,
      ATabs: Modal.TabPane,
      ATabPane: Modal.TabPane,
      AButton: Modal.Button,
      ATag: Modal.Tag,
    },
  
    setup() {
      const articleData = ref({
        title: '',
        subTitle: '',
        description: '',
        sections: [],
        pageStats: {
          genKeyword: [],      // 生成的关键词建议
          wordCount: 0,        // 总字数
          keywords: [],        // 当前使用的关键词
          keywordStats: []     // 关键词统计 [{wordCount, density, keyword}]
        }
      });
      const saving = ref(false);
      const route = useRoute();
      const router = useRouter();
      const loading = ref(true);
  
      // 获文��数据后立即创深拷贝
      const originalArticle = ref(null);
  
      // 加载文章数据
      const loadArticleData = async (pageId, lang) => {
        try {
          loading.value = true;
          console.log('开始加载文章数, pageId:', pageId);
          
          const response = await apiClient.getArticleById(pageId, lang);
          console.log('API响应数据:', response);
          
          if (!response?.data) {
            console.error('API响应中没有data字段');
            throw new Error('无效的响应数据');
          }

          const article = response.data[0];
          console.log('解析到的文章数据:', article);
          
          if (!article) {
            console.error('未找到文章数据');
            throw new Error('未找到文章数据');
          }

          // 打印关键词相关数据
          console.log('文章页面统计信息:', article.pageStats);
          console.log('生成的关键词:', article.pageStats?.genKeyword);
          console.log('关键词统计:', article.pageStats?.keywordStats);

          articleData.value = article;
          originalArticle.value = JSON.parse(JSON.stringify(article));
          
          // 确保 pageStats 存在
          if (!articleData.value.pageStats) {
            articleData.value.pageStats = {
              genKeyword: [],
              keywordStats: []
            };
          }
          
          calculateContentMetrics();
          console.log('文章数据加载完成，当前articleData:', articleData.value);
          
        } catch (error) {
          console.error('加载文章错误:', error);
          console.error('错误详情:', {
            message: error.message,
            stack: error.stack
          });
          message.error(`加载文章失败: ${error.message || '未知错误'}`);
        } finally {
          loading.value = false;
        }
      };
  
      // 保存文章
      const handleSave = async () => {
        try {
          saving.value = true;
          const hide = message.loading('Saving...', 0);
  
          // 检查必填项
          const validationErrors = validateSections(articleData.value.sections);
          if (validationErrors.length > 0) {
            hide();
            // 显示验证错误
            console.log('验证错误:', validationErrors);
            validationErrors.forEach(error => {
              message.error(error);
            });
            return;
          }
  
          if (!route.query.id) {
            throw new Error('Article ID not found');
          }
  
          // 直接使用之前保存的 originalArticle 进行比较
          const hasBasicInfoChanges = 
            articleData.value.title !== originalArticle.value.title ||
            articleData.value.subTitle !== originalArticle.value.subTitle ||
            articleData.value.description !== originalArticle.value.description;
  
          // 检查sections是否有变化
          console.log('Comparing sections for changes:');
          const modifiedSections = articleData.value.sections.filter((section, index) => {
            const originalSection = originalArticle.value.sections[index];
            if (!originalSection) return true;
            
            return JSON.stringify(section) !== JSON.stringify(originalSection);
          });
  
          console.log('Modified sections:', modifiedSections);
  
          const updatePromises = [];
  
          // 如果基本信息有变化，添加更请求
          if (hasBasicInfoChanges) {
            const pageUpdateData = {
              title: articleData.value.title,
              subTitle: articleData.value.subTitle,
              description: articleData.value.description
            };
            console.log('Sending page update request:', pageUpdateData);
            updatePromises.push(
              apiClient.updatePage(route.query.id, pageUpdateData)
            );
          }
  
          // 如果sections有变化添加更新sections的请求
          if (modifiedSections.length > 0) {
            modifiedSections.forEach(section => {
              console.log('Sending section update request:', section);
              updatePromises.push(
                apiClient.updateSection(section.sectionId, section)
              );
            });
          }
  
          // 如果没有任何改，提示用户
          if (updatePromises.length === 0) {
            hide();
            message.info('No changes detected');
            return;
          }
  
          // 等待所有更新完成
          const results = await Promise.all(updatePromises);
          console.log('Update results:', results);
  
          hide();
          message.success('Saved successfully');
        } catch (error) {
          console.error('Save failed:', error);
          message.error('Save failed: ' + (error.message || 'Unknown error'));
        } finally {
          saving.value = false;
        }
      };
  
      // 添加验证函数
      const validateSections = (sections) => {
        const errors = [];
        
        console.log('=== Starting Validation ===');
        console.log('Total sections:', sections.length);
        
        sections.forEach((section, sectionIndex) => {
          console.log(`\n[Checking Section ${sectionIndex + 1}]`);
          console.log('Component Name:', section.componentName);
          console.log('Section Data:', JSON.stringify(section, null, 2));
          
          let hasEmptyField = false;
          
          const checkContent = (obj) => {
            if (!obj) return;
            
            Object.entries(obj).forEach(([key, value]) => {
              // 跳过特定字段
              if (['componentName', 'sectionId', 'display', 'color'].includes(key)) {
                console.log(`Skipping special field: ${key}`);
                return;
              }
              
              console.log(`Checking field: ${key}, Value:`, value);
              
              if (Array.isArray(value)) {
                console.log(`Field ${key} is array, length:`, value.length);
                value.forEach((item, index) => {
                  if (typeof item === 'object') {
                    checkContent(item);
                  } else if (!item || (typeof item === 'string' && !item.trim())) {
                    console.log(`Empty array item found in ${key}[${index}]`);
                    hasEmptyField = true;
                  }
                });
              } else if (typeof value === 'object') {
                console.log(`Field ${key} is object, checking nested fields`);
                checkContent(value);
              } else if (!value || (typeof value === 'string' && !value.trim())) {
                console.log(`Empty field found: ${key}`);
                hasEmptyField = true;
              }
            });
          };

          // 检查所有内容区域
          console.log('\nChecking topContent...');
          checkContent(section.topContent);
          
          console.log('\nChecking leftContent...');
          checkContent(section.leftContent);
          
          console.log('\nChecking rightContent...');
          checkContent(section.rightContent);
          
          console.log('\nChecking bottomContent...');
          checkContent(section.bottomContent);
          
          // 检查直接字段
          console.log('\nChecking direct fields...');
          ['title', 'subtitle', 'subTitle'].forEach(field => {
            if (section[field] !== undefined) {
              console.log(`Checking ${field}:`, section[field]);
              if (!section[field] || !section[field].trim()) {
                console.log(`Empty direct field found: ${field}`);
                hasEmptyField = true;
              }
            }
          });

          if (hasEmptyField) {
            const sectionName = section.componentName || 'Unknown Section';
            const error = `Section ${sectionIndex + 1} (${sectionName}) contains empty fields`;
            console.log('\nAdding error:', error);
            errors.push(error);
          }
        });

        console.log('\n=== Validation Summary ===');
        console.log('Total errors found:', errors.length);
        console.log('Errors:', errors);
        
        return errors;
      };
  
      // 返回上一页
      const handleBack = () => {
        router.push('/task-management');
      };

      // 格式化 section 名称
      const formatSectionName = (componentName) => {
        return componentName
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
  
      const scrollToSection = (sectionId) => {
        const element = document.querySelector(`[data-section-id="${sectionId}"]`);
        const headerOffset = 100; // 设置一个合适的偏移量，根据你的 header 高度调整
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        document.querySelector('.editor-content').scrollTo({
          top: element.offsetTop - headerOffset,
          behavior: 'smooth'
        });
      };
  
      const handleSectionUpdate = (updatedSection, index) => {
        const newSections = [...articleData.value.sections];
        newSections[index] = { ...updatedSection };
        
        articleData.value = {
          ...articleData.value,
          sections: newSections
        };
        
        calculateContentMetrics();
      };
  
      // 添加新的响应式状态
      const isPublishModalVisible = ref(false);
      const isUnpublishModalVisible = ref(false);
      const publishLoading = ref(false);
      const unpublishLoading = ref(false);
  
      // 修改 previewUrl 计算属性
      const previewUrl = computed(() => {
        if (!route.query.id) return '';
        // 直接使用配置中的域名
        const domain = config.domains.preview;
        const lang = route.query.lang || 'en';
        const langPrefix = lang === 'zh' ? 'zh/' : 'en/';
        return `${domain}${langPrefix}${route.query.id}`;
      });
  
      // 修改 showPublishModal 方法,删除域名检查
      const showPublishModal = () => {
        isPublishModalVisible.value = true;
      };
  
      // 在 onMounted 中删除获取域名的逻辑
      onMounted(async () => {
        const pageId = route.query.id;
        const lang = route.query.lang || 'en';
        if (pageId) {
          loadArticleData(pageId, lang);
        } else {
          message.error('Article ID not found');
        }
      });
  
      // 处理发布
      const handlePublish = async () => {
        try {
          publishLoading.value = true;
          await apiClient.updatePageStatus(route.query.id, 'publish');
          articleData.value.publishStatus = 'publish';
          message.success('Article published successfully');
          isPublishModalVisible.value = false;
        } catch (error) {
          console.error('Publish failed:', error);
          message.error('Failed to publish article');
        } finally {
          publishLoading.value = false;
        }
      };
  
      // 处理取消发布
      const handleUnpublish = async () => {
        try {
          unpublishLoading.value = true;
          await apiClient.updatePageStatus(route.query.id, 'unpublish');
          articleData.value.publishStatus = 'unpublish';
          message.success('Article unpublished successfully');
          isUnpublishModalVisible.value = false;
        } catch (error) {
          console.error('Unpublish failed:', error);
          message.error('Failed to unpublish article');
        } finally {
          unpublishLoading.value = false;
        }
      };
  
      // 取消发布操作
      const cancelPublish = () => {
        isPublishModalVisible.value = false;
      };
  
      // 取消取消布操作
      const cancelUnpublish = () => {
        isUnpublishModalVisible.value = false;
      };
  
      // 显示取消发布确认弹窗
      const showUnpublishModal = () => {
        isUnpublishModalVisible.value = true;
      };
  
      const activeTab = ref('guidelines');
      const contentMetrics = ref({
        wordCount: 0,
        headingsCount: 0,
        paragraphsCount: 0,
        imagesCount: 0,
      });
  
      // 计算内容指标的函数
      const calculateContentMetrics = () => {
        // 初始化计数器
        let h1Count = 0;
        let h2Count = 0;
        let h3Count = 0;
        let paragraphsCount = 0;
        let imagesCount = 0;

        // 遍历所有 sections 统计标签数量
        articleData.value?.sections?.forEach(section => {
          const sectionTags = getSectionTags(section.componentName);
          
          if (sectionTags) {
            Object.entries(sectionTags).forEach(([key, tagType]) => {
              if (tagType === 'h1') h1Count++;
              else if (tagType === 'h2') h2Count++;
              else if (tagType === 'h3') h3Count++;
              else if (tagType === 'p') paragraphsCount++;
              else if (tagType === 'img') imagesCount++;
            });
          }
        });

        // 更新 contentMetrics
        contentMetrics.value = {
          h1Count,
          h2Count,
          h3Count,
          paragraphsCount,
          imagesCount,
          wordCount: articleData.value?.pageStats?.wordCount || 0
        };
      };
  
      // 计算文档结构
      const documentStructure = computed(() => {
        const structure = [];
        
        articleData.value.sections.forEach(section => {
          const sectionTags = getSectionTags(section.componentName);
          
          if (sectionTags) {
            // 为 section 创建一个组
            const sectionStructure = {
              sectionName: formatSectionName(section.componentName),
              tags: [],
              sectionId: section.sectionId
            };

            // 在该 section 内收集 h1、h2、h3 和 p 标签
            Object.entries(sectionTags).forEach(([key, tagType]) => {
              if (tagType.match(/^h[123]$/) || tagType === 'p') {
                let level = 0;
                if (tagType.startsWith('h')) {
                  level = parseInt(tagType.charAt(1));
                } else if (tagType === 'p') {
                  level = 4;
                }

                sectionStructure.tags.push({
                  id: `${section.sectionId}-${key}`,
                  type: tagType,
                  level: level
                });
              }
            });

            // 对 section 内的标签级别排序
            sectionStructure.tags.sort((a, b) => a.level - b.level);
            
            // 只有当 section 包含标签时才添加到结构中
            if (sectionStructure.tags.length > 0) {
              structure.push(sectionStructure);
            }
          }
        });

        return structure;
      });
  
      // 在 setup 中添加
      const getKeywordStats = (keyword) => {
        console.log('========= 开始查找关键词统计 =========');
        console.log('查找的关键词:', keyword);
        console.log('当前所有关键词统计数据:', articleData.value?.pageStats?.keywordStats);
        
        const stats = articleData.value?.pageStats?.keywordStats?.find(stat => {
          console.log('正在比较:', {
            当前统计项的关键词: stat.keyword,
            当前统计项的关键词小写: stat.keyword.toLowerCase(),
            查找的关键词小写: keyword.toLowerCase(),
            是否匹配: stat.keyword.toLowerCase() === keyword.toLowerCase()
          });
          return stat.keyword.toLowerCase() === keyword.toLowerCase();
        });
        
        console.log('找到的统计结果:', stats);
        console.log('========= 关键词统计查找结束 =========');
        return stats;
      };
  
      // 同时在 watch 中添加更多日志
      watch(() => articleData.value?.pageStats?.keywordStats, (newVal) => {
        console.log('关键词统计数据发生变化:', {
          统计数据总数: newVal?.length || 0,
          详细数据: newVal
        });
      }, { deep: true });

      watch(() => articleData.value?.pageStats?.genKeyword, (newVal) => {
        console.log('生成的关键词列表发生变化:', {
          关键词总数: newVal?.length || 0,
          关键词列表: newVal
        });
      }, { deep: true });

      onMounted(() => {
        console.log('组件挂载完成');
        console.log('初始articleData:', articleData.value);
      });
  
      return {
        articleData,
        saving,
        handleSave,
        handleBack,
        formatSectionName,
        scrollToSection,
        loading,
        handleSectionUpdate,
        isPublishModalVisible,
        isUnpublishModalVisible,
        publishLoading,
        unpublishLoading,
        showPublishModal,
        showUnpublishModal,
        handlePublish,
        handleUnpublish,
        cancelPublish,
        cancelUnpublish,
        previewUrl,
        activeTab,
        contentMetrics,
        documentStructure,
        getKeywordStats,
      };
    }
  });
  </script>
  
  <style scoped>
  /* 基础布局样式 */
  .article-editor {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    max-width: 1400px; /* 增加最大宽度 */
    margin: 0 auto; /* 居中显示 */
  }
  
  /* 顶部操作栏样式优化 */
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
    backdrop-filter: blur(8px);
  }
  
  /* 返回按钮样式 */
  :deep(.ant-btn-link) {
    color: #38BDF8;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    height: 36px;
    padding: 0 16px;
    border-radius: 8px;
  }
  
  :deep(.ant-btn-link:hover) {
    background: rgba(56, 189, 248, 0.08);
    color: #0EA5E9;
  }
  
  /* 保存按钮样式 */
  :deep(.ant-btn-primary) {
    background: linear-gradient(135deg, #38BDF8, #0EA5E9) !important;
    border: none;
    height: 36px;
    padding: 0 20px;
    border-radius: 8px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  :deep(.ant-btn-primary:hover) {
    background: linear-gradient(135deg, #0EA5E9, #0284C7) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(56, 189, 248, 0.2);
  }
  
  /* 容区域样式 */
  .editor-content {
    flex: 1;
    overflow-y: auto;
    height: 100vh;
    padding: 88px 32px 32px;
    margin-left: 350px;
    max-width: 1300px; /* 增加内容区最大宽度 */
  }
  
  /* Sections 容器样式 */
  .sections-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  /* Section 卡片样式 */
  .section-wrapper {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 12px;
  }
  
  .section-wrapper:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transform: none;
  }
  
  /* Section 头部样式 */
  .section-header {
    padding: 12px 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .section-header h3 {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .article-editor {
      padding: 16px;
    }
    
    .editor-content {
      padding: 0;
    }
    
    .title-input {
      font-size: 20px;
      height: 44px;
    }
  }
  
  /* 添加左侧导航样式 */
  .side-nav {
    position: fixed;
    left: max((100vw - 1300px) / 2, 24px); /* 调整定位 */
    top: 88px;
    bottom: 24px;
    width: 300px; /* 增加宽度 */
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  /* Tabs样式优化 */
  :deep(.ant-tabs) {
    height: 100%;
  }
  
  :deep(.ant-tabs-nav) {
    margin: 0;
    padding: 8px 8px 0;
    background: #ffffff;
  }
  
  :deep(.ant-tabs-tab) {
    padding: 4px 12px;
    font-size: 13px;
    min-width: auto;
    margin: 0 !important;
    transition: all 0.3s ease;
    color: #6b7280;
  }
  
  :deep(.ant-tabs-tab + .ant-tabs-tab) {
    margin-left: 4px !important;
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
  
  :deep(.ant-tabs-content) {
    padding: 12px;
    height: calc(100% - 44px);
    overflow-y: auto;
  }
  
  /* Guidelines内容样式优化 */
  .guidelines-content {
    height: 100%;
  }
  
  .guideline-section {
    background: #ffffff;
    border-radius: 16px;
    padding: 16px;
  }
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .section-title::before {
    content: '';
    display: block;
    width: 4px;
    height: 16px;
    background: linear-gradient(135deg, #38BDF8, #0EA5E9);
    border-radius: 2px;
  }
  
  /* 指标卡片网格布局优化 */
  .metrics-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  
  .metric-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .metric-card {
    background: #f8fafc;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid #e5e7eb;
    height: 40px;
  }
  
  .headings-card,
  .word-count-card {
    width: 100%;
    height: 40px;
  }
  
  .heading-stats {
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: flex-start;
  }
  
  .heading-stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .metric-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: rgba(56, 189, 248, 0.1);
    color: #38BDF8;
  }
  
  .metric-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
  }
  
  .metric-label {
    font-size: 11px;
    color: #6b7280;
  }
  
  .metric-value {
    font-size: 12px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .stat-label {
    font-size: 10px;
    color: #6b7280;
  }
  
  .stat-value {
    font-size: 11px;
    color: #1f2937;
    font-weight: 600;
    background: #e6f4ff;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  /* 滚动条美化 */
  :deep(.ant-tabs-content)::-webkit-scrollbar {
    width: 6px;
  }
  
  :deep(.ant-tabs-content)::-webkit-scrollbar-track {
    background: transparent;
  }
  
  :deep(.ant-tabs-content)::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  :deep(.ant-tabs-content)::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
  }
  
  /* 确保内容区域有合适的内边�� */
  :deep(.ant-tabs-tabpane) {
    padding: 2px;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    color: #4B5563;
    transition: all 0.3s ease;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
  
  .nav-item:hover {
    background: rgba(79, 70, 229, 0.08);
    color: #4e9aff;
  }
  
  /* 调整主容区域的边距，与导航栏宽度对应 */
  .editor-content {
    margin-left: 350px;
  }
  
  /* 响应式调整 */
  @media (max-width: 1300px) {
    .side-nav {
      left: 24px;
    }
  }
  
  @media (max-width: 1200px) {
    .side-nav {
      display: none;
    }
    
    .editor-content {
      margin-left: 0;
      padding: 88px 16px 24px;
    }
  }
  
  /* 添加加载状态样式 */
  .loading-overlay {
    position: absolute;  /* 改为 absolute 定位 */
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
  
  .loading-spinner span {
    color: #38BDF8;
    font-size: 16px;
    font-weight: 500;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid transparent;
    border-radius: 50%;
    border-top-color: #38BDF8;
    border-right-color: #0EA5E9;
    animation: spin 1s linear infinite;
    background: linear-gradient(135deg, #38BDF8, #0EA5E9);
    background-clip: padding-box;
    position: relative;
  }
  
  .spinner::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #38BDF8;
    border-right-color: #0EA5E9;
    opacity: 0.6;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* 在现有的 style 标签中添加 */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  /* 发布状态标签样式 */
  :deep(.ant-tag) {
    border-radius: 4px;
    padding: 4px 8px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  
  /* 发布和取消发布按钮样式 */
  .publish-article-btn,
  .unpublish-article-btn {
    padding: 4px 8px;
    height: auto;
    color: #38BDF8 !important;
    transition: all 0.3s ease;
  }
  
  .publish-article-btn:hover,
  .unpublish-article-btn:hover {
    background: rgba(56, 189, 248, 0.08);
  }
  
  .publish-article-btn .anticon,
  .unpublish-article-btn .anticon {
    color: #38BDF8 !important;
  }
  
  /* 确认弹窗内容样式 */
  .confirmation-content {
    padding: 8px;
  }
  
  .confirmation-section {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
  }
  
  .confirmation-section h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }
  
  .confirmation-item {
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    margin-bottom: 16px;
  }
  
  .item-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }
  
  .item-value {
    font-size: 14px;
    color: #1f2937;
    font-weight: 500;
  }
  
  .item-description {
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
    padding: 8px 12px;
    background: #ffffff;
    border-radius: 6px;
    border-left: 3px solid #1890ff;
  }
  
  .warning-text {
    border-left-color: #f59e0b;
    background: #fffbeb;
    color: #92400e;
  }
  
  /* Modal 全局样式 */
  :deep(.custom-modal) {
    .ant-modal-content {
      border-radius: 16px;
      overflow: hidden;
    }

    .ant-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      background: white;
    }

    .ant-modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .ant-modal-body {
      padding: 24px;
    }

    .ant-modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
    }

    .ant-btn {
      height: 36px;
      padding: 0 20px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .ant-btn-primary {
      background: linear-gradient(135deg, #38BDF8, #0EA5E9);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #0EA5E9, #0284C7);
      }
    }

    .ant-btn-default {
      border: 1px solid #e5e7eb;
      
      &:hover {
        color: #38BDF8;
        border-color: #38BDF8;
        background: rgba(56, 189, 248, 0.05);
      }
    }
  }

  /* 告模态框特殊样式 */
  :deep(.warning-modal) {
    .ant-modal-header {
      background: #fffbeb;
      border-bottom-color: #fef3c7;
    }

    .ant-modal-title {
      color: #92400e;
    }

    .ant-btn-primary {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      
      &:hover {
        background: linear-gradient(135deg, #d97706, #b45309);
        box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2);
      }
    }

    .ant-btn-default:hover {
      color: #d97706;
      border-color: #d97706;
      background: rgba(245, 158, 11, 0.05);
    }
  }
  
  /* 在 style 中添加预览链接样式 */
  .preview-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .preview-link span {
    color: #6b7280;
    font-weight: 500;
    margin-right: 8px;
    font-size: 12px;
  }
  
  .preview-link a {
    color: #38BDF8;
    font-weight: 500;
    font-size: 12px;
  }
  
  /* 滚动条样式优化 */
  .editor-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .editor-content::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .editor-content::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  .editor-content::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  /* Terms 部样式 */
  .terms-section {
    margin-top: 16px;
  }
  
  .terms-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .term-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .term-item:hover {
    background: rgba(79, 70, 229, 0.05);
    border-color: rgba(79, 70, 229, 0.2);
    transform: translateX(4px);
  }
  
  .term-name {
    font-size: 14px;
    color: #1f2937;
    font-weight: 500;
  }
  
  .term-count {
    background: #1890ff;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
  }
  
  /* 文档构树样式 */
  .document-structure {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
  
  .structure-title {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
  }
  
  .tree-section {
    margin-bottom: 12px;
    background: #f8fafc;
    border-radius: 6px;
    padding: 8px;
  }
  
  .section-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .section-name {
    font-size: 13px;
    color: #1f2937;
    font-weight: 500;
  }
  
  .section-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-left: 12px;
  }
  
  .tag-badge {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(56, 189, 248, 0.1);
    color: #38BDF8;
  }

  .tag-badge[data-type="h1"] {
    background: rgba(56, 189, 248, 0.1);
    color: #38BDF8;
  }

  .tag-badge[data-type="h2"] {
      background: rgba(14, 165, 233, 0.1);
      color: #0EA5E9;
  }

  .tag-badge[data-type="h3"] {
      background: rgba(2, 132, 199, 0.1);
      color: #0284C7;
  }

  /* 添加悬停效果 */
  .tree-section:hover {
    background: rgba(56, 189, 248, 0.05);
  }
  
  /* 更相关样式名称 */
  .keywords-section {
    margin-top: 16px;
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
    transition: all 0.3s ease;
  }
  
  .keyword-item:hover {
    background: rgba(56, 189, 248, 0.05);
    border-color: rgba(56, 189, 248, 0.2);
    transform: translateX(4px);
  }
  
  .keyword-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .keyword-name {
    font-size: 14px;
    color: #1f2937;
    font-weight: 500;
  }
  
  .keyword-density {
    font-size: 12px;
    color: #6b7280;
    
    /* 添加数字高亮样式 */
    .density-number {
      color: #38BDF8;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.1);
      margin: 0 2px;
    }
    
    .count-number {
      color: #10B981;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px; 
      background: rgba(16, 185, 129, 0.1);
      margin: 0 2px;
    }
  }
  
  /* 添加新的样式 */
  .heading-stats {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .heading-stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .stat-label {
    font-size: 11px;
    color: #6b7280;
    font-weight: 500;
  }

  </style>