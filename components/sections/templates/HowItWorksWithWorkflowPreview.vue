<template>
  <div class="bg-[#e6eeff] py-8 md:py-12">
    <div class="w-[90%] mx-auto">
      <div class="flex flex-col md:flex-row gap-6 items-center">
        <!-- Left Section -->
        <div class="w-full md:w-1/2">
          <h2 class="text-sm font-bold text-gray-900 mb-1">
            {{ topContent.title }}
          </h2>
          <h3 v-if="topContent.subTitle" class="text-xs text-gray-600 leading-relaxed mb-4">
            {{ topContent.subTitle }}
          </h3>
          <!-- Example Image -->
          <div class="mb-8 aspect-[4/3] overflow-hidden rounded-lg">
            <img 
              :src="topContent.imageUrl"
              :alt="topContent.imageAlt"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <!-- Button Group -->
          <div v-if="topContent.showButton || topContent.showCtaButton" class="flex flex-col sm:flex-row gap-2">
            <a 
              v-if="topContent.showButton"
              :href="topContent.buttonLink"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 rounded-full bg-[#3374FF] text-white text-xs font-medium hover:bg-blue-700 transition-colors duration-300 text-center"
            >
              {{ topContent.buttonText }}
            </a>
            <a 
              v-if="topContent.showCtaButton"
              :href="topContent.ctaButtonLink"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 text-[#3374FF] text-xs font-medium hover:text-blue-700 transition-colors duration-300 flex items-center"
            >
              {{ topContent.ctaButtonText }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right Section -->
        <div class="w-full md:w-1/2">
          <div class="flex flex-col divide-y divide-[#dfdfdf]">
            <div v-for="(block, index) in bottomContent" 
              :key="block.number"
              class="flex gap-3 py-6 first:pt-0 last:pb-0">
              <div class="text-[10px] font-medium text-gray-900 shrink-0 w-6">
                {{ block.number }}
              </div>
              <div>
                <h4 v-if="block.title" class="text-[10px] font-semibold mb-0.5 tracking-wide">
                  {{ block.title }}
                </h4>
                <h5 v-if="block.subTitle" class="text-[10px] text-gray-500 mb-0.5">
                  {{ block.subTitle }}
                </h5>
                <p class="text-[10px] text-gray-600 leading-relaxed whitespace-pre-line">
                  {{ block.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
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