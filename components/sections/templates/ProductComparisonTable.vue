<template>
  <div class="section-container">
    <a-form layout="vertical">
      <!-- Top Content -->
      <a-form-item label="Title">
        <div class="input-with-tag">
          <span class="html-tag">{{ tags.title }}</span>
          <a-input
            v-model:value="localSection.topContent.title"
            :disabled="disabled"
            @change="(e) => handleChange('title', e)"
          />
        </div>
      </a-form-item>

      <a-form-item label="Subtitle">
        <div class="input-with-tag">
          <span class="html-tag">{{ tags.subTitle }}</span>
          <a-input
            v-model:value="localSection.topContent.subTitle"
            :disabled="disabled"
            @change="handleChange"
          />
        </div>
      </a-form-item>

      <!-- Companies -->
      <a-form-item label="Our Company Name">
        <div class="input-with-tag">
          <span class="html-tag">{{ tags.companyName }}</span>
          <a-input
            v-model:value="localSection.topContent.companies.us"
            :disabled="disabled"
            @change="handleChange"
          />
        </div>
      </a-form-item>

      <a-form-item label="Competitor Company Name">
        <div class="input-with-tag">
          <span class="html-tag">{{ tags.companyName }}</span>
          <a-input
            v-model:value="localSection.topContent.companies.competitor"
            :disabled="disabled"
            @change="handleChange"
          />
        </div>
      </a-form-item>

      <!-- Features List -->
      <div v-for="(feature, index) in localSection.bottomContent.features" :key="index">
        <a-form-item :label="`Feature ${index + 1}`">
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.featureName }}</span>
            <a-input
              v-model:value="feature.name"
              :disabled="disabled"
              @change="handleChange"
            />
          </div>
          <div class="checkbox-group">
            <a-checkbox
              v-model:checked="feature.us"
              :disabled="disabled"
              @change="handleChange"
            >
              Our Company
            </a-checkbox>
            <a-checkbox
              v-model:checked="feature.competitor"
              :disabled="disabled"
              @change="handleChange"
            >
              Competitor
            </a-checkbox>
          </div>
        </a-form-item>
      </div>

      <a-button 
        v-if="!disabled" 
        type="dashed" 
        block 
        @click="addFeature"
      >
        Add Feature
      </a-button>
    </a-form>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'

export default {
  name: 'ProductComparisonTable',
  extends: BaseSection,
  computed: {
    tags() {
      return SECTION_TAGS.ProductComparisonTable
    }
  },
  data() {
    return {
      localSection: {
        componentName: 'product_comparison_table',
        topContent: {
          title: '',
          subTitle: '',
          companies: {
            competitor: '',
            us: ''
          }
        },
        bottomContent: {
          features: []
        }
      }
    }
  },
  created() {
    // 初始化数据
    if (this.section) {
      this.localSection = JSON.parse(JSON.stringify(this.section))
    }
  },
  methods: {
    handleChange(field, event) {
      console.log('=== ProductComparison Change Event Start ===');
      console.log('Field:', field);
      console.log('Original props section:', JSON.stringify(this.section, null, 2));
      
      if (field === 'title') {
        const oldTitle = this.localSection.topContent.title;
        this.localSection.topContent.title = event.target.value;
        console.log(`Title changed from "${oldTitle}" to "${this.localSection.topContent.title}"`);
      }
      
      console.log('Local section after change:', JSON.stringify(this.localSection, null, 2));
      
      // 添加延时确保数据已更新
      this.$nextTick(() => {
        console.log('Emitting update with section:', JSON.stringify(this.localSection, null, 2));
        this.emitUpdate(this.localSection);
      });
    },
    addFeature() {
      this.localSection.bottomContent.features.push({
        name: '',
        competitor: false,
        us: false
      })
      this.handleChange()
    }
  },
  watch: {
    section: {
      handler(newVal, oldVal) {
        console.log('=== Section Prop Changed ===');
        console.log('Old:', JSON.stringify(oldVal, null, 2));
        console.log('New:', JSON.stringify(newVal, null, 2));
      },
      deep: true
    },
    'localSection.topContent.title': {
      handler(newVal, oldVal) {
        console.log('=== Title Changed ===');
        console.log(`Title: ${oldVal} -> ${newVal}`);
      }
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

:deep(.ant-form-item) {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
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

.checkbox-group {
  margin-top: 12px;
}

:deep(.ant-checkbox-wrapper) {
  margin: 12px 24px 12px 0;
  color: #374151;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #1890ff;
  border-color: #1890ff;
}

.feature-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>