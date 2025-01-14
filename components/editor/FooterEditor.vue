<template>
  <div class="editor-container">
    <div class="preview-section">
      <FooterPreview :data="footerData" />
    </div>

    <div class="editor-header">
      <h2 class="editor-title">Footer Settings</h2>
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
          <!-- 基础信息 -->
          <div class="section">
            <h3 class="section-title">Basic Information</h3>
            <a-form-item label="Company Name">
              <a-input v-model:value="footerData.companyName" />
            </a-form-item>
            
            <a-form-item label="Description">
              <a-textarea 
                v-model:value="footerData.description"
                :rows="3"
                placeholder="Enter company description"
              />
            </a-form-item>

            <!-- 添加版权信息编辑 -->
            <a-form-item label="Copyright Text">
              <a-input
                v-model:value="footerData.copyright"
                placeholder="© 2025 Company Name. All rights reserved."
              />
            </a-form-item>
          </div>

          <!-- Newsletter设置 -->
          <div class="section">
            <h3 class="section-title">Newsletter</h3>
            <a-form-item label="Subscribe Text">
              <a-input v-model:value="footerData.newsletter.text" />
            </a-form-item>
            <a-form-item label="Button Text">
              <a-input v-model:value="footerData.newsletter.buttonText" />
            </a-form-item>
          </div>
        </a-col>

        <!-- 右列 -->
        <a-col :span="12">
          <!-- 功能列表 -->
          <div class="section">
            <h3 class="section-title">Features</h3>
            <div class="feature-list">
              <div v-for="(feature, index) in footerData.features" :key="index" class="feature-item">
                <a-input
                  v-model:value="feature.title"
                  style="width: 40%"
                  placeholder="Feature name"
                />
                <a-input
                  v-model:value="feature.href"
                  style="width: 50%"
                  placeholder="Feature link"
                />
                <a-button
                  type="text"
                  danger
                  @click="removeFeature(index)"
                >
                  <delete-outlined />
                </a-button>
              </div>
              <a-button type="dashed" block @click="addFeature">
                Add Feature
              </a-button>
            </div>
          </div>

          <!-- 社交媒体链接 -->
          <div class="social-media-section">
            <h3>Social Media Links</h3>
            <div class="social-links-container">
              <div v-for="(url, platform) in footerData.socialMedia" 
                   :key="platform" 
                   class="social-link-item"
              >
                <a-select
                  :value="platform"
                  style="width: 120px"
                  :disabled="disabled"
                  @change="(newPlatform) => handleSocialPlatformChange(platform, newPlatform)"
                >
                  <a-select-option 
                    v-for="item in availablePlatforms" 
                    :key="item.value" 
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
                
                <a-input
                  v-model:value="footerData.socialMedia[platform]"
                  :disabled="disabled"
                  placeholder="Enter link"
                  @change="handleChange"
                />
                
                <a-button 
                  type="text" 
                  danger 
                  @click="removeSocialLink(platform)"
                >
                  <delete-outlined />
                </a-button>
              </div>
            </div>
            
            <a-button 
              type="primary" 
              class="add-social-btn" 
              @click="addSocialLink"
            >
              <plus-outlined /> Add Social Media
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import FooterPreview from './FooterPreview.vue'
import apiClient from '../../api/api'
import { message } from 'ant-design-vue'

const emit = defineEmits(['update'])

const availablePlatforms = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Twitter/X', value: 'twitter' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'GitHub', value: 'github' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Pinterest', value: 'pinterest' },
  { label: 'Reddit', value: 'reddit' },
  { label: 'Discord', value: 'discord' },
  { label: 'Twitch', value: 'twitch' },
  { label: 'Medium', value: 'medium' },
  { label: 'Behance', value: 'behance' },
  { label: 'Dribbble', value: 'dribbble' },
  { label: 'Personal Website', value: 'website' },
  { label: 'Email', value: 'email' }
]

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
  features: props.initialData.features,
  socialMedia: props.initialData.socialMedia,
  newsletter: props.initialData.newsletter,
  copyright: props.initialData.copyright
})

watch(() => props.initialData, (newValue) => {
  footerData.value = { ...newValue }
}, { deep: true })

watch(footerData, (newValue) => {
  emit('update', newValue)
}, { deep: true })

// Features 相关方法
const addFeature = () => {
  footerData.value.features.push({ title: '', href: '#' })
}

const removeFeature = (index) => {
  footerData.value.features.splice(index, 1)
}

const handleSocialPlatformChange = (oldPlatform, newPlatform) => {
  const url = footerData.value.socialMedia[oldPlatform]
  delete footerData.value.socialMedia[oldPlatform]
  footerData.value.socialMedia[newPlatform] = url
  handleChange()
}

const addSocialLink = () => {
  const existingPlatforms = Object.keys(footerData.value.socialMedia)
  const newPlatform = availablePlatforms.find(p => 
    !existingPlatforms.includes(p.value)
  )
  if (newPlatform) {
    footerData.value.socialMedia[newPlatform.value] = ''
    handleChange()
  }
}

const removeSocialLink = (platform) => {
  delete footerData.value.socialMedia[platform]
  handleChange()
}

const handleChange = () => {
  emit('update', footerData.value)
}

// 添加保存相关逻辑
const saving = ref(false)

const saveConfig = async () => {
  try {
    saving.value = true
    const payload = {
      pageFooters: footerData.value,
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

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
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
</style> 