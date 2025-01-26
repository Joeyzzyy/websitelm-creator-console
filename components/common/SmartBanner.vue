<template>
  <div class="smart-banner" :style="bannerStyles">
    <div class="banner-content">
      <div class="banner-text">
        <h2 class="banner-title" :style="titleStyles">
          <span v-if="emoji" class="banner-emoji">{{ emoji }}</span>
          {{ title }}
        </h2>
        <p class="banner-description" :style="descriptionStyles">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartBanner',
  props: {
    // 主题配置
    theme: {
      type: Object,
      default: () => ({
        primary: '#38BDF8',
        secondary: '#818CF8',
        background: 'linear-gradient(135deg, #1a1a1a, #2d3748)',
        textColor: '#FFFFFF',
        descriptionColor: '#94A3B8',
        badgeColor: '#94A3B8',
        badgeBackground: 'rgba(255, 255, 255, 0.05)',
        badgeHoverBackground: 'rgba(56, 189, 248, 0.1)',
        badgeHoverColor: '#38BDF8',
        iconBackground: 'rgba(255, 255, 255, 0.1)',
      })
    },
    // 内容配置
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    badges: {
      type: Array,
      default: () => []
    },
    emoji: {
      type: String,
      default: ''
    }
  },
  computed: {
    bannerStyles() {
      return {
        background: this.theme.background,
        color: this.theme.textColor,
      }
    },
    titleStyles() {
      return {
        background: `linear-gradient(135deg, ${this.theme.primary}, ${this.theme.secondary})`,
        '-webkit-background-clip': 'text',
      }
    },
    descriptionStyles() {
      return {
        color: this.theme.descriptionColor
      }
    },
    badgeStyles() {
      return {
        color: this.theme.badgeColor,
        background: this.theme.badgeBackground,
        '--hover-bg': this.theme.badgeHoverBackground,
        '--hover-color': this.theme.badgeHoverColor
      }
    }
  }
}
</script>

<style scoped>
.smart-banner {
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.banner-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.banner-description {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.banner-emoji {
  margin-right: 8px;
  font-size: 28px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-description {
    margin: 0 auto;
  }
}
</style> 