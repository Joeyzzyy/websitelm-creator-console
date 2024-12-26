<template>
  <page-layout title="Task Management" description="Manage your AI-generation tasks" icon="✨">
    <div class="task-container">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h3>Task List</h3>
          <a-button type="link" :loading="loading" @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
          <a-button type="primary" @click="handleAddPage">
            <template #icon><PlusOutlined /></template>
            Manual Add Page
          </a-button>
          <span v-show="verifiedDomains.length === 0" class="domain-label">
            No verified sub-domain available - <router-link to="/settings">click here to add sub-domain</router-link>
          </span>
          <span v-show="verifiedDomains.length > 0" class="domain-label">Pages will be published to:</span>
          <div class="domain-tags">
            <a-tag v-for="domain in verifiedDomains" :key="domain" color="success">
              {{ domain }}
            </a-tag>
          </div>
        </div>
        <div class="header-right">
          <a-input
            v-model:value="searchQuery"
            placeholder="Search by task name..."
            class="search-input"
            @input="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <span class="task-count">Total Tasks: {{ filteredTasks.length }}</span>
        </div>
      </div>

      <!-- Task List -->
      <a-spin :spinning="loading" tip="Loading...">
        <div class="task-list">
          <!-- Empty State -->
          <div v-if="!loading && !tasks.length" class="empty-state">
            <h3>No Task Available</h3>
            <p>Go to "Keyword Planning" button to start creating your first task</p>
          </div>
          
          <!-- Task Cards -->
          <div v-else-if="!loading" v-for="task in filteredTasks" :key="task.batchId" class="task-card">
            <!-- Task Header -->
            <div class="task-header">
              <div class="task-info">
                <h4>{{ task.batchName }}</h4>
                <span>{{ task.createdAt }}</span>
              </div>
              
              <div class="task-actions">
                <a-tag :color="getStatusColor(task.status)">
                  {{ task.articles.length }} Articles ({{ getPublishedCount(task.articles) }} Published)
                </a-tag>
                <a-button type="link" @click="deleteBatch(task.batchId)">
                  <DeleteOutlined style="color: #ff4d4f" />
                </a-button>
              </div>
            </div>

            <!-- Articles Grid -->
            <div class="article-list">
              <div v-for="article in task.articles" :key="article.id" class="article-item">
                <div class="article-content">
                  <div class="article-tags">
                    <a-tag 
                      v-if="article.publishStatus === 'publish'" 
                      class="published-tag"
                      color="#52c41a">
                      Published
                    </a-tag>
                    <a-tag 
                      v-if="article.hasEmpty"
                      class="warning-tag"
                      color="red">
                      Has Empty Fields
                    </a-tag>
                  </div>
                  <div class="article-title">{{ article.title }}</div>
                  <div class="article-meta">
                    <div class="tags">
                      <a-tag :color="getTypeColor(article.category)">{{ article.category }}</a-tag>
                      <a-tag :color="getLangColor(article.lang)">{{ getLangLabel(article.lang) }}</a-tag>
                    </div>
                  </div>
                  
                  <div class="action-buttons">
                    <a class="text-button" :href="getPreviewUrl(article)" target="_blank">Preview</a>
                    <a class="text-button" @click="confirmPublishAction(article)">
                      {{ article.publishStatus === 'publish' ? 'Unpublish' : 'Publish' }}
                    </a>
                    <a class="text-button" @click="editArticle(article)">Edit</a>
                    <a 
                      v-if="article.publishStatus === 'publish'"
                      class="text-button"
                      :href="getPublishUrl(article)" 
                      target="_blank"
                    >View Published Page</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>

    <!-- Confirmation Modal -->
    <a-modal
      v-model:open="modalConfig.visible"
      :title="modalConfig.title"
      :confirm-loading="modalConfig.loading"
      :closable="false"
      @ok="handleModalConfirm"
      class="custom-modal"
    >
      <p>{{ modalConfig.content }}</p>
    </a-modal>
  </page-layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { 
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import PageLayout from './layout/PageLayout.vue'
import apiClient from '../api/api'
import config from '../config/settings'

export default {
  name: 'TaskManagementPage',
  
  components: {
    PageLayout,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    CloudUploadOutlined,
    CloudDownloadOutlined,
    SearchOutlined,
    PlusOutlined
  },

  setup() {
    const tasks = ref([])
    const loading = ref(false)
    const verifiedDomains = ref([])
    
    const modalConfig = reactive({
      visible: false,
      title: '',
      content: '',
      loading: false,
      type: '',
      data: null
    })

    const searchQuery = ref('')
    
    const loadingProgress = ref(0)
    
    // 添加计算属性于过滤任务
    const filteredTasks = computed(() => {
      if (!searchQuery.value) return tasks.value
      
      const query = searchQuery.value.toLowerCase()
      return tasks.value.filter(task => 
        task.batchName.toLowerCase().includes(query)
      )
    })

    const getProjectId = (customerId) => {
      switch (customerId) {
        case '673f4f19caf5b79765874fe8':
          return 'prj_7SXIhcIx5SOYKKVzhhRvnmUdoN7g';
        case '67525da4ba5fcadf228e56c1':
          return 'prj_7SXIhcIx5SOYKKVzhhRvnmUdoN7g';
        default:
          return 'prj_ySV5jK2SgENiBpE5D2aTaeI3KfAo'; // 默认值待定
      }
    };

    const loadProductInfo = async () => {
      try {
        const response = await apiClient.getProductsByCustomerId()
        if (response?.code === 200) {
          productInfo.value = response.data
        } else {
          console.error('Failed to load product information')
        }
      } catch (error) {
        console.error('Failed to load product information:', error)
      }
    }

    const loadVerifiedDomains = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const projectId = getProjectId(customerId)
        
        const response = await apiClient.getVercelDomainInfo(projectId)
        
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

    // Fetch task list
    const fetchTasks = async () => {
      loading.value = true
      loadingProgress.value = 0
      try {
        const userId = localStorage.getItem('currentCustomerId')
        const res = await apiClient.getBatchHistoryData(userId)
        if(res.code === 200) {
          const totalBatches = res.data.length
          let completedBatches = 0
          
          tasks.value = await Promise.all(res.data.map(async batch => {
            loadVerifiedDomains();

            // Get English articles
            const enRes = await apiClient.getBatchPagesData(batch.batchId)
            const enArticles = (enRes?.data || []).map(article => {
              // 检查文章sections是否有空值
              const hasEmpty = checkArticleForEmptyFields(article)
              return {...article, lang: 'en', hasEmpty}
            })
            
            // Get Chinese articles
            const zhRes = await apiClient.getBatchPagesData(batch.batchId, 'zh')
            const zhArticles = (zhRes?.data || []).map(article => {
              // 检查文章sections是否有空值  
              const hasEmpty = checkArticleForEmptyFields(article)
              return {...article, lang: 'zh', hasEmpty}
            })

            completedBatches++
            loadingProgress.value = Math.floor((completedBatches / totalBatches) * 100)

            return {
              ...batch,
              articles: [...enArticles, ...zhArticles],
              createdAt: new Date(batch.createdAt).toLocaleString('en-US')
            }
          }))
        }
      } catch(err) {
        console.log(err)
        message.error('Failed to fetch task list')
      } finally {
        loading.value = false
        loadingProgress.value = 0
      }
    }

    // 添加检查文章内容的函数
    const checkArticleForEmptyFields = (article) => {
      if (!article.sections) return false

      // 遍历所有sections检查空值
      return article.sections.some(section => {
        let hasEmptyField = false
        
        const checkContent = (obj) => {
          if (!obj) return
          
          Object.entries(obj).forEach(([key, value]) => {
            // 跳过特定字段
            if (['componentName', 'sectionId', 'display', 'color'].includes(key)) {
              return
            }
            
            if (Array.isArray(value)) {
              value.forEach(item => {
                if (typeof item === 'object') {
                  checkContent(item)
                } else if (!item || (typeof item === 'string' && !item.trim())) {
                  hasEmptyField = true
                }
              })
            } else if (typeof value === 'object') {
              checkContent(value)
            } else if (!value || (typeof value === 'string' && !value.trim())) {
              hasEmptyField = true
            }
          })
        }

        // 检查所有内容区域
        if (section) {
          // 检查主要内容区域
          ['topContent', 'leftContent', 'rightContent', 'bottomContent'].forEach(contentKey => {
            if (section[contentKey]) {
              checkContent(section[contentKey])
            }
          })

          // 全地检查标题字段
          const titleFields = ['title', 'subtitle', 'subTitle']
          titleFields.forEach(field => {
            const value = section[field]
            if (value !== undefined && value !== null) {
              if (typeof value === 'string' && !value.trim()) {
                hasEmptyField = true
              }
            }
          })
        }

        return hasEmptyField
      })
    }

    // Delete task
    const deleteBatch = (batchId) => {
      modalConfig.visible = true
      modalConfig.title = 'Confirm Delete'
      modalConfig.content = 'Are you sure you want to delete this task?'
      modalConfig.type = 'delete_batch'
      modalConfig.data = batchId
    }

    // Delete article
    const deleteArticle = (article) => {
      modalConfig.visible = true
      modalConfig.title = 'Confirm Delete'
      modalConfig.content = 'Are you sure you want to delete this article?'
      modalConfig.type = 'delete_article'
      modalConfig.data = article
    }

    // Handle modal confirmation
    const handleModalConfirm = async () => {
      modalConfig.loading = true
      try {
        if (modalConfig.type === 'delete_batch') {
          await apiClient.deleteBatch(modalConfig.data)
          message.success('Task deleted successfully')
          fetchTasks()
        } else if (modalConfig.type === 'delete_article') {
          await apiClient.deletePage(modalConfig.data.pageId)
          message.success('Article deleted successfully')
          fetchTasks()
        } else if (modalConfig.type === 'publish_action') {
          const article = modalConfig.data
          const isPublished = article.publishStatus === 'publish'
          
          if (isPublished) {
            await apiClient.updatePageStatus(article.pageId, 'unpublish')
            message.success('Unpublished successfully')
          } else {
            await apiClient.updatePageStatus(article.pageId, 'publish')
            message.success('Published successfully')
          }
          fetchTasks()
        }
      } catch(err) {
        message.error('Operation failed')
      } finally {
        modalConfig.loading = false
        modalConfig.visible = false
      }
    }

    // Publish/Unpublish article
    const confirmPublishAction = (article) => {
      const isPublished = article.publishStatus === 'publish'
      
      // 只在要发布时检查 verified domains
      if (!isPublished && verifiedDomains.value.length === 0) {
        message.error('No verified sub-domain available. Please verify a domain in Settings first.')
        return
      }

      modalConfig.visible = true
      modalConfig.title = isPublished ? 'Confirm Unpublish' : 'Confirm Publish'
      modalConfig.content = isPublished 
        ? 'Are you sure you want to unpublish this article?' 
        : 'Are you sure you want to publish this article?'
      modalConfig.type = 'publish_action'
      modalConfig.data = article
    }

    // Edit article
    const editArticle = (article) => {
      const url = `/page-writer?mode=edit&id=${article.pageId}&batchId=${article.batchId}&lang=${article.lang}`
      window.open(url, '_blank')
    }

    const getPreviewUrl = (article) => {
      const customerId = localStorage.getItem('currentCustomerId')
      const previewDomain = customerId === '673f4f19caf5b79765874fe8' || customerId === '67525da4ba5fcadf228e56c1'
        ? config.domains.kreado_preview 
        : config.domains.preview
        
      return `${previewDomain}${article.lang === 'zh' ? 'zh/' : 'en/'}${article.pageLangId}`
    }
    
    const getPublishUrl = (article) => {
      // 如果没有验证域名,返回空
      if (verifiedDomains.value.length === 0) {
        return ''
      }
      
      // 使用第一个验证域名���为发布域名
      const publishDomain = verifiedDomains.value[0]
      return `https://${publishDomain}/${article.lang === 'zh' ? 'zh/' : 'en/'}${article.pageLangId}`
    }

    // Style methods
    const getStatusColor = (status) => {
      const colors = {
        completed: 'success',
        in_progress: 'processing',
        failed: 'error'
      }
      return colors[status] || 'default'
    }

    const getTypeColor = (type) => {
      const colors = {
        'Blog Post': 'blue',
        'Landing Page': 'purple',
        'Product Description': 'green'
      }
      return colors[type] || 'default'
    }
    
    const getLangColor = (lang) => {
      return lang === 'zh' ? 'orange' : 'blue'
    }
    
    const getLangLabel = (lang) => {
      return lang === 'zh' ? 'Chinese' : 'English'
    }

    const getPublishedCount = (articles) => {
      return articles.filter(a => a.publishStatus === 'publish').length
    }

    const handleAddPage = () => {
      window.open('/page-writer', '_blank')
    }

    onMounted(async () => {
      fetchTasks()
      await loadProductInfo()
      await loadVerifiedDomains()
    })

    return {
      tasks,
      loading,
      modalConfig,
      deleteBatch,
      deleteArticle,
      handleModalConfirm,
      confirmPublishAction,
      editArticle,
      getPreviewUrl,
      getPublishUrl,
      getStatusColor,
      getTypeColor,
      getLangColor,
      getLangLabel,
      getPublishedCount,
      handleRefresh: fetchTasks,
      config,
      searchQuery,
      filteredTasks,
      loadingProgress,
      verifiedDomains,
      handleAddPage
    }
  }
}
</script>

<style scoped>
/* Container styles */
.task-container {
  height: 100%;
  background: #fff;
  border-radius: 12px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.task-list {
  height: calc(100vh - 200px);
  overflow: auto;
}

/* Empty state styles */
.empty-state {
  text-align: center;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

.empty-state p {
  color: #6B7280;
}

/* Task card styles */
.task-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.task-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
}

.task-info span {
  color: #666;
  font-size: 13px;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Article grid styles */
.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.article-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 130px;
  position: relative;
}

.article-content {
  flex: 1;
}

.article-title {
  font-weight: 500;
  margin-bottom: 8px;
  height: 40px;
  line-height: 20px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}

.text-button {
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  line-height: 22px;
}

.text-button:nth-child(1) {
  color: #1890ff;
}

.text-button:nth-child(2) {
  color: #52c41a;
}

.text-button:nth-child(3) {
  color: #faad14;
}

.text-button:nth-child(4) {
  color: #722ed1;
  cursor: pointer;
  opacity: v-bind('verifiedDomains.length === 0 ? 0.5 : 1');
  pointer-events: v-bind('verifiedDomains.length === 0 ? "none" : "auto"');
}

.text-button:hover {
  opacity: 0.8;
}

:deep(.ant-tag) {
  margin: 0;
  display: flex;
  align-items: center;
}

.article-actions {
  display: none;
}

.text-actions {
  display: none;
}

/* Scrollbar styles */
.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

/* Modal styles */
:deep(.custom-modal) {
  .ant-modal-content {
    border-radius: 8px;
  }

  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-body {
    padding: 20px;
  }
}

.search-input {
  width: 250px;
  margin-right: 12px;
}

:deep(.search-input) {
  .ant-input {
    border-radius: 6px;
    box-shadow: none;
  }
  
  .ant-input:focus, 
  .ant-input:hover {
    border-color: #1890ff;
  }
  
  .ant-input-affix-wrapper {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    box-shadow: none;
  }
  
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper:hover,
  .ant-input-affix-wrapper-focused {
    border-color: #1890ff; 
    box-shadow: none;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-count {
  color: grey;
  font-size: 14px;
}

.loading-text {
  font-size: 16px;
  color: #1890ff;
  text-align: center;
  padding: 20px 0;
}

:deep(.ant-spin) {
  .ant-spin-dot {
    font-size: 24px;
  }
  
  .ant-spin-text {
    margin-top: 8px;
    font-size: 14px;
    color: #1890ff;
  }
}

.ant-spin-container {
  min-height: 200px;
}

.article-tags {
  position: absolute;
  top: -12px;
  right: 8px;
  display: flex;
  gap: 8px;
  z-index: 1;
}

.published-tag,
.warning-tag {
  transform: rotate(5deg);
  font-weight: bold;
}

:deep(.published-tag.ant-tag),
:deep(.warning-tag.ant-tag) {
  border: none;
  padding: 2px 8px;
  margin: 0;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.published-tag {
  position: static;
}

/* 添加新的样式 */
.domain-tags {
  display: inline-flex;
  gap: 8px;
  margin-left: 8px;
}

:deep(.ant-tag) {
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
  border-radius: 4px;
}

.domain-label {
  color: #666;
  font-size: 13px;
  margin-left: 8px;
}

.domain-label :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.domain-label :deep(a:hover) {
  text-decoration: underline;
}

.domain-tags {
  display: inline-flex;
  gap: 8px;
  margin-left: 4px;
}
</style>