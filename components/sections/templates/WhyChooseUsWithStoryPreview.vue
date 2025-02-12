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
  <div class="bg-white rounded-lg w-full p-12 py-16">
    <!-- 标题部分 -->
    <div v-if="section.title" class="text-center mb-16">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {{ section.title }}
      </h2>
      <p v-if="section.description" 
         class="text-base text-gray-600 max-w-xl mx-auto">
        {{ section.description }}
      </p>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-[280px_1fr] gap-8" ref="containerRef">
        <!-- 左侧固定部分 -->
        <div class="relative w-[280px]">
          <div ref="stickyRef" class="sticky top-64 inline-block" style="width: 280px">
            <!-- 个人信息卡片 -->
            <div class="bg-gray-50 p-8 rounded-lg">
              <div class="mb-6">
                <img 
                  :src="section.leftContent.avatarUrl" 
                  :alt="section.leftContent.name"
                  class="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 class="text-base font-bold mb-2 text-center">{{ section.leftContent.name }}</h3>
                <p class="text-sm text-gray-600 text-center">{{ section.leftContent.title }}</p>
              </div>
              <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {{ section.leftContent.introduction }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div>
          <main class="main-content">
            <article class="article max-w-[900px] pr-4 py-8 md:py-12">
              <div v-for="(content, index) in section.rightContent" 
                   :key="index" 
                   class="mb-8 last:mb-0">
                <h3 class="text-lg font-bold mb-4 text-gray-800">
                  {{ content.contentTitle }}
                </h3>
                <div class="text-sm md:text-base leading-[1.6] text-gray-700 whitespace-pre-line">
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