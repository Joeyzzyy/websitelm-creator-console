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
  <div class="py-12 md:py-16 px-4">
    <div class="max-w-[95%] mx-auto">
      <div class="text-center mb-10 md:mb-14">
        <h2 class="text-base md:text-xl font-bold text-gray-900 mb-3">
          {{ section.topContent.title }}
        </h2>
        <p class="text-2xs md:text-xs text-gray-600 max-w-2xl mx-auto">
          {{ section.topContent.description }}
        </p>
      </div>

      <div 
        v-for="(content, index) in section.bottomContent" 
        :key="index"
        class="flex flex-col md:flex-row gap-6 md:gap-10 mb-10 last:mb-0 items-center"
      >
        <template v-if="index % 2 === 0">
          <div class="w-full md:w-2/5 flex flex-col h-full justify-between md:pl-10">
            <div>
              <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-3">
                {{ content.title }}
              </h3>
              <p class="text-2xs md:text-xs text-gray-600 whitespace-pre-line">
                {{ content.content }}
              </p>
            </div>
            <button 
              @click="handleRedirect"
              class="inline-flex items-center px-4 py-2 mt-12 text-[10px] bg-[#3374FF] text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 w-fit"
            >
              {{ content.buttonText }}
            </button>
          </div>
          <div class="w-full md:w-3/5">
            <img 
              :src="content.imageUrl || '/images/placeholder.png'"
              :alt="content.imageAlt || content.title"
              class="w-full h-auto object-contain rounded-lg border border-gray-100"
            />
          </div>
        </template>
        <template v-else>
          <div class="w-full md:w-3/5">
            <img 
              :src="content.imageUrl || '/images/placeholder.png'"
              :alt="content.imageAlt || content.title"
              class="w-full h-auto object-contain rounded-lg border border-gray-100"
            />
          </div>
          <div class="w-full md:w-2/5 flex flex-col h-full justify-between md:pr-10">
            <div>
              <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-3">
                {{ content.title }}
              </h3>
              <p class="text-2xs md:text-xs text-gray-600 whitespace-pre-line">
                {{ content.content }}
              </p>
            </div>
            <button 
              @click="handleRedirect"
              class="inline-flex items-center px-4 py-2 mt-12 text-[10px] bg-[#3374FF] text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 w-fit"
            >
              {{ content.buttonText }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>