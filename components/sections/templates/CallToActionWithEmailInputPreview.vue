<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white py-12 md:py-16 flex items-center justify-center px-4">
    <div class="max-w-4xl w-full space-y-6">
      <div class="bg-gray-50 rounded-2xl p-8 relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            {{ section.title }}
          </h2>
          <div class="flex items-center space-x-2">
            <a-input 
              :placeholder="section.bottomContent.inputPlaceholder"
              class="flex-1 bg-white border-none text-sm h-[52px] px-6"
            />
            <button class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5] hover:scale-105">
              {{ section.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>