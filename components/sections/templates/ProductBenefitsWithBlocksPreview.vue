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
  <div class="w-full transition-all duration-200 bg-white py-12 px-4">
    <div class="w-[95%] mx-auto">
      <!-- 标题部分居中显示 -->
      <div class="text-center mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          {{ section.leftContent.title }}
        </h2>
        <p class="text-sm text-gray-600 mb-6 whitespace-pre-line max-w-3xl mx-auto">
          {{ section.leftContent.description }}
        </p>
      </div>

      <!-- 四个模块的网格布局 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="(module, index) in section.rightContent"
          :key="index"
          class="p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-sm bg-white"
        >
          <div v-if="module.icon" class="text-base mb-2">
            {{ module.icon }}
          </div>
          <h3 class="text-sm font-semibold text-gray-900 mb-1.5">
            {{ module.title }}
          </h3>
          <h4 class="text-xs font-semibold text-gray-700 mb-1.5">
            {{ module.subTitle }}
          </h4>
          <p class="text-[10px] leading-normal text-gray-600 whitespace-pre-line">
            {{ module.content }}
          </p>
        </div>
      </div>

      <!-- 底部按钮居中显示 -->
      <div class="text-center mt-12">
        <button 
          class="px-6 py-2 rounded-3xl text-xs font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861db]"
          @click="handleRedirect"
        >
          {{ section.leftContent.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>