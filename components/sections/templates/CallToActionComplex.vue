<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-content">
        <a-form layout="vertical">
          <!-- 顶部内容 -->
          <div class="content-section">
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
            
            <a-form-item label="Des cription">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.topDescription }}</span>
                <a-textarea
                  v-model:value="localSection.topContent.description"
                  :disabled="disabled"
                  @change="handleChange"
                  :rows="2"
                  :style="{ minHeight: '120px' }"
                />
              </div>
            </a-form-item>
          </div>

          <!-- 底部内容 -->
          <div class="content-section">
            <a-form-item label="Section Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.topTitle }}</span>
                <a-input
                  v-model:value="localSection.bottomContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <!-- 关键优势列表 -->
            <div class="benefits-list">
              <div v-for="(item, index) in localSection.bottomContent.content" :key="index" class="benefit-item">
                <a-form-item :label="`Benefit ${index + 1} Title`">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.contentTitle }}</span>
                    <a-input
                      v-model:value="item.title"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
                
                <a-form-item :label="`Benefit ${index + 1} Description`">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.contentDescription }}</span>
                    <a-textarea
                      v-model:value="item.description"
                      :disabled="disabled"
                      @change="handleChange"
                      :rows="4"
                      :style="{ minHeight: '120px' }"
                    />
                  </div>
                </a-form-item>
              </div>
            </div>

            <a-form-item label="Call to Action Top">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.callToActionEngagementTop }}</span>
                <a-textarea
                  v-model:value="localSection.bottomContent.callToActionEngagementTop"
                  :disabled="disabled"
                  @change="handleChange"
                  :rows="2"
                  :style="{ minHeight: '120px' }"
                />
              </div>
            </a-form-item>

            <a-form-item label="Call to Action Bottom">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.callToActionEngagementBottom }}</span>
                <a-textarea
                  v-model:value="localSection.bottomContent.callToActionEngagementBottom"
                  :disabled="disabled"
                  @change="handleChange"
                  :rows="2"
                  :style="{ minHeight: '120px' }"
                />
              </div>
            </a-form-item>
          </div>

          <!-- 按钮设置 -->
          <div class="content-section">
            <h3 class="section-title">Buttons</h3>
            
            <!-- 修改按钮显示控制 -->
            <a-form-item label="Show Primary Button">
              <a-switch
                v-model:checked="localSection.bottomContent.showButton"
                :disabled="disabled"
                @change="handleChange"
              />
            </a-form-item>

            <a-form-item label="Show Secondary Button">
              <a-switch
                v-model:checked="localSection.bottomContent.showCtaButton"
                :disabled="disabled"
                @change="handleChange"
              />
            </a-form-item>

            <template v-if="localSection.bottomContent.showButton">
              <a-form-item label="Primary Button Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonText }}</span>
                  <a-input
                    v-model:value="localSection.bottomContent.buttonText"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </template>

            <template v-if="localSection.bottomContent.showCtaButton">
              <a-form-item label="Secondary Button Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.ctaButtonText }}</span>
                  <a-input
                    v-model:value="localSection.bottomContent.ctaButtonText"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </template>
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
        <CallToActionComplexPreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import themeConfig from '../../../assets/config/themeConfig'
import CallToActionComplexPreview from './CallToActionComplexPreview.vue'

export default {
  name: 'CallToActionComplex',
  extends: BaseSection,
  components: {
    CallToActionComplexPreview
  },
  data() {
    return {
      localSection: {
        topContent: {
          title: '',
          description: ''
        },
        bottomContent: {
          title: '',
          content: [
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' }
          ],
          callToActionEngagementTop: '',
          callToActionEngagementBottom: '',
          buttonText: '',
          ctaButtonText: '',
          showButton: true,
          showCtaButton: true
        },
        ...JSON.parse(JSON.stringify(this.section))
      },
      styles: themeConfig.normal
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.CallToActionComplex
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
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: fit-content;
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
  max-height: 1200px;
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
  min-width: 768px;
  border-radius: 8px;
  padding: 24px;
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
  padding: 24px;
  height: fit-content;
  flex: 0 0 auto;
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

.subsection-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #4b5563;
}

.benefit-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 12px;
}

.benefits-list {
  margin-bottom: 24px;
}
</style>