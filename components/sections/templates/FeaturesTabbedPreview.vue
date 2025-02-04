<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
});

const activeTab = ref('');

// 监听 section 变化，确保 activeTab 始终有效
watch(() => props.section?.bottomContent, (newContent) => {
  if (newContent?.length && (!activeTab.value || !newContent.find(tab => tab.tabName === activeTab.value))) {
    activeTab.value = newContent[0].tabName;
  }
}, { immediate: true });

const activeContent = computed(() => 
  props.section?.bottomContent?.find(tab => tab.tabName === activeTab.value)
);
</script>

<template>
  <section class="w-full transition-all duration-200 py-10 px-8">
    <!-- 标题部分 -->
    <header class="text-center mb-6">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
        {{ section.title }}
      </h2>
      <p class="text-xs text-gray-600 max-w-xl mx-auto">
        {{ section.description }}
      </p>
    </header>

    <!-- 导航标签 -->
    <div class="border-b border-gray-200 mb-6">
      <div class="flex -mb-px justify-center">
        <button
          v-for="(tab, index) in section.bottomContent"
          :key="`${tab.tabName}-${index}`"
          @click="activeTab = tab.tabName"
          :class="[
            'px-4 py-2 border-b-2 transition-colors duration-200 text-sm',
            activeTab === tab.tabName
              ? 'border-[#3374FF] text-[#3374FF] font-medium'
              : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.tabName }}
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-6">
      <div class="w-full md:w-1/3 space-y-3">
        <h3 class="text-base font-semibold text-gray-900">
          {{ activeContent?.title }}
        </h3>
        <p class="text-xs text-gray-600 whitespace-pre-line">
          {{ activeContent?.description }}
        </p>
        <button 
          class="px-4 py-2 text-sm rounded-3xl font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5]"
        >
          {{ activeContent.buttonText }}
        </button>
      </div>
      <div class="w-full md:w-1/3">
        <div class="rounded-lg transition-all duration-200 bg-white shadow-sm">
          <img 
            :src="activeContent?.imageUrl" 
            :alt="activeContent?.imageAlt"
            class="w-full h-auto max-w-sm mx-auto object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>

