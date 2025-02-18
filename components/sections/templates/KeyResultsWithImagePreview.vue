<script setup>
defineProps({
  section: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="bg-white py-20">
    <div class="max-w-6xl mx-auto px-8 w-[85%]">
      <div class="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
        <!-- 左侧内容 -->
        <div class="w-full md:w-1/2">
          <h2 v-if="section?.title" class="text-sm font-bold text-gray-900 mb-1">
            {{ section.title }}
          </h2>
          <p v-if="section?.subTitle" class="text-xs text-gray-600 mb-8">
            {{ section.subTitle }}
          </p>
          
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, index) in section?.leftContent || []"
              :key="index"
              class="px-4 py-3 border border-gray-200 rounded-lg"
            >
              <div class="text-sm font-bold mb-1" style="color: #3374ff">
                {{ item.percentage }}%
              </div>
              <p class="text-[10px] text-gray-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- 右侧图片 -->
        <div class="w-full md:w-1/2">
          <div class="relative w-full pt-[85%] rounded-lg overflow-hidden bg-white border border-gray-100">
            <img 
              :src="section?.rightContent?.imageUrl"
              :alt="section?.rightContent?.imageAlt"
              class="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>