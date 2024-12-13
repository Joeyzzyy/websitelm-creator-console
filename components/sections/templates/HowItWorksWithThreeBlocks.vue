<template>
    <div class="section-container">
      <a-row :gutter="24">
        <!-- 左侧标题内容 -->
        <a-col :span="8">
          <a-form layout="vertical">
            <a-form-item label="Icon">
              <a-input
                v-model:value="localSection.leftContent.icon"
                :disabled="disabled"
                @change="handleChange"
              />
            </a-form-item>
  
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
                <span class="html-tag">{{ tags.subTitle }}</span>
                <a-textarea
                  v-model:value="localSection.leftContent.subTitle"
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
  
        <!-- 右侧三个色块 -->
        <a-col :span="16">
          <div class="modules-container">
            <div v-for="(module, index) in localSection.rightContent" :key="index" class="module-item">
              <a-form layout="vertical">
                <div class="module-header">
                  <span>Module {{ index + 1 }}</span>
                </div>
  
                <a-form-item label="Color">
                  <a-select
                    v-model:value="module.color"
                    :disabled="disabled"
                    @change="handleChange"
                  >
                    <a-select-option value="bg-green-50">Green</a-select-option>
                    <a-select-option value="bg-blue-50">Blue</a-select-option>
                    <a-select-option value="bg-red-50">Red</a-select-option>
                    <a-select-option value="bg-yellow-50">Yellow</a-select-option>
                  </a-select>
                </a-form-item>
  
                <a-form-item label="Icon">
                  <a-input
                    v-model:value="module.icon"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </a-form-item>
  
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
  
            <a-button 
              v-if="!disabled && localSection.rightContent.length < 3" 
              type="dashed" 
              block 
              @click="addModule"
            >
              Add Module
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'HowItWorksWithThreeBlocks',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.HowItWorksWithThreeBlocks
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
        if (this.localSection.rightContent.length < 3) {
          this.localSection.rightContent.push({
            color: 'bg-green-50',
            icon: '',
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
  
  .modules-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .right-content {
    padding-left: 24px;
    border-left: 1px solid #e5e7eb;
  }
  
  /* 色块背景样式 */
  .bg-green-50 { background-color: #f0fdf4; }
  .bg-blue-50 { background-color: #eff6ff; }
  .bg-red-50 { background-color: #fef2f2; }
  .bg-yellow-50 { background-color: #fefce8; }
  
  :deep(.ant-select-selector) {
    background: transparent !important;
  }
  
  :deep(.ant-form-item) {
    background: #f8fafc;
    padding: 20px;
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
    margin-bottom: 12px;
  }
  </style>