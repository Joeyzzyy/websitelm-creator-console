<script setup>
const props = defineProps({
    section: {
      type: Object,
      required: true
    }
});
</script>

<template>
  <div class="w-[95%] mx-auto bg-[#f5f6f7] rounded-2xl py-6">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-base md:text-xl font-bold text-gray-900 mb-3">
          {{ props.section.topContent.title }}
        </h2>
        <p class="text-2xs md:text-xs text-gray-600 max-w-2xl mx-auto">
          {{ props.section.topContent.description }}
        </p>
      </div>

      <div class="flex justify-between items-center">
        <template v-for="(module, index) in props.section.bottomContent" :key="index">
          <div class="flex-1 text-center flex flex-col">
            <!-- 上层 - 标题 -->
            <div class="mb-3">
              <p class="text-gray-500 text-2xs md:text-xs">{{ module.topText }}</p>
            </div>
            
            <!-- 中层 - 主要内容 -->
            <div class="mb-3">
              <div class="text-sm md:text-base font-semibold">
                {{ module.middleText }}
              </div>
            </div>
            
            <!-- 下层 - 描述 -->
            <div>
              <p class="text-gray-500 text-2xs md:text-xs">{{ module.bottomText }}</p>
            </div>
          </div>
          <div 
            v-if="index < props.section.bottomContent.length - 1" 
            class="h-14 w-px bg-gray-900 mx-4"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>