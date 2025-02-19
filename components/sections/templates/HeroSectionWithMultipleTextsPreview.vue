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

          <div class="pt-6 flex justify-center gap-2 flex-wrap">
            <button 
              v-if="section.topContent.showButton"
              @click="handleButtonClick('demo')"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-transparent text-white border-2 border-white hover:scale-105"
            >
              {{ section.topContent.buttonText }}
            </button>
            
            <button 
              v-if="section.topContent.showCtaButton"
              @click="handleButtonClick('getStarted')"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:scale-105"
            >
              {{ section.topContent.ctaButtonText }}
            </button>

            <!-- Discord 按钮 -->
            <a
              v-if="section.topContent.enableDiscord && section.topContent.discordLink"
              :href="section.topContent.discordLink"
              target="_blank"
              class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-[#5865F2] text-white hover:bg-[#4752C4] hover:scale-105 border-2 border-white"
            >
              <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join Discord
            </a>

            <a 
              v-if="section.topContent.enableProductHunt && section.topContent.productHuntId"
              :href="`https://www.producthunt.com/posts/${section.topContent.productHuntId}?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-${section.topContent.productHuntId}`" 
              target="_blank"
              class="transition-transform duration-200 hover:scale-105"
            >
              <img 
                :src="`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${section.topContent.productHuntId}&theme=light`" 
                :alt="`${section.topContent.productHuntId} - Featured on Product Hunt`" 
                style="width: 180px; height: 40px;"
                width="180"
                height="40"
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