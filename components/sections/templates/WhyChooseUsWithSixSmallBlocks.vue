<template>
    <div class="section-container">
      <!-- 顶部内容 -->
      <div class="top-content">
        <a-form layout="vertical">
          <a-form-item label="Emoji">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.emoji }}</span>
              <a-input
                v-model:value="localSection.topContent.emoji"
                :disabled="disabled"
                @change="handleChange"
              />
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
  
          <a-form-item label="Subtitle">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.subTitle }}</span>
              <a-input
                v-model:value="localSection.topContent.subTitle"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>
        </a-form>
      </div>
  
      <!-- 底部模块网格 -->
      <div class="bottom-content">
        <a-row :gutter="[16, 16]">
          <a-col 
            v-for="(module, index) in localSection.bottomContent" 
            :key="index"
            :span="8"
          >
            <div class="module-card">
              <a-form layout="vertical">
                <div class="module-header">
                  <span>Module {{ index + 1 }}</span>
                  <a-button 
                    v-if="!disabled" 
                    type="link" 
                    danger 
                    @click="removeModule(index)"
                  >
                    Remove
                  </a-button>
                </div>
  
                <a-form-item label="Icon">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.icon }}</span>
                    <a-input
                      v-model:value="module.icon"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                  </div>
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
          </a-col>
        </a-row>
  
        <a-button 
          v-if="!disabled && localSection.bottomContent.length < 6" 
          type="dashed" 
          block 
          class="add-module-btn"
          @click="addModule"
        >
          Add Module
        </a-button>
      </div>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'WhyChooseUsWithSixSmallBlocks',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.WhyChooseUsWithSixSmallBlocks
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
        if (this.localSection.bottomContent.length < 6) {
          this.localSection.bottomContent.push({
            icon: '⚡',
            title: '',
            content: ''
          })
          this.handleChange()
        }
      },
      removeModule(index) {
        this.localSection.bottomContent.splice(index, 1)
        this.handleChange()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';

  .bottom-content {
    margin-top: 32px;
  }

  .module-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  :deep(.ant-form-item) {
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  </style>