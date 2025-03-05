<template>
  <page-layout>
    <a-spin :spinning="loading" class="centered-spin">
    <!-- 添加域名未配置的提示 -->
      <template v-if="domainConfigured">
        <div class="task-container">
          <div class="header">
            <div class="header-left">
              <div class="header-top">
                <a-space>
                  <a-button 
                    class="action-button secondary-btn"
                    :loading="loading" 
                    @click="handleRefresh"
                  >
                    <span>Refresh</span>
                  </a-button>

                  <a-button 
                    class="action-button secondary-btn highlight-btn"
                    @click="showSettings"
                  >
                    <span>Publish Domain Settings</span>
                  </a-button>
                  
                  <a-button 
                    class="action-button secondary-btn"
                    @click="collectPublishedUrls"
                    :disabled="!tasks.length"
                  >
                    <span>Submit Sitemap</span>
                  </a-button>

                  <a-button 
                    class="action-button secondary-btn danger-btn"
                    :disabled="!selectedRowKeys.length"
                    @click="handleBatchDelete"
                  >
                    <span>Delete Selected Pages ({{ selectedRowKeys.length }})</span>
                  </a-button>

                  <a-button 
                    type="primary"
                    @click="handleAddPage"
                    class="generate-btn action-button"
                    v-if="currentCustomerId === '67a9fabf538eb88a2247b5be'"
                  >
                    <span>Add Page From Scratch</span>
                  </a-button>

                  
                </a-space>
              </div>
            </div>
            <!-- <div class="header-right">
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
            </div> -->
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
              :row-selection="{ 
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                getCheckboxProps: getCheckboxProps
              }"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'title'">
                  <div class="title-container">
                    <a 
                      @click="handleTitleClick(record)" 
                      class="title-link"
                      :title="record.publishStatus === 'publish' ? getFullPublishUrl(record) : getPreviewUrl(record)"
                    >
                      {{ record.title }}
                    </a>
                    <div class="status-tags">
                      <a-tag
                        v-if="record.generatorStatus === 'processing'"
                        color="processing"
                        class="generating-tag clickable"
                        @click.stop="showWorkflow(record)"
                        title="Click to view generation progress"
                      >
                        <span class="generating-text">Generating</span>
                        <span class="dot-animation">...</span>
                        <span class="view-text">View Progress</span>
                      </a-tag>
                      <a-tag
                        v-else-if="record.generatorStatus === 'failed'"
                        class="generating-tag failed-tag clickable"
                        @click.stop="showWorkflow(record)"
                        title="Click to view generation details"
                      >
                        <span class="generating-text">Generation Failed</span>
                        <span class="view-text">View Details</span>
                      </a-tag>
                      <a-tag
                        v-else
                        color="success"
                        class="status-tag clickable"
                        @click.stop="showWorkflow(record)"
                        title="Click to view generation history"
                      >
                        <span>Generated</span>
                        <span class="view-text"> (View History)</span>
                      </a-tag>
                    </div>
                  </div>
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
                  <a-dropdown :trigger="['click']">
                    <a-button type="link">
                      <EllipsisOutlined />
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item 
                          key="edit" 
                          @click="handleEdit(record)"
                          :disabled="record.generatorStatus === 'processing'"
                        >
                          <span>Edit</span>
                        </a-menu-item>
                        <a-menu-item 
                          key="preview" 
                          @click="handlePreview(record)"
                          :disabled="record.generatorStatus === 'processing'"
                        >
                          <span>Preview</span>
                        </a-menu-item>
                        <a-menu-item 
                          key="publish"
                          @click="handlePublish(record)"
                          :disabled="record.generatorStatus === 'processing'"
                        >
                          <span>
                            {{ record.publishStatus === 'publish' ? 'Unpublish' : 'Publish' }}
                          </span>
                        </a-menu-item>
                        <a-menu-item 
                          key="delete"
                          @click="handleDelete(record)"
                          :disabled="record.generatorStatus === 'processing'"
                          danger
                        >
                          <span>Delete</span>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>
              </template>
            </a-table>
          </div>

          <!-- 修改分页组件 -->
          <div class="pagination-wrapper" v-if="!loading && tasks.length > 0">
            <a-pagination
              v-model:current="pagination.current"
              :total="pagination.total"
              :pageSize="pagination.pageSize"
              :show-total="(total) => `Total ${total} items`"
              :show-size-changer="false"
              @change="handleTableChange"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <no-site-configured v-if="!loading"/>
      </template>
    </a-spin>
    <!-- 合并后的发布模态框 -->
    <a-modal
      v-model:visible="publishModal.visible"
      :title="publishModal.data?.publishStatus === 'publish' ? 'Unpublish Page' : 'Publish Page'"
      :confirm-loading="publishModal.loading"
      @ok="handlePublishConfirm"
      @cancel="handlePublishCancel"
      width="800px"
    >
      <template v-if="publishModal.data?.publishStatus === 'publish'">
        <p>Are you sure you want to unpublish this page?</p>
        <p>Current publish URL: <strong>{{ getFullPublishUrl(publishModal.data) }}</strong></p>
      </template>
      <template v-else>
        <a-form layout="vertical">
          <a-form-item label="Publish URL" required>
            <a-select
              v-model:value="publishModal.publishUrl"
              placeholder="Please select a root domain for the page to be published"
              style="width: 100%"
              allowClear
            >
              <a-select-option 
                v-for="domain in verifiedDomains" 
                :key="domain"
                :value="domain"
              >
                {{ domain }}
              </a-select-option>
            </a-select>
            <div class="preview-url-hint" v-if="publishModal.publishUrl && publishModal.data">
              <div class="hint-label">This page will be published to:</div>
              <div class="preview-url">
                {{ getFullPublishUrl({...publishModal.data, publishURL: publishModal.publishUrl}) }}
              </div>
            </div>
            
            <a-alert
              v-if="verifiedDomains.length === 0"
              type="warning"
              show-icon
              message="No publish domains available"
              description="You need to configure a domain before publishing pages."
              style="margin-top: 12px"
            />
          </a-form-item>
        </a-form>
      </template>
      
      <!-- 添加自定义底部按钮 -->
      <template #footer>
        <a-button @click="handlePublishCancel">
          Cancel
        </a-button>
        <a-button @click="handleConfigDomain">
          Configure Publish Domain
        </a-button>
        <a-button 
          type="primary" 
          :loading="publishModal.loading"
          @click="handlePublishConfirm"
        >
          {{ publishModal.data?.publishStatus === 'publish' ? 'Unpublish' : 'Publish' }}
        </a-button>
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

    <!-- 添加通用确认模态框 -->
    <a-modal
      v-model:visible="modalConfig.visible"
      :title="modalConfig.title"
      :confirm-loading="modalConfig.loading"
      @ok="handleModalConfirm"
      @cancel="handleModalCancel"
    >
      {{ modalConfig.content }}
    </a-modal>

    <!-- 修改 SettingsModal，传入 productInfo -->
    <settings-modal
      v-model:visible="settingsVisible"
      :product-info="productInfo"
    />

    <!-- Add workflow modal -->
    <a-modal
      v-model:visible="workflowVisible"
      title="Generation Progress"
      :footer="null"
      width="1200px"
      @cancel="handleWorkflowClose"
    >
      <workflow-status
        :pageId="currentPageId"
        :isProcessing="isProcessing"
      />
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
  EyeOutlined,
  EllipsisOutlined,
  GlobalOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import PageLayout from './layout/PageLayout.vue'
import apiClient from '../api/api'
import config from '../config/settings'
import { VERCEL_CONFIG } from '../config/vercelConfig'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import SmartBanner from './common/SmartBanner.vue'
import SettingsModal from './SettingsDomainModal.vue'
import WorkflowStatus from './WorkflowStatus.vue'

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
    SmartBanner,
    SettingOutlined,
    SettingsModal,
    WorkflowStatus
  },

  setup() {
    const tasks = ref([])
    const loading = ref(false)
    const verifiedDomains = ref([])
    const subfolders = ref([])
    const currentCustomerId = ref(localStorage.getItem('currentCustomerId') || '')
    const pagination = reactive({
      current: 1,
      pageSize: 17,
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
        width: '30%',
        ellipsis: true
      },
      {
        title: 'Page Type',
        dataIndex: 'pageType',
        key: 'pageType',
        width: '10%',
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
        title: 'Actions',
        key: 'actions',
        width: '5%',
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
        // 1. 获取域名列表
        const response = await apiClient.getVercelDomainInfo(projectId);
        console.log('API Response domains:', response?.domains);
        
        // 2. 获取当前项目的根域名
        const rootDomain = productInfo.value?.projectWebsite;
        if (!rootDomain) {
          console.warn('No root domain configured');
          verifiedDomains.value = [];
          return;
        }

        // 3. 过滤并检查域名 - 只保留以根域名结尾的域名
        const verifiedDomainsPromises = response?.domains
          ?.filter(domain => 
            domain.verified && 
            !domain.name.includes('vercel.app') && // 过滤 vercel.app 域名
            (domain.name === rootDomain || domain.name.endsWith(`.${rootDomain}`)) // 只保留根域名相关的域名
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

        // 4. 等待所有配置检查完成
        const verifiedDomainsList = (await Promise.all(verifiedDomainsPromises))
          .filter(Boolean);

        await loadSubfolders();
        
        console.log('Root domain:', rootDomain);
        console.log('Verified domains before merge:', verifiedDomainsList);
        console.log('Subfolders:', subfolders.value);
        
        // 5. 合并验证过的域名和子文件夹路径
        verifiedDomains.value = [
          ...verifiedDomainsList,
          ...(subfolders.value.map(subfolder => `${rootDomain}/${subfolder}`))
        ];
        
        console.log('Final verified domains:', verifiedDomains.value);
      } catch (error) {
        console.error('Failed to load domain info:', error);
        verifiedDomains.value = [];
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
      pagination.current = pag
      pagination.pageSize = pagination.pageSize // 保持原有的 pageSize
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
      console.log('deleteArticle called:', article)
      modalConfig.visible = true
      modalConfig.title = 'Confirm Delete'
      modalConfig.content = 'Are you sure you want to delete this page?'
      modalConfig.type = 'delete_article'
      modalConfig.data = article
    }

    // Handle modal confirmation
    const handleModalConfirm = async () => {
      console.log('handleModalConfirm called, type:', modalConfig.type)
      modalConfig.loading = true
      try {
        if (modalConfig.type === 'delete_article') {
          console.log('Deleting article:', modalConfig.data)
          await apiClient.deletePage(modalConfig.data.pageId)
          message.success('Deleted successfully')
          fetchTasks()
        } else if (modalConfig.type === 'publish_action') {  
          const article = modalConfig.data
          const isPublished = article.publishStatus === 'publish'
          
          const baseUrl = article.publishURL.startsWith('http') 
            ? article.publishURL 
            : `https://${article.publishURL}`
          
          const langPath = article.lang === 'en' ? '' : `/${article.lang}`
          const fullPublishURL = `${baseUrl}${langPath}/${article.slug}`
          
          const response = isPublished
            ? await apiClient.updatePageStatus(article.pageId, 'unpublish', fullPublishURL)
            : await apiClient.updatePageStatus(article.pageId, 'publish', fullPublishURL)

          if (response?.code === 200) {
            message.success(isPublished ? 'Unpublished successfully' : 'Published successfully')
            fetchTasks()
          } else {
            message.error(response?.message || 'Operation failed')
          }
        } else if (modalConfig.type === 'submit_sitemap') {
          const record = modalConfig.data
          const customerId = localStorage.getItem('currentCustomerId')
          const fullPublishURL = `${record.publishURL}/${record.lang}/${record.slug}`
          
          const response = await apiClient.submitSite(customerId, fullPublishURL)
          
          if (response?.code === 200) {
            message.success('Successfully submitted to Google Search Console')
          } else {
            message.error('Failed to submit to Google Search Console')
          }
        } else if (modalConfig.type === 'batch_delete') {
          const deletePromises = modalConfig.data.map(pageId => 
            apiClient.deletePage(pageId)
          )
          
          await Promise.all(deletePromises)
          message.success(`Successfully deleted ${modalConfig.data.length} pages`)
          // 清空选中的行
          selectedRowKeys.value = []
          fetchTasks()
        }
      } catch (error) {
        console.error('Operation failed:', error)
        message.error(error?.message || 'Operation failed')
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
      publishModal.value = {
        visible: true,
        loading: false,
        data: record,
        publishUrl: record.publishURL || undefined
      };
    };

    // 修改获取完整发布URL的方法
    const getFullPublishUrl = (record) => {
      if (!record?.publishURL || !record?.slug) {
        return '';
      }
      
      // 确保 URL 以 https:// 开头
      const baseUrl = record.publishURL.startsWith('http') 
        ? record.publishURL 
        : `https://${record.publishURL}`;
      
      // 只有非英语时才添加语言路径
      const langPath = record.lang === 'en' ? '' : `/${record.lang}`;
      
      return `${baseUrl}${langPath}/${record.slug}`;
    };

    // 修改确认发布的方法
    const handlePublishConfirm = async () => {
      const record = publishModal.value.data;
      if (!record) return;

      // 如果是取消发布，直接执行
      if (record.publishStatus === 'publish') {
        try {
          publishModal.value.loading = true;
          const fullPublishURL = getFullPublishUrl(record);
          await apiClient.updatePageStatus(record.pageId, 'unpublish', fullPublishURL);
          message.success('Unpublished successfully');
          fetchTasks();
        } catch (error) {
          console.error('Unpublish failed:', error);
          message.error('Failed to unpublish page');
        } finally {
          publishModal.value.loading = false;
          publishModal.value.visible = false;
        }
        return;
      }

      // 发布前验证 URL
      if (!publishModal.value.publishUrl) {
        message.warning('Please select a root domain for the page to be published');
        return;
      }

      try {
        publishModal.value.loading = true;
        // 使用新选择的 publishUrl
        const updatedRecord = {
          ...record,
          publishURL: publishModal.value.publishUrl
        };
        const fullPublishURL = getFullPublishUrl(updatedRecord);

        // 先更新 publishUrl，再发布
        await apiClient.updatePage(record.pageId, {
          publishUrl: publishModal.value.publishUrl
        });
        await apiClient.updatePageStatus(record.pageId, 'publish', fullPublishURL);
        
        message.success('Published successfully');
        fetchTasks();
      } catch (error) {
        console.error('Publish failed:', error);
        message.error('Failed to publish page');
      } finally {
        publishModal.value.loading = false;
        publishModal.value.visible = false;
      }
    };

    const handlePublishCancel = () => {
      publishModal.value.visible = false;
    };

    // 修改发布模态框的响应式变量
    const publishModal = ref({
      visible: false,
      loading: false,
      data: null,
      publishUrl: undefined
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

    const handleModalCancel = () => {
      modalConfig.visible = false
      modalConfig.loading = false
      modalConfig.data = null
    }

    // Add new reactive references
    const selectedRowKeys = ref([])
    const batchDeleteLoading = ref(false)

    // Add selection change handler
    const onSelectChange = (keys) => {
      selectedRowKeys.value = keys
    }

    // Add checkbox props getter
    const getCheckboxProps = (record) => ({
      disabled: record.generatorStatus === 'processing',
    })

    // Add batch delete handler
    const handleBatchDelete = () => {
      if (!selectedRowKeys.value.length) return

      modalConfig.visible = true
      modalConfig.title = 'Confirm Batch Delete'
      modalConfig.content = `Are you sure you want to delete ${selectedRowKeys.value.length} selected pages?`
      modalConfig.type = 'batch_delete'
      modalConfig.data = selectedRowKeys.value
    }

    // 添加设置弹窗的状态控制
    const settingsVisible = ref(false);
    
    const showSettings = () => {
      settingsVisible.value = true;
    };

    // 添加配置域名的方法
    const handleConfigDomain = () => {
      // 关闭发布弹窗
      publishModal.value.visible = false;
      // 打开域名设置弹窗
      settingsVisible.value = true;
    };

    // Add workflow modal
    const workflowVisible = ref(false);
    const currentPageId = ref(null);
    const isProcessing = ref(false);

    const showWorkflow = (record) => {
      workflowVisible.value = true;
      currentPageId.value = record.pageId;
      isProcessing.value = record.generatorStatus === 'processing';
    };

    const handleWorkflowClose = () => {
      workflowVisible.value = false;
      currentPageId.value = null;
      isProcessing.value = false;
    };

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
      bannerTheme,
      handleModalCancel,
      selectedRowKeys,
      onSelectChange,
      getCheckboxProps,
      handleBatchDelete,
      settingsVisible,
      showSettings,
      currentCustomerId,
      handleConfigDomain,
      workflowVisible,
      showWorkflow,
      handleWorkflowClose,
      currentPageId,
      isProcessing
    }
  }
}
</script>

<style scoped>
/* Container styles */
.task-container {
  height: auto; /* 移除固定高度 */
  min-height: calc(100vh - 200px);
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px; /* 添加底部内边距 */
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
  margin-bottom: 8px;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-top: 8px;
  overflow: visible; /* 修改这个 */
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

/* 修改 loading spin 样式 */
:deep(.ant-spin) {
  /* 移除之前的定位和transform样式 */
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 1000;

  .ant-spin-dot {
    font-size: 20px; /* 减小spin大小 */
  }
  
  .ant-spin-text {
    margin-top: 8px;
    font-size: 13px; /* 减小文字大小 */
    color: #8c8c8c; /* 调整文字颜色 */
  }
}

/* 添加 centered-spin 样式，与 KeywordsPlanningPage 保持一致 */
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
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  position: sticky;
  bottom: 0;
  background: #fff;
  z-index: 1;
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

.preview-url-hint {
  margin-top: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.hint-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.preview-url {
  font-size: 14px;
  color: #1890ff;
  word-break: break-all;
}

/* Add styles for delete button */
.action-button.secondary-btn[danger] {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.action-button.secondary-btn[danger]:hover {
  color: #ff7875;
  border-color: #ff7875;
  background: #fff1f0;
}

.action-button.secondary-btn[danger]:disabled {
  color: rgba(0, 0, 0, 0.25);
  border-color: #d9d9d9;
  background: #f5f5f5;
  cursor: not-allowed;
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

/* 添加设置按钮样式 */
.action-button.secondary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 添加危险按钮样式 */
.danger-btn {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.danger-btn:hover {
  background: #fff1f0;
  border-color: #ff7875;
  color: #ff7875;
}

.danger-btn:disabled {
  background: #f5f5f5;
  border-color: #d9d9d9;
  color: rgba(0, 0, 0, 0.25);
}

/* 突出显示 Publish Domain Settings 按钮 */
.highlight-btn {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
}

.highlight-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: -1;
  animation: shine 3s infinite;
}

.highlight-btn:hover {
  background: #bae7ff;
  border-color: #096dd9;
  color: #096dd9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}

/* 添加表格行高度控制 */
:deep(.ant-table-tbody > tr > td) {
  padding: 6px 8px; /* 减小单元格内边距 */
  height: 40px; /* 设置单元格高度 */
}

:deep(.ant-table-thead > tr > th) {
  padding: 8px; /* 减小表头内边距 */
  height: 44px; /* 设置表头高度 */
}

:deep(.ant-table-row) {
  line-height: 1.2; /* 减小行高 */
}

/* Add styles for the workflow menu item */
:deep(.ant-dropdown-menu-item) {
  padding: 8px 12px;
}

:deep(.ant-dropdown-menu-item .anticon) {
  margin-right: 8px;
}

:deep(.ant-dropdown-menu-item:hover) {
  background-color: #f5f5f5;
}

/* 添加新的样式 */
.title-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tags {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-tag {
  font-size: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
  border-radius: 11px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.status-tag:hover {
  transform: scale(1.05);
}

/* 确保标题和标签在同一行 */
.title-link {
  flex-shrink: 1;
  min-width: 0;
}

/* 保持原有的标签样式 */
.generating-tag, .failed-tag {
  /* 保持原有样式不变 */
}
</style>