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
  <div class="w-full transition-all duration-200 bg-white py-10 px-8">
    <div class="max-w-6xl mx-auto">
      <div
        v-for="(_, groupIndex) in Math.ceil(section.rightContent.length / 4)"
        :key="groupIndex"
        :class="[
          'flex flex-col md:flex-row gap-6',
          {
            'mt-16': section.rightContent.length === 8 && groupIndex === 1,
            'my-16': groupIndex > 0 && groupIndex < Math.ceil(section.rightContent.length / 4) - 1
          }
        ]"
      >
        <div
          :class="[
            'w-full md:w-2/5',
            { 'md:order-last': groupIndex % 2 === 1 }
          ]"
        >
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            {{ section.leftContent.title }}
          </h2>
          <p class="text-xs text-gray-600 mb-4 whitespace-pre-line">
            {{ section.leftContent.description }}
          </p>
          <button 
            class="px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
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
              class="p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-sm bg-white"
            >
              <div class="flex items-center mb-3">
                <span 
                  v-if="module.icon"
                  class="text-xl mr-2"
                >
                  {{ module.icon }}
                </span>
              </div>
              <h3 class="text-base font-semibold text-gray-900 mb-2">
                {{ module.title }}
              </h3>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">
                {{ module.subTitle }}
              </h4>
              <p class="text-xs text-gray-600 whitespace-pre-line">
                {{ module.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>