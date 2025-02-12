<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
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

          <div class="bottom-content">
            <a-form-item label="Author">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.author }}</span>
                <a-input
                  v-model:value="localSection.bottomContent.author"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Publish Date">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.publishDate }}</span>
                <a-date-picker
                  v-model:value="localSection.bottomContent.publishDate"
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
        </a-form>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <TitleSectionPreview 
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
import TitleSectionPreview from './TitleSectionPreview.vue'

export default {
  name: 'TitleSection',
  extends: BaseSection,
  components: {
    TitleSectionPreview
  },
  data() {
    return {
      localSection: {
        title: '',
        subTitle: '',
        bottomContent: {
          author: '',
          publishDate: ''
        },
        ...JSON.parse(JSON.stringify(this.section))
      },
      styles: themeConfig.normal
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.TitleSection
    },
    isChineseTitle() {
      return /[\u4e00-\u9fa5]/.test(this.localSection?.title || '')
    },
    titleClasses() {
      const { fontSize, fontWeight, color } = this.styles.typography.h1
      console.log('Title classes:', { fontSize, fontWeight, color })
      return [fontSize, fontWeight, color]
    }
  },
  created() {
    console.log('Styles:', this.styles)
    if (this.localSection.bottomContent.publishDate === "") {
      this.localSection.bottomContent.publishDate = new Date().toISOString().split('T')[0];
    }
    
    if (!this.localSection.bottomContent.author) {
      try {
        const currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
        if (currentCustomer?.userName) {
          this.localSection.bottomContent.author = currentCustomer.userName;
          this.$nextTick(() => {
            this.handleChange();
          });
        }
      } catch (error) {
        console.error('Error getting author name:', error);
      }
    }

    const typography = this.styles.typography.h1
    console.log('Typography h1 values:', {
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      color: typography.color
    })
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
  },
  mounted() {
    console.log('Complete styles config:', this.styles)
    console.log('Typography styles:', this.styles.typography.h1)
  }
}
</script>

<style scoped>
/* 基础布局 - 整体页面结构 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 500px;
}

/* 编辑区域和预览区域的共同样式 */
.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
}

/* ===== 表单编辑区域样式 ===== */
.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border-radius: 8px;
  padding: 24px;
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

/* 表单输入框样式 */
.input-with-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* HTML标签样式 */
.html-tag {
  padding: 2px 8px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #0050b3;
  font-size: 12px;
  font-family: monospace;
}

/* Ant Design 表单项自定义样式 */
:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

/* ===== 预览区域样式 ===== */
.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
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
</style>