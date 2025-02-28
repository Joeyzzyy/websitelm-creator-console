<template>
  <div class="bg-white rounded-lg w-full p-12 py-16">
    <div v-if="props.section.title" class="text-center mb-16">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {{ props.section.title }}
      </h2>
    </div>
    
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-[280px_1fr] gap-8" ref="containerRef">
        <div class="relative w-[280px]">
          <div ref="stickyRef" class="sticky top-4" style="width: 280px">
            <div class="bg-gray-50 p-8 rounded-lg mb-4 w-full">
              <h3 class="text-base font-bold mb-4">
                {{ isChineseContent(props.section.rightContent) ? '目录' : 'Table of Contents' }}
              </h3>
              <ul class="space-y-2">
                <template v-for="(title, titleIndex) in extractContentTitle(props.section.rightContent)" :key="`title-${titleIndex}`">
                  <li>
                    <button
                      @click="scrollToSection(`section-${titleIndex}`)"
                      class="text-gray-600 hover:text-blue-600 text-xs text-left"
                    >
                      {{ title }}
                    </button>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <main class="main-content">
            <article class="article max-w-[900px] pr-4">
              <div :id="`section-0`" class="mb-4 article-content">
                <div v-html="props.section.rightContent" class="text-sm md:text-base leading-[1.2] text-gray-700"></div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const containerRef = ref(null)
const stickyRef = ref(null)

const handleScroll = () => {
  if (!containerRef.value || !stickyRef.value) return
  
  const container = containerRef.value
  const sticky = stickyRef.value
  const containerRect = container.getBoundingClientRect()
  
  // 简化滚动逻辑，只需保持在顶部固定即可
  sticky.style.position = 'sticky'
  sticky.style.top = '1rem' // 对应 top-4 的样式
  sticky.style.bottom = 'auto'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const isChineseContent = (content) => {
  if (!content) return false;
  return /[\u4e00-\u9fa5]/.test(content);
}

const extractContentTitle = (content) => {
  if (!content) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const subtitleSpans = doc.querySelectorAll('span.content-subtitle');
  
  return Array.from(subtitleSpans).map(span => span.textContent);
};
</script>
<style scoped>
/* 添加样式以匹配编辑器输出的HTML内容 */
.article-content :deep(p) {
  margin-bottom: 1em;
}

.article-content :deep(b), 
.article-content :deep(strong) {
  font-weight: bold;
}

.article-content :deep(i),
.article-content :deep(em) {
  font-style: italic;
}

.article-content :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(img.embedded-image) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.article-content :deep(.video-container) {
  margin: 1rem 0;
}

.article-content :deep(.embedded-video) {
  max-width: 100%;
  border-radius: 0.5rem;
}

.article-content :deep(.content-subtitle) {
  font-size: 1.25em;
  font-weight: 600;
  color: #374151;
  display: inline-block;
  line-height: 1.4;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
</style>
