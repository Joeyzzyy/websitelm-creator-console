<script setup>
import { ref } from 'vue'

// Props 定义
const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const activeIndex = ref(1)

const handleCardClick = (index) => {
  activeIndex.value = index
}

// 添加前后滑动方法
const handlePrevCard = () => {
  activeIndex.value = (activeIndex.value - 1 + props.section.bottomContent.length) % props.section.bottomContent.length
}

const handleNextCard = () => {
  activeIndex.value = (activeIndex.value + 1) % props.section.bottomContent.length
}
</script>

<template>
  <div class="py-10 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6">
        {{ section.title }}
      </h2>

      <div class="relative flex justify-center items-center min-h-[240px] overflow-hidden">
        <!-- 左右控制按钮 -->
        <button 
          @click="handlePrevCard" 
          class="absolute left-0 z-30 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          @click="handleNextCard" 
          class="absolute right-0 z-30 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <template v-for="(review, index) in section.bottomContent" :key="index">
          <div
            @click="handleCardClick(index)"
            :class="[
              'absolute bg-white p-4 rounded-lg shadow-sm transition-all duration-700 ease-in-out cursor-pointer',
              'w-[320px] min-h-[160px]',
              {
                'z-20 scale-100 opacity-100 translate-x-0': index === activeIndex,
                'z-10 scale-90 opacity-60 -translate-x-[340px]': index === ((activeIndex - 1 + section.bottomContent.length) % section.bottomContent.length),
                'z-10 scale-90 opacity-60 translate-x-[340px]': index === ((activeIndex + 1) % section.bottomContent.length),
                'opacity-0': ![
                  activeIndex,
                  (activeIndex - 1 + section.bottomContent.length) % section.bottomContent.length,
                  (activeIndex + 1) % section.bottomContent.length
                ].includes(index)
              }
            ]"
          >
            <!-- 五角星评分 -->
            <div class="flex justify-end mb-3">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-4 h-4"
                fill="#3374FF"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <div class="flex items-center mb-3">
              <img
                :src="review.avatarUrl"
                :alt="review.avatarAlt"
                class="w-10 h-10 rounded-full object-contain p-1"
              />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-gray-800">{{ review.name }}</h3>
                <p class="text-xs text-gray-500">{{ review.position }}</p>
              </div>
            </div>

            <h4 class="text-base font-semibold text-gray-900 mb-2">
              {{ review.title }}
            </h4>
            <p class="text-xs text-gray-700 whitespace-pre-line">
              {{ review.content }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>