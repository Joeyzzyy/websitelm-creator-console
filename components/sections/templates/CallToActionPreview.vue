<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white py-10 px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
        {{ section.title }}
      </h2>
      <p class="text-base font-semibold text-gray-900 mb-4 leading-relaxed max-w-2xl mx-auto">
        {{ section.subTitle }}
      </p>
      <a 
        :href="section.bottomContent.buttonLink"
        class="inline-block px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5]"
      >
        {{ section.bottomContent.buttonText }}
      </a>
    </div>
  </div>
</template>