<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Why Choose Us With Blocks</h2>
      </div>
      <div class="editor-content">
        <!-- 顶部内容 -->
        <div class="top-content">
          <a-form layout="vertical">

            <a-form-item label="Icon">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.emoji }}</span>
                <div class="emoji-input-wrapper">
                  <a-input
                    v-model:value="localSection.topContent.icon"
                    :disabled="disabled"
                    placeholder="Emoji"
                    @change="handleChange"
                  />
                  <a-button
                    v-if="!disabled"
                    class="emoji-trigger"
                    @click="(e) => showEmojiPicker(e)"
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
                  v-model:value="localSection.topContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
    
            <a-form-item label="Description">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-input
                  v-model:value="localSection.topContent.description"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </a-form>
        </div>
    
        <!-- 底部两个模块 -->
        <div class="bottom-content">
          <a-button 
            v-if="!disabled"
            type="primary" 
            class="add-module-btn"
            @click="addModule"
          >
            Add Module
          </a-button>

          <a-row :gutter="24">
            <a-col 
              v-for="(module, index) in localSection.bottomContent" 
              :key="index"
              :span="24"
            >
              <div class="module-card">
                <div class="module-header">
                  <span>Module {{ index + 1 }}</span>
                  <a-button 
                    v-if="!disabled"
                    type="text"
                    danger
                    class="delete-btn"
                    @click="removeModule(index)"
                  >
                    <DeleteOutlined />
                  </a-button>
                </div>
                <a-form layout="vertical">
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
      
                  <a-form-item label="Button Text">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.buttonText }}</span>
                      <a-input
                        v-model:value="module.buttonText"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>

                  <a-form-item label="Button Link">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.buttonLink }}</span>
                      <a-input
                        v-model:value="module.buttonLink"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>
      
                  <a-form-item label="Image">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.image }}</span>
                      <div class="image-input-wrapper">
                        <a-input
                          v-model:value="module.imageUrl"
                          :disabled="disabled"
                          placeholder="Image URL"
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
      
                  <a-form-item label="Image Alt">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.imageAlt }}</span>
                      <a-input
                        v-model:value="module.imageAlt"
                        :disabled="disabled"
                        placeholder="Image alt text"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>

                  <div class="image-preview" v-if="module.imageUrl">
                    <a-image :src="module.imageUrl" :width="200" />
                  </div>
                </a-form>
              </div>
            </a-col>
          </a-row>
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
    </div>

    <!-- 添加预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <WhyChooseUsWithBlocksPreview 
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
import WhyChooseUsWithBlocksPreview from './WhyChooseUsWithBlocksPreview.vue'
import themeConfig from '../../../assets/config/themeConfig'
import { DeleteOutlined } from '@ant-design/icons-vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

export default {
  name: 'WhyChooseUsWithTwoHugeBlocks',
  extends: BaseSection,
  components: {
    DeleteOutlined,
    ImageLibrary,
    WhyChooseUsWithBlocksPreview,
    EmojiPicker
  },
  computed: {
    tags() {
      return SECTION_TAGS.WhyChooseUsWithBlocks
    }
  },
  data() {
    return {
      localSection: {
        topContent: {
          icon: '',
          title: '',
          description: ''
        },
        bottomContent: []
      },
      imageLibraryVisible: false,
      selectedImage: null,
      currentModuleIndex: null,
      styles: themeConfig.normal,
      emojiPickerVisible: false
    }
  },
  created() {
    this.localSection = Object.assign({
      topContent: {
        title: '',
        subTitle: ''
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
        this.localSection = Object.assign({
          topContent: {
            title: '',
            subTitle: ''
          },
          bottomContent: []
        }, JSON.parse(JSON.stringify(newVal)))
        
        if (!Array.isArray(this.localSection.bottomContent)) {
          this.localSection.bottomContent = []
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
      this.localSection.bottomContent.push({
        title: '',
        content: '',
        buttonText: '',
        buttonLink: '',
        imageUrl: '',
        imageAlt: ''
      })
      this.handleChange()
    },
    removeModule(index) {
      this.localSection.bottomContent.splice(index, 1)
      this.handleChange()
    },
    openImageLibrary(index) {
      this.currentModuleIndex = index
      this.imageLibraryVisible = true
    },
    closeImageLibrary() {
      this.imageLibraryVisible = false
      this.selectedImage = null
      this.currentModuleIndex = null
    },
    onImageSelect(image) {
      this.selectedImage = image
    },
    handleImageSelect() {
      if (this.selectedImage && this.currentModuleIndex !== null) {
        this.localSection.bottomContent[this.currentModuleIndex].imageUrl = this.selectedImage.url
        this.handleChange()
      }
      this.closeImageLibrary()
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
    }
  }
}
</script>
  
<style scoped>
@import '../../../assets/styles/section-form.css';

.section-wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  align-items: start;
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
  height: fit-content;
  border-radius: 8px;
  padding: 24px;
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
}

.bottom-content {
  margin-top: 32px;
}

:deep(.ant-row) {
  margin-bottom: 24px;
}

.image-preview {
  margin-top: 12px;
  padding: 16px;
  background: #f8fafc;
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

.module-card {
  margin-bottom: 24px;
}

.add-module-btn {
  margin-bottom: 24px;
}

.module-header {
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