<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-content">
        <a-form layout="vertical">
          <!-- 标题部分 -->
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

          <div class="divider" style="margin: 24px 0;"></div>

          <!-- 顶部内容编辑 -->
          <div class="top-content-section">
            <h3>Company Names</h3>
              
            <a-form-item label="Competitor Name">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.competitorName }}</span>
                <a-input
                  v-model:value="localSection.topContent.companies.competitor"
                  :disabled="disabled"
                  @change="handleChange"
                  placeholder="Competitor"
                />
              </div>
            </a-form-item>

            <a-form-item label="Your Company Name">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.usName }}</span>
                <a-input
                  v-model:value="localSection.topContent.companies.us"
                  :disabled="disabled"
                  @change="handleChange"
                  placeholder="Us"
                />
              </div>
            </a-form-item>
          </div>

          <div class="divider" style="margin: 24px 0;"></div>

          <!-- 特性项编辑 -->
          <div class="features-section">
            <h3>Features Comparison</h3>
            
            <div v-for="(feature, index) in localSection.bottomContent" :key="index" class="feature-item">
              <div class="feature-header">
                <h4>Feature {{ index + 1 }}</h4>
                <div class="feature-actions">
                  <a-button 
                    type="text" 
                    @click="moveFeature(index, 'up')"
                    :disabled="disabled || index === 0"
                  >
                    <arrow-up-outlined />
                  </a-button>
                  <a-button 
                    type="text" 
                    @click="moveFeature(index, 'down')"
                    :disabled="disabled || index === localSection.bottomContent.length - 1"
                  >
                    <arrow-down-outlined />
                  </a-button>
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeFeature(index)"
                    :disabled="disabled"
                  >
                    <delete-outlined />
                  </a-button>
                </div>
              </div>

              <a-form-item label="Feature Name">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.featureName }}</span>
                  <a-input
                    v-model:value="feature.name"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Is Empty Row">
                <a-switch
                  v-model:checked="feature.isEmpty"
                  :disabled="disabled"
                  @change="handleChange"
                />
                <span class="empty-row-hint">Empty row will hide the icon and checkmark</span>
              </a-form-item>

              <a-form-item label="Comparison Type" v-if="!feature.isEmpty">
                <a-radio-group v-model:value="feature.type" @change="handleChange" style="margin-bottom: 12px">
                  <a-radio :value="'boolean'" :disabled="disabled">Yes/No</a-radio>
                  <a-radio :value="'text'" :disabled="disabled">Custom Text</a-radio>
                </a-radio-group>
              </a-form-item>

              <div class="comparison-values" v-if="!feature.isEmpty && (!feature.type || feature.type === 'boolean')">
                <a-form-item label="Competitor Has This Feature?">
                  <a-switch
                    v-model:checked="feature.competitor"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </a-form-item>

                <a-form-item label="Your Company Has This Feature?">
                  <a-switch
                    v-model:checked="feature.us"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </a-form-item>
              </div>

              <div class="comparison-text-values" v-if="!feature.isEmpty && feature.type === 'text'">
                <a-form-item label="Competitor Value">
                  <a-input
                    v-model:value="feature.competitorText"
                    :disabled="disabled"
                    @change="handleChange"
                    placeholder="Enter competitor details"
                  />
                </a-form-item>

                <a-form-item label="Your Company Value">
                  <a-input
                    v-model:value="feature.usText"
                    :disabled="disabled"
                    @change="handleChange"
                    placeholder="Enter your company details"
                  />
                </a-form-item>
              </div>
            </div>

            <a-button 
              type="dashed" 
              block 
              @click="addFeature"
              :disabled="disabled"
              class="add-feature-btn"
            >
              <plus-outlined />
              Add Feature
            </a-button>
          </div>
          
          <div class="divider" style="margin: 24px 0;"></div>
          
          <!-- 底部按钮编辑 -->
          <div class="button-section">
            <h3>Bottom Button</h3>
            <a-form-item label="Button Text">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.buttonText }}</span>
                <a-input
                  v-model:value="localSection.buttonText"
                  :disabled="disabled"
                  @change="handleChange"
                  placeholder="Learn More"
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
        <ProductComparisonPreview 
          :section="localSection"
          :theme="theme"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import ProductComparisonPreview from './ProductComparisonPreview.vue'
import { DeleteOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'

export default {
  name: 'ProductComparison',
  extends: BaseSection,
  components: {
    ProductComparisonPreview,
    DeleteOutlined,
    PlusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
  },
  data() {
    return {
      localSection: {
        title: '',
        topContent: {
          companies: {
            competitor: 'Competitor',
            us: 'Us'
          }
        },
        bottomContent: [],
        buttonText: '了解更多',
        ...JSON.parse(JSON.stringify(this.section))
      },
      theme: 'normal'
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.ProductComparison || {
        title: '<h2>',
        competitorName: '<th>',
        usName: '<th>',
        featureName: '<span>',
        buttonText: '<button>'
      }
    }
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = JSON.parse(JSON.stringify(newVal))
        
        // 确保topContent和bottomContent存在
        if (!this.localSection.topContent) {
          this.localSection.topContent = {
            companies: {
              competitor: 'Competitor',
              us: 'Us'
            }
          }
        }
        
        if (!this.localSection.topContent.companies) {
          this.localSection.topContent.companies = {
            competitor: 'Competitor',
            us: 'Us'
          }
        }
        
        if (!this.localSection.bottomContent) {
          this.localSection.bottomContent = []
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addFeature() {
      this.localSection.bottomContent.push({
        name: '',
        competitor: false,
        us: true,
        isEmpty: false,
        type: 'boolean',
        competitorText: '',
        usText: ''
      })
      this.handleChange()
    },
    removeFeature(index) {
      this.localSection.bottomContent.splice(index, 1)
      this.handleChange()
    },
    moveFeature(index, direction) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const features = this.localSection.bottomContent
      const temp = features[index]
      features[index] = features[newIndex]
      features[newIndex] = temp
      this.handleChange()
    }
  }
}
</script>

<style scoped>
/* 继承基础样式 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  height: 100%;
  position: relative;
  max-height: 800px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-height: calc(800px - 90px);
}

.input-with-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.html-tag {
  padding: 2px 8px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #0050b3;
  font-size: 12px;
  font-family: monospace;
}

.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  overflow-y: auto;
}

.feature-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.feature-actions {
  display: flex;
  gap: 8px;
}

.comparison-values,
.comparison-text-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.comparison-text-values {
  background-color: #f0f5ff;
  border-radius: 8px;
  padding: 8px;
  margin-top: 8px;
}

:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

.add-feature-btn {
  margin-top: 16px;
}

.divider {
  height: 1px;
  background-color: #f0f0f0;
  width: 100%;
}

.companies-section {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.empty-row-hint {
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.button-section {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}
</style>
