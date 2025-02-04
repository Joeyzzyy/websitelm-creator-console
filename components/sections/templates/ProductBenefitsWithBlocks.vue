<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Product Benefits With Blocks</h2>
      </div>
      <div class="editor-content">
        <a-row :gutter="24">
          <!-- 原有的编辑表单内容 -->
          <a-col :span="24">
            <a-form layout="vertical">
              <a-form-item label="Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.title }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Description">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.description }}</span>
                  <a-textarea
                    v-model:value="localSection.leftContent.description"
                    :disabled="disabled"
                    :rows="3"
                    @change="handleChange"
                    :style="{ minHeight: '120px' }"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Button Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonText }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.buttonText"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Button Link">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonLink }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.buttonLink"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </a-form>
          </a-col>
  
          <a-col :span="20">
            <div style="margin-bottom: 12px; color: #666;">
              Module Content Area
            </div>
            <a-button 
              v-if="!disabled"
              block 
              type="primary"
              class="add-module-btn"
              @click="addModule"
            >
              Add Module
            </a-button>
            <div class="modules-grid">
              <a-row :gutter="[16, 16]">
                <a-col 
                  v-for="(module, index) in localSection.rightContent" 
                  :key="index"
                  :span="24"
                >
                  <div class="module-card">
                    <a-form layout="vertical">
                      <div class="module-header">
                        <span>Module {{ index + 1 }}</span>
                        <a-button
                          v-if="!disabled"
                          type="text"
                          class="delete-btn"
                          @click="removeModule(index)"
                        >
                          <template #icon>
                            <delete-outlined />
                          </template>
                        </a-button>
                      </div>
                      <a-form-item label="Icon">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleIcon }}</span>
                          <div class="emoji-input-wrapper">
                            <a-input
                              v-model:value="module.icon"
                              :disabled="disabled"
                              @change="handleChange"
                            />
                            <a-button
                              v-if="!disabled"
                              class="emoji-trigger"
                              @click="(e) => showEmojiPicker(e, index)"
                            >
                              😊
                            </a-button>
                          </div>
                        </div>
                      </a-form-item>
                      <a-form-item label="Title">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleTitle }}</span>
                          <a-input
                            v-model:value="module.title"
                            :disabled="disabled"
                            @change="handleChange"
                          />
                        </div>
                      </a-form-item>
                      <a-form-item label="Sub Title">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleSubTitle }}</span>
                          <a-input
                            v-model:value="module.subTitle"
                            :disabled="disabled"
                            @change="handleChange"
                          />
                        </div>
                      </a-form-item>
                      <a-form-item label="Content">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleContent }}</span>
                          <a-textarea 
                            v-model:value="module.content"
                            :disabled="disabled"
                            :rows="3"
                            @change="handleChange"
                            :style="{ minHeight: '120px' }"
                          />
                        </div>
                      </a-form-item>
                    </a-form>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <ProductBenefitsWithBlocksPreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>
    
    <!-- Emoji Picker Modal -->
    <a-modal
      v-model:visible="emojiPickerVisible[currentModuleIndex]"
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
import themeConfig from '../../../assets/config/themeConfig'
import ProductBenefitsWithBlocksPreview from './ProductBenefitsWithBlocksPreview.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

export default {
  name: 'ProductBenefitsWithFourBlocks',
  extends: BaseSection,
  components: {
    ProductBenefitsWithBlocksPreview,
    DeleteOutlined,
    EmojiPicker
  },
  emits: ['update'],
  computed: {
    tags() {
      return SECTION_TAGS.ProductBenefitsWithBlocks
    }
  },
  data() {
    return {
      localSection: {
        leftContent: {
          title: '',
          description: '',
          buttonText: '',
          buttonLink: ''
        },
        rightContent: [],
        ...JSON.parse(JSON.stringify(this.section))
      },
      styles: themeConfig.normal,
      currentModuleIndex: null,
      emojiPickerVisible: {}
    }
  },
  created() {
    if (this.section) {
      this.localSection = JSON.parse(JSON.stringify(this.section))
    }
  },
  watch: {
    section: {
      handler(newVal) {
        if (newVal) {
          this.localSection = JSON.parse(JSON.stringify(newVal))
        } else {
          this.localSection = {
            leftContent: {
              title: '',
              description: '',
              buttonText: '',
              buttonLink: ''
            },
            rightContent: []
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addModule() {
      if (!Array.isArray(this.localSection.rightContent)) {
        this.localSection.rightContent = []
      }
      
      this.localSection.rightContent.push({
        icon: '',
        title: '',
        subTitle: '',
        content: ''
      })
      this.handleChange()
    },
    removeModule(index) {
      this.localSection.rightContent.splice(index, 1)
      this.handleChange()
    },
    showEmojiPicker(e, index) {
      e.stopPropagation()
      this.currentModuleIndex = index
      this.emojiPickerVisible = {
        ...this.emojiPickerVisible,
        [index]: true
      }
    },
    
    closeEmojiPicker() {
      if (this.currentModuleIndex !== null) {
        this.emojiPickerVisible = {
          ...this.emojiPickerVisible,
          [this.currentModuleIndex]: false
        }
        this.currentModuleIndex = null
      }
    },
    
    onEmojiSelect(emoji) {
      if (this.currentModuleIndex !== null) {
        this.localSection.rightContent[this.currentModuleIndex].icon = emoji.i
        this.closeEmojiPicker()
        this.handleChange()
      }
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

/* 基本表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
}

.modules-grid {
  margin: 0;
}

/* 左侧内容卡片样式 */
.module-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  height: 100%;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  width: 100%;
}

.module-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 表单控件样式 */
:deep(.ant-input),
:deep(.ant-textarea) {
  border-radius: 6px;
  border-color: #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.ant-input:hover),
:deep(.ant-textarea:hover) {
  border-color: #1677ff;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.module-header span {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.add-module-btn {
  margin-bottom: 16px;
  height: 44px;
  font-size: 14px;
  width: fit-content;
  padding: 0 24px;
}

:deep(.ant-select-selector) {
  background: transparent !important;
  border-color: #e5e7eb !important;
}

:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: #1890ff !important;
}

@media (max-width: 1200px) {
  .module-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .modules-grid {
    margin: 0;
  }
  
  .module-card {
    padding: 16px;
  }
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

/* 复用 TitleSection 的样式 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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

/* ===== 预览区域样式 ===== */
.preview-area {
  background: #f8fafc;
  min-width: 768px;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 16px;
}

.preview-header span {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.preview-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  flex: 0 0 auto;
}

.module-header .delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.module-header .delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

.module-header :deep(.anticon) {
  font-size: 14px;
  color: inherit;
}

.emoji-input-wrapper {
  display: flex;
  gap: 8px;
  flex: 1;
}

.emoji-trigger {
  padding: 0 8px;
}

:deep(.emoji-picker-popover) .ant-popover-inner-content {
  padding: 0;
}

:deep(.v3-emoji-picker) {
  --ep-color-bg: #ffffff;
  --ep-color-border: #e4e7ea;
  --ep-color-hover: #f7f9fa;
}

.emoji-picker-popover :deep(.ant-popover-inner-content) {
  padding: 0;
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