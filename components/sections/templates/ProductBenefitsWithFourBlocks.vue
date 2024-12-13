<template>
    <div class="section-container">
      <a-row :gutter="24">
        <!-- 左侧标题内容 -->
        <a-col :span="6">
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
  
            <a-form-item label="Subtitle">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-textarea
                  v-model:value="localSection.leftContent.description"
                  :disabled="disabled"
                  :rows="3"
                  @change="handleChange"
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
          </a-form>
        </a-col>
  
        <!-- 右侧四个色块 -->
        <a-col :span="18">
          <div class="modules-grid">
            <a-row :gutter="[16, 16]">
              <a-col 
                v-for="(module, index) in localSection.rightContent" 
                :key="index"
                :span="12"
              >
                <div class="module-card" :class="module.color">
                  <a-form layout="vertical">
                    <div class="module-header">
                      <span>Module {{ index + 1 }}</span>
                    </div>
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
                        />
                      </div>
                    </a-form-item>
                  </a-form>
                </div>
              </a-col>
            </a-row>
          </div>
  
          <a-button 
            v-if="!disabled && localSection.rightContent.length < 4" 
            type="dashed" 
            block 
            class="add-module-btn"
            @click="addModule"
          >
            Add Module
          </a-button>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'ProductBenefitsWithFourBlocks',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.ProductBenefitsWithFourBlocks
      }
    },
    data() {
      return {
        localSection: JSON.parse(JSON.stringify(this.section))
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
      addModule() {
        if (this.localSection.rightContent.length < 4) {
          this.localSection.rightContent.push({
            color: 'bg-green-50',
            title: '',
            content: ''
          })
          this.handleChange()
        }
      },
      removeModule(index) {
        this.localSection.rightContent.splice(index, 1)
        this.handleChange()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';
  
  .modules-grid {
    margin: 0 -12px;
  }
  
  .module-card {
    padding: 24px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    height: 100%;
    transition: all 0.3s ease;
    margin-bottom: 24px;
  }
  
  .module-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  
  :deep(.ant-form-item) {
    margin-bottom: 20px;
  }
  
  :deep(.ant-form-item:last-child) {
    margin-bottom: 0;
  }
  
  .bg-green-50 { background-color: rgba(240, 253, 244, 0.8); }
  .bg-blue-50 { background-color: rgba(239, 246, 255, 0.8); }
  .bg-red-50 { background-color: rgba(254, 242, 242, 0.8); }
  .bg-yellow-50 { background-color: rgba(254, 252, 232, 0.8); }
  .bg-purple-50 { background-color: rgba(250, 245, 255, 0.8); }
  .bg-indigo-50 { background-color: rgba(238, 242, 255, 0.8); }
  
  .add-module-btn {
    margin-top: 8px;
    height: 44px;
    font-size: 14px;
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
  </style>