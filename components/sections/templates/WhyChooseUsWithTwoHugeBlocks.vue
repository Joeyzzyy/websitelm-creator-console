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
  
      <!-- 底部两个模块 -->
      <div class="bottom-content">
        <a-row :gutter="24">
          <a-col 
            v-for="(module, index) in localSection.bottomContent" 
            :key="index"
            :span="12"
          >
            <div class="module-card">
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
  
                <a-form-item label="Button Text">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.buttonText }}</span>
                    <a-input
                      v-model:value="module.buttonText"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
  
                <a-form-item label="Image">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.image }}</span>
                    <div class="image-input-wrapper">
                      <a-input
                        v-model:value="module.imageUrl"
                        :disabled="disabled"
                        placeholder="Image URL"
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
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.imageAlt }}</span>
                    <a-input
                      v-model:value="module.imageAlt"
                      :disabled="disabled"
                      placeholder="Image alt text"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>

                <div class="image-preview" v-if="module.imageUrl">
                  <a-image :src="module.imageUrl" :width="200" />
                </div>
              </a-form>
            </div>
          </a-col>
        </a-row>
  
        <a-button 
          v-if="!disabled && localSection.bottomContent.length < 2" 
          type="dashed" 
          block 
          class="add-module-btn"
          @click="addModule"
        >
          Add Module
        </a-button>
      </div>
  
      <!-- 添加图片库模态框 -->
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
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  import ImageLibrary from '../common/ImageLibrary.vue'
  
  export default {
    name: 'WhyChooseUsWithTwoHugeBlocks',
    extends: BaseSection,
    components: {
      ImageLibrary
    },
    computed: {
      tags() {
        return SECTION_TAGS.WhyChooseUsWithTwoHugeBlocks
      }
    },
    data() {
      return {
        localSection: JSON.parse(JSON.stringify(this.section)),
        imageLibraryVisible: false,
        selectedImage: null,
        currentModuleIndex: null
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
        if (this.localSection.bottomContent.length < 2) {
          this.localSection.bottomContent.push({
            title: '',
            content: '',
            buttonText: '',
            imageUrl: '',
            imageAlt: ''
          })
          this.handleChange()
        }
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
        if (this.selectedImage && this.currentModuleIndex !== null) {
          this.localSection.bottomContent[this.currentModuleIndex].imageUrl = this.selectedImage.url
          this.handleChange()
        }
        this.closeImageLibrary()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';
  
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
  </style>