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
          <div class="content-wrapper">
            <div class="content-icon">
              <BulbOutlined />
            </div>
            <div class="content-text">
              {{ currentStep.content }}
            </div>
          </div>
          
          <div v-if="currentStep.features" class="feature-list">
            <div class="feature-list-title">
              Tutorials of this section:
            </div>
            <div v-for="(feature, index) in currentStep.features" 
                 :key="index" 
                 class="feature-item"
            >
              <QuestionCircleOutlined class="feature-icon" />
              <a 
                :href="feature.link" 
                target="_blank" 
                class="feature-link"
              >
                How to set up {{ feature.title }}
              </a>
            </div>
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
import { defineComponent } from 'vue'
import { FileTextOutlined, BulbOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { tourConfig } from '../config/tutorials'

export default defineComponent({
  name: 'OnboardingTour',
  components: {
    FileTextOutlined,
    BulbOutlined,
    QuestionCircleOutlined
  },
  
  data() {
    return {
      visible: false,
      currentStepIndex: 0,
      steps: [
        tourConfig.onboarding,
        tourConfig.assetManagement,
        tourConfig.keywordPlanning,
        tourConfig.taskManagement,
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
      this.navigateToStep(this.steps[0])
    },
    
    nextStep() {
      if (this.isLastStep) {
        this.complete()
      } else {
        this.currentStepIndex++
        this.navigateToStep(this.currentStep)
      }
    },
    
    prevStep() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--
        this.navigateToStep(this.currentStep)
      }
    },
    
    async complete() {
      try {
        // 调用 API 更新 onboarding 状态
        await apiClient.updateOnboardingStatus('completed')
        
        // 隐藏引导界面
        this.visible = false
        
        // 触发完成事件
        this.$emit('complete')
        
        // 导航到 dashboard 页面
        if (this.$router.currentRoute.value.path !== '/dashboard') {
          await this.$router.push('/dashboard')
        }
      } catch (error) {
        console.error('完成引导流程时出错:', error)
        this.$message.error('完成引导流程时出错，请稍后重试')
      }
    },
    
    calculatePosition(step) {
      const targetEl = document.querySelector(step.target)
      if (!targetEl) return {}

      const rect = targetEl.getBoundingClientRect()
      const cardWidth = 400
      const cardHeight = 400
      const margin = 20
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // 基础位置设置 - 调整垂直位置计算
      let position = {
        position: 'fixed',
        left: `${rect.right + margin}px`,
        // 将弹窗垂直居中对齐目标元素，但确保不超出视口边界
        top: `${Math.max(margin, Math.min(
          rect.top + (rect.height - cardHeight) / 2,
          viewportHeight - cardHeight - margin
        ))}px`,
        transform: 'none'
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
              left: `${Math.max(margin, Math.min(rect.left, viewportWidth - cardWidth - margin))}px`,
              top: `${rect.bottom + margin}px`,
              transform: 'none'
            }
          } 
          // 否则放在上方
          else {
            position = {
              position: 'fixed',
              left: `${Math.max(margin, Math.min(rect.left, viewportWidth - cardWidth - margin))}px`,
              top: `${rect.top - cardHeight - margin}px`,
              transform: 'none'
            }
          }
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
    },
    
    navigateToStep(step) {
      const routeMap = {
        '[data-tour="dashboardpage"]': '/dashboard',
        '[data-tour="assetspage"]': '/assets',
        '[data-tour="keywordsplanningpage"]': '/keywords',
        '[data-tour="taskmanagementpage"]': '/task-management',
        '[data-tour="settingspage"]': '/settings'
      }
      
      const route = routeMap[step.target]
      if (route && this.$router.currentRoute.value.path !== route) {
        this.$router.push(route).then(() => {
          this.$nextTick(() => {
            this.updatePosition()
          })
        })
      } else {
        this.updatePosition()
      }
    }
  }
})
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
  max-height: calc(100vh - 40px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.tour-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
}

.tour-header {
  margin-bottom: 16px;
  flex-shrink: 0;
}

.step-indicator {
  font-size: 13px;
  color: #1890ff;
  margin-bottom: 6px;
}

.tour-title {
  font-size: 16px;
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
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: white;
  flex-shrink: 0;
  border-radius: 0 0 12px 12px;
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
  margin: 16px 0;
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
  background: #1890ff;
  color: white;
  font-weight: 500;
}

.docs-link:hover {
  background: #40a9ff;
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

.content-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.content-icon {
  color: #1890ff;
  font-size: 20px;
  padding-top: 2px;
}

.content-text {
  flex: 1;
  line-height: 1.5;
  font-size: 14px;
}

.feature-list {
  margin: 12px 0;
}

.feature-list-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #e6f7ff;
}

.feature-icon {
  color: #1890ff;
  font-size: 14px;
}

.feature-link {
  color: #1890ff;
  text-decoration: none;
  transition: all 0.3s ease;
  flex: 1;
}

.feature-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}
</style> 