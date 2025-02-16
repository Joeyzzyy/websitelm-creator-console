<template>
  <div class="bg-white py-8 md:py-12">
    <div class="w-[85%] mx-auto">
      <!-- 顶部内容 -->
      <div class="text-center mb-6">
        <h2 class="text-base md:text-xl font-bold mb-3 text-gray-900">
          {{ section.topContent.title }}
        </h2>
        <p class="text-2xs md:text-xs mb-4 text-gray-600">
          {{ section.topContent.description }}
        </p>
        <a
          :href="formatUrl(section.topContent.buttonLink)"
          class="inline-block px-6 py-2 rounded-3xl text-sm font-semibold bg-[#3374FF] text-white hover:bg-blue-700"
        >
          {{ section.topContent.buttonText }}
        </a>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <!-- 左侧图片 -->
        <div class="w-full md:w-1/2">
          <div class="aspect-[4/3] overflow-hidden rounded-xl">
            <img 
              :src="section.leftContent.imageUrl"
              :alt="section.leftContent.imageAlt"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="w-full md:w-1/2">
          <div class="grid bg-transparent">
            <div
              v-for="(item, index) in section.rightContent"
              :key="index"
              class="flex items-start gap-4 p-4 hover:bg-gray-50/80 transition-colors"
            >
              <div class="w-4 h-4 flex-shrink-0 rounded-lg flex items-center justify-center bg-gray-100">
                <Icon 
                  v-if="item.icon"
                  :icon="item.icon"
                  class="text-gray-600"
                  width="12"
                  height="12"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-xs md:text-sm font-semibold mb-1 text-gray-900">
                  {{ item.contentTitle }}
                </h3>
                <p class="text-[10px] md:text-2xs text-gray-600">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'ProductBenefitsWithTablePreview',
  components: {
    Icon
  },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatUrl(url) {
      if (!url) return '#';
      return url.startsWith('http') ? url : `https://${url}`;
    }
  }
}
</script>

<style scoped>
/* 添加图标容器的悬停效果 */
.icon-container {
  transition: all 0.3s ease;
}

.icon-container:hover {
  background-color: #f3f4f6;
  transform: scale(1.05);
}

/* 优化图标显示 */
:deep(.iconify) {
  transition: transform 0.3s ease;
}

.flex:hover :deep(.iconify) {
  transform: scale(1.1);
}
</style>