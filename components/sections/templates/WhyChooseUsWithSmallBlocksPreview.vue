<script setup>
const props = defineProps({
    section: {
      type: Object,
      required: true
    }
});

const { topContent, bottomContent } = props.section;
const { icon, title, description } = topContent;
</script>

<template>
  <div class="w-full bg-white py-16 md:py-24">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12">
        <div v-if="icon" class="text-4xl mb-4">{{ icon }}</div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ title }}
        </h2>
        <p class="text-base text-gray-600 max-w-2xl mx-auto">
          {{ description }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(module, index) in bottomContent"
          :key="index"
          class="rounded-lg transition-all duration-200 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm p-8 group flex flex-col items-center text-center"
        >
          <div class="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
            {{ module.icon }}
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
</template>