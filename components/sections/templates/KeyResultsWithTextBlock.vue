<template>
  <div class="section-wrapper fullscreen-mode">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <!-- 文本格式工具 -->
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

      <!-- 标题工具 -->
      <a-button-group>
        <template v-for="level in 5" :key="level">
          <a-button 
            type="text"
            :class="{ active: editor?.isActive('heading', { level }) }"
            @click="toggleHeading(level)"
          >
            H{{ level }}
          </a-button>
        </template>
        <a-button 
          type="text"
          :class="{ active: editor?.isActive('paragraph') }"
          @click="setParagraph()"
        >
          Normal
        </a-button>
      </a-button-group>

      <a-divider type="vertical" />

      <!-- 媒体工具 -->
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

    <!-- 编辑器内容区域 -->
    <editor-content 
      :editor="editor" 
      class="content-textarea"
    />

    <!-- 调试区域 -->
    <div class="debug-area">
      <div class="debug-title">Editor HTML Content:</div>
      <a-textarea
        v-model:value="editorContent"
        :rows="6"
        @change="updateEditorFromHTML"
        class="debug-content"
      />
    </div>

    <!-- 弹窗组件 -->
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
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import KeyResultsWithTextBlockPreview from './KeyResultsWithTextBlockPreview.vue'
import themeConfig from '../../../assets/config/themeConfig'
import { LinkOutlined, DeleteOutlined, PictureOutlined, CloseOutlined, VideoCameraOutlined, BoldOutlined, ItalicOutlined, FontSizeOutlined, DownOutlined } from '@ant-design/icons-vue'
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
    EditorContent,
    DownOutlined
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
        subTitle: '',
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
      subTitle: '',
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
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3, 4, 5],
              // 修改回车行为，强制创建新段落
              keepMarks: false,
              isolating: true
            }
          }),
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
          Subtitle,
        ],
        content: this.localSection.rightContent || '',
        editable: !this.disabled,
        autofocus: false,
        // 添加编辑器配置
        editorProps: {
          handleKeyDown: (view, event) => {
            // 当按下回车键时
            if (event.key === 'Enter' && !event.shiftKey) {
              // 强制创建新段落
              const { state, dispatch } = view;
              const { selection } = state;
              
              if (!selection.empty) return false;
              
              dispatch(state.tr.split(selection.from));
              return true;
            }
            return false;
          }
        },
        onUpdate: ({ editor }) => {
          if (this._isDestroyed) return
          
          const html = editor.getHTML()
          this.editorContent = html
          this.localSection.rightContent = html
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
      this.$message.success('Successfully added link')
    },

    handleCancelLink() {
      this.linkModalVisible = false
      this.linkUrl = ''
      this.selectedText = ''
    },

    // 添加新方法
    updateEditorFromHTML() {
      if (this.editor) {
        this.editor.commands.setContent(this.editorContent)
        this.localSection.rightContent = this.editorContent
        this.debouncedHandleChange()
      }
    },

    // 修改标题切换方法
    toggleHeading(level) {
      if (this.editor) {
        const { from, to } = this.editor.state.selection;
        
        // 检查是否有选择文本
        if (from !== to) {
          // 获取选中的文本
          const selectedText = this.editor.state.doc.textBetween(from, to);
          
          // 如果当前已经是相同级别的标题，则转换为普通段落
          if (this.editor.isActive('heading', { level })) {
            this.editor.chain().focus().setParagraph().run();
          } else {
            // 将选中内容按换行符分割
            const lines = selectedText.split('\n');
            
            // 如果只有一行，直接应用标题
            if (lines.length === 1) {
              this.editor.chain()
                .focus()
                .setTextSelection({ from, to })
                .toggleHeading({ level })
                .run();
            } else {
              // 如果有多行，先将选中内容转换为普通段落
              this.editor.chain()
                .focus()
                .setTextSelection({ from, to })
                .setParagraph()
                .run();
              
              // 然后只对第一行应用标题
              const firstLineLength = lines[0].length;
              this.editor.chain()
                .focus()
                .setTextSelection({ 
                  from, 
                  to: from + firstLineLength 
                })
                .toggleHeading({ level })
                .run();
            }
          }
        } else {
          // 如果没有选中文本，使用默认行为
          this.editor.chain().focus().toggleHeading({ level }).run();
        }
      }
    },
    
    // 修改段落设置方法
    setParagraph() {
      if (this.editor) {
        this.editor.chain().focus().setParagraph().run();
      }
    },
  }
}
</script>

<style scoped>
.section-wrapper {
  display: block;
  width: 100%;
  margin: 0 auto;
  margin-top: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  min-height: 400px;
  padding: 12px 16px;
}

.editor-toolbar {
  padding: 8px 24px;
  border-bottom: 1px solid #d9d9d9;
  background: #fafafa;
  display: flex;
  gap: 24px;
  align-items: center;
  position: sticky;
  top: 12px;
  z-index: 10;
  min-width: 800px;
  overflow-x: auto;
  border-radius: 4px;
}

.editor-toolbar :deep(.ant-btn) {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar :deep(.ant-btn-group) {
  gap: 4px;
  display: flex;
}

.editor-toolbar :deep(.ant-divider-vertical) {
  height: 24px;
  margin: 0 4px;
}

.content-textarea {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  font-size: 16px;
}

.content-textarea :deep(.ProseMirror) {
  min-height: 800px;
  outline: none;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 16px;
  padding: 0 16px;
}

.content-textarea :deep(.ProseMirror *) {
  font-family: inherit !important;
}

.content-textarea :deep(.ProseMirror b),
.content-textarea :deep(.ProseMirror strong) {
  font-family: inherit !important;
  font-weight: bold;
}

.content-textarea :deep(.ProseMirror i),
.content-textarea :deep(.ProseMirror em) {
  font-family: inherit !important;
  font-style: italic;
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

.content-textarea :deep(.ProseMirror-focused) {
  outline: none;
  background-color: #fff;
}

.content-textarea :deep(.ProseMirror-selectednode) {
  outline: 2px solid #1890ff;
}

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
  max-height: 225px;
  display: block;
  border: none;
}

.content-textarea :deep(.video-container:hover) {
  cursor: pointer;
  opacity: 0.95;
}

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

.content-textarea :deep(.content-subtitle) {
  font-size: 1.25em;
  font-weight: 600;
  color: #374151;
  display: inline-block;
  line-height: 1.4;
}

.content-textarea :deep(h1) {
  font-size: 2.5em;
  font-weight: 700;
  margin: 0.67em 0;
  line-height: 1.2;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.3em;
}

.content-textarea :deep(h2) {
  font-size: 2em;
  font-weight: 700;
  margin: 0.83em 0;
  line-height: 1.3;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.3em;
}

.content-textarea :deep(h3) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0;
  line-height: 1.4;
  color: #374151;
}

.content-textarea :deep(h4) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1.33em 0;
  line-height: 1.5;
  color: #4b5563;
}

.content-textarea :deep(h5) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 1.67em 0;
  line-height: 1.6;
  color: #6b7280;
}

/* 调试区域样式 */
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
  border-radius: 4px;
  color: #334155;
  width: 100%;
  min-height: 300px;
}

/* 链接预览样式 */
.selected-text-preview {
  margin-bottom: 16px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  word-break: break-all;
}

/* 工具栏按钮激活状态 */
.editor-toolbar :deep(.ant-btn.active) {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

/* 添加全屏模式相关样式 */
.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: white;
  overflow-y: auto;
  padding: 0;
}

.fullscreen-mode .editor-toolbar {
  position: sticky;
  top: 0;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fullscreen-mode .content-textarea {
  height: calc(100vh - 57px); /* 工具栏高度 */
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.fullscreen-mode .debug-area {
  max-width: 900px;
  margin: 20px auto;
}

.fullscreen-toggle {
  margin-left: auto;
}
</style> 