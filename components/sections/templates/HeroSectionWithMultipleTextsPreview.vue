<template>
  <div class="py-10">
    <div 
      class="relative bg-gradient-to-b from-[#3374FF] to-[#1F4699] w-[95%] mx-auto rounded-2xl py-10"
    >
      <div class="max-w-6xl mx-auto px-8">
        <div class="relative z-10 pt-8 md:pt-12">
          <div class="flex flex-col items-center gap-4">
            <h1 
              v-if="section.topContent.title"
              class="text-center text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight leading-tight text-white"
            >
              {{ section.topContent.title }}
            </h1>
          </div>

          <p 
            v-if="section.topContent.subTitle"
            class="text-center text-sm md:text-base font-semibold text-white pt-3 max-w-3xl mx-auto"
          >
            {{ section.topContent.subTitle }}
          </p>

          <div class="pt-6 flex justify-center gap-3">
            <button 
              v-if="section.topContent.showButton"
              @click="handleButtonClick('demo')"
              class="px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 bg-transparent text-white border-2 border-white hover:scale-105"
            >
              {{ section.topContent.buttonText }}
            </button>
            
            <button 
              v-if="section.topContent.showCtaButton"
              @click="handleButtonClick('getStarted')"
              class="px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:scale-105"
            >
              {{ section.topContent.ctaButtonText }}
            </button>

            <a 
              v-if="section.topContent.enableProductHunt && section.topContent.productHuntId"
              :href="`https://www.producthunt.com/posts/${section.topContent.productHuntId}?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-${section.topContent.productHuntId}`" 
              target="_blank"
              class="transition-transform duration-200 hover:scale-105"
            >
              <img 
                :src="`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${section.topContent.productHuntId}&theme=light`" 
                :alt="`${section.topContent.productHuntId} - Featured on Product Hunt`" 
                style="width: 250px; height: 54px;"
                width="250"
                height="54"
              />
            </a>
          </div>

          <!-- 修改 banner 图片区域，使用动态的图片 URL -->
          <div class="mt-12 w-full flex justify-center">
            <img 
              :src="section.topContent.bannerImage || 'https://picsum.photos/1200/600'"
              alt="Banner"
              class="w-[95%] h-auto object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSectionWithMultipleTextsPreview',
  props: {
    section: {
      type: Object,
      required: true
    },
    styles: {
      type: Object,
      required: true
    }
  },
  computed: {
    titleFirstPart() {
      const words = (this.section.topContent?.title || '').split(' ')
      const highlightCount = this.section.topContent?.highlightWordCount || 2
      return words.slice(0, -highlightCount).join(' ')
    },
    titleLastWords() {
      const words = (this.section.topContent?.title || '').split(' ')
      const highlightCount = this.section.topContent?.highlightWordCount || 2
      return words.slice(-highlightCount).join(' ')
    }
  },
  methods: {
    handleButtonClick(type) {
      if (type === 'demo') {
        window.open(this.section.topContent.buttonLink || 'https://calendly.com/joey-techacc/30min', '_blank')
      } else {
        window.open(this.section.topContent.ctaButtonLink || 'https://app.websitelm.com', '_blank')
      }
    }
  }
}
</script>

<style scoped>
.ph-widget-preview {
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.ph-widget-preview:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style> 