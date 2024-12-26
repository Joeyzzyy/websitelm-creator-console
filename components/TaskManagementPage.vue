<template>
  <page-layout title="Page Management" description="Manage your AI-generation pages here" icon="✨">
    <div class="task-container">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h3>Page List</h3>
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
            placeholder="Search by page title..."
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
            <h3>No Pages Available</h3>
            <p>Go to "Keyword Planning" to start creating your first task</p>
          </div>
          
            <a-table v-else-if="!loading"
              :columns="columns"
              :data-source="tasks"
              :loading="loading"
              :pagination="pagination"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'title'">
                  <router-link :to="`/edit/${record.pageId}`">
                    {{ record.title }}
                  </router-link>
                </template>

                <template v-if="column.key === 'type'">
                  <span>{{ record.articleType || '-' }}</span>
                </template>

                <template v-if="column.key === 'wordCount'">
                  <span>{{ record.numberOfWords || '-' }}</span>
                </template>

                <template v-if="column.key === 'lang'">
                  <span>{{ record.lang.toUpperCase() }}</span>
                </template>

                <template v-if="column.key === 'status'">
                  <a-tag :color="getStatusColor(record.publishStatus)">
                    {{ getStatusLabel(record.publishStatus) }}
                  </a-tag>
                </template>

                <template v-if="column.key === 'hasEmpty'">
                  <a-tag :color="record.hasEmpty ? 'warning' : 'success'">
                    {{ record.hasEmpty ? 'Has Empty Fields' : 'Complete' }}
                  </a-tag>
                </template>

                <template v-if="column.key === 'actions'">
                  <a-space>
                    <a-button 
                      type="primary"
                      size="small"
                      @click="handleEdit(record)"
                    >
                      Edit
                    </a-button>
                    <a-tooltip :title="getPublishTooltip(record)">
                      <a-button
                        :type="record.publishStatus === 'publish' ? 'default' : 'primary'"
                        size="small"
                        @click="handlePublish(record)"
                        :disabled="!canPublish(record)"
                      >
                        {{ record.publishStatus === 'publish' ? 'Unpublish' : 'Publish' }}
                      </a-button>
                    </a-tooltip>
                    <a-button
                      type="primary"
                      danger
                      size="small"
                      @click="handleDelete(record)"
                    >
                      Delete
                    </a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          
        </div>
      </a-spin>

      <!-- 在task-list底部添加分页组件 -->
      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pagination.current"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          show-size-changer
          :show-total="(total) => `Total ${total} items`"
          @change="handlePageChange"
        />
      </div>
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
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0
    })
    
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
    
    const productInfo = ref(null)
    
    // 添加计算属性于过滤任务
    const filteredTasks = computed(() => {
      if (!searchQuery.value) return tasks.value
      
      const query = searchQuery.value.toLowerCase()
      return tasks.value.filter(task => 
        task.batchName.toLowerCase().includes(query)
      )
    })

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '25%'
      },
      {
        title: 'Type',
        dataIndex: 'articleType',
        key: 'type',
        width: '10%'
      },
      {
        title: 'Word Count',
        dataIndex: 'numberOfWords',
        key: 'wordCount',
        width: '10%'
      },
      {
        title: 'Language',
        dataIndex: 'lang',
        key: 'lang',
        width: '10%'
      },
      {
        title: 'Status',
        dataIndex: 'publishStatus',
        key: 'status',
        width: '10%'
      },
      {
        title: 'Empty Fields',
        key: 'hasEmpty',
        width: '10%'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '25%'
      }
    ]

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
          message.error('Failed to load product information')
          productInfo.value = {}
        }
      } catch (error) {
        console.error('Failed to load product information:', error)
        message.error('Failed to load product information: ' + (error.message || 'Unknown error'))
        productInfo.value = {}
      }
    }

    const loadVerifiedDomains = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const projectId = getProjectId(customerId)
        
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

    // fetchTasks 方法的修改
    const fetchTasks = async () => {
      loading.value = true
      try {
        const userId = localStorage.getItem('currentCustomerId')
        
        const response = await apiClient.getPages({
          customerId: userId,
          page: pagination.current,
          limit: pagination.pageSize
        })
        
        if (response?.code === 200 && response?.data) {
          const pages = response.data.map(page => ({
            key: page.pageId,
            pageId: page.pageId,
            title: page.title,
            lang: page.lang || 'en',
            publishStatus: page.publishStatus,
            hasEmpty: checkArticleForEmptyFields(page),
            suffixURL: page.suffixURL,
            articleType: page.articleType,
            numberOfWords: page.numberOfWords,
            description: page.description
          }))

          tasks.value = pages
          pagination.total = response.TotalCount || 0
        } else {
          // 添加错误处理
          message.error('Failed to fetch tasks: Invalid response')
        }
      } catch(err) {
        console.error(err)
        message.error('Failed to fetch tasks')
      } finally {
        loading.value = false  // 确保loading状态被重置
      }
    }

    const handleTableChange = (pag) => {
      pagination.current = pag.current
      pagination.pageSize = pag.pageSize
      fetchTasks()
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
      return `${config.domains.preview}${article.lang === 'zh' ? 'zh/' : 'en/'}${article.previewId}`;
    };
    
    const getPublishUrl = (article) => {
      // 如果没有验证域名,返回空
      if (verifiedDomains.value.length === 0) {
        return ''
      }
      
      // 使用第一个验证名为发布域名
      const publishDomain = verifiedDomains.value[0]
      return `https://${publishDomain}/${article.lang === 'zh' ? 'zh/' : 'en/'}${article.pageId}`
    }

    // Style methods
    const getStatusColor = (status) => {
      switch (status) {
        case 'create':
          return 'default'
        case 'publish':
          return 'success'
        default:
          return 'default'
      }
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

    // 添加分页变化处理函数
    const handlePageChange = (page, pageSize) => {
      pagination.current = page
      pagination.pageSize = pageSize
      fetchTasks()
    }

    // 添加状态标签显示函数
    const getStatusLabel = (status) => {
      switch (status) {
        case 'create':
          return 'Not Published'
        case 'publish':
          return 'Published'
        default:
          return status
      }
    }

    const getPublishTooltip = (record) => {
      if (verifiedDomains.value.length === 0) {
        return 'No verified sub-domain available. Please verify a domain in Settings first.'
      }
      return ''; // 返回空字符串时不会显示tooltip
    }

    onMounted(async () => {
      fetchTasks()
      await loadProductInfo()
      await loadVerifiedDomains()
    })

    return {
      tasks,
      loading,
      columns,
      modalConfig,
      handleDelete: deleteArticle,
      handleEdit: editArticle,
      handlePublish: confirmPublishAction,
      handleModalConfirm,
      getStatusColor,
      handleRefresh: fetchTasks,
      searchQuery,
      filteredTasks,
      loadingProgress,
      verifiedDomains,
      handleAddPage,
      pagination,
      handleTableChange,
      handlePageChange,
      canPublish: () => verifiedDomains.value.length > 0,
      getStatusLabel,
      getPublishTooltip,
      productInfo,
      loadProductInfo,
      loadVerifiedDomains
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

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
</style>