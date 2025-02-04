<template>
  <div 
    class="relative pt-6 pb-6 bg-white"
  >
    <div class="max-w-6xl mx-auto px-8">
      <div class="relative z-10">
        <div class="flex flex-col items-center gap-3">
          <h1 
            v-if="section.topContent.title"
            class="text-center text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
          >
            <span class="text-gray-900">
              {{ titleFirstPart }}
            </span>
            <span class="inline-block -rotate-1 px-2 py-1 bg-gradient-to-r from-[#3374FF]/[0.75] via-[#3374FF]/[0.5] to-[#3374FF]/[0.75] text-white">
              {{ titleLastWords }}
            </span>
          </h1>
        </div>

        <p 
          v-if="section.topContent.subTitle"
          class="text-xs text-gray-600 pt-2 max-w-3xl mx-auto text-center"
        >
          {{ section.topContent.subTitle }}
        </p>

        <div class="pt-4 flex justify-center items-center gap-3">
          <button 
            v-if="section.topContent.showButton"
            @click="handleButtonClick('demo')"
            class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
          >
            {{ section.topContent.buttonText }}
          </button>
          
          <button 
            v-if="section.topContent.showCtaButton"
            @click="handleButtonClick('getStarted')"
            class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5]"
          >
            {{ section.topContent.ctaButtonText }}
          </button>

          <!-- Product Hunt Widget -->
          <a 
            v-if="section.topContent.enableProductHunt && section.topContent.productHuntId"
            :href="`https://www.producthunt.com/posts/${section.topContent.productHuntId}?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-${section.topContent.productHuntId}`" 
            target="_blank"
            class="transition-transform duration-200"
          >
            <img 
              :src="`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${section.topContent.productHuntId}&theme=light`" 
              :alt="`${section.topContent.productHuntId} - Featured on Product Hunt`" 
              style="width: 200px; height: 43px;"
              width="200"
              height="43"
            />
          </a>
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