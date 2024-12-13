<template>
    <div class="section-container">
      <!-- 顶部内容 -->
      <div class="top-content">
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
        </a-form>
      </div>
  
      <!-- 底部箭头流程 -->
      <div class="bottom-content">
        <div class="arrow-flow">
          <div 
            v-for="(item, index) in localSection.bottomContent" 
            :key="index"
            class="flow-item"
          >
            <div class="flow-content">
              <a-form layout="vertical">
                <div class="flow-header">
                  <span>Step {{ item.number }}</span>
                  <!-- <a-button 
                    v-if="!disabled" 
                    type="link" 
                    danger 
                    @click="removeStep(index)"
                  >
                    Remove
                  </a-button> -->
                </div>
  
                <a-form-item label="Number">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.number }}</span>
                    <a-input
                      v-model:value="item.number"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
  
                <a-form-item label="Content">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.content }}</span>
                    <a-textarea
                      v-model:value="item.content"
                      :disabled="disabled"
                      :rows="3"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
              </a-form>
            </div>
            <div v-if="index < localSection.bottomContent.length - 1" class="arrow">
              →
            </div>
          </div>
        </div>
  
        <a-button 
          v-if="!disabled && localSection.bottomContent.length < 3" 
          type="dashed" 
          block 
          @click="addStep"
        >
          Add Step
        </a-button>
      </div>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'HowItWorksWithWorkflow',
    extends: BaseSection,
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
    computed: {
      tags() {
        return SECTION_TAGS.HowItWorksWithWorkflow
      }
    },
    methods: {
      handleChange() {
        this.emitUpdate(this.localSection)
      },
      addStep() {
        if (this.localSection.bottomContent.length < 3) {
          this.localSection.bottomContent.push({
            number: String(this.localSection.bottomContent.length + 1),
            content: ''
          })
          this.handleChange()
        }
      },
      removeStep(index) {
        this.localSection.bottomContent.splice(index, 1)
        // 重新编号
        this.localSection.bottomContent.forEach((item, i) => {
          item.number = String(i + 1)
        })
        this.handleChange()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';
  
  .arrow-flow {
    display: flex;
    align-items: center;
    gap: 24px;
    margin: 32px 0;
  }
  
  .flow-item {
    flex: 1;
    position: relative;
  }
  
  .arrow {
    position: absolute;
    right: -18px;
    top: 50%;
    transform: translateY(-50%);
    color: #1890ff;
    font-size: 20px;
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
  }
  </style>