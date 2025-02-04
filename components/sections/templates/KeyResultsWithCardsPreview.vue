<template>
  <div class="w-full bg-white">
    <div class="max-w-6xl mx-auto px-8">
      <h2
        v-if="section.title"
        class="text-xl md:text-2xl font-bold text-gray-900 text-center mb-12"
      >
        {{ section.title }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(comparison, index) in section.bottomContent"
          :key="index"
          class="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm flex flex-col h-full"
        >
          <div class="mb-3 text-left h-20">
            <img
              v-if="comparison.competitorLogo"
              :src="comparison.competitorLogo"
              :alt="comparison.competitorLogoAlt || ''"
              class="h-6 w-auto mb-2 mr-auto"
            />
            <h4
              v-if="comparison.competitorName"
              class="text-base font-bold text-gray-900 mb-2 line-clamp-2"
            >
              {{ comparison.competitorName }}
            </h4>
          </div>

          <div class="mb-3">
            <div class="text-xl md:text-2xl font-bold text-blue-600 mb-2">
              {{ comparison.percentage }}%
            </div>
            <div class="text-sm text-gray-900 mb-2">
              {{ comparison.metric }}
            </div>
            <p class="text-xs text-gray-600">
              {{ comparison.description }}
            </p>
          </div>

          <button class="mt-auto flex items-center text-xs text-blue-600 font-medium">
            {{ comparison.buttonText }}
            <svg class="w-2.5 h-2.5 ml-1 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
  name: 'KeyResultsWithCardsPreview',
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>