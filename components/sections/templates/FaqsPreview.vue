<template>
  <div class="bg-white py-10 px-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 左侧标题区域 -->
        <div class="w-full md:w-1/3">
          <div class="inline-block px-2 py-0.5 text-xs font-medium text-[#3374FF] bg-blue-50 rounded-full mb-3">
            FAQ
          </div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">
            FAQ
          </h2>
        </div>

        <!-- 右侧FAQ列表 -->
        <div class="w-full md:w-2/3">
          <div v-for="(faq, index) in section.bottomContent" 
               :key="index" 
               class="border-b border-gray-100">
            <button
              class="w-full py-3 flex justify-between items-center text-left"
              @click="toggleFAQ(index)"
            >
              <h3 class="text-base font-semibold text-gray-900 pr-4">
                {{ faq.question }}
              </h3>
              <svg
                class="w-4 h-4 text-[#3374FF] transition-transform duration-200 flex-shrink-0"
                :class="{ 'rotate-180': openIndex === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="overflow-y-auto transition-all duration-200"
                 :class="{ 'max-h-[400px] pb-3': openIndex === index, 'max-h-0': openIndex !== index }">
              <div class="text-xs text-gray-600 whitespace-pre-line">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
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

const openIndex = ref(null)

const toggleFAQ = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>