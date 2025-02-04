<template>
  <div class="w-full transition-all duration-200 bg-white py-10 px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Top Content -->
      <div class="text-center mb-6">
        <div v-if="topContent.icon" class="text-gray-900 text-2xl mb-3">
          {{ topContent.icon }}
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          {{ topContent.title }}
        </h2>
        <p class="text-xs text-gray-600 max-w-3xl mx-auto">
          {{ topContent.description }}
        </p>
      </div>

      <!-- Bottom Content -->
      <div class="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-6">
        <template v-for="(block, index) in bottomContent" :key="block.number">
          <div class="rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-sm flex flex-col items-center text-center w-full md:w-[32%] p-4">
            <div class="text-[#3374FF] text-lg font-bold mb-2">
              {{ block.number }}
            </div>
            <h4 class="text-base font-semibold text-gray-900 mb-1">
              {{ block.title }}
            </h4>
            <h5 class="text-xs font-medium text-gray-500 mb-1.5">
              {{ block.subTitle }}
            </h5>
            <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {{ block.content }}
            </p>
          </div>
          <div v-if="index < bottomContent.length - 1" class="hidden md:flex items-center text-xl text-[#3374FF]">
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