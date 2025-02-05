<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Feature Comparison Table</h2>
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

          <!-- 表格列编辑 -->
          <div class="columns-section">
            <h3>Table Columns</h3>
            <div v-for="(column, index) in localSection.bottomContent.columns" :key="index" class="column-item">
              <div class="column-header">
                <h4>Column {{ index + 1 }}</h4>
                <div class="column-actions">
                  <a-button 
                    type="text" 
                    @click="moveColumn(index, 'up')"
                    :disabled="disabled || index === 0"
                  >
                    <arrow-up-outlined />
                  </a-button>
                  <a-button 
                    type="text" 
                    @click="moveColumn(index, 'down')"
                    :disabled="disabled || index === localSection.bottomContent.columns.length - 1"
                  >
                    <arrow-down-outlined />
                  </a-button>
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeColumn(index)"
                    :disabled="disabled || localSection.bottomContent.columns.length <= 2"
                  >
                    <delete-outlined />
                  </a-button>
                </div>
              </div>

              <a-form-item label="Column Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.columnTitle }}</span>
                  <a-input
                    v-model:value="column.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Subtitle">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.columnSubtitle }}</span>
                  <a-input
                    v-model:value="column.subtitle"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <a-form-item>
                <a-checkbox
                  v-model:checked="column.recommended"
                  :disabled="disabled"
                  @change="handleChange"
                >
                  Mark as Recommended
                </a-checkbox>
              </a-form-item>
            </div>

            <a-button 
              type="dashed" 
              block 
              @click="addColumn" 
              :disabled="disabled"
              class="add-column-btn"
            >
              <plus-outlined />
              Add Column
            </a-button>
          </div>

          <div class="divider" style="margin: 24px 0;"></div>

          <!-- 特性组编辑 -->
          <div class="feature-groups-section">
            <h3>Feature Groups</h3>
            <div v-for="(group, groupIndex) in localSection.bottomContent.featureGroups" :key="groupIndex" class="feature-group">
              <div class="group-header">
                <h4>Group {{ groupIndex + 1 }}</h4>
                <div class="group-actions">
                  <a-button 
                    type="text" 
                    @click="moveGroup(groupIndex, 'up')"
                    :disabled="disabled || groupIndex === 0"
                  >
                    <arrow-up-outlined />
                  </a-button>
                  <a-button 
                    type="text" 
                    @click="moveGroup(groupIndex, 'down')"
                    :disabled="disabled || groupIndex === localSection.bottomContent.featureGroups.length - 1"
                  >
                    <arrow-down-outlined />
                  </a-button>
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeGroup(groupIndex)"
                    :disabled="disabled"
                  >
                    <delete-outlined />
                  </a-button>
                </div>
              </div>

              <a-form-item label="Group Name">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.groupName }}</span>
                  <a-input
                    v-model:value="group.name"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>

              <!-- 特性项编辑 -->
              <div v-for="(feature, featureIndex) in group.features" :key="featureIndex" class="feature-item">
                <div class="feature-header">
                  <h5>Feature {{ featureIndex + 1 }}</h5>
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeFeature(groupIndex, featureIndex)"
                    :disabled="disabled"
                  >
                    <delete-outlined />
                  </a-button>
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

                <!-- 每列的特性值 -->
                <div v-for="(column, columnIndex) in localSection.bottomContent.columns" :key="columnIndex">
                  <a-form-item :label="`Value for ${column.title}`">
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.featureValue }}</span>
                      <a-input
                        v-model:value="feature.values[columnIndex]"
                        :disabled="disabled"
                        @change="handleChange"
                      />
                    </div>
                  </a-form-item>
                </div>
              </div>

              <a-button 
                type="dashed" 
                block 
                @click="addFeature(groupIndex)"
                :disabled="disabled"
                class="add-feature-btn"
              >
                <plus-outlined />
                Add Feature
              </a-button>
            </div>

            <a-button 
              type="dashed" 
              block 
              @click="addGroup"
              :disabled="disabled"
              class="add-group-btn"
            >
              <plus-outlined />
              Add Feature Group
            </a-button>
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
        <FeatureComparisonTablePreview 
          :section="localSection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import FeatureComparisonTablePreview from './FeatureComparisonTablePreview.vue'
import { DeleteOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'

export default {
  name: 'FeatureComparisonTable',
  extends: BaseSection,
  components: {
    FeatureComparisonTablePreview,
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
          columns: [],
          featureGroups: []
        },
        ...JSON.parse(JSON.stringify(this.section))
      }
    }
  },
  computed: {
    tags() {
      return SECTION_TAGS.FeatureComparisonTable
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
    addColumn() {
      this.localSection.bottomContent.columns.push({
        title: '',
        subtitle: '',
        recommended: false
      })
      // 为所有特性添加新列的值
      this.localSection.bottomContent.featureGroups.forEach(group => {
        group.features.forEach(feature => {
          feature.values.push('')
        })
      })
      this.handleChange()
    },
    removeColumn(index) {
      if (this.localSection.bottomContent.columns.length <= 2) return
      this.localSection.bottomContent.columns.splice(index, 1)
      // 从所有特性中移除该列的值
      this.localSection.bottomContent.featureGroups.forEach(group => {
        group.features.forEach(feature => {
          feature.values.splice(index, 1)
        })
      })
      this.handleChange()
    },
    moveColumn(index, direction) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const columns = this.localSection.bottomContent.columns
      const temp = columns[index]
      columns[index] = columns[newIndex]
      columns[newIndex] = temp
      // 同时移动所有特性的值
      this.localSection.bottomContent.featureGroups.forEach(group => {
        group.features.forEach(feature => {
          const tempValue = feature.values[index]
          feature.values[index] = feature.values[newIndex]
          feature.values[newIndex] = tempValue
        })
      })
      this.handleChange()
    },
    addGroup() {
      this.localSection.bottomContent.featureGroups.push({
        name: '',
        features: [{
          name: '',
          values: Array(this.localSection.bottomContent.columns.length).fill('')
        }]
      })
      this.handleChange()
    },
    removeGroup(groupIndex) {
      this.localSection.bottomContent.featureGroups.splice(groupIndex, 1)
      this.handleChange()
    },
    moveGroup(index, direction) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const groups = this.localSection.bottomContent.featureGroups
      const temp = groups[index]
      groups[index] = groups[newIndex]
      groups[newIndex] = temp
      this.handleChange()
    },
    addFeature(groupIndex) {
      this.localSection.bottomContent.featureGroups[groupIndex].features.push({
        name: '',
        values: Array(this.localSection.bottomContent.columns.length).fill('')
      })
      this.handleChange()
    },
    removeFeature(groupIndex, featureIndex) {
      this.localSection.bottomContent.featureGroups[groupIndex].features.splice(featureIndex, 1)
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

.column-item,
.feature-group {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.column-header,
.group-header,
.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.column-actions,
.group-actions {
  display: flex;
  gap: 8px;
}

:deep(.ant-form-item) {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
}

.add-column-btn,
.add-group-btn,
.add-feature-btn {
  margin-top: 16px;
}
</style> 