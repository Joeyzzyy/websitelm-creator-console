<template>
  <div class="w-full transition-all duration-200 bg-white py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Top Content -->
      <div class="text-center mb-6 md:mb-10">
        <div v-if="topContent.icon" class="text-gray-900 text-4xl md:text-5xl mb-6 transform transition-transform hover:scale-110">
          {{ topContent.icon }}
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {{ topContent.title }}
        </h2>
        <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {{ topContent.description }}
        </p>
      </div>

      <!-- Bottom Content -->
      <div class="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-8 md:gap-6">
        <template v-for="(block, index) in bottomContent" :key="block.number">
          <div class="rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center w-full md:w-[32%] p-4 md:p-6">
            <div class="text-[#3374FF] text-xl md:text-2xl font-bold mb-2 transform transition-transform hover:scale-110 opacity-90">
              {{ block.number }}
            </div>
            <h4 class="text-base md:text-lg font-semibold text-gray-900 mb-1 tracking-wide">
              {{ block.title }}
            </h4>
            <h5 class="text-sm md:text-base font-medium text-gray-500 mb-1.5">
              {{ block.subTitle }}
            </h5>
            <p class="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {{ block.content }}
            </p>
          </div>
          <div v-if="index < bottomContent.length - 1" class="hidden md:flex items-center text-2xl text-[#3374FF] transform transition-transform hover:scale-110 duration-300 opacity-75">
            →
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  section: { 
    type: Object, 
    required: true 
  }
})

const topContent = computed(() => props.section.topContent)
const bottomContent = computed(() => props.section.bottomContent)
</script>