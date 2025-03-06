<template>
  <div class="image-library">
    <!-- 添加上传按钮 -->
    <div class="library-header">
      <a-button type="primary" @click="showUploadModal">
        <upload-outlined /> Upload Image
      </a-button>
    </div>

    <!-- 现有的图片网格展示区域 -->
    <a-spin :spinning="loading" tip="Loading images...">
      <div class="assets-grid">
        <template v-if="!showEmptyState">
          <a-row :gutter="[16, 16]">
            <a-col 
              v-for="asset in assets" 
              :key="asset.id" 
              :xs="24" 
              :sm="12" 
              :md="8" 
              :lg="6"
            >
              <div 
                class="asset-card"
                :class="{ selected: selectedAsset?.id === asset.id }"
                @click="selectAsset(asset)"
              >
                <div class="asset-preview">
                  <img :src="asset.url" :alt="asset.name">
                  <div class="asset-overlay">
                    <check-outlined v-if="selectedAsset?.id === asset.id" class="selected-icon" />
                  </div>
                  <div class="asset-actions">
                    <a-popconfirm
                      title="Are you sure you want to delete this image?"
                      @confirm="deleteAsset(asset)"
                      @click.stop
                    >
                      <a-button type="text" danger>
                        <delete-outlined />
                      </a-button>
                    </a-popconfirm>
                  </div>
                </div>
                <div class="asset-info">
                  <h4 class="asset-name" :title="asset.name">{{ asset.name }}</h4>
                </div>
              </div>
            </a-col>
          </a-row>
          
          <div v-if="!loading" class="pagination-wrapper">
            <a-pagination
              v-model:current="currentPage"
              :total="total"
              :pageSize="pageSize"
              show-size-changer
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
            />
          </div>
        </template>
        
        <div v-else class="empty-state">
          <h3>No images found</h3>
          <p>Try uploading some images first</p>
        </div>
      </div>
    </a-spin>

    <!-- 添加上传模态框 -->
    <a-modal
      v-model:visible="uploadModalVisible"
      title="Upload Image"
      @ok="handleUploadOk"
      @cancel="handleUploadCancel"
      :okButtonProps="{ 
        disabled: !uploadFile || !isMediaFormValid,
        loading: uploading
      }"
    >
      <div class="upload-container">
        <div 
          v-if="!uploadFile" 
          class="upload-area" 
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
        >
          <upload-outlined class="upload-icon" />
          <p>Click or drag file to upload</p>
          <p class="upload-hint">Supports JPG, PNG, WebP formats (Max: 1MB)</p>
        </div>
        
        <template v-else>
          <div class="preview-container">
            <div class="preview-wrapper">
              <img
                :src="previewUrl"
                class="upload-preview"
              />
            </div>
          </div>

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
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { CheckOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import apiClient from '../../../api/api'

export default {
  name: 'ImageLibrary',
  components: {
    CheckOutlined,
    UploadOutlined,
    DeleteOutlined,
    EditOutlined
  },
  emits: ['select', 'close'],
  setup(props, { emit }) {
    const loading = ref(false)
    const assets = ref([])
    const selectedAsset = ref(null)
    const currentPage = ref(1)
    const pageSize = ref(8)
    const total = ref(0)

    // 获取图片列表
    const fetchAssets = async () => {
      loading.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getMedia(
          customerId, 
          'image',
          null, // categoryId
          currentPage.value,
          pageSize.value
        )
        
        if (response.data) {
          assets.value = response.data.map(item => ({
            id: item.mediaId,
            name: item.mediaName,
            url: item.mediaUrl
          }))
          total.value = response.TotalCount
        }
      } catch (error) {
        console.error('Failed to fetch images:', error)
      } finally {
        loading.value = false
      }
    }

    // 选择图片
    const selectAsset = (asset) => {
      selectedAsset.value = asset
      emit('select', asset)
    }

    // 空状态判断
    const showEmptyState = computed(() => {
      return !loading.value && assets.value.length === 0
    })

    // 使用 onMounted 确保组件挂载后执行初始化加载
    onMounted(() => {
      fetchAssets()
    })

    // 添加上传相关的响应式变量
    const uploadModalVisible = ref(false)
    const uploadFile = ref(null)
    const previewUrl = ref('')
    const fileInput = ref(null)
    const uploading = ref(false)
    const mediaFormRef = ref()
    
    const mediaForm = ref({
      mediaName: '',
      description: ''
    })
    
    const mediaFormRules = {
      mediaName: [
        { required: true, message: 'Please enter file name' },
        { max: 50, message: 'Name cannot exceed 50 characters' }
      ]
    }

    const isMediaFormValid = computed(() => {
      return mediaForm.value.mediaName && 
             !mediaForm.value.mediaName.includes(' ') && 
             mediaForm.value.mediaName.length <= 50
    })

    // 上传相关方法
    const showUploadModal = () => {
      uploadModalVisible.value = true
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileDrop = (e) => {
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    }

    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file) handleFileSelect(file)
    }

    const handleFileSelect = (file) => {
      if (file.size > 1024 * 1024) {
        message.error('File size exceeds 1MB limit')
        if (fileInput.value) fileInput.value.value = ''
        return
      }

      uploadFile.value = file
      previewUrl.value = URL.createObjectURL(file)
      
      const initialName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, '_')
      
      mediaForm.value.mediaName = initialName
    }

    const removeUpload = () => {
      uploadFile.value = null
      previewUrl.value = ''
      mediaForm.value = {
        mediaName: '',
        description: ''
      }
      if (fileInput.value) fileInput.value.value = ''
    }

    const handleUploadOk = async () => {
      if (!uploadFile.value || !mediaForm.value.mediaName) return

      uploading.value = true
      loading.value = true
      try {
        const formData = new FormData()
        formData.append('file', uploadFile.value)
        formData.append('customerId', localStorage.getItem('currentCustomerId'))
        formData.append('mediaType', 'image')
        formData.append('mediaName', mediaForm.value.mediaName)
        formData.append('description', mediaForm.value.description || '')
        formData.append('categoryName', 'media')

        const response = await apiClient.uploadMedia(formData)
        
        message.success('Upload successful')
        uploadModalVisible.value = false
        removeUpload()
        await fetchAssets() // 重新加载图片列表
      } catch (error) {
        console.error('Upload failed:', error)
        message.error('Upload failed, please try again')
      } finally {
        uploading.value = false
        loading.value = false
      }
    }

    const handleUploadCancel = () => {
      uploadModalVisible.value = false
      removeUpload()
    }

    const handlePageChange = (page, size) => {
      currentPage.value = page
      pageSize.value = size
      fetchAssets()
    }

    const handleSizeChange = (current, size) => {
      currentPage.value = 1
      pageSize.value = size
      fetchAssets()
    }

    const deleteAsset = async (asset) => {
      try {
        await apiClient.deleteMedia(asset.id)
        assets.value = assets.value.filter(item => item.id !== asset.id)
        message.success('Image deleted successfully')
      } catch (error) {
        console.error('Failed to delete image:', error)
        message.error('Failed to delete image')
      }
    }

    return {
      loading,
      assets,
      selectedAsset,
      showEmptyState,
      selectAsset,
      uploadModalVisible,
      uploadFile,
      previewUrl,
      fileInput,
      uploading,
      mediaForm,
      mediaFormRef,
      mediaFormRules,
      isMediaFormValid,
      showUploadModal,
      triggerFileInput,
      handleFileChange,
      handleFileDrop,
      removeUpload,
      handleUploadOk,
      handleUploadCancel,
      currentPage,
      pageSize,
      total,
      handlePageChange,
      handleSizeChange,
      deleteAsset
    }
  }
}
</script>

<style scoped>
.image-library {
  padding: 20px;
}

.asset-card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.asset-card:hover {
  border-color: #1890ff;
}

.asset-card.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.asset-preview {
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  position: relative;
}

.asset-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.asset-card:hover .asset-overlay,
.asset-card.selected .asset-overlay {
  opacity: 1;
}

.selected-icon {
  color: white;
  font-size: 24px;
}

.asset-info {
  padding: 12px;
}

.asset-name {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
}

.library-header {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
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
  margin-bottom: 16px;
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
  margin-top: 16px;
}

.media-form {
  margin-top: 16px;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.asset-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

:deep(.ant-btn-text) {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

:deep(.ant-btn-text:hover) {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

:deep(.ant-btn-text.ant-btn-dangerous) {
  color: #fff;
}

:deep(.ant-btn-text.ant-btn-dangerous:hover) {
  background: rgba(255, 77, 79, 0.9);
  color: #fff;
}
</style> 