<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-content">
        <!-- 移除 Row 和 Col 布局，改用单列 -->
        <a-form layout="vertical">
          <!-- 左侧内容部分 -->
          <div class="form-section">
            <a-form-item label="Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.title }}</span>
                <a-input
                  v-model:value="localSection.leftContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Subtitle">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.subTitle }}</span>
                <a-textarea
                  v-model:value="localSection.leftContent.subTitle"
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
                  v-model:value="localSection.leftContent.buttonText"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Button Link">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.buttonLink }}</span>
                <a-input
                  v-model:value="localSection.leftContent.buttonLink"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </div>
  
          <div class="form-section">
            <h3>Modules</h3>
            <div class="modules-container">
              <div v-for="(module, index) in localSection.rightContent" :key="index" class="module-item">
                <a-form layout="vertical">
                  <div class="module-header">
                    <span>Module {{ index + 1 }}</span>
                    <a-button 
                      v-if="!disabled" 
                      type="text"
                      class="delete-btn"
                      @click="removeModule(index)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </div>
  
                  <a-form-item label="Title">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.contentTitle }}</span>
                      <a-input
                        v-model:value="module.contentTitle"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>
  
                  <a-form-item label="Content">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.content }}</span>
                      <a-textarea
                        v-model:value="module.content"
                        :disabled="disabled"
                        :rows="3"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>
                </a-form>
              </div>
  
              <a-button 
                v-if="!disabled" 
                type="dashed" 
                block 
                @click="addModule"
              >
                Add Module
              </a-button>
            </div>
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
        <HowItWorksWithBlocksPreview 
          :section="localSection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import HowItWorksWithBlocksPreview from './HowItWorksWithBlocksPreview.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'

export default {
  name: 'HowItWorksWithBlocks',
  extends: BaseSection,
  components: {
    DeleteOutlined,
    HowItWorksWithBlocksPreview
  },
  computed: {
    tags() {
      return SECTION_TAGS.HowItWorksWithBlocks
    }
  },
  data() {
    return {
      localSection: {
        leftContent: {
          title: '',
          subTitle: '',
          buttonText: '',
          buttonLink: ''
        },
        rightContent: []
      }
    }
  },
  created() {
    this.localSection = Object.assign({
      leftContent: {
        title: '',
        subTitle: '',
        buttonText: '',
        buttonLink: ''
      },
      rightContent: []
    }, JSON.parse(JSON.stringify(this.section)))

    if (!Array.isArray(this.localSection.rightContent)) {
      this.localSection.rightContent = []
    }
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = Object.assign({
          leftContent: {
            title: '',
            subTitle: '',
            buttonText: '',
            buttonLink: ''
          },
          rightContent: []
        }, JSON.parse(JSON.stringify(newVal)))
        
        if (!Array.isArray(this.localSection.rightContent)) {
          this.localSection.rightContent = []
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addModule() {
      this.localSection.rightContent.push({
        contentTitle: '',
        content: ''
      })
      this.handleChange()
    },
    removeModule(index) {
      this.localSection.rightContent.splice(index, 1)
      this.handleChange()
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

/* 基础布局 - 整体页面结构 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  min-width: 768px;
  height: fit-content;
  position: sticky;
  top: 24px;
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
}

.modules-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.right-content {
  padding-left: 0;
  border-left: none;
}

/* 色块背景样式 */
.bg-green-50 { background-color: #f0fdf4; }
.bg-blue-50 { background-color: #eff6ff; }
.bg-red-50 { background-color: #fef2f2; }
.bg-yellow-50 { background-color: #fefce8; }

:deep(.ant-select-selector) {
  background: transparent !important;
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

/* 添加新的表单分区样式 */
.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 16px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* 移除颜色相关样式 */
.bg-green-50,
.bg-blue-50,
.bg-red-50,
.bg-yellow-50 {
  display: none;
}

.delete-btn {
  padding: 4px 8px;
  height: auto;
  color: #ff4d4f;
}

.delete-btn:hover {
  color: #ff7875;
  background-color: #fff1f0;
}

.module-header .delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.module-header .delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

.module-header :deep(.anticon) {
  font-size: 14px;
  color: inherit;
}
</style>