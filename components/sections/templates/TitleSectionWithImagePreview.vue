<template>
  <div class="relative z-10 flex items-center w-full transition-all duration-200 bg-white py-12 md:py-16">
    <header class="w-full">
      <div class="max-w-6xl mx-auto px-8">
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div class="w-full md:w-1/2">
            <div class="max-w-xl">
              <h1 
                v-if="section.title" 
                class="text-xl md:text-2xl font-bold text-gray-900 mb-4"
              >
                {{ section.title }}
              </h1>
              
              <h2 
                v-if="section.subTitle" 
                class="text-lg md:text-xl font-semibold text-gray-900 mb-6"
              >
                {{ section.subTitle }}
              </h2>
              
              <div class="flex gap-8">
                <div v-if="section.leftContent.author">
                  <span class="text-xs text-gray-600 block mb-1 font-medium">
                    {{ isChineseTitle ? '作者' : 'WRITTEN BY' }}
                  </span>
                  <span class="text-xs text-gray-600">
                    {{ section.leftContent.author }}
                  </span>
                </div>
                
                <div v-if="section.leftContent.publishDate">
                  <span class="text-xs text-gray-600 block mb-1 font-medium">
                    {{ isChineseTitle ? '发布日期' : 'PUBLISHED ON' }}
                  </span>
                  <span class="text-xs text-gray-600">
                    {{ section.leftContent.publishDate }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧图片 -->
          <div class="w-full md:w-1/2">
            <div class="relative w-full pt-[75%] rounded-lg overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm">
              <img 
                v-if="section.rightContent.imageUrl"
                :src="section.rightContent.imageUrl"
                :alt="section.rightContent.imageAlt"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'TitleSectionWithImagePreview',
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  computed: {
    isChineseTitle() {
      return /[\u4e00-\u9fa5]/.test(this.section.title)
    }
  }
}
</script>