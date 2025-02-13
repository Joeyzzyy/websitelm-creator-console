<template>
  <div class="relative w-full bg-white">
    <div class="w-[95%] mx-auto relative">
      <!-- 视频容器 -->
      <div class="relative w-full" style="padding-bottom: 56.25%">
        <video
          ref="videoRef"
          class="absolute top-0 left-0 w-full h-full object-cover"
          :src="section.topContent.videoUrl"
          autoplay
          loop
          muted
          playsinline
          controls
        />
        <!-- 内容覆盖层 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 
            v-if="section.topContent.title"
            class="text-white mb-4 font-bold text-xl md:text-2xl"
          >
            {{ section.topContent.title }}
          </h1>
          
          <p 
            v-if="section.topContent.description"
            class="text-white mb-6 max-w-2xl whitespace-pre-line text-xs"
          >
            {{ section.topContent.description }}
          </p>

          <a 
            v-if="section.topContent.buttonText"
            :href="getButtonLink"
            class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861db]"
          >
            {{ section.topContent.buttonText }}
          </a>
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