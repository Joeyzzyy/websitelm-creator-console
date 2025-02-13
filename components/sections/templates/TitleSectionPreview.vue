<template>
  <div class="w-full transition-all duration-200 bg-white">
    <header class="w-full">
      <div class="content-wrapper text-center py-4 md:py-8">
        <h1 
          v-if="section.title" 
          class="text-xl md:text-2xl font-bold text-gray-900 mb-4"
        >
          {{ section.title }}
        </h1>
        
        <h2
          v-if="section.subTitle"
          class="text-lg md:text-xl text-gray-500 mb-6"
        >
          {{ section.subTitle }}
        </h2>

        <div class="flex justify-center items-center gap-4">
          <div v-if="section.bottomContent?.author" class="flex items-center">
            <span class="text-xs text-gray-600 font-medium">
              {{ authorLabel }}
            </span>
            <span class="text-xs text-gray-600 ml-1">
              {{ section.bottomContent.author }}
            </span>
          </div>

          <div v-if="section.bottomContent?.publishDate" class="flex items-center">
            <div class="h-4 w-px bg-gray-300 mx-4"></div>
            <span class="text-xs text-gray-600">
              {{ section.bottomContent.publishDate }} · 5 mins read
            </span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'TitleSectionPreview',
  props: {
    section: {
      type: Object,
      required: true
    },
    styles: {
      type: Object,
      required: true
    },
    author: {
      type: String,
      default: ''
    }
  },
  computed: {
    isChineseTitle() {
      return /[\u4e00-\u9fa5]/.test(this.section?.title || '')
    },
    authorLabel() {
      return this.isChineseTitle ? '作者' : 'By'
    },
    dateLabel() {
      return this.isChineseTitle ? '发布日期' : ''
    }
  }
}
</script>