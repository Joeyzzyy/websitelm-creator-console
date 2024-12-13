<template>
    <div class="section-container">
      <a-form layout="vertical">
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
  
        <a-form-item label="Button Text">
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.buttonText }}</span>
            <a-input
              v-model:value="localSection.topContent.buttonText"
              :disabled="disabled"
              @change="handleChange"
            />
          </div>
        </a-form-item>
  
        <a-form-item label="Video URL">
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.videoUrl }}</span>
            <a-input
              v-model:value="localSection.topContent.videoUrl"
              :disabled="disabled"
              @change="handleChange"
            />
          </div>
        </a-form-item>
      </a-form>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'HeroSectionWithVideo',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.HeroSectionWithVideo
      }
    },
    data() {
      return {
        localSection: {
          ...JSON.parse(JSON.stringify(this.section)),
          topContent: this.section.topContent || {
            title: '',
            description: '',
            buttonText: '',
            videoUrl: ''
          }
        }
      }
    },
    watch: {
      section: {
        handler(newVal) {
          this.localSection = {
            ...JSON.parse(JSON.stringify(newVal)),
            topContent: newVal.topContent || {
              title: '',
              description: '',
              buttonText: '',
              videoUrl: ''
            }
          }
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
  @import '../../../assets/styles/section-form.css';
  
  .section-container {
    padding: 24px;
  }
  
  :deep(.ant-form-item) {
    margin-bottom: 24px;
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