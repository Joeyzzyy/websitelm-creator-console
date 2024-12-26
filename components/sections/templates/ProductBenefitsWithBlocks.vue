<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <a-row :gutter="24">
        <!-- 原有的编辑表单内容 -->
        <a-col :span="24">
          <a-form layout="vertical">
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
  
            <a-form-item label="Description">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-textarea
                  v-model:value="localSection.leftContent.description"
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
          </a-form>
        </a-col>
  
        <a-col :span="20">
          <div style="margin-bottom: 12px; color: #666;">
            Module Content Area
          </div>
          <a-button 
            v-if="!disabled"
            block 
            type="primary"
            class="add-module-btn"
            @click="addModule"
          >
            Add Module
          </a-button>
          <div class="modules-grid">
            <a-row :gutter="[16, 16]">
              <a-col 
                v-for="(module, index) in localSection.rightContent" 
                :key="index"
                :span="24"
              >
                <div class="module-card">
                  <a-form layout="vertical">
                    <div class="module-header">
                      <span>Module {{ index + 1 }}</span>
                      <a-button
                        v-if="!disabled"
                        type="text"
                        class="delete-btn"
                        @click="removeModule(index)"
                      >
                        <template #icon>
                          <delete-outlined />
                        </template>
                      </a-button>
                    </div>
                    <a-form-item label="Icon">
                      <div class="input-with-tag">
                        <span class="html-tag">{{ tags.moduleIcon }}</span>
                        <a-input
                          v-model:value="module.icon"
                          :disabled="disabled"
                          @change="handleChange"
                        />
                      </div>
                    </a-form-item>
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
                    <a-form-item label="Sub Title">
                      <div class="input-with-tag">
                        <span class="html-tag">{{ tags.moduleSubTitle }}</span>
                        <a-input
                          v-model:value="module.subTitle"
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
                  </a-form>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <ProductBenefitsWithBlocksPreview 
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
import ProductBenefitsWithBlocksPreview from './ProductBenefitsWithBlocksPreview.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'

export default {
  name: 'ProductBenefitsWithFourBlocks',
  extends: BaseSection,
  components: {
    ProductBenefitsWithBlocksPreview,
    DeleteOutlined
  },
  computed: {
    tags() {
      return SECTION_TAGS.ProductBenefitsWithBlocks
    }
  },
  data() {
    return {
      localSection: {
        leftContent: {
          title: '',
          description: '',
          buttonText: '',
          buttonLink: ''
        },
        rightContent: [],
        ...JSON.parse(JSON.stringify(this.section))
      },
      styles: themeConfig.normal
    }
  },
  created() {
    if (this.section) {
      this.localSection = JSON.parse(JSON.stringify(this.section))
    }
  },
  watch: {
    section: {
      handler(newVal) {
        if (newVal) {
          this.localSection = JSON.parse(JSON.stringify(newVal))
        } else {
          this.localSection = {
            leftContent: {
              title: '',
              description: '',
              buttonText: '',
              buttonLink: ''
            },
            rightContent: []
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
    addModule() {
      if (!Array.isArray(this.localSection.rightContent)) {
        this.localSection.rightContent = []
      }
      
      this.localSection.rightContent.push({
        icon: '',
        title: '',
        subTitle: '',
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

/* 基本表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
}

.modules-grid {
  margin: 0;
}

/* 左侧内容卡片样式 */
.module-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  height: 100%;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  width: 100%;
}

.module-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 表单控件样式 */
:deep(.ant-input),
:deep(.ant-textarea) {
  border-radius: 6px;
  border-color: #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.ant-input:hover),
:deep(.ant-textarea:hover) {
  border-color: #1677ff;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.module-header span {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.add-module-btn {
  margin-bottom: 16px;
  height: 44px;
  font-size: 14px;
  width: fit-content;
  padding: 0 24px;
}

:deep(.ant-select-selector) {
  background: transparent !important;
  border-color: #e5e7eb !important;
}

:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: #1890ff !important;
}

@media (max-width: 1200px) {
  .module-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .modules-grid {
    margin: 0;
  }
  
  .module-card {
    padding: 16px;
  }
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

/* 复用 TitleSection 的样式 */
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
  max-height: 1000px;
  overflow-y: auto;
}

/* ===== 预览区域样式 ===== */
.preview-area {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  min-width: 768px;
  overflow: visible;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0;
  height: 32px;
}

.preview-header span {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.preview-content {
  background: white;
  border-radius: 8px;
  flex: 1;
  overflow: visible;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 48px;
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