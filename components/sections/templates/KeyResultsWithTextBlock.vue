<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Key Results With Text Block</h2>
      </div>
      <div class="editor-content">
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
                    :style="{ minHeight: '60px' }"
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
                    <div class="form-item-label">
                      <div class="action-buttons">
                        <!-- 移除了 add-image-btn -->
                      </div>
                    </div>
                    <div class="input-with-tag">
                      <span class="html-tag">{{ tags.contentText }}</span>
                      <div class="rich-content-editor">
                        <div class="editor-toolbar">
                          <div class="toolbar-group">
                            <a-tooltip title="Insert Image">
                              <a-button 
                                type="text"
                                class="toolbar-btn"
                                @click="handleAddImageClick(index)"
                              >
                                <picture-outlined />
                              </a-button>
                            </a-tooltip>
                            <a-tooltip title="Insert Video">
                              <a-button 
                                type="text"
                                class="toolbar-btn"
                                @click="handleAddVideoClick(index)"
                              >
                                <video-camera-outlined />
                              </a-button>
                            </a-tooltip>
                            <a-tooltip title="Add Link">
                              <a-button 
                                type="text"
                                class="toolbar-btn"
                                @click="handleAddLinkClick('contentText', 'rightContent', index)"
                              >
                                <link-outlined />
                              </a-button>
                            </a-tooltip>
                            <a-tooltip title="Bold">
                              <a-button 
                                type="text"
                                class="toolbar-btn"
                                @click="handleBoldClick"
                              >
                                <bold-outlined />
                              </a-button>
                            </a-tooltip>
                            <a-tooltip title="Italic">
                              <a-button 
                                type="text"
                                class="toolbar-btn"
                                @click="handleItalicClick"
                              >
                                <italic-outlined />
                              </a-button>
                            </a-tooltip>
                          </div>
                        </div>
                        <div
                          class="content-textarea"
                          :contenteditable="!disabled"
                          :innerHTML="formatContentWithLinks(item.contentText)"
                          @input="(e) => handleContentInput(e, index)"
                          @select="() => handleTextSelect('contentText', 'rightContent', index)"
                          :ref="el => textareaRefs[index] = el"
                        ></div>
                        <div class="editor-footer">
                          <span class="char-count">{{ item.contentText.length }} characters</span>
                        </div>
                        <!-- 添加调试区域 -->
                        <div class="debug-area">
                          <div class="debug-title">Raw HTML Content:</div>
                          <pre class="debug-content">{{ item.contentText }}</pre>
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                </a-form>

                <!-- 添加链接列表显示区域 -->
                <div class="link-tags" v-if="getLinksByField('rightContent', index, 'contentText').length">
                  <div 
                    v-for="(link, linkIndex) in getLinksByField('rightContent', index, 'contentText')" 
                    :key="linkIndex"
                    class="link-tag"
                  >
                    <span class="link-text">{{ link.text }}</span>
                    <span class="link-url">({{ link.url }})</span>
                    <a-button 
                      type="text" 
                      size="small"
                      @click="removeLink(link.globalIndex)"
                    >
                      <close-outlined />
                    </a-button>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>

          <a-button 
            v-if="!disabled"
            type="primary" 
            class="add-content-btn bottom-add-btn"
            @click="addContent"
          >
            Add Feature Section
          </a-button>
        </div>

        <!-- 添加链接输入弹窗 -->
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

        <!-- 添加图片库 Modal -->
        <a-modal
          v-model:visible="imageLibraryVisible"
          title="Select Image"
          width="800px"
          @ok="handleImageSelect"
          @cancel="handleImageLibraryCancel"
        >
          <image-library
            v-if="imageLibraryVisible"
            @select="onImageSelect"
            @close="handleImageLibraryCancel"
          />
        </a-modal>

        <!-- 添加视频库 Modal -->
        <a-modal
          v-model:visible="videoLibraryVisible"
          title="Select Video"
          width="800px"
          @ok="handleVideoSelect"
          @cancel="handleVideoLibraryCancel"
        >
          <video-library
            v-if="videoLibraryVisible"
            @select="onVideoSelect"
            @close="handleVideoLibraryCancel"
          />
        </a-modal>
      </div>
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
import { LinkOutlined, DeleteOutlined, PictureOutlined, CloseOutlined, VideoCameraOutlined, BoldOutlined, ItalicOutlined } from '@ant-design/icons-vue'
import ImageLibrary from '../common/ImageLibrary.vue'
import VideoLibrary from '../common/VideoLibrary.vue'

export default {
  name: 'KeyResultsWithTextBlock',
  extends: BaseSection,
  components: {
    LinkOutlined,
    DeleteOutlined,
    KeyResultsWithTextBlockPreview,
    PictureOutlined,
    ImageLibrary,
    CloseOutlined,
    VideoCameraOutlined,
    VideoLibrary,
    BoldOutlined,
    ItalicOutlined
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
      styles: themeConfig.normal,
      imageLibraryVisible: false,
      currentContentIndex: null,
      cursorPositions: {},
      currentTextareaIndex: null,
      contentTextArea: [],
      selectedImage: null,
      textareaRefs: {},
      savedSelection: null,
      videoLibraryVisible: false,
      selectedVideo: null,
      lastCaretPosition: null,
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
    this.$nextTick(() => {
      this.detectExistingLinks();
    });
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
        const text = content.contentText;
        const linkRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        while ((match = linkRegex.exec(text)) !== null) {
          const [fullMatch, url, linkText] = match;
          const exists = this.textLinks.some(link => 
            link.text === linkText && 
            link.url === url && 
            link.field.type === 'rightContent' && 
            link.field.index === index && 
            link.field.field === 'contentText'
          );
          
          if (!exists) {
            this.textLinks.push({
              text: linkText,
              url: url,
              field: {
                type: 'rightContent',
                index: index,
                field: 'contentText'
              }
            });
          }
        }
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
        this.saveSelection();
      }
    },

    saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.savedSelection = selection.getRangeAt(0);
      }
    },

    restoreSelection() {
      if (this.savedSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.savedSelection);
      }
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
        this.saveSelection();
        this.linkModalVisible = true;
      } else {
        this.$message.warning('Please select text');
      }
    },

    handleAddLink() {
      if (!this.linkUrl || !this.selectedText) {
        this.$message.warning('Please enter URL');
        return;
      }

      try {
        this.restoreSelection();
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        const linkElement = document.createElement('a');
        linkElement.href = this.linkUrl;
        linkElement.textContent = this.selectedText;
        
        range.deleteContents();
        range.insertNode(linkElement);
        
        this.textLinks.push({
          text: this.selectedText,
          url: this.linkUrl,
          field: { ...this.currentField }
        });
        
        const editor = this.textareaRefs[this.currentField.index];
        if (editor) {
          const content = this.localSection[this.currentField.type][this.currentField.index];
          content[this.currentField.field] = editor.innerHTML
            .replace(/<br>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/&nbsp;/g, ' ');
          
          this.handleChange();
        }

        this.handleCancelLink();
        this.$message.success('Link added successfully');
      } catch (error) {
        console.error('Error adding link:', error);
        this.$message.error('Failed to add link, please try again');
      }
    },

    handleCancelLink() {
      this.linkModalVisible = false;
      this.linkUrl = '';
      this.selectedText = '';
      this.currentField = null;
      this.savedSelection = null;
    },

    getLinksByField(contentType, index, field) {
      const filteredLinks = this.textLinks.map((link, idx) => ({
        ...link,
        globalIndex: idx
      })).filter(link => 
        link.field.type === contentType && 
        link.field.index === index && 
        link.field.field === field
      );
      return filteredLinks;
    },

    removeLink(globalIndex) {
      const link = this.textLinks[globalIndex];
      if (!link) return;

      const content = this.localSection[link.field.type][link.field.index];
      const linkRegex = new RegExp(`<a[^>]*>${link.text}</a>`);
      content[link.field.field] = content[link.field.field]
        .replace(linkRegex, link.text);
      
      this.textLinks.splice(globalIndex, 1);
      this.handleChange();
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
    },

    handleAddImageClick(index) {
      const selection = window.getSelection();
      if (!selection.toString().trim()) {
        this.currentContentIndex = index;
        this.currentTextareaIndex = index;
        this.saveSelection();
        this.imageLibraryVisible = true;
      } else {
        this.$message.warning('Please clear text selection before inserting image');
      }
    },

    onImageSelect(image) {
      this.selectedImage = image;
    },

    handleImageSelect() {
      if (!this.selectedImage || this.currentContentIndex === null) {
        this.$message.warning('Please select an image first');
        return;
      }

      try {
        this.restoreSelection();
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        const imgElement = document.createElement('img');
        imgElement.src = this.selectedImage.url;
        imgElement.alt = this.selectedImage.name;
        
        range.deleteContents();
        range.insertNode(imgElement);
        
        range.setStartAfter(imgElement);
        range.setEndAfter(imgElement);
        selection.removeAllRanges();
        selection.addRange(range);
        
        const editor = this.textareaRefs[this.currentContentIndex];
        if (editor) {
          const content = this.localSection.rightContent[this.currentContentIndex];
          content.contentText = editor.innerHTML
            .replace(/<br>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/&nbsp;/g, ' ');
          
          this.handleChange();
        }

        this.handleImageLibraryCancel();
        this.$message.success('Image inserted successfully');
      } catch (error) {
        console.error('Error inserting image:', error);
        this.$message.error('Failed to insert image, please try again');
      }
    },

    handleImageLibraryCancel() {
      this.imageLibraryVisible = false;
      this.selectedImage = null;
      this.currentContentIndex = null;
      this.savedSelection = null;
    },

    hasImageTags(text) {
      return /<img[^>]+>/g.test(text);
    },

    extractImages(text) {
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"[^>]*>/g;
      const images = [];
      let match;

      while ((match = imgRegex.exec(text)) !== null) {
        images.push({
          fullTag: match[0],
          src: match[1],
          alt: match[2]
        });
      }

      return images;
    },

    removeImage(contentIndex, imgTag) {
      const content = this.localSection.rightContent[contentIndex];
      content.contentText = content.contentText.replace(imgTag, '');
      this.handleChange();
    },

    handleTextareaEvent(event, index) {
      this.currentTextareaIndex = index;
      this.updateCursorPosition(index, event);
    },

    // 更新光标位置的方法
    updateCursorPosition(index, event) {
      const textareaElement = event.target;
      if (textareaElement) {
        this.cursorPositions[index] = textareaElement.selectionStart;
      }
    },

    formatContentWithLinks(content) {
      if (!content) return '';
      return content
        .replace(/\n/g, '<br>')
        .replace(/&nbsp;/g, ' ');
    },

    handleContentInput(event, index) {
      try {
        // 保存当前光标位置相关信息
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(event.target);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          
          // 计算真实的光标位置，考虑换行符
          let position = 0;
          const walker = document.createTreeWalker(
            event.target,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          
          let node;
          let found = false;
          while ((node = walker.nextNode()) && !found) {
            if (node === range.endContainer) {
              position += range.endOffset;
              found = true;
            } else {
              position += node.length;
            }
            
            // 如果节点后面有 <br>，添加换行符的长度
            const nextSibling = node.nextSibling;
            if (nextSibling && nextSibling.nodeName === 'BR') {
              position += 1;
            }
          }
          
          this.lastCaretPosition = {
            globalPosition: position,
            node: range.endContainer,
            offset: range.endOffset
          };
          
          console.log('保存光标位置:', {
            globalPosition: position,
            nodeType: range.endContainer.nodeType,
            nodeValue: range.endContainer.nodeValue,
            offset: range.endOffset
          });
        }

        const content = event.target.innerHTML;
        console.log('更新前的内容:', content);
        
        this.localSection.rightContent[index].contentText = content;
        
        this.$nextTick(() => {
          if (this.lastCaretPosition && this.textareaRefs[index]) {
            const editor = this.textareaRefs[index];
            console.log('编辑器内容:', editor.innerHTML);
            
            // 重新定位光标
            let currentPos = 0;
            let targetNode = null;
            let targetOffset = 0;
            
            const walker = document.createTreeWalker(
              editor,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            
            let node;
            while ((node = walker.nextNode())) {
              const nodeLength = node.length;
              
              // 考虑节点后的换行符
              let effectiveLength = nodeLength;
              const nextSibling = node.nextSibling;
              if (nextSibling && nextSibling.nodeName === 'BR') {
                effectiveLength += 1;
              }
              
              if (currentPos + effectiveLength >= this.lastCaretPosition.globalPosition) {
                targetNode = node;
                targetOffset = this.lastCaretPosition.globalPosition - currentPos;
                break;
              }
              currentPos += effectiveLength;
            }
            
            if (targetNode) {
              const selection = window.getSelection();
              const range = document.createRange();
              range.setStart(targetNode, targetOffset);
              range.setEnd(targetNode, targetOffset);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        });
        
        this.handleChange();
      } catch (error) {
        console.error('内容更新错误:', error);
      }
    },

    handleAddVideoClick(index) {
      const selection = window.getSelection();
      if (!selection.toString().trim()) {
        this.currentContentIndex = index;
        this.currentTextareaIndex = index;
        this.saveSelection();
        this.videoLibraryVisible = true;
      } else {
        this.$message.warning('Please clear text selection before inserting video');
      }
    },

    onVideoSelect(video) {
      this.selectedVideo = video;
    },

    handleVideoSelect() {
      if (!this.selectedVideo || this.currentContentIndex === null) {
        this.$message.warning('Please select a video first');
        return;
      }

      try {
        this.restoreSelection();
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        
        const videoElement = document.createElement('video');
        videoElement.src = this.selectedVideo.url;
        videoElement.controls = true;
        videoElement.preload = 'metadata';
        videoElement.className = 'embedded-video';
        
        videoContainer.appendChild(videoElement);
        
        range.deleteContents();
        range.insertNode(videoContainer);
        
        range.setStartAfter(videoContainer);
        range.setEndAfter(videoContainer);
        selection.removeAllRanges();
        selection.addRange(range);
        
        const editor = this.textareaRefs[this.currentContentIndex];
        if (editor) {
          const content = this.localSection.rightContent[this.currentContentIndex];
          content.contentText = editor.innerHTML
            .replace(/<br>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/&nbsp;/g, ' ');
          
          this.handleChange();
        }

        this.handleVideoLibraryCancel();
        this.$message.success('Video inserted successfully');
      } catch (error) {
        console.error('Error inserting video:', error);
        this.$message.error('Failed to insert video, please try again');
      }
    },

    handleVideoLibraryCancel() {
      this.videoLibraryVisible = false;
      this.selectedVideo = null;
      this.currentContentIndex = null;
      this.savedSelection = null;
    },

    // 更新格式化内容的方法，确保视频标签被正确处理
    formatContentWithLinks(content) {
      if (!content) return '';
      return content
        .replace(/\n/g, '<br>')
        .replace(/&nbsp;/g, ' ');
    },

    handleBoldClick() {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        this.restoreSelection();
        document.execCommand('bold', false, null);
        
        const editor = this.textareaRefs[this.currentTextareaIndex];
        if (editor) {
          const content = this.localSection.rightContent[this.currentTextareaIndex];
          content.contentText = editor.innerHTML
            .replace(/<br>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/&nbsp;/g, ' ');
          
          this.handleChange();
        }
      } else {
        this.$message.warning('Please select text first');
      }
    },

    handleItalicClick() {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        this.restoreSelection();
        document.execCommand('italic', false, null);
        
        const editor = this.textareaRefs[this.currentTextareaIndex];
        if (editor) {
          const content = this.localSection.rightContent[this.currentTextareaIndex];
          content.contentText = editor.innerHTML
            .replace(/<br>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/&nbsp;/g, ' ');
          
          this.handleChange();
        }
      } else {
        this.$message.warning('Please select text first');
      }
    },
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 500px;
}

.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  max-height: 1200px;
  position: relative;
  border-radius: 8px;
  padding: 24px;
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

.add-image-btn {
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

.add-image-btn:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.add-image-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-image-btn:hover {
  color: #40a9ff;
  background: rgba(24, 144, 255, 0.1);
}

:deep(.ant-modal-body) {
  padding: 0;
}

.rich-content-editor {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
}

.toolbar-group {
  display: flex;
  gap: 4px;
  align-items: center;
}

.toolbar-btn {
  padding: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #e2e8f0;
  color: #1890ff;
}

.toolbar-btn :deep(.anticon) {
  font-size: 16px;
}

.content-textarea {
  min-height: 360px;
  padding: 16px;
  border: none;
  outline: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  background: #ffffff;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.content-textarea:focus {
  outline: none;
}

.content-textarea :deep(img) {
  max-width: 150px;
  height: auto;
  margin: 8px 0;
  display: block;
}

.content-textarea :deep(img:hover) {
  cursor: pointer;
  opacity: 0.9;
}

.content-textarea :deep(a) {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
  background: transparent;
}

.content-textarea :deep(a:hover) {
  color: #40a9ff;
}

.editor-footer {
  padding: 8px 12px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: #64748b;
}

/* 优化图片占位符的显示 */
.content-textarea::placeholder {
  color: #94a3b8;
}

/* 自定义滚动条样式 */
.content-textarea::-webkit-scrollbar {
  width: 8px;
}

.content-textarea::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.content-textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.content-textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 图片占位符样式 */
.image-placeholder {
  background: #f1f5f9;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 4px 0;
  color: #1f2937;
  font-family: monospace;
}

.bottom-add-btn {
  margin-top: 16px;
  width: 100%;
}

/* 视频相关样式 */
.content-textarea :deep(.video-container) {
  max-width: 400px;
  margin: 8px 0;
  position: relative;
  background: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
}

.content-textarea :deep(.embedded-video) {
  width: 100%;
  max-height: 225px; /* 16:9 比例 */
  display: block;
  border: none;
}

.content-textarea :deep(.video-container:hover) {
  cursor: pointer;
  opacity: 0.95;
}

/* 视频控件样式优化 */
.content-textarea :deep(video::-webkit-media-controls) {
  background-color: rgba(0, 0, 0, 0.1);
}

.content-textarea :deep(video::-webkit-media-controls-panel) {
  display: flex !important;
  opacity: 1 !important;
}

.content-textarea :deep(b) {
  font-weight: bold;
}

.content-textarea :deep(i) {
  font-style: italic;
}

/* 添加调试区域样式 */
.debug-area {
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.debug-title {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 500;
}

.debug-content {
  font-family: monospace;
  font-size: 12px;
  background: #f1f5f9;
  padding: 8px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
  color: #334155;
  max-height: 200px;
  overflow-y: auto;
}
</style> 