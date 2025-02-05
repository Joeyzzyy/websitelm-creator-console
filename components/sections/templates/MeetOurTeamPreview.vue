<script setup>
import { h } from 'vue';
import { Icon } from '@iconify/vue';
import { 
  LinkedinOutlined, 
  TwitterOutlined, 
  FacebookOutlined,
  InstagramOutlined,
  GithubOutlined,
  YoutubeOutlined,
  GlobalOutlined,
  MailOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
});

// 社交媒体图标映射
const socialIcons = {
  linkedin: () => h(LinkedinOutlined),
  twitter: () => h(TwitterOutlined),
  facebook: () => h(FacebookOutlined),
  instagram: () => h(InstagramOutlined),
  github: () => h(GithubOutlined),
  youtube: () => h(YoutubeOutlined),
  website: () => h(GlobalOutlined),
  email: () => h(MailOutlined),
  // Iconify 图标
  tiktok: () => h(Icon, { icon: 'simple-icons:tiktok' }),
  wechat: () => h(Icon, { icon: 'simple-icons:wechat' }),
  whatsapp: () => h(Icon, { icon: 'simple-icons:whatsapp' }),
  telegram: () => h(Icon, { icon: 'simple-icons:telegram' }),
  discord: () => h(Icon, { icon: 'simple-icons:discord' }),
  medium: () => h(Icon, { icon: 'simple-icons:medium' }),
  reddit: () => h(Icon, { icon: 'simple-icons:reddit' }),
  pinterest: () => h(Icon, { icon: 'simple-icons:pinterest' }),
  snapchat: () => h(Icon, { icon: 'simple-icons:snapchat' }),
  twitch: () => h(Icon, { icon: 'simple-icons:twitch' }),
  behance: () => h(Icon, { icon: 'simple-icons:behance' }),
  dribbble: () => h(Icon, { icon: 'simple-icons:dribbble' }),
  vimeo: () => h(Icon, { icon: 'simple-icons:vimeo' }),
  line: () => h(Icon, { icon: 'simple-icons:line' }),
};
</script>

<template>
  <div class="bg-white py-12 md:py-16">
    <div class="max-w-5xl mx-auto px-4">
      <!-- 顶部内容 -->
      <div class="text-center mb-12">
        <p class="text-xs text-gray-600 mb-2">
          {{ section.topContent.subtitle }}
        </p>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {{ section.topContent.title }}
        </h1>
        <p class="text-base text-gray-600 max-w-2xl mx-auto">
          {{ section.topContent.description }}
        </p>
      </div>

      <!-- 团队成员网格 -->
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-3 mt-12">
        <div 
          v-for="(member, index) in section.bottomContent"
          :key="index"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:bg-blue-50/50 transition-colors duration-200"
        >
          <div class="aspect-w-1 aspect-h-1 relative">
            <img
              :src="member.avatarUrl"
              :alt="member.avatarAlt"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-6 text-center">
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2 hover:text-[#3374FF]">
              {{ member.name }}
            </h3>
            <p class="text-xs text-gray-600">
              {{ member.title }}
            </p>
            <p class="text-[10px] text-gray-600 mb-6 leading-relaxed whitespace-pre-line text-left">
              {{ member.description }}
            </p>
            <div class="flex justify-center space-x-6">
              <template v-for="social in member.socials" :key="social.platform">
                <a
                  v-if="social.url"
                  :href="social.url"
                  class="text-gray-600 hover:text-[#3374FF] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <component :is="socialIcons[social.platform]" class="text-xl" />
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

