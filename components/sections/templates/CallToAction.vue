<template>
    <div class="section-container">
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
      </a-form>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'CallToAction',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.CallToAction
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