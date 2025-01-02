<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white py-12 md:py-16">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {{ section.title }}
      </h2>
      <p class="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed max-w-2xl mx-auto">
        {{ section.subTitle }}
      </p>
      <a 
        :href="section.bottomContent.buttonLink"
        class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5] hover:scale-105"
      >
        {{ section.bottomContent.buttonText }}
      </a>
    </div>
  </div>
</template>