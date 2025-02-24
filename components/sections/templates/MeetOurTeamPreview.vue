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
  <div class="bg-white py-6 md:py-8">
    <div class="max-w-[90%] mx-auto px-2">
      <!-- 顶部内容 -->
      <div class="text-center mb-6">
        <h2 class="text-[10px] text-blue-600 font-semibold mb-1">
          Our Team
        </h2>
        <h3 class="text-sm font-bold text-gray-900 mb-1">
          {{ section.topContent.title }}
        </h3>
        <p class="text-[8px] text-gray-600 max-w-xl mx-auto">
          {{ section.topContent.description }}
        </p>
      </div>

      <!-- 团队成员网格 -->
      <div class="w-full mx-auto flex justify-center">
        <div class="flex flex-wrap gap-2 justify-center">
          <div 
            v-for="(member, index) in section.bottomContent"
            :key="index"
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:bg-blue-50/50 hover:border-blue-200 border border-transparent transition-colors duration-200 w-[140px] cursor-pointer"
          >
            <div class="w-full h-[100px] relative pt-2">
              <img
                :src="member.avatarUrl"
                :alt="member.avatarAlt"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="p-2 flex flex-col h-[120px]">
              <div class="flex-grow">
                <h3 class="text-[11px] font-semibold text-gray-900 mb-0.5 hover:text-[#3374FF] text-left">
                  {{ member.name }}
                </h3>
                <p class="text-[8px] text-gray-600 mb-2 text-left">
                  {{ member.title }}
                </p>
                <p class="text-gray-600 mb-2 text-[8px] leading-relaxed whitespace-pre-line text-left line-clamp-4">
                  {{ member.description }}
                </p>
              </div>
              <div class="flex space-x-2">
                <template v-for="social in member.socials" :key="social.platform">
                  <a
                    v-if="social.url"
                    :href="social.url"
                    class="text-black hover:text-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <component :is="socialIcons[social.platform]" class="text-xs" />
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

