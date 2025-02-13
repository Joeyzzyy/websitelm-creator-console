<template>
  <div class="section-wrapper">
    <!-- 编辑区域 -->
    <div class="editor-area">
      <div class="editor-content">
        <a-row :gutter="[24, 24]">
          <!-- 顶部内容 -->
          <a-col :span="24" class="mb-6">
            <a-form layout="vertical">
              <a-form-item label="Top Content">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.title }}</span>
                  <a-input
                    v-model:value="localSection.topContent.title"
                    :disabled="disabled"
                    placeholder="Title"
                    @change="handleChange"
                  />
                </div>
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.description }}</span>
                  <a-textarea
                    v-model:value="localSection.topContent.description"
                    :disabled="disabled"
                    :rows="2"
                    placeholder="Description"
                    @change="handleChange"
                  />
                </div>
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonText }}</span>
                  <a-input
                    v-model:value="localSection.topContent.buttonText"
                    :disabled="disabled"
                    placeholder="Button Text"
                    @change="handleChange"
                  />
                </div>
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonLink }}</span>
                  <a-input
                    v-model:value="localSection.topContent.buttonLink"
                    :disabled="disabled"
                    placeholder="Button Link"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </a-form>
          </a-col>

          <!-- 左侧图片内容 -->
          <a-col :span="24">
            <a-form layout="vertical">
              <a-form-item label="Image Content">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.imageUrl }}</span>
                  <div class="image-input-wrapper">
                    <a-input
                      v-model:value="localSection.leftContent.imageUrl"
                      :disabled="disabled"
                      placeholder="Image URL"
                      @change="handleChange"
                    />
                    <a-button 
                      type="primary"
                      class="change-image-btn"
                      @click="openImageLibrary"
                    >
                      Change
                    </a-button>
                  </div>
                </div>
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.imageAlt }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.imageAlt"
                    :disabled="disabled"
                    placeholder="Image Alt Text"
                    @change="handleChange"
                  />
                </div>
                <div class="image-preview" v-if="localSection.leftContent.imageUrl">
                  <a-image :src="localSection.leftContent.imageUrl" :width="200" />
                </div>
              </a-form-item>
            </a-form>
          </a-col>

          <!-- 右侧表格内容 -->
          <a-col :span="24">
            <div style="margin-bottom: 12px; color: #666;">
              Content Items - Maximum 4 items allowed
            </div>
            <div v-for="(item, index) in localSection.rightContent" :key="index">
              <a-form layout="vertical">
                <a-form-item>
                  <div class="flex justify-between items-center mb-2">
                    <span>Item {{ index + 1 }}</span>
                    <a-button 
                      v-if="!disabled" 
                      type="text" 
                      class="delete-btn" 
                      @click="removeRightItem(index)"
                    >
                      <template #icon><delete-outlined /></template>
                    </a-button>
                  </div>
                  <div class="input-with-tag mb-4">
                    <span class="html-tag">icon</span>
                    <div class="icon-input-wrapper">
                      <a-input
                        v-model:value="item.icon"
                        :disabled="disabled"
                        placeholder="Icon identifier"
                        @change="handleChange"
                      />
                      <a-button 
                        type="primary"
                        class="change-icon-btn"
                        @click="openIconPicker(index)"
                      >
                        Change
                      </a-button>
                    </div>
                    <div v-if="item.icon" class="icon-preview">
                      <Icon :icon="item.icon" width="24" height="24" />
                    </div>
                  </div>
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.contentTitle }}</span>
                    <a-input
                      v-model:value="item.contentTitle"
                      :disabled="disabled"
                      placeholder="Title"
                      @change="handleChange"
                    />
                  </div>
                  <div class="input-with-tag">
                    <span class="html-tag">{{ tags.content }}</span>
                    <a-textarea
                      v-model:value="item.content"
                      :disabled="disabled"
                      :rows="3"
                      placeholder="Content"
                      @change="handleChange"
                    />
                  </div>
                </a-form-item>
              </a-form>
            </div>
            
            <a-button 
              v-if="!disabled && localSection.rightContent.length < 4" 
              type="dashed" 
              block 
              class="add-item-btn"
              @click="addRightItem"
            >
              Add Item
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-area">
      <div class="preview-header">
        <span>Preview</span>
      </div>
      
      <div class="preview-content">
        <ProductBenefitsWithTablePreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>

    <!-- Emoji Picker Modal -->
    <a-modal
      v-model:visible="emojiPickerVisible"
      :footer="null"
      :closable="false"
      :width="350"
      centered
      class="emoji-picker-modal"
      @cancel="closeEmojiPicker"
    >
      <EmojiPicker
        @select="onEmojiSelect"
      />
    </a-modal>

    <!-- 添加图片库模态框 -->
    <a-modal
      v-model:visible="imageLibraryVisible"
      title="Select Image"
      @ok="handleImageSelect"
      @cancel="closeImageLibrary"
      width="800px"
    >
      <image-library
        v-if="imageLibraryVisible"
        @select="onImageSelect"
        @close="closeImageLibrary"
      />
    </a-modal>

    <!-- 添加图标选择器模态框 -->
    <a-modal
      v-model:visible="iconPickerVisible"
      title="Select Icon"
      @ok="handleIconSelect"
      @cancel="closeIconPicker"
      width="800px"
      :footer="null"
      class="icon-picker-modal"
    >
      <div class="icon-picker-container">
        <div class="icon-search">
          <a-input
            v-model:value="iconSearch"
            placeholder="Search icons..."
            @input="handleIconSearch"
          >
            <template #prefix>
              <search-outlined />
            </template>
          </a-input>
        </div>
        <div class="icon-collections">
          <div 
            class="collection" 
            v-for="collection in filteredIconCollections" 
            :key="collection.name"
          >
            <h3>{{ collection.name }}</h3>
            <div class="icons-grid">
              <div
                v-for="icon in collection.icons"
                :key="icon"
                class="icon-item"
                :class="{ active: selectedIcon === `${collection.prefix}:${icon}` }"
                @click="selectIcon(`${collection.prefix}:${icon}`)"
              >
                <Icon :icon="`${collection.prefix}:${icon}`" width="24" height="24" />
                <span class="icon-name">{{ icon }}</span>
              </div>
            </div>
          </div>
          <div v-if="showNoResults" class="no-results">
            No icons found matching "{{ iconSearch }}"
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import BaseSection from '../common/BaseSection.vue'
import { SECTION_TAGS } from '../common/SectionTag'
import themeConfig from '../../../assets/config/themeConfig'
import ProductBenefitsWithTablePreview from './ProductBenefitsWithTablePreview.vue'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import ImageLibrary from '../common/ImageLibrary.vue'
import { Icon } from '@iconify/vue'

export default {
  name: 'ProductBenefitsWithTable',
  extends: BaseSection,
  components: {
    ProductBenefitsWithTablePreview,
    DeleteOutlined,
    EmojiPicker,
    ImageLibrary,
    Icon,
    SearchOutlined
  },
  computed: {
    tags() {
      return SECTION_TAGS.ProductBenefitsWithTable
    },
    getButtonStyle() {
      return `${this.styles.button.base} ${this.styles.button.variants.secondary}`
    },
    getButtonLink() {
      const link = this.localSection.topContent.buttonLink
      return link?.startsWith('http') ? link : `https://${link}`
    },
    filteredIconCollections() {
      if (!this.iconSearch) {
        return this.iconCollections;
      }

      const searchTerm = this.iconSearch.toLowerCase();
      return this.iconCollections.map(collection => {
        const filteredIcons = collection.icons.filter(icon => 
          icon.toLowerCase().includes(searchTerm)
        );
        
        return filteredIcons.length ? {
          ...collection,
          icons: filteredIcons
        } : null;
      }).filter(Boolean);
    },
    showNoResults() {
      return this.iconSearch && this.filteredIconCollections.length === 0;
    }
  },
  data() {
    return {
      localSection: {
        topContent: {
          title: '',
          description: '',
          buttonText: '',
          buttonLink: ''
        },
        leftContent: {
          imageUrl: '',
          imageAlt: ''
        },
        rightContent: [],
        ...JSON.parse(JSON.stringify(this.section || {}))
      },
      styles: themeConfig.normal,
      emojiPickerVisible: false,
      currentTarget: {
        index: null,
        side: null // 'left' 或 'right'
      },
      imageLibraryVisible: false,
      selectedImage: null,
      iconPickerVisible: false,
      iconSearch: '',
      currentItemIndex: null,
      selectedIcon: null,
      iconCollections: [
        {
          name: 'Material Design Icons',
          prefix: 'mdi',
          icons: [
            // 通用/基础
            'home', 'account', 'cog', 'bell', 'star', 'heart', 'magnify', 'plus', 'minus', 'close',
            'check', 'alert', 'information', 'help', 'settings', 'menu', 'refresh', 'sync', 'download', 'upload',
            
            // 文件/文档
            'file', 'folder', 'folder-open', 'document', 'pdf', 'image', 'video', 'music', 'archive', 'download',
            
            // 通信/社交
            'email', 'message', 'chat', 'phone', 'video-call', 'share', 'send', 'twitter', 'facebook', 'linkedin',
            
            // 商务/金融
            'bank', 'credit-card', 'cash', 'cart', 'store', 'tag', 'gift', 'wallet', 'currency-usd', 'chart-line',
            
            // 设备/技术
            'laptop', 'desktop', 'tablet', 'phone', 'printer', 'keyboard', 'mouse', 'wifi', 'bluetooth', 'battery',
            
            // 用户界面
            'view-grid', 'view-list', 'dots-vertical', 'dots-horizontal', 'menu', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down', 'play',
            
            // 安全/隐私
            'shield', 'lock', 'unlock', 'key', 'eye', 'eye-off', 'fingerprint', 'security', 'incognito', 'alert-circle'
          ]
        },
        {
          name: 'Phosphor Icons',
          prefix: 'ph',
          icons: [
            // 基础图标
            'house', 'user', 'gear', 'bell', 'star', 'heart', 'magnifying-glass', 'plus', 'minus', 'x',
            'check', 'warning', 'info', 'question', 'wrench', 'list', 'arrows-clockwise', 'cloud', 'download', 'upload',
            
            // 文件管理
            'file', 'folder', 'folder-open', 'file-text', 'file-pdf', 'image-square', 'video', 'music-notes', 'archive', 'cloud-arrow-down',
            
            // 通信工具
            'envelope', 'chat', 'phone', 'video-camera', 'share', 'paper-plane', 'twitter-logo', 'facebook-logo', 'linkedin-logo', 'instagram-logo',
            
            // 商业/电商
            'shopping-cart', 'storefront', 'tag', 'gift', 'credit-card', 'money', 'bank', 'trend-up', 'chart-line', 'calculator',
            
            // 设备/硬件
            'device-mobile', 'device-tablet', 'desktop', 'printer', 'keyboard', 'mouse', 'wifi-high', 'bluetooth', 'battery-full', 'plug',
            
            // 界面元素
            'grid-four', 'list-bullets', 'dots-three', 'dots-nine', 'caret-up', 'caret-down', 'arrow-left', 'arrow-right', 'play', 'pause',
            
            // 安全/验证
            'shield', 'lock', 'lock-open', 'key', 'eye', 'eye-slash', 'fingerprint', 'password', 'user-focus', 'check-circle'
          ]
        },
        {
          name: 'Carbon Icons',
          prefix: 'carbon',
          icons: [
            // 基础图标
            'home', 'user', 'settings', 'notification', 'star', 'favorite', 'search', 'add', 'subtract', 'close',
            'checkmark', 'warning', 'information', 'help', 'tool', 'menu', 'refresh', 'sync', 'download', 'upload',
            
            // 数据/分析
            'chart-line', 'chart-bar', 'chart-pie', 'chart-bubble', 'data-table', 'analytics', 'report', 'dashboard', 'forecast', 'data-vis',
            
            // 企业/商务
            'enterprise', 'finance', 'growth', 'strategy', 'partnership', 'portfolio', 'investment', 'market', 'trade', 'optimization',
            
            // 技术/开发
            'code', 'development', 'api', 'cloud', 'security', 'data-base', 'network', 'container', 'terminal', 'function',
            
            // 协作/团队
            'collaboration', 'group', 'partnership', 'meeting', 'presentation', 'share', 'connect', 'chat', 'email', 'calendar',
            
            // 工业/制造
            'industry', 'factory', 'assembly', 'manufacturing', 'inventory', 'shipping', 'tools', 'machine', 'equipment', 'production'
          ]
        }
      ]
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
      this.$nextTick(() => {
        this.emitUpdate(this.localSection)
      })
    },
    addRightItem() {
      if (this.localSection.rightContent.length < 4) {
        this.localSection.rightContent.push({
          icon: '',
          contentTitle: '',
          content: ''
        })
        this.handleChange()
      }
    },
    removeRightItem(index) {
      this.localSection.rightContent.splice(index, 1)
      this.handleChange()
    },
    showEmojiPicker(e, index, side) {
      e.stopPropagation()
      this.currentTarget = { index, side }
      this.emojiPickerVisible = true
    },
    closeEmojiPicker() {
      this.emojiPickerVisible = false
      this.currentTarget = { index: null, side: null }
    },
    onEmojiSelect(emoji) {
      const { index, side } = this.currentTarget
      if (side === 'right') {
        this.localSection.rightContent[index].contentTitle = emoji.i
      }
      this.closeEmojiPicker()
      this.handleChange()
    },
    openImageLibrary() {
      this.imageLibraryVisible = true
    },
    closeImageLibrary() {
      this.imageLibraryVisible = false
      this.selectedImage = null
    },
    onImageSelect(image) {
      this.selectedImage = image
    },
    handleImageSelect() {
      if (this.selectedImage) {
        this.localSection.leftContent.imageUrl = this.selectedImage.url
        this.handleChange()
      }
      this.closeImageLibrary()
    },
    openIconPicker(index) {
      this.currentItemIndex = index
      this.iconPickerVisible = true
      this.selectedIcon = this.localSection.rightContent[index].icon
    },
    closeIconPicker() {
      this.iconPickerVisible = false
      this.currentItemIndex = null
      this.selectedIcon = null
      this.clearIconSearch()
    },
    selectIcon(iconId) {
      this.selectedIcon = iconId
      if (this.currentItemIndex !== null) {
        this.localSection.rightContent[this.currentItemIndex].icon = iconId
        this.handleChange()
      }
      this.closeIconPicker()
    },
    handleIconSearch() {
      const collectionsElement = this.$el.querySelector('.icon-collections');
      if (collectionsElement) {
        collectionsElement.scrollTop = 0;
      }
    },
    clearIconSearch() {
      this.iconSearch = '';
    },
    handleIconSelect() {
      // 实现图标选择逻辑
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

/* 基础表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

/* 左侧内容卡片样式 */
.left-content-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header span {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

/* HTML 标签样式 */
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

/* 输入框组合样式 */
.input-with-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.input-with-tag:last-child {
  margin-bottom: 0;
}

/* 添加按钮样式 */
.add-item-btn {
  margin-bottom: 24px;
  height: 44px;
  font-size: 14px;
}

/* 右侧内容区域样式 */
.right-content {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

/* 表单控件样式 */
:deep(.ant-input),
:deep(.ant-textarea) {
  border-radius: 6px;
  border-color: #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.ant-input:hover),
:deep(.ant-textarea:hover) {
  border-color: #1677ff;
}

/* 删除按钮样式 */
:deep(.ant-btn-link) {
  color: #ef4444;
  padding: 4px 8px;
  height: auto;
}

:deep(.ant-btn-link:hover) {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

/* 整体容器样式 */
.section-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
}

/* 添加新的样式 */
.section-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: fit-content;
}

.editor-area {
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border-radius: 8px;
  padding: 24px;
  max-height: none;
  overflow-y: auto;
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
}

.preview-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  flex: 0 0 auto;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.flex-container {
  display: flex;
  gap: 48px;
}

.left-side, .right-side {
  flex: 1;
}

.benefits-grid {
  display: grid;
  gap: 16px;
}

.benefit-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
}

.icon {
  font-size: 24px;
}

.main-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtitle {
  margin: 16px 0 24px;
}

.action-button {
  display: inline-block;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
}

.delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

:deep(.anticon) {
  font-size: 14px;
  color: inherit;
}

/* 为每个 item 容器添加间距 */
.left-content > div {
  margin-bottom: 24px;
}

/* 最后一个 item 不需要底部间距 */
.left-content > div:last-child {
  margin-bottom: 0;
}

.emoji-input-wrapper {
  display: flex;
  gap: 8px;
  flex: 1;
}

.emoji-trigger {
  padding: 0 8px;
}

:deep(.emoji-picker-modal) {
  .ant-modal-content {
    padding: 12px;
    border-radius: 8px;
  }
  
  .ant-modal-body {
    padding: 0;
  }
}

:deep(.v3-emoji-picker) {
  --ep-color-bg: #ffffff;
  --ep-color-border: #e4e7ea;
  --ep-color-hover: #f7f9fa;
  border: none;
  box-shadow: none;
}

.image-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.change-image-btn {
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

.change-image-btn:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.image-preview {
  margin-top: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.icon-picker-container {
  height: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.icon-search {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.icon-search :deep(.ant-input-affix-wrapper) {
  border-radius: 6px;
}

.icon-search :deep(.anticon) {
  color: #999;
}

.icon-collections {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: 500px;
}

.collection {
  margin-bottom: 24px;
}

.collection h3 {
  margin-bottom: 16px;
  color: #1f2937;
  font-size: 16px;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  background: #f4f4f5;
}

.icon-item.active {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.icon-name {
  font-size: 12px;
  color: #4b5563;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.icon-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.change-icon-btn {
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

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f8fafc;
  border-radius: 6px;
  margin-left: 8px;
}

.icon-preview :deep(.iconify) {
  color: #6B7280; /* 与 Preview 组件中的图标颜色保持一致 */
  font-size: 20px;
}

/* 添加滚动条样式 */
.icon-collections::-webkit-scrollbar {
  width: 6px;
}

.icon-collections::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.icon-collections::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.icon-collections::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.no-results {
  padding: 32px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 16px;
}

/* 优化图标显示 */
.icon-item {
  position: relative;
  min-height: 80px;
}

.icon-item:hover {
  background: #f4f4f5;
}

.icon-item.active {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.icon-name {
  font-size: 12px;
  color: #4b5563;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  padding: 0 4px;
  position: absolute;
  bottom: 8px;
  left: 0;
}

/* 添加加载状态样式 */
.icon-collections {
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

/* 优化滚动条样式 */
.icon-collections {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.icon-collections::-webkit-scrollbar {
  width: 6px;
}

.icon-collections::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.icon-collections::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.icon-collections::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 集合标题样式优化 */
.collection h3 {
  position: sticky;
  top: 0;
  background: white;
  padding: 16px;
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  border-bottom: 1px solid #f0f0f0;
  z-index: 1;
}

/* 图标网格容器样式优化 */
.icons-grid {
  padding: 16px;
  background: white;
}

/* 添加响应式布局 */
@media (max-width: 640px) {
  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
  
  .icon-item {
    min-height: 60px;
  }
}
</style>