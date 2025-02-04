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
    <div class="max-w-4xl w-full">
      <div class="bg-gray-50 rounded-lg p-6 relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
            {{ section.title }}
          </h2>
          <div class="flex items-center space-x-2">
            <a-input 
              :placeholder="section.bottomContent.inputPlaceholder"
              class="flex-1 bg-white border-none text-sm h-[40px] px-4"
            />
            <button class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5]">
              {{ section.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>