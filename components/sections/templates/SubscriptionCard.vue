<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Subscription Card</h2>
      </div>
      <div class="editor-content">
        <a-form layout="vertical">
          <!-- 标题和副标题 -->
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

          <div class="divider" style="margin: 24px 0;"></div>

          <!-- 订阅卡片列表编辑 -->
          <div v-for="(plan, index) in localSection.bottomContent.plans" :key="index" class="card-item">
            <div class="card-header">
              <h3>Plan {{ index + 1 }}</h3>
              <div class="card-actions">
                <a-button 
                  type="text" 
                  @click="movePlan(index, 'up')"
                  :disabled="disabled || index === 0"
                >
                  <arrow-up-outlined />
                </a-button>
                <a-button 
                  type="text" 
                  @click="movePlan(index, 'down')"
                  :disabled="disabled || index === localSection.bottomContent.plans.length - 1"
                >
                  <arrow-down-outlined />
                </a-button>
                <a-button 
                  type="text" 
                  danger 
                  @click="removePlan(index)"
                  :disabled="disabled"
                >
                  <delete-outlined />
                </a-button>
              </div>
            </div>

            <a-form-item label="Plan Name">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.planName }}</span>
                <a-input
                  v-model:value="plan.name"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Monthly Price">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.monthlyPrice }}</span>
                <a-input
                  v-model:value="plan.price.monthly"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Yearly Price">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.yearlyPrice }}</span>
                <a-input
                  v-model:value="plan.price.yearly"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <!-- 添加折扣输入字段 -->
            <a-form-item label="Yearly Discount (e.g. 20%)">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.discount }}</span>
                <a-input
                  v-model:value="plan.discount"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Description">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-input
                  v-model:value="plan.description"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item label="Button Text">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.buttonText }}</span>
                <a-input
                  v-model:value="plan.buttonText"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>

            <a-form-item>
              <a-checkbox
                v-model:checked="plan.popular"
                :disabled="disabled"
                @change="handleChange"
              >
                Mark as Popular Plan
              </a-checkbox>
            </a-form-item>

            <!-- 特性列表编辑 -->
            <div class="features-section">
              <h4>Features</h4>
              <div v-for="(feature, featureIndex) in plan.features" :key="featureIndex">
                <div class="feature-group">
                  <a-form-item label="Feature Group Title">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.featureTitle }}</span>
                      <a-input
                        v-model:value="feature.title"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>
                  
                  <div v-for="(item, itemIndex) in feature.items" :key="itemIndex" class="feature-item">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.featureItem }}</span>
                      <a-input
                        v-model:value="feature.items[itemIndex]"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                      <a-button 
                        type="text" 
                        danger
                        @click="removeFeatureItem(plan, featureIndex, itemIndex)"
                        :disabled="disabled"
                      >
                        <delete-outlined />
                      </a-button>
                    </div>
                  </div>
                  
                  <a-button 
                    type="dashed" 
                    block 
                    @click="addFeatureItem(plan, featureIndex)"
                    :disabled="disabled"
                  >
                    <plus-outlined />
                    Add Feature Item
                  </a-button>
                </div>
              </div>
              
              <a-button 
                type="dashed" 
                block 
                @click="addFeatureGroup(plan)"
                :disabled="disabled"
                class="add-feature-group-btn"
              >
                <plus-outlined />
                Add Feature Group
              </a-button>
            </div>
          </div>

          <a-button 
            type="dashed" 
            block 
            @click="addPlan" 
            :disabled="disabled"
            class="add-plan-btn"
          >
            <plus-outlined />
            Add Plan
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
        <SubscriptionCardPreview 
          :section="localSection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import SubscriptionCardPreview from './SubscriptionCardPreview.vue'
import { DeleteOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'

export default {
  name: 'SubscriptionCard',
  extends: BaseSection,
  components: {
    SubscriptionCardPreview,
    DeleteOutlined,
    PlusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
  },
  data() {
    return {
      localSection: {
        title: '',
        subTitle: '',
        bottomContent: {
          plans: []
        },
        ...JSON.parse(JSON.stringify(this.section))
      }
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.SubscriptionCard
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
    addPlan() {
      this.localSection.bottomContent.plans.push({
        name: '',
        price: {
          monthly: '',
          yearly: ''
        },
        discount: '20%',
        description: '',
        buttonText: '',
        popular: false,
        features: [{
          title: '',
          items: ['']
        }]
      })
      this.handleChange()
    },
    removePlan(index) {
      this.localSection.bottomContent.plans.splice(index, 1)
      this.handleChange()
    },
    movePlan(index, direction) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const plans = this.localSection.bottomContent.plans
      const temp = plans[index]
      plans[index] = plans[newIndex]
      plans[newIndex] = temp
      this.handleChange()
    },
    addFeatureGroup(plan) {
      plan.features.push({
        title: '',
        items: ['']
      })
      this.handleChange()
    },
    addFeatureItem(plan, groupIndex) {
      plan.features[groupIndex].items.push('')
      this.handleChange()
    },
    removeFeatureItem(plan, groupIndex, itemIndex) {
      plan.features[groupIndex].items.splice(itemIndex, 1)
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
  max-height: calc(800px - 90px);
}

.card-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
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

.features-section {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.feature-group {
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.feature-item {
  margin-bottom: 8px;
}

.add-feature-group-btn {
  margin-top: 16px;
}

.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}
</style> 