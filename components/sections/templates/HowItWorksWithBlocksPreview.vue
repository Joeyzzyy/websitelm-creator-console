<template>
  <div v-if="isValidSection" class="bg-white p-12 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col md:flex-row gap-8 md:gap-12">
        <!-- 左侧内容 -->
        <div class="w-full md:w-1/3">
          <div class="text-4xl mb-4">{{ section.leftContent.icon }}</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ section.leftContent.title }}
          </h2>
          <p class="text-base text-gray-600 mb-6">
            {{ section.leftContent.subTitle }}
          </p>
          <a 
            href="#"
            class="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-3xl transition-all duration-200 border-2 border-[#3374FF] text-[#3374FF] hover:bg-[#3374FF] hover:text-white"
          >
            {{ section.leftContent.buttonText }}
          </a>
        </div>

        <!-- 右侧内容 -->
        <div class="w-full md:w-2/3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div 
              v-for="(block, index) in section.rightContent" 
              :key="index"
              class="bg-white rounded-lg shadow-sm p-6"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="text-2xl">{{ block.icon }}</div>
                <div class="text-lg font-semibold text-[#3374FF]">
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ block.contentTitle }}
              </h3>
              <p class="text-base text-gray-600">
                {{ block.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowItWorksWithBlocksPreview',
  
  props: {
    section: {
      type: Object,
      required: true,
      default: () => ({
        leftContent: {
          icon: '',
          title: '',
          subTitle: '',
          buttonText: ''
        },
        rightContent: []
      })
    }
  },

  computed: {
    isValidSection() {
      return this.section && 
             this.section.leftContent && 
             this.section.rightContent &&
             Array.isArray(this.section.rightContent);
    }
  }
}
</script>