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
          Select a plan that suits your needs. Start now with a 7-day money-back guarantee.
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
            class="relative flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow text-center"
            :class="{ 'ring-2 ring-[#4B89FF]': plan.popular }"
          >
            <h3 class="text-xl font-semibold text-gray-900">{{ plan.name }}</h3>

            <!-- Price Display -->
            <div class="mt-4 flex items-baseline justify-center">
              <span class="text-4xl font-bold tracking-tight text-gray-900">
                {{ plan.price[selectedPeriod] }}
              </span>
              <span 
                v-if="plan.discount" 
                class="ml-2 text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded"
              >
                Save {{ plan.discount }}
              </span>
            </div>
            
            <p class="mt-2 text-sm text-gray-500">
              {{ selectedPeriod === 'yearly' ? 'per month, billed annually' : 'billed monthly' }}
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

            <!-- Features List -->
            <div class="mt-8 space-y-4">
              <template v-for="(section, index) in plan.features" :key="index">
                <h4 class="text-sm font-medium text-gray-900 text-center">
                  {{ section.title }}
                </h4>
                <ul class="mt-4 space-y-3">
                  <li 
                    v-for="feature in section.items" 
                    :key="feature"
                    class="flex items-center justify-center"
                  >
                    <i class="fas fa-check text-[#4B89FF] mr-2"></i>
                    <span class="text-sm text-[#4A5568]">{{ feature }}</span>
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
    name: 'Essential',
    price: {
      monthly: '$99',
      yearly: '$79'
    },
    discount: '$240',
    description: 'Everything you need to start optimizing your content',
    buttonText: 'Get Started',
    features: [
      {
        title: 'Features include:',
        items: [
          'Track 200 pages',
          'Write and optimize 360 articles/year',
          'Generate 60 AI-optimized articles/year',
          'Invite 5 team members',
          'Topic mapping and keyword research'
        ]
      }
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    popular: true,
    price: {
      monthly: '$219',
      yearly: '$175'
    },
    discount: '$528',
    description: 'Perfect for marketing teams scaling content production',
    buttonText: 'Get Started',
    features: [
      {
        title: 'Everything in Essential, plus:',
        items: [
          'Track 1,000 pages',
          'Write and optimize 1,200 articles/year',
          'Generate 240 AI-optimized articles/year',
          'Invite 10 team members'
        ]
      },
      {
        title: 'Pro features:',
        items: [
          'Analyze up to 100 SERPs/day',
          'SEO onboarding call'
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
          'Custom team size',
          'White-label & API access',
          'SSO (Coming soon)',
          'Personalized onboarding, dedicated success manager & priority support',
          'SEO consulting services'
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
    category: 'Content Creation',
    features: [
      {
        name: 'AI-powered content generation',
        essential: '60/year',
        professional: '240/year',
        professional: 'Unlimited'
      },
      {
        name: 'Content optimization suggestions',
        essential: true,
        professional: true,
        enterprise: true
      },
      {
        name: 'SEO templates',
        essential: '5',
        professional: '15',
        enterprise: 'Unlimited'
      }
    ]
  },
  {
    category: 'Analytics & Tracking',
    features: [
      {
        name: 'Page tracking',
        essential: '200',
        professional: '1,000',
        enterprise: 'Unlimited'
      },
      {
        name: 'SERP analysis',
        essential: '10/day',
        professional: '100/day',
        enterprise: 'Unlimited'
      },
      {
        name: 'Custom reporting',
        essential: false,
        professional: true,
        enterprise: true
      }
    ]
  },
  {
    category: 'Team & Collaboration',
    features: [
      {
        name: 'Team members',
        essential: '5',
        professional: '10',
        enterprise: 'Unlimited'
      },
      {
        name: 'Role-based access',
        essential: false,
        professional: true,
        enterprise: true
      },
      {
        name: 'Workflow automation',
        essential: false,
        professional: true,
        enterprise: true
      }
    ]
  },
  {
    category: 'Support & Training',
    features: [
      {
        name: 'Email support',
        essential: true,
        professional: true,
        enterprise: true
      },
      {
        name: 'Priority support',
        essential: false,
        professional: true,
        enterprise: true
      },
      {
        name: 'Dedicated success manager',
        essential: false,
        professional: false,
        enterprise: true
      },
      {
        name: 'Custom training sessions',
        essential: false,
        professional: false,
        enterprise: true
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
    question: "What's included in the free trial?",
    answer: "Our 7-day free trial includes full access to all features of the Professional plan. You can explore all the tools and capabilities without any restrictions. No credit card is required to start your trial."
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be immediately available. If you downgrade, you'll continue to have access to your current plan until the end of your billing period."
  },
  {
    question: "How does the money-back guarantee work?",
    answer: "We offer a no-questions-asked money-back guarantee for the first 7 days of your paid subscription. If you're not satisfied with our service, simply contact our support team within the first 7 days, and we'll process your refund."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans. All payments are processed securely through our payment partners."
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Yes, our Enterprise plan is fully customizable to meet your organization's specific needs. This includes custom feature development, dedicated support, and flexible billing options. Contact our sales team to discuss your requirements."
  },
  {
    question: "What kind of support is included?",
    answer: "All plans include email support. Professional plans include priority support with faster response times. Enterprise plans receive dedicated support with a named account manager and 24/7 emergency support."
  }
]
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
</style>
