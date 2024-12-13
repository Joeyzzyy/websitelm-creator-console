<template>
  <div class="section-container">
    <a-form layout="vertical">
      <div v-for="(item, index) in localSection.bottomContent" :key="index">
        <a-form-item :label="`Content ${index + 1}`">
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.title }}</span>
            <a-input
              v-model:value="item.title"
              :disabled="disabled"
              placeholder="Content Title"
              @change="handleChange"
            />
          </div>
          
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.subTitle }}</span>
            <a-textarea
              v-model:value="item.subTitle"
              :disabled="disabled"
              :rows="4"
              placeholder="Content Text"
              @change="handleChange"
            />
          </div>
          
          <div class="input-with-tag">
            <span class="html-tag">{{ tags.image }}</span>
            <a-input
              v-model:value="item.imageUrl"
              :disabled="disabled"
              placeholder="Image URL"
              @change="handleChange"
            />
          </div>
          
          <a-image
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :width="200"
          />
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'

export default {
  name: 'MoreInsightsWithFourCards',
  extends: BaseSection,
  computed: {
    tags() {
      return SECTION_TAGS.MoreInsightsWithFourCards
    }
  },
  data() {
    return {
      localSection: JSON.parse(JSON.stringify(this.section))
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

.image-preview {
  margin-top: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}
</style> 