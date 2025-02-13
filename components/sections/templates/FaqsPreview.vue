<template>
  <div class="bg-white py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 标题部分 -->
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      <!-- FAQ列表 -->
      <div class="grid grid-cols-1">
        <div v-for="(faq, index) in section.topContent" 
             :key="index" 
             class="border-b border-gray-200 py-6"
             :class="{ 'border-t': index === 0 }">
          <div class="flex flex-col md:flex-row md:gap-8">
            <div class="md:w-1/2">
              <div class="text-gray-900 text-xs font-medium mb-2">
                {{ String(index + 1).padStart(2, '0') }}
              </div>
              <h3 class="text-sm font-semibold text-gray-900 mb-4 md:mb-0">
                {{ faq.question }}
              </h3>
            </div>
            <div class="md:w-1/2">
              <div class="text-xs text-gray-600 whitespace-pre-line">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div v-if="section.bottomContent?.showButton" class="flex justify-center mt-12">
        <a
          :href="section.bottomContent.buttonLink"
          class="inline-flex items-center text-xs font-medium text-[#0066FF] hover:opacity-80 transition-opacity"
        >
          {{ section.bottomContent.buttonText }}
          <span class="ml-1">&gt;</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>