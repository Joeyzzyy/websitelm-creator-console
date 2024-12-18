<template>
  <page-layout
    title="Assets"
    description="Manage your assets, including images, videos, internal links and other"
    icon="🎨"
  >
    <!-- Domain not configured notice -->
    <template v-if="domainConfigured">
      <a-tabs 
      class="main-tabs"
      v-model:activeKey="activeTab"
    >
      <template #rightExtra>
        <a-button 
          v-if="activeTab === 'images' || activeTab === 'videos'" 
          type="primary" 
          class="ai-analyze-btn" 
          @click="showUploadModal"
        >
          <span class="btn-content">
            <span>Upload {{ activeTab === 'images' ? 'Images' : 'Videos' }}</span>
            <upload-outlined />
          </span>
        </a-button>
        <a-button 
          v-else-if="activeTab === 'links'"
          type="primary"
          class="ai-analyze-btn" 
          @click="showAddLinkModal"
        >
          <span class="btn-content">
            <span>Add Link</span>
            <plus-outlined />
          </span>
        </a-button>
      </template>

      <a-tab-pane key="knowledge" tab="Knowledge Base" />
      <a-tab-pane key="images" tab="Images" />
      <a-tab-pane key="videos" tab="Videos" />
      <a-tab-pane key="links" tab="Internal Links" />
    </a-tabs>

    <div class="page-content">
      <div class="assets-content">
        <div class="controls-header">
          <div class="controls-right">
            <slot name="controls"></slot>
          </div>
        </div>

        <!-- 媒体资产内容 -->
        <template v-if="activeTab === 'images' || activeTab === 'videos'">
          <a-spin :spinning="loading" tip="Loading assets...">
          </a-spin>
          <div class="assets-grid" v-if="!loading">
            <template v-if="!showEmptyState">
              <a-row :gutter="[16, 16]">
                <a-col 
                  v-for="asset in filteredAssets" 
                  :key="asset.id" 
                  :xs="24" 
                  :sm="12" 
                  :md="8" 
                  :lg="6"
                >
                  <div class="asset-card">
                    <div class="asset-preview" @click="previewAsset(asset)">
                      <img 
                        v-if="asset.type === 'image'" 
                        :src="asset.url" 
                        :alt="asset.name"
                      >
                      <video 
                        v-else-if="asset.type === 'video'" 
                        :src="asset.url" 
                        controls
                      ></video>
                      <div class="asset-overlay">
                        <eye-outlined class="preview-icon" />
                      </div>
                      <div class="asset-actions">
                        <a-popconfirm
                          title="Are you sure you want to delete this file?"
                          ok-text="Delete"
                          cancel-text="Cancel"
                          @confirm="deleteAsset(asset)"
                          ok-type="primary"
                          :ok-button-props="{
                            style: {
                              background: 'linear-gradient(135deg, #1890ff, #3B82F6)',
                              border: 'none'
                            }
                          }"
                        >
                          <a-button 
                            type="link" 
                            danger 
                            class="delete-btn"
                            @click.stop
                          >
                            <delete-outlined />
                          </a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                    <div class="asset-info">
                      <div class="asset-name-container">
                        <h4 class="asset-name" :title="asset.name">{{ asset.name }}</h4>
                        <a-button type="link" class="edit-btn" @click="startEditing(asset)">
                          <edit-outlined />
                        </a-button>
                      </div>
                      <p class="asset-description" :title="asset.description">
                        {{ asset.description || 'No description' }}
                      </p>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </template>
            
            <div v-else-if="showEmptyState && activeTab !== 'links'" class="empty-state">
              <h3 class="empty-state-title">Your creative canvas awaits! 🎨</h3>
              <p class="empty-state-description">
                Ready to bring your brand to life? Upload your first {{ activeTab === 'images' ? 'image' : 'video' }} and let's make something amazing together.
              </p>
              <a-button 
                type="primary" 
                class="upload-btn-empty" 
                @click="showUploadModal"
              >
                <upload-outlined /> Upload {{ activeTab === 'images' ? 'Images' : 'Videos' }}
              </a-button>
            </div>
          </div>
          
        </template>

        <!-- 链接内容 -->
        <template v-else-if="activeTab === 'links'">
          <a-spin :spinning="linksLoading" tip="Loading links...">
          </a-spin>
          <a-table
            v-if="!linksLoading" 
            :columns="linkColumns" 
            :dataSource="internalLinks" 
            :pagination="{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }"
            :rowKey="record => record.id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <a-space>
                  <a-button type="link" @click="editLink(record)">
                    <edit-outlined />
                  </a-button>
                  <a-popconfirm
                    title="Are you sure you want to delete this link?"
                    @confirm="deleteLink(record)"
                    ok-text="Delete"
                    cancel-text="Cancel"
                  >
                    <a-button type="link" danger>
                      <delete-outlined />
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
              <template v-if="column.key === 'link'">
                <a :href="record.link" target="_blank">{{ record.link }}</a>
              </template>
            </template>
          </a-table>
        </template>

        <!-- Knowledge Tab Content -->
        <template v-else-if="activeTab === 'knowledge'">
          <a-spin :spinning="loading" tip="Loading knowledge base...">
          </a-spin>
          <div class="traffic-light-descriptions" v-if="!loading">
            <p><span class="status-dot status-green"></span> Green: No human intervention needed.</p>
            <p><span class="status-dot status-yellow"></span> Yellow: Requires review.</p>
            <p><span class="status-dot status-red"></span> Red: Needs human supplementation.</p>
          </div>
          <div class="assets-content">
            <div class="assets-grid" v-if="!loading">
              <div class="main-content">
                <!-- Knowledge Base Status Alert -->
                <a-alert
                  type="info"
                  class="knowledge-alert"
                >
                  <template #description>
                    <div class="alert-content" v-if="processingKnowledge">
                      <div class="kb-status-header">
                        <div class="status-message">
                          <p>
                            Knowledge base processing: 
                            <span class="highlight yellow">
                              {{ knowledgeStatus === 'fetch' ? 'Fetching data' : 
                                 knowledgeStatus === 'process' ? 'Processing content' : 
                                 knowledgeStatus === 'analyze' ? 'Analyzing content' : 
                                 knowledgeStatus === 'vector2' ? 'Vectorizing content' : 
                                 'Initializing...' }}
                            </span>
                            (Estimated time: {{ knowledgeTime }}s)
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-alert>

                <!-- Knowledge Base Content -->
                <template v-if="!processingKnowledge">
                  <!-- Breadcrumb Navigation -->
                  <div class="breadcrumb" v-if="currentArticle">
                    <span @click="clearCurrentArticle">Knowledge Base</span>
                    <span class="separator">/</span>
                    <span>{{ currentArticle.label }}</span>
                    <span class="separator">/</span>
                    <span class="current">{{ currentArticle.title }}</span>
                  </div>

                  <!-- Category Grid -->
                  <div class="grid-container" v-if="!currentArticle">
                    <div 
                      v-for="(articles, label) in groupedArticles" 
                      :key="label"
                      class="category-card"
                    >
                      <div class="category-header">
                        <h2>{{ label }}</h2>
                        <span class="article-count">{{ articles.length }} articles</span>
                      </div>
                      <div class="category-stats">
                        <span class="stat-item">
                          <span class="status-dot status-green"></span>
                          {{ getCategoryStats(articles).green }}
                        </span>
                        <span class="stat-item">
                          <span class="status-dot status-yellow"></span>
                          {{ getCategoryStats(articles).yellow }}
                        </span>
                        <span class="stat-item">
                          <span class="status-dot status-red"></span>
                          {{ getCategoryStats(articles).red }}
                        </span>
                      </div>
                      <div class="article-list">
                        <div 
                          v-for="article in articles" 
                          :key="article.title"
                          class="article-item"
                          @click="selectArticle(article)"
                        >
                          <span 
                            class="status-dot" 
                            :class="{
                              'status-green': article.quality === 'A',
                              'status-yellow': article.quality === 'B',
                              'status-red': article.quality === 'C'
                            }"
                          ></span>
                          {{ article.title }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Article Detail View -->
                  <div v-else class="article-detail">
                    <div class="article-actions">
                      <a-button 
                        type="primary"
                        :loading="saving"
                        @click="saveArticle"
                      >
                        Save Changes
                      </a-button>
                    </div>
                    <h1 class="article-title">{{ currentArticle.title }}</h1>
                    <a-textarea
                      v-model:value="editableContent"
                      :rows="20"
                      class="article-editor"
                      :bordered="false"
                      placeholder="Enter article content..."
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- Preview Modal -->
    <a-modal
      v-model:visible="previewVisible"
      :footer="null"
      width="800px"
      class="preview-modal"
      @cancel="closePreview"
      :closable="false"
    >
      <img 
        v-if="selectedAsset?.type === 'image'"
        :src="selectedAsset?.url"
        class="preview-image"
        alt="Preview"
      >
      <video
        v-else-if="selectedAsset?.type === 'video'"
        :src="selectedAsset?.url"
        controls
        class="preview-video"
      ></video>
    </a-modal>

    <!-- Upload Modal -->
    <a-modal
      v-model:visible="uploadModalVisible"
      :title="`Upload ${activeTab === 'images' ? 'Images' : 'Videos'}`"
      @ok="handleUploadOk"
      @cancel="handleUploadCancel"
      :okButtonProps="{ 
        disabled: !uploadFile || !isMediaFormValid,
        loading: uploading
      }"
    >
      <div class="upload-container">
        <div v-if="!uploadFile" class="upload-area" @click="triggerFileInput">
          <upload-outlined class="upload-icon" />
          <p>Click or drag file to upload</p>
          <p class="upload-hint">
            {{ activeTab === 'images' ? 'Supports JPG, PNG, WebP formats' : 'Supports MP4 format' }}
          </p>
        </div>
        
        <template v-else>
          <div class="preview-container">
            <div class="preview-wrapper">
              <img
                v-if="activeTab === 'images' && uploadFile"
                :src="previewUrl"
                class="upload-preview"
              />
              <video
                v-if="activeTab === 'videos' && uploadFile"
                :src="previewUrl"
                controls
                class="upload-preview"
              ></video>
            </div>
          </div>

          <!-- Add form for name and description -->
          <a-form
            :model="mediaForm"
            :rules="mediaFormRules"
            ref="mediaFormRef"
            layout="vertical"
            class="media-form"
          >
            <a-form-item 
              name="mediaName" 
              label="Name"
              :validateTrigger="['blur', 'change']"
            >
              <a-input 
                v-model:value="mediaForm.mediaName" 
                placeholder="Enter file name"
                :maxLength="50"
              />
            </a-form-item>
            
            <a-form-item 
              name="description" 
              label="Description"
            >
              <a-textarea 
                v-model:value="mediaForm.description" 
                placeholder="Enter description (optional)"
                :maxLength="200"
                :rows="3"
              />
            </a-form-item>
          </a-form>

          <div class="preview-actions">
            <a-button type="primary" danger @click="removeUpload">
              <delete-outlined /> Remove
            </a-button>
          </div>
        </template>
        
        <input
          type="file"
          ref="fileInput"
          :accept="activeTab === 'images' ? 'image/*' : 'video/mp4'"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
    </a-modal>

    <!-- Add Link Modal -->
    <a-modal
      v-model:visible="linkModalVisible"
      :title="editingLink ? 'Edit Link' : 'Add New Link'"
      @ok="handleLinkModalOk"
      @cancel="handleLinkModalCancel"
      :okButtonProps="{ 
        disabled: !isLinkFormValid,
        loading: linkSubmitting
      }"
    >
      <a-form
        :model="linkForm"
        :rules="linkFormRules"
        ref="linkFormRef"
        layout="vertical"
      >
        <a-form-item 
          name="link" 
          label="Link URL"
          :validateTrigger="['blur', 'change']"
        >
          <a-input 
            v-model:value="linkForm.link" 
            placeholder="Enter link URL"
            :maxLength="200"
          />
        </a-form-item>
        
        <a-form-item 
          name="description" 
          label="Description"
          :validateTrigger="['blur', 'change']"
        >
          <a-textarea 
            v-model:value="linkForm.description" 
            placeholder="Enter link description"
            :maxLength="500"
            :rows="3"
          />
        </a-form-item>
        
        <a-form-item 
          name="category" 
          label="Category"
          :validateTrigger="['blur', 'change']"
        >
          <a-select
            v-model:value="linkForm.category"
            placeholder="Select a category"
          >
            <a-select-option 
              v-for="category in linkCategories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Add Edit Modal -->
    <a-modal
      v-model:visible="editModalVisible"
      title="Edit Asset"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      :okButtonProps="{ 
        disabled: !isEditFormValid,
        loading: editSubmitting
      }"
    >
      <a-form
        :model="editForm"
        :rules="mediaFormRules"
        ref="editFormRef"
        layout="vertical"
        class="media-form"
      >
        <a-form-item 
          name="mediaName" 
          label="Name"
          :validateTrigger="['blur', 'change']"
        >
          <a-input 
            v-model:value="editForm.mediaName" 
            placeholder="Enter file name"
            :maxLength="50"
          />
        </a-form-item>
        
        <a-form-item 
          name="description" 
          label="Description"
        >
          <a-textarea 
            v-model:value="editForm.description" 
            placeholder="Enter description (optional)"
            :maxLength="200"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    </template>
    <template v-else>
      <div class="domain-notice">
        <div class="notice-content">
          <exclamation-circle-outlined class="notice-icon" />
          <h2>No Site Configured</h2>
          <p>Please configure your domain in settings to use the asset management features</p>
          <a-button type="primary" @click="goToDashboard">
            Configure Domain
          </a-button>
        </div>
      </div>
    </template>
  </page-layout>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import PageLayout from './layout/PageLayout.vue'
import { 
  ExclamationCircleOutlined,
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined, 
  PlusOutlined, 
  FolderOutlined, 
  LinkOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import apiClient from '../api/api';
import { useRouter } from 'vue-router';

export default {
  name: 'BrandAssetsPage',
  components: {
    PageLayout,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    PlusOutlined,
    FolderOutlined,
    LinkOutlined,
    SettingOutlined
  },
  setup() {
    const router = useRouter();
    const domainConfigured = ref(false);
    const loading = ref(true);
    const activeTab = ref('knowledge')
    const assets = ref([])
    const pollTimer = ref(null);

    // Check domain configuration status
    const checkDomainStatus = async () => {
      try {
        loading.value = true;
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getProductsByCustomerId(customerId);
        domainConfigured.value = response.data?.domainStatus || false;
      } catch (error) {
        console.error('Failed to fetch product info:', error);
        domainConfigured.value = false;
      } finally {
        loading.value = false;
      }
    };

    // Navigate to settings page
    const goToDashboard = () => {
      router.push('/dashboard');
    };

    onMounted(async () => {
      await checkDomainStatus();
      if (domainConfigured.value) {
        fetchAssets();
      }
    });

    const goToHelpCenter = () => {
      router.push('/help-center')
    }
    
    const fetchAssets = async () => {
      loading.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const mediaType = activeTab.value === 'images' ? 'image' : 'video'
        const response = await apiClient.getMedia(
          customerId,
          mediaType,
          selectedCategory.value === 'all' ? null : selectedCategory.value
        )
        
        assets.value = response.data ? response.data.map(item => ({
          id: item.mediaId,
          type: item.mediaType,
          name: item.mediaName,
          url: item.mediaUrl,
          categoryId: item.categoryId,
          description: item.description,
          categoryName: item.categoryName,
          uploadTime: new Date().toISOString(),
          size: 0,
          suggestedUsage: '',
          duration: item.mediaType === 'video' ? 0 : undefined
        })) : []
      } catch (error) {
        console.error('Failed to fetch assets:', error)
        message.error('Failed to load assets')
      } finally {
        loading.value = false
      }
    }

    // 监听标化时重新获取数据
    watch(activeTab, (newValue) => {
      if (newValue === 'links') {
        fetchLinks()
      } else if (newValue === 'domains') {
        loadProductInfo()
      } else {
        fetchAssets()
      }
    })

    const previewVisible = ref(false)
    const selectedAsset = ref(null)

    // 加分类相关的状态
    const categories = ref([
      { id: 1, name: 'Marketing Materials' },
      { id: 2, name: 'Product Showcase' },
      { id: 3, name: 'Team Photos' },
    ])
    const selectedCategory = ref('all')
    const selectedKeys = ref([selectedCategory.value])
    const categoryModalVisible = ref(false)
    const categoryForm = ref({ name: '' })
    const editCategoryModalVisible = ref(false)

    // 监听分类变化
    watch(selectedCategory, (newValue) => {
      selectedKeys.value = [newValue]
    })

    // Computed properties
    const filteredAssets = computed(() => {
      return assets.value.filter(asset => {
        const isCorrectType = asset.type === (activeTab.value === 'images' ? 'image' : 'video')
        const matchesCategory = selectedCategory.value === 'all' || 
          asset.categoryId === selectedCategory.value
        
        return isCorrectType && matchesCategory
      })
    })

    // Methods
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatFileSize = (bytes) => {
      const units = ['B', 'KB', 'MB', 'GB']
      let size = bytes
      let unitIndex = 0
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
      }
      
      return `${size.toFixed(1)} ${units[unitIndex]}`
    }

    const handleUpload = (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} uploaded successfully`)
      }
    }

    const previewAsset = (asset) => {
      selectedAsset.value = asset
      previewVisible.value = true
    }

    const closePreview = () => {
      selectedAsset.value = null
      previewVisible.value = false
    }

    const deleteAsset = async (asset) => {
      try {
        await apiClient.deleteMedia(asset.id)
        assets.value = assets.value.filter(item => item.id !== asset.id)
        message.success('Media file deleted successfully')
      } catch (error) {
        console.error('Failed to delete media file:', error)
        message.error('Failed to delete media file')
      }
    }

    // 添加分相关的方
    const showAddCategory = () => {
      categoryForm.value.name = ''
      categoryModalVisible.value = true
    }

    const handleAddCategory = () => {
      if (categoryForm.value.name) {
        const newCategory = {
          id: Date.now(),
          name: categoryForm.value.name
        }
        categories.value.push(newCategory)
        categoryModalVisible.value = false
        message.success('Category added successfully')
      }
    }

    const deleteCategory = (categoryId) => {
      categories.value = categories.value.filter(c => c.id !== categoryId)
      message.success('Category deleted successfully')
    }

    const handleEditCategory = () => {
      if (categoryForm.value.name) {
        const index = categories.value.findIndex(c => c.id === categoryForm.value.id)
        if (index !== -1) {
          categories.value[index].name = categoryForm.value.name
          message.success('Category updated successfully')
          editCategoryModalVisible.value = false
        }
      }
    }

    // 修改空状的计算属性
    const showEmptyState = computed(() => {
      return !loading.value && assets.value.length === 0;
    });

    // 增传相关的响应式变量
    const uploadModalVisible = ref(false)
    const uploadFile = ref(null)
    const previewUrl = ref('')
    const fileInput = ref(null)
    const uploading = ref(false)
    
    // 示上传模态框
    const showUploadModal = () => {
      uploadModalVisible.value = true
    }
    
    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value.click()
    }
    
    // 修改处理文件选择的方法
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const maxSize = activeTab.value === 'images' ? 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
          message.error(`File size exceeds ${activeTab.value === 'images' ? '1MB' : '50MB'} limit`);
          if (fileInput.value) {
            fileInput.value.value = '';
          }
          return;
        }
        
        uploadFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
        
        // 设置初始文件名（去掉扩展名并替换空格）
        const initialName = file.name
          .replace(/\.[^/.]+$/, "")  // 除扩展名
          .replace(/\s+/g, '_');     // 替换空格为下划线
        
        mediaForm.value.mediaName = initialName;
        
        // 由于初始文件名是有的，直接设置验证状态为 true
        mediaFormValidateStatus.value = true;
      }
    };
    
    // 修改移除上传文件的方法
    const removeUpload = () => {
      uploadFile.value = null;
      previewUrl.value = '';
      mediaForm.value = {
        mediaName: '',
        description: ''
      };
      mediaFormValidateStatus.value = false;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    
    // 处理上传确认
    const handleUploadOk = async () => {
      if (!uploadFile.value || !mediaForm.value.mediaName) return;
      
      uploading.value = true;
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append('file', uploadFile.value);
        formData.append('customerId', localStorage.getItem('currentCustomerId'));
        formData.append('mediaType', activeTab.value === 'images' ? 'image' : 'video');
        formData.append('mediaName', mediaForm.value.mediaName);
        formData.append('description', mediaForm.value.description || '');
        formData.append('categoryName', 'media');
        
        const response = await apiClient.uploadMedia(formData);
        
        if (response.status === 413) {
          message.error('File is too large. Please select a smaller file');
          return;
        }
        
        message.success('Upload successful');
        uploadModalVisible.value = false;
        removeUpload();
        fetchAssets();
      } catch (error) {
        console.error('Upload failed:', error);
        if (error.response?.status === 413) {
          message.error('File is too large. Please select a smaller file');
        } else {
          message.error('Upload failed, please try again');
        }
      } finally {
        uploading.value = false;
        loading.value = false;
      }
    };
    
    // 处理上传取消
    const handleUploadCancel = () => {
      uploadModalVisible.value = false
      removeUpload()
    }

    const getFileNameWithoutExtension = (filename) => {
      return filename.replace(/\.[^/.]+$/, "");
    };

    const getFileExtension = (filename) => {
      return filename.match(/\.[^/.]+$/)?.[0] || '';
    };

    // Add new reactive variables for edit modal
    const editModalVisible = ref(false);
    const editSubmitting = ref(false);
    const editFormRef = ref();
    const editFormValidateStatus = ref(false);
    const editForm = ref({
      mediaName: '',
      description: ''
    });
    const editingAsset = ref(null);

    // Add computed property for edit form validation
    const isEditFormValid = computed(() => {
      return editForm.value.mediaName && 
             !editForm.value.mediaName.includes(' ') && 
             editForm.value.mediaName.length <= 50 &&
             editFormValidateStatus.value;
    });

    // Watch for edit form changes
    watch(() => editForm.value.mediaName, (newVal) => {
      // 简单验证：不为空且不包含空格
      editFormValidateStatus.value = newVal && !newVal.includes(' ');
    });

    // Replace the old startEditing method with new one
    const startEditing = (asset) => {
      // 设置编辑数据
      editingAsset.value = asset;
      editForm.value = {
        mediaName: getFileNameWithoutExtension(asset.name),
        description: asset.description || ''
      };
      
      // 由于初始数据是有效的，直接设置验证状态为 true
      editFormValidateStatus.value = true;
      
      // 显示弹窗
      editModalVisible.value = true;
    };

    // Add new methods for edit modal
    const handleEditOk = async () => {
      if (!editingAsset.value) return;

      try {
        await editFormRef.value.validate();
        editSubmitting.value = true;

        const newName = `${editForm.value.mediaName}${getFileExtension(editingAsset.value.name)}`;
        const response = await apiClient.updateMedia(editingAsset.value.id, {
          mediaName: newName,
          description: editForm.value.description
        });

        if (response) {
          // Update the asset in the local list
          const index = assets.value.findIndex(a => a.id === editingAsset.value.id);
          if (index !== -1) {
            assets.value[index] = {
              ...assets.value[index],
              name: newName,
              description: editForm.value.description
            };
          }
          message.success('Asset updated successfully');
          handleEditCancel();
        }
      } catch (error) {
        console.error('Failed to update asset:', error);
        message.error('Failed to update asset');
      } finally {
        editSubmitting.value = false;
      }
    };

    const handleEditCancel = () => {
      editModalVisible.value = false;
      editingAsset.value = null;
      editForm.value = {
        mediaName: '',
        description: ''
      };
      if (editFormRef.value) {
        editFormRef.value.resetFields();
      }
    };

    // Modify the asset card template to show description if available
    const assetInfo = computed(() => {
      return assets.value.map(asset => ({
        ...asset,
        displayDescription: asset.description ? 
          (asset.description.length > 50 ? `${asset.description.slice(0, 50)}...` : asset.description) 
          : 'No description'
      }));
    });

    // 链接相关的状态
    const linkCategories = ['CorePage', 'LandingPage', 'Blog', 'HelpCenter']
    const selectedLinkCategory = ref('all')

    const linkColumns = [
      {
        title: 'Link',
        dataIndex: 'link',
        key: 'link',
        width: '30%',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '50%',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: '10%',
        filters: [
          { text: 'Core', value: 'Core' },
          { text: 'LandingPage', value: 'LandingPage' },
          { text: 'Blog', value: 'Blog' },
          { text: 'HelpCenter', value: 'HelpCenter' },
        ],
        onFilter: (value, record) => record.category === value,
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '10%',
      },
    ]

    // 添加新的响应式变量
    const linksLoading = ref(false)
    const internalLinks = ref([])

    // 获取内部链接数的方法
    const fetchLinks = async () => {
      linksLoading.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getInternalLinks(customerId, {
          page: 1,
          limit: 100 // 可以根据需求调整
        })
        
        if (response && response.data) {
          internalLinks.value = response.data.map(link => ({
            id: link.linkId,
            link: link.link,
            description: link.description,
            category: link.category
          }))
        }
      } catch (error) {
        console.error('Failed to fetch internal links:', error)
        message.error('Failed to fetch internal links')
      } finally {
        linksLoading.value = false
      }
    }

    // 删除链接的方法
    const deleteLink = async (record) => {
      try {
        // 这里需要后端提供删除内部链接的 API
        await apiClient.deleteInternalLink(record.id)
        message.success('Link deleted successfully')
        fetchLinks() // 重新获取链接列表
      } catch (error) {
        console.error('Failed to delete link:', error)
        message.error('Failed to delete link')
      }
    }

    // 编辑链接的方法
    const editLink = async (record) => {
      editingLink.value = record
      linkForm.value = {
        link: record.link,
        description: record.description,
        category: record.category
      }
      linkModalVisible.value = true
    }

    // 处理链接表单提交
    const handleLinkModalOk = async () => {
      try {
        await linkFormRef.value.validate()
        linkSubmitting.value = true
        
        const customerId = localStorage.getItem('currentCustomerId')
        const linkData = {
          customerId,
          link: linkForm.value.link,
          description: linkForm.value.description,
          category: linkForm.value.category
        }

        if (editingLink.value) {
          console.log('editingLink.value', editingLink.value)
          // 更新有链接
          await apiClient.updateInternalLink(editingLink.value.id, linkData)
          message.success('Link updated successfully')
        } else {
          // 创建新链接
          await apiClient.createInternalLink(linkData)
          message.success('Link added successfully')
        }
        
        linkModalVisible.value = false
        resetLinkForm()
        fetchLinks() // 重新获取链接列表
      } catch (error) {
        console.error('Failed to save link:', error)
        message.error('Failed to save link')
      } finally {
        linkSubmitting.value = false
      }
    }

    // Link form related
    const linkModalVisible = ref(false)
    const linkSubmitting = ref(false)
    const linkFormRef = ref()
    const editingLink = ref(null)
    
    const linkForm = ref({
      link: '',
      description: '',
      category: undefined
    })
    
    const linkFormRules = {
      link: [
        { required: true, message: 'Please enter the link URL' },
        { type: 'url', message: 'Please enter a valid URL' }
      ],
      description: [
        { required: true, message: 'Please enter the link description' },
        { max: 500, message: 'Description cannot exceed 500 characters' }
      ],
      category: [
        { required: true, message: 'Please select a category' }
      ]
    }
    
    const isLinkFormValid = computed(() => {
      return linkForm.value.link && 
             linkForm.value.description && 
             linkForm.value.category
    })
    
    const resetLinkForm = () => {
      linkForm.value = {
        link: '',
        description: '',
        category: undefined
      }
      editingLink.value = null
      if (linkFormRef.value) {
        linkFormRef.value.resetFields()
      }
    }
    
    const showAddLinkModal = () => {
      resetLinkForm()
      linkModalVisible.value = true
    }
    
    const handleLinkModalCancel = () => {
      linkModalVisible.value = false
      resetLinkForm()
    }

    // Add new reactive variables for media form
    const mediaForm = ref({
      mediaName: '',
      description: ''
    });

    const mediaFormRules = {
      mediaName: [
        { required: true, message: 'Please enter the file name' },
        { max: 50, message: 'Name cannot exceed 50 characters' },
        { 
          validator: (_, value) => {
            if (value && value.includes(' ')) {
              return Promise.reject('File name cannot contain spaces');
            }
            return Promise.resolve();
          }
        }
      ]
    };

    const mediaFormRef = ref();
    const mediaFormValidateStatus = ref(false);

    // Add computed property for form validation
    const isMediaFormValid = computed(() => {
      return mediaForm.value.mediaName && 
             !mediaForm.value.mediaName.includes(' ') && 
             mediaForm.value.mediaName.length <= 50 &&
             mediaFormValidateStatus.value;
    });

    // Modify the form to validate on value change
    watch(() => mediaForm.value.mediaName, (newVal) => {
      // 简单验证：不为空且不包含空格
      mediaFormValidateStatus.value = newVal && !newVal.includes(' ');
    });

    // 修改这些响应式变量定义
    const groupedArticles = ref({})
    const currentArticle = ref(null)
    const editableContent = ref('')
    const saving = ref(false)
    const knowledgeStatus = ref('') // 新增:用于存储知识库状态
    const processingKnowledge = ref(false) // 新增:用于显示处理状态
    const knowledgeTime = ref('0'); // 添加处理时间的响应式变量

    // 修改 getKnowledgeStatus 方法
    const getKnowledgeStatus = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getKnowledgeProcessStatus(customerId);
        // 保存处理时间
        knowledgeTime.value = response.data.executeTime || '0';
        return {
          currentStep: response.data.executeStep,
          executeTime: response.data.executeTime
        };
      } catch (error) {
        console.error('获取知识库状态失败:', error);
        throw error;
      }
    };

    const getKnowledgeCenter = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getKnowledgeCenter(customerId)
        console.log('API返回数据:', response)
        return response.data || [] // 确保返回数组
      } catch (error) {
        console.error('获取知识库内容失败:', error)
        message.error('获取知识库内容失败')
        return []
      } finally {

      }
    }

    // 修改 initKnowledgeBase 方法
    const initKnowledgeBase = async () => {
      try {
        loading.value = true;
        processingKnowledge.value = true;
        
        // 开始轮询状态
        const pollStatus = async () => {
          const status = await getKnowledgeStatus();
          knowledgeStatus.value = status.currentStep;
          
          // 如果状态不是 'end'，继续轮询
          if (status.currentStep !== 'end') {
            setTimeout(pollStatus, 60000); // 每5秒轮询一次
          } else {
            // 状态为 'end' 时，获取知识库内容
            processingKnowledge.value = false;
            const centerData = await getKnowledgeCenter();
            if (centerData && Array.isArray(centerData)) {
              groupArticlesByLabel(centerData);
            }
          }
        };

        // 启动轮询
        await pollStatus();
        
      } catch (error) {
        console.error('初始化知识库失败:', error);
        message.error('加载知识库失败');
      } finally {
        loading.value = false;
      }
    };

    // 修改watch
    watch(
      () => activeTab.value,
      (newValue) => {
        if (newValue === 'knowledge') {
          initKnowledgeBase()
        }
      },
      { immediate: true }
    )

    const selectArticle = (article) => {
      currentArticle.value = article
      editableContent.value = article.content
    }

    const clearCurrentArticle = () => {
      currentArticle.value = null
      editableContent.value = ''
    }

    const saveArticle = async () => {
      if (!currentArticle.value) return;

      saving.value = true;
      try {
        const updateData = {
          content: editableContent.value,
          description: currentArticle.value.description,
          source: currentArticle.value.source,
          tags: currentArticle.value.tags,
          title: currentArticle.value.title
        };
        const response = await apiClient.updateKnowledge(currentArticle.value.id, updateData);
        
        if (response && response.code === 200) {
          message.success('Article updated successfully');
        } else if (response && response.code === 500) {
          message.error('Update content failed: ' + response.message);
        } else {
          message.error('Unexpected response from server');
        }
      } catch (error) {
        console.error('Failed to save article:', error);
        message.error('Failed to save changes');
      } finally {
        saving.value = false;
      }
    };

    const getCategoryStats = (articles) => {
      return {
        green: articles.filter(a => a.quality === 'A').length,
        yellow: articles.filter(a => a.quality === 'B').length,
        red: articles.filter(a => a.quality === 'C').length
      }
    }

    // 修改 groupArticlesByLabel 方法
    const groupArticlesByLabel = (articles) => {
      if (!articles || !articles.length) {
        console.log('没有文章数据')
        groupedArticles.value = {}
        return
      }
      
      console.log('原始文章数据:', articles)
      
      // 根据 label 分组
      groupedArticles.value = articles.reduce((acc, article) => {
        const label = article.label || 'Uncategorized' // 使用 label 字段，如果没有则归类为 Uncategorized
        if (!acc[label]) {
          acc[label] = []
        }
        acc[label].push({
          id: article.kId,
          title: article.title,
          label: article.label,
          description: article.description || '',
          content: article.content,
          source: article.source,
          quality: article.quality || 'C', // 添加质量评级，默认为 C
          createdAt: article.createdAt || ''
        })
        return acc
      }, {})

      console.log('按 label 分组后的数据:', groupedArticles.value)
    }

    return {
      domainConfigured,
      loading,
      goToDashboard,
      activeTab,
      loading,
      assets,
      fetchAssets,
      filteredAssets,
      previewVisible,
      selectedAsset,
      categories,
      selectedCategory,
      selectedKeys,
      categoryModalVisible,
      categoryForm,
      showAddCategory,
      handleAddCategory,
      deleteCategory,
      editCategoryModalVisible,
      handleEditCategory,
      showEmptyState,
      uploadModalVisible,
      uploadFile,
      previewUrl,
      fileInput,
      showUploadModal,
      triggerFileInput,
      handleFileChange,
      removeUpload,
      handleUploadOk,
      handleUploadCancel,
      uploading,
      deleteAsset,
      startEditing,
      previewAsset,
      closePreview,
      linkCategories,
      selectedLinkCategory,
      linkColumns,
      editLink,
      linksLoading,
      showAddLinkModal,
      deleteLink,
      internalLinks,
      linkModalVisible,
      linkSubmitting,
      linkFormRef,
      linkForm,
      linkFormRules,
      isLinkFormValid,
      editingLink,
      handleLinkModalOk,
      handleLinkModalCancel,
      mediaForm,
      mediaFormRules,
      mediaFormRef,
      isMediaFormValid,
      editModalVisible,
      editSubmitting,
      editFormRef,
      editForm,
      isEditFormValid,
      handleEditOk,
      handleEditCancel,
      assetInfo,
      goToHelpCenter,
      groupedArticles,
      currentArticle,
      editableContent,
      saving,
      selectArticle,
      clearCurrentArticle,
      saveArticle,
      getCategoryStats,
      pollTimer,
      knowledgeStatus,
      knowledgeTime,
      processingKnowledge
    }
  }
}
</script>

<style scoped>
.domain-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background: #fff;
  border-radius: 16px;
}

.notice-content {
  text-align: center;
  padding: 40px;
}

.notice-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 24px;
}

.notice-content h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.notice-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.notice-content .ant-btn {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  height: 40px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 20px;
}

.notice-content .ant-btn:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.page-content {
  display: flex;
  gap: 24px;
}

.assets-content {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 0px 0px 12px 0px;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-right {
  display: flex;
  justify-content: flex-end;
}

.ai-analyze-btn {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  height: 32px;
  padding: 0px 12px;
  border-radius: 16px;
}

.ai-analyze-btn:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-content .anticon {
  font-size: 14px;
}

.asset-card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
}

.asset-preview {
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  position: relative;
  cursor: pointer;
}

.asset-preview img,
.asset-preview video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.asset-info {
  padding: 12px;
}

.asset-info h4 {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
}

.asset-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #6B7280;
}

.asset-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.asset-card:hover .asset-actions {
  opacity: 1;
}

.delete-btn {
  padding: 4px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.delete-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #ff4d4f;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  min-height: calc(100vh - 200px);
}

.empty-state-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.empty-state-description {
  font-size: 16px;
  color: #6b7280;
  max-width: 400px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.upload-btn-empty {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  padding: 0 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  height: 40px;
  color: white;
}

@media (max-width: 768px) {
  .controls-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .assets-grid [class*='ant-col'] {
    width: 100%;
  }
}

.asset-tabs {
  flex: 1;
}

.asset-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.asset-card:hover .asset-overlay {
  opacity: 1;
}

.preview-icon {
  color: white;
  font-size: 24px;
}

.asset-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
}

.upload-time {
  color: #6b7280;
  font-size: 13px;
}

.asset-usage {
  color: #4b5563;
  font-size: 12px;
  margin: 4px 0;
  line-height: 1.4;
}

.asset-name {
  flex: 1;
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-modal {
  text-align: center;
}

.preview-image,
.preview-video {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

:deep(.ant-tabs-nav) {
  margin: 0;
}

:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-tabs-ink-bar) {
  background: #3B82F6 !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #3B82F6 !important;
}

:deep(.ant-tabs-tab:hover) {
  color: #60A5FA !important;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: 1px solid #E5E7EB;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 16px !important;
}

/* 确保加载状态在内容区域完全居中 */
.assets-grid {
  min-height: calc(100vh - 300px); /* 调整高度以应你的布局 */
  position: relative;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
}

:deep(.ant-spin) {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

:deep(.ant-spin-spinning) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 确保空状态和加载状态容器高度一致 */
.empty-state {
  min-height: calc(100vh - 300px);
}

.upload-container {
  padding: 20px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #3B82F6;
}

.upload-icon {
  font-size: 32px;
  color: #3B82F6;
  margin-bottom: 8px;
}

.upload-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.preview-container {
  text-align: center;
}

.preview-wrapper {
  margin-bottom: 16px;
}

.upload-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.asset-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-name {
  flex: 1;
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-name-btn,
.delete-btn {
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-popconfirm-message) {
  padding: 16px 16px 8px;
}

:deep(.ant-popconfirm-message-title) {
  font-size: 14px;
  color: #1a1a1a;
}

:deep(.ant-popconfirm-buttons) {
  padding: 8px 16px 16px;
}

:deep(.ant-popconfirm-buttons .ant-btn-default) {
  border-color: #E5E7EB;
}

:deep(.ant-popconfirm-buttons .ant-btn-default:hover) {
  color: #3B82F6;
  border-color: #3B82F6;
}

:deep(.ant-table) {
  padding: 0 24px;
}

:deep(.ant-table-thead > tr > th) {
  background: #f9fafb;
  font-weight: 600;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #f3f4f6;
}

:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-modal-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
}

.media-form {
  margin-top: 16px;
  margin-bottom: 16px;
}

.preview-container {
  margin-bottom: 16px;
}

.preview-wrapper {
  margin-bottom: 16px;
  text-align: center;
}

.upload-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.asset-description {
  font-size: 12px;
  color: #666;
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-btn {
  padding: 4px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.kb-module {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.info-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
  font-weight: 600;
}

.beta-tag {
  background: #1890ff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.ai-preview-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.6rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.text-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.text-controls h3 {
  margin: 0;
  font-size: 1.1rem;
}

.help-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
}

.upload-integration {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px dashed #e2e8f0;
}

.mini-features {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mini-features span {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .text-controls {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .upload-integration {
    text-align: center;
  }

  .mini-features {
    justify-content: center;
  }

  .mini-features span:nth-child(even) {
    display: none;
  }
}

.main-content {
  width: 100%;
  box-sizing: border-box;
}

.breadcrumb {
  padding: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.breadcrumb span {
  cursor: pointer;
}

.breadcrumb span:hover:not(.current) {
  color: #2563eb;
}

.breadcrumb .separator {
  margin: 0 8px;
  color: #9ca3af;
  cursor: default;
}

.breadcrumb .current {
  color: #1f2937;
  cursor: default;
}

.grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease;
  border-top: 3px solid #e6f4ff;
}

.category-card:hover {
  transform: translateY(-2px);
  border-top-color: #38BDF8;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.category-header h2 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  position: relative;
}

.article-count {
  font-size: 13px;
  color: #6b7280;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 8px; /* Add gap to ensure space between dot and title */
  padding: 8px 12px;
  border-radius: 6px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: normal; /* Allow text to wrap */
  word-break: break-word; /* Ensure long words break properly */
}

.article-item:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.status-dot {
  flex-shrink: 0; /* Prevent dot from shrinking */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.article-detail {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.article-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #1f2937;
}

.article-editor {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: none;
  resize: none;
  min-height: 0;
}

.article-actions {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1;
}
.status-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.status-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.status-green {
  background-color: #52c41a;
}

.status-yellow {
  background-color: #faad14;
}

.status-red {
  background-color: #ff4d4f;
}

.category-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 8px; /* Add gap to ensure space between dot and title */
  padding: 8px 12px;
  border-radius: 6px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: normal; /* Allow text to wrap */
  word-break: break-word; /* Ensure long words break properly */
}

.status-dot {
  flex-shrink: 0; /* Prevent dot from shrinking */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

:deep(.ant-alert-info) {
  border: 1px solid #e6f4ff;
  background-color: #f0f7ff;
}

:deep(.ant-alert-message) {
  color: #1890ff;
  font-weight: 500;
}

.knowledge-alert {
  border: 1px solid #bae0ff;
  background: #fff;
  border-radius: 12px;
  padding: 0 !important;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0 8px;
}

.highlight-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f7ff;
  padding: 16px;
  border-radius: 8px;
}

.ai-icon {
  font-size: 24px;
}

.highlight-message p {
  margin: 0;
  font-size: 15px;
  color: #262626;
  line-height: 1.5;
}

.quality-indicators {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator span {
  font-size: 14px;
  color: #434343;
}

.action-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff7e6;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #ffd591;
}

.attention-icon {
  font-size: 20px;
}

.action-message p {
  margin: 0;
  font-size: 14px;
  color: #d46b08;
  font-weight: 500;
}

.highlight {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.highlight.yellow {
  background: rgba(250, 173, 20, 0.1);
  color: #d48806;
}

.highlight.red {
  background: rgba(255, 77, 79, 0.1);
  color: #cf1322;
}

:deep(.ant-alert-info) {
  border: none;
}

:deep(.ant-alert-message) {
  margin-bottom: 0;
}

:deep(.ant-alert-description) {
  color: #434343;
}

.kb-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f7ff;
  padding: 12px 16px;
  border-radius: 8px;
  gap: 16px;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.status-message p {
  margin: 0;
  font-size: 14px;
  color: #262626;
  line-height: 1.4;
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(0,0,0,0.06);
}

.indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.indicator span {
  font-size: 13px;
  color: #434343;
  white-space: nowrap;
}

.attention-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #d46b08;
  font-size: 13px;
  padding-left: 16px;
  border-left: 1px solid rgba(0,0,0,0.06);
}

.attention-icon {
  font-size: 16px;
}

@media (max-width: 1024px) {
  .kb-status-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-indicators {
    padding-left: 0;
    border-left: none;
    padding-top: 12px;
    border-top: 1px solid rgba(0,0,0,0.06);
    width: 100%;
    flex-wrap: wrap;
  }
  
  .attention-hint {
    padding-left: 0;
    border-left: none;
  }
}

.traffic-light-descriptions {
  margin-bottom: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.traffic-light-descriptions p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-green {
  background-color: #52c41a;
}

.status-yellow {
  background-color: #faad14;
}

.status-red {
  background-color: #ff4d4f;
}
</style> 