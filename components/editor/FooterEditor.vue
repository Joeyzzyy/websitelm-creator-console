<template>
  <div class="editor-container">
    <div class="preview-section">
      <FooterPreview :data="footerData" :styles="footerStyles" />
      
      <!-- 添加背景色设置 -->
      <div class="color-settings">
        <div class="color-type-switch">
          <a-radio-group v-model:value="footerStyles.backgroundType" size="small">
            <a-radio value="solid">Solid</a-radio>
            <a-radio value="gradient">Gradient</a-radio>
          </a-radio-group>
        </div>

        <div class="color-pickers">
          <!-- Solid color picker -->
          <template v-if="footerStyles.backgroundType === 'solid'">
            <div class="color-input">
              <div 
                class="color-preview"
                :style="{ background: footerStyles.backgroundColor }"
                @click="toggleColorPicker('background', $event)"
              ></div>
              <input 
                v-model="footerStyles.backgroundColor"
                type="text"
                placeholder="#000000"
              />
            </div>
          </template>

          <!-- Gradient color pickers -->
          <template v-if="footerStyles.backgroundType === 'gradient'">
            <div class="gradient-inputs">
              <div class="color-input">
                <div 
                  class="color-preview"
                  :style="{ background: footerStyles.gradientStart }"
                  @click="toggleColorPicker('start', $event)"
                ></div>
                <input 
                  v-model="footerStyles.gradientStart"
                  type="text"
                  placeholder="#000000"
                />
              </div>
              <div class="color-input">
                <div 
                  class="color-preview"
                  :style="{ background: footerStyles.gradientEnd }"
                  @click="toggleColorPicker('end', $event)"
                ></div>
                <input 
                  v-model="footerStyles.gradientEnd"
                  type="text"
                  placeholder="#000000"
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
                  v-model="footerStyles.gradientAngle"
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
      <h2 class="editor-title">Footer Settings</h2>
      <a-button 
        type="primary"
        :loading="saving"
        @click="saveConfig"
        class="save-button"
      >
        Save Changes
      </a-button>
    </div>
    
    <a-form layout="vertical">
      <a-row :gutter="16">
        <!-- 左列 -->
        <a-col :span="12">
          <!-- 基础信息 -->
          <div class="section">
            <h3 class="section-title">Basic Information</h3>
            <a-form-item label="Company Name">
              <div class="input-with-color">
                <a-input v-model:value="footerData.companyName" />
                <div 
                  class="color-picker"
                  :style="{ background: footerData.colors.companyName }"
                  @click="toggleColorPicker('companyName', $event)"
                ></div>
              </div>
            </a-form-item>
            
            <a-form-item label="Description">
              <div class="input-with-color">
                <a-textarea 
                  v-model:value="footerData.description"
                  :rows="3"
                />
                <div 
                  class="color-picker"
                  :style="{ background: footerData.colors.description }"
                  @click="toggleColorPicker('description', $event)"
                ></div>
              </div>
            </a-form-item>

            <a-form-item label="Copyright Text">
              <div class="input-with-color">
                <a-input
                  v-model:value="footerData.copyright"
                  placeholder="© 2025 Company Name. All rights reserved."
                />
                <div 
                  class="color-picker"
                  :style="{ background: footerData.colors.copyright }"
                  @click="toggleColorPicker('copyright', $event)"
                ></div>
              </div>
            </a-form-item>
          </div>
        </a-col>

        <!-- 右列 -->
        <a-col :span="12">
          <!-- 保留社交媒体部分 -->
          <div class="section">
            <div class="section-header">
              <h3 class="section-title">Social Media</h3>
            </div>

            <!-- 图标全局设置 -->
            <div class="icon-settings">
              <a-form-item label="Icon Size" style="margin-bottom: 0">
                <a-select
                  v-model:value="footerData.socialMedia.iconSize"
                  style="width: 100px"
                >
                  <a-select-option :value="16">Small</a-select-option>
                  <a-select-option :value="20">Medium</a-select-option>
                  <a-select-option :value="24">Large</a-select-option>
                  <a-select-option :value="32">Extra Large</a-select-option>
                </a-select>
              </a-form-item>
              
              <a-form-item label="Icon Color" style="margin-bottom: 0">
                <div 
                  class="color-picker"
                  :style="{ background: footerData.socialMedia.iconColor }"
                  @click="toggleColorPicker('socialMediaIcon', $event)"
                ></div>
              </a-form-item>
            </div>

            <!-- 社交媒体链接列表 -->
            <div class="social-media-list">
              <template v-if="footerData.socialMedia.links && footerData.socialMedia.links.length > 0">
                <div 
                  v-for="(link, index) in footerData.socialMedia.links" 
                  :key="index"
                  class="social-media-item"
                >
                  <a-select
                    v-model:value="link.platform"
                    style="width: 120px"
                    placeholder="Platform"
                  >
                    <a-select-option value="twitter">Twitter</a-select-option>
                    <a-select-option value="facebook">Facebook</a-select-option>
                    <a-select-option value="instagram">Instagram</a-select-option>
                    <a-select-option value="linkedin">LinkedIn</a-select-option>
                    <a-select-option value="youtube">YouTube</a-select-option>
                    <a-select-option value="github">GitHub</a-select-option>
                    <a-select-option value="reddit">Reddit</a-select-option>
                    <a-select-option value="discord">Discord</a-select-option>
                    <a-select-option value="medium">Medium</a-select-option>
                    <a-select-option value="behance">Behance</a-select-option>
                    <a-select-option value="tiktok">TikTok</a-select-option>
                    <a-select-option value="pinterest">Pinterest</a-select-option>
                    <a-select-option value="twitch">Twitch</a-select-option>
                    <a-select-option value="dribbble">Dribbble</a-select-option>
                  </a-select>
                  
                  <a-input
                    v-model:value="link.url"
                    placeholder="URL"
                    style="flex: 1"
                  />
                  
                  <a-button 
                    type="text" 
                    danger
                    @click="removeSocialLink(index)"
                  >
                    <delete-outlined />
                  </a-button>
                </div>
              </template>
              <template v-else>
                <div class="empty-state">
                  <p class="empty-text">
                    No social media links added yet
                  </p>
                </div>
              </template>
            </div>

            <a-button 
              type="dashed" 
              block 
              @click="addSocialLink"
              style="margin-top: 12px"
            >
              <plus-outlined /> Add Social Media Link
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>

    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Navigation Sections</h3>
      </div>

      <div v-for="(section, sIndex) in footerData.sections" :key="sIndex" class="nav-section">
        <div class="section-header">
          <div class="input-with-color">
            <a-input
              v-model:value="section.title"
              placeholder="Section Title"
              class="section-title-input"
            />
            <div 
              class="color-picker"
              :style="{ background: section.colors.title }"
              @click="toggleColorPicker(`sectionTitle_${sIndex}`, $event)"
            ></div>
          </div>
          <a-button type="text" danger @click="removeSection(sIndex)">
            <delete-outlined />
          </a-button>
        </div>

        <div class="section-links">
          <div 
            v-for="(link, lIndex) in section.links" 
            :key="lIndex"
            class="link-item"
          >
            <a-input
              v-model:value="link.label"
              placeholder="Link Label"
              style="width: 200px"
            />
            <a-input
              v-model:value="link.url"
              placeholder="URL"
              style="flex: 1"
            />
            <div 
              class="color-picker"
              :style="{ background: section.colors.links }"
              @click="toggleColorPicker(`sectionLinks_${sIndex}`, $event)"
            ></div>
            <a-button type="text" danger @click="removeLink(sIndex, lIndex)">
              <delete-outlined />
            </a-button>
          </div>

          <a-button 
            type="dashed" 
            block 
            @click="addLink(sIndex)"
            style="margin-top: 8px"
          >
            <plus-outlined /> Add Link
          </a-button>
        </div>
      </div>

      <a-button 
        type="dashed" 
        block 
        @click="addSection"
        style="margin-top: 16px"
      >
        <plus-outlined /> Add Navigation Section
      </a-button>
    </div>
  </div>

  <!-- Color picker popup -->
  <div 
    v-if="showColorPicker"
    class="color-picker-popup"
    :style="colorPickerPosition"
    @click.stop
  >
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
import { DeleteOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import FooterPreview from './FooterPreview.vue'
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

const footerData = ref({
  companyName: props.initialData.companyName,
  description: props.initialData.description,
  copyright: props.initialData.copyright,
  colors: {
    companyName: '#FFFFFF',
    description: '#9CA3AF',
    copyright: '#9CA3AF',
    ...props.initialData?.colors
  },
  socialMedia: {
    iconSize: props.initialData.socialMedia?.iconSize || 24,
    iconColor: props.initialData.socialMedia?.iconColor || '#9CA3AF',
    links: props.initialData.socialMedia?.links?.links || props.initialData.socialMedia?.links || []
  },
  sections: Array.isArray(props.initialData?.sections) ? props.initialData.sections : []
})

watch(() => props.initialData, (newValue) => {
  if (newValue?.sections) {
    footerData.value.sections = newValue.sections
  }
}, { deep: true })

watch(footerData, (newValue) => {
  emit('update', newValue)
}, { deep: true })

// 添加 footer 样式配置
const footerStyles = ref({
  backgroundType: props.initialData?.styles?.backgroundType || 'solid',
  backgroundColor: props.initialData?.styles?.backgroundColor || '#000000',
  gradientStart: props.initialData?.styles?.gradientStart || '#000000',
  gradientEnd: props.initialData?.styles?.gradientEnd || '#1F2937',
  gradientAngle: props.initialData?.styles?.gradientAngle ?? 135
})

// 添加颜色选择器相关状态
const showColorPicker = ref(false)
const activeColorField = ref(null)
const colorPickerPosition = ref({ top: '0px', left: '0px' })

const presetColors = [
  '#FFFFFF', '#9CA3AF', '#1F2937', '#111827',
  '#F87171', '#60A5FA', '#34D399', '#FBBF24'
]

const getCurrentColor = () => {
  if (activeColorField.value?.startsWith('sectionTitle')) {
    const [_, index] = activeColorField.value.split('_')
    return footerData.value.sections[index].colors.title
  }
  if (activeColorField.value?.startsWith('sectionLinks')) {
    const [_, index] = activeColorField.value.split('_')
    return footerData.value.sections[index].colors.links
  }
  if (activeColorField.value === 'background') {
    return footerStyles.value.backgroundColor
  } else if (activeColorField.value === 'start') {
    return footerStyles.value.gradientStart
  } else if (activeColorField.value === 'end') {
    return footerStyles.value.gradientEnd
  } else if (activeColorField.value === 'socialMediaIcon') {
    return footerData.value.socialMedia.iconColor
  }
  return footerData.value.colors[activeColorField.value] || '#FFFFFF'
}

const handleColorChange = (event) => {
  const newColor = event.target.value
  if (activeColorField.value?.startsWith('sectionTitle')) {
    const [_, index] = activeColorField.value.split('_')
    footerData.value.sections[index].colors.title = newColor
    return
  }
  if (activeColorField.value?.startsWith('sectionLinks')) {
    const [_, index] = activeColorField.value.split('_')
    footerData.value.sections[index].colors.links = newColor
    return
  }
  if (activeColorField.value === 'background') {
    footerStyles.value.backgroundColor = newColor
  } else if (activeColorField.value === 'start') {
    footerStyles.value.gradientStart = newColor
  } else if (activeColorField.value === 'end') {
    footerStyles.value.gradientEnd = newColor
  } else if (activeColorField.value === 'socialMediaIcon') {
    footerData.value.socialMedia.iconColor = newColor
  } else {
    footerData.value.colors[activeColorField.value] = newColor
  }
}

const selectColor = (color) => {
  if (activeColorField.value?.startsWith('sectionTitle')) {
    const [_, index] = activeColorField.value.split('_')
    footerData.value.sections[index].colors.title = color
    showColorPicker.value = false
    return
  }
  if (activeColorField.value?.startsWith('sectionLinks')) {
    const [_, index] = activeColorField.value.split('_')
    footerData.value.sections[index].colors.links = color
    showColorPicker.value = false
    return
  }
  if (activeColorField.value === 'background') {
    footerStyles.value.backgroundColor = color
  } else if (activeColorField.value === 'start') {
    footerStyles.value.gradientStart = color
  } else if (activeColorField.value === 'end') {
    footerStyles.value.gradientEnd = color
  } else if (activeColorField.value === 'socialMediaIcon') {
    footerData.value.socialMedia.iconColor = color
  } else {
    footerData.value.colors[activeColorField.value] = color
  }
  showColorPicker.value = false
}

const toggleColorPicker = (field, event) => {
  console.log('Toggle color picker:', field)
  activeColorField.value = field
  showColorPicker.value = true
  
  // 计算颜色选择器的位置
  const rect = event.target.getBoundingClientRect()
  colorPickerPosition.value = {
    top: `${rect.bottom + window.scrollY + 5}px`,
    left: `${rect.left + window.scrollX}px`
  }

  // 阻止事件冒泡
  event.stopPropagation()
}

// 添加保存相关逻辑
const saving = ref(false)

const saveConfig = async () => {
  try {
    saving.value = true
    // 确保 socialMedia 的数据结构正确
    const socialMediaData = {
      iconColor: footerData.value.socialMedia.iconColor,
      iconSize: footerData.value.socialMedia.iconSize,
      links: footerData.value.socialMedia.links
    }

    const payload = {
      pageFooters: {
        ...footerData.value,
        socialMedia: socialMediaData,  // 使用正确结构的数据
        styles: footerStyles.value
      }
    }

    const response = await apiClient.updatePageLayout(props.layoutId, payload)
    
    if (response?.code === 200) {
      message.success('Footer config saved successfully')
    } else {
      throw new Error(response?.message || 'Failed to save footer config')
    }
  } catch (error) {
    console.error('Failed to save footer config:', error)
    message.error(error.message || 'Failed to save footer config')
  } finally {
    saving.value = false
  }
}

// 点击其他地方关闭颜色选择器
const closeColorPicker = (event) => {
  if (!event.target.closest('.color-picker-popup')) {
    showColorPicker.value = false
  }
}

onMounted(() => {
  console.log('Raw initialData:', props.initialData)
  console.log('Raw sections:', props.initialData?.sections)
  console.log('Sections type:', typeof props.initialData?.sections)
  console.log('Is sections array:', Array.isArray(props.initialData?.sections))
  console.log('Footer data sections:', footerData.value.sections)
  document.addEventListener('click', closeColorPicker)
})

onUnmounted(() => {
  document.removeEventListener('click', closeColorPicker)
})

// 添加调试日志
watch(showColorPicker, (newValue) => {
  console.log('showColorPicker changed:', newValue)
})

watch(activeColorField, (newValue) => {
  console.log('activeColorField changed:', newValue)
})

// 添加社交媒体相关方法
const addSocialLink = () => {
  if (!Array.isArray(footerData.value.socialMedia.links)) {
    footerData.value.socialMedia.links = []
  }
  footerData.value.socialMedia.links.push({
    platform: '',
    url: ''
  })
}

const removeSocialLink = (index) => {
  footerData.value.socialMedia.links.splice(index, 1)
}

// 添加 watch 来监控数据变化
watch(() => footerData.value.socialMedia, (newValue) => {
  console.log('Social media data changed:', newValue)
}, { deep: true })

watch(() => props.initialData, (newValue) => {
  console.log('Props initialData changed:', newValue)
}, { deep: true })

// Add new methods for section management
const addSection = () => {
  footerData.value.sections.push({
    title: 'New Section',
    colors: {
      title: 'black',
      links: '#9CA3AF'
    },
    links: []
  })
}

const removeSection = (index) => {
  footerData.value.sections.splice(index, 1)
}

const addLink = (sectionIndex) => {
  footerData.value.sections[sectionIndex].links.push({
    label: '',
    url: ''
  })
}

const removeLink = (sectionIndex, linkIndex) => {
  footerData.value.sections[sectionIndex].links.splice(linkIndex, 1)
}
</script>

<style scoped>
.editor-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
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

.feature-links-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.feature-links-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-link-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.social-media-section {
  margin: 24px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.social-links-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.social-link-item {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  gap: 8px;
  align-items: center;
}

.add-social-btn {
  margin-top: 12px;
  width: 100%;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* 添加颜色设置相关样式 */
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
  grid-template-columns: repeat(4, 1fr);
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

:deep(.ant-radio-group) {
  display: flex;
  gap: 8px;
}

.input-with-color {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.color-picker {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.color-group {
  display: flex;
  gap: 16px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-item span {
  font-size: 14px;
  color: #666;
}

.social-media-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.social-media-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.platform-label {
  width: 80px;
  text-transform: capitalize;
}

.icon-settings {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.color-picker {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-picker:hover {
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 24px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 12px;
}

.empty-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.save-button {
  background: linear-gradient(45deg, #059669, #10b981);  /* 鲜艳的绿色渐变 */
  font-weight: 600;
  height: 40px;
  padding: 0 24px;
  font-size: 15px;
  border-radius: 6px;
  border: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  transition: all 0.3s ease;
  color: white;
}

.save-button:hover {
  background: linear-gradient(45deg, #047857, #059669);  /* 更深的绿色渐变 */
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
}

.save-button:active {
  background: linear-gradient(45deg, #065f46, #047857);  /* 点击时的颜色 */
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

/* 新增样式 */
.links-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.links-count {
  font-size: 12px;
  color: #666;
}

.link-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.add-link-btn {
  margin-top: 12px;
}

.add-section-btn {
  margin: 24px 0;
}

.nav-section {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  background: #f8fafc;
}

.section-title-input {
  flex: 1;
}

.section-links {
  margin-top: 12px;
}

.link-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}
</style> 