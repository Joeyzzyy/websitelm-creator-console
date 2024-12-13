<template>
  <div class="section-container">
    <!-- 左侧指标部分 -->
    <div class="results-container">
      <h3 class="section-title">{{ localSection.title }}</h3>
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

    <!-- 右侧内容部分 - 改为网格布局 -->
    <div class="content-container">
      <a-form layout="vertical">
        <div class="content-grid">
          <div 
            v-for="(item, index) in localSection.rightContent" 
            :key="index"
            class="content-item"
          >
            <a-form-item>
              <!-- 标题行包含 label 和 add link 按钮 -->
              <div class="form-item-label">
                <span class="ant-form-item-label">Feature Title</span>
                <a-button 
                  type="link" 
                  size="small"
                  class="add-link-btn"
                  @click="handleAddLinkClick('contentTitle', 'rightContent', index)"
                >
                  <LinkOutlined /> Add Link
                </a-button>
              </div>
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.contentTitle }}</span>
                <a-input
                  v-model:value="item.contentTitle"
                  :disabled="disabled"
                  placeholder="Feature section title (3-5 words)"
                  @change="(e) => handleInputChange(e, 'contentTitle', 'rightContent', index)"
                />
              </div>
              <!-- 标签显示区域 -->
              <div class="link-tags" v-if="getLinksByField('rightContent', index, 'contentTitle').length">
                <a-tag 
                  v-for="(link, idx) in getLinksByField('rightContent', index, 'contentTitle')" 
                  :key="idx"
                  class="link-tag"
                  closable
                  @close="removeLink(link.globalIndex)"
                >
                  <span class="link-text">{{ link.text }}</span>
                  <span class="link-url">{{ link.url }}</span>
                </a-tag>
              </div>
            </a-form-item>
            
            <a-form-item>
              <!-- 描述标题行包含 label 和 add link 按钮 -->
              <div class="form-item-label">
                <span class="ant-form-item-label">Feature Description</span>
                <a-button 
                  type="link" 
                  size="small"
                  class="add-link-btn"
                  @click="handleAddLinkClick('contentText', 'rightContent', index)"
                >
                  <LinkOutlined /> Add Link
                </a-button>
              </div>
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.contentText }}</span>
                <a-textarea
                  v-model:value="item.contentText"
                  :disabled="disabled"
                  :rows="8"
                  placeholder="Detailed explanation (minimum 200 words)"
                  @change="(e) => handleInputChange(e, 'contentText', 'rightContent', index)"
                />
              </div>
              <!-- 标签显示区域 -->
              <div class="link-tags" v-if="getLinksByField('rightContent', index, 'contentText').length">
                <a-tag 
                  v-for="(link, idx) in getLinksByField('rightContent', index, 'contentText')" 
                  :key="idx"
                  class="link-tag"
                  closable
                  @close="removeLink(link.globalIndex)"
                >
                  <span class="link-text">{{ link.text }}</span>
                  <span class="link-url">{{ link.url }}</span>
                </a-tag>
              </div>
            </a-form-item>
          </div>
        </div>
      </a-form>
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
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import { LinkOutlined } from '@ant-design/icons-vue'

export default {
  name: 'KeyResultsWithTextBlock',
  extends: BaseSection,
  components: {
    LinkOutlined
  },
  computed: {
    tags() {
      return SECTION_TAGS.KeyResultsWithTextBlock
    }
  },
  data() {
    return {
      localSection: null,
      linkModalVisible: false,
      linkUrl: '',
      selectedText: '',
      textLinks: [],
      currentField: null
    }
  },
  created() {
    this.initializeLocalSection();
  },
  watch: {
    section: {
      handler(newVal) {
        this.initializeLocalSection();
      },
      deep: true
    }
  },
  methods: {
    initializeLocalSection() {
      this.localSection = JSON.parse(JSON.stringify(this.section));
      this.textLinks = [];
      this.detectExistingLinks();
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
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

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
</style> 