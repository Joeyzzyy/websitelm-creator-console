<template>
  <div class="bg-white min-h-screen">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ section.topContent.title }}
        </h1>
        <p class="text-lg text-gray-600 mb-2">
          {{ section.topContent.description }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm">
        <div class="space-y-6">
          <div 
            v-for="(job, index) in section.bottomContent" 
            :key="index"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-1 hover:text-[#3374FF]">
                  {{ job.position }}
                </h3>
                <div class="flex items-center gap-4 text-sm">
                  <p class="text-gray-600 flex items-center gap-1">{{ job.location }}</p>
                  <p class="text-gray-600 flex items-center gap-1">{{ job.type }}</p>
                  <p class="text-gray-600 flex items-center gap-1">{{ job.salary }}</p>
                </div>
              </div>
              <button 
                class="px-4 py-2 text-sm rounded-3xl font-semibold transition-all duration-200 bg-[#3374FF] text-white hover:bg-[#2861E5] hover:scale-105"
              >
                Apply Now
              </button>
            </div>

            <div class="mb-4">
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="(tag, idx) in job.tags" 
                  :key="idx"
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">
                  Responsibilities
                </h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li 
                    v-for="(item, idx) in Array.isArray(job.responsibilities) ? job.responsibilities : job.responsibilities?.split(',') || []" 
                    :key="idx"
                    class="text-gray-600"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">
                  Requirements
                </h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li 
                    v-for="(item, idx) in Array.isArray(job.requirements) ? job.requirements : job.requirements?.split(',') || []" 
                    :key="idx"
                    class="text-gray-600"
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