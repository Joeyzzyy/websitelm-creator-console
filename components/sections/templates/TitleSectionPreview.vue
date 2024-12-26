<template>
  <div class="w-full transition-all duration-200 bg-white">
    <header class="w-full">
      <div class="content-wrapper text-center py-12 md:py-16">
        <h1 
          v-if="section.title" 
          class="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          {{ section.title }}
        </h1>
        
        <h2
          v-if="section.subTitle"
          class="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
        >
          {{ section.subTitle }}
        </h2>

        <div class="flex justify-center gap-8">
          <div v-if="section.bottomContent?.author">
            <span class="text-base text-gray-600 block mb-1 font-medium">
              {{ authorLabel }}
            </span>
            <span class="text-base text-gray-600">
              {{ section.bottomContent.author }}
            </span>
          </div>

          <div v-if="section.bottomContent?.publishDate">
            <span class="text-base text-gray-600 block mb-1 font-medium">
              {{ dateLabel }}
            </span>
            <span class="text-base text-gray-600">
              {{ section.bottomContent.publishDate }}
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
      return this.isChineseTitle ? '作者' : 'WRITTEN BY'
    },
    dateLabel() {
      return this.isChineseTitle ? '发布日期' : 'PUBLISHED ON'
    }
  }
}
</script>