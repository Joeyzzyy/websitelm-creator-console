<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <!-- 顶部内容 -->
      <div class="top-content">
        <h3 class="section-title">{{ localSection.title }}</h3>
      </div>

      <!-- 左侧指标部分 -->
      <div class="left-content">
        <a-form layout="vertical">
          <div v-for="(item, index) in localSection.leftContent" :key="index">
            <a-form-item :label="`Result ${index + 1}`">
              <div class="display-switch">
                <span class="switch-label">Display Or Not:</span>
                <a-switch
                  v-model:checked="item.display"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
              
              <div class="input-with-tag" v-show="item.display">
                <span class="html-tag">{{ tags.percentage }}</span>
                <a-input
                  v-model:value="item.percentage"
                  :disabled="disabled"
                  placeholder="Achievement percentage"
                  @change="handleChange"
                />
              </div>
              
              <div class="input-with-tag" v-show="item.display">
                <span class="html-tag">{{ tags.description }}</span>
                <a-textarea
                  v-model:value="item.description"
                  :disabled="disabled"
                  :rows="4"
                  placeholder="Metric description"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </div>
        </a-form>
      </div>

      <!-- 右侧内容部分 -->
      <div class="right-content">
        <div class="content-header-with-button">
          <span>Feature Sections</span>
          <a-button 
            v-if="!disabled"
            type="primary" 
            class="add-content-btn"
            @click="addContent"
          >
            Add Feature Section
          </a-button>
        </div>

        <a-row :gutter="24">
          <a-col 
            v-for="(item, index) in localSection.rightContent" 
            :key="index"
            :span="24"
          >
            <div class="content-item">
              <div class="content-header">
                <span>Feature Section {{ index + 1 }}</span>
                <a-button 
                  v-if="!disabled"
                  type="text"
                  danger
                  class="delete-btn"
                  @click="removeContent(index)"
                >
                  <DeleteOutlined />
                </a-button>
              </div>

              <a-form layout="vertical">
                <a-form-item label="Content Title">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.contentTitle }}</span>
                    <a-input
                      v-model:value="item.contentTitle"
                      :disabled="disabled"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>

                <a-form-item label="Content Text">
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.contentText }}</span>
                    <a-textarea
                      v-model:value="item.contentText"
                      :disabled="disabled"
                      :rows="6"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
              </a-form>
            </div>
          </a-col>
        </a-row>
      </div>

      <!-- 链接输入弹窗 -->
      <a-modal
        v-model:visible="linkModalVisible"
        title="Add Link"
        @ok="handleAddLink"
        @cancel="handleCancelLink"
      >
        <p class="selected-text-preview">Selected Text: {{ selectedText }}</p>
        <a-input 
          v-model:value="linkUrl"
          placeholder="Please enter URL"
        />
      </a-modal>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <div class="bg-white rounded-lg w-full">
          <KeyResultsWithTextBlockPreview 
            :section="localSection"
            :styles="styles"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import KeyResultsWithTextBlockPreview from './KeyResultsWithTextBlockPreview.vue'
import themeConfig from '../../../assets/config/themeConfig'
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons-vue'

export default {
  name: 'KeyResultsWithTextBlock',
  extends: BaseSection,
  components: {
    LinkOutlined,
    DeleteOutlined,
    KeyResultsWithTextBlockPreview
  },
  computed: {
    tags() {
      return SECTION_TAGS.KeyResultsWithTextBlock
    }
  },
  data() {
    return {
      localSection: {
        title: '',
        leftContent: [],
        rightContent: []
      },
      linkModalVisible: false,
      linkUrl: '',
      selectedText: '',
      textLinks: [],
      currentField: null,
      styles: themeConfig.normal
    }
  },
  created() {
    this.localSection = Object.assign({
      title: '',
      leftContent: [],
      rightContent: []
    }, JSON.parse(JSON.stringify(this.section)))
    
    if (!Array.isArray(this.localSection.leftContent)) {
      this.localSection.leftContent = []
    }
    if (!Array.isArray(this.localSection.rightContent)) {
      this.localSection.rightContent = []
    }
  },
  watch: {
    section: {
      handler(newVal) {
        this.localSection = Object.assign({
          title: '',
          leftContent: [],
          rightContent: []
        }, JSON.parse(JSON.stringify(newVal)))
        
        if (!Array.isArray(this.localSection.leftContent)) {
          this.localSection.leftContent = []
        }
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

    detectExistingLinks() {
      this.localSection.rightContent.forEach((content, index) => {
        ['contentTitle', 'contentText'].forEach(field => {
          const text = content[field];
          const linkRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/g;
          let match;
          
          while ((match = linkRegex.exec(text)) !== null) {
            const [fullMatch, url, linkText] = match;
            const exists = this.textLinks.some(link => 
              link.text === linkText && 
              link.url === url && 
              link.field.type === 'rightContent' && 
              link.field.index === index && 
              link.field.field === field
            );
            
            if (!exists) {
              this.textLinks.push({
                text: linkText,
                url: url,
                field: {
                  type: 'rightContent',
                  index: index,
                  field: field
                }
              });
            }
          }
        });
      });
    },

    handleChange(value, field, contentType, index) {
      // 检查并清理失效的链接
      this.cleanInvalidLinks(value, field, contentType, index);
      this.emitUpdate(this.localSection);
    },

    cleanInvalidLinks(currentValue, field, contentType, index) {
      const linksForField = this.getLinksByField(contentType, index, field);
      
      linksForField.forEach(link => {
        // 检查链接文本是否完整存在于当前值中
        if (!currentValue.includes(link.text)) {
          // 移除 a 标签，恢复为纯文本
          const content = this.localSection[contentType][index];
          const linkRegex = new RegExp(`<a[^>]*>${link.text}</a>`);
          content[field] = content[field].replace(linkRegex, link.text);
          
          // 从 textLinks 中移除该链接
          this.textLinks.splice(link.globalIndex, 1);
        }
      });
    },

    // 修改输入框的 change 事件绑定
    handleInputChange(e, field, contentType, index) {
      const value = e.target.value;
      this.handleChange(value, field, contentType, index);
    },

    handleTextSelect(field, contentType, index) {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        this.selectedText = text;
        this.currentField = {
          type: contentType,
          index: index,
          field: field
        };
        this.linkModalVisible = true;
      }
    },

    handleAddLink() {
      if (this.linkUrl && this.selectedText) {
        this.textLinks.push({
          text: this.selectedText,
          url: this.linkUrl,
          field: { ...this.currentField }
        });
        
        const linkHtml = `<a href="${this.linkUrl}">${this.selectedText}</a>`;
        const content = this.localSection[this.currentField.type][this.currentField.index];
        content[this.currentField.field] = content[this.currentField.field]
          .replace(this.selectedText, linkHtml);
        
        this.handleChange();
        this.resetLinkModal();
      }
    },

    removeLink(index) {
      console.log('Removing link at index:', index);
      console.log('Current textLinks:', JSON.stringify(this.textLinks));
      
      const link = this.textLinks[index];
      console.log('Link to remove:', link);
      
      const content = this.localSection[link.field.type][link.field.index];
      console.log('Content before replacement:', content[link.field.field]);
      
      const linkRegex = new RegExp(`<a[^>]*>${link.text}</a>`);
      content[link.field.field] = content[link.field.field]
        .replace(linkRegex, link.text);
      
      console.log('Content after replacement:', content[link.field.field]);
      
      this.textLinks.splice(index, 1);
      console.log('TextLinks after removal:', JSON.stringify(this.textLinks));
      
      this.handleChange();
    },

    resetLinkModal() {
      this.linkModalVisible = false;
      this.linkUrl = '';
      this.selectedText = '';
      this.currentField = null;
    },

    handleAddLinkClick(field, contentType, index) {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        this.selectedText = text;
        this.currentField = {
          type: contentType,
          index: index,
          field: field
        };
        this.linkModalVisible = true;
      } else {
        this.$message.warning('Please select text first');
      }
    },

    getLinksByField(contentType, index, field) {
      console.log('Getting links for:', {contentType, index, field});
      const filteredLinks = this.textLinks.map((link, idx) => ({
        ...link,
        globalIndex: idx
      })).filter(link => 
        link.field.type === contentType && 
        link.field.index === index && 
        link.field.field === field
      );
      console.log('Filtered links:', filteredLinks);
      return filteredLinks;
    },

    handleCancelLink() {
      this.resetLinkModal();
    },

    removeContent(index) {
      this.localSection.rightContent.splice(index, 1);
      this.handleChange();
    },

    addContent() {
      this.localSection.rightContent.push({
        contentTitle: '',
        contentText: ''
      })
      this.handleChange()
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

.section-wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  min-height: 500px;
}

.editor-area {
  border-radius: 8px;
  padding: 24px;
  height: 800px;
  overflow-y: auto;
}

.preview-area {
  background: #f8fafc;
  min-width: 768px;
  overflow-y: auto;
  height: 800px;
  border-radius: 8px;
  padding: 24px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #64748b;
  font-weight: 500;
}

.preview-content {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.section-container {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  gap: 32px;
}

.results-container {
  position: sticky;
  top: 24px;
  align-self: start;
  height: fit-content;
  width: 100%;
  min-width: 300px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1f2937;
  width: 100%;
  display: block;
}

.results-container {
  position: sticky;
  top: 24px;
  align-self: start;
  height: fit-content;
  min-width: 0;
  width: auto;
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
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
}

.display-switch {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}

.switch-label {
  margin-right: 12px;
  color: #4b5563;
  font-size: 14px;
}

:deep(.ant-switch) {
  min-width: 40px;
}

:deep(.ant-form-item) {
  width: 100%;
  margin-bottom: 16px;
}

:deep(.ant-input-wrapper) {
  width: 100%;
}

:deep(.ant-input),
:deep(.ant-input-textarea) {
  width: 100%;
}

[v-show="false"] {
  display: none !important;
}

.link-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.link-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  max-width: 250px;
}

.link-text {
  color: #1890ff;
  margin-right: 4px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-url {
  color: #666;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-tag :deep(.anticon-close) {
  font-size: 10px;
  margin-left: 4px;
}

.input-group {
  position: relative;
  width: 100%;
}

.add-link-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 1;
}

.selected-text-preview {
  margin-bottom: 16px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  word-break: break-all;
}

.input-with-tag {
  width: 100%;
}

.link-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.link-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  max-width: 250px;
}

.link-text {
  color: #1890ff;
  margin-right: 4px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-url {
  color: #666;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-tag :deep(.anticon-close) {
  font-size: 10px;
  margin-left: 4px;
}

.form-item-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form-item-label .ant-form-item-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.add-link-btn {
  padding: 0 8px;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
}

.add-link-btn :deep(.anticon) {
  font-size: 12px;
  margin-right: 4px;
}

.top-content {
  margin-bottom: 24px;
}

.left-content {
  margin-bottom: 32px;
}

.right-content {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.content-header-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-item {
  position: relative;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;
  background: white;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.add-content-btn {
  background: linear-gradient(135deg, #1890ff, #1890ff);
  border: none;
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-content-btn:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.delete-btn {
  margin-left: 8px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.content-header .delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.content-header .delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

.content-header :deep(.anticon) {
  font-size: 14px;
  color: inherit;
}

.add-content-btn {
  margin-bottom: 24px;
}

.content-item {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}
</style> 