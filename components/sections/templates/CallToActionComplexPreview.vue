<template>
  <div class="bg-white py-10 px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
        {{ section.topContent.title }}
      </h2>
      
      <p class="text-base font-semibold text-gray-900 mb-4 leading-relaxed max-w-2xl mx-auto">
        {{ section.topContent.description }}
      </p>
      
      <div class="mb-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">
          {{ section.bottomContent.title }}
        </h3>
        
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div 
            v-for="(item, index) in section.bottomContent.content"
            :key="index"
            class="text-left p-4 bg-gray-50 rounded-lg"
          >
            <h4 class="text-sm font-semibold mb-2 text-gray-900">{{ item.title }}</h4>
            <p class="text-xs text-gray-600 whitespace-pre-line">{{ item.description }}</p>
          </div>
        </div>
        
        <p class="text-xs text-gray-700 mb-2">{{ section.bottomContent.callToActionEngagementTop }}</p>
        <p class="text-xs text-gray-700 mb-4">{{ section.bottomContent.callToActionEngagementBottom }}</p>
      </div>

      <div class="flex justify-center items-center space-x-4">
        <button 
          v-if="section.bottomContent.showButton"
          class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
          @click="handleRedirect"
        >
          {{ section.bottomContent.buttonText }}
        </button>
        <button 
          v-if="section.bottomContent.showCtaButton"
          class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5]"
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