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
          <span v-show="verifiedDomains.length > 0" class="domain-label">Pages could be published to:</span>
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
                  <a-tag :color="record.hasEmpty ? 'warning' : 'success'" style="width: fit-content">
                    {{ record.hasEmpty ? 'Has Empty Fields' : 'No Empty Fields - Completed' }}
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
                    <a-button
                      type="primary"
                      size="small"
                      @click="handlePreview(record)"
                    >
                      Preview
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
                      v-if="record.publishStatus === 'publish'"
                      type="primary"
                      size="small"
                      @click="handleSubmitSitemap(record)"
                    >
                      Submit Sitemap
                    </a-button>
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
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import PageLayout from './layout/PageLayout.vue'
import apiClient from '../api/api'
import config from '../config/settings'
import { VERCEL_CONFIG } from '../config/vercelConfig'

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
    PlusOutlined,
    EyeOutlined
  },

  setup() {
    const tasks = ref([])
    const loading = ref(false)
    const verifiedDomains = ref([])
    const subfolders = ref([])
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
        width: '30%'
      },
      {
        title: 'Type',
        dataIndex: 'articleType',
        key: 'type',
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
        width: '20%'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '20%'
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
        message.error('Failed to load product information: ' + (error.message || 'Unknown error'))
        productInfo.value = {}
      }
    }

    const loadSubfolders = async () => {
      try {
        const response = await apiClient.getSubfolders();
        if (response?.code === 200 && response?.data) {
          subfolders.value = response.data;
        }
      } catch (error) {
        console.error('Failed to load subfolders:', error);
      }
    };

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
      } catch (error) {
        console.error('Failed to load domain info:', error);
      }
    };

    // fetchTasks 方法的修改
    const fetchTasks = async () => {
      loading.value = true;
      try {
        const userId = localStorage.getItem('currentCustomerId');
        
        const response = await apiClient.getPages({
          customerId: userId,
          page: pagination.current,
          limit: pagination.pageSize
        });
        
        if (response?.code === 200 && response?.data) {
          const pages = response.data.map(page => ({
            key: page.pageId,
            pageId: page.pageId,
            title: page.title,
            lang: page.lang || 'en',
            publishStatus: page.publishStatus,
            sections: page.sections || [], // 确保 sections 字段存在
            suffixURL: page.suffixURL,
            articleType: page.articleType,
            numberOfWords: page.numberOfWords,
            description: page.description,
            author: page.author,
            relatedKeyword: page.relatedKeyword,
            publishURL: page.publishURL,
            slug: page.slug
          }));

          tasks.value = pages;
          pagination.total = response.TotalCount || 0;
        } else {
          message.error('Failed to fetch tasks: Invalid response');
        }
      } catch(err) {
        console.error(err);
        message.error('Failed to fetch tasks');
      } finally {
        loading.value = false;
      }
    };

    const handleTableChange = (pag) => {
      pagination.current = pag.current
      pagination.pageSize = pag.pageSize
      fetchTasks()
    }

    // 添加检查文章内容的函数
    const checkArticleForEmptyFields = (article) => {
      if (!article.sections) return true;
      
      // 只检查是否有 sections，不再深度检查内容
      return article.sections.length === 0;
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
          
          const fullPublishURL = `${article.publishURL}/${article.lang}/${article.slug}`
          
          const response = isPublished
            ? await apiClient.updatePageStatus(article.pageId, 'unpublish', fullPublishURL)
            : await apiClient.updatePageStatus(article.pageId, 'publish', fullPublishURL)

          // 检查响应中的 code
          if (response?.code === 200) {
            message.success(isPublished ? 'Unpublished successfully' : 'Published successfully')
            fetchTasks()
          } else {
            // 显示服务器返回的错误信息或默认错误信息
            message.error(response?.message || 'Operation failed')
          }
        } else if (modalConfig.type === 'submit_sitemap') {
          const record = modalConfig.data;
          const customerId = localStorage.getItem('currentCustomerId');
          const fullPublishURL = `${record.publishURL}/${record.lang}/${record.slug}`;
          
          const response = await apiClient.submitSite(customerId, fullPublishURL);
          
          if (response?.code === 200) {
            message.success('Successfully submitted sitemap to Google Search Console');
          } else {
            message.error('Failed to submit sitemap to Google Search Console');
          }
        }
      } catch(err) {
        console.error('Operation failed:', err)
        message.error(err?.message || 'Operation failed')
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
      const url = `/page-writer?mode=edit&id=${article.pageId}&lang=${article.lang}`
      window.open(url, '_blank')
    }

    const getPreviewUrl = (article) => {
      return `${config.domains.preview}${article.lang === 'zh' ? 'zh/' : 'en/'}${article.slug}`;
    };

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
        case 'publish':
          return 'Published'
        default:
          return 'Not Published'
      }
    }

    const getPublishBlockReasons = (record) => {
      const reasons = [];

      if (verifiedDomains.value.length === 0) {
        reasons.push('No verified domain available');
      }

      const requiredFields = {
        title: 'Title',
        description: 'Description',
        articleType: 'Type',
        lang: 'Language',
        author: 'Author',
        relatedKeyword: 'Keywords',
        publishURL: 'Publish URL',
        slug: 'Page Slug'
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        const value = record[field];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          reasons.push(`${label} is required`);
        }
      }

      if (!record.sections || record.sections.length === 0) {
        reasons.push('At least one content section is required');
      }

      return reasons;
    };

    const getPublishTooltip = (record) => {
      const reasons = getPublishBlockReasons(record);
      if (reasons.length > 0) {
        return 'Cannot publish because:\n' + reasons.join('\n');
      }
      return '';
    };

    const canPublish = (record) => {
      return getPublishBlockReasons(record).length === 0;
    };

    // 添加预览处理函数
    const handlePreview = (record) => {
      const previewUrl = getPreviewUrl(record);
      window.open(previewUrl, '_blank');
    };

    const handleSubmitSitemap = async (record) => {
      // Show confirmation modal first
      modalConfig.visible = true;
      modalConfig.title = 'Submit Sitemap';
      modalConfig.content = 'Are you sure you want to submit this page to Google Search Console?';
      modalConfig.type = 'submit_sitemap';
      modalConfig.data = record;
    };

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
      canPublish,
      getStatusLabel,
      getPublishTooltip,
      productInfo,
      loadProductInfo,
      loadVerifiedDomains,
      subfolders,
      loadSubfolders,
      handlePreview,
      handleSubmitSitemap,
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
  white-space: nowrap;
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
  width: auto !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.ant-tag) {
  margin: 0;
  white-space: normal;
  height: auto;
  line-height: 1.5;
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

/* 添加新的样式 */
.header-left :deep(.ant-btn-primary) {
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
  opacity: 0.8;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.header-left :deep(.ant-btn-primary:hover) {
  opacity: 1;
}

.header-left :deep(.ant-btn-link) {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 8px;
}

.header-left :deep(.ant-btn-link .anticon) {
  font-size: 14px;
  display: flex;
  align-items: center;
}
</style>