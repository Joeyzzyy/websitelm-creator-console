<template>
    <div class="subscription-preview">
      <div class="text-center max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">
          {{ section.title }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ section.subTitle }}
        </p>
  
        <!-- 添加计费周期切换 -->
        <div class="mt-6 flex justify-center">
          <div class="relative bg-gray-100 p-0.5 rounded-full flex">
            <button 
              v-for="period in billingPeriods" 
              :key="period.id"
              @click="selectedPeriod = period.id"
              :class="[
                'relative py-1 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                selectedPeriod === period.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
  
        <!-- 订阅卡片列表 -->
        <div class="mt-6 grid gap-4 lg:grid-cols-3">
          <div 
            v-for="plan in section.bottomContent.plans" 
            :key="plan.name"
            class="relative flex flex-col rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-all text-center"
            :class="{ 
              'border-[#4B89FF] ring-2 ring-[#4B89FF]/10 scale-[1.02]': plan.popular,
              'border-gray-200': !plan.popular
            }"
          >
            <!-- Popular 标识 -->
            <div v-if="plan.popular" class="absolute -top-2 left-1/2 -translate-x-1/2">
              <div class="bg-gradient-to-r from-[#4B89FF] to-[#6C9AFF] text-white px-1.5 py-0.5 rounded-full text-[9px] font-medium whitespace-nowrap shadow-sm">
                MOST POPULAR ✨
              </div>
            </div>
  
            <!-- 价格显示 -->
            <div class="mt-2 flex items-baseline justify-center">
              <span class="text-2xl font-bold tracking-tight text-gray-900">
                {{ plan.price[selectedPeriod] ? `$${plan.price[selectedPeriod]}` : 'Custom' }}
              </span>
              <span v-if="plan.price[selectedPeriod]" class="text-sm text-gray-500 ml-1">/mo</span>
              <span 
                v-if="selectedPeriod === 'yearly' && plan.discount && plan.price[selectedPeriod]" 
                class="ml-2 text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded"
              >
                Save {{ plan.discount }}
              </span>
            </div>
            
            <p v-if="plan.price[selectedPeriod]" class="mt-1 text-xs text-gray-500">
              {{ selectedPeriod === 'yearly' ? 'billed annually' : 'billed monthly' }}
            </p>
  
            <p class="mt-3 text-xs text-gray-600">{{ plan.description }}</p>
  
            <button 
              class="mt-4 w-full py-1.5 px-3 rounded-lg text-white text-xs font-medium bg-[#4B89FF] hover:bg-[#3A78FF] transition-colors"
            >
              {{ plan.buttonText }}
            </button>
  
            <!-- 功能列表 -->
            <div class="mt-4 space-y-3">
              <template v-for="(section, index) in plan.features" :key="index">
                <h4 class="text-[10px] font-semibold text-[#4B89FF] uppercase tracking-wide text-center">
                  {{ section.title }}
                </h4>
                <ul class="mt-2 space-y-2">
                  <li 
                    v-for="feature in section.items" 
                    :key="feature"
                    class="flex items-center justify-center gap-2 text-center"
                  >
                    <i class="fas fa-check-circle text-[#4B89FF] text-xs flex-shrink-0"></i>
                    <span class="text-xs text-gray-700 leading-relaxed text-center">{{ feature }}</span>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'

  export default {
    name: 'SubscriptionCardPreview',
    props: {
      section: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        selectedPeriod: 'yearly',
        billingPeriods: [
          { id: 'yearly', label: computed(() => `Annual · Save ${this.section.bottomContent.yearlyDiscount}`) },
          { id: 'monthly', label: 'Monthly' }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .subscription-preview {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  </style>