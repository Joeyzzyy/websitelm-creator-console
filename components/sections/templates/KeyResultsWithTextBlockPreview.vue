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
          <div ref="stickyRef" class="sticky top-64 inline-block" style="width: 280px">
            <div class="bg-gray-50 p-8 rounded-lg mb-4 w-full">
              <h3 class="text-base font-bold mb-4">
                {{ isChineseContent(props.section.rightContent) ? '目录' : 'Table of Contents' }}
              </h3>
              <ul class="space-y-2">
                <li v-for="(content, index) in props.section.rightContent" :key="`toc-${index}`">
                  <button
                    @click="scrollToSection(`section-${index}`)"
                    class="text-gray-600 hover:text-blue-600 text-xs text-left"
                  >
                    {{ content.contentTitle }}
                  </button>
                </li>
              </ul>
            </div>

            <div v-if="shouldShowKeyResults" class="bg-gray-50 p-8 rounded-lg">
              <h3 class="text-base font-bold mb-6">
                {{ isChineseContent(props.section.rightContent) ? '关键指标' : 'Key Results' }}
              </h3>
              <div v-for="(result, index) in displayedResults" 
                   :key="index"
                   class="mb-8 last:mb-0">
                <div class="text-4xl font-bold mb-2 text-blue-600">
                  {{ result.percentage }}%
                </div>
                <p class="text-xs text-gray-600 whitespace-pre-line">
                  {{ result.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <main class="main-content">
            <article class="article max-w-[900px] pr-4 py-8 md:py-12">
              <div v-for="(content, index) in props.section.rightContent" 
                   :key="index"
                   :id="`section-${index}`"
                   class="mb-8 last:mb-0">
                <h3 class="text-base md:text-lg font-semibold mb-3 text-gray-800">
                  <template v-for="(part, i) in parseHtmlContent(content.contentTitle)" :key="i">
                    <a
                      v-if="part.type === 'link'"
                      :href="part.href"
                      class="text-blue-500 hover:text-blue-700 hover:underline font-bold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{{ part.content }}</a>
                    <span v-else>{{ part.content }}</span>
                  </template>
                </h3>
                <div class="text-sm md:text-base leading-[1.6] text-gray-700 whitespace-pre-line">
                  <template v-for="(part, i) in parseContent(content.contentText)" :key="i">
                    <img 
                      v-if="part.type === 'image'"
                      :src="part.src"
                      :alt="part.alt"
                      class="max-w-full h-auto my-4 rounded-lg shadow-sm"
                      style="margin-left: 0; margin-right: 0;"
                    />
                    <a
                      v-else-if="part.type === 'link'"
                      :href="part.href"
                      class="text-blue-500 hover:text-blue-700 hover:underline font-bold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{{ part.content }}</a>
                    <span v-else>{{ part.content }}</span>
                  </template>
                </div>
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

const { leftContent, rightContent } = props.section

// 解析HTML内容的函数
const parseHtmlContent = (htmlString) => {
  if (!htmlString) return []
  
  const result = []
  let currentIndex = 0
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g
  
  let match
  while ((match = linkRegex.exec(htmlString)) !== null) {
    if (match.index > currentIndex) {
      result.push({
        type: 'text',
        content: htmlString.slice(currentIndex, match.index)
      })
    }
    
    let href = match[1]
    if (!href.match(/^https?:\/\//)) {
      href = `https://${href}`
    }
    
    result.push({
      type: 'link',
      href: href,
      content: match[2]
    })
    
    currentIndex = match.index + match[0].length
  }
  
  if (currentIndex < htmlString.length) {
    result.push({
      type: 'text',
      content: htmlString.slice(currentIndex)
    })
  }
  
  return result
}

// 滚动处理
const handleScroll = () => {
  if (!containerRef.value || !stickyRef.value) return
  
  const container = containerRef.value
  const sticky = stickyRef.value
  const containerRect = container.getBoundingClientRect()
  const stickyHeight = sticky.offsetHeight
  const windowHeight = window.innerHeight
  
  const containerTop = containerRect.top
  const containerBottom = containerRect.bottom
  
  if (containerBottom <= windowHeight) {
    // 当容器底部进入视窗时
    sticky.style.position = 'absolute'
    sticky.style.bottom = '0'
    sticky.style.top = 'auto'
  } else if (containerTop > 0) {
    // 当容器顶部还未进入固定区域时
    sticky.style.position = 'sticky'
    sticky.style.top = '64px'
    sticky.style.bottom = 'auto'
  } else if (containerBottom < stickyHeight + 64) {
    // 当容器底部接近时
    sticky.style.position = 'absolute'
    sticky.style.bottom = '0'
    sticky.style.top = 'auto'
  } else {
    // 正常固定状态
    sticky.style.position = 'sticky'
    sticky.style.top = '64px'
    sticky.style.bottom = 'auto'
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})

// 工具函数
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
  return /[\u4e00-\u9fa5]/.test(content[0]?.contentTitle)
}

// 计算属性
const shouldShowKeyResults = computed(() => {
  if (!props.section.leftContent || !Array.isArray(props.section.leftContent)) {
    return false
  }
  return props.section.leftContent.some(result => result.display === true)
})

const displayedResults = computed(() => {
  return props.section.leftContent?.filter(result => result.display) || []
})

const parseContent = (content) => {
  if (!content) return [];
  
  const result = [];
  let currentIndex = 0;
  
  // 匹配图片标签、链接标签和占位符
  const htmlRegex = /<(img|a)(?:[^>]*?\s+)?(?:src|href)="([^"]*)"[^>]*>(?:(.*?)<\/a>)?|\[Image:\s*([^\]]+)\]/g;
  
  let match;
  while ((match = htmlRegex.exec(content)) !== null) {
    if (match.index > currentIndex) {
      result.push({
        type: 'text',
        content: content.slice(currentIndex, match.index)
      });
    }
    
    if (match[1] === 'img') {
      // 处理 img 标签
      result.push({
        type: 'image',
        src: match[2],
        alt: match[0].match(/alt="([^"]*)"/)?.[1] || ''
      });
    } else if (match[1] === 'a') {
      // 处理链接
      let href = match[2];
      if (!href.match(/^https?:\/\//)) {
        href = `https://${href}`;
      }
      result.push({
        type: 'link',
        href,
        content: match[3]
      });
    } else if (match[4]) {
      // 处理占位符，将其转换为图片对象
      const imageName = match[4].trim();
      result.push({
        type: 'image',
        src: content._images?.find(img => img.name === imageName)?.url || '',
        alt: imageName
      });
    }
    
    currentIndex = match.index + match[0].length;
  }
  
  if (currentIndex < content.length) {
    result.push({
      type: 'text',
      content: content.slice(currentIndex)
    });
  }
  
  return result;
};
</script>
<style scoped>
/* 如果需要任何额外的样式可以在这里添加 */
</style>
