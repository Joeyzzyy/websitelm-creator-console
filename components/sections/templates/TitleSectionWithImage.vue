<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-content">
        <a-form layout="vertical" class="title-section-form">
          <!-- 主要内容区域分为两列 -->
          <div class="form-grid">
            <!-- 左列：标题相关信息 -->
            <div class="form-column">
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

              <!-- 作者和发布日期 -->
              <div class="metadata-group">
                <a-form-item label="Author">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.author }}</span>
                    <a-input
                      v-model:value="localSection.leftContent.author"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
                
                <a-form-item label="Publish Date">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.publishDate }}</span>
                    <a-date-picker
                      v-model:value="localSection.leftContent.publishDate"
                      :disabled="disabled"
                      @change="handleChange"
                      format="YYYY-MM-DD"
                      :allow-clear="false"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </div>
                </a-form-item>
              </div>
            </div>

            <!-- 右列：图片相关信息 -->
            <div class="form-column">
              <a-form-item label="Image">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.image }}</span>
                  <div class="image-input-wrapper">
                    <a-input
                      v-model:value="localSection.rightContent.imageUrl"
                      :disabled="disabled"
                      placeholder="Image URL"
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
                <div class="input-with-tag mt-3">
                  <span class="html-tag">{{ tags.imageAlt }}</span>
                  <a-input
                    v-model:value="localSection.rightContent.imageAlt"
                    :disabled="disabled"
                    placeholder="Please enter image alt text"
                    @change="handleChange"
                  />
                </div>
                <div class="image-preview" v-if="localSection.rightContent.imageUrl">
                  <img 
                    :src="localSection.rightContent.imageUrl" 
                    :alt="localSection.rightContent.imageAlt" 
                    class="preview-image"
                  />
                </div>
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>

      <!-- 图片库模态框 -->
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

    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <TitleSectionWithImagePreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import ImageLibrary from '../common/ImageLibrary.vue'
import themeConfig from '../../../assets/config/themeConfig'
import TitleSectionWithImagePreview from './TitleSectionWithImagePreview.vue'

export default {
  name: 'TitleSectionWithImage',
  extends: BaseSection,
  components: {
    ImageLibrary,
    TitleSectionWithImagePreview
  },
  computed: {
    tags() {
      return SECTION_TAGS.TitleSectionWithImage
    },
    styles() {
      return themeConfig['normal']
    },
    isChineseTitle() {
      return /[\u4e00-\u9fa5]/.test(this.localSection.title)
    },
    imageContainerStyle() {
      return `preview-image-container ${this.styles.card.variants.primary}`
    }
  },
  data() {
    return {
      localSection: {
        title: '',
        subTitle: '',
        leftContent: {
          author: '',
          publishDate: ''
        },
        rightContent: {
          imageUrl: '',
          imageAlt: ''
        },
        ...JSON.parse(JSON.stringify(this.section))
      },
      imageLibraryVisible: false,
      selectedImage: null
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
  created() {
    // 设置默认发布日期
    if (this.localSection.leftContent.publishDate === "") {
      this.localSection.leftContent.publishDate = new Date().toISOString().split('T')[0];
    }
    
    // 如果作者为空，从 localStorage 获取当前用户名
    if (!this.localSection.leftContent.author) {
      try {
        const currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
        if (currentCustomer?.userName) {
          this.localSection.leftContent.author = currentCustomer.userName;
          // 触发更新
          this.$nextTick(() => {
            this.handleChange();
          });
        }
      } catch (error) {
        console.error('Error getting author name:', error);
      }
    }
  },
  methods: {
    handleChange() {
      if (this.localSection.leftContent.publishDate === "") {
        this.localSection.leftContent.publishDate = new Date().toISOString().split('T')[0]
      }
      this.emitUpdate(this.localSection)
    },
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
        this.localSection.rightContent.imageUrl = this.selectedImage.url
        this.handleChange()
      }
      this.closeImageLibrary()
    }
  }
}
</script>

<style scoped>
.input-with-tag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.html-tag {
  background-color: var(--tag-bg-color, #e6f4ff);
  color: var(--tag-text-color, #1677ff);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  white-space: nowrap;
}

.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 500px;
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

.image-preview {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
}

.preview-image {
  max-width: 300px;  /* 限制最大宽度 */
  max-height: 200px; /* 限制最大高度 */
  width: auto;
  height: auto;
  object-fit: contain;
}

.preview-area {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
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
  flex: 1;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

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