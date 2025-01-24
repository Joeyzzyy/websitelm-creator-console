<template>
  <div class="footer-preview" :style="computedStyles">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="main-content">
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
      </div>

      <!-- 底部区域 -->
      <div class="footer-bottom">
        <!-- Social Media Icons -->
        <div class="footer-bottom-left">
          <div class="social-icons">
            <a
              v-for="(social, index) in data.socialMedia?.links?.links || data.socialMedia?.links"
              :key="index"
              :href="social.url"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <component 
                :is="getSocialIcon(social.platform)"
                class="social-icon"
                :style="{ 
                  fontSize: `${data.socialMedia?.iconSize || 24}px`,
                  color: data.socialMedia?.iconColor || '#9CA3AF'
                }"
              />
            </a>
          </div>
        </div>
        
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
import {
  FacebookFilled,
  TwitterOutlined,
  InstagramFilled,
  LinkedinFilled,
  GithubFilled,
  YoutubeFilled,
  RedditOutlined,
  MediumOutlined,
  BehanceOutlined,
  DribbbleOutlined,
  MailOutlined,
  // Add more icons as needed
} from '@ant-design/icons-vue'

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

// Add social icon mapping function
const getSocialIcon = (platform) => {
  const iconMap = {
    facebook: FacebookFilled,
    twitter: TwitterOutlined,
    instagram: InstagramFilled,
    linkedin: LinkedinFilled,
    github: GithubFilled,
    youtube: YoutubeFilled,
    reddit: RedditOutlined,
    medium: MediumOutlined,
    behance: BehanceOutlined,
    dribbble: DribbbleOutlined,
    website: GlobalOutlined,
    email: MailOutlined,
    // Add more mappings as needed
  }
  return iconMap[platform] || GlobalOutlined
}
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
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 32px;
  flex: 1;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  margin-top: 32px;
  padding-left: 32px;
  padding-right: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.social-icons {
  display: flex;
  gap: 24px;
  align-items: center;
}

.social-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.social-link:hover {
  opacity: 0.8;
}

.social-icon {
  transition: all 0.3s ease;
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

  .footer-bottom {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .footer-bottom-left {
    justify-content: center;
  }
}
</style> 