<template>
  <div v-if="visible" class="onboarding-overlay">
    <div 
      ref="tourCard"
      class="onboarding-card"
      :style="calculatePosition(currentStep)"
    >
      <div class="tour-content">
        <div class="tour-header">
          <div class="step-indicator">{{ currentStep.index + 1 }}/{{ steps.length }}</div>
          <div class="tour-title">{{ currentStep.title }}</div>
        </div>
        
        <div class="tour-body">
          <p>{{ currentStep.content }}</p>
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
export default {
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
          placement: 'right'
        },
        {
          title: 'Asset Management',
          content: 'Manage and organize all your digital assets, including images and documents.',
          target: '[data-tour="assetspage"]',
          placement: 'right'
        },
        {
          title: 'Keyword Planning',
          content: 'Use our powerful keyword planning tool to optimize your content strategy.',
          target: '[data-tour="keywordsplanningpage"]',
          placement: 'right'
        },
        {
          title: 'Task Management',
          content: 'Create and manage your tasks, track project progress.',
          target: '[data-tour="taskmanagementpage"]',
          placement: 'right'
        },
        {
          title: 'Settings',
          content: 'Customize your system preferences here. You can always revisit this guide through the button in the bottom left corner.',
          target: '[data-tour="settingspage"]',
          placement: 'right'
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
      
      return {
        position: 'fixed',
        left: `${rect.right + 20}px`,
        top: `${rect.top}px`,
        transform: 'translateY(-50%)'
      }
    },
    
    updatePosition() {
      this.$nextTick(() => {
        const position = this.calculatePosition(this.currentStep)
        Object.assign(this.$refs.tourCard.style, position)
        this.highlightCurrentStep()
      })
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
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.tour-content {
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
</style> 