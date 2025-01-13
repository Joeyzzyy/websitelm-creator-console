<template>
  <div v-if="visible" class="onboarding-overlay">
    <div 
      ref="tourCard"
      class="onboarding-card"
      :style="calculatePosition(currentStep)"
    >
      <div class="arrow"></div>
      
      <div class="tour-content">
        <div class="tour-header">
          <div class="step-indicator">{{ currentStep.index + 1 }}/{{ steps.length }}</div>
          <div class="tour-title">{{ currentStep.title }}</div>
        </div>
        
        <div class="tour-body">
          <p>{{ currentStep.content }}</p>
          
          <!-- 视频预览框 -->
          <div v-if="currentStep.videoUrl" class="video-preview">
            <video 
              :src="currentStep.videoUrl"
              controls
              preload="metadata"
              class="preview-video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          
          <!-- 文档链接 -->
          <div class="resource-links">
            <a v-if="currentStep.docsLink" 
               :href="currentStep.docsLink" 
               target="_blank"
               class="resource-link docs-link"
            >
              <FileTextOutlined />
              Read Documentation
            </a>
          </div>
        </div>
        
        <div class="tour-footer">
          <a-button 
            v-if="currentStep.index > 0" 
            @click="prevStep"
          >Previous</a-button>
          <a-button 
            type="primary" 
            @click="nextStep"
          >
            {{ isLastStep ? 'Finish' : 'Next' }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FileTextOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    FileTextOutlined
  },
  name: 'OnboardingTour',
  data() {
    return {
      visible: false,
      currentStepIndex: 0,
      steps: [
        {
          title: 'Dashboard',
          content: 'This is your data overview where you can view all important metrics and latest updates.',
          target: '[data-tour="dashboardpage"]',
          placement: 'right',
          videoUrl: 'https://example.com/placeholder-dashboard.mp4',
          docsLink: '#/placeholder-docs-dashboard'
        },
        {
          title: 'Asset Management',
          content: 'Manage and organize all your digital assets, including images and documents.',
          target: '[data-tour="assetspage"]',
          placement: 'right',
          videoUrl: 'https://example.com/placeholder-assets.mp4',
          docsLink: '#/placeholder-docs-assets'
        },
        {
          title: 'Keyword Planning',
          content: 'Use our powerful keyword planning tool to optimize your content strategy.',
          target: '[data-tour="keywordsplanningpage"]',
          placement: 'right',
          videoUrl: 'https://example.com/placeholder-keywords.mp4',
          docsLink: '#/placeholder-docs-keywords'
        },
        {
          title: 'Task Management',
          content: 'Create and manage your tasks, track project progress.',
          target: '[data-tour="taskmanagementpage"]',
          placement: 'right',
          videoUrl: 'https://example.com/placeholder-tasks.mp4',
          docsLink: '#/placeholder-docs-tasks'
        },
        {
          title: 'Settings',
          content: 'Customize your system preferences here. You can always revisit this guide through the button in the bottom left corner.',
          target: '[data-tour="settingspage"]',
          placement: 'right',
          videoUrl: 'https://example.com/placeholder-settings.mp4',
          docsLink: '#/placeholder-docs-settings'
        }
      ]
    }
  },
  
  computed: {
    currentStep() {
      return {
        ...this.steps[this.currentStepIndex],
        index: this.currentStepIndex
      }
    },
    isLastStep() {
      return this.currentStepIndex === this.steps.length - 1
    }
  },
  
  methods: {
    start() {
      this.visible = true
      this.currentStepIndex = 0
      this.updatePosition()
    },
    
    nextStep() {
      if (this.isLastStep) {
        this.complete()
      } else {
        this.currentStepIndex++
        this.updatePosition()
      }
    },
    
    prevStep() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--
        this.updatePosition()
      }
    },
    
    complete() {
      this.visible = false
      localStorage.setItem('onboardingCompleted', 'true')
      this.$emit('complete')
    },
    
    calculatePosition(step) {
      const targetEl = document.querySelector(step.target)
      if (!targetEl) return {}

      const rect = targetEl.getBoundingClientRect()
      const cardWidth = 400  // 提示框宽度
      const cardHeight = 400 // 预估提示框高度
      const margin = 20     // 边距
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // 默认位置（右侧）
      let position = {
        position: 'fixed',
        left: `${rect.right + margin}px`,
        top: `${rect.top}px`,
        transform: 'translateY(-50%)'
      }

      // 检查右侧空间
      if (rect.right + cardWidth + margin > viewportWidth) {
        // 如果右侧空间不足，尝试左侧
        position.left = `${rect.left - cardWidth - margin}px`
        
        // 如果左侧也不行，尝试上方或下方
        if (rect.left - cardWidth - margin < 0) {
          // 优先尝试下方
          if (rect.bottom + cardHeight + margin < viewportHeight) {
            position = {
              position: 'fixed',
              left: `${rect.left}px`,
              top: `${rect.bottom + margin}px`,
              transform: 'none'
            }
          } 
          // 否则放在上方
          else {
            position = {
              position: 'fixed',
              left: `${rect.left}px`,
              bottom: `${viewportHeight - rect.top + margin}px`,
              transform: 'none'
            }
          }
        }
      }

      // 检查垂直方向是否溢出
      if (position.top) {
        const topValue = parseInt(position.top)
        const transformedTop = position.transform === 'translateY(-50%)' 
          ? topValue - (cardHeight / 2) 
          : topValue

        // 如果顶部溢出
        if (transformedTop < margin) {
          position.top = `${margin}px`
          position.transform = 'none'
        }
        // 如果底部溢出
        else if (transformedTop + cardHeight > viewportHeight - margin) {
          position.top = `${viewportHeight - cardHeight - margin}px`
          position.transform = 'none'
        }
      }

      return position
    },
    
    updatePosition() {
      this.$nextTick(() => {
        const position = this.calculatePosition(this.currentStep)
        Object.assign(this.$refs.tourCard.style, position)
        this.updateArrowPosition(position)
        this.highlightCurrentStep()
      })
    },
    
    // 新增：更新箭头位置
    updateArrowPosition(position) {
      const arrow = this.$refs.tourCard.querySelector('.arrow')
      if (!arrow) return

      // 根据提示框位置调整箭头
      if (position.left.includes('-')) {
        // 提示框在左侧
        arrow.style.right = '-8px'
        arrow.style.left = 'auto'
        arrow.style.transform = 'rotate(180deg)'
      } else if (position.top && !position.transform) {
        // 提示框在上方或下方
        arrow.style.left = '50%'
        arrow.style.top = position.bottom ? 'auto' : '-8px'
        arrow.style.bottom = position.bottom ? '-8px' : 'auto'
        arrow.style.transform = position.bottom ? 'rotate(180deg)' : 'rotate(-90deg)'
      } else {
        // 提示框在右侧（默认）
        arrow.style.left = '-8px'
        arrow.style.right = 'auto'
        arrow.style.transform = 'none'
      }
    },
    
    highlightCurrentStep() {
      // 清除之前的高亮
      document.querySelectorAll('[data-tour]').forEach(el => {
        el.style.boxShadow = ''
        el.style.zIndex = ''
      })
      
      // 添加新的高亮
      const targetEl = document.querySelector(this.currentStep.target)
      if (targetEl) {
        targetEl.style.boxShadow = '0 0 0 4px rgba(24, 144, 255, 0.2)'
        targetEl.style.zIndex = '1001'
      }
    }
  }
}
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.onboarding-card {
  position: fixed;
  width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.tour-content {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 20px;
}

.tour-header {
  margin-bottom: 16px;
}

.step-indicator {
  font-size: 14px;
  color: #1890ff;
  margin-bottom: 8px;
}

.tour-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.tour-body {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* 添加箭头指示器 */
.onboarding-card::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  border-style: solid;
  border-width: 8px 8px 8px 0;
  border-color: transparent white transparent transparent;
}

.resource-links {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
  text-decoration: none;
}

.docs-link {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.docs-link:hover {
  background: rgba(24, 144, 255, 0.15);
  transform: translateX(4px);
}

/* 视频加载时的过渡效果 */
.preview-video {
  transition: opacity 0.3s ease;
}

.preview-video:not([readyState="4"]) {
  opacity: 0.7;
}

/* 确保视频控件样式与整体设计一致 */
.preview-video::-webkit-media-controls {
  background: rgba(0, 0, 0, 0.5);
}

.preview-video::-webkit-media-controls-panel {
  padding: 0 8px;
}

.video-preview {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-video {
  width: 100%;
  aspect-ratio: 16/9;
  display: block;
  object-fit: cover;
}

/* 箭头样式 */
.arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px;
  border-color: transparent white transparent transparent;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

/* 美化滚动条 */
.tour-content::-webkit-scrollbar {
  width: 6px;
}

.tour-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tour-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.tour-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 