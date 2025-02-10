<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-header">
        <h2 class="component-title">Key Results With Text Block</h2>
      </div>
      <div class="editor-content">
        <!-- 顶部内容 -->
        <div class="top-content">
          <a-form layout="vertical">
            <a-form-item label="Section Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.contentTitle }}</span>
                <a-input
                  v-model:value="localSection.title"
                  :disabled="disabled"
                  placeholder="Enter section title"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
          </a-form>
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

        <!-- 右侧内容部分 - 简化为单个编辑器 -->
        <div class="right-content">
          <div class="content-header-with-button">
            <span>Blog Content</span>
          </div>

          <div class="content-item">
            <div class="editor-wrapper">
              <!-- 工具栏 -->
              <div class="editor-toolbar">
                <a-button-group>
                  <a-button 
                    type="text"
                    :class="{ active: editor?.isActive('bold') }"
                    @click="editor?.chain().focus().toggleBold().run()"
                  >
                    <bold-outlined />
                  </a-button>
                  <a-button 
                    type="text"
                    :class="{ active: editor?.isActive('italic') }"
                    @click="editor?.chain().focus().toggleItalic().run()"
                  >
                    <italic-outlined />
                  </a-button>
                  <a-button 
                    type="text"
                    :class="{ active: editor?.isActive('subtitle') }"
                    @click="editor?.chain().focus().toggleMark('subtitle').run()"
                  >
                    <font-size-outlined />
                  </a-button>
                </a-button-group>

                <a-divider type="vertical" />

                <a-button-group>
                  <a-button type="text" @click="handleAddImageClick">
                    <picture-outlined />
                  </a-button>
                  <a-button type="text" @click="handleAddVideoClick">
                    <video-camera-outlined />
                  </a-button>
                  <a-button type="text" @click="handleAddLinkClick">
                    <link-outlined />
                  </a-button>
                </a-button-group>
              </div>

              <editor-content 
                :editor="editor" 
                class="content-textarea"
              />
            </div>
          </div>

          <!-- 添加调试区域 -->
          <div class="debug-area">
            <div class="debug-title">Editor HTML Content:</div>
            <pre class="debug-content">{{ editorContent }}</pre>
          </div>
        </div>

        <!-- Modal 部分保持不变 -->
        <a-modal v-model:visible="linkModalVisible" title="Add Link" @ok="handleAddLink" @cancel="handleCancelLink">
          <p class="selected-text-preview">Selected Text: {{ selectedText }}</p>
          <a-input 
            v-model:value="linkUrl"
            placeholder="Please enter URL"
          />
        </a-modal>

        <a-modal v-model:visible="imageLibraryVisible" title="Select Image" width="800px" @ok="handleImageSelect" @cancel="handleImageLibraryCancel">
          <image-library
            v-if="imageLibraryVisible"
            @select="onImageSelect"
            @close="handleImageLibraryCancel"
          />
        </a-modal>

        <a-modal v-model:visible="videoLibraryVisible" title="Select Video" width="800px" @ok="handleVideoSelect" @cancel="handleVideoLibraryCancel">
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
import { LinkOutlined, DeleteOutlined, PictureOutlined, CloseOutlined, VideoCameraOutlined, BoldOutlined, ItalicOutlined, FontSizeOutlined } from '@ant-design/icons-vue'
import ImageLibrary from '../common/ImageLibrary.vue'
import VideoLibrary from '../common/VideoLibrary.vue'
import { debounce } from 'lodash'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Node } from '@tiptap/core'
import { Mark } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'

// 创建视频扩展
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      class: {
        default: 'embedded-video',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', HTMLAttributes]
  },
})

// 创建子标题扩展
const Subtitle = Mark.create({
  name: 'subtitle',
  
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'content-subtitle',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.content-subtitle',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})

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
    ItalicOutlined,
    FontSizeOutlined,
    EditorContent
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
        rightContent: '' // 直接使用字符串
      },
      editor: null, // 改为单个编辑器
      linkModalVisible: false,
      imageLibraryVisible: false,
      videoLibraryVisible: false,
      linkUrl: '',
      selectedText: '',
      styles: themeConfig.normal,
      selectedImage: null,
      selectedVideo: null,
      editorContent: '', // 添加这个属性
    }
  },
  created() {
    this.localSection = Object.assign({
      title: '',
      leftContent: [],
      rightContent: '' // 直接使用字符串
    }, JSON.parse(JSON.stringify(this.section)))
    
    if (!Array.isArray(this.localSection.leftContent)) {
      this.localSection.leftContent = []
    }

    this.$nextTick(() => {
      this.initEditor()
    })
    
    this.debouncedHandleChange = debounce(this.handleChange, 300)
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  methods: {
    initEditor() {
      if (this.editor) {
        this.editor.destroy()
      }

      this.editor = new Editor({
        extensions: [
          StarterKit,
          Image.configure({
            inline: true,
            HTMLAttributes: {
              class: 'embedded-image',
            },
          }),
          Link.configure({
            openOnClick: false,
            HTMLAttributes: {
              class: 'content-link',
            },
          }),
          Video.configure({
            HTMLAttributes: {
              class: 'embedded-video',
              controls: true,
              preload: 'metadata',
            },
          }),
          Subtitle, // 添加子标题扩展
        ],
        content: this.localSection.rightContent || '', // 直接使用 rightContent 字符串
        editable: !this.disabled,
        autofocus: false,
        onUpdate: ({ editor }) => {
          if (this._isDestroyed) return
          
          const html = editor.getHTML()
          this.editorContent = html // 更新 HTML 内容
          this.localSection.rightContent = html // 直接设置 rightContent 字符串
          this.debouncedHandleChange()
        },
      })

      // 初始化时也设置一次内容
      this.$nextTick(() => {
        if (this.editor) {
          this.editorContent = this.editor.getHTML()
        }
      })
    },

    handleChange() {
      this.$emit('update', this.localSection)
    },

    handleAddImageClick() {
      this.imageLibraryVisible = true
    },

    onImageSelect(image) {
      this.selectedImage = image;
    },

    handleImageSelect() {
      if (!this.selectedImage) {
        this.$message.warning('Please select an image first')
        return
      }

      try {
        if (this.editor) {
          this.editor
            .chain()
            .focus()
            .setImage({ src: this.selectedImage.url, alt: this.selectedImage.name })
            .run()
        }
        this.handleImageLibraryCancel()
        this.$message.success('Image inserted successfully')
      } catch (error) {
        console.error('Error inserting image:', error)
        this.$message.error('Failed to insert image, please try again')
      }
    },

    handleImageLibraryCancel() {
      this.imageLibraryVisible = false;
      this.selectedImage = null;
    },

    handleAddVideoClick() {
      this.videoLibraryVisible = true
    },

    onVideoSelect(video) {
      this.selectedVideo = video;
    },

    handleVideoSelect() {
      if (!this.selectedVideo) {
        this.$message.warning('Please select a video first')
        return
      }

      try {
        if (this.editor) {
          const videoHtml = `<div class="video-container"><video src="${this.selectedVideo.url}" controls preload="metadata" class="embedded-video"></video></div>`
          this.editor
            .chain()
            .focus()
            .insertContent(videoHtml)
            .run()
        }
        this.handleVideoLibraryCancel()
        this.$message.success('Video inserted successfully')
      } catch (error) {
        console.error('Error inserting video:', error)
        this.$message.error('Failed to insert video, please try again')
      }
    },

    handleVideoLibraryCancel() {
      this.videoLibraryVisible = false;
      this.selectedVideo = null;
    },

    handleAddLinkClick() {
      if (this.editor && this.editor.state.selection.content().size > 0) {
        this.selectedText = this.editor.state.selection.content().textContent
        this.linkModalVisible = true
      } else {
        this.$message.warning('Please select text first')
      }
    },

    handleAddLink() {
      if (!this.linkUrl) {
        this.$message.warning('请输入URL')
        return
      }

      if (this.editor) {
        this.editor
          .chain()
          .focus()
          .setLink({ href: this.linkUrl })
          .run()
      }

      this.handleCancelLink()
      this.$message.success('链接添加成功')
    },

    handleCancelLink() {
      this.linkModalVisible = false
      this.linkUrl = ''
      this.selectedText = ''
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

.editor-wrapper {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-top: 8px;
}

.editor-toolbar {
  padding: 8px;
  border-bottom: 1px solid #d9d9d9;
  background: #fafafa;
  display: flex;
  gap: 8px;
  align-items: center;
}

.editor-toolbar .ant-btn {
  padding: 4px 8px;
  height: 32px;
}

.editor-toolbar .ant-btn.active {
  color: #1890ff;
  background: #e6f7ff;
}

.content-textarea {
  padding: 12px;
  min-height: 120px;
}

.content-textarea :deep(.ProseMirror) {
  min-height: 120px;
  outline: none;
  line-height: 1.5;
}

.content-textarea :deep(.ProseMirror p) {
  margin: 0 0 0.3em 0;
}

.content-textarea :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.content-textarea :deep(.ProseMirror ul),
.content-textarea :deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 0 0 1em 0;
}

.content-textarea :deep(.ProseMirror li) {
  margin-bottom: 0.5em;
}

.content-textarea :deep(.ProseMirror li:last-child) {
  margin-bottom: 0;
}

.content-textarea :deep(.embedded-image) {
  max-width: 100%;
  height: auto;
  margin: 8px 0;
  display: block;
}

.content-textarea :deep(.video-container) {
  margin: 8px 0;
}

.content-textarea :deep(.embedded-video) {
  max-width: 100%;
  height: auto;
}

.content-textarea :deep(.content-link) {
  color: #1890ff;
  text-decoration: none;
}

.content-textarea :deep(.content-link:hover) {
  text-decoration: underline;
}

/* 添加光标样式 */
.content-textarea :deep(.ProseMirror-focused) {
  outline: none;
  background-color: #fff;
}

/* 选中文本的样式 */
.content-textarea :deep(.ProseMirror-selectednode) {
  outline: 2px solid #1890ff;
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
  margin-top: 20px;
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

/* 添加子标题样式 */
.content-textarea :deep(.content-subtitle) {
  font-size: 1.25em;
  font-weight: 600;
  color: #374151;
  display: inline-block;
  line-height: 1.4;
}
</style> 