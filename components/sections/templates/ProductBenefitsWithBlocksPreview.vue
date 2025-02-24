<script setup>
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

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
  <div class="w-full transition-all duration-200 bg-white py-12 px-4">
    <div class="w-[95%] mx-auto">
      <!-- 标题部分居中显示 -->
      <div class="text-center mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {{ section.leftContent.title }}
        </h2>
        <p class="text-sm text-gray-600 mb-4 whitespace-pre-line max-w-3xl mx-auto">
          {{ section.leftContent.description }}
        </p>
        <button 
          class="px-6 py-2 rounded-3xl text-xs font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861db]"
          @click="handleRedirect"
        >
          {{ section.leftContent.buttonText }}
        </button>
      </div>

      <!-- 四个模块的网格布局 -->
      <div class="grid gap-4 max-w-screen-lg mx-auto"
        :class="{
          'grid-cols-1 sm:grid-cols-1': section.rightContent.length === 1,
          'grid-cols-1 sm:grid-cols-2': section.rightContent.length === 2,
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': section.rightContent.length === 3,
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': section.rightContent.length === 4
        }"
      >
        <div
          v-for="(module, index) in section.rightContent"
          :key="index"
          class="p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-sm bg-white"
        >
          <div v-if="module.icon" class="w-4 h-4 flex items-center justify-center rounded-lg bg-gray-100 mb-2">
            <Icon 
              :icon="module.icon"
              class="text-gray-600"
              width="12"
              height="12"
            />
          </div>
          <h3 class="text-sm font-semibold text-gray-900 mb-1.5">
            {{ module.title }}
          </h3>
          <p class="text-[10px] leading-normal text-gray-600 whitespace-pre-line">
            {{ module.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>