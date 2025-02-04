<template>
  <div class="editor-container">
    <div class="preview-section">
      <HeaderPreview :data="headerData" :styles="headerStyles" />
      
      <!-- Simplified color settings -->
      <div class="color-settings">
        <div class="color-type-switch">
          <a-radio-group v-model:value="headerStyles.backgroundType" size="small">
            <a-radio value="solid">Solid</a-radio>
            <a-radio value="gradient">Gradient</a-radio>
          </a-radio-group>
        </div>

        <div class="color-pickers">
          <!-- Solid color picker -->
          <template v-if="headerStyles.backgroundType === 'solid'">
            <div class="color-input">
              <div 
                class="color-preview"
                :style="{ background: headerStyles.backgroundColor }"
                @click="toggleColorPicker('background', $event)"
              ></div>
              <input 
                v-model="headerStyles.backgroundColor"
                type="text"
                placeholder="#FFFFFF"
              />
            </div>
          </template>

          <!-- Gradient color pickers -->
          <template v-if="headerStyles.backgroundType === 'gradient'">
            <div class="gradient-inputs">
              <div class="color-input">
                <div 
                  class="color-preview"
                  :style="{ background: headerStyles.gradientStart }"
                  @click="toggleColorPicker('start', $event)"
                ></div>
                <input 
                  v-model="headerStyles.gradientStart"
                  type="text"
                  placeholder="#FFFFFF"
                />
              </div>
              <div class="color-input">
                <div 
                  class="color-preview"
                  :style="{ background: headerStyles.gradientEnd }"
                  @click="toggleColorPicker('end', $event)"
                ></div>
                <input 
                  v-model="headerStyles.gradientEnd"
                  type="text"
                  placeholder="#FFFFFF"
                />
              </div>
              <div class="angle-control">
                <div class="angle-hint">
                  Adjust gradient angle (0-360°)
                  <a-tooltip>
                    <template #title>
                      0° = left to right
                      90° = bottom to top
                      180° = right to left
                      270° = top to bottom
                    </template>
                    <info-circle-outlined />
                  </a-tooltip>
                </div>
                <Slider
                  v-model="headerStyles.gradientAngle"
                  :min="0"
                  :max="360"
                  :step="1"
                  class="angle-slider"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="editor-header">
      <h2 class="editor-title">Header Settings</h2>
      <a-button 
        type="primary"
        :loading="saving"
        @click="saveConfig"
      >
        Save Changes
      </a-button>
    </div>
    
    <a-form layout="vertical">
      <a-row :gutter="16">
        <!-- 左列 -->
        <a-col :span="12">
          <!-- Logo设置 -->
          <div class="section">
            <h3 class="section-title">Logo Settings</h3>
            <a-form-item label="Logo URL" class="compact-form-item">
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
              <div class="preview-wrapper">
                <a-image :src="headerData.logo.src" :width="200" />
                <div class="size-controls">
                  <div class="size-slider">
                    <span class="size-label">Scale:</span>
                    <Slider
                      v-model="logoScale"
                      :min="50"
                      :max="150"
                      :step="1"
                      class="scale-slider"
                      @update:modelValue="updateLogoSize"
                    />
                    <span class="size-value">{{ logoScale }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <a-form-item label="Logo Alt Text" class="compact-form-item">
              <a-input v-model:value="headerData.logo.alt" />
            </a-form-item>
            
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Width" class="compact-form-item">
                  <a-input-number
                    v-model:value="headerData.logo.width"
                    style="width: 100%"
                    :min="20"
                    :max="500"
                    addon-after="px"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Height" class="compact-form-item">
                  <a-input-number
                    v-model:value="headerData.logo.height"
                    style="width: 100%"
                    :min="20"
                    :max="500"
                    addon-after="px"
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
                  <div class="action-item-content">
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

                    <div class="action-item-style">
                      <a-input v-model:value="item.label" placeholder="Button Text" />
                      <div class="button-colors">
                        <div class="color-section">
                          <span class="color-label">Background</span>
                          <div 
                            class="color-preview"
                            :style="{ background: item.backgroundColor || '#1890ff' }"
                            @click="toggleColorPicker('actionBg-' + index, $event)"
                          ></div>
                        </div>
                        <div class="color-section">
                          <span class="color-label">Text Color</span>
                          <div 
                            class="color-preview"
                            :style="{ background: item.textColor || '#ffffff' }"
                            @click="toggleColorPicker('actionText-' + index, $event)"
                          ></div>
                        </div>
                      </div>
                    </div>
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
                  <a-input-group compact>
                    <a-input
                      v-model:value="item.label"
                      style="width: 40%"
                      placeholder="Menu label"
                    />
                    <a-input
                      v-model:value="item.link"
                      style="width: 60%"
                      placeholder="URL"
                    />
                  </a-input-group>
                  <a-button type="text" danger @click="removeMenuItem(index)">
                    <delete-outlined />
                  </a-button>
                </div>

                <!-- 添加外部链接选项 -->
                <div class="menu-item-options">
                  <a-checkbox v-model:checked="item.isExternal">Open in new tab</a-checkbox>
                </div>

                <!-- 添加字体粗细选择 -->
                <div class="menu-item-style">
                  <a-radio-group 
                    v-model:value="item.fontWeight" 
                    size="small"
                    button-style="solid"
                  >
                    <a-radio-button value="normal">Regular</a-radio-button>
                    <a-radio-button value="600">Bold</a-radio-button>
                  </a-radio-group>
                  <div class="color-section">
                    <span class="color-label">Text Color</span>
                    <div 
                      class="color-preview menu-color"
                      :style="{ background: item.color || '#4b5563' }"
                      @click="toggleColorPicker('menuItem-' + index, $event)"
                    ></div>
                  </div>
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

  <!-- Color picker popup -->
  <div 
    v-if="showColorPicker"
    class="color-picker-popup"
    :style="colorPickerPosition"
    @click.stop
  >
    <!-- Add color wheel picker -->
    <div class="color-wheel">
      <input 
        type="color" 
        :value="getCurrentColor()"
        @input="handleColorChange"
        class="color-wheel-input"
        @click.stop
      />
    </div>
    <div class="preset-colors">
      <div 
        v-for="color in presetColors"
        :key="color"
        class="preset-color"
        :style="{ background: color }"
        @click="selectColor(color)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import HeaderPreview from './HeaderPreview.vue'
import ImageLibrary from '../sections/common/ImageLibrary.vue'
import apiClient from '../../api/api'
import { message } from 'ant-design-vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const emit = defineEmits(['update'])

const props = defineProps({
  initialData: {
    type: Object,
    required: true
  },
  layoutId: {
    type: String,
    required: true
  }
})

console.log('Initial props data:', props.initialData)

const headerData = ref({
  logo: props.initialData?.logo || {
    src: '',
    alt: '',
    width: 200,
    height: 50
  },
  mainMenuItems: props.initialData?.mainMenuItems || [],
  actionItems: props.initialData?.actionItems?.map(item => ({
    key: item.key,
    label: item.label,
    href: item.href,
    isExternal: item.isExternal,
    variant: item.variant,
    backgroundColor: item.backgroundColor,
    textColor: item.textColor
  })) || []
})

// 修改 header 样式配置
const headerStyles = ref({
  backgroundType: props.initialData?.styles?.backgroundType || 'solid',
  backgroundColor: props.initialData?.styles?.backgroundColor || '#FFFFFF',
  gradientStart: props.initialData?.styles?.gradientStart || '#1890FF',
  gradientEnd: props.initialData?.styles?.gradientEnd || '#3B82F6',
  gradientAngle: props.initialData?.styles?.gradientAngle ?? 135
})

console.log('Initial headerStyles:', headerStyles.value)

// 监听数据变化
watch(() => props.initialData, (newValue) => {
  console.log('Full initialData:', newValue)
  if (!newValue) return
  
  headerData.value = {
    logo: newValue.logo || headerData.value.logo,
    mainMenuItems: newValue.mainMenuItems || [],
    actionItems: (newValue.actionItems || []).map(item => ({
      key: item.key,
      label: item.label,
      href: item.href,
      isExternal: item.isExternal,
      variant: item.variant,
      backgroundColor: item.backgroundColor,
      textColor: item.textColor
    })),
    fontWeight: newValue.fontWeight || 'normal'
  }
}, { deep: true })

// 添加对 styles 的监听
watch(() => props.initialData?.styles, (newStyles) => {
  if (newStyles) {
    headerStyles.value = {
      backgroundType: newStyles.backgroundType || headerStyles.value.backgroundType,
      backgroundColor: newStyles.backgroundColor || headerStyles.value.backgroundColor,
      gradientStart: newStyles.gradientStart || headerStyles.value.gradientStart,
      gradientEnd: newStyles.gradientEnd || headerStyles.value.gradientEnd,
      gradientAngle: newStyles.gradientAngle ?? headerStyles.value.gradientAngle
    }
  }
}, { deep: true })

// 菜单项方法
const addMenuItem = () => {
  headerData.value.mainMenuItems.push({ 
    label: '',
    link: '',  // 添加链接字段
    isExternal: false,  // 添加是否外部链接字段
    children: [],
    fontWeight: 'normal',
    color: '#4b5563'
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
    variant: 'button',
    backgroundColor: '#1890ff',
    textColor: '#ffffff'
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

const saving = ref(false)

const saveConfig = async () => {
  try {
    saving.value = true
    const payload = {
      pageHeaders: {
        logo: headerData.value.logo,
        mainMenuItems: headerData.value.mainMenuItems.map(item => ({
          ...item,
          key: item.key || `menu-${Date.now()}-${Math.random()}`,
          link: item.link || '#',  // 确保链接字段存在
          isExternal: item.isExternal || false  // 确保外部链接字段存在
        })),
        actionItems: headerData.value.actionItems.map(item => ({
          ...item,
          key: item.key || `action-${Date.now()}-${Math.random()}`
        })),
        styles: {
          ...headerStyles.value  // 确保完整的样式对象被保存
        }
      }
    }

    console.log('Saving header config:', payload) // 添加调试日志

    const response = await apiClient.updatePageLayout(props.layoutId, payload)
    console.log('Save response:', response)
    
    if (response?.code === 200) {
      message.success('Header config saved successfully')
    } else {
      throw new Error(response?.message || 'Failed to save header config')
    }
  } catch (error) {
    console.error('Failed to save header config:', error)
    message.error(error.message || 'Failed to save header config')
  } finally {
    saving.value = false
  }
}

watch(headerData, (newValue) => {
  emit('update', {
    ...newValue,
    styles: headerStyles.value
  })
}, { deep: true })

watch(() => headerStyles.value, (newStyles) => {
  console.log('Styles changed:', newStyles)
  emit('update', {
    ...headerData.value,
    styles: newStyles
  })
}, { deep: true })

const showColorPicker = ref(false)
const activeColorField = ref(null)
const colorPickerPosition = ref({})

const presetColors = [
  '#FFFFFF', '#000000', '#1890FF', '#F5222D', '#FA8C16',
  '#FADB14', '#52C41A', '#13C2C2', '#2F54EB', '#722ED1'
]

const getCurrentColor = () => {
  switch (activeColorField.value) {
    case 'background':
      return headerStyles.value.backgroundColor
    case 'start':
      return headerStyles.value.gradientStart
    case 'end':
      return headerStyles.value.gradientEnd
    default:
      return '#FFFFFF'
  }
}

const handleColorChange = (e) => {
  e.stopPropagation()
  selectColor(e.target.value)
}

const toggleColorPicker = (field, event) => {
  event?.stopPropagation()
  activeColorField.value = field
  showColorPicker.value = !showColorPicker.value
  
  if (showColorPicker.value && event) {
    const rect = event.target.getBoundingClientRect()
    colorPickerPosition.value = {
      position: 'fixed',
      top: `${rect.bottom + 5}px`,
      left: `${rect.left}px`
    }
  }
}

// Add click outside handler to close color picker
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  const popup = document.querySelector('.color-picker-popup')
  const colorPreviews = document.querySelectorAll('.color-preview')
  const colorWheel = document.querySelector('.color-wheel-input')
  
  if (!popup) return
  
  const clickedOnPreview = Array.from(colorPreviews).some(preview => 
    preview.contains(event.target)
  )
  
  const clickedOnColorWheel = colorWheel?.contains(event.target)
  const clickedInPopup = popup.contains(event.target)
  
  if (!clickedInPopup && !clickedOnPreview && !clickedOnColorWheel) {
    showColorPicker.value = false
  }
}

const selectColor = (color) => {
  if (activeColorField.value.startsWith('menuItem-')) {
    const index = parseInt(activeColorField.value.split('-')[1])
    headerData.value.mainMenuItems[index].color = color
  } else if (activeColorField.value.startsWith('actionBg-')) {
    const index = parseInt(activeColorField.value.split('-')[1])
    headerData.value.actionItems[index].backgroundColor = color
  } else if (activeColorField.value.startsWith('actionText-')) {
    const index = parseInt(activeColorField.value.split('-')[1])
    headerData.value.actionItems[index].textColor = color
  } else {
    switch (activeColorField.value) {
      case 'background':
        headerStyles.value.backgroundColor = color
        break
      case 'start':
        headerStyles.value.gradientStart = color
        break
      case 'end':
        headerStyles.value.gradientEnd = color
        break
    }
  }
  showColorPicker.value = false
}

// 添加 logo 缩放相关逻辑
const logoScale = ref(100)

const updateLogoSize = (scale) => {
  const originalWidth = 200 // 基准宽度
  const originalHeight = 50 // 基准高度
  
  headerData.value.logo.width = Math.round(originalWidth * (scale / 100))
  headerData.value.logo.height = Math.round(originalHeight * (scale / 100))
}

// 监听初始数据，设置初始比例
watch(() => props.initialData?.logo, (newLogo) => {
  if (newLogo?.width) {
    logoScale.value = Math.round((newLogo.width / 200) * 100)
  }
}, { immediate: true })
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

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0;
}

.section {
  background: white;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
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

.menu-item-style {
  margin: 8px 0;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-color {
  width: 24px;
  height: 24px;
  cursor: pointer;
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
  margin-bottom: 24px;
}

.action-item-content {
  padding-right: 40px;
}

.delete-action-btn {
  position: absolute;
  right: 0;
  top: 0;
}

.button-style-select {
  margin-top: 8px;
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

.preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.size-controls {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.size-slider {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-label {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

.size-value {
  font-size: 11px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  color: #666;
  font-family: monospace;
}

.scale-slider {
  flex: 1;
}

:deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

:deep(.ant-input-number-group-addon) {
  padding: 0 8px;
  color: #666;
  background: #f5f5f5;
}

:deep(.ant-radio-group) {
  display: flex;
  gap: 8px;
}

.color-settings {
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.color-type-switch {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.color-pickers {
  display: flex;
  gap: 8px;
}

.color-input {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 4px;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.color-input input {
  width: 80px;
  border: none;
  outline: none;
  font-size: 12px;
}

.gradient-inputs {
  display: flex;
  gap: 8px;
  align-items: center;
}

.angle-slider {
  width: 100px;
  margin-left: 8px;
}

.color-picker-popup {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 1000;
  width: 200px;
  user-select: none;
  -webkit-user-select: none;
}

.color-wheel {
  margin-bottom: 12px;
  text-align: center;
}

.color-wheel-input {
  width: 100%;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-wheel-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-wheel-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.preset-colors {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 8px;
}

.preset-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s;
}

.preset-color:hover {
  transform: scale(1.1);
}

/* Customize slider appearance */
:deep(.slider-target) {
  height: 4px !important;
}

:deep(.slider-handle) {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 2px solid #1890ff !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

:deep(.slider-connect) {
  background: #1890ff !important;
}

.angle-control {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.angle-hint {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.anticon-info-circle) {
  color: #1890ff;
  cursor: help;
}

/* 自定义 Slider 数值提示的样式 */
:deep(.slider-tooltip) {
  background: #f0f0f0 !important;
  color: #666 !important;
  font-size: 11px !important;
  padding: 2px 6px !important;
  border-radius: 4px !important;
  font-family: monospace !important;
}

:deep(.slider-tooltip::before) {
  border-top-color: #f0f0f0 !important;
}

.compact-form-item {
  margin-bottom: 12px;
}

.color-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-label {
  font-size: 12px;
  color: #666;
}

.action-item-style {
  margin: 8px 0;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.button-colors {
  margin-top: 8px;
  display: flex;
  gap: 16px;
}

.menu-item-options {
  margin-top: 8px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}
</style>
