<template>
  <div class="min-h-screen bg-gradient-to-br from-[#4B89FF]/5 via-[#6C9AFF]/5 to-[#4B89FF]/5">
    <!-- Decorative Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[1200px] h-[1200px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[1200px] h-[1200px] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
    </div>

    <!-- Main Content -->
    <div class="relative min-h-screen flex items-center justify-center p-12">
      <div class="w-full max-w-6xl">
        <!-- Chat Container -->
        <div class="bg-white/70 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-blue-100/50">
          <!-- Chat Messages -->
          <div class="space-y-10 mb-8 max-h-[70vh] overflow-y-auto px-6" ref="chatContainer">
            <!-- Welcome Message -->
            <div class="chat-message assistant">
              <div class="avatar">
                <img 
                  src="../assets/images/websitelm-logo-single.png" 
                  alt="WebsiteLM AI"
                  class="w-full h-full object-contain p-1.5"
                />
              </div>
              <div class="message">
                Hi there! I'm here to help you set up your product. Let's get started! 👋
              </div>
            </div>

            <!-- Product Name Question -->
            <div v-if="messages.length >= 1" class="chat-message assistant">
              <div class="avatar">
                <img 
                  src="../assets/images/websitelm-logo-single.png" 
                  alt="WebsiteLM AI"
                  class="w-full h-full object-contain p-1.5"
                />
              </div>
              <div class="message">
                First, what's the name of your product or service? 🚀
              </div>
            </div>

            <!-- Product Name Input (if not provided) -->
            <div v-if="currentStep === 1" class="chat-message user">
              <div class="message">
                <a-input
                  v-model:value="formData.productName"
                  placeholder="Enter your product name..."
                  class="chat-input"
                  @pressEnter="handleProductName"
                  :maxLength="50"
                >
                  <template #prefix>
                    <i class="fas fa-rocket text-gray-400"></i>
                  </template>
                </a-input>
              </div>
            </div>

            <!-- Product Name Message -->
            <div v-if="messages.includes('productName')" class="chat-message user">
              <div class="message-wrapper">
                <div class="message">
                  {{ formData.productName }}
                </div>
                <button 
                  @click="editField('productName')" 
                  class="edit-button"
                  title="Edit product name"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>

            <!-- Website Question -->
            <div v-if="messages.includes('productName')" class="chat-message assistant">
              <div class="avatar">
                <img 
                  src="../assets/images/websitelm-logo-single.png" 
                  alt="WebsiteLM AI"
                  class="w-full h-full object-contain p-1.5"
                />
              </div>
              <div class="message">
                Great! Now, what's your website URL? 🌐
              </div>
            </div>

            <!-- Website Input -->
            <div v-if="currentStep === 2" class="chat-message user">
              <div class="message">
                <a-input-group compact class="website-input-group">
                  <span class="website-prefix">
                    <i class="fas fa-globe mr-2"></i>
                    https://
                  </span>
                  <a-input
                    v-model:value="formData.website"
                    placeholder="example.com"
                    class="chat-input"
                    @pressEnter="handleWebsite"
                  />
                </a-input-group>
              </div>
            </div>

            <!-- Website Message -->
            <div v-if="messages.includes('website')" class="chat-message user">
              <div class="message-wrapper">
                <div class="message">
                  https://{{ formData.website }}
                </div>
                <button 
                  @click="editField('website')" 
                  class="edit-button"
                  title="Edit website URL"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>

            <!-- Competitors Question -->
            <div v-if="messages.includes('website')" class="chat-message assistant">
              <div class="avatar">
                <img 
                  src="../assets/images/websitelm-logo-single.png" 
                  alt="WebsiteLM AI"
                  class="w-full h-full object-contain p-1.5"
                />
              </div>
              <div class="message">
                Excellent! Lastly, who are your main competitors? This helps me understand your market better. 📊
                <div class="text-sm text-gray-500 mt-2">
                  Add up to 4 competitors. Press Enter after each one.
                </div>
              </div>
            </div>

            <!-- Competitors Input -->
            <div v-if="currentStep === 3" class="chat-message user">
              <div class="message w-full max-w-4xl">
                <div class="space-y-6">
                  <!-- 已添加的竞争对手列表 -->
                  <div class="competitors-list">
                    <template v-if="formData.competitors && formData.competitors.length > 0">
                      <div 
                        v-for="(comp, index) in formData.competitors" 
                        :key="index"
                        class="competitor-tag"
                      >
                        {{ comp.name }} ({{ comp.url }})
                        <button @click="removeCompetitor(index)" class="remove-btn">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </template>
                  </div>

                  <!-- 竞争对手输入框 -->
                  <div v-if="formData.competitors.length < 4" class="competitor-input-group">
                    <a-input
                      v-model:value="newCompetitor.name"
                      placeholder="Competitor name"
                      class="competitor-input"
                      ref="competitorNameInput"
                    />
                    <a-input
                      v-model:value="newCompetitor.url"
                      placeholder="Website URL"
                      class="competitor-input"
                      @pressEnter="handleCompetitor"
                    />
                  </div>

                  <!-- 提示信息和完成按钮 -->
                  <div class="flex items-center justify-between mt-4">
                    <div class="text-base text-gray-500">
                      {{ formData.competitors.length < 4 
                        ? `Press Enter to add competitor (${4 - formData.competitors.length} more can be added)` 
                        : 'Maximum competitors reached' }}
                    </div>
                    <button 
                      v-if="formData.competitors.length > 0"
                      @click="completeCompetitors" 
                      class="complete-competitors-btn"
                    >
                      <span>Complete</span>
                      <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Final Confirmation -->
            <div v-if="messages.includes('competitors')" class="chat-message assistant">
              <div class="avatar">
                <img 
                  src="../assets/images/websitelm-logo-single.png" 
                  alt="WebsiteLM AI"
                  class="w-full h-full object-contain p-1.5"
                />
              </div>
              <div class="message">
                Perfect! I have everything I need. Ready to set up your product? 🎉
                <button 
                  @click="submitForm"
                  :disabled="loading"
                  class="complete-setup-btn"
                >
                  <span class="btn-content">
                    <span class="btn-text">Complete Setup</span>
                    <span class="btn-icon">
                      <i class="fas fa-arrow-right"></i>
                    </span>
                  </span>
                  <span class="btn-loading" v-if="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </div>
            </div>

            <!-- 显示已添加的竞争对手信息 -->
            <div v-if="messages.includes('competitors')" class="chat-message user">
              <div class="message-wrapper">
                <div class="message">
                  <div class="competitors-summary">
                    Added competitors:
                    <div class="competitor-list-summary">
                      <div v-for="(comp, index) in formData.competitors" :key="index" class="competitor-item">
                        {{ comp.name }} ({{ comp.url }})
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  @click="editField('competitors')" 
                  class="edit-button"
                  title="Edit competitors"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Current Input Area -->
          <div v-if="!messages.includes('competitors')" class="mt-4">
            <div class="text-xs text-gray-500 mb-2">
              {{ getInputHint }}
            </div>
            <div class="flex items-center gap-2">
              <div class="typing-indicator" v-if="isTyping">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import apiClient from '../api/api'

const router = useRouter()
const chatContainer = ref<HTMLElement | null>(null)
const currentStep = ref(1)
const loading = ref(false)
const isTyping = ref(false)
const messages = ref<string[]>([])
const editingField = ref<string | null>(null)

const formData = reactive({
  productName: '',
  website: '',
  competitors: [] as { name: string; url: string }[]
})

const newCompetitor = reactive({
  name: '',
  url: ''
})

const competitorNameInput = ref<HTMLElement | null>(null)

// 输入提示文本
const getInputHint = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Press Enter to confirm your product name'
    case 2:
      return 'Press Enter to confirm your website URL'
    case 3:
      return 'Fill in both fields and press Enter to add a competitor'
    default:
      return ''
  }
})

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 模拟打字效果
const simulateTyping = async () => {
  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isTyping.value = false
}

// 处理产品名称
const handleProductName = async () => {
  if (!formData.productName.trim()) {
    message.warning('Please enter your product name')
    return
  }
  await simulateTyping()
  messages.value.push('productName')
  currentStep.value = 2
  scrollToBottom()
}

// 处理网站
const handleWebsite = async () => {
  if (!formData.website.trim()) {
    message.warning('Please enter your website URL')
    return
  }
  
  // 验证网址格式
  const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
  if (!urlPattern.test(formData.website.trim())) {
    message.warning('Please enter a valid website URL')
    return
  }

  // 确保竞争对手数组已初始化
  if (formData.competitors.length === 0) {
    formData.competitors = []
  }

  await simulateTyping()
  messages.value.push('website')
  currentStep.value = 3
  scrollToBottom()
}

// 处理竞争对手
const handleCompetitor = async () => {
  if (!newCompetitor.name.trim() || !newCompetitor.url.trim()) {
    message.warning('Please fill in both competitor name and URL')
    return
  }
  
  // 添加新的竞争对手
  formData.competitors.push({
    name: newCompetitor.name,
    url: newCompetitor.url
  })
  
  // 清空输入框
  newCompetitor.name = ''
  newCompetitor.url = ''
  
  // 如果达到最大数量，自动完成
  if (formData.competitors.length === 4) {
    await completeCompetitors()
  } else {
    // 自动聚焦到名称输入框，方便继续添加
    nextTick(() => {
      competitorNameInput.value?.focus()
    })
  }
}

// 完成竞争对手添加
const completeCompetitors = async () => {
  if (formData.competitors.length === 0) {
    message.warning('Please add at least one competitor')
    return
  }
  
  await simulateTyping()
  messages.value.push('competitors')
  scrollToBottom()
}

// 移除竞争对手
const removeCompetitor = (index: number) => {
  formData.competitors.splice(index, 1)
  if (formData.competitors.length === 0) {
    messages.value = messages.value.filter(m => m !== 'competitors')
  }
}

// 提交表单
const submitForm = async () => {
  loading.value = true
  try {
    const response = await apiClient.createProduct({
      customerId: localStorage.getItem('currentCustomerId'),
      productName: formData.productName,
      website: formData.website,
      competeProduct: formData.competitors
        .filter(c => c.name && c.url)
        .map(c => `${c.name}|${c.url}`)
        .join(','),
      sitemap: '',
      domainStatus: false
    })

    if (response?.code === 200) {
      message.success('Setup completed successfully!')
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Setup failed:', error)
    message.error('Failed to complete setup. Please try again.')
  } finally {
    loading.value = false
  }
}

// 编辑功能
const editField = (field: string) => {
  editingField.value = field
  
  // 根据编辑的字段重置后续步骤
  switch (field) {
    case 'productName':
      currentStep.value = 1
      // 清空所有后续步骤的消息
      messages.value = []
      // 清空网址和竞争对手数据
      formData.website = ''
      formData.competitors = []
      break
    case 'website':
      currentStep.value = 2
      // 清空网址后续步骤的消息
      messages.value = messages.value.filter(m => m === 'productName')
      // 清空竞争对手数据
      formData.competitors = []
      break
    case 'competitors':
      currentStep.value = 3
      messages.value = messages.value.filter(m => m === 'productName' || m === 'website')
      break
  }
  scrollToBottom()
}

// 监听消息变化，自动滚动
watch(messages, () => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 2rem;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  margin-bottom: 2rem;
}

.chat-message.assistant {
  margin-right: 6rem;
}

.chat-message.user {
  flex-direction: row-reverse;
  margin-left: 6rem;
}

.avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(75, 137, 255, 0.1);
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5px;
}

.message {
  padding: 1.75rem 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
  line-height: 1.6;
}

.chat-message.assistant .message {
  border-top-left-radius: 0;
  background: white;
}

.chat-message.user .message {
  border-top-right-radius: 0;
  background: linear-gradient(to right, #f8faff, #f0f7ff);
  border: 1px solid rgba(75, 137, 255, 0.1);
}

.chat-input {
  @apply h-14 text-lg transition-all duration-200 ease-in-out;
  width: 100%;
  min-width: 320px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 0.75rem 1.25rem;
  font-size: 1.05rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-input:focus {
  @apply border-[#4B89FF] ring-2 ring-[#4B89FF]/20;
  transform: translateY(-1px);
}

.website-input-group {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 320px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.website-prefix {
  @apply inline-flex items-center px-4 h-14 text-gray-600 bg-gray-50 border-2 border-r-0 border-gray-200;
  font-size: 1.05rem;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}

.competitor-input-group {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.competitor-input {
  @apply h-14 text-lg border-gray-200 rounded-xl transition-shadow;
  flex: 1;
}

.competitors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.competitor-tag {
  @apply bg-blue-50 text-blue-600 px-6 py-3 rounded-xl text-base
         flex items-center gap-3 border border-blue-100;
}

.remove-btn {
  @apply text-blue-400 hover:text-blue-600 p-1 rounded-full
         hover:bg-blue-50 transition-colors duration-200;
}

.typing-indicator {
  display: flex;
  gap: 0.4rem;
  padding: 0.75rem;
}

.typing-indicator span {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: #4B89FF;
  animation: bounce 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 添加滚动条样式 */
.max-h-[70vh] {
  scrollbar-width: thin;
  scrollbar-color: #4B89FF #f0f7ff;
}

.max-h-[70vh]::-webkit-scrollbar {
  width: 6px;
}

.max-h-[70vh]::-webkit-scrollbar-track {
  background: #f0f7ff;
  border-radius: 3px;
}

.max-h-[70vh]::-webkit-scrollbar-thumb {
  background-color: #4B89FF;
  border-radius: 3px;
}

/* 完成设置按钮样式 */
.complete-setup-btn {
  @apply mt-6 w-full relative overflow-hidden;
  height: 56px;
  background: linear-gradient(135deg, #4B89FF 0%, #6C9AFF 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(75, 137, 255, 0.25);
}

.complete-setup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(75, 137, 255, 0.35);
  background: linear-gradient(135deg, #6C9AFF 0%, #4B89FF 100%);
}

.complete-setup-btn:active {
  transform: translateY(0);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 100%;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.complete-setup-btn:hover .btn-icon {
  transform: translateX(4px);
}

.btn-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4B89FF 0%, #6C9AFF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-loading span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: loadingDots 1s infinite ease-in-out;
}

.btn-loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.btn-loading span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDots {
  0%, 100% {
    transform: scale(0.3);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.message-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.edit-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(75, 137, 255, 0.1);
  color: #4B89FF;
  opacity: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.message-wrapper:hover .edit-button {
  opacity: 1;
}

.edit-button:hover {
  background: #f0f7ff;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 137, 255, 0.15);
}

.edit-button:active {
  transform: scale(0.95);
}

.edit-button i {
  font-size: 0.9rem;
}

.message {
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: none;
}

.chat-message.user .message-wrapper {
  justify-content: flex-end;
}

.competitors-summary {
  font-size: 0.95rem;
}

.competitor-list-summary {
  margin-top: 0.5rem;
}

.competitor-item {
  padding: 0.25rem 0;
  color: #4B89FF;
}

.complete-competitors-btn {
  @apply px-6 h-12 text-base font-medium rounded-xl
         bg-[#4B89FF] text-white hover:bg-[#3A78FF]
         transition-all duration-200 flex items-center;
}

.complete-competitors-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(75, 137, 255, 0.2);
}
</style> 