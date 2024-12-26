<template>
    <div class="section-wrapper">
      <!-- 编辑区域 -->
      <div class="editor-area">
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
              <a-textarea
                v-model:value="localSection.description"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>
  
          <a-form-item label="Button Text">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.buttonText }}</span>
              <a-input
                v-model:value="localSection.buttonText"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>
  
          <!-- 标签页内容编辑 -->
          <div class="tabs-editor">
            <div class="tabs-header">
              <h3>Tabs Content</h3>
              <a-button type="primary" @click="addTab" :disabled="disabled">
                Add Tab
              </a-button>
            </div>
            
            <div v-for="(tab, index) in localSection.bottomContent" :key="index" class="tab-item">
              <div class="tab-header">
                <h4>Tab {{ index + 1 }}</h4>
                <a-button 
                  type="text" 
                  shape="circle"
                  :disabled="disabled"
                  @click="removeTab(index)"
                >
                  <template #icon>
                    <delete-outlined />
                  </template>
                </a-button>
              </div>
  
              <a-form-item label="Tab Name">
                <a-input
                  v-model:value="tab.tabName"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </a-form-item>
  
              <a-form-item label="Title">
                <a-input
                  v-model:value="tab.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </a-form-item>
  
              <a-form-item label="Description">
                <a-textarea
                  v-model:value="tab.description"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </a-form-item>
  
              <a-form-item label="Image URL">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.imageUrl }}</span>
                  <div class="image-input-wrapper">
                    <a-input
                      v-model:value="tab.imageUrl"
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
  
              <a-form-item label="Image Alt">
                <a-input
                  v-model:value="tab.imageAlt"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
  
      <!-- 预览区域 -->
      <div class="preview-area">
        <div class="preview-header">
          <span>Preview</span>
        </div>
        
        <div class="preview-content">
          <FeaturesTabbedPreview 
            :section="localSection"
            :styles="styles"
          />
        </div>
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
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  import themeConfig from '../../../assets/config/themeConfig'
  import FeaturesTabbedPreview from './FeaturesTabbedPreview.vue'
  import ImageLibrary from '../common/ImageLibrary.vue'
  import { DeleteOutlined } from '@ant-design/icons-vue'
  
  export default {
    name: 'FeaturesTabbed',
    extends: BaseSection,
    components: {
      FeaturesTabbedPreview,
      ImageLibrary,
      DeleteOutlined
    },
    data() {
      return {
        localSection: {
          title: '',
          description: '',
          buttonText: '',
          bottomContent: [],
          ...JSON.parse(JSON.stringify(this.section))
        },
        styles: themeConfig.normal,
        imageLibraryVisible: false,
        selectedImage: null,
        currentTabIndex: null,
      }
    },
    computed: {
      tags() {
        return SECTION_TAGS.FeaturesTabbed
      },
      isChineseTitle() {
        return /[\u4e00-\u9fa5]/.test(this.localSection?.title || '')
      },
      titleClasses() {
        const { fontSize, fontWeight, color } = this.styles.typography.h1
        console.log('Title classes:', { fontSize, fontWeight, color })
        return [fontSize, fontWeight, color]
      }
    },
    created() {
      
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
      addTab() {
        this.localSection.bottomContent.push({
          tabName: `Tab ${this.localSection.bottomContent.length + 1}`,
          title: '',
          description: '',
          imageUrl: '',
          imageAlt: ''
        })
        this.handleChange()
      },
      removeTab(index) {
        this.localSection.bottomContent.splice(index, 1)
        this.handleChange()
      },
      openImageLibrary(index) {
        this.currentTabIndex = index
        this.imageLibraryVisible = true
      },
      closeImageLibrary() {
        this.imageLibraryVisible = false
        this.selectedImage = null
        this.currentTabIndex = null
      },
      onImageSelect(image) {
        this.selectedImage = image
      },
      handleImageSelect() {
        if (this.selectedImage && this.currentTabIndex !== null) {
          this.localSection.bottomContent[this.currentTabIndex].imageUrl = this.selectedImage.url
          this.handleChange()
        }
        this.closeImageLibrary()
      }
    },
    mounted() {
      console.log('Complete styles config:', this.styles)
      console.log('Typography styles:', this.styles.typography.h1)
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
    height: 100%;
  }
  
  /* 编辑区域和预览区域的共同样式 */
  .editor-area,
  .preview-area {
    border-radius: 8px;
    padding: 24px;
  }
  
  /* ===== 表单编辑区域样式 ===== */
  .editor-area {
    background: white;
    max-height: 600px;
    overflow-y: auto;
  }
  
  /* 表单输入框样式 */
  .input-with-tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  /* HTML标签样式 */
  .html-tag {
    padding: 2px 8px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    color: #0050b3;
    font-size: 12px;
    font-family: monospace;
  }
  
  /* Ant Design 表单项自定义样式 */
  :deep(.ant-form-item) {
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  /* ===== 预览区域样式 ===== */
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
    flex: 1;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 添加新的样式 */
  .tabs-editor {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
  }
  
  .tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .tab-item {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
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
  
  :deep(.anticon) {
    color: #ff4d4f;
  }
  
  :deep(.ant-btn-text:hover .anticon) {
    color: #ff7875;
  }
  </style>