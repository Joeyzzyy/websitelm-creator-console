<template>
  <div class="section-wrapper">
    <div class="editor-area">
      <div class="editor-content">
        <a-row :gutter="24">
          <!-- 原有的编辑表单内容 -->
          <a-col :span="24">
            <a-form layout="vertical">
              <a-form-item label="Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.title }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Description">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.description }}</span>
                  <a-textarea
                    v-model:value="localSection.leftContent.description"
                    :disabled="disabled"
                    :rows="3"
                    @change="handleChange"
                    :style="{ minHeight: '120px' }"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Button Text">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonText }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.buttonText"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Button Link">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.buttonLink }}</span>
                  <a-input
                    v-model:value="localSection.leftContent.buttonLink"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
            </a-form>
          </a-col>
  
          <a-col :span="20">
            <div style="margin-bottom: 12px; color: #666;">
              Module Content Area
            </div>
            <a-button 
              v-if="!disabled"
              block 
              type="primary"
              class="add-module-btn"
              @click="addModule"
            >
              Add Module
            </a-button>
            <div class="modules-grid">
              <a-row :gutter="[16, 16]">
                <a-col 
                  v-for="(module, index) in localSection.rightContent" 
                  :key="index"
                  :span="24"
                >
                  <div class="module-card">
                    <a-form layout="vertical">
                      <div class="module-header">
                        <span>Module {{ index + 1 }}</span>
                        <a-button
                          v-if="!disabled"
                          type="text"
                          class="delete-btn"
                          @click="removeModule(index)"
                        >
                          <template #icon>
                            <delete-outlined />
                          </template>
                        </a-button>
                      </div>
                      <a-form-item label="Icon">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleIcon }}</span>
                          <div class="icon-input-wrapper">
                            <a-input
                              v-model:value="module.icon"
                              :disabled="disabled"
                              @change="handleChange"
                            />
                            <a-button
                              v-if="!disabled"
                              type="primary"
                              class="change-icon-btn"
                              @click="openIconPicker(index)"
                            >
                              Change
                            </a-button>
                          </div>
                          <div v-if="module.icon" class="icon-preview">
                            <Icon :icon="module.icon" width="24" height="24" />
                          </div>
                        </div>
                      </a-form-item>
                      <a-form-item label="Title">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleTitle }}</span>
                          <a-input
                            v-model:value="module.title"
                            :disabled="disabled"
                            @change="handleChange"
                          />
                        </div>
                      </a-form-item>
                      <a-form-item label="Content">
                        <div class="input-with-tag">
                          <span class="html-tag">{{ tags.moduleContent }}</span>
                          <a-textarea 
                            v-model:value="module.content"
                            :disabled="disabled"
                            :rows="3"
                            @change="handleChange"
                            :style="{ minHeight: '120px' }"
                          />
                        </div>
                      </a-form-item>
                    </a-form>
                  </div>
                </a-col>
              </a-row>
            </div>
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
        <ProductBenefitsWithBlocksPreview 
          :section="localSection"
          :styles="styles"
        />
      </div>
    </div>
    
    <!-- Icon Picker Modal -->
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
import ProductBenefitsWithBlocksPreview from './ProductBenefitsWithBlocksPreview.vue'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { Icon } from '@iconify/vue'

export default {
  name: 'ProductBenefitsWithFourBlocks',
  extends: BaseSection,
  components: {
    ProductBenefitsWithBlocksPreview,
    DeleteOutlined,
    SearchOutlined,
    Icon
  },
  emits: ['update'],
  computed: {
    tags() {
      return SECTION_TAGS.ProductBenefitsWithBlocks
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
        leftContent: {
          title: '',
          description: '',
          buttonText: '',
          buttonLink: ''
        },
        rightContent: [],
        ...JSON.parse(JSON.stringify(this.section))
      },
      styles: themeConfig.normal,
      currentModuleIndex: null,
      iconPickerVisible: false,
      iconSearch: '',
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
  created() {
    if (this.section) {
      this.localSection = JSON.parse(JSON.stringify(this.section))
    }
  },
  watch: {
    section: {
      handler(newVal) {
        if (newVal) {
          this.localSection = JSON.parse(JSON.stringify(newVal))
        } else {
          this.localSection = {
            leftContent: {
              title: '',
              description: '',
              buttonText: '',
              buttonLink: ''
            },
            rightContent: []
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.emitUpdate(this.localSection)
    },
    addModule() {
      if (!Array.isArray(this.localSection.rightContent)) {
        this.localSection.rightContent = []
      }
      
      this.localSection.rightContent.push({
        icon: '',
        title: '',
        content: ''
      })
      this.handleChange()
    },
    removeModule(index) {
      this.localSection.rightContent.splice(index, 1)
      this.handleChange()
    },
    openIconPicker(index) {
      this.currentModuleIndex = index
      this.iconPickerVisible = true
      this.selectedIcon = this.localSection.rightContent[index].icon
    },
    closeIconPicker() {
      this.iconPickerVisible = false
      this.currentModuleIndex = null
      this.selectedIcon = null
      this.clearIconSearch()
    },
    selectIcon(iconId) {
      this.selectedIcon = iconId
      if (this.currentModuleIndex !== null) {
        this.localSection.rightContent[this.currentModuleIndex].icon = iconId
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
    }
  }
}
</script>

<style scoped>
@import '../../../assets/styles/section-form.css';

/* 基本表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
}

.modules-grid {
  margin: 0;
}

/* 左侧内容卡片样式 */
.module-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  height: 100%;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  width: 100%;
}

.module-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.module-header span {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.add-module-btn {
  margin-bottom: 16px;
  height: 44px;
  font-size: 14px;
  width: fit-content;
  padding: 0 24px;
}

:deep(.ant-select-selector) {
  background: transparent !important;
  border-color: #e5e7eb !important;
}

:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: #1890ff !important;
}

@media (max-width: 1200px) {
  .module-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .modules-grid {
    margin: 0;
  }
  
  .module-card {
    padding: 16px;
  }
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
}

/* 复用 TitleSection 的样式 */
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
  max-height: 1000px;
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
}

.preview-header span {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.preview-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  flex: 0 0 auto;
}

.module-header .delete-btn {
  color: #ff4d4f !important;
  transition: all 0.3s;
  padding: 4px;
  height: 24px;
  width: 24px;
  line-height: 1;
}

.module-header .delete-btn:hover {
  color: #ff7875 !important;
  background: rgba(255, 77, 79, 0.1);
}

.module-header :deep(.anticon) {
  font-size: 14px;
  color: inherit;
}

.icon-input-wrapper {
  display: flex;
  gap: 8px;
  flex: 1;
}

.change-icon-btn {
  padding: 0 8px;
}

.icon-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 8px;
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

.icons-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-item {
  position: relative;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  padding: 0 4px;
  position: absolute;
  bottom: 8px;
  left: 0;
}

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

.icons-grid {
  padding: 16px;
  background: white;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

@media (max-width: 640px) {
  .icons-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
  
  .icon-item {
    min-height: 60px;
  }
}

.icon-collections {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: 500px;
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

.no-results {
  padding: 32px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 16px;
}
</style>