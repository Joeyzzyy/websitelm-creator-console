<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Call To Action</h2>
      </div>
      <div class="editor-content">
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
    
          <div class="content-section">
            <h3 class="section-title">Button Settings</h3>
            <a-form-item label="Button Text">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.buttonText }}</span>
                <a-input
                  v-model:value="localSection.bottomContent.buttonText"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
            
            <a-form-item label="Button Link">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.buttonLink }}</span>
                <a-input
                  v-model:value="localSection.bottomContent.buttonLink"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      <div class="preview-content">
        <CallToActionPreview 
          :section="localSection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import CallToActionPreview from './CallToActionPreview.vue'

export default {
  name: 'CallToAction',
  extends: BaseSection,
  components: {
    CallToActionPreview
  },
  computed: {
    tags() {
      return SECTION_TAGS.CallToAction
    }
  },
  data() {
    return {
      localSection: {
        title: '',
        subTitle: '',
        bottomContent: {
          buttonText: '',
          buttonLink: '#'
        },
        ...JSON.parse(JSON.stringify(this.section))
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
    }
  }
}
</script>

<style scoped>
/* 基础布局 - 整体页面结构 */
.section-wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
}

/* 编辑区域和预览区域的共同样式 */
.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
}

/* 编辑区域样式 */
.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  max-height: 1000px;
  position: relative;
}

.editor-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
}

.component-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 预览区域样式 */
.preview-area {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  min-width: 768px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
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
  overflow-y: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
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

.content-section {
  margin-bottom: 32px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}
</style>