<template>
  <div class="footer-preview" :style="computedStyles">
    <div class="footer-container">
      <!-- 公司信息部分 -->
      <div class="grid-section company-section">
        <h3 class="company-name" :style="{ color: data.colors?.companyName }">
          {{ data?.companyName || 'Company Name' }}
        </h3>
        <p class="company-desc" :style="{ color: data.colors?.description }">
          {{ data?.description || 'Company description' }}
        </p>
      </div>

      <!-- 功能特性部分 -->
      <div class="grid-section">
        <h4 class="section-title" :style="{ color: data.colors?.featuresTitle }">
          {{ data?.features?.title || 'Features' }}
        </h4>
        <ul class="features-list">
          <li v-for="(feature, index) in data?.features?.items" :key="index">
            <a 
              :href="feature.href" 
              class="feature-link"
              :style="{ color: data.colors?.featureLinks }"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ feature.title }}
            </a>
          </li>
        </ul>
      </div>

      <!-- 订阅部分 -->
      <div 
        v-if="data?.newsletter?.enabled"
        class="grid-section newsletter-section"
      >
        <h4 class="section-title" :style="{ color: data.colors?.newsletterTitle }">
          {{ data?.newsletter?.title || 'Stay Updated' }}
        </h4>
        <p class="newsletter-desc" :style="{ color: data.colors?.newsletterText }">
          {{ data?.newsletter?.text || 'Subscribe to our newsletter' }}
        </p>
        <div class="subscribe-form">
          <input 
            type="email" 
            placeholder="Enter your email"
            class="email-input"
            :style="{
              background: data.colors?.inputBackground,
              color: data.colors?.newsletterText,
              '--placeholder-color': data.colors?.inputPlaceholder
            }"
          >
          <button 
            class="subscribe-button"
            :style="{
              background: data.colors?.buttonBackground,
              color: data.colors?.buttonText
            }"
          >
            {{ data?.newsletter?.buttonText }}
          </button>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- 底部区域 -->
      <div class="bottom-section">
        <p class="copyright" :style="{ color: data.colors?.copyright }">
          {{ data?.copyright || `© ${currentYear} ${data?.companyName || 'Company Name'}. All rights reserved.` }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GlobalOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({
      backgroundType: 'solid',
      backgroundColor: '#000000',
      gradientStart: '#000000',
      gradientEnd: '#1F2937',
      gradientAngle: 135
    })
  }
})

const currentYear = computed(() => new Date().getFullYear())

// 添加计算样式
const computedStyles = computed(() => {
  const styles = {
    background: props.styles.backgroundType === 'solid' 
      ? props.styles.backgroundColor
      : `linear-gradient(${props.styles.gradientAngle}deg, ${props.styles.gradientStart}, ${props.styles.gradientEnd})`,
    transition: 'all 0.3s ease'
  }
  console.log('Computed footer styles:', styles) // 添加调试日志
  return styles
})
</script>

<style scoped>
.footer-preview {
  /* 删除固定的背景色 */
  /* background: #000000; */
  border-radius: 8px;
  padding: 48px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  color: #ffffff;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 32px;
}

.grid-section {
  padding: 0 16px;
}

.company-name,
.company-desc,
.section-title,
.feature-link,
.newsletter-desc,
.copyright {
  transition: color 0.3s ease;
}

.company-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.company-desc {
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.6;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.features-list {
  list-style: none;
  padding: 0;
}

.feature-link {
  color: #9ca3af;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
  line-height: 2;
}

.feature-link:hover {
  color: #ffffff;
}

.newsletter-section {
  grid-column: 3;
}

.newsletter-desc {
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 16px;
}

.subscribe-form {
  display: flex;
  gap: 8px;
}

.email-input {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #374151;
  font-size: 14px;
}

.email-input::placeholder {
  color: var(--placeholder-color);
  opacity: 1;
}

.subscribe-button {
  padding: 8px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
}

.subscribe-button:hover {
  opacity: 0.9;
}

.divider {
  grid-column: 1 / -1;
  height: 1px;
  background: #374151;
  margin: 32px 0;
}

.bottom-section {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
}

.copyright {
  color: #9ca3af;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
  }

  .newsletter-section {
    grid-column: 1;
  }

  .bottom-section {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
}
</style> 