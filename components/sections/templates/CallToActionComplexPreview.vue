<template>
  <div class="bg-white py-12 md:py-16">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {{ section.topContent.title }}
      </h2>
      
      <p class="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed max-w-2xl mx-auto">
        {{ section.topContent.description }}
      </p>
      
      <div class="mb-12">
        <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-8">
          {{ section.bottomContent.title }}
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            v-for="(item, index) in section.bottomContent.content"
            :key="index"
            class="text-left p-6 bg-gray-50 rounded-lg"
          >
            <h4 class="text-lg font-semibold mb-2 text-gray-900">{{ item.title }}</h4>
            <p class="text-base text-gray-600 whitespace-pre-line">{{ item.description }}</p>
          </div>
        </div>
        
        <p class="text-lg text-gray-700 mb-4">{{ section.bottomContent.callToActionEngagementTop }}</p>
        <p class="text-lg text-gray-700 mb-8">{{ section.bottomContent.callToActionEngagementBottom }}</p>
      </div>

      <div class="flex justify-center items-center space-x-6">
        <button 
          class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
          @click="handleRedirect"
        >
          {{ section.bottomContent.buttonText }}
        </button>
        <button 
          class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5] hover:scale-105"
          @click="handleRedirect"
        >
          {{ section.bottomContent.ctaButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const handleRedirect = () => {
  window.location.href = 'https://app.websitelm.com'
}
</script>