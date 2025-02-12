<template>
    <div class="section-wrapper">
      <!-- 编辑区域 -->
      <div class="editor-area">
        <div class="editor-content">
          <a-form layout="vertical">
            <!-- 顶部内容编辑 -->
            <a-form-item label="Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.title }}</span>
                <a-input
                  v-model:value="localSection.topContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
    
            <a-form-item label="Description">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-input
                  v-model:value="localSection.topContent.description"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
    
            <!-- 职位列表编辑 -->
            <div class="jobs-editor">
              <div class="jobs-header">
                <h2>Job List</h2>
                <a-button type="primary" @click="addJob">
                  <plus-outlined /> Add Job
                </a-button>
              </div>
    
              <div v-for="(job, index) in localSection.bottomContent" :key="index" class="job-item-editor">
                <div class="job-header">
                  <h3>Job {{ index + 1 }}</h3>
                  <a-button type="text" danger @click="removeJob(index)">
                    <delete-outlined />
                  </a-button>
                </div>
                
                <a-form-item :label="`Position ${index + 1}`">
                  <a-input v-model:value="job.position" @change="handleChange" />
                </a-form-item>
                
                <div class="job-details-grid">
                  <a-form-item label="Type">
                    <a-input v-model:value="job.type" @change="handleChange" />
                  </a-form-item>
                  
                  <a-form-item label="Location">
                    <a-input v-model:value="job.location" @change="handleChange" />
                  </a-form-item>
                  
                  <a-form-item label="Salary">
                    <a-input v-model:value="job.salary" @change="handleChange" />
                  </a-form-item>
                </div>
    
                <div class="button-fields">
                  <a-form-item label="Button Text">
                    <a-input v-model:value="job.buttonText" @change="handleChange" />
                  </a-form-item>
                  
                  <a-form-item label="Button Link">
                    <a-input v-model:value="job.buttonLink" @change="handleChange" />
                  </a-form-item>
                </div>
    
                <a-form-item label="Tags">
                  <a-select
                    v-model:value="job.tags"
                    mode="tags"
                    style="width: 100%"
                    @change="handleChange"
                  />
                </a-form-item>
    
                <!-- 职责和要求编辑 -->
                <div class="requirements-grid">
                  <a-form-item label="Responsibilities">
                    <a-textarea
                      v-model:value="job.responsibilities"
                      :auto-size="{ minRows: 3 }"
                      @change="handleChange"
                    />
                  </a-form-item>
                  
                  <a-form-item label="Requirements">
                    <a-textarea
                      v-model:value="job.requirements"
                      :auto-size="{ minRows: 3 }"
                      @change="handleChange"
                    />
                  </a-form-item>
                </div>
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
          <JobListPreview 
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
  import JobListPreview from './JobListPreview.vue'
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  
  export default {
    name: 'JobListSection',
    extends: BaseSection,
    components: {
      JobListPreview,
      PlusOutlined,
      DeleteOutlined
    },
    data() {
      return {
        localSection: {
          topContent: {
            title: '',
            description: ''
          },
          bottomContent: [],
          ...JSON.parse(JSON.stringify(this.section))
        },
        styles: themeConfig.normal
      }
    },
    computed: {
      tags() {
        return SECTION_TAGS.JobList
      },
      isChineseTitle() {
        return /[\u4e00-\u9fa5]/.test(this.localSection?.topContent.title || '')
      },
      titleClasses() {
        const { fontSize, fontWeight, color } = this.styles.typography.h1
        console.log('Title classes:', { fontSize, fontWeight, color })
        return [fontSize, fontWeight, color]
      }
    },
    created() {
      console.log('Styles:', this.styles)
      if (this.localSection.bottomContent.publishDate === "") {
        this.localSection.bottomContent.publishDate = new Date().toISOString().split('T')[0];
      }
      
      if (!this.localSection.bottomContent.author) {
        try {
          const currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
          if (currentCustomer?.userName) {
            this.localSection.bottomContent.author = currentCustomer.userName;
            this.$nextTick(() => {
              this.handleChange();
            });
          }
        } catch (error) {
          console.error('Error getting author name:', error);
        }
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
      addJob() {
        this.localSection.bottomContent.push({
          position: '',
          type: '',
          location: '',
          salary: '',
          tags: [],
          responsibilities: '',
          requirements: '',
          buttonText: 'Apply Now',
          buttonLink: ''
        })
        this.handleChange()
      },
      
      removeJob(index) {
        this.localSection.bottomContent.splice(index, 1)
        this.handleChange()
      }
    }
  }
  </script>
  
  <style scoped>
  .section-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    height: fit-content;
  }
  
  /* 编辑区域和预览区域的共同样式 */
  .editor-area,
  .preview-area {
    border-radius: 8px;
    padding: 24px;
  }
  
  /* ===== 表单编辑区域样式 ===== */
  .editor-area {
    background: white;
    display: flex;
    flex-direction: column;
    max-height: 1200px;
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
  
  /* 表单输入框样式 */
  .input-with-tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  /* HTML标签样式 */
  .html-tag {
    padding: 2px 8px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    color: #0050b3;
    font-size: 12px;
    font-family: monospace;
  }
  
  /* Ant Design 表单项自定义样式 */
  :deep(.ant-form-item) {
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  /* ===== 预览区域样式 ===== */
  .preview-area {
    background: #f8fafc;
    min-width: 768px;
    border-radius: 8px;
    padding: 24px;
    height: fit-content;
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
    flex: 0 0 auto;
  }
  
  /* 添加新的样式 */
  .jobs-editor {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .job-item-editor {
    border: 1px solid #f0f0f0;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  .job-details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .requirements-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  /* 调整预览区域的滚动 */
  .preview-content {
    overflow-y: auto;
    align-items: flex-start;
  }
  
  .jobs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .button-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  </style>