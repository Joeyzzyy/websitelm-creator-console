<script setup>
import { ref } from 'vue'

// Props 定义
const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  styles: {
    type: Object,
    required: true
  }
})

const activeIndex = ref(0)

const handleCardClick = (index) => {
  activeIndex.value = index
}

// 添加前后滑动方法
const handlePrevious = () => {
  activeIndex.value = (activeIndex.value - 1 + props.section.bottomContent.length) % props.section.bottomContent.length
}

const handleNext = () => {
  activeIndex.value = (activeIndex.value + 1) % props.section.bottomContent.length
}
</script>

<template>
  <div class="w-[95%] mx-auto py-8">
    <!-- 调整标题和按钮区域 -->
    <div class="w-full mx-auto flex justify-between items-center mb-6">
      <h2 :class="`text-2xl font-bold ${styles.textColor}`">
        {{ section.title }}
      </h2>
      <div class="flex gap-2">
        <!-- 缩小按钮尺寸 -->
        <button
          @click="handlePrevious"
          :class="`flex items-center justify-between px-3 py-1 rounded-full border ${styles.borderColor} ${styles.textColor} hover:bg-gray-50 transition-colors w-32`"
        >
          <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span class="flex-1 text-center text-sm">Previous</span>
        </button>

        <button
          @click="handleNext"
          :class="`flex items-center justify-between px-3 py-1 rounded-full border ${styles.borderColor} ${styles.textColor} hover:bg-gray-50 transition-colors w-32`"
        >
          <span class="flex-1 text-center text-sm">Next</span>
          <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <div class="relative w-full mx-auto overflow-hidden">
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{
          transform: `translateX(-${activeIndex * 100}%)`
        }"
      >
        <div
          v-for="(review, index) in section.bottomContent"
          :key="index"
          class="flex-shrink-0 w-full px-2 transition-all duration-500"
        >
          <div
            :class="`transition-all duration-500 ${
              index === activeIndex
                ? 'opacity-100 scale-100'
                : index === activeIndex - 1 || index === activeIndex + 1
                ? 'opacity-50 scale-95'
                : 'opacity-0 scale-90'
            }`"
          >
            <!-- 缩小卡片尺寸 -->
            <div class="w-[400px] h-[200px] bg-white rounded-lg shadow-md flex overflow-hidden mx-auto">
              <!-- 左侧用户信息区域 -->
              <div class="w-1/3 relative">
                <div class="absolute inset-0">
                  <img
                    :src="review.avatarUrl"
                    :alt="review.avatarAlt"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                
                <div class="absolute bottom-0 left-0 p-3 w-full">
                  <h3 class="font-bold text-base text-white">{{ review.name }}</h3>
                  <p class="text-gray-200 text-xs">{{ review.position }}</p>
                </div>
              </div>

              <!-- 右侧评论内容 -->
              <div class="w-2/3 p-4 flex flex-col bg-[#f6f6f6]">
                <div class="flex justify-end items-center mb-3">
                  <div class="flex gap-0.5">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-3 h-3 text-[#2f3337]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <div class="mt-auto">
                  <h4 class="text-base font-semibold mb-2 text-gray-800">{{ review.title }}</h4>
                  <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{{ review.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>