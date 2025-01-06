<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Key Results With Cards</h2>
      </div>
      <div class="editor-content">
        <a-form layout="vertical">
          <div v-for="(item, index) in localSection.bottomContent" :key="index">
            <a-form-item>
              <div class="card-header">
                <span>Card {{ index + 1 }}</span>
                <a-button 
                  v-if="!disabled"
                  type="text"
                  danger
                  class="delete-btn"
                  @click="removeCard(index)"
                >
                  <DeleteOutlined />
                </a-button>
              </div>
              <a-form-item label="Logo">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.logo }}</span>
                  <div class="image-input-wrapper">
                    <a-input
                      v-model:value="item.competitorLogo"
                      :disabled="disabled"
                      placeholder="Image path"
                      @change="handleChange"
                    />
                    <a-button 
                      type="primary"
                      class="change-image-btn"
                      @click="openImageLibrary(index)"
                    >
                      Change
                    </a-button>
                  </div>
                </div>
              </a-form-item>

              <a-form-item label="Name">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.competitorName }}</span>
                  <a-input
                    v-model:value="item.competitorName"
                    :disabled="disabled"
                    placeholder="Competitor category name"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Percentage">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.percentage }}</span>
                  <a-input
                    v-model:value="item.percentage"
                    :disabled="disabled"
                    placeholder="Improvement percentage"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Metric">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.metric }}</span>
                  <a-input
                    v-model:value="item.metric"
                    :disabled="disabled"
                    placeholder="Measurement category"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Description">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.description }}</span>
                  <a-textarea
                    v-model:value="item.description"
                    :disabled="disabled"
                    :rows="4"
                    placeholder="Detailed comparison explanation"
                    @change="handleChange"
                    :style="{ minHeight: '120px' }"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Button">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonText }}</span>
                  <a-input
                    v-model:value="item.buttonText"
                    :disabled="disabled"
                    placeholder="Button text (e.g. Read Case Study)"
                    @change="handleChange"
                  />
                </div>
                <div class="input-with-tag mt-2">
                  <span class="html-tag">{{ tags.buttonLink }}</span>
                  <a-input
                    v-model:value="item.buttonLink"
                    :disabled="disabled"
                    placeholder="Button link URL"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </a-form-item>
          </div>
        </a-form>

        <a-button 
          v-if="!disabled"
          type="primary" 
          class="add-card-btn"
          @click="addCard"
        >
          Add Card
        </a-button>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      <div class="preview-content">
        <KeyResultsWithCardsPreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>

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
import KeyResultsWithCardsPreview from './KeyResultsWithCardsPreview.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import ImageLibrary from '../common/ImageLibrary.vue'

export default {
  name: 'KeyResultsWithCards',
  extends: BaseSection,
  components: {
    KeyResultsWithCardsPreview,
    DeleteOutlined,
    ImageLibrary
  },
  computed: {
    tags() {
      return SECTION_TAGS.KeyResultsWithCards
    }
  },
  data() {
    return {
      localSection: JSON.parse(JSON.stringify(this.section)),
      styles: themeConfig.normal,
      imageLibraryVisible: false,
      selectedImage: null,
      currentEditingIndex: -1
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
      this.emitUpdate(this.localSection)
    },
    addCard() {
      this.localSection.bottomContent.push({
        competitorLogo: '',
        competitorName: '',
        percentage: '',
        metric: '',
        description: '',
        buttonText: '',
        buttonLink: ''
      })
      this.handleChange()
    },
    removeCard(index) {
      this.localSection.bottomContent.splice(index, 1)
      this.handleChange()
    },
    openImageLibrary(index) {
      this.currentEditingIndex = index
      this.imageLibraryVisible = true
    },
    closeImageLibrary() {
      this.imageLibraryVisible = false
      this.selectedImage = null
      this.currentEditingIndex = -1
    },
    onImageSelect(image) {
      this.selectedImage = image
    },
    handleImageSelect() {
      if (this.selectedImage && this.currentEditingIndex > -1) {
        this.localSection.bottomContent[this.currentEditingIndex].competitorLogo = this.selectedImage.url
        this.handleChange()
      }
      this.closeImageLibrary()
    }
  }
}
</script>

<style scoped>
/* 基础布局 - 整体页面结构 */
.section-wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  min-height: 500px;
}

/* 编辑区域和预览区域的共同样式 */
.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
}

/* 编辑区域样式 */
.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
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
  max-height: 1000px;
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
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  min-height: 400px;
}

/* 保留原有的其他样式 */
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
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
  color: #374151;
}

.mt-2 {
  margin-top: 8px;
}

/* 调整内部表单项的间距 */
:deep(.ant-form-item .ant-form-item) {
  background: transparent;
  padding: 8px 0;
  margin-bottom: 8px;
}

/* 调整卡片之间的间距 */
.ant-form > div:not(:last-child) {
  margin-bottom: 32px;  /* 卡片之间添加32px的间距 */
  padding-bottom: 16px; /* 底部内边距 */
  border-bottom: 1px solid #f0f0f0; /* 添加分隔线使视觉效果更清晰 */
}

.add-card-btn {
  margin-top: 16px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.delete-btn {
  padding: 4px 8px;
  height: auto;
  color: #ff4d4f;
}

.delete-btn:hover {
  color: #ff7875;
  background-color: #fff1f0;
}

.card-header .delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.card-header .delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

.card-header :deep(.anticon) {
  font-size: 14px;
  color: inherit;
}

.image-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.change-image-btn {
  background: linear-gradient(135deg, #468be5, #3a9ced);
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
  background: linear-gradient(135deg, #3883ca, #2875d9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}
</style> 