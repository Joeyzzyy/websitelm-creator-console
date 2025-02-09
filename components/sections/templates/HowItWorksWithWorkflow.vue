<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">How It Works With Workflow</h2>
      </div>
      <div class="editor-content">
        <div class="section-container">
          <!-- 顶部内容 -->
          <div class="top-content">
            <a-form layout="vertical">
              <a-form-item label="Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.title }}</span>
                  <a-input
                    v-model:value="localSection.topContent.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Subtitle">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.subTitle }}</span>
                  <a-input
                    v-model:value="localSection.topContent.subTitle"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Image URL">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.imageUrl }}</span>
                  <div class="image-input-wrapper">
                    <a-input
                      v-model:value="localSection.topContent.imageUrl"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                    <a-button 
                      type="primary"
                      class="change-image-btn"
                      @click="openImageLibrary"
                    >
                      Change
                    </a-button>
                  </div>
                </div>
              </a-form-item>

              <!-- 添加图片预览 -->
              <div class="image-preview" v-if="localSection.topContent.imageUrl">
                <a-image :src="localSection.topContent.imageUrl" :width="200" />
              </div>

              <a-form-item label="Image Alt Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.imageAlt }}</span>
                  <a-input
                    v-model:value="localSection.topContent.imageAlt"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Primary Button">
                <a-space direction="vertical" style="width: 100%">
                  <a-checkbox
                    v-model:checked="localSection.topContent.showButton"
                    :disabled="disabled"
                    @change="handleChange"
                  >
                    Show Primary Button
                  </a-checkbox>
                  <template v-if="localSection.topContent.showButton">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.buttonText }}</span>
                      <a-input
                        v-model:value="localSection.topContent.buttonText"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.buttonLink }}</span>
                      <a-input
                        v-model:value="localSection.topContent.buttonLink"
                        :disabled="disabled"
                        placeholder="Enter button link (e.g., /about or https://...)"
                        @change="handleChange"
                      />
                    </div>
                  </template>
                </a-space>
              </a-form-item>

              <a-form-item label="CTA Button">
                <a-space direction="vertical" style="width: 100%">
                  <a-checkbox
                    v-model:checked="localSection.topContent.showCtaButton"
                    :disabled="disabled"
                    @change="handleChange"
                  >
                    Show CTA Button
                  </a-checkbox>
                  <template v-if="localSection.topContent.showCtaButton">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.ctaButtonText }}</span>
                      <a-input
                        v-model:value="localSection.topContent.ctaButtonText"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.ctaButtonLink }}</span>
                      <a-input
                        v-model:value="localSection.topContent.ctaButtonLink"
                        :disabled="disabled"
                        placeholder="Enter button link (e.g., /contact or https://...)"
                        @change="handleChange"
                      />
                    </div>
                  </template>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
  
          <!-- 底部箭头流程 -->
          <div class="bottom-content">
            <div class="arrow-flow">
              <div 
                v-for="(item, index) in localSection.bottomContent" 
                :key="index"
                class="flow-item"
              >
                <div class="flow-content">
                  <a-form layout="vertical">
                    <div class="flow-header">
                      <span>Step {{ item.number }}</span>
                    </div>
  
                    <a-form-item label="Number">
                      <div class="input-with-tag">
                        <span class="html-tag">{{ tags.number }}</span>
                        <a-input
                          v-model:value="item.number"
                          :disabled="disabled"
                          @change="handleChange"
                        />
                      </div>
                    </a-form-item>
  
                    <a-form-item label="Step Title">
                      <div class="input-with-tag">
                        <span class="html-tag">{{ tags.stepTitle }}</span>
                        <a-input
                          v-model:value="item.title"
                          :disabled="disabled"
                          @change="handleChange"
                        />
                      </div>
                    </a-form-item>
  
                    <a-form-item label="Step Subtitle">
                      <div class="input-with-tag">
                        <span class="html-tag">{{ tags.stepSubTitle }}</span>
                        <a-input
                          v-model:value="item.subTitle"
                          :disabled="disabled"
                          @change="handleChange"
                        />
                      </div>
                    </a-form-item>
  
                    <a-form-item label="Content">
                      <div class="input-with-tag">
                        <span class="html-tag">{{ tags.content }}</span>
                        <a-textarea
                          v-model:value="item.content"
                          :disabled="disabled"
                          :rows="3"
                          @change="handleChange"
                          :style="{ minHeight: '120px' }"
                        />
                      </div>
                    </a-form-item>
                  </a-form>
                </div>
                <div v-if="index < localSection.bottomContent.length - 1" class="arrow">
                  →
                </div>
              </div>
            </div>
  
            <a-button 
              v-if="!disabled && localSection.bottomContent.length < 3" 
              type="dashed" 
              block 
              @click="addStep"
            >
              Add Step
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <HowItWorksWithWorkflowPreview 
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

    <!-- 添加图片库模态框 -->
    <a-modal
      v-model:visible="imageLibraryVisible"
      title="Select Image"
      @ok="handleImageSelect"
      @cancel="closeImageLibrary"
      width="800px"
    >
      <image-library
        v-if="imageLibraryVisible"
        @select="onImageSelect"
        @close="closeImageLibrary"
      />
    </a-modal>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import themeConfig from '../../../assets/config/themeConfig'
import HowItWorksWithWorkflowPreview from './HowItWorksWithWorkflowPreview.vue'
import ImageLibrary from '../common/ImageLibrary.vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

export default {
  name: 'HowItWorksWithWorkflow',
  extends: BaseSection,
  components: {
    HowItWorksWithWorkflowPreview,
    EmojiPicker,
    ImageLibrary
  },
  data() {
    return {
      localSection: {
        topContent: {
          icon: '🔄',
          title: 'Transform Your Business',
          subTitle: 'Learn how our platform can help you grow',
          buttonText: 'Get Started',
          buttonLink: '#',
          ctaButtonText: 'Learn More',
          ctaButtonLink: '#',
          showButton: true,
          showCtaButton: true,
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Workflow Diagram Example'
        },
        bottomContent: [
          {
            number: 'Step 1',
            title: 'Sign Up',
            subTitle: 'Create Your Account',
            content: 'Get started by creating your account in just a few minutes. No credit card required.'
          },
          {
            number: 'Step 2',
            title: 'Configure your preferences',
            subTitle: 'Configure your preferences',
            content: 'Configure your preferences'
          },
          {
            number: 'Step 3',
            title: 'Start using the platform',
            subTitle: 'Start using the platform',
            content: 'Start using the platform'
          }
        ],
      },
      styles: themeConfig.normal,
      emojiPickerVisible: false,
      imageLibraryVisible: false,
      selectedImage: null
    }
  },
  created() {
    if (this.section) {
      this.localSection = JSON.parse(JSON.stringify(this.section))
    }
    if (!Array.isArray(this.localSection.bottomContent)) {
      this.localSection.bottomContent = []
    }
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = JSON.parse(JSON.stringify(newVal))
        if (!Array.isArray(this.localSection.bottomContent)) {
          this.localSection.bottomContent = []
        }
      },
      deep: true
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.HowItWorksWithWorkflow
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addStep() {
      if (this.localSection.bottomContent.length < 3) {
        const stepNumber = this.localSection.bottomContent.length + 1;
        this.localSection.bottomContent.push({
          number: `Step ${stepNumber}`,
          title: '',
          subTitle: '',
          content: ''
        })
        this.handleChange()
      }
    },
    removeStep(index) {
      this.localSection.bottomContent.splice(index, 1)
      // 重新编号
      this.localSection.bottomContent.forEach((item, i) => {
        item.number = String(i + 1)
      })
      this.handleChange()
    },
    showEmojiPicker(e) {
      e.stopPropagation()
      this.emojiPickerVisible = true
    },
    
    closeEmojiPicker() {
      this.emojiPickerVisible = false
    },
    
    onEmojiSelect(emoji) {
      this.localSection.topContent.icon = emoji.i
      this.closeEmojiPicker()
      this.handleChange()
    },

    // 添加图片库相关方法
    openImageLibrary() {
      this.imageLibraryVisible = true
    },

    closeImageLibrary() {
      this.imageLibraryVisible = false
      this.selectedImage = null
    },

    onImageSelect(image) {
      this.selectedImage = image
    },

    handleImageSelect() {
      if (this.selectedImage) {
        this.localSection.topContent.imageUrl = this.selectedImage.url
        this.handleChange()
      }
      this.closeImageLibrary()
    }
  }
}
</script>

<style scoped>
/* 基础布局样式 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: fit-content;
}

/* 编辑区域和预览区域样式 */
.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
}

.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  max-height: 1000px;
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

.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
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
  padding: 24px;
  height: fit-content;
  flex: 0 0 auto;
}

.arrow-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 32px 0;
}

.flow-item {
  width: 100%;
  position: relative;
}

.arrow {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%) rotate(90deg);
  color: #1890ff;
  font-size: 20px;
}

:deep(.ant-form-item) {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
}

.html-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #0050b3;
  font-size: 12px;
  margin-right: 8px;
  font-family: monospace;
}

.input-with-tag {
  display: flex;
  align-items: center;
  gap: 8px;
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

.image-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.change-image-btn {
  background: linear-gradient(135deg, #1890ff, #1890ff);
  border: none;
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.change-image-btn:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.image-preview {
  margin-top: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}
</style>