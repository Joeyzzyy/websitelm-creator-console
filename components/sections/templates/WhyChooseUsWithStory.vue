<template>
    <div class="section-wrapper">
      <!-- 编辑区域 -->
      <div class="editor-area">
        <!-- 顶部内容 -->
        <div class="top-content">
          <a-form layout="vertical">
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
    
            <a-form-item label="Description">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-input
                  v-model:value="localSection.description"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </a-form>
        </div>
    
        <div class="left-content">
          <a-form layout="vertical">
            <a-form-item label="AvatarUrl">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.avatarUrl }}</span>
                <div class="image-input-wrapper">
                  <a-input
                    v-model:value="localSection.leftContent.avatarUrl"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                  <a-button 
                    type="primary"
                    class="change-image-btn"
                    @click="openAvatarImageLibrary"
                  >
                    Change
                  </a-button>
                </div>
              </div>
            </a-form-item>
    
            <a-form-item label="Avatar Alt">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.avatarAlt }}</span>
                <a-input
                  v-model:value="localSection.leftContent.avatarAlt"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
    
            <a-form-item label="Name">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.name }}</span>
                <a-input
                  v-model:value="localSection.leftContent.name"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
    
            <a-form-item label="Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.founderTitle }}</span>
                <a-input
                  v-model:value="localSection.leftContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
    
            <a-form-item label="Introduction">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.introduction }}</span>
                <a-textarea
                  v-model:value="localSection.leftContent.introduction"
                  :disabled="disabled"
                  :rows="4"
                  @change="handleChange"
                  :style="{ minHeight: '120px' }"
                />
              </div>
            </a-form-item>
          </a-form>
        </div>
    
        <div class="right-content">
          <div class="content-header-with-button">
            <span>Story Sections</span>
            <a-button 
              v-if="!disabled"
              type="primary" 
              class="add-content-btn"
              @click="addContent"
            >
              Add Story Section
            </a-button>
          </div>
    
          <div 
            v-for="(content, index) in localSection.rightContent" 
            :key="index"
            class="content-item"
          >
            <a-form layout="vertical">
              <div class="content-header">
                <span>Story Section {{ index + 1 }}</span>
                <a-button 
                  v-if="!disabled"
                  type="text" 
                  class="delete-btn"
                  @click="removeContent(index)"
                >
                  <template #icon>
                    <delete-outlined />
                  </template>
                </a-button>
              </div>
    
              <a-form-item label="Content Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.contentTitle }}</span>
                  <a-input
                    v-model:value="content.contentTitle"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
    
              <a-form-item label="Content Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.contentText }}</span>
                  <a-textarea
                    v-model:value="content.contentText"
                    :disabled="disabled"
                    :rows="6"
                    @change="handleChange"
                    :style="{ minHeight: '120px' }"
                  />
                </div>
              </a-form-item>
            </a-form>
          </div>
        </div>
    
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
          <WhyChooseUsWithStoryPreview 
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
  import WhyChooseUsWithStoryPreview from './WhyChooseUsWithStoryPreview.vue'
  import themeConfig from '../../../assets/config/themeConfig'
  import { DeleteOutlined } from '@ant-design/icons-vue'
  
  export default {
    name: 'WhyChooseUsWithStory',
    extends: BaseSection,
    components: {
      ImageLibrary,
      WhyChooseUsWithStoryPreview,
      DeleteOutlined
    },
    computed: {
      tags() {
        return SECTION_TAGS.WhyChooseUsWithStory
      }
    },
    data() {
      return {
        localSection: {
          title: '',
          description: '',
          leftContent: {
            avatarUrl: '',
            avatarAlt: '',
            name: '',
            title: '',
            introduction: ''
          },
          rightContent: []
        },
        imageLibraryVisible: false,
        selectedImage: null,
        isAvatarSelection: false,
        styles: themeConfig.normal
      }
    },
    created() {
      this.localSection = Object.assign({
        title: '',
        description: '',
        leftContent: {
        avatarUrl: '',
        avatarAlt: '',
        name: '',
        title: '',
        introduction: ''
        },
        rightContent: []
    }, JSON.parse(JSON.stringify(this.section)))
  
      if (!Array.isArray(this.localSection.rightContent)) {
        this.localSection.rightContent = []
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
        if (this.selectedImage) {
          if (this.isAvatarSelection) {
            this.localSection.leftContent.avatarUrl = this.selectedImage.url
          }
          this.handleChange()
        }
        this.closeImageLibrary()
      },
      addContent() {
        this.localSection.rightContent.push({
          contentTitle: '',
          contentText: ''
        })
        this.handleChange()
      },
      removeContent(index) {
        this.localSection.rightContent.splice(index, 1)
        this.handleChange()
      },
      openAvatarImageLibrary() {
        this.isAvatarSelection = true
        this.imageLibraryVisible = true
      },
      closeImageLibrary() {
        this.imageLibraryVisible = false
        this.selectedImage = null
        this.isAvatarSelection = false
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
    min-height: 500px;
  }
  
  .editor-area {
    border-radius: 8px;
    padding: 24px;
    height: 800px;
    overflow-y: auto;
  }
  
  .preview-area {
    background: #f8fafc;
    min-width: 768px;
    overflow-y: auto;
    height: 800px;
    border-radius: 8px;
    padding: 24px;
  }
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    color: #64748b;
    font-weight: 500;
  }
  
  .preview-content {
    height: calc(100% - 40px);
    overflow-y: auto;
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
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .delete-btn {
    padding: 4px 8px;
    height: auto;
    font-size: 14px;
  }
  
  .content-item {
    position: relative;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .content-header .delete-btn {
    color: #ff4d4f !important;
    transition: all 0.3s;
    padding: 4px;
    height: 24px;
    width: 24px;
    line-height: 1;
  }
  
  .content-header .delete-btn:hover {
    color: #ff7875 !important;
    background: rgba(255, 77, 79, 0.1);
  }
  
  .content-header :deep(.anticon) {
    font-size: 14px;
    color: inherit;
  }
  
  .content-header-with-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  </style>