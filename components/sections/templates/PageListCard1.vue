<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Page List Card</h2>
      </div>
      <div class="editor-content">
        <a-form layout="vertical">
          <!-- 添加区域的标题和副标题 -->
          <a-form-item label="Title">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.title }}</span>
              <a-input
                v-model:value="localSection.title"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>

          <a-form-item label="Subtitle">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.subTitle }}</span>
              <a-input
                v-model:value="localSection.subTitle"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>

          <div class="divider" style="margin: 24px 0;"></div>

          <!-- 卡片列表编辑 -->
          <div v-for="(insight, index) in localSection.bottomContent" :key="index" class="card-item">
            <div class="card-header">
              <h3>Card {{ index + 1 }}</h3>
              <a-button 
                type="text" 
                danger 
                @click="removeCard(index)"
                :disabled="disabled"
              >
                <delete-outlined />
              </a-button>
            </div>

            <a-form-item label="Image URL">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.imageUrl }}</span>
                <div class="image-input-wrapper">
                  <a-input
                    v-model:value="insight.imageUrl"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                  <a-button 
                    type="primary"
                    class="change-image-btn"
                    @click="openImageLibrary(index)"
                    :disabled="disabled"
                  >
                    Change
                  </a-button>
                </div>
              </div>
            </a-form-item>

            <a-form-item label="Image Alt">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.imageAlt }}</span>
                <a-input
                  v-model:value="insight.imageAlt"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Tag">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.tag }}</span>
                <a-input
                  v-model:value="insight.tag"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.cardTitle }}</span>
                <a-input
                  v-model:value="insight.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Target URL">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.targetUrl }}</span>
                <a-input
                  v-model:value="insight.targetUrl"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </div>

          <a-button 
            type="dashed" 
            block 
            @click="addCard" 
            :disabled="disabled"
            class="add-card-btn"
          >
            <plus-outlined />
            Add Card
          </a-button>
        </a-form>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <PageListCardPreview 
          :section="localSection"
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
import PageListCardPreview from './PageListCardPreview.vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import ImageLibrary from '../common/ImageLibrary.vue'

export default {
  name: 'PageListCard',
  extends: BaseSection,
  components: {
    PageListCardPreview,
    DeleteOutlined,
    PlusOutlined,
    ImageLibrary
  },
  data() {
    return {
      localSection: {
        title: '',
        subTitle: '',
        bottomContent: [],
        ...JSON.parse(JSON.stringify(this.section))
      },
      imageLibraryVisible: false,
      selectedImage: null,
      currentEditingIndex: null
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.PageListCard
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
        imageUrl: '',
        imageAlt: '',
        tag: '',
        title: '',
        targetUrl: ''
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
      this.currentEditingIndex = null
    },

    onImageSelect(image) {
      this.selectedImage = image
    },

    handleImageSelect() {
      if (this.selectedImage && this.currentEditingIndex !== null) {
        // 更新对应卡片的图片URL
        this.localSection.bottomContent[this.currentEditingIndex].imageUrl = this.selectedImage.url
        // 触发更新
        this.handleChange()
      }
      this.closeImageLibrary()
    }
  }
}
</script>

<style scoped>
/* 继承 TitleSection 的基础样式 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 500px;
}

.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
}

.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  max-height: 800px;
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
  max-height: calc(800px - 90px);
}

/* 卡片编辑特定样式 */
.card-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.input-with-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
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

.add-card-btn {
  margin-top: 16px;
}

.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

/* 新增样式 */
.image-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.change-image-btn {
  flex-shrink: 0;
}
</style>
