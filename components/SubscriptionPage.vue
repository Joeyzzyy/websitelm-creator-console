<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="text-gray-800 hover:text-gray-600">
            <i class="fas fa-home text-xl"></i>
          </router-link>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ userEmail }}</span>
            <button 
              class="secret-portal-btn"
              @click="showSecretDialog = true"
            >
              <span style="font-size: 14px;">🔑</span>
            </button>
            <a-button type="link" @click="handleLogout">Logout</a-button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose the Perfect Plan for Your Growth
        </h1>
        <p class="mt-4 text-lg text-[#5C7299]">
          Select a plan that suits your needs. Start now with a 14-day cash-back guarantee.
        </p>

        <!-- Billing Toggle -->
        <div class="mt-12 flex justify-center">
          <div class="relative bg-gray-100 p-0.5 rounded-full flex">
            <button 
              v-for="period in billingPeriods" 
              :key="period.id"
              @click="selectedPeriod = period.id"
              :class="[
                'relative py-2 px-6 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedPeriod === period.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="mt-12 grid gap-8 lg:grid-cols-3">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="relative flex flex-col rounded-xl border-2 p-8 shadow-sm hover:shadow-md transition-all text-center"
            :class="{ 
              'border-[#4B89FF] ring-4 ring-[#4B89FF]/10 scale-[1.02]': plan.popular,
              'border-gray-200': !plan.popular
            }"
          >
            <!-- 新增Pro套餐标识 -->
            <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2">
              <div class="bg-gradient-to-r from-[#4B89FF] to-[#6C9AFF] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                MOST POPULAR ✨
              </div>
            </div>

            <!-- 价格显示优化 -->
            <div class="mt-4 flex items-baseline justify-center">
              <div class="flex items-baseline">
                <span class="text-4xl font-bold tracking-tight text-gray-900">
                  {{ plan.price[selectedPeriod] === 'Custom' ? 'Custom' : `$${plan.price[selectedPeriod]}` }}
                </span>
                <span 
                  v-if="plan.price[selectedPeriod] !== 'Custom'"
                  class="text-xl text-gray-500 ml-1"
                >
                  /mo
                </span>
                <span 
                  v-if="plan.discount && selectedPeriod === 'yearly'" 
                  class="ml-2 text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded"
                >
                  Save {{ plan.discount }}
                </span>
              </div>
            </div>
            
            <p class="mt-2 text-sm text-gray-500">
              <template v-if="plan.id !== 'enterprise'">
                {{ selectedPeriod === 'yearly' ? 'billed annually' : 'billed monthly' }}
              </template>
              <template v-else>
                Contact us for pricing details
              </template>
            </p>

            <p class="mt-6 text-[#5C7299]">{{ plan.description }}</p>

            <a-button 
              type="primary" 
              block 
              class="mt-8 custom-button"
              @click="handleSelectPlan(plan.id)"
            >
              {{ plan.buttonText }}
            </a-button>

            <!-- 功能列表样式优化 -->
            <div class="mt-8 space-y-6">
              <template v-for="(section, index) in plan.features" :key="index">
                <h4 class="text-sm font-semibold text-[#4B89FF] uppercase tracking-wide">
                  {{ section.title }}
                </h4>
                <ul class="mt-4 space-y-4">
                  <li 
                    v-for="feature in section.items" 
                    :key="feature"
                    class="flex items-start justify-center text-left"
                  >
                    <i class="fas fa-check-circle text-[#4B89FF] mt-1 mr-3"></i>
                    <span class="text-sm text-gray-700 leading-relaxed">{{ feature }}</span>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center" ref="comparisonSection">
        <a-button 
          class="compare-features-btn"
          @click="toggleComparison"
        >
          <template #icon>
            <i :class="['fas', showComparison ? 'fa-chevron-up' : 'fa-chevron-down', 'mr-2']"></i>
          </template>
          Compare All Features
        </a-button>

        <!-- Feature Comparison Table -->
        <div 
          class="comparison-table mt-8"
          :class="{ 'hidden': !showComparison }"
        >
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left py-6 px-8 bg-gray-50 w-1/3">Features</th>
                <th class="py-6 px-8 bg-gray-50">
                  <div class="text-lg font-semibold mb-1">Essential</div>
                  <div class="text-sm text-gray-500">Basic features</div>
                </th>
                <th class="py-6 px-8 bg-gray-50">
                  <div class="text-lg font-semibold mb-1">Professional</div>
                  <div class="text-sm text-gray-500">Most popular</div>
                  <div class="inline-block mt-2 text-xs text-[#4B89FF] bg-blue-50 px-3 py-1 rounded-full">
                    Recommended
                  </div>
                </th>
                <th class="py-6 px-8 bg-gray-50">
                  <div class="text-lg font-semibold mb-1">Enterprise</div>
                  <div class="text-sm text-gray-500">Custom solutions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(category, index) in featureComparison" :key="index">
                <!-- Category Header -->
                <tr>
                  <td 
                    colspan="4" 
                    class="text-left py-6 px-8 bg-[#F8FAFC] font-semibold text-gray-900 border-t border-b border-gray-100"
                  >
                    {{ category.category }}
                  </td>
                </tr>
                <!-- Features -->
                <tr 
                  v-for="feature in category.features" 
                  :key="feature.name"
                  class="border-b border-gray-100 feature-row"
                >
                  <td class="text-left py-4 px-8 text-gray-600">
                    {{ feature.name }}
                  </td>
                  <td class="py-4 px-8">
                    <feature-availability :value="feature.essential" />
                  </td>
                  <td class="py-4 px-8 bg-blue-50/10">
                    <feature-availability :value="feature.professional" />
                  </td>
                  <td class="py-4 px-8">
                    <feature-availability :value="feature.enterprise" />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-16 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              class="w-full px-8 py-5 flex justify-between items-center text-left"
              @click="toggleFaq(index)"
            >
              <span class="text-lg font-medium text-gray-900">{{ faq.question }}</span>
              <i 
                :class="[
                  'fas', 
                  activeFaq === index ? 'fa-chevron-up' : 'fa-chevron-down',
                  'text-gray-400 transition-transform duration-200'
                ]"
              ></i>
            </button>
            
            <div 
              v-show="activeFaq === index"
              class="px-8 pb-5 text-gray-600"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加弹窗组件 -->
    <a-modal
      v-model:visible="showSecretDialog"
      :footer="null"
      :closable="false"
      width="400px"
      class="secret-portal-modal"
      :maskClosable="true"
    >
      <div class="secret-portal">
        <div class="portal-header">
          <div class="portal-title">✨ Free Trial Access Code ⭐️</div>
        </div>
        
        <a-input
          v-model:value="secretCode"
          placeholder="Enter your access code"
          class="portal-input"
          :disabled="verifyingCode"
          @keyup.enter="verifySecretCode"
        />
        
        <div class="portal-button-container">
          <button 
            class="portal-verify-btn"
            :class="{ 'verifying': verifyingCode }"
            @click="verifySecretCode"
          >
            <span class="btn-text">{{ verifyingCode ? 'Checking...' : 'Start Free Trial 🚀' }}</span>
            <div class="btn-particles"></div>
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, defineComponent } from 'vue'
import { Button as AButton } from 'ant-design-vue'

const userEmail = ref('zhuyuejoey@gmail.com')
const selectedPeriod = ref('yearly')

// Billing period options
const billingPeriods = [
  { id: 'yearly', label: 'Annual · Save 20%' },
  { id: 'monthly', label: 'Monthly' }
]

// Pricing plans data
const plans = [
  {
    id: 'basic',
    name: 'Standard',
    price: {
      monthly: '45',
      yearly: '36'
    },
    discount: '20%',
    description: 'Everything you need to start optimizing your content',
    buttonText: 'Get Started',
    features: [
      {
        title: 'Features include:',
        items: [
          'AI keyword recommendation (50 times/month)',
          '30 indexing-ready page generation/month',
          '500 pages free deployment',
          'Unlimited GSC data tracking',
          '500 internal links storage',
          '500 images storage',
          '100 videos storage',
          '1 Free onboarding call'
        ]
      }
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    popular: true,
    price: {
      monthly: '129',
      yearly: '99'
    },
    discount: '23%',
    description: 'Perfect for marketing teams scaling content production',
    buttonText: 'Get Started',
    features: [
      {
        title: 'Everything in Essential, plus:',
        items: [
          'AI keyword recommendation (100 times/month)',
          '100 indexing-ready page generation/month',
          '1000 pages free deployment',
          'Unlimited GSC data tracking',
          '1500 internal links storage',
          '1500 images storage',
          '1000 videos storage',
        ]
      },
      {
        title: 'Pro features:',
        items: [
          'Unlimited onboarding calls',
          'Priority support'
        ]
      }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: {
      monthly: 'Custom',
      yearly: 'Custom'
    },
    description: 'Custom solutions with enhanced control, security, training and support',
    buttonText: 'Contact Sales',
    features: [
      {
        title: 'Everything in Professional, plus:',
        items: [
          'Unlimited AI keyword recommendation',
          'Unlimited internal links storage',
          'Unlimited storage',
          'Dedicated success manager',
          'Custom onboarding & training',
          'Enterprise-grade support'
        ]
      }
    ]
  }
]

// Methods
const handleSelectPlan = (planId: string) => {
  console.log('Selected plan:', planId)
}

const handleLogout = () => {
  console.log('User logout')
}

// 控制比较表格的显示
const showComparison = ref(false)

const comparisonSection = ref<HTMLElement | null>(null)

const toggleComparison = () => {
  showComparison.value = !showComparison.value
  
  if (showComparison.value) {
    // 等待 DOM 更新和动画完成后滚动
    setTimeout(() => {
      comparisonSection.value?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      })
    }, 100)
  }
}

// Feature availability component
const FeatureAvailability = defineComponent({
  props: {
    value: {
      type: [Boolean, String, Number],
      required: true
    }
  },
  setup(props) {
    const renderValue = () => {
      if (typeof props.value === 'boolean') {
        return props.value ? 
          h('div', { 
            class: 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50' 
          }, [
            h('i', { class: 'fas fa-check text-[#4B89FF]' })
          ]) :
          h('div', { 
            class: 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50' 
          }, [
            h('i', { class: 'fas fa-minus text-gray-300' })
          ])
      }
      return h('span', { 
        class: 'text-sm font-medium text-gray-900' 
      }, props.value)
    }

    return () => h('div', { class: 'flex justify-center' }, [renderValue()])
  }
})

// 功能对比数据
const featureComparison = [
  {
    category: 'Pricing',
    features: [
      {
        name: 'Monthly Pay Price',
        essential: '$29/month',
        professional: '$59/month',
        enterprise: 'Contact Us'
      },
      {
        name: 'Annual Pay Price',
        essential: '$19/month',
        professional: '$39/month',
        enterprise: 'Contact Us'
      }
    ]
  },
  {
    category: 'Keywords Analysis & Recommendation',
    features: [
      {
        name: 'AI keyword recommendation & recommendation',
        essential: '50 times/month',
        professional: '100 times/month',
        enterprise: 'Unlimited'
      }
    ]
  },
  {
    category: 'Assets',
    features: [
      {
        name: 'Internal link URLs Configuration & Smart Insertion',
        essential: '500 links',
        professional: '1500 links',
        enterprise: 'Unlimited'
      },
      {
        name: 'Image Storage',
        essential: '500 images',
        professional: '1500 links in total',
        enterprise: 'Unlimited'
      },
      {
        name: 'Video Storage',
        essential: '100 videos',
        professional: '1000 videos',
        enterprise: 'Unlimited'
      }
    ]
  },
  {
    category: 'Content Creation',
    features: [
      {
        name: 'Rank-ready blogs | landing page generation',
        essential: '300/month',
        professional: '300/month',
        enterprise: 'Contact Us'
      },
      {
        name: 'Number of Pages that can be deployed freely',
        essential: '500/year',
        professional: '1500/year',
        enterprise: 'Contact Us'
      }
    ]
  },
  {
    category: 'Tracking',
    features: [
      {
        name: 'Page Indexing Tracking',
        essential: 'Unlimited',
        professional: 'Unlimited',
        enterprise: 'Unlimited'
      },
      {
        name: 'Smart Page Generation and Publishing Suggestion',
        essential: 'Unlimited',
        professional: 'Unlimited',
        enterprise: 'Unlimited'
      }
    ]
  },
  {
    category: 'Support & Training',
    features: [
      {
        name: 'Free Onhand Tutorial Meeting',
        essential: '1 Free Onboarding Call',
        professional: 'Unlimited Onboarding Calls',
        enterprise: 'Unlimited Onboarding Calls'
      }
    ]
  }
]

// FAQ 相关
const activeFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const faqs = [
  {
    question: "What is WebsiteLM?",
    answer: "WebsiteLM is an AI-powered content generation and management platform designed to help users efficiently create SEO-friendly landing pages, blog posts, and help center content to improve website visibility and user traffic."
  },
  {
    question: "Who can benefit from WebsiteLM?",
    answer: "WebsiteLM is ideal for\n\nWebsite administrators\nSEO professionals\nContent creators\nMarketers\nAnyone looking to improve their website's SEO performance."
  },
  {
    question: "How does WebsiteLM improve SEO?",
    answer: "WebsiteLM uses advanced AI algorithms to analyze your website's content and optimize it according to the latest SEO best practices. It generates SEO-optimized text, improves content structure, and ensures alignment with search engine ranking factors."
  },
  {
    question: "What features does WebsiteLM offer?",
    answer: "WebsiteLM offers features like\n\nWebsite Analysis: Analyzes your website's SEO, structure, user experience, and more.\nKnowledge Base Construction: Builds an AI-powered knowledge base using Retrieval-Augmented Generation (RAG) technology.\nHelp Center Generation: Automatically generates help center content based on the knowledge base.\nKeyword and Page Planning: Analyzes keyword gaps between a user's website and competitors.\nContent Generation: Automatically creates SEO-optimized content based on the planned pages and content calendar.\nMulti-Language Support: Automatically translates website content into multiple languages and optimizes each language for SEO.\nSocial Media Integration: Integrates with social media platforms to share content and drive traffic.\nData Visualization: Provides data visualizations and detailed reports on SEO performance, traffic, user behavior, and other key metrics.\nSupport for Internal and External Link Integration: Supports internal and external link integration to enhance content discoverability and help you reach a broader audience.\nInternal and External Link Integration: Supports internal and external link integration to enhance content discoverability and help you reach a broader audience."
  },
  {
    question: "Can I customize the content generated by WebsiteLM?",
    answer: "Yes! WebsiteLM allows you to review, adjust, and fine-tune AI-generated content to match your specific needs and brand voice"
  },
  {
    question: "Does WebsiteLM provide support for multiple languages?",
    answer: "Yes, WebsiteLM has multi-language support. It can translate and optimize content for different languages, ensuring SEO performance across various regions."
  },
  {
    question: "How does WebsiteLM handle data security?",
    answer: "WebsiteLM prioritizes data security by encrypting user data during storage and transmission. It also offers access control mechanisms to ensure only authorized users can access sensitive information."
  },
  {
    question: "Will WebsiteLM automatically update my website content?",
    answer: "Yes, WebsiteLM can schedule and automatically update your website content based on a content calendar and ongoing SEO performance. Manual review and approval options are also available."
  },
  {
    question: "Is WebsiteLM suitable for beginners?",
    answer: "Absolutely! WebsiteLM is designed to be user-friendly with an intuitive interface, making it easy for beginners and experts alike to create, optimize, and manage website content."
  },
  {
    question: "What kind of performance reports does WebsiteLM provide?",
    answer: "WebsiteLM integrates with Google Search Console to provide precise insights into indexing, rankings, and traffic tracking. With detailed data visualizations and reports, you can monitor performance effectively and make informed, data-driven decisions to optimize your strategy."
  },
  {
    question: "How does WebsiteLM handle content maintenance?",
    answer: "WebsiteLM helps with ongoing content maintenance by scheduling regular content reviews to ensure all content remains accurate, up-to-date, and aligned with SEO goals."
  },
  {
    question: "Can I track how well my website content is performing after publishing?",
    answer: "Yes, WebsiteLM provides tools to monitor SEO performance, track traffic, and analyze user behavior, allowing you to make continuous improvements to your content."
  },
  {
    question: "Will WebsiteLM continue to evolve and add new features?",
    answer: "Yes, WebsiteLM is continuously improving its AI models, expanding functionality, and evolving into a platform that supports third-party developers to create plugins and applications for additional use cases."
  }
]

// 添加新的响应式变量
const showSecretDialog = ref(false)
const secretCode = ref('')
const verifyingCode = ref(false)

// 验证方法
const verifySecretCode = async () => {
  if (!secretCode.value) return
  
  verifyingCode.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const code = secretCode.value.toUpperCase()
    if (['ESSENTIAL2024', 'PRO2024', 'ENT2024'].includes(code)) {
      // 添加成功动画效果
      await new Promise(resolve => setTimeout(resolve, 500))
      showSecretDialog.value = false
      
      // 处理成功逻辑
      const plan = code.split('2024')[0].toLowerCase()
      // 这里添加跳转或激活逻辑
    }
  } catch (error) {
    // 处理错误
  } finally {
    verifyingCode.value = false
    secretCode.value = ''
  }
}
</script>

<style scoped>
.custom-button {
  @apply bg-[#4B89FF] hover:bg-[#5C95FF] border-none font-medium;
  height: 42px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(108, 152, 255, 0.25);
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(108, 152, 255, 0.3);
}

.custom-button:active {
  background: #3A78FF !important;
  transform: translateY(1px);
}

.compare-features-btn {
  @apply text-[#4B89FF] border-[#4B89FF] hover:text-white hover:bg-[#4B89FF];
  height: 42px;
  border-radius: 12px;
  padding: 0 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.comparison-table {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg;
  transition: all 0.3s ease;
}

.comparison-table th {
  @apply font-semibold text-gray-900;
}

.comparison-table td {
  @apply text-sm;
}

.feature-row {
  @apply transition-colors duration-200;
}

.feature-row:hover {
  @apply bg-gray-50;
}

/* 添加动画效果 */
.comparison-table {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 美化滚动效果 */
html {
  scroll-behavior: smooth;
}

/* FAQ 样式 */
.faq-section {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden;
  transition: all 0.3s ease;
}

.faq-section:hover {
  @apply shadow-md;
}

/* 添加展开/收起动画 */
.faq-answer-enter-active,
.faq-answer-leave-active {
  transition: all 0.3s ease-out;
}

.faq-answer-enter-from,
.faq-answer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.secret-portal-btn {
  @apply p-2 rounded-full transition-all duration-300;
}

.secret-portal-btn:hover {
  @apply bg-gray-100;
}

.secret-portal {
  @apply p-6 bg-white rounded-xl;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.portal-header {
  @apply mb-8 text-center;
}

.portal-title {
  @apply text-xl font-bold text-gray-900;
  font-family: 'Space Grotesk', sans-serif;
}

.portal-input {
  @apply bg-gray-50 border-gray-200 text-gray-900 mb-6;
  height: 48px;
  border-radius: 12px;
}

.portal-input:focus {
  @apply border-blue-500 shadow-none;
}

.portal-verify-btn {
  @apply w-full py-3 px-6 rounded-xl text-white font-medium relative overflow-hidden;
  background: linear-gradient(135deg, #4B89FF 0%, #2563EB 100%);
  transition: all 0.3s ease;
}

.portal-verify-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
}

.portal-verify-btn.verifying {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
}

/* Modal 自定义样式 */
:deep(.ant-modal-content) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

:deep(.ant-modal-wrap) {
  background: rgba(0, 0, 0, 0.5);
}

:deep(.ant-modal) {
  padding: 0;
}

:deep(.ant-modal-body) {
  padding: 0;
}

:deep(.ant-modal-close) {
  color: rgba(255, 255, 255, 0.8);
  top: 12px;
  right: 12px;
}

:deep(.ant-modal-close:hover) {
  color: white;
}
</style>
