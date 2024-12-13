<template>
  <div class="section-container">
    <a-form layout="vertical">
      <div v-for="(faq, index) in localSection.bottomContent" :key="index">
        <a-form-item :label="`FAQ ${index + 1}`">
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
            />
          </div>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'

export default {
  name: 'Faqs',
  extends: BaseSection,
  computed: {
    tags() {
      return SECTION_TAGS.Faqs
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

.section-container {
  padding: 24px;
}

:deep(.ant-form-item) {
  margin-bottom: 24px;
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
</style>