<template>
  <page-layout>
    <smart-banner
      :theme="bannerTheme"
      title="Page Management"
      description="Manage your AI-generated pages with powerful tools for publishing, editing, and tracking content status."
      :badges="[
        { text: 'AI Content' },
        { text: 'Publishing Tools' },
        { text: 'Status Tracking' }
      ]"
      emoji="📄"
    />

    <a-spin :spinning="loading">
    <!-- 添加域名未配置的提示 -->
    <template v-if="!domainConfigured && !loading">
      <no-site-configured />
    </template>
    
    <template v-else>
      <div class="task-container">
        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <div class="header-top">
              <h3>Page List</h3>
              <a-space>
                <a-button 
                  class="action-button secondary-btn"
                  :loading="loading" 
                  @click="handleRefresh"
                >
                  <template #icon><ReloadOutlined /></template>
                  <span>Refresh</span>
                </a-button>
                
                <a-button 
                  class="action-button secondary-btn"
                  @click="collectPublishedUrls"
                  :disabled="!tasks.length"
                >
                  <template #icon><GlobalOutlined /></template>
                  <span>Submit Sitemap</span>
                </a-button>

                <a-button 
                  type="primary"
                  @click="handleAddPage"
                  class="generate-btn action-button"
                >
                  <template #icon><PlusOutlined /></template>
                  <span>Manual Add Page</span>
                </a-button>
              </a-space>
            </div>
            
            <div class="header-bottom">
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
          </div>
        </div>

        <!-- Task List -->
        <div class="task-list">
          <!-- Empty State -->
          <div v-if="!loading && !tasks.length" class="empty-state">
            <h3>No Pages Available</h3>
            <p>Go to "Keyword Planning" to start creating your first task</p>
          </div>
          
          <a-table
            v-if="!loading && tasks.length > 0"
            :columns="columns"
            :data-source="tasks"
            :pagination="false"
            :scroll="{ x: true }"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'title'">
                <a 
                  @click="handleTitleClick(record)" 
                  class="title-link"
                  :title="record.publishStatus === 'publish' ? getFullPublishUrl(record) : getPreviewUrl(record)"
                >
                  {{ record.title }}
                </a>
                <a-tag 
                  v-if="record.generatorStatus === 'processing'" 
                  color="processing"
                  class="generating-tag"
                >
                  <span class="generating-text">Generation in progress</span>
                  <span class="dot-animation">...</span>
                </a-tag>
                <a-tag
                  v-if="record.generatorStatus === 'failed'"
                  class="generating-tag failed-tag"
                >
                  <span class="generating-text">Generation Failed</span>
                </a-tag>
              </template>

              <template v-if="column.key === 'pageType'">
                <span>{{ record.pageType || '-' }}</span>
              </template>

              <template v-if="column.key === 'wordCount'">
                <span>{{ record.numberOfWords || '-' }}</span>
              </template>

              <template v-if="column.key === 'lang'">
                <span>{{ record.lang.toUpperCase() }}</span>
              </template>

              <template v-if="column.key === 'author'">
                <span>{{ record.author || '-' }}</span>
              </template>

              <template v-if="column.key === 'createdAt'">
                <span>{{ record.createdAt }}</span>
              </template>

              <template v-if="column.key === 'updatedAt'">
                <span>{{ record.updatedAt }}</span>
              </template>

              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.publishStatus)" style="white-space: nowrap; width: 100%;">
                  {{ getStatusLabel(record.publishStatus) }}
                </a-tag>
              </template>

              <template v-if="column.key === 'hasEmpty'">
                <a-tag :color="record.hasEmpty ? 'warning' : 'success'" style="width: fit-content">
                  {{ record.hasEmpty ? 'Has Empty Fields' : 'No Empty Fields' }}
                </a-tag>
              </template>

              <template v-if="column.key === 'actions'">
                <a-dropdown>
                  <a-button size="small" style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0;">
                    <template #icon><EllipsisOutlined /></template>
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <template v-if="record.generatorStatus !== 'failed'">
                        <a-menu-item 
                          key="edit" 
                          @click="handleEdit(record)"
                          :disabled="record.generatorStatus === 'processing'"
                        >
                          Edit
                        </a-menu-item>
                        <a-menu-item 
                          key="preview" 
                          @click="handlePreview(record)"
                          :disabled="record.generatorStatus === 'processing'"
                        >
                          Preview
                        </a-menu-item>
                        <a-menu-item 
                          key="publish"
                          @click="handlePublish(record)"
                          :disabled="record.generatorStatus === 'processing'"
                        >
                          {{ record.publishStatus === 'publish' ? 'Unpublish' : 'Publish' }}
                        </a-menu-item>
                      </template>
                      <a-menu-item 
                        key="delete"
                        @click="handleDelete(record)"
                        :disabled="record.generatorStatus === 'processing'"
                        danger
                      >
                        Delete
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
            </template>
          </a-table>
        </div>

        <!-- 保留外部分页组件 -->
        <div class="pagination-wrapper" v-if="!loading && tasks.length > 0">
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
    </template>

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

    <!-- Publish Confirmation Modal -->
    <a-modal
      v-model:visible="publishModal.visible"
      :title="publishModal.title"
      :confirm-loading="publishModal.loading"
      @ok="handlePublishConfirm"
      @cancel="handlePublishCancel"
    >
      <template v-if="!publishModal.data?.publishURL">
        <p>Please set a publish URL for this page before publishing.</p>
        <p>You can set the publish URL in the page editor.</p>
      </template>
      <template v-else>
        <p>Are you sure you want to {{ publishModal.data?.publishStatus === 'publish' ? 'unpublish' : 'publish' }} this page?</p>
        <p v-if="publishModal.data?.publishStatus !== 'publish'">
          The page will be published to:
          <br/>
          <strong>{{ getFullPublishUrl(publishModal.data) }}</strong>
        </p>
      </template>
    </a-modal>

    <!-- 修改预览模态框 -->
    <a-modal
      v-model:visible="sitemapModal.visible"
      title="Submit URLs to Google Search Console"
      width="800px"
      @ok="handleSubmitUrls"
      @cancel="closeSitemapModal"
      :confirmLoading="submitLoading"
      :okText="'Submit to Google'"
      :cancelText="'Cancel'"
    >
      <div class="sitemap-preview">
        <div class="preview-header">
          <a-alert
            message="Below are all published page URLs. Confirm to submit to Google Search Console"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <div class="url-count">
            Found {{ publishedUrls.length }} published pages
          </div>
        </div>
        
        <a-list
          :data-source="publishedUrls"
          :bordered="true"
          size="small"
          class="url-list"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <div class="url-item">
                <span class="url-text">{{ item }}</span>
                <a-button 
                  type="link" 
                  size="small"
                  @click="openPreview(item)"
                >
                  View
                </a-button>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>
  </a-spin>
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
  EyeOutlined,
  EllipsisOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'
import PageLayout from './layout/PageLayout.vue'
import apiClient from '../api/api'
import config from '../config/settings'
import { VERCEL_CONFIG } from '../config/vercelConfig'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import SmartBanner from './common/SmartBanner.vue'

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
    EyeOutlined,
    EllipsisOutlined,
    GlobalOutlined,
    NoSiteConfigured,
    SmartBanner
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
    
    const domainConfigured = ref(false)
    
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
        width: '22%',
        ellipsis: true
      },
      {
        title: 'Page Type',
        dataIndex: 'pageType',
        key: 'pageType',
        width: '8%',
        ellipsis: true
      },
      {
        title: 'Language',
        dataIndex: 'lang',
        key: 'lang',
        width: '8%'
      },
      {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        width: '10%'
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '12%'
      },
      {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: '12%'
      },
      {
        title: 'Status',
        dataIndex: 'publishStatus',
        key: 'status',
        width: '8%'
      },
      {
        title: 'Empty Fields',
        key: 'hasEmpty',
        width: '7%'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        fixed: 'right'
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
        loading.value = true;
        const response = await apiClient.getProductsByCustomerId()
        if (response?.code === 200) {
          productInfo.value = response.data
          // 检查域名配置状态
          domainConfigured.value = !!(productInfo.value?.projectWebsite && productInfo.value?.domainStatus)
        } else {
          productInfo.value = {}
          domainConfigured.value = false
        }
      } catch (error) {
        productInfo.value = {}
        domainConfigured.value = false
      } finally {
        loading.value = false;
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
        // 1. 首先获取域名列表
        const response = await apiClient.getVercelDomainInfo(projectId);
        
        // 2. 过滤并检查域名
        const verifiedDomainsPromises = response?.domains
          ?.filter(domain => 
            domain.verified && 
            !domain.name.includes('vercel.app') && // 过滤掉 vercel.app 域名
            domain.name !== productInfo.value?.projectWebsite // 过滤掉主域名
          )
          ?.map(async domain => {
            try {
              const config = await apiClient.getVercelDomainConfig(domain.name);
              return !config?.misconfigured ? domain.name : null;
            } catch (error) {
              console.error(`Failed to get config for domain ${domain.name}:`, error);
              return null;
            }
          }) || [];

        // 3. 等待所有配置检查完成
        const verifiedDomainsList = (await Promise.all(verifiedDomainsPromises))
          .filter(Boolean);

        await loadSubfolders();
        
        // 4. 合并验证过的域名和子文件夹
        verifiedDomains.value = [
          ...verifiedDomainsList,
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
            sections: page.sections || [],
            suffixURL: page.suffixURL,
            articleType: page.articleType,
            pageType: page.pageType || 'Blog',
            numberOfWords: page.numberOfWords,
            description: page.description,
            author: page.author,
            relatedKeyword: page.relatedKeyword,
            publishURL: page.publishURL,
            slug: page.slug,
            generatorStatus: page.generatorStatus || '',
            createdAt: new Date(page.createdAt).toLocaleString(),
            updatedAt: new Date(page.updatedAt).toLocaleString(),
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
      modalConfig.content = 'Are you sure you want to delete this page?'
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

    const getPreviewUrl = (record) => {
      if (!record?.slug || !record?.lang) {
        return '';
      }
      // 使用 productInfo 中的 projectWebsite 作为 userDomain
      const userDomain = productInfo.value?.projectWebsite || '';
      // 构建预览 URL，将 userDomain 放在最后
      return `${config.domains.preview}/${record.lang}/${record.slug}/${userDomain}`;
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

      // 检查是否有已验证的域名
      if (verifiedDomains.value.length === 0) {
        reasons.push('No verified domain available');
      }

      // 检查必填字段 - 移除 publishURL
      const requiredFields = {
        title: 'Title',
        description: 'Description',
        articleType: 'Type',
        lang: 'Language',
        author: 'Author',
        relatedKeyword: 'Keywords',
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

    // 修改发布处理逻辑
    const handlePublish = (record) => {
      // 检查是否设置了发布URL
      if (!record.publishURL) {
        publishModal.value = {
          visible: true,
          title: 'Cannot Publish',
          loading: false,
          data: record
        };
        return;
      }

      publishModal.value = {
        visible: true,
        title: record.publishStatus === 'publish' ? 'Confirm Unpublish' : 'Confirm Publish',
        loading: false,
        data: record
      };
    };

    // 修改获取完整发布URL的方法
    const getFullPublishUrl = (record) => {
      if (!record?.publishURL || !record?.lang || !record?.slug) {
        return '';
      }
      
      // 从 publishURL 中提取基础域名和路径
      let baseUrl = record.publishURL.replace(/\/+$/, '');
      
      // 分离域名和路径
      const [domain, ...pathParts] = baseUrl.split('/');
      
      // 构建基础URL（带协议）
      const baseWithProtocol = domain.startsWith('http') ? domain : `https://${domain}`;
      
      // 构建路径：如果语言不是英语，才添加语言标签
      const pathComponents = [
        record.lang !== 'en' ? record.lang : null,  // 只在非英语时添加语言标签
        ...pathParts,                               // 原有的路径部分（如 tutorials）
        record.slug                                 // slug
      ].filter(Boolean).join('/');                 // 过滤掉空值并用斜杠连接
      
      return `${baseWithProtocol}/${pathComponents}`;
    };

    // 修改发布确认处理
    const handlePublishConfirm = async () => {
      const record = publishModal.value.data;
      if (!record || !record.publishURL) {
        publishModal.value.visible = false;
        return;
      }

      publishModal.value.loading = true;
      try {
        const isPublished = record.publishStatus === 'publish';
        const fullPublishURL = getFullPublishUrl(record);

        const response = isPublished
          ? await apiClient.updatePageStatus(record.pageId, 'unpublish', fullPublishURL)
          : await apiClient.updatePageStatus(record.pageId, 'publish', fullPublishURL);

        if (response?.code === 200) {
          message.success(isPublished ? 'Unpublished successfully' : 'Published successfully');
          fetchTasks();
        } else {
          message.error(response?.message || 'Operation failed');
        }
      } catch (error) {
        console.error('Publish action failed:', error);
        message.error(error?.message || 'Operation failed');
      } finally {
        publishModal.value.loading = false;
        publishModal.value.visible = false;
      }
    };

    const handlePublishCancel = () => {
      publishModal.value.visible = false;
    };

    // 添加发布模态框的响应式变量
    const publishModal = ref({
      visible: false,
      title: '',
      loading: false,
      data: null
    });

    const sitemapModal = ref({
      visible: false
    })
    const publishedUrls = ref([])
    const submitLoading = ref(false)

    // 收集并展示已发布的 URLs
    const collectPublishedUrls = async () => {
      try {
        loading.value = true;
        const response = await apiClient.getPublishUrls();
        
        if (response?.code === 200) {
          const urls = response.data || [];
          
          if (urls.length === 0) {
            message.warning('No published pages found');
            return;
          }

          // 过滤掉 URL 中的 /en/ 标记
          publishedUrls.value = urls.map(url => {
            // 使用正则表达式替换 /en/ 标记
            return url.replace(/([^\/]+)\/en\//, '$1/');
          });
          sitemapModal.value.visible = true;
        } else {
          throw new Error(response?.message || 'Failed to get published URLs');
        }
      } catch (error) {
        console.error('Failed to collect published URLs:', error);
        message.error(error.message || 'Failed to get published URLs');
      } finally {
        loading.value = false;
      }
    };

    // Update handleSubmitUrls method
    const handleSubmitUrls = async () => {
      if (publishedUrls.value.length === 0) {
        message.warning('No URLs available for submission');
        return;
      }

      submitLoading.value = true;
      try {
        const response = await apiClient.publishSitemapAndUrls();
        
        if (response?.code === 200) {
          message.success('Successfully submitted URLs to Google Search Console');
          sitemapModal.value.visible = false;
        } else {
          throw new Error(response?.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Failed to submit URLs:', error);
        message.error(error.message || 'Submission failed');
      } finally {
        submitLoading.value = false;
      }
    };

    const closeSitemapModal = () => {
      sitemapModal.value.visible = false
      publishedUrls.value = []
    }

    const isMounted = ref(false)

    // 添加打开预览的方法
    const openPreview = (url) => {
      if (typeof window !== 'undefined') {
        // 使用与 handleTitleClick 相同的逻辑处理 URL
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(fullUrl, '_blank');
      }
    }

    // 修改标题点击处理函数
    const handleTitleClick = (record) => {
      const url = record.publishStatus === 'publish' 
        ? getFullPublishUrl(record)
        : getPreviewUrl(record);
      
      if (url) {
        // 确保 URL 是完整的（包含 http:// 或 https://）
        if (record.publishStatus === 'publish') {
          const fullUrl = url.startsWith('http') ? url : `https://${url}`;
          window.open(fullUrl, '_blank');
        } else {
          window.open(url, '_blank');
        }
      }
    }; 

    const bannerTheme = {
      primary: '#059669',
      secondary: '#10B981',
      background: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
      textColor: '#FFFFFF',
      descriptionColor: '#FFFFFF',
      badgeColor: '#FFFFFF',
      badgeBackground: 'rgba(255, 255, 255, 0.15)',
      badgeHoverBackground: 'rgba(255, 255, 255, 0.25)',
      badgeHoverColor: '#FFFFFF',
      iconBackground: 'rgba(255, 255, 255, 0.15)',
    }

    onMounted(async () => {
      await loadProductInfo()
      // 只有在域名已配置的情况下才执行其他操作
      if (domainConfigured.value) {
        fetchTasks()
        await loadVerifiedDomains()
      }
      isMounted.value = true
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
      publishModal,
      handlePublish,
      handlePublishConfirm,
      handlePublishCancel,
      getFullPublishUrl,
      sitemapModal,
      publishedUrls,
      submitLoading,
      collectPublishedUrls,
      handleSubmitUrls,
      closeSitemapModal,
      isMounted,
      openPreview,
      handleTitleClick,
      getPreviewUrl,
      domainConfigured,
      bannerTheme
    }
  }
}
</script>

<style scoped>
/* Container styles */
.task-container {
  height: calc(100vh - 200px); /* 使用视窗高度减去头部空间 */
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-top h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.header-bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.task-list {
  flex: 1; /* 让任务列表占据剩余空间 */
  display: flex; /* 添加 flex 布局 */
  flex-direction: column; /* 垂直方向排列 */
  min-height: 0; /* 防止溢出 */
}

/* Empty state styles */
.empty-state {
  flex: 1; /* 占据所有可用空间 */
  text-align: center;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  border-radius: 8px;
  margin: 20px;
}

.empty-state h3 {
  font-size: 18px;
  color: #374151;
  margin-bottom: 12px;
  font-weight: 500;
}

.empty-state p {
  color: #6B7280;
  margin: 0;
  font-size: 14px;
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
  display: none;
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
  /* 修改定位逻辑，考虑左侧导航栏的宽度 */
  position: fixed !important;
  top: 50% !important;
  left: calc(50% + 120px) !important; /* 120px 是左侧导航栏的一半宽度，根据实际情况调整 */
  transform: translate(-50%, -50%) !important;
  z-index: 1000;

  .ant-spin-dot {
    font-size: 24px;
  }
  
  .ant-spin-text {
    margin-top: 8px;
    font-size: 14px;
    color: #1890ff;
  }
}

/* 移除之前的相对定位样式 */
.ant-spin-container {
  min-height: unset;
}

.task-list {
  min-height: unset;
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
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 4px;
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

.generating-tag {
  margin-left: 8px;
  transform: rotate(-2deg);
  position: relative;
  display: inline-flex;
  align-items: center;
  background: linear-gradient(45deg, #1890ff, #52c41a) !important;
  border: none !important;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
  animation: glow 2s ease-in-out infinite;
}

.generating-text {
  color: white !important;
  font-weight: 500;
  display: inline-block;
}

.dot-animation {
  color: white;
  margin-left: 2px;
  animation: dots 1.4s infinite;
  width: 12px;
  display: inline-block;
}

@keyframes glow {
  0% {
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(24, 144, 255, 0.5);
  }
  100% {
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
  }
}

@keyframes dots {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
  100% { content: '.'; }
}

:deep(.ant-tag.generating-tag) {
  font-size: 12px;
  padding: 2px 10px;
  height: 24px;
  line-height: 20px;
  border-radius: 12px;
}

/* 添加悬停效果 */
.generating-tag:hover {
  transform: rotate(-2deg) scale(1.05);
  transition: transform 0.2s ease;
}

/* 调整 actions 列的宽度 */
:deep(.ant-table) .ant-table-cell:last-child {
  width: 40px !important;
  min-width: 40px !important;
  padding: 8px 4px !important;
  text-align: center;
}

/* 确保表格单元格内容正确显示 */
:deep(.ant-table-cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 标题列允许换行和宽度限制 */
:deep(.ant-table-cell-fix-left) {
  white-space: normal !important;
  word-break: break-word;
  /* 移除最大和最小宽度限制 */
  /* max-width: 200px !important;
  min-width: 200px !important; */
}

/* 确保标签内容不换行且省略 */
:deep(.ant-tag) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 调整下拉按钮样式 */
:deep(.ant-dropdown-trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-btn) {
  min-width: 32px;
  padding: 0;
}

:deep(.ant-btn .anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* 添加failed-tag的样式 */
.failed-tag {
  background: linear-gradient(45deg, #ff4d4f, #cf1322) !important;
  border: none !important;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
  animation: glow-failed 2s ease-in-out infinite;
}

@keyframes glow-failed {
  0% {
    box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(255, 77, 79, 0.5);
  }
  100% {
    box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
  }
}

/* 确保failed-tag继承generating-tag的基础样式 */
:deep(.ant-tag.generating-tag.failed-tag) {
  font-size: 12px;
  padding: 2px 10px;
  height: 24px;
  line-height: 20px;
  border-radius: 12px;
}

.failed-tag:hover {
  transform: rotate(-2deg) scale(1.05);
  transition: transform 0.2s ease;
}

.sitemap-preview {
  max-height: 500px;
  overflow-y: auto;
}

.preview-header {
  margin-bottom: 16px;
}

.url-count {
  margin: 8px 0;
  font-weight: 500;
  color: #1890ff;
}

.url-list {
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.url-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.url-text {
  flex: 1;
  word-break: break-all;
  margin-right: 16px;
}

:deep(.ant-list-item) {
  padding: 8px 16px;
}

:deep(.ant-btn-link) {
  padding: 0 8px;
  height: 24px;
  font-size: 12px;
}

/* 添加标题链接样式 */
.title-link {
  color: #1890ff;
  cursor: pointer;
  transition: color 0.3s;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制最多显示2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 移除多余的容器样式，只保留必要的表格样式 */
:deep(.ant-table) {
  /* min-width: 1200px; */
}

/* 修改表格容器样式 */
.task-container {
  width: 100%;
  overflow: hidden;  /* 添加这个 */
}

.task-list {
  width: 100%;
  overflow: visible;  /* 修改这个 */
}

/* 添加新的滚动容器样式 */
:deep(.ant-table-wrapper) {
  overflow-x: auto;
  width: 100%;
}

:deep(.ant-table-content) {
  overflow-x: auto;
}

/* 确保操作列样式正确 */
:deep(.ant-table-cell:last-child) {
  padding: 8px !important;
  text-align: center;
  background: #fff;
}

/* 新增和修改的样式 */
.header-top {
  display: flex;
  align-items: center;
  gap: 16px; /* 增加间距 */
}

.header-top h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

/* 修改按钮样式 */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.action-button :deep(.anticon) {
  display: flex;
  align-items: center;
  margin-right: 0; /* 覆盖默认的 margin */
}

/* 主按钮渐变样式 */
.generate-btn {
  background: linear-gradient(-45deg, #2563eb, #7c3aed, #2563eb);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3),
              0 0 20px rgba(37, 99, 235, 0.2),
              inset 0 0 8px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
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

.generate-btn :deep(span) {
  color: white !important;
}

.generate-btn :deep(.anticon) {
  color: white !important;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 优化次要按钮样式 */
.secondary-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.secondary-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.secondary-btn:active {
  background: #e2e8f0;
  transform: translateY(0);
}

.secondary-btn:disabled {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary-btn :deep(.anticon) {
  font-size: 14px;
  display: flex;
  align-items: center;
}

/* 修改 loading 状态样式 */
.secondary-btn:loading {
  opacity: 0.8;
  cursor: wait;
}
</style>