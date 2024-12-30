<template>
  <div class="editor-container">
    <div class="preview-section">
      <HeaderPreview :data="headerData" />
    </div>

    <h2 class="editor-title">Header Settings</h2>
    
    <a-form layout="vertical">
      <a-row :gutter="16">
        <!-- 左列 -->
        <a-col :span="12">
          <!-- Logo设置 -->
          <div class="section">
            <h3 class="section-title">Logo Settings</h3>
            <a-form-item label="Logo URL">
              <div class="image-input-wrapper">
                <a-input v-model:value="headerData.logo.src" />
                <a-button 
                  type="primary"
                  class="change-image-btn"
                  @click="openImageLibrary"
                >
                  Change
                </a-button>
              </div>
            </a-form-item>
            
            <div class="image-preview" v-if="headerData.logo.src">
              <a-image :src="headerData.logo.src" :width="200" />
            </div>
            
            <a-form-item label="Logo Alt Text">
              <a-input v-model:value="headerData.logo.alt" />
            </a-form-item>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Width">
                  <a-input-number
                    v-model:value="headerData.logo.width"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Height">
                  <a-input-number
                    v-model:value="headerData.logo.height"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- 操作按钮 -->
          <div class="section">
            <h3 class="section-title">Action Items</h3>
            <div class="action-list">
              <div v-for="(item, index) in headerData.actionItems" :key="index" class="action-item">
                <a-form-item>
                  <a-input-group compact>
                    <a-input
                      v-model:value="item.label"
                      style="width: 40%"
                      placeholder="Label"
                    />
                    <a-input
                      v-model:value="item.href"
                      style="width: 60%"
                      placeholder="URL"
                    />
                  </a-input-group>

                  <div class="button-style-select">
                    <a-radio-group 
                      v-model:value="item.buttonType" 
                      button-style="solid"
                    >
                      <a-radio-button value="primary">Primary</a-radio-button>
                      <a-radio-button value="default">Default</a-radio-button>
                      <a-radio-button value="link">Link</a-radio-button>
                      <a-radio-button value="text">Text</a-radio-button>
                      <a-radio-button value="dashed">Dashed</a-radio-button>
                    </a-radio-group>
                  </div>

                  <a-button 
                    type="text" 
                    danger 
                    class="delete-action-btn"
                    @click="removeActionItem(index)"
                  >
                    <delete-outlined />
                  </a-button>
                </a-form-item>
              </div>
              
              <a-button type="dashed" block @click="addActionItem">
                Add Action Item
              </a-button>
            </div>
          </div>
        </a-col>

        <!-- 右列 -->
        <a-col :span="12">
          <!-- 主菜单项 -->
          <div class="section">
            <h3 class="section-title">Main Menu Items</h3>
            <div class="menu-list">
              <div v-for="(item, index) in headerData.mainMenuItems" :key="index" class="menu-item">
                <div class="menu-item-main">
                  <a-input
                    v-model:value="item.label"
                    style="width: 100%"
                    placeholder="Menu label"
                  />
                  <a-button type="text" danger @click="removeMenuItem(index)">
                    <delete-outlined />
                  </a-button>
                </div>

                <!-- 子菜单项 -->
                <div class="submenu-list" v-if="item.children && item.children.length">
                  <div 
                    v-for="(subItem, subIndex) in item.children" 
                    :key="subIndex"
                    class="submenu-item"
                  >
                    <a-input-group compact>
                      <a-input
                        v-model:value="subItem.label"
                        style="width: 40%"
                        placeholder="Submenu label"
                      />
                      <a-input
                        v-model:value="subItem.href"
                        style="width: 60%"
                        placeholder="URL"
                      />
                    </a-input-group>
                    <a-button 
                      type="text" 
                      danger 
                      @click="removeSubMenuItem(index, subIndex)"
                    >
                      <delete-outlined />
                    </a-button>
                  </div>
                </div>

                <div class="submenu-actions">
                  <a-button 
                    type="dashed" 
                    size="small"
                    @click="addSubMenuItem(index)"
                  >
                    Add Submenu Item
                  </a-button>
                </div>
              </div>

              <a-button type="dashed" block @click="addMenuItem">
                Add Menu Item
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>

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
</template>

<script setup>
import { ref, watch } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import HeaderPreview from './HeaderPreview.vue'
import ImageLibrary from '../sections/common/ImageLibrary.vue'

const emit = defineEmits(['update'])

const headerData = ref({
  logo: {
    src: "assets/images/placeholder.png",
    alt: "Logo",
    width: 110,
    height: 53
  },
  mainMenuItems: [
    { 
      label: 'Features',
      children: [
        { label: 'Feature 1', href: 'https://websitelm.com/features/feature-1' },
        { label: 'Feature 2', href: 'https://websitelm.com/features/feature-2' }
      ]
    },
    { 
      label: 'Solutions',
      children: []
    },
    { 
      label: 'Resources',
      children: []
    },
  ],
  actionItems: [
    { 
      key: 'login', 
      label: 'Login',
      href: 'https://app.websitelm.com',
      isExternal: false,
      buttonType: 'link'
    },
    { 
      key: 'get-started', 
      label: 'Get Started',
      href: 'https://app.websitelm.com',
      isExternal: false,
      buttonType: 'primary'
    }
  ]
})

// 菜单项方法
const addMenuItem = () => {
  headerData.value.mainMenuItems.push({ 
    label: '',
    children: []
  })
}

const removeMenuItem = (index) => {
  headerData.value.mainMenuItems.splice(index, 1)
}

const addSubMenuItem = (parentIndex) => {
  if (!headerData.value.mainMenuItems[parentIndex].children) {
    headerData.value.mainMenuItems[parentIndex].children = []
  }
  headerData.value.mainMenuItems[parentIndex].children.push({
    label: '',
    href: 'https://'
  })
}

const removeSubMenuItem = (parentIndex, subIndex) => {
  headerData.value.mainMenuItems[parentIndex].children.splice(subIndex, 1)
}

// 操作按钮方法
const addActionItem = () => {
  headerData.value.actionItems.push({
    key: '',
    label: '',
    href: '',
    isExternal: false,
    buttonType: 'link'
  })
}

const removeActionItem = (index) => {
  headerData.value.actionItems.splice(index, 1)
}

// 添加图片库相关状态
const imageLibraryVisible = ref(false)
const selectedImage = ref(null)

// 图片库相关方法
const openImageLibrary = () => {
  imageLibraryVisible.value = true
}

const closeImageLibrary = () => {
  imageLibraryVisible.value = false
  selectedImage.value = null
}

const onImageSelect = (image) => {
  selectedImage.value = image
}

const handleImageSelect = () => {
  if (selectedImage.value) {
    headerData.value.logo.src = selectedImage.value.url
  }
  closeImageLibrary()
}

watch(headerData, (newValue) => {
  emit('update', newValue)
}, { deep: true })
</script>

<style scoped>
.editor-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.preview-section {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 8px;
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  position: relative;
}

.preview-section::before {
  content: 'Preview';
  position: absolute;
  top: -12px;
  left: 16px;
  background: white;
  padding: 0 8px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
}

.section {
  background: white;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 32px;
  border: 1px solid #e5e7eb;
}

.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.menu-item-main {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.submenu-list {
  padding-left: 24px;
  border-left: 2px dashed #e5e7eb;
  margin: 16px 0;
}

.submenu-item {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.submenu-actions {
  margin-top: 8px;
  padding-left: 24px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  position: relative;
  padding-right: 40px;
  margin-bottom: 24px;
}

.button-style-select {
  margin-top: 8px;
}

.delete-action-btn {
  position: absolute;
  right: 0;
  top: 0;
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

:deep(.ant-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.ant-radio-button-wrapper) {
  border-radius: 6px;
}

:deep(.ant-radio-button-wrapper:not(:first-child)::before) {
  display: none;
}

:deep(.ant-segmented) {
  height: 32px;
  line-height: 32px;
}
</style>
