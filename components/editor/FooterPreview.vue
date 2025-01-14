<template>
  <div class="footer-preview">
    <div class="footer-container">
      <!-- 公司信息部分 -->
      <div class="grid-section company-section">
        <h3 class="company-name">{{ data?.companyName || 'Company Name' }}</h3>
        <p class="company-desc">{{ data?.description || 'Company description' }}</p>
      </div>

      <!-- 功能特性部分 -->
      <div class="grid-section">
        <h4 class="section-title">Features</h4>
        <ul class="features-list">
          <li v-for="(feature, index) in data?.features" :key="index">
            <a :href="feature.href" target="_blank" rel="noopener noreferrer" class="feature-link">{{ feature.title }}</a>
          </li>
        </ul>
      </div>

      <!-- 订阅部分 -->
      <div class="grid-section newsletter-section">
        <h4 class="section-title">Stay Updated</h4>
        <p class="newsletter-desc">{{ data?.newsletter?.text }}</p>
        <div class="subscribe-form">
          <input 
            type="email" 
            placeholder="Enter your email"
            class="email-input"
          >
          <button class="subscribe-button">{{ data?.newsletter?.buttonText }}</button>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- 底部区域 -->
      <div class="bottom-section">
        <div class="social-links">
          <a v-for="(link, type) in data?.socialMedia" 
             :key="type"
             :href="link"
             target="_blank"
             class="social-link"
          >
            <component :is="getSocialIcon(type)" />
          </a>
        </div>
        <p class="copyright">{{ data?.copyright || `© ${currentYear} ${data?.companyName || 'Company Name'}. All rights reserved.` }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  LinkedinOutlined,
  MessageOutlined 
} from '@ant-design/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const currentYear = computed(() => new Date().getFullYear())

const getSocialIcon = (type) => {
  const icons = {
    twitter: TwitterOutlined,
    youtube: YoutubeOutlined,
    linkedin: LinkedinOutlined,
    discord: MessageOutlined
  }
  return icons[type]
}
</script>

<style scoped>
.footer-preview {
  background: #000000;
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
  background: #1f2937;
  border: 1px solid #374151;
  color: #ffffff;
  font-size: 14px;
}

.subscribe-button {
  padding: 8px 24px;
  background: #2563eb;
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.subscribe-button:hover {
  background: #1d4ed8;
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
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.social-links {
  display: flex;
  gap: 24px;
}

.social-link {
  color: #9ca3af;
  transition: color 0.2s;
}

.social-link:hover {
  color: #ffffff;
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