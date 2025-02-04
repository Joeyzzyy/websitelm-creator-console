<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const handleRedirect = (e) => {
  e.preventDefault();
  router.push('https://app.websitelm.com');
};
</script>

<template>
  <div class="py-6 px-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <span v-if="section.topContent.icon" class="text-2xl mr-2">{{ section.topContent.icon }}</span>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          {{ section.topContent.title }}
        </h2>
        <p class="text-xs text-gray-600 max-w-2xl mx-auto">
          {{ section.topContent.description }}
        </p>
      </div>

      <div 
        v-for="(content, index) in section.bottomContent" 
        :key="index"
        class="flex flex-col md:flex-row gap-6 mb-6 last:mb-0"
      >
        <template v-if="index % 2 === 0">
          <div class="w-full md:w-1/2">
            <h3 class="text-base font-semibold text-gray-900 mb-3">
              {{ content.title }}
            </h3>
            <p class="text-xs text-gray-600 mb-4 whitespace-pre-line">
              {{ content.content }}
            </p>
            <button 
              @click="handleRedirect"
              class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
            >
              {{ content.buttonText }}
            </button>
          </div>
          <div class="w-full md:w-1/2">
            <img 
              :src="content.imageUrl || '/images/placeholder.png'"
              :alt="content.imageAlt"
              class="w-full h-full object-contain rounded-lg border border-gray-100 max-h-[200px]"
            />
          </div>
        </template>
        <template v-else>
          <div class="w-full md:w-1/2">
            <img 
              :src="content.imageUrl || '/images/placeholder.png'"
              :alt="content.imageAlt"
              class="w-full h-full object-contain rounded-lg border border-gray-100 max-h-[200px]"
            />
          </div>
          <div class="w-full md:w-1/2">
            <h3 class="text-base font-semibold text-gray-900 mb-3">
              {{ content.title }}
            </h3>
            <p class="text-xs text-gray-600 mb-4 whitespace-pre-line">
              {{ content.content }}
            </p>
            <button 
              @click="handleRedirect"
              class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
            >
              {{ content.buttonText }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>