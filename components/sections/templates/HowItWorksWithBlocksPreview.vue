<template>
  <div v-if="isValidSection" class="bg-[#e6eeff] py-8 md:py-12">
    <div class="w-[90%] mx-auto">
      <div class="flex flex-col md:flex-row gap-6 items-center">
        <!-- 左侧内容 -->
        <div class="w-full md:w-1/3">
          <h2 class="text-sm font-bold text-gray-900 mb-1">
            {{ section.leftContent.title }}
          </h2>
          <p class="text-[10px] text-gray-600 mb-4">
            {{ section.leftContent.subTitle }}
          </p>
          <a 
            href="#"
            class="inline-flex items-center px-4 py-2 text-[10px] bg-[#3374FF] text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
          >
            {{ section.leftContent.buttonText }}
          </a>
        </div>

        <!-- 右侧内容 -->
        <div class="w-full md:w-2/3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              v-for="(block, index) in section.rightContent" 
              :key="index"
              class="p-3 border-t-0 sm:border-t border-[#86909c]"
            >
              <div class="text-[10px] font-medium text-[#3374FF] mb-1">
                {{ `0${index + 1}` }}
              </div>
              <h3 class="text-[10px] font-semibold text-gray-900 mb-2">
                {{ block.contentTitle }}
              </h3>
              <p class="text-[10px] text-[#2f3337] leading-relaxed">
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