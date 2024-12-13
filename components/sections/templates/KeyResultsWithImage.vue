<template>
    <div class="section-container">
      <a-form layout="vertical">
        <div v-for="(item, index) in localSection.leftContent" :key="index">
          <a-form-item :label="`Result ${index + 1}`">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.percentage }}</span>
              <a-input
                v-model:value="item.percentage"
                :disabled="disabled"
                placeholder="Achievement percentage"
                @change="handleContentChange"
              />
            </div>
            <div class="input-with-tag mt-3">
              <span class="html-tag">{{ tags.description }}</span>
              <a-textarea
                v-model:value="item.description"
                :disabled="disabled"
                :rows="4"
                placeholder="Contextual explanation with timeframe and impact"
                @change="handleContentChange"
              />
            </div>
          </a-form-item>
        </div>

        <a-form-item label="Image">
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.image }}</span>
            <div class="image-input-wrapper">
              <a-input
                v-model:value="localSection.rightContent.imageUrl"
                :disabled="disabled"
                @change="handleContentChange"
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
              @change="handleContentChange"
            />
          </div>
          <div v-if="localSection.rightContent.imageUrl" class="image-preview">
            <img :src="localSection.rightContent.imageUrl" alt="Preview" style="max-width: 100%; height: auto;" />
          </div>
        </a-form-item>
      </a-form>

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
    name: 'KeyResultsWithImage',
    extends: BaseSection,
    components: {
      ImageLibrary
    },
    computed: {
      tags() {
        return SECTION_TAGS.KeyResultsWithImage
      }
    },
    data() {
      return {
        localSection: {
          ...JSON.parse(JSON.stringify(this.section)),
          rightContent: {
            imageUrl: this.section.rightContent?.imageUrl || '',
            imageAlt: this.section.rightContent?.imageAlt || ''
          }
        },
        imageLibraryVisible: false,
        selectedImage: null
      }
    },
    methods: {
      handleContentChange() {
        const updatedSection = {
          ...this.localSection,
          leftContent: [...this.localSection.leftContent]
        };
        
        console.log('=== KeyResultsWithImage handleContentChange ===');
        console.log('Updated section:', updatedSection);
        
        this.emitUpdate(updatedSection);
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
          this.localSection = {
            ...this.localSection,
            rightContent: {
              ...this.localSection.rightContent,
              imageUrl: this.selectedImage.url
            }
          };
          this.handleContentChange();
        }
        this.closeImageLibrary()
      }
    },
    watch: {
      section: {
        handler(newVal) {
          this.localSection = {
            ...JSON.parse(JSON.stringify(newVal)),
            rightContent: {
              imageUrl: newVal.rightContent?.imageUrl || '',
              imageAlt: newVal.rightContent?.imageAlt || ''
            }
          };
        },
        deep: true
      }
    }
  }
  </script> 
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';
  
  :deep(.ant-form-item) {
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
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
  
  .mt-3 {
    margin-top: 12px;
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
    background: linear-gradient(135deg, #468be5, #3a9ced);
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
    background: linear-gradient(135deg, #3883ca, #2875d9);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
  }
  </style> 