<template>
  <div class="relative z-10 flex items-center w-full transition-all duration-200 bg-[#E6EEFF] py-12 md:py-16">
    <header class="w-full">
      <div class="w-[85%] mx-auto">
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div class="w-full md:w-3/5">
            <div class="max-w-[95%]">
              <!-- 面包屑导航 -->
              <div class="mb-6" v-if="section.leftContent.breadcrumbs?.length">
                <nav class="flex" aria-label="Breadcrumb">
                  <ol class="flex items-center space-x-2">
                    <template v-for="(crumb, index) in section.leftContent.breadcrumbs" :key="index">
                      <li>
                        <a 
                          :href="crumb.link" 
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-xs text-gray-400 hover:text-blue-600"
                        >
                          {{ crumb.text }}
                        </a>
                      </li>
                      <!-- 添加分隔符,最后一个不加 -->
                      <span v-if="index < section.leftContent.breadcrumbs.length - 1" 
                            class="text-xs text-gray-400">&gt;</span>
                    </template>
                  </ol>
                </nav>
              </div>

              <h1 
                v-if="section.title" 
                class="text-lg md:text-xl font-bold text-gray-900 mb-4"
              >
                {{ section.title }}
              </h1>
              
              <h2 
                v-if="section.subTitle" 
                class="text-base md:text-lg font-semibold text-gray-900 mb-16"
              >
                {{ section.subTitle }}
              </h2>
              
              <!-- 更新作者和日期布局 -->
              <div class="flex items-center">
                <div v-if="section.leftContent.author">
                  <span class="text-[10px] text-gray-600 block mb-1 font-medium">
                    Written By
                  </span>
                  <span class="text-[10px] text-gray-600">
                    {{ section.leftContent.author }}
                  </span>
                </div>
                
                <span v-if="section.leftContent.author && section.leftContent.publishDate" 
                      class="mx-4 text-gray-300 h-6 w-[1px] bg-gray-300">
                </span>
                
                <div v-if="section.leftContent.publishDate">
                  <span class="text-[10px] text-gray-600 block mb-1 font-medium">
                    Published On
                  </span>
                  <span class="text-[10px] text-gray-600">
                    {{ section.leftContent.publishDate }}
                  </span>
                </div>

                <span class="mx-4 text-gray-300 h-6 w-[1px] bg-gray-300"></span>
                
                <div>
                  <span class="text-[10px] text-gray-600 block mb-1 font-medium">
                    Time to read
                  </span>
                  <span class="text-[10px] text-gray-600">4 mins</span>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-2/5">
            <div class="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-white">
              <img 
                v-if="section.rightContent.imageUrl"
                :src="section.rightContent.imageUrl"
                :alt="section.rightContent.imageAlt"
                class="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'TitleSectionWithImagePreview',
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>