<template>
    <div class="section-wrapper">
      <!-- 编辑区域 -->
      <div class="editor-area">
        <div class="editor-header">
          <h2 class="component-title">Meet Our Team</h2>
        </div>
        <div class="editor-content">
          <a-form layout="vertical">
            <!-- Top Content -->
            <a-form-item label="Subtitle">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.subtitle }}</span>
                <a-input
                  v-model:value="localSection.topContent.subtitle"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Title">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.title }}</span>
                <a-input
                  v-model:value="localSection.topContent.title"
                  :disabled="disabled"
                  @change="handleChange"
                />
              </div>
            </a-form-item>
  
            <a-form-item label="Description">
              <div class="input-with-tag">
                <span class="html-tag">{{ tags.description }}</span>
                <a-textarea
                  v-model:value="localSection.topContent.description"
                  :disabled="disabled"
                  @change="handleChange"
                  :rows="3"
                />
              </div>
            </a-form-item>
  
            <!-- Team Members -->
            <div class="team-members-header">
              <h2>Team Members</h2>
              <a-button type="primary" @click="addTeamMember">
                <plus-outlined /> Add Member
              </a-button>
            </div>
  
            <div v-for="(member, index) in localSection.bottomContent" :key="index" class="team-member">
              <div class="team-member-header">
                <h3>Team Member {{ index + 1 }}</h3>
                <a-button type="text" danger @click="removeTeamMember(index)">
                  <delete-outlined />
                </a-button>
              </div>
              
              <a-form-item label="Name">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.memberName }}</span>
                  <a-input
                    v-model:value="member.name"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Job Title">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.memberTitle }}</span>
                  <a-input
                    v-model:value="member.title"
                    :disabled="disabled"
                    @change="handleChange"
                  />
                </div>
              </a-form-item>
  
              <a-form-item label="Description">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.memberDescription }}</span>
                  <a-textarea
                    v-model:value="member.description"
                    :disabled="disabled"
                    @change="handleChange"
                    :rows="2"
                    :style="{ minHeight: '80px' }"
                  />
                </div>
              </a-form-item>
  
              <!-- Social Links -->
              <div class="social-links">
                <div class="social-links-header">
                  <span>Social Links</span>
                  <a-button type="link" size="small" @click="addSocialLink(index)">
                    <plus-outlined /> Add
                  </a-button>
                </div>
                
                <div v-for="(social, socialIndex) in member.socials" :key="socialIndex" class="social-link-item">
                  <a-select
                    v-model:value="social.platform"
                    style="width: 120px"
                    :disabled="disabled"
                    @change="handleChange"
                  >
                    <a-select-option v-for="platform in availablePlatforms" 
                      :key="platform.value" 
                      :value="platform.value"
                    >
                      {{ platform.label }}
                    </a-select-option>
                  </a-select>
                  
                  <a-input
                    v-model:value="social.url"
                    :disabled="disabled"
                    placeholder="input link"
                    @change="handleChange"
                  />
                  
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeSocialLink(index, socialIndex)"
                  >
                    <delete-outlined />
                  </a-button>
                </div>
              </div>
  
              <!-- Avatar -->
              <a-form-item label="Avatar">
                <div class="input-with-tag">
                  <span class="html-tag">{{ tags.memberAvatar }}</span>
                  <div class="image-input-wrapper">
                    <a-input
                      v-model:value="member.avatarUrl"
                      :disabled="disabled"
                      placeholder="Avatar URL"
                      @change="handleChange"
                    />
                    <a-button 
                      type="primary"
                      class="change-image-btn"
                      @click="openImageLibrary(index)"
                    >
                      Change
                    </a-button>
                  </div>
                </div>
              </a-form-item>
  
              <div class="image-preview" v-if="member.avatarUrl">
                <a-image :src="member.avatarUrl" :width="100" />
              </div>
            </div>
          </a-form>
        </div>
      </div>
  
      <!-- 预览区域 -->
      <div class="preview-area">
        <div class="preview-header">
          <span>Preview</span>
        </div>
        
        <div class="preview-content">
          <MeetOurTeamPreview 
          :section="localSection"
          :styles="styles"
        />
        </div>
      </div>
    </div>
  
    <!-- 在底部添加图片库模态框 -->
    <a-modal
      v-model:visible="imageLibraryVisible"
      title="Select Avatar"
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
  
  <script>
  import BaseSection from '../common/BaseSection.vue'
  import { SECTION_TAGS } from '../common/SectionTag'
  import themeConfig from '../../../assets/config/themeConfig'
  import MeetOurTeamPreview from './MeetOurTeamPreview.vue'
  import ImageLibrary from '../common/ImageLibrary.vue'
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  
  export default {
    name: 'MeetOurTeam',
    extends: BaseSection,
    components: {
      MeetOurTeamPreview,
      ImageLibrary,
      PlusOutlined,
      DeleteOutlined
    },
    data() {
      return {
        localSection: {
          topContent: {
            subtitle: '',
            title: '',
            description: ''
          },
          bottomContent: [],
          ...JSON.parse(JSON.stringify(this.section))
        },
        styles: themeConfig.normal,
        imageLibraryVisible: false,
        selectedImage: null,
        currentMemberIndex: null,
        availablePlatforms: [
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
        ],
      }
    },
    computed: {
      tags() {
        return {
          ...SECTION_TAGS.MeetOurTeam
        }
      },
      isChineseTitle() {
        return /[\u4e00-\u9fa5]/.test(this.localSection?.title || '')
      },
      titleClasses() {
        const { fontSize, fontWeight, color } = this.styles.typography.h1
        console.log('Title classes:', { fontSize, fontWeight, color })
        return [fontSize, fontWeight, color]
      }
    },
    created() {
      this.localSection = Object.assign({
        topContent: {
          subtitle: '',
          title: '',
          description: ''
        },
        bottomContent: []
      }, JSON.parse(JSON.stringify(this.section)))
  
      if (!Array.isArray(this.localSection.bottomContent)) {
        this.localSection.bottomContent = []
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
        this.emitUpdate(this.localSection)
      },
      openImageLibrary(index) {
        this.currentMemberIndex = index
        this.imageLibraryVisible = true
      },
      closeImageLibrary() {
        this.imageLibraryVisible = false
        this.selectedImage = null
        this.currentMemberIndex = null
      },
      onImageSelect(image) {
        this.selectedImage = image
      },
      handleImageSelect() {
        if (this.selectedImage && this.currentMemberIndex !== null) {
          this.localSection.bottomContent[this.currentMemberIndex].avatarUrl = this.selectedImage.url
          this.handleChange()
        }
        this.closeImageLibrary()
      },
      addSocialLink(memberIndex) {
        if (!this.localSection.bottomContent[memberIndex].socials) {
          this.localSection.bottomContent[memberIndex].socials = []
        }
        this.localSection.bottomContent[memberIndex].socials.push({
          platform: '',
          url: ''
        })
        this.handleChange()
      },
      
      removeSocialLink(memberIndex, socialIndex) {
        this.localSection.bottomContent[memberIndex].socials.splice(socialIndex, 1)
        this.handleChange()
      },
      addTeamMember() {
        this.localSection.bottomContent.push({
          name: '',
          title: '',
          description: '',
          avatarUrl: '',
          avatarAlt: '',
          socials: []
        })
        this.handleChange()
      },

      removeTeamMember(index) {
        this.localSection.bottomContent.splice(index, 1)
        this.handleChange()
      }
    }
  }
  </script>
  
  <style scoped>
  /* 基础布局 - 整体页面结构 */
  .section-wrapper {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 24px;
    min-height: 500px;
    align-items: start;
  }
  
  /* 编辑区域和预览区域的共同样式 */
  .editor-area,
  .preview-area {
    border-radius: 8px;
    padding: 24px;
  }
  
  /* ===== 表单编辑区域样式 ===== */
  .editor-area {
    background: white;
    display: flex;
    flex-direction: column;
    max-height: 800px;
    position: relative;
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
  
  /* 表单输入框样式 */
  .input-with-tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  /* HTML标签样式 */
  .html-tag {
    padding: 2px 8px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    color: #0050b3;
    font-size: 12px;
    font-family: monospace;
  }
  
  :deep(.ant-form-item) {
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  /* ===== 预览区域样式 ===== */
  .preview-area {
    background: #f8fafc;
    min-width: 768px;
    overflow-x: auto;
    position: sticky;
    top: 24px;
    overflow-y: auto;
  }
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 16px;
    background: #f8fafc;
    border-radius: 8px;
    height: 48px;
  }
  
  .preview-content {
    background: white;
    border-radius: 8px;
    flex: 1;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: calc(100% - 64px);
  }
  
  /* 添加新的样式 */
  .team-member {
    margin-top: 24px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
  }
  
  .social-links {
    margin: 16px 0;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
  }
  
  .social-links-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .social-link-item {
    display: grid;
    grid-template-columns: 120px 1fr 40px;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
  }
  
  .image-preview {
    margin-top: 12px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
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
  
  .team-members-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .team-member-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  </style>