<template>
    <div class="section-container">
      <a-row :gutter="24">
        <!-- 左侧表格内容 -->
        <a-col :span="12">
          <div v-for="(item, index) in localSection.leftContent" :key="index">
            <a-form layout="vertical">
              <a-form-item :label="`Item ${index + 1}`">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.icon }}</span>
                  <a-input
                    v-model:value="item.icon"
                    :disabled="disabled"
                    placeholder="Icon"
                    @change="handleChange"
                  />
                </div>
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.title }}</span>
                  <a-input
                    v-model:value="item.title"
                    :disabled="disabled"
                    placeholder="Title"
                    @change="handleChange"
                  />
                </div>
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.content }}</span>
                  <a-textarea
                    v-model:value="item.content"
                    :disabled="disabled"
                    :rows="3"
                    placeholder="Content"
                    @change="handleChange"
                  />
                </div>
                <a-button 
                  v-if="!disabled" 
                  type="link" 
                  danger 
                  @click="removeLeftItem(index)"
                >
                  Remove Item
                </a-button>
              </a-form-item>
            </a-form>
          </div>
          
          <a-button 
            v-if="!disabled" 
            type="dashed" 
            block 
            @click="addLeftItem"
          >
            Add Item
          </a-button>
        </a-col>
  
        <!-- 右侧标题内容 -->
        <a-col :span="12">
          <a-form layout="vertical">
            <a-form-item label="Icon">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.icon }}</span>
                <a-input
                  v-model:value="localSection.rightContent.icon"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.title }}</span>
                <a-input
                  v-model:value="localSection.rightContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Subtitle">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.subTitle }}</span>
                <a-input
                  v-model:value="localSection.rightContent.subTitle"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Button Text">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.buttonText }}</span>
                <a-input
                  v-model:value="localSection.rightContent.buttonText"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  
  export default {
    name: 'ProductBenefitsWithTable',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.ProductBenefitsWithTable
      }
    },
    data() {
      return {
        localSection: {
          leftContent: [],
          rightContent: {
            icon: '',
            title: '',
            subTitle: '',
            buttonText: ''
          },
          ...JSON.parse(JSON.stringify(this.section || {}))
        }
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
      addLeftItem() {
        this.localSection.leftContent.push({
          icon: '',
          title: '',
          content: ''
        })
        this.handleChange()
      },
      removeLeftItem(index) {
        this.localSection.leftContent.splice(index, 1)
        this.handleChange()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';

  :deep(.ant-col) {
    margin-bottom: 24px;
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

  .right-content {
    padding-left: 24px;
    border-left: 1px solid #e5e7eb;
  }
  </style>