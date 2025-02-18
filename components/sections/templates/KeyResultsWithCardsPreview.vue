<template>
  <div class="w-full bg-white">
    <div class="max-w-6xl mx-auto px-8">
      <!-- Header section with title and subtitle -->
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-sm font-bold text-gray-900">
          {{ section.title }}
        </h2>
        <p class="text-[10px] text-[#2f3337]">{{ section.subTitle }}</p>
      </div>

      <!-- Cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200">
        <div
          v-for="(card, index) in section.bottomContent"
          :key="index"
          class="flex flex-col px-6"
          :class="{ 'pl-0': index === 0, 'pr-0': index === section.bottomContent.length - 1 }"
        >
          <!-- Card title -->
          <h4 class="text-[10px] font-semibold text-gray-900 mb-4">
            {{ card.competitorName }}
          </h4>

          <!-- Numbers and metrics -->
          <div class="mb-4">
            <div class="text-sm font-bold text-blue-600 mb-2">
              {{ card.percentage }}%
            </div>
            <div class="text-[10px] text-gray-700">
              {{ card.metric }}
            </div>
          </div>

          <!-- Description -->
          <p class="text-[10px] text-gray-600 mb-4 leading-relaxed">
            {{ card.description }}
          </p>

          <!-- Image -->
          <img
            v-if="card.competitorLogo"
            :src="card.competitorLogo"
            :alt="card.competitorLogoAlt || ''"
            class="w-full h-auto mt-auto mb-4"
          />

          <!-- Button -->
          <a
            v-if="card.buttonText && card.buttonLink"
            :href="card.buttonLink"
            class="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
          >
            {{ card.buttonText }}
          </a>
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
      required: true,
      validator: function(obj) {
        return obj.title !== undefined && 
               obj.subtitle !== undefined && 
               obj.bottomContent !== undefined
      }
    }
  }
}
</script>