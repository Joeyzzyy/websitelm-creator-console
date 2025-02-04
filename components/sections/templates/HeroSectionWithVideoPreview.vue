<template>
  <div class="relative w-full bg-white py-6">
    <div class="max-w-6xl mx-auto px-8">
      <div class="flex flex-col items-center text-center mb-6">
        <h1 
          v-if="section.topContent.title"
          class="text-xl md:text-2xl font-bold text-gray-900 mb-3"
        >
          {{ section.topContent.title }}
        </h1>
        
        <p 
          v-if="section.topContent.description"
          class="text-xs text-gray-600 mb-4 max-w-2xl whitespace-pre-line"
        >
          {{ section.topContent.description }}
        </p>

        <a 
          v-if="section.topContent.buttonText"
          type="button"
          class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
        >
          {{ section.topContent.buttonText }}
        </a>
      </div>

      <!-- 视频区域 -->
      <div class="relative w-full mx-auto">
        <div :class="theme === 'tech' 
          ? 'rounded-lg transition-all duration-300 bg-white/50 backdrop-blur-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm'
          : 'rounded-lg transition-all duration-200 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'"
        >
          <div class="relative w-full" style="padding-bottom: 56.25%">
            <video
              class="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              :src="section.topContent.videoUrl"
              autoplay
              loop
              muted
              playsinline
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSectionWithVideo',
  props: {
    section: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      isMuted: true,
    }
  },
  computed: {
    getButtonLink() {
      const link = this.section.topContent.buttonLink
      return link ? (link.startsWith('http') ? link : `https://${link}`) : '#'
    }
  },
  methods: {
    toggleMute() {
      if (this.$refs.videoRef) {
        this.isMuted = !this.isMuted
      }
    }
  }
}
</script>