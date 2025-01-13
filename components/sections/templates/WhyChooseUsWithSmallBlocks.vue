<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Why Choose Us With Small Blocks</h2>
      </div>
      <div class="editor-content">
        <a-form layout="vertical">
          <!-- Top Content -->
          <a-form-item label="Emoji">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.emoji }}</span>
              <div class="emoji-input-wrapper">
                <a-input 
                  v-model:value="localSection.topContent.icon" 
                  @change="handleChange" 
                />
                <a-button
                  v-if="!disabled"
                  class="emoji-trigger"
                  @click="(e) => showEmojiPicker(e, 'top')"
                >
                  😊
                </a-button>
              </div>
            </div>
          </a-form-item>
          
          <a-form-item label="Title">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.title }}</span>
              <a-input v-model:value="localSection.topContent.title" @change="handleChange" />
            </div>
          </a-form-item>
          
          <a-form-item label="Description">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.description }}</span>
              <a-textarea
                v-model:value="localSection.topContent.description"
                :rows="3"
                @change="handleChange"
              />
            </div>
          </a-form-item>

          <!-- Bottom Content -->
          <div class="bottom-content">
            <div class="flex justify-between items-center mb-4">
              <h3>Modules</h3>
              <a-button 
                type="primary" 
                @click="addModule"
                :disabled="localSection.bottomContent.length >= 6"
              >
                Add Module
              </a-button>
            </div>
            
            <div class="module-grid">
              <div v-for="(module, index) in localSection.bottomContent" :key="index">
                <a-form-item>
                  <div class="flex justify-between items-center mb-2">
                    <span>Module {{ index + 1 }}</span>
                    <a-button type="text" class="delete-btn" @click="removeModule(index)">
                      <template #icon>
                        <delete-outlined />
                      </template>
                    </a-button>
                  </div>
                  <div class="input-with-tag mb-2">
                    <span class="html-tag">{{ tags.icon }}</span>
                    <div class="emoji-input-wrapper">
                      <a-input
                        v-model:value="module.icon"
                        placeholder="Icon"
                        @change="handleChange"
                      />
                      <a-button
                        v-if="!disabled"
                        class="emoji-trigger"
                        @click="(e) => showEmojiPicker(e, 'module', index)"
                      >
                        😊
                      </a-button>
                    </div>
                  </div>
                  <div class="input-with-tag mb-2">
                    <span class="html-tag">{{ tags.moduleTitle }}</span>
                    <a-input
                      v-model:value="module.title"
                      placeholder="Title"
                      @change="handleChange"
                    />
                  </div>
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.moduleContent }}</span>
                    <a-textarea
                      v-model:value="module.content"
                      placeholder="Content"
                      :rows="3"
                      @change="handleChange"
                      :style="{ minHeight: '80px' }"
                    />
                  </div>
                </a-form-item>
              </div>
            </div>
          </div>
        </a-form>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <WhyChooseUsWithSmallBlocksPreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>

    <!-- 添加 Emoji Picker Modal -->
    <a-modal
      v-model:visible="emojiPickerVisible"
      :footer="null"
      :closable="false"
      :width="350"
      centered
      class="emoji-picker-modal"
      @cancel="closeEmojiPicker"
    >
      <EmojiPicker
        @select="onEmojiSelect"
      />
    </a-modal>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import WhyChooseUsWithSmallBlocksPreview from './WhyChooseUsWithSmallBlocksPreview.vue'
import themeConfig from '../../../assets/config/themeConfig'
import { DeleteOutlined } from '@ant-design/icons-vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

export default {
  name: 'WhyChooseUsWithSixSmallBlocks',
  extends: BaseSection,
  computed: {
    tags() {
      return SECTION_TAGS.WhyChooseUsWithSmallBlocks
    }
  },
  data() {
    return {
      localSection: {
        topContent: {
          emoji: '',
          title: '',
          description: ''
        },
        bottomContent: []
      },
      styles: themeConfig.normal,
      emojiPickerVisible: false,
      currentTarget: {
        type: null, // 'top' 或 'module'
        index: null
      }
    }
  },
  created() {
    this.localSection = Object.assign({
      topContent: {
        emoji: '',
        title: '',
        description: ''
      },
      bottomContent: []
    }, JSON.parse(JSON.stringify(this.section)))

    if (!Array.isArray(this.localSection.bottomContent)) {
      this.localSection.bottomContent = []
    }
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = {
          topContent: {
            icon: newVal.topContent?.icon || '',
            title: newVal.topContent?.title || '',
            description: newVal.topContent?.description || ''
          },
          bottomContent: Array.isArray(newVal.bottomContent) 
            ? JSON.parse(JSON.stringify(newVal.bottomContent))
            : []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addModule() {
      if (this.localSection.bottomContent.length < 6) {
        this.localSection.bottomContent = [
          ...this.localSection.bottomContent,
          {
            icon: '⚡',
            title: 'New Module',
            content: 'Add your description here'
          }
        ]
        this.handleChange()
      }
    },
    removeModule(index) {
      this.localSection.bottomContent = this.localSection.bottomContent.filter((_, i) => i !== index)
      this.handleChange()
    },
    showEmojiPicker(e, type, index = null) {
      e.stopPropagation()
      this.currentTarget = { type, index }
      this.emojiPickerVisible = true
    },
    closeEmojiPicker() {
      this.emojiPickerVisible = false
      this.currentTarget = { type: null, index: null }
    },
    onEmojiSelect(emoji) {
      const { type, index } = this.currentTarget
      if (type === 'top') {
        this.localSection.topContent.icon = emoji.i
      } else if (type === 'module' && index !== null) {
        this.localSection.bottomContent[index].icon = emoji.i
      }
      this.closeEmojiPicker()
      this.handleChange()
    }
  },
  components: {
    WhyChooseUsWithSmallBlocksPreview,
    DeleteOutlined,
    EmojiPicker
  }
}
</script>

<style scoped>
/* 基础布局 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
}

/* 表单样式 */
.input-with-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.html-tag {
  padding: 2px 8px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #0050b3;
  font-size: 12px;
  font-family: monospace;
}

:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

/* 预览区域样式 */
.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 16px;
  background: #f8fafc;
  border-radius: 8px;
  height: 48px;
}

.preview-content {
  background: white;
  border-radius: 8px;
  flex: 1;
  padding: 24px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

:deep(.anticon) {
  font-size: 14px;
  color: inherit;
}

.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border-radius: 8px;
  padding: 24px;
}

.editor-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
}

.component-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.emoji-input-wrapper {
  display: flex;
  gap: 8px;
  flex: 1;
}

.emoji-trigger {
  padding: 0 8px;
}

:deep(.emoji-picker-modal) {
  .ant-modal-content {
    padding: 12px;
    border-radius: 8px;
  }
  
  .ant-modal-body {
    padding: 0;
  }
}

:deep(.v3-emoji-picker) {
  --ep-color-bg: #ffffff;
  --ep-color-border: #e4e7ea;
  --ep-color-hover: #f7f9fa;
  border: none;
  box-shadow: none;
}
</style>