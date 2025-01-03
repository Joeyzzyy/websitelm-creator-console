<template>
  <div class="w-full bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <h2
        v-if="section.title"
        class="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16"
      >
        {{ section.title }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(comparison, index) in section.bottomContent"
          :key="index"
          class="bg-white rounded-lg p-8 shadow-lg flex flex-col h-full"
        >
          <div class="mb-6 text-left">
            <img
              v-if="comparison.competitorLogo"
              :src="comparison.competitorLogo"
              :alt="comparison.competitorLogoAlt || ''"
              class="h-12 w-auto mb-4 mr-auto"
            />
            <h4
              v-if="comparison.competitorName"
              class="text-xl font-bold text-gray-900 mb-2"
            >
              {{ comparison.competitorName }}
            </h4>
          </div>

          <div class="mb-6">
            <div class="text-4xl font-bold text-blue-600 mb-2">
              {{ comparison.percentage }}%
            </div>
            <div class="text-lg text-gray-900 mb-4">
              {{ comparison.metric }}
            </div>
            <p class="text-base text-gray-600">
              {{ comparison.description }}
            </p>
          </div>

          <button class="mt-auto flex items-center text-blue-600 font-medium">
            {{ comparison.buttonText }}
            <svg class="w-4 h-4 ml-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyResultsWithThreeCardsPreview',
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>