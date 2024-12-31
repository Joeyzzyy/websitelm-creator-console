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
  <div class="py-12 md:py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        {{ section.title }}
      </h2>

      <div class="relative flex justify-center items-center min-h-[300px] overflow-hidden">
        <!-- 添加左右控制按钮 -->
        <button 
          @click="handlePrevCard" 
          class="absolute left-0 z-30 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          @click="handleNextCard" 
          class="absolute right-0 z-30 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <template v-for="(review, index) in section.bottomContent" :key="index">
          <div
            @click="handleCardClick(index)"
            :class="[
              'absolute bg-white p-6 rounded-lg shadow-md transition-all duration-700 ease-in-out cursor-pointer',
              'w-[400px] min-h-[180px]',
              {
                'z-20 scale-100 opacity-100 translate-x-0': index === activeIndex,
                'z-10 scale-90 opacity-60 -translate-x-[420px]': index === ((activeIndex - 1 + section.bottomContent.length) % section.bottomContent.length),
                'z-10 scale-90 opacity-60 translate-x-[420px]': index === ((activeIndex + 1) % section.bottomContent.length),
                'opacity-0': ![
                  activeIndex,
                  (activeIndex - 1 + section.bottomContent.length) % section.bottomContent.length,
                  (activeIndex + 1) % section.bottomContent.length
                ].includes(index)
              }
            ]"
          >
            <!-- 五角星评分 -->
            <div class="flex justify-end mb-4">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                fill="#3374FF"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <div class="flex items-center mb-4">
              <img
                :src="review.avatarUrl"
                :alt="review.avatarAlt"
                class="w-12 h-12 rounded-full object-contain p-1"
              />
              <div class="ml-4">
                <h3 class="text-gray-800 font-medium">{{ review.name }}</h3>
                <p class="text-gray-500 text-sm">{{ review.position }}</p>
              </div>
            </div>

            <h4 class="text-lg font-semibold text-gray-900 mb-2">
              {{ review.title }}
            </h4>
            <p class="text-base text-gray-700 whitespace-pre-line">
              {{ review.content }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>