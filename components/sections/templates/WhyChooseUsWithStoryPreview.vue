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
  const stickyHeight = sticky.offsetHeight;
  const windowHeight = window.innerHeight;
  
  const containerTop = containerRect.top;
  const containerBottom = containerRect.bottom;
  
  if (containerBottom <= windowHeight) {
    sticky.style.position = 'absolute';
    sticky.style.bottom = '0';
    sticky.style.top = 'auto';
  } else if (containerTop > 0) {
    sticky.style.position = 'sticky';
    sticky.style.top = '128px';
    sticky.style.bottom = 'auto';
  } else if (containerBottom < stickyHeight + 128) {
    sticky.style.position = 'absolute';
    sticky.style.bottom = '0';
    sticky.style.top = 'auto';
  } else {
    sticky.style.position = 'sticky';
    sticky.style.top = '128px';
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
    <div class="max-w-6xl mx-auto px-4">
      <!-- 标题部分 -->
      <div v-if="section.title" class="text-center mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {{ section.title }}
        </h2>
        <p v-if="section.description" 
           class="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          {{ section.description }}
        </p>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="grid grid-cols-[280px_1fr] gap-8" ref="containerRef">
        <!-- 左侧固定部分 -->
        <div class="relative w-[280px]">
          <div ref="stickyRef" class="sticky top-128 inline-block" style="width: 280px">
            <!-- 个人信息卡片 -->
            <div class="bg-gray-50 p-8 rounded-lg">
              <div class="text-center mb-6">
                <img 
                  :src="section.leftContent.avatarUrl" 
                  :alt="section.leftContent.name"
                  class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 class="text-xl font-bold mb-2">{{ section.leftContent.name }}</h3>
                <p class="text-gray-600 text-sm">{{ section.leftContent.title }}</p>
              </div>
              <div class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
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
                   class="mb-8 last:mb-0" 
                   :id="`section-${index}`">
                <h3 class="text-base md:text-lg font-semibold mb-3 text-gray-800">
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