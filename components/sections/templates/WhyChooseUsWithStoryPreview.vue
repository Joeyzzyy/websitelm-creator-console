<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
});

const containerRef = ref(null);
const stickyRef = ref(null);

const handleScroll = () => {
  if (!containerRef.value || !stickyRef.value) return;
  
  const container = containerRef.value;
  const sticky = stickyRef.value;
  const containerRect = container.getBoundingClientRect();
  const stickyRect = sticky.getBoundingClientRect();
  const topOffset = 64;
  
  const containerTop = window.pageYOffset + containerRect.top;
  const containerBottom = containerTop + containerRect.height;
  
  const currentScroll = window.pageYOffset;

  if (currentScroll + topOffset < containerTop) {
    sticky.style.position = 'absolute';
    sticky.style.top = '0';
    sticky.style.bottom = 'auto';
  } else if (currentScroll + topOffset + stickyRect.height > containerBottom) {
    sticky.style.position = 'absolute';
    sticky.style.top = `${containerRect.height - stickyRect.height}px`;
    sticky.style.bottom = 'auto';
  } else {
    sticky.style.position = 'fixed';
    sticky.style.top = `${topOffset}px`;
    sticky.style.bottom = 'auto';
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>

<template>
  <div class="bg-white rounded-lg w-full h-full min-h-full p-4 relative">
    <div class="max-w-3xl mx-auto w-full h-full">
      <!-- 标题部分 -->
      <div v-if="section.title" class="text-center mb-4">
        <h2 class="text-lg font-bold text-gray-900 mb-1">
          {{ section.title }}
        </h2>
        <p v-if="section.description" 
           class="text-xs text-gray-600 max-w-xl mx-auto">
          {{ section.description }}
        </p>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="grid grid-cols-[200px_1fr] gap-6 w-full h-full" ref="containerRef">
        <!-- 左侧固定部分 -->
        <div class="relative w-[200px]">
          <div ref="stickyRef" class="sticky top-16 inline-block" style="width: 200px">
            <!-- 个人信息卡片 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-center mb-3">
                <img 
                  :src="section.leftContent.avatarUrl" 
                  :alt="section.leftContent.name"
                  class="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                />
                <h3 class="text-sm font-bold mb-1">{{ section.leftContent.name }}</h3>
                <p class="text-xs text-gray-600">{{ section.leftContent.title }}</p>
              </div>
              <div class="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                {{ section.leftContent.introduction }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div>
          <main class="main-content">
            <article class="article max-w-[400px] pr-2">
              <div v-for="(content, index) in section.rightContent" 
                   :key="index" 
                   class="mb-4 last:mb-0">
                <h3 class="text-sm font-semibold mb-2 text-gray-800">
                  {{ content.contentTitle }}
                </h3>
                <div class="text-xs leading-[1.6] text-gray-700 whitespace-pre-line">
                  {{ content.contentText }}
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-white {
  min-height: 100%;
  height: 100%;
  width: 100%;
}
</style>