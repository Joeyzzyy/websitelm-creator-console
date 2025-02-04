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
    <div class="max-w-6xl mx-auto px-8">
      <h2
        v-if="section?.title"
        class="text-xl md:text-2xl font-bold text-gray-900 text-center mb-12"
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
              <div class="text-2xl md:text-3xl xl:text-4xl font-bold mb-3 text-blue-600">
                {{ item.percentage }}%
              </div>
              <p class="text-xs text-gray-600 max-w-[280px]">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="w-full md:w-1/2">
          <div class="relative w-full pt-[75%] rounded-lg overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm">
            <img 
              :src="section?.rightContent?.imageUrl"
              :alt="section?.rightContent?.imageAlt"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>