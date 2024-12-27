<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">FAQs</h2>
      </div>
      <div class="editor-content">
        <a-form layout="vertical">
          <div v-for="(faq, index) in localSection.bottomContent" :key="index">
            <a-form-item>
              <div class="faq-header">
                <span>FAQ #{{index + 1}}</span>
                <a-button 
                  type="text" 
                  danger 
                  @click="removeFaq(index)"
                  :disabled="disabled"
                >
                  <delete-outlined />
                </a-button>
              </div>

              <div class="input-with-tag">
                <span class="html-tag">{{ tags.question }}</span>
                <a-input
                  v-model:value="faq.question"
                  :disabled="disabled"
                  placeholder="Question"
                  @change="handleChange"
                />
              </div>
              
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.answer }}</span>
                <a-textarea
                  v-model:value="faq.answer"
                  :disabled="disabled"
                  :rows="4"
                  placeholder="Answer"
                  @change="handleChange"
                  :style="{ minHeight: '120px' }"
                />
              </div>
            </a-form-item>
          </div>

          <a-button 
            type="primary" 
            @click="addFaq" 
            :disabled="disabled"
            style="margin-top: 8px"
          >
            <plus-outlined /> Add New FAQ
          </a-button>
        </a-form>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <FaqsSectionPreview 
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
import FaqsSectionPreview from './FaqsPreview.vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'

export default {
  name: 'Faqs',
  extends: BaseSection,
  components: {
    FaqsSectionPreview,
    PlusOutlined,
    DeleteOutlined
  },
  computed: {
    tags() {
      return SECTION_TAGS.Faqs
    }
  },
  data() {
    return {
      localSection: JSON.parse(JSON.stringify(this.section)),
      styles: themeConfig.normal
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
    addFaq() {
      this.localSection.bottomContent.push({
        question: '',
        answer: ''
      })
      this.handleChange()
    },
    removeFaq(index) {
      this.localSection.bottomContent.splice(index, 1)
      this.handleChange()
    }
  }
}
</script>

<style scoped>
.section-wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  min-height: 500px;
}

.editor-area,
.preview-area {
  border-radius: 8px;
  padding: 24px;
}

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

.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-x: auto;
  height: 600px;
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

:deep(.ant-form-item) {
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>