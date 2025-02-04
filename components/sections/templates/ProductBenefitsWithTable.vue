<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Product Benefits With Table</h2>
      </div>
      <div class="editor-content">
        <a-row :gutter="24">
          <!-- 左侧表格内容 -->
          <a-col :span="12">
            <div style="margin-bottom: 12px; color: #666;">
              Table Content Area - Maximum 4 items allowed
            </div>
            <div v-for="(item, index) in localSection.leftContent" :key="index">
              <a-form layout="vertical">
                <a-form-item>
                  <div class="flex justify-between items-center mb-2">
                    <span>Item {{ index + 1 }}</span>
                    <a-button 
                      v-if="!disabled" 
                      type="text" 
                      class="delete-btn" 
                      @click="removeLeftItem(index)"
                    >
                      <template #icon>
                        <delete-outlined />
                      </template>
                    </a-button>
                  </div>
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.icon }}</span>
                    <div class="emoji-input-wrapper">
                      <a-input
                        v-model:value="item.icon"
                        :disabled="disabled"
                        placeholder="Icon"
                        @change="handleChange"
                      />
                      <a-button
                        v-if="!disabled"
                        class="emoji-trigger"
                        @click="(e) => showEmojiPicker(e, index, 'left')"
                      >
                        😊
                      </a-button>
                    </div>
                  </div>
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.contentTitle }}</span>
                    <a-input
                      v-model:value="item.contentTitle"
                      :disabled="disabled"
                      placeholder="Title"
                      @change="handleChange"
                    />
                  </div>
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.content }}</span>
                    <a-textarea
                      v-model:value="item.content"
                      :disabled="disabled"
                      :rows="3"
                      placeholder="Content"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
              </a-form>
            </div>
            
            <a-button 
              v-if="!disabled && localSection.leftContent.length < 4" 
              type="dashed" 
              block 
              class="add-item-btn"
              @click="addLeftItem"
            >
              Add Item
            </a-button>
          </a-col>
    
          <!-- 右侧标题内容 -->
          <a-col :span="12">
            <a-form layout="vertical">
              <a-form-item label="Icon">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.icon }}</span>
                  <div class="emoji-input-wrapper">
                    <a-input
                      v-model:value="localSection.rightContent.icon"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                    <a-button
                      v-if="!disabled"
                      class="emoji-trigger"
                      @click="(e) => showEmojiPicker(e, 0, 'right')"
                    >
                      😊
                    </a-button>
                  </div>
                </div>
              </a-form-item>
    
              <a-form-item label="Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.title }}</span>
                  <a-input
                    v-model:value="localSection.rightContent.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
    
              <a-form-item label="Subtitle">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.subTitle }}</span>
                  <a-input
                    v-model:value="localSection.rightContent.subTitle"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
    
              <a-form-item label="Button Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonText }}</span>
                  <a-input
                    v-model:value="localSection.rightContent.buttonText"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
    
              <a-form-item label="Button Link">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonLink }}</span>
                  <a-input
                    v-model:value="localSection.rightContent.buttonLink"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </a-form>
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
        <ProductBenefitsWithTablePreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>

    <!-- Emoji Picker Modal -->
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
import themeConfig from '../../../assets/config/themeConfig'
import ProductBenefitsWithTablePreview from './ProductBenefitsWithTablePreview.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

export default {
  name: 'ProductBenefitsWithTable',
  extends: BaseSection,
  components: {
    ProductBenefitsWithTablePreview,
    DeleteOutlined,
    EmojiPicker
  },
  computed: {
    tags() {
      return SECTION_TAGS.ProductBenefitsWithTable
    },
    getButtonStyle() {
      return `${this.styles.button.base} ${this.styles.button.variants.secondary}`
    },
    getButtonLink() {
      const link = this.localSection.rightContent.buttonLink
      return link?.startsWith('http') ? link : `https://${link}`
    }
  },
  data() {
    return {
      localSection: {
        leftContent: [],
        rightContent: {
          icon: '',
          title: '',
          subTitle: '',
          buttonText: '',
          buttonLink: ''
        },
        ...JSON.parse(JSON.stringify(this.section || {}))
      },
      styles: themeConfig.normal,
      emojiPickerVisible: false,
      currentTarget: {
        index: null,
        side: null // 'left' 或 'right'
      }
    }
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.emitUpdate(this.localSection)
      })
    },
    addLeftItem() {
      if (!Array.isArray(this.localSection.leftContent)) {
        this.localSection.leftContent = []
      }
      if (this.localSection.leftContent.length < 4) {
        this.localSection.leftContent.push({
          icon: '',
          contentTitle: '',
          content: ''
        })
        this.handleChange()
      }
    },
    removeLeftItem(index) {
      this.localSection.leftContent.splice(index, 1)
      this.handleChange()
    },
    showEmojiPicker(e, index, side) {
      e.stopPropagation()
      this.currentTarget = { index, side }
      this.emojiPickerVisible = true
    },
    closeEmojiPicker() {
      this.emojiPickerVisible = false
      this.currentTarget = { index: null, side: null }
    },
    onEmojiSelect(emoji) {
      const { index, side } = this.currentTarget
      if (side === 'left') {
        this.localSection.leftContent[index].icon = emoji.i
      } else if (side === 'right') {
        this.localSection.rightContent.icon = emoji.i
      }
      this.closeEmojiPicker()
      this.handleChange()
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

/* 基础表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

/* 左侧内容卡片样式 */
.left-content-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header span {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

/* HTML 标签样式 */
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

/* 输入框组合样式 */
.input-with-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.input-with-tag:last-child {
  margin-bottom: 0;
}

/* 添加按钮样式 */
.add-item-btn {
  margin-bottom: 24px;
  height: 44px;
  font-size: 14px;
}

/* 右侧内容区域样式 */
.right-content {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
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

/* 删除按钮样式 */
:deep(.ant-btn-link) {
  color: #ef4444;
  padding: 4px 8px;
  height: auto;
}

:deep(.ant-btn-link:hover) {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

/* 整体容器样式 */
.section-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
}

/* 添加新的样式 */
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

.preview-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  flex: 0 0 auto;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.flex-container {
  display: flex;
  gap: 48px;
}

.left-side, .right-side {
  flex: 1;
}

.benefits-grid {
  display: grid;
  gap: 16px;
}

.benefit-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
}

.icon {
  font-size: 24px;
}

.main-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtitle {
  margin: 16px 0 24px;
}

.action-button {
  display: inline-block;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
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

/* 为每个 item 容器添加间距 */
.left-content > div {
  margin-bottom: 24px;
}

/* 最后一个 item 不需要底部间距 */
.left-content > div:last-child {
  margin-bottom: 0;
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