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
  
        <div class="content-row">
          <!-- Left Content -->
          <div class="left-content">
            <a-form-item label="Author">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.author }}</span>
                <a-input
                  v-model:value="localSection.leftContent.author"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
            
            <a-form-item label="Publish Date">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.publishDate }}</span>
                <a-date-picker
                  v-model:value="localSection.leftContent.publishDate"
                  :disabled="disabled"
                  @change="handleChange"
                  format="YYYY-MM-DD"
                  :allow-clear="false"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
              </div>
            </a-form-item>
          </div>
  
          <!-- Right Content -->
          <div class="right-content">
            <a-form-item label="Image">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.image }}</span>
                <div class="image-input-wrapper">
                  <a-input
                    v-model:value="localSection.rightContent.imageUrl"
                    :disabled="disabled"
                    placeholder="Image URL"
                    @change="handleChange"
                  />
                  <a-button 
                    type="primary"
                    class="change-image-btn"
                    @click="openImageLibrary"
                  >
                    Change
                  </a-button>
                </div>
              </div>
              <div class="input-with-tag mt-3">
                <span class="html-tag">{{ tags.imageAlt }}</span>
                <a-input
                  v-model:value="localSection.rightContent.imageAlt"
                  :disabled="disabled"
                  placeholder="Please enter image alt text"
                  @change="handleChange"
                />
              </div>
              <div class="image-preview" v-if="localSection.rightContent.imageUrl">
                <img :src="localSection.rightContent.imageUrl" :alt="localSection.rightContent.imageAlt" style="max-width: 100%; height: auto;" />
              </div>
            </a-form-item>
          </div>
        </div>
      </a-form>

      <!-- 图片库模态框 -->
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
    name: 'TitleSectionWithImage',
    extends: BaseSection,
    components: {
      ImageLibrary
    },
    computed: {
      tags() {
        return SECTION_TAGS.TitleSectionWithImage
      }
    },
    data() {
      return {
        localSection: {
          title: '',
          subTitle: '',
          leftContent: {
            author: '',
            publishDate: ''
          },
          rightContent: {
            imageUrl: '',
            imageAlt: ''
          },
          ...JSON.parse(JSON.stringify(this.section))
        },
        imageLibraryVisible: false,
        selectedImage: null
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
    created() {
      // 设置默认发布日期
      if (this.localSection.leftContent.publishDate === "") {
        this.localSection.leftContent.publishDate = new Date().toISOString().split('T')[0];
      }
      
      // 如果作者为空，从 localStorage 获取当前用户名
      if (!this.localSection.leftContent.author) {
        try {
          const currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
          if (currentCustomer?.userName) {
            this.localSection.leftContent.author = currentCustomer.userName;
            // 触发更新
            this.$nextTick(() => {
              this.handleChange();
            });
          }
        } catch (error) {
          console.error('Error getting author name:', error);
        }
      }
    },
    methods: {
      handleChange() {
        if (this.localSection.leftContent.publishDate === "") {
          this.localSection.leftContent.publishDate = new Date().toISOString().split('T')[0]
        }
        this.emitUpdate(this.localSection)
      },
      openImageLibrary() {
        this.imageLibraryVisible = true
      },
      closeImageLibrary() {
        this.imageLibraryVisible = false
        this.selectedImage = null
      },
      onImageSelect(image) {
        this.selectedImage = image
      },
      handleImageSelect() {
        if (this.selectedImage) {
          this.localSection.rightContent.imageUrl = this.selectedImage.url
          this.handleChange()
        }
        this.closeImageLibrary()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';
  
  .section-container {
    padding: 24px;
    min-width: 900px;
    width: 100%;
  }
  
  .content-row {
    display: flex;
    gap: 24px;
  }
  
  .left-content,
  .right-content {
    flex: 1;
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
  
  .image-preview {
    margin-top: 12px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
  }
  
  .image-input-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
  }
  
  .change-image-btn {
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
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(70, 150, 229, 0.2);
  }
  
  .mt-3 {
    margin-top: 12px;
  }
  </style>