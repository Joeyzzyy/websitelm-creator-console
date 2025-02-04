<template>
  <div class="bg-white">
    <div class="max-w-5xl mx-auto px-8 py-10">
      <div class="text-center mb-8">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          {{ section.topContent.title }}
        </h1>
        <p class="text-xs text-gray-600">
          {{ section.topContent.description }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm">
        <div class="space-y-4">
          <div 
            v-for="(job, index) in section.bottomContent" 
            :key="index"
            class="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-1 hover:text-[#3374FF]">
                  {{ job.position }}
                </h3>
                <div class="flex items-center gap-3 text-xs">
                  <p class="text-gray-600 flex items-center gap-1">{{ job.location }}</p>
                  <p class="text-gray-600 flex items-center gap-1">{{ job.type }}</p>
                  <p class="text-gray-600 flex items-center gap-1">{{ job.salary }}</p>
                </div>
              </div>
              <button 
                class="px-4 py-2 text-sm rounded-3xl font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5]"
                @click="job.buttonLink && window.open(job.buttonLink, '_blank')"
              >
                {{ job.buttonText }}
              </button>
            </div>

            <div class="mb-3">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(tag, idx) in job.tags" 
                  :key="idx"
                  class="px-2 py-0.5 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2">
                  Responsibilities
                </h4>
                <ul class="list-disc pl-4 space-y-1">
                  <li 
                    v-for="(item, idx) in Array.isArray(job.responsibilities) ? job.responsibilities : job.responsibilities?.split(',') || []" 
                    :key="idx"
                    class="text-xs text-gray-600"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2">
                  Requirements
                </h4>
                <ul class="list-disc pl-4 space-y-1">
                  <li 
                    v-for="(item, idx) in Array.isArray(job.requirements) ? job.requirements : job.requirements?.split(',') || []" 
                    :key="idx"
                    class="text-xs text-gray-600"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})
</script>