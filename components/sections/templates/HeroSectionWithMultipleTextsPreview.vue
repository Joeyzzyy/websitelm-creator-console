<template>
  <div 
    class="relative pt-20 pb-20 md:pt-36 md:pb-36 bg-white"
  >
    <div class="max-w-6xl mx-auto px-4">
      <div class="relative z-10 pt-8 md:pt-12">
        <div class="flex flex-col items-center gap-4">
          <h1 
            v-if="section.topContent.title"
            class="text-center text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
          >
            <span class="text-gray-900">
              {{ titleFirstPart }}
            </span>
            <span class="inline-block -rotate-1 px-2 py-1 bg-gradient-to-r from-[#3374FF]/[0.75] via-[#3374FF]/[0.5] to-[#3374FF]/[0.75] text-white">
              {{ titleLastTwoWords }}
            </span>
          </h1>
        </div>

        <p 
          v-if="section.topContent.subTitle"
          class="text-base text-gray-600 pt-3 max-w-3xl mx-auto text-center"
        >
          {{ section.topContent.subTitle }}
        </p>

        <div class="pt-8 flex justify-center gap-4">
          <button 
            @click="handleButtonClick('demo')"
            class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white hover:scale-105"
          >
            {{ section.topContent.buttonText }}
          </button>
          
          <button 
            @click="handleButtonClick('getStarted')"
            class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5] hover:scale-105"
          >
            {{ section.topContent.ctaButtonText }}
          </button>
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
      return words.slice(0, -2).join(' ')
    },
    titleLastTwoWords() {
      const words = (this.section.topContent?.title || '').split(' ')
      return words.slice(-2).join(' ')
    }
  },
  methods: {
    handleButtonClick(type) {
      if (type === 'demo') {
        window.open('https://calendly.com/joey-techacc/30min', '_blank')
      } else {
        window.location.href = 'https://app.websitelm.com'
      }
    }
  }
}
</script> 