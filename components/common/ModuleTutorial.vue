<template>
  <div v-if="visible" class="module-tutorial">
    <div class="tutorial-overlay" @click="handleOverlayClick"></div>
    
    <div 
      class="tutorial-card"
      :style="cardStyle"
      ref="tutorialCard"
    >
      <!-- Close button -->
      <div class="close-button" @click="closeTutorial">
        <CloseOutlined />
      </div>

      <!-- Step indicator -->
      <div class="step-indicator">
        <span class="current-step">{{ currentStepIndex + 1 }}</span>
        <span class="total-steps">/{{ steps.length }}</span>
      </div>

      <!-- Tutorial content -->
      <div class="tutorial-content">
        <h3 class="tutorial-title">{{ currentStep.title }}</h3>
        <div class="tutorial-description" v-html="formattedContent"></div>
      </div>

      <!-- Control buttons -->
      <div class="tutorial-controls">
        <a-button 
          v-if="currentStepIndex > 0"
          @click="prevStep"
        >
          <LeftOutlined /> Previous
        </a-button>
        <a-button 
          type="primary"
          @click="nextStep"
        >
          {{ isLastStep ? 'Finish' : 'Next' }}
          <RightOutlined v-if="!isLastStep" />
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

export default {
  name: 'ModuleTutorial',
  
  components: {
    CloseOutlined,
    LeftOutlined,
    RightOutlined
  },

  props: {
    steps: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:visible', 'complete'],

  data() {
    return {
      currentStepIndex: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  },

  computed: {
    currentStep() {
      return this.steps[this.currentStepIndex];
    },

    isLastStep() {
      return this.currentStepIndex === this.steps.length - 1;
    },

    formattedContent() {
      return this.currentStep?.content.replace(/\n/g, '<br>');
    },

    cardStyle() {
      return this.calculatePosition(this.currentStep);
    }
  },

  methods: {
    calculatePosition(step) {
      if (!step) return {};

      const targetEl = document.querySelector(step.target);
      if (!targetEl) return {};

      const rect = targetEl.getBoundingClientRect();
      const cardWidth = 320;
      const cardHeight = 220;
      const margin = 16;
      const offset = 5;

      // Get viewport dimensions
      const viewportWidth = this.windowWidth;
      const viewportHeight = this.windowHeight;

      // Find all visible modals, dropdowns, and other floating elements
      const floatingElements = document.querySelectorAll('.ant-modal, .ant-dropdown, .ant-select-dropdown:not(.ant-select-dropdown-hidden)');
      const avoidAreas = Array.from(floatingElements).map(el => el.getBoundingClientRect());

      // Calculate positions for all sides
      const positions = {
        right: {
          left: rect.right + margin - offset,
          top: Math.max(margin, rect.top + rect.height/2 - cardHeight/2)
        },
        left: {
          left: rect.left - cardWidth - margin + offset,
          top: Math.max(margin, rect.top + rect.height/2 - cardHeight/2)
        },
        top: {
          left: rect.left + (rect.width - cardWidth) / 2,
          top: rect.top - cardHeight - margin/2 + offset
        },
        bottom: {
          left: rect.left + (rect.width - cardWidth) / 2,
          top: rect.bottom + margin/2 - offset
        }
      };

      // Check each position for overlap with floating elements
      const positionScores = Object.entries(positions).map(([position, coords]) => {
        let score = 0;
        const cardRect = {
          left: coords.left,
          right: coords.left + cardWidth,
          top: coords.top,
          bottom: coords.top + cardHeight
        };

        // Check viewport boundaries
        if (cardRect.left < margin) score -= 1;
        if (cardRect.right > viewportWidth - margin) score -= 1;
        if (cardRect.top < margin) score -= 1;
        if (cardRect.bottom > viewportHeight - margin) score -= 1;

        // Check overlap with floating elements
        avoidAreas.forEach(area => {
          if (this.isOverlapping(cardRect, area)) {
            score -= 2;
          }
        });

        // Prefer the specified position
        if (position === step.position) score += 0.5;

        return { position, coords, score };
      });

      // Select the position with the highest score
      const bestPosition = positionScores.reduce((best, current) => 
        current.score > best.score ? current : best
      );

      let { left, top } = bestPosition.coords;

      // Final boundary check
      left = Math.max(margin, Math.min(left, viewportWidth - cardWidth - margin));
      top = Math.max(margin, Math.min(top, viewportHeight - cardHeight - margin));

      return {
        left: `${left}px`,
        top: `${top}px`
      };
    },

    isOverlapping(rect1, rect2) {
      return !(rect1.right < rect2.left || 
               rect1.left > rect2.right || 
               rect1.bottom < rect2.top || 
               rect1.top > rect2.bottom);
    },

    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      // Recalculate position after resize
      this.$nextTick(() => {
        this.highlightTarget();
      });
    },

    nextStep() {
      if (this.isLastStep) {
        this.closeTutorial();
        this.$emit('complete');
      } else {
        this.currentStepIndex++;
        this.highlightTarget();
      }
    },

    prevStep() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--;
        this.highlightTarget();
      }
    },

    closeTutorial() {
      this.$emit('update:visible', false);
      this.currentStepIndex = 0;
      this.removeAllHighlights();
    },

    handleOverlayClick(e) {
      if (e.target.classList.contains('tutorial-overlay')) {
        this.closeTutorial();
      }
    },

    highlightTarget() {
      this.removeAllHighlights();
      const target = document.querySelector(this.currentStep.target);
      if (target) {
        target.classList.add('tutorial-highlight');
        // Ensure target is in view
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    },

    removeAllHighlights() {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    },

    handleKeydown(e) {
      if (!this.visible) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          this.nextStep();
          break;
        case 'ArrowLeft':
          this.prevStep();
          break;
        case 'Escape':
          this.closeTutorial();
          break;
      }
    }
  },

  watch: {
    visible(newValue) {
      if (newValue) {
        this.highlightTarget();
      } else {
        this.removeAllHighlights();
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('resize', this.handleResize);
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.handleResize);
    this.removeAllHighlights();
  }
};
</script>

<style scoped>
.module-tutorial {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
}

.tutorial-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.tutorial-card {
  position: fixed;
  width: 320px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 10002;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-button:hover {
  color: #666;
}

.step-indicator {
  margin-bottom: 16px;
  color: #1890ff;
  font-size: 14px;
}

.current-step {
  font-weight: 600;
}

.total-steps {
  color: #999;
}

.tutorial-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.tutorial-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.tutorial-controls {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
}

:deep(.ant-btn) {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 全局样式 */
:global(.tutorial-highlight) {
  position: relative;
  z-index: 10001;
}
</style> 