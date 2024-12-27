<template>
  <div :class="[theme === 'tech' ? 'bg-gray-900' : 'bg-white', 'py-12 md:py-16']">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col md:flex-row gap-8 md:gap-12">
        <!-- 左侧内容 -->
        <div class="w-full md:w-1/2">
          <div class="grid border border-gray-200 rounded-lg px-4">
            <div
              v-for="(item, index) in section.leftContent"
              :key="index"
              :class="[
                'flex items-center gap-4 p-4 border-b last:border-b-0',
                theme === 'tech'
                  ? 'bg-gray-800 hover:bg-gray-700/80 transition-colors'
                  : 'bg-white hover:bg-gray-50/80 transition-colors'
              ]"
            >
              <div 
                :class="[
                  'w-16 py-2 flex-shrink-0 text-center border-r',
                  theme === 'tech' ? 'text-blue-400 border-gray-700' : 'text-blue-600 border-gray-200'
                ]"
              >
                {{ item.icon }}
              </div>
              <div class="flex-1 pl-4">
                <h3 
                  :class="[
                    'text-xl font-bold',
                    theme === 'tech' ? 'text-white' : 'text-gray-900'
                  ]"
                >
                  {{ item.contentTitle }}
                </h3>
                <p :class="[theme === 'tech' ? 'text-gray-300' : 'text-gray-600', 'text-base']">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="w-full md:w-1/2">
          <div :class="[theme === 'tech' ? 'text-blue-400' : 'text-blue-600', 'text-3xl mb-4']">
            {{ section.rightContent.icon }}
          </div>
          <h2 
            :class="[
              'text-2xl font-bold mb-2',
              theme === 'tech' ? 'text-white' : 'text-gray-900'
            ]"
          >
            {{ section.rightContent.title }}
          </h2>
          <p :class="[theme === 'tech' ? 'text-gray-300' : 'text-gray-600', 'mb-6']">
            {{ section.rightContent.subTitle }}
          </p>
          <a
            :href="formatUrl(section.rightContent.buttonLink)"
            :class="[
              'inline-block px-4 py-2 rounded-md',
              theme === 'tech'
                ? 'bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
                : 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
            ]"
          >
            {{ section.rightContent.buttonText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductBenefitsWithTablePreview',
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatUrl(url) {
      if (!url) return '#';
      return url.startsWith('http') ? url : `https://${url}`;
    }
  }
}
</script>