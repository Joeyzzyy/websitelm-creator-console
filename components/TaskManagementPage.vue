<template>
  <page-layout>
    <a-spin :spinning="loading" class="centered-spin">
    <!-- 添加域名未配置的提示 -->
      <template v-if="domainConfigured">
        <div class="task-container">
          <div class="header">
            <div class="header-left">
              <div class="planning-layout">
                <div class="main-content">
                  <a-tabs 
                    v-model:activeKey="activeTab" 
                    class="content-plan-tabs"
                    @change="handleTabChange"
                  >
                    <a-tab-pane key="blog" tab="Blog Posts" />
                    <a-tab-pane key="landing" tab="General Landing Pages" />
                    <a-tab-pane key="alternatively" tab="Alternatively Pages" />
                    
                    <template #tabBarExtraContent>
                      <div class="toolbar-right">
                        <a-button 
                          class="action-button secondary-btn highlight-btn"
                          @click.stop="showSettings"
                        >
                          <span>Publish Domain Settings</span>
                        </a-button>
                        
                        <a-button 
                          class="action-button secondary-btn"
                          @click.stop="collectPublishedUrls"
                          :disabled="!tasks.length"
                        >
                          <span>Submit Urls To Google</span>
                        </a-button>

                        <a-button 
                          class="action-button secondary-btn danger-btn"
                          :disabled="!selectedRowKeys.length"
                          @click="handleBatchDelete"
                        >
                          <span>Delete Selected ({{ selectedRowKeys.length }})</span>
                        </a-button>

                        <a-button 
                          type="primary"
                          @click="handleAddPage"
                          class="generate-btn action-button"
                          v-if="currentCustomerId === '67a9fabf538eb88a2247b5be'"
                        >
                          <span>Add Page</span>
                        </a-button>
                        
                        <a-button 
                          type="link"
                          class="refresh-btn"
                          :loading="loading"
                          @click="handleRefresh"
                        >
                          <template #icon><ReloadOutlined /></template>
                          Refresh
                        </a-button>
                      </div>
                    </template>
                  </a-tabs>
                </div>
              </div>
            </div>
          </div>

          <div class="task-list">
            <!-- Empty State -->
            <div v-if="!loading && !tasks.length" class="empty-state">
              <h3>No Pages Available</h3>
              <p>Go to "Keyword Planning" to start creating your first task</p>
            </div>
            
            <a-table
              v-if="!loading && tasks.length > 0"
              :columns="columns"
              :data-source="filteredTasks"
              :pagination="false"
              :scroll="{ x: true }"
              :row-selection="{ 
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                getCheckboxProps: getCheckboxProps
              }"
              :expanded-row-keys="expandedRowKeys"
              @expand="onExpandRow"
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
                        <span class="view-text"> (View generation details)</span>
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
                    <a-button type="link">
                      <EllipsisOutlined />
                    </a-button>
                  </a-dropdown>
                </template>
              </template>

              <!-- 添加展开行插槽 -->
              <template #expandedRowRender="{ record }">
                <div :class="['workflow-container', { 'inline-mode': true }]">
                  <a-spin :spinning="workflowLoading">
                    <div v-if="!hasWorkflowData(record.pageId)" class="empty-workflow">
                      <a-empty
                        description="No generation history available"
                      />
                    </div>

                    <template v-else>
                      <div class="workflow-summary">
                        <div class="summary-item">
                          <span class="summary-label">Total Time:</span>
                          <span class="summary-value">{{ getTotalTime(record.pageId) }} seconds</span>
                        </div>
                        <div class="summary-item">
                          <span class="summary-label">Total Steps:</span>
                          <span class="summary-value">{{ getWorkflowSteps(record.pageId).length }}</span>
                        </div>
                        <div class="summary-item">
                          <span class="summary-label">Completed Steps:</span>
                          <span class="summary-value">{{ getCompletedSteps(record.pageId) }}</span>
                        </div>
                        <div class="summary-item">
                          <span class="summary-label">Status:</span>
                          <span class="summary-value" :class="getStatusClass(record.pageId)">
                            {{ getWorkflowStatus(record.pageId) }}
                          </span>
                        </div>
                      </div>

                      <a-divider style="margin: 12px 0" />
                      <a-timeline>
                        <a-timeline-item 
                          v-for="step in getReversedWorkflowSteps(record.pageId)" 
                          :key="step.nodeId"
                          :color="getStepColor(step.status)"
                        >
                          <template #dot v-if="step.status === 'processing'">
                            <a-spin size="small" />
                          </template>
                          <div class="step-content" :class="{ 'step-active': isActiveStep(step) }">
                            <div class="step-header">
                              <div class="step-header-left">
                                <span class="step-name">{{ translateNodeName(step.nodeName) }}</span>
                                <span class="step-time">{{ formatTime(step.elapsedTime) }}</span>
                              </div>
                              <a-button 
                                v-if="step.output"
                                type="link" 
                                class="expand-button"
                                @click="toggleOutput(step.nodeId)"
                              >
                                {{ isStepExpanded(step.nodeId) ? 'Collapse' : 'Expand' }}
                              </a-button>
                            </div>
                            <div 
                              v-if="step.output" 
                              class="step-message"
                              :class="{ 'expanded': isStepExpanded(step.nodeId) }"
                            >
                              {{ formatOutput(step.output) }}
                            </div>
                          </div>
                        </a-timeline-item>
                      </a-timeline>
                    </template>
                  </a-spin>
                </div>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
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
  SettingOutlined,
  SyncOutlined,
  DeleteOutlined as AntDeleteOutlined
} from '@ant-design/icons-vue'
import PageLayout from './layout/PageLayout.vue'
import apiClient from '../api/api'
import config from '../config/settings'
import { VERCEL_CONFIG } from '../config/vercelConfig'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import SmartBanner from './common/SmartBanner.vue'
import SettingsModal from './SettingsDomainModal.vue'
import { formatDistanceToNow } from 'date-fns'

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
    SyncOutlined,
    SettingsModal,
    AntDeleteOutlined
  },

  setup() {
    const activeTab = ref('blog')
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
        title: 'Status',
        dataIndex: 'publishStatus',
        key: 'status',
        width: '8%'
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

    const fetchTasks = async () => {
      loading.value = true
      try {
        const userId = localStorage.getItem('currentCustomerId')
        
        // 根据当前激活的标签页确定查询参数
        const queryParams = {
          customerId: userId,
          page: pagination.current,
          limit: pagination.pageSize
        }

        // 根据不同 tab 添加不同的查询参数
        switch (activeTab.value) {
          case 'blog':
            queryParams.type = 'Blog'
            break
          case 'landing':
            queryParams.type = 'Landing Page'
            queryParams.source = ['ai', 'manual']
            break
          case 'alternatively':
            queryParams.type = 'Landing Page'
            queryParams.source = ['alternatively']
            break
        }
        
        const response = await apiClient.getPages(queryParams)
        
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
          
          // 添加检查进行中任务的逻辑
          checkProcessingTasks();
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
      modalConfig.title = 'Submit Urls To Google Search Console';
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
        : `https://${record.publishURL}`
      
      // 只有非英语时才添加语言路径
      const langPath = record.lang === 'en' ? '' : `/${record.lang}`
      
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

    const expandedRowKeys = ref([]);
    const expandedRowData = ref({});
    const loadingWorkflow = ref(false);

    // 添加调试标志
    const debugMode = ref(true);

    // 修改展开行渲染函数，使用 WorkflowStatus 组件
    const expandedRowRender = (record) => {
      if (debugMode.value) {
        console.log('expandedRowRender called for:', record.pageId);
      }
      
      // 返回 WorkflowStatus 组件
      return () => h(WorkflowStatus, {
        pageId: record.pageId,
        isProcessing: record.generatorStatus === 'processing',
        inlineMode: true
      });
    };

    // 添加当前页面ID和处理状态的响应式变量
    const currentPageId = ref('');
    const isProcessing = ref(false);

    // 修改 showWorkflow 函数
    const showWorkflow = async (record) => {
      console.log('Show workflow for record:', record.pageId);
      
      // Check if currently expanded
      const isCurrentlyExpanded = expandedRowKeys.value.includes(record.key);
      console.log('Is currently expanded:', isCurrentlyExpanded);
      
      if (isCurrentlyExpanded) {
        // If already expanded, collapse
        expandedRowKeys.value = [];
        
        // Don't stop polling if task is still processing
        if (record.generatorStatus !== 'processing') {
          stopPolling(record.pageId);
        }
      } else {
        // If not expanded, expand
        expandedRowKeys.value = [record.key];
        console.log('Expanded row keys updated:', expandedRowKeys.value);
        
        // Fetch workflow data
        await fetchWorkflow(record.pageId);
        
        // If processing, start polling
        if (record.generatorStatus === 'processing') {
          startPolling(record.pageId);
        }
      }
    };

    // 在初始化时检查是否有进行中的任务，并自动展开
    const checkProcessingTasks = () => {
      const processingTasks = tasks.value.filter(task => 
        task.generatorStatus === 'processing'
      );
      
      console.log('Found processing tasks:', processingTasks.length);
      
      if (processingTasks.length > 0) {
        // Expand the first processing task
        const firstProcessingTask = processingTasks[0];
        expandedRowKeys.value = [firstProcessingTask.key];
        console.log('Auto-expanded processing task:', firstProcessingTask.pageId);
        
        // Start polling for all processing tasks
        processingTasks.forEach(task => {
          ensurePolling(task.pageId);
        });
      }
    };

    // 添加标签页切换处理函数
    const handleTabChange = (key) => {
      activeTab.value = key
      pagination.current = 1 // 切换标签页时重置分页
      fetchTasks()
    }

    const handleRefresh = () => {
      fetchTasks();
    };

    // 保留这个更完整的 onExpandRow 函数定义
    const onExpandRow = async (expanded, record) => {
      console.log('Row expand event triggered:', expanded, record.pageId);
      
      if (expanded) {
        expandedRowKeys.value = [record.key];
        
        // Fetch workflow data
        await fetchWorkflow(record.pageId);
        
        // If processing, start polling
        if (record.generatorStatus === 'processing') {
          startPolling(record.pageId);
        }
      } else {
        expandedRowKeys.value = [];
        
        // Don't stop polling if task is still processing
        const task = tasks.value.find(t => t.pageId === record.pageId);
        if (!task || task.generatorStatus !== 'processing') {
          stopPolling(record.pageId);
        }
      }
    };

    // 添加工作流相关的状态和方法
    const workflowData = ref({});  // Store workflow data for all pages
    const workflowLoading = ref(false);
    const expandedSteps = ref([]);  // Store expanded step IDs
    const pollingPageIds = ref(new Set());  // Store page IDs being polled
    
    // Translate node names
    const translateNodeName = (nodeName) => {
      if (nodeName === '開始') return 'Start';
      // Add other translations as needed
      return nodeName;
    };

    // Get step color
    const getStepColor = (status) => {
      switch (status) {
        case 'succeeded': return 'green';
        case 'started': 
        case 'iteration_started':
        case 'iteration_next': return 'blue';
        case 'failed': return 'red';
        default: return 'gray';
      }
    };

    // Format time
    const formatTime = (elapsedTime) => {
      if (!elapsedTime) return 'Processing...';
      return `${elapsedTime.toFixed(2)} seconds`;
    };

    // Format output
    const formatOutput = (output) => {
      try {
        const outputObj = JSON.parse(output);
        return outputObj.text || outputObj.result || output;
      } catch (e) {
        return output;
      }
    };

    // Check if workflow data exists
    const hasWorkflowData = (pageId) => {
      return workflowData.value[pageId]?.steps?.length > 0 && workflowData.value[pageId]?.status;
    };

    // Get workflow steps
    const getWorkflowSteps = (pageId) => {
      return workflowData.value[pageId]?.steps || [];
    };

    // Get reversed workflow steps
    const getReversedWorkflowSteps = (pageId) => {
      return [...getWorkflowSteps(pageId)].reverse();
    };

    // Get total time
    const getTotalTime = (pageId) => {
      const steps = getWorkflowSteps(pageId);
      const total = steps.reduce((sum, step) => {
        return sum + (step.elapsedTime || 0);
      }, 0);
      return total.toFixed(2);
    };

    // Get completed steps count
    const getCompletedSteps = (pageId) => {
      const steps = getWorkflowSteps(pageId);
      return steps.filter(step => 
        step.status === 'succeeded' || step.status === 'failed'
      ).length;
    };

    // Get workflow status
    const getWorkflowStatus = (pageId) => {
      if (workflowLoading.value) return 'Processing';
      
      const steps = getWorkflowSteps(pageId);
      
      // Check if any step failed
      const hasFailedStep = steps.some(step => step.status === 'failed');
      if (hasFailedStep) {
        return 'Failed';
      }
      
      // Use API returned status
      const status = workflowData.value[pageId]?.status;
      switch (status) {
        case 'completed':
          return 'Completed';
        case 'failed':
          return 'Failed';
        case 'processResponse':
        case 'processing':
          return 'In Progress';
        default:
          return 'Processing';
      }
    };

    // Get status class
    const getStatusClass = (pageId) => {
      const status = getWorkflowStatus(pageId);
      return {
        'status-processing': status === 'Processing' || status === 'In Progress',
        'status-completed': status === 'Completed',
        'status-failed': status === 'Failed'
      };
    };

    // Check if step is active
    const isActiveStep = (step) => {
      return step.status === 'processing' || 
             step.status === 'started' || 
             step.status === 'iteration_started' ||
             step.status === 'iteration_next';
    };

    // Toggle output expand/collapse
    const toggleOutput = (nodeId) => {
      const index = expandedSteps.value.indexOf(nodeId);
      if (index === -1) {
        expandedSteps.value.push(nodeId);
      } else {
        expandedSteps.value.splice(index, 1);
      }
    };

    // Check if step is expanded
    const isStepExpanded = (nodeId) => {
      return expandedSteps.value.includes(nodeId);
    };

    // Fetch workflow data
    const fetchWorkflow = async (pageId) => {
      try {
        console.log('Fetching workflow data for pageId:', pageId);
        workflowLoading.value = true;
        const response = await apiClient.getPageWorkflow(pageId);
        console.log('Workflow response:', response);
        
        if (response?.code === 200) {
          if (!response.data.workflowId || !response.data.steps) {
            workflowData.value[pageId] = { steps: [], status: '' };
          } else {
            workflowData.value[pageId] = response.data;
            
            // Check if workflow is completed or failed
            const isCompleted = response.data.status === 'completed' || 
                              response.data.status === 'failed';
            
            // If completed, stop polling
            if (isCompleted) {
              stopPolling(pageId);
            } else {
              // If not completed and the task is processing, ensure polling continues
              const task = tasks.value.find(t => t.pageId === pageId);
              if (task && task.generatorStatus === 'processing') {
                ensurePolling(pageId);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch workflow status:', error);
      } finally {
        workflowLoading.value = false;
      }
    };

    // Start polling
    const startPolling = (pageId) => {
      if (pollingPageIds.value.has(pageId)) {
        return; // Already polling
      }
      
      pollingPageIds.value.add(pageId);
      console.log('Started polling for pageId:', pageId);
      
      const poll = async () => {
        if (!pollingPageIds.value.has(pageId)) {
          return; // Stop polling
        }
        
        await fetchWorkflow(pageId);
        
        // Check if we need to continue polling
        const status = workflowData.value[pageId]?.status;
        const task = tasks.value.find(t => t.pageId === pageId);
        
        if (status === 'completed' || status === 'failed') {
          stopPolling(pageId);
        } else if (task && task.generatorStatus === 'processing') {
          // Continue polling if task is still processing
          setTimeout(poll, 3000);
        } else {
          stopPolling(pageId);
        }
      };
      
      poll();
    };

    // Ensure polling is active for a page
    const ensurePolling = (pageId) => {
      if (!pollingPageIds.value.has(pageId)) {
        startPolling(pageId);
      }
    };

    // Stop polling
    const stopPolling = (pageId) => {
      pollingPageIds.value.delete(pageId);
      console.log('Stopped polling for pageId:', pageId);
    };

    onMounted(async () => {
      await loadProductInfo()
      if (domainConfigured.value) {
        fetchTasks()
        await loadVerifiedDomains()
      }
      isMounted.value = true
    })

    // Add these properties back to fix the errors
    const workflowVisible = ref(false);
    const handleWorkflowClose = () => {
      workflowVisible.value = false;
    };

    return {
      activeTab,
      handleTabChange,
      tasks,
      loading,
      columns,
      modalConfig,
      handleDelete: deleteArticle,
      handleEdit: editArticle,
      handlePublish: confirmPublishAction,
      handleModalConfirm,
      getStatusColor,
      handleRefresh,
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
      expandedRowKeys,
      onExpandRow,
      showWorkflow,
      checkProcessingTasks,
      debugMode,
      currentPageId,
      isProcessing,
      workflowData,
      workflowLoading,
      expandedSteps,
      pollingPageIds,
      translateNodeName,
      getStepColor,
      formatTime,
      formatOutput,
      hasWorkflowData,
      getWorkflowSteps,
      getReversedWorkflowSteps,
      getTotalTime,
      getCompletedSteps,
      getWorkflowStatus,
      getStatusClass,
      isActiveStep,
      toggleOutput,
      isStepExpanded,
      workflowVisible,
      handleWorkflowClose,
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
  position: relative;
  display: inline-flex;
  align-items: center;
  background: linear-gradient(45deg, #1890ff, #40a9ff) !important; /* 使用更柔和的蓝色渐变 */
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

/* 修改成功状态标签的样式 */
:deep(.ant-tag-success.status-tag) {
  background: #f6ffed !important; /* 使用浅绿色背景 */
  border: 1px solid #b7eb8f !important; /* 添加绿色边框 */
  box-shadow: none;
}

:deep(.ant-tag-success.status-tag span:first-child) {
  color: #52c41a !important; /* 文字使用深绿色 */
}

:deep(.ant-tag-success.status-tag .view-text) {
  color: #73d13d !important; /* "View Generation" 文字使用稍浅的绿色 */
}

:deep(.ant-tag-success.status-tag:hover) {
  background: #f6ffed !important;
  border-color: #95de64 !important;
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.1);
}

:deep(.ant-tabs-tab-active) {
  font-weight: 500;
}

/* 调整 tabs 样式 */
.content-plan-tabs {
  width: 100%;
}

:deep(.ant-tabs) {
  width: 100%;
}

:deep(.ant-tabs-nav) {
  width: 100%;
  margin: 0;
}

:deep(.ant-tabs-nav-wrap) {
  width: 100%;
  overflow: visible !important; /* 禁止溢出隐藏 */
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.ant-tabs-nav-list) {
  transform: none !important; /* 禁止 transform 变换 */
  width: auto !important;
  display: flex !important;
  flex-wrap: nowrap !important;
}

:deep(.ant-tabs-tab) {
  padding: 8px 20px;
  margin: 0 10px 0 0;
  white-space: nowrap; /* 确保文本不换行 */
  flex-shrink: 0 !important; /* 防止 Tab 被压缩 */
}

/* 隐藏点点点元素 */
:deep(.ant-tabs-nav-operations) {
  display: none !important; /* 彻底隐藏点点点按钮 */
}

/* 确保工具栏不会挤压 Tab 空间 */
.toolbar-right {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0; /* 防止工具栏被压缩 */
  margin-left: 20px; /* 与 Tab 保持距离 */
}

.action-button {
  margin-left: 4px;
  white-space: nowrap;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

/* 缩短按钮文本，确保适合工具栏 */
.action-button span {
  font-size: 12px;
}

/* 添加工作流相关样式 */
.workflow-container {
  padding: 20px;
}

.workflow-container.inline-mode {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 0;
  border-top: 1px solid #f0f0f0;
  max-height: 300px;
  overflow-y: auto;
}

.workflow-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-weight: 500;
  color: #666;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
}

.status-processing {
  color: #1890ff;
}

.status-completed {
  color: #52c41a;
}

.status-failed {
  color: #f5222d;
}

.step-content {
  margin-left: 8px;
  padding: 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.step-active {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.step-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-name {
  font-weight: bold;
}

.step-time {
  font-size: 12px;
  color: #999;
}

.step-message {
  font-size: 14px;
  color: #666;
  max-height: 42px;
  overflow: hidden;
  transition: max-height 0.3s ease;
  position: relative;
}

.step-message.expanded {
  max-height: 1000px;
}

.step-message:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(transparent, white);
}

.expand-button {
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.empty-workflow {
  padding: 40px 0;
  text-align: center;
}

:deep(.ant-timeline-item-content) {
  margin-left: 28px !important;
}

:deep(.ant-empty) {
  margin: 32px 0;
}

:deep(.ant-empty-description) {
  color: #666;
  font-size: 14px;
}

:deep(.ant-timeline-item) {
  padding-bottom: 20px;
}

:deep(.ant-timeline-item:last-child) {
  padding-bottom: 0;
}

/* Ensure clicking tags doesn't trigger row expansion */
.clickable {
  cursor: pointer;
}

.view-text {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.8;
}

/* Add failed tag style */
.failed-tag {
  background: linear-gradient(45deg, #ff4d4f, #ff7875) !important;
  border: none !important;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
}

/* 添加 OutlinePlanningPage 的布局样式 */
.planning-layout {
  width: 100%;
}

.main-content {
  width: 100%;
}

.content-plan-tabs {
  width: 100%;
}

:deep(.ant-tabs) {
  width: 100%;
}

:deep(.ant-tabs-nav) {
  width: 100%;
}

:deep(.ant-tabs-nav-wrap) {
  width: 100%;
}

:deep(.ant-tabs-nav-list) {
  /* 移除宽度 100% 和 flex 布局，让 Tab 自然展开 */
  /* width: 100%; */
  /* display: flex; */
}

:deep(.ant-tabs-tab) {
  /* 移除 flex: 1，让 Tab 根据内容宽度展开 */
  /* flex: 1; */
  padding: 8px 20px;
  margin: 0 10px 0 0;
  /* 移除文本居中 */
  /* justify-content: center; */
  /* text-align: center; */
}

/* 添加工具栏样式 */
.toolbar-right {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0; /* 防止工具栏被压缩 */
  margin-left: 20px; /* 与 Tab 保持距离 */
}

.action-button {
  margin-left: 4px;
  white-space: nowrap;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

/* 缩短按钮文本，确保适合工具栏 */
.action-button span {
  font-size: 12px;
}

/* 调整容器宽度，确保有足够空间 */
.planning-layout,
.main-content,
.content-plan-tabs {
  width: 100%;
  overflow: visible !important;
}
</style>