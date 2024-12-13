<template>
  <div
    class="upload-zone"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    :class="{ 'is-dragover': isDragOver, 'is-loading': loading }"
  >
    <div class="upload-content">
      <div v-if="loading" class="loading-indicator">
        <a-spin />
        <p>Uploading...</p>
      </div>
      <template v-else>
        <div class="upload-icon">
          <upload-outlined />
        </div>
        <p class="upload-text">
          Drag and drop your files here, or
          <label class="upload-button">
            <span>click to upload</span>
            <input
              type="file"
              multiple
              class="hidden-input"
              @change="handleFileSelect"
              accept=".pdf,.doc,.docx,.txt,.md"
            >
          </label>
        </p>
        <p class="upload-hint">
          Supports: PDF, Word, TXT, Markdown (Max: 10MB)
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'UploadZone',
  components: {
    UploadOutlined
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['file-uploaded'],
  setup(props, { emit }) {
    const isDragOver = ref(false)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

    const handleDragOver = () => {
      isDragOver.value = true
    }

    const handleDragLeave = () => {
      isDragOver.value = false
    }

    const validateFile = (file) => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
      ]

      if (!validTypes.includes(file.type)) {
        message.error('Unsupported file type')
        return false
      }

      if (file.size > MAX_FILE_SIZE) {
        message.error('File size exceeds 10MB limit')
        return false
      }

      return true
    }

    const processFiles = (files) => {
      Array.from(files).forEach(file => {
        if (validateFile(file)) {
          emit('file-uploaded', {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file
          })
        }
      })
    }

    const handleDrop = (e) => {
      isDragOver.value = false
      const files = e.dataTransfer.files
      processFiles(files)
    }

    const handleFileSelect = (e) => {
      const files = e.target.files
      processFiles(files)
      e.target.value = '' // 重置input，允许重复上传相同文件
    }

    return {
      isDragOver,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect
    }
  }
}
</script>

<style scoped>
.upload-zone {
  border: 2px dashed #DDD6FE;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  background: #F9FAFB;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.upload-zone:hover {
  border-color: #1890ff;
  background: #F5F3FF;
}

.upload-zone.is-dragover {
  border-color: #1890ff;
  background: #EDE9FE;
}

.upload-zone.is-loading {
  cursor: wait;
  opacity: 0.7;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.upload-icon {
  font-size: 2.5rem;
  color: #1890ff;
}

.upload-text {
  margin: 0;
  color: #374151;
  font-size: 1rem;
}

.upload-button {
  color: #1890ff;
  cursor: pointer;
  margin: 0 0.5rem;
  font-weight: 500;
}

.upload-button:hover {
  color: #6D28D9;
  text-decoration: underline;
}

.upload-hint {
  margin: 0;
  font-size: 0.875rem;
  color: #6B7280;
}

.hidden-input {
  display: none;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #1890ff;
}

:deep(.ant-spin) {
  color: #1890ff;
}
</style> 