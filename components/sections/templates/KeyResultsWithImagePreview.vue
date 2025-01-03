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
    <div class="max-w-6xl mx-auto px-4 md:px-6">
      <h2
        v-if="section?.title"
        class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16"
      >
        {{ section.title }}
      </h2>
      
      <div class="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
        <div class="w-full md:w-1/2">
          <div class="grid grid-cols-2 gap-8 md:gap-10">
            <div
              v-for="(item, index) in section?.leftContent || []"
              :key="index"
              class="flex flex-col"
            >
              <div class="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 text-blue-600">
                {{ item.percentage }}%
              </div>
              <p class="text-base text-gray-600 max-w-[280px]">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="w-full md:w-1/2">
          <img 
            :src="section?.rightContent?.imageUrl"
            :alt="section?.rightContent?.imageAlt"
            class="w-full h-auto object-contain max-w-[500px] mx-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>