<template>
    <div class="section-wrapper">
      <!-- 编辑区域 -->
      <div class="editor-area">
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
    
          <a-form-item label="SubTitle">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.subTitle }}</span>
              <a-input
                v-model:value="localSection.topContent.subTitle"
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
    
          <a-form-item label="CTA Button Text">
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.ctaButtonText }}</span>
              <a-input
                v-model:value="localSection.topContent.ctaButtonText"
                :disabled="disabled"
                @change="handleChange"
              />
            </div>
          </a-form-item>
        </a-form>
      </div>
  
      <!-- 预览区域 -->
      <div class="preview-area">
        <div class="preview-header">
          <span>Preview</span>
        </div>
        
        <div class="preview-content">
          <HeroSectionWithMultipleTextsPreview 
          :section="localSection"
          :styles="styles"
        />
        </div>
      </div>
    </div>
  
    <!-- 使用现有的图片库模态框 -->
    <a-modal
      v-model:visible="videoLibraryVisible"
      title="Select Video"
      @ok="handleVideoSelect"
      @cancel="closeVideoLibrary"
      width="800px"
    >
      <video-library
        v-if="videoLibraryVisible"
        @select="onVideoSelect"
        @close="closeVideoLibrary"
      />
  </a-modal>
  </template>
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  import HeroSectionWithMultipleTextsPreview from './HeroSectionWithMultipleTextsPreview.vue'
  import themeConfig from '../../../assets/config/themeConfig'
  import VideoLibrary from '../common/VideoLibrary.vue'
  
  export default {
    name: 'HeroSectionWithMultipleTexts',
    extends: BaseSection,
    components: {
      HeroSectionWithMultipleTextsPreview,
      VideoLibrary  
    },
    computed: {
      tags() {
        return SECTION_TAGS.HeroSectionWithMultipleTexts
      },
      getVideoContainerStyle() {
        return this.theme === 'tech'
          ? `${this.styles.card.base} ${this.styles.card.variants.primary}`
          : `${this.styles.card.base} ${this.styles.card.variants.plain}`
      },
      getButtonStyle() {
        return `${this.styles.button.base} ${this.styles.button.variants.secondary}`
      },
      getButtonLink() {
        const link = this.localSection.topContent.buttonLink
        return link?.startsWith('http') ? link : `https://${link}`
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
            ctaButtonText: '',
          }
        },
        styles: themeConfig.normal,
        videoLibraryVisible: false,
        selectedVideo: null,
        isMuted: true
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
              ctaButtonText: '',
            }
          }
        },
        deep: true
      }
    },
    methods: {
      handleChange() {
        this.emitUpdate(this.localSection)
      },
      openVideoLibrary() {
        this.videoLibraryVisible = true
      },
      closeVideoLibrary() {
        this.videoLibraryVisible = false
        this.selectedVideo = null
      },
      onVideoSelect(video) {
        this.selectedVideo = video
      },
      handleVideoSelect() {
        if (this.selectedVideo) {
          this.localSection.topContent.videoUrl = this.selectedVideo.url
          this.handleChange()
        }
        this.closeVideoLibrary()
      }
    }
  }
  </script>
  
  <style scoped>
  @import '../../../assets/styles/section-form.css';
  
  .section-wrapper {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 24px;
    min-height: 500px;
  }
  
  .editor-area {
    background: white;
    border-radius: 8px;
    padding: 24px;
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
    gap: 4px;
  }
  
  /* ===== 预览区域样式 ===== */
  .preview-area {
    background: #f8fafc;
    min-width: 768px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    padding: 24px;
  }
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 16px;
    background: #f8fafc;
    border-radius: 8px;
    height: 48px;
  }
  
  .preview-content {
    background: white;
    border-radius: 8px;
    flex: 1;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 添加编辑区域和预览区域的共同样式 */
  .editor-area,
  .preview-area {
    border-radius: 8px;
    padding: 24px;
  }
  
  /* 修改编辑区域样式 */
  .editor-area {
    background: white;
  }
  
  /* 优化表单项样式 */
  :deep(.ant-form-item) {
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  .video-input-wrapper {
    display: flex;
    gap: 8px;
    width: 100%;
  }
  
  .change-video-btn {
    flex-shrink: 0;
  }
  
  /* 添加视频预览样式 */
  .video-preview {
    margin-top: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 12px;
  }
  
  .preview-video {
    width: 100%;
    border-radius: 4px;
    max-height: 200px;
    object-fit: cover;
  }
  </style>