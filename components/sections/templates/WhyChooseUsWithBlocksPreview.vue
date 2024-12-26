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
  <div class="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12 md:mb-16">
        <span v-if="section.topContent.icon" class="text-4xl mr-2">{{ section.topContent.icon }}</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ section.topContent.title }}
        </h2>
        <p class="text-base text-gray-600 max-w-2xl mx-auto">
          {{ section.topContent.description }}
        </p>
      </div>

      <div 
        v-for="(content, index) in section.bottomContent" 
        :key="index"
        class="flex flex-col md:flex-row gap-8 md:gap-12 mb-12 last:mb-0"
      >
        <template v-if="index % 2 === 0">
          <div class="w-full md:w-1/2">
            <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              {{ content.title }}
            </h3>
            <p class="text-base text-gray-600 mb-6">
              {{ content.content }}
            </p>
            <button 
              @click="handleRedirect"
              class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
            >
              {{ content.buttonText }}
            </button>
          </div>
          <div class="w-full md:w-1/2">
            <img 
              :src="content.imageUrl || '/images/placeholder.png'"
              :alt="content.imageAlt"
              class="w-full h-full object-cover rounded-lg border border-gray-100 max-h-[300px]"
            />
          </div>
        </template>
        <template v-else>
          <div class="w-full md:w-1/2">
            <img 
              :src="content.imageUrl || '/images/placeholder.png'"
              :alt="content.imageAlt"
              class="w-full h-full object-cover rounded-lg border border-gray-100 max-h-[300px]"
            />
          </div>
          <div class="w-full md:w-1/2">
            <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              {{ content.title }}
            </h3>
            <p class="text-base text-gray-600 mb-6">
              {{ content.content }}
            </p>
            <button 
              @click="handleRedirect"
              class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
            >
              {{ content.buttonText }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>