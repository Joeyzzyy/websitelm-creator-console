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
            <video 
              class="video-preview"
              :src="video.url"
              muted
            ></video>
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
import apiClient from '../../../api/api'

export default {
  name: 'VideoLibrary',
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

    // 初始加载
    fetchVideos()

    return {
      loading,
      videos,
      selectedVideo,
      showEmptyState,
      selectVideo
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
</style>