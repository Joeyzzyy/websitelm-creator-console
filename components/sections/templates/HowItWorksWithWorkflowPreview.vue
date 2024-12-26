<template>
  <div class="w-full transition-all duration-200 bg-white py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Top Content -->
      <div class="text-center mb-8 md:mb-12">
        <div v-if="topContent.icon" class="text-gray-900 text-6xl mb-4">
          {{ topContent.icon }}
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {{ topContent.title }}
        </h2>
        <p class="text-base text-gray-600 max-w-3xl mx-auto">
          {{ topContent.description }}
        </p>
      </div>

      <!-- Bottom Content -->
      <div class="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4">
        <template v-for="(block, index) in bottomContent" :key="block.number">
          <div class="rounded-lg transition-all duration-200 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm flex flex-col items-center text-center w-full md:w-[30%] p-4">
            <div class="text-[#3374FF] text-5xl md:text-6xl font-bold mb-3">
              {{ block.number }}
            </div>
            <h4 class="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {{ block.title }}
            </h4>
            <h5 class="text-base md:text-lg font-medium text-gray-700 mb-2">
              {{ block.subTitle }}
            </h5>
            <p class="text-base text-gray-600 leading-relaxed">
              {{ block.content }}
            </p>
          </div>
          <div v-if="index < bottomContent.length - 1" class="hidden md:block text-[#3374FF] text-4xl">
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