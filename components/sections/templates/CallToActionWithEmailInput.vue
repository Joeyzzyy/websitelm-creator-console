<template>
    <div class="section-wrapper">
      <div class="editor-area">
        <div class="editor-content">
          <a-form layout="vertical">
            <!-- 基本设置 -->
            <div class="content-section">
              <h3 class="section-title">Basic Settings</h3>
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
              
              <a-form-item label="Input Placeholder">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.inputPlaceholder }}</span>
                  <a-input
                    v-model:value="localSection.bottomContent.inputPlaceholder"
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

              <a-form-item label="Small Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.smallText }}</span>
                  <a-input
                    v-model:value="localSection.bottomContent.smallText"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </div>
          </a-form>
        </div>
      </div>
  
      <!-- 预览区域 -->
      <div class="preview-area">
        <div class="preview-header">
          <span>Preview</span>
        </div>
        
        <div class="preview-content">
          <CallToActionWithEmailInputPreview 
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
  import themeConfig from '../../../assets/config/themeConfig'
  import CallToActionWithEmailInputPreview from './CallToActionWithEmailInputPreview.vue'
  
  export default {
    name: 'CallToActionWithEmailInput',
    extends: BaseSection,
    components: {
      CallToActionWithEmailInputPreview
    },
    data() {
      return {
        localSection: {
          title: '',
          bottomContent: {
            inputPlaceholder: '',
          },
          buttonText: '',
          ...JSON.parse(JSON.stringify(this.section))
        },
        styles: themeConfig.normal
      }
    },
    computed: {
      tags() {
        return SECTION_TAGS.CallToActionWithEmailInput
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
  
  .content-section {
    margin-bottom: 32px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1f2937;
  }
  </style>