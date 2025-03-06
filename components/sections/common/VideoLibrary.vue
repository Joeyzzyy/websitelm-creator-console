<template>
  <div class="video-library">
    <a-spin :spinning="loading" tip="Loading videos...">
      <div class="video-grid">
        <template v-if="!showEmptyState">
          <div 
            v-for="video in videos" 
            :key="video.id"
            class="video-item"
            :class="{ selected: selectedVideo?.id === video.id }"
            @click="selectVideo(video)"
          >
            <div class="video-preview-wrapper">
              <video 
                class="video-preview"
                :src="video.url"
                muted
              ></video>
              <div class="asset-actions">
                <a-popconfirm
                  title="Are you sure you want to delete this video?"
                  @confirm="deleteAsset(video)"
                  @click.stop
                >
                  <a-button type="text" danger>
                    <delete-outlined />
                  </a-button>
                </a-popconfirm>
              </div>
            </div>
            <div class="video-info">
              <span class="video-name">{{ video.name }}</span>
            </div>
          </div>
        </template>
        
        <div v-else class="empty-state">
          <h3>No videos found</h3>
          <p>Please upload some videos first</p>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import apiClient from '../../../api/api'

export default {
  name: 'VideoLibrary',
  components: {
    DeleteOutlined
  },
  emits: ['select'],
  setup(props, { emit }) {
    const loading = ref(false)
    const videos = ref([])
    const selectedVideo = ref(null)

    // 获取视频列表
    const fetchVideos = async () => {
      loading.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getMedia(customerId, 'video')
        videos.value = response.data ? response.data.map(item => ({
          id: item.mediaId,
          name: item.mediaName,
          url: item.mediaUrl
        })) : []
      } catch (error) {
        console.error('获取视频失败:', error)
      } finally {
        loading.value = false
      }
    }

    const selectVideo = (video) => {
      selectedVideo.value = video
      emit('select', video)
    }

    const showEmptyState = computed(() => {
      return !loading.value && videos.value.length === 0
    })

    const deleteAsset = async (video) => {
      try {
        await apiClient.deleteMedia(video.id)
        videos.value = videos.value.filter(item => item.id !== video.id)
        message.success('Video deleted successfully')
      } catch (error) {
        console.error('Failed to delete video:', error)
        message.error('Failed to delete video')
      }
    }

    // 初始加载
    fetchVideos()

    return {
      loading,
      videos,
      selectedVideo,
      showEmptyState,
      selectVideo,
      deleteAsset
    }
  }
}
</script>

<style scoped>
.video-library {
  padding: 16px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.video-item {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.video-item:hover {
  border-color: #1890ff;
}

.video-item.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.video-preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
  background: #f5f5f5;
}

.video-info {
  padding: 8px;
}

.video-name {
  font-size: 14px;
  color: #333;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-preview-wrapper {
  position: relative;
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