<template>
    <div class="section-container">
      <a-form layout="vertical">
        <div v-for="(item, index) in localSection.bottomContent" :key="index">
          <a-form-item :label="`Competitor ${index + 1}`">
            <a-input
              v-model:value="item.competitorLogo"
              :disabled="disabled"
              placeholder="Image path"
              @change="handleChange"
            />
            
            <div class="input-with-tag">
              <span class="html-tag">{{ tags.competitorName }}</span>
              <a-input
                v-model:value="item.competitorName"
                :disabled="disabled"
                placeholder="Competitor category name"
                @change="handleChange"
              />
            </div>

            <div class="input-with-tag">
              <span class="html-tag">{{ tags.percentage }}</span>
              <a-input
                v-model:value="item.percentage"
                :disabled="disabled"
                placeholder="Improvement percentage"
                @change="handleChange"
              />
            </div>

            <div class="input-with-tag">
              <span class="html-tag">{{ tags.metric }}</span>
              <a-input
                v-model:value="item.metric"
                :disabled="disabled"
                placeholder="Measurement category"
                @change="handleChange"
              />
            </div>

            <div class="input-with-tag">
              <span class="html-tag">{{ tags.description }}</span>
              <a-textarea
                v-model:value="item.description"
                :disabled="disabled"
                :rows="4"
                placeholder="Detailed comparison explanation"
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
    name: 'KeyResultsWithThreeCards',
    extends: BaseSection,
    computed: {
      tags() {
        return SECTION_TAGS.KeyResultsWithThreeCards
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
  }
  </style> 