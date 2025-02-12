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
              <div :id="`section-0`" class="mb-4">
                <div class="text-sm md:text-base leading-[1.2] text-gray-700 [&>p]:mb-1 whitespace-pre-line space-y-1">
                  <template v-for="(part, i) in parseContent(props.section.rightContent)" :key="i">
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
                    <div 
                      v-else-if="part.type === 'video'"
                      class="video-container my-4"
                    >
                      <video
                        :src="part.src"
                        :controls="part.controls"
                        :preload="part.preload"
                        class="embedded-video w-full rounded-lg"
                      ></video>
                    </div>
                    <i v-else-if="part.type === 'italic' || part.type === 'em'" class="italic">
                      <template v-if="part.nested">
                        <template v-for="(child, j) in part.children" :key="j">
                          <img 
                            v-if="child.type === 'image'"
                            :src="child.src"
                            :alt="child.alt"
                            class="max-w-full h-auto my-4 rounded-lg shadow-sm inline-block"
                            style="margin-left: 0; margin-right: 0;"
                          />
                          <b v-else-if="child.type === 'bold'" class="font-bold">
                            <template v-if="child.nested">
                              <template v-for="(grandChild, k) in child.children" :key="k">
                                <img 
                                  v-if="grandChild.type === 'image'"
                                  :src="grandChild.src"
                                  :alt="grandChild.alt"
                                  class="max-w-full h-auto my-4 rounded-lg shadow-sm inline-block"
                                  style="margin-left: 0; margin-right: 0;"
                                />
                                <span v-else>{{ grandChild.content }}</span>
                              </template>
                            </template>
                            <template v-else>{{ child.content }}</template>
                          </b>
                          <span v-else>{{ child.content }}</span>
                        </template>
                      </template>
                      <template v-else>{{ part.content }}</template>
                    </i>
                    <b v-else-if="part.type === 'bold'" class="font-bold">
                      <template v-if="part.nested">
                        <template v-for="(child, j) in part.children" :key="j">
                          <img 
                            v-if="child.type === 'image'"
                            :src="child.src"
                            :alt="child.alt"
                            class="max-w-full h-auto my-4 rounded-lg shadow-sm inline-block"
                            style="margin-left: 0; margin-right: 0;"
                          />
                          <i v-else-if="child.type === 'italic'" class="italic">
                            <template v-if="child.nested">
                              <template v-for="(grandChild, k) in child.children" :key="k">
                                <img 
                                  v-if="grandChild.type === 'image'"
                                  :src="grandChild.src"
                                  :alt="grandChild.alt"
                                  class="max-w-full h-auto my-4 rounded-lg shadow-sm inline-block"
                                  style="margin-left: 0; margin-right: 0;"
                                />
                                <span v-else>{{ grandChild.content }}</span>
                              </template>
                            </template>
                            <template v-else>{{ child.content }}</template>
                          </i>
                          <span v-else>{{ child.content }}</span>
                        </template>
                      </template>
                      <template v-else>{{ part.content }}</template>
                    </b>
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

const parseHtmlContent = (htmlString) => {
  if (!htmlString) return []
  
  const result = []
  let currentIndex = 0
  const tagRegex = /<(a|i|b)(?:\s+(?:[^>]*?\s+)?href="([^"]*)")?[^>]*>(.*?)<\/\1>/g
  
  let match
  while ((match = tagRegex.exec(htmlString)) !== null) {
    if (match.index > currentIndex) {
      result.push({
        type: 'text',
        content: htmlString.slice(currentIndex, match.index)
      })
    }
    
    const tagType = match[1]
    if (tagType === 'a') {
      let href = match[2]
      if (!href.match(/^https?:\/\//)) {
        href = `https://${href}`
      }
      result.push({
        type: 'link',
        href: href,
        content: match[3]
      })
    } else if (tagType === 'i') {
      result.push({
        type: 'italic',
        content: match[3]
      })
    } else if (tagType === 'b') {
      result.push({
        type: 'bold',
        content: match[3]
      })
    }
    
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
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ? [{
        type: 'text',
        content: node.textContent
      }] : [];
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      // 处理段落
      if (tagName === 'p') {
        const processedNodes = Array.from(node.childNodes).flatMap(processNode);
        // 检查是否为空段落
        if (processedNodes.length === 0 || 
            (processedNodes.length === 1 && 
             processedNodes[0].type === 'text' && 
             processedNodes[0].content.trim() === '')) {
          // 空段落产生空行
          return [{ type: 'text', content: '\n\n' }];
        }
        // 非空段落只在开头添加换行
        return [
          { type: 'text', content: '\n' },
          ...processedNodes
        ];
      }
      
      // 处理换行
      if (tagName === 'br') {
        return [{ type: 'text', content: '\n' }];
      }
      
      // 处理标题和子标题
      if (['h1', 'h2', 'h3'].includes(tagName) || 
          (tagName === 'span' && node.classList.contains('content-subtitle'))) {
        const processedNodes = Array.from(node.childNodes).flatMap(processNode);
        // 标题只在开头添加换行
        return [
          { type: 'text', content: '\n' },
          { type: 'bold', content: node.textContent }
        ];
      }
      
      // 处理粗体
      if (tagName === 'strong' || tagName === 'b') {
        const children = Array.from(node.childNodes).flatMap(processNode);
        return [{
          type: 'bold',
          nested: children.length > 1,
          children,
          content: node.textContent
        }];
      }
      
      // 处理斜体
      if (tagName === 'em' || tagName === 'i') {
        const children = Array.from(node.childNodes).flatMap(processNode);
        return [{
          type: 'italic',
          nested: children.length > 1,
          children,
          content: node.textContent
        }];
      }
      
      // 处理链接
      if (tagName === 'a') {
        return [{
          type: 'link',
          href: node.getAttribute('href'),
          content: node.textContent
        }];
      }
      
      // 处理图片
      if (tagName === 'img') {
        return [{
          type: 'image',
          src: node.getAttribute('src'),
          alt: node.getAttribute('alt') || '',
          class: node.getAttribute('class') || ''
        }];
      }
      
      // 处理视频
      if (tagName === 'video') {
        return [{
          type: 'video',
          src: node.getAttribute('src'),
          controls: node.hasAttribute('controls'),
          preload: 'metadata',
          class: node.getAttribute('class') || ''
        }];
      }
      
      // 处理其他元素
      return Array.from(node.childNodes).flatMap(processNode);
    }
    
    return [];
  };
  
  const results = Array.from(doc.body.childNodes).flatMap(processNode);
  
  // 清理多余的换行
  // 1. 移除开头的换行
  while (results.length > 0 && 
         results[0].type === 'text' && 
         results[0].content.trim() === '') {
    results.shift();
  }
  
  // 2. 移除结尾的换行
  while (results.length > 0 && 
         results[results.length - 1].type === 'text' && 
         results[results.length - 1].content.trim() === '') {
    results.pop();
  }
  
  // 3. 合并连续的换行，但保留空段落产生的双换行
  for (let i = results.length - 2; i >= 0; i--) {
    const current = results[i];
    const next = results[i + 1];
    if (current.type === 'text' && next.type === 'text') {
      const currentIsNewline = current.content.trim() === '';
      const nextIsNewline = next.content.trim() === '';
      if (currentIsNewline && nextIsNewline) {
        // 如果不是双换行（空行标记），则合并
        if (current.content !== '\n\n' && next.content !== '\n\n') {
          results.splice(i, 1);
        }
      }
    }
  }
  
  return results;
};

// 修改提取标题的函数
const extractContentTitle = (content) => {
  if (!content) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const subtitleSpans = doc.querySelectorAll('span.content-subtitle');
  
  return Array.from(subtitleSpans).map(span => span.textContent);
};
</script>
<style scoped>
/* 如果需要任何额外的样式可以在这里添加 */
</style>
