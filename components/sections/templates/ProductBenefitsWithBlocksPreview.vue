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
  <div class="w-full transition-all duration-200 bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <div
        v-for="(_, groupIndex) in Math.ceil(section.rightContent.length / 4)"
        :key="groupIndex"
        :class="[
          'flex flex-col md:flex-row gap-8 md:gap-12',
          {
            'mt-24': section.rightContent.length === 8 && groupIndex === 1,
            'my-24': groupIndex > 0 && groupIndex < Math.ceil(section.rightContent.length / 4) - 1
          }
        ]"
      >
        <div
          :class="[
            'w-full md:w-2/5',
            { 'md:order-last': groupIndex % 2 === 1 }
          ]"
        >
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ section.leftContent.title }}
          </h2>
          <p class="text-base text-gray-600 mb-6">
            {{ section.leftContent.description }}
          </p>
          <button 
            class="px-8 py-3 rounded-3xl text-lg font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
            @click="handleRedirect"
          >
            {{ section.leftContent.buttonText }}
          </button>
        </div>

        <div
          :class="[
            'w-full md:w-3/5',
            { 'md:order-first': groupIndex % 2 === 1 }
          ]"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="(module, index) in section.rightContent.slice(groupIndex * 4, groupIndex * 4 + 4)"
              :key="index"
              class="p-6 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md bg-white"
            >
              <div class="flex items-center mb-4">
                <span 
                  v-if="module.icon"
                  class="text-2xl mr-2"
                >
                  {{ module.icon }}
                </span>
              </div>
              <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {{ module.title }}
              </h3>
              <p class="text-base text-gray-600">
                {{ module.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>