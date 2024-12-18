<template>
  <div class="image-library">
    <!-- 图片网格展示区域 -->
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
                </div>
                <div class="asset-info">
                  <h4 class="asset-name" :title="asset.name">{{ asset.name }}</h4>
                </div>
              </div>
            </a-col>
          </a-row>
        </template>
        
        <div v-else class="empty-state">
          <h3>No images found</h3>
          <p>Try uploading some images first</p>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import apiClient from '../../../api/api'

export default {
  name: 'ImageLibrary',
  components: {
    CheckOutlined
  },
  emits: ['select', 'close'],
  setup(props, { emit }) {
    const loading = ref(false)
    const assets = ref([])
    const selectedAsset = ref(null)

    // 获取图片列表
    const fetchAssets = async () => {
      loading.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getMedia(customerId, 'image')
        assets.value = response.data ? response.data.map(item => ({
          id: item.mediaId,
          name: item.mediaName,
          url: item.mediaUrl
        })) : []
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

    // 初始加载
    fetchAssets()

    return {
      loading,
      assets,
      selectedAsset,
      showEmptyState,
      selectAsset
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
  align-items: center;
  justify-content: center;
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
</style> 