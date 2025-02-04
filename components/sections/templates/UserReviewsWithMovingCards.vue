<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">User Reviews With Moving Cards</h2>
      </div>
      <div class="editor-content">
        <a-form layout="vertical">
          <a-form-item label="Section Title">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.title }}</span>
              <a-input
                v-model:value="localSection.title"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>

          <!-- 评论卡片列表 -->
          <div v-for="(review, index) in localSection.bottomContent" :key="index">
            <div class="review-card">
              <div class="review-card-header">
                <h3>Review Card #{{ index + 1 }}</h3>
                <a-button 
                  type="text" 
                  danger 
                  class="delete-button"
                  @click="removeReview(index)"
                  :disabled="disabled"
                >
                  <DeleteOutlined />
                </a-button>
              </div>

              <a-form-item label="Name">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.name }}</span>
                  <a-input
                    v-model:value="review.name"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Position">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.position }}</span>
                  <a-input
                    v-model:value="review.position"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.reviewTitle }}</span>
                  <a-input
                    v-model:value="review.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Content">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.content }}</span>
                  <a-textarea
                    v-model:value="review.content"
                    :disabled="disabled"
                    @change="handleChange"
                    :rows="3"
                    :style="{ minHeight: '120px' }"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Avatar URL">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.avatarUrl }}</span>
                  <div class="image-input-group">
                    <a-input
                      v-model:value="review.avatarUrl"
                      :disabled="disabled"
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

              <a-form-item label="Avatar Alt Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.avatarAlt }}</span>
                  <a-input
                    v-model:value="review.avatarAlt"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </div>
          </div>

          <a-button 
            type="dashed" 
            block 
            @click="addNewReview" 
            :disabled="disabled"
          >
            Add Review Card
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
        <UserReviewsWithMovingCardsPreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>
  </div>

  <!-- 在底部添加图片库模态框 -->
  <a-modal
    v-model:visible="imageLibraryVisible"
    title="Choose Avatar"
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
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import themeConfig from '../../../assets/config/themeConfig'
import UserReviewsWithMovingCardsPreview from './UserReviewsWithMovingCardsPreview.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import ImageLibrary from '../common/ImageLibrary.vue'

export default {
  name: 'UserReviewsWithMovingCards',
  extends: BaseSection,
  components: {
    UserReviewsWithMovingCardsPreview,
    DeleteOutlined,
    ImageLibrary
  },
  data() {
    return {
      localSection: {
        title: '',
        bottomContent: [],
        ...JSON.parse(JSON.stringify(this.section))
      },
      styles: themeConfig.normal,
      imageLibraryVisible: false,
      selectedImage: null,
      currentReviewIndex: null,
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.UserReviewsWithMovingCards
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addNewReview() {
      this.localSection.bottomContent.push({
        name: '',
        position: '',
        reviewTitle: '',
        content: '',
        avatarUrl: '',
        avatarAlt: ''
      })
      this.handleChange()
    },
    removeReview(index) {
      this.localSection.bottomContent.splice(index, 1)
      this.handleChange()
    },
    openImageLibrary(index) {
      this.currentReviewIndex = index
      this.imageLibraryVisible = true
    },
    closeImageLibrary() {
      this.imageLibraryVisible = false
      this.selectedImage = null
      this.currentReviewIndex = null
    },
    onImageSelect(image) {
      this.selectedImage = image
    },
    handleImageSelect() {
      if (this.selectedImage && this.currentReviewIndex !== null) {
        this.localSection.bottomContent[this.currentReviewIndex].avatarUrl = this.selectedImage.url
        this.handleChange()
      }
      this.closeImageLibrary()
    },
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  }
}
</script>

<style scoped>
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

.review-card {
  position: relative;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px;
  height: auto;
}

.review-card-header {
  margin-bottom: 16px;
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

:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

.image-input-group {
  display: flex;
  flex: 1;
  gap: 8px;
  width: 100%;
}

.image-input-group .ant-input {
  flex: 1;
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
</style>
