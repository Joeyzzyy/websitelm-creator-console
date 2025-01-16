<template>
  <div class="w-full bg-white py-12 md:py-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 v-if="section.title" class="text-3xl font-bold text-gray-900 mb-4">
          {{ section.title }}
        </h2>
        <p v-if="section.subTitle" class="text-lg text-gray-600">
          {{ section.subTitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a v-for="(insight, index) in insights" 
           :key="index" 
           :href="insight.targetUrl"
           target="_blank"
           rel="noopener noreferrer"
           class="group flex flex-col bg-white rounded-lg border border-gray-200 hover:border-[#3374FF]/20 hover:shadow-lg transition-all duration-200 h-[280px]">
          <div class="relative w-full h-36">
            <img :src="insight.imageUrl"
                 :alt="insight.imageAlt"
                 class="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
          </div>
          
          <div class="flex flex-col flex-grow p-5">
            <div class="mb-2">
              <span class="inline-block px-3 py-1 text-xs font-medium text-[#3374FF] bg-[#3374FF]/10 rounded-full">
                {{ insight.tag }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-[#3374FF] transition-colors duration-200 line-clamp-2">
              {{ insight.title }}
            </h3>
          </div>
        </a>
      </div>
    </div>
  </div>

  <!-- 添加图片库模态框 -->
  <a-modal
    v-model:visible="imageLibraryVisible"
    title="Select Image"
    @ok="handleImageSelect"
    @cancel="closeImageLibrary"
    width="800px"
  >
    <image-library
      v-if="imageLibraryVisible"
      @select="onImageSelect"
      @close="closeImageLibrary"
    />
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import ImageLibrary from '../common/ImageLibrary.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const imageLibraryVisible = ref(false)
const selectedImage = ref(null)
const currentEditingIndex = ref(null)

const insights = computed(() => {
  return props.section.bottomContent
})

const closeImageLibrary = () => {
  imageLibraryVisible.value = false
  selectedImage.value = null
  currentEditingIndex.value = null
}

const onImageSelect = (image) => {
  selectedImage.value = image
}

const handleImageSelect = () => {
  if (selectedImage.value && currentEditingIndex.value !== null) {
    // 更新对应索引的图片URL
    insights.value[currentEditingIndex.value].imageUrl = selectedImage.value.url
  }
  closeImageLibrary()
}
</script>

<style scoped>
.image-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.change-image-btn {
  flex-shrink: 0;
}
</style>
