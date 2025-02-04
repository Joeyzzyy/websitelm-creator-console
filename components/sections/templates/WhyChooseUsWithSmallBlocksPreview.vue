<script setup>
const props = defineProps({
    section: {
      type: Object,
      required: true
    }
});
</script>

<template>
  <div class="w-full bg-white py-6">
    <div class="max-w-6xl mx-auto px-8">
      <div class="text-center mb-8">
        <div v-if="props.section.topContent.icon" class="text-2xl mb-3">
          {{ props.section.topContent.icon }}
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          {{ props.section.topContent.title }}
        </h2>
        <p class="text-xs text-gray-600 max-w-2xl mx-auto">
          {{ props.section.topContent.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(module, index) in props.section.bottomContent"
          :key="index"
          class="rounded-lg transition-all duration-200 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm p-4 group flex flex-col items-center text-center"
        >
          <div class="text-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
            {{ module.icon }}
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-2">
            {{ module.title }}
          </h3>
          <p class="text-xs text-gray-600 whitespace-pre-line">
            {{ module.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>