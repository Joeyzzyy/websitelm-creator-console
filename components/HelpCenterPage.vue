<template>
  <div class="help-center">
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>

    <div v-else class="help-center-content">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <a-button type="link" @click="goBack">
            <ArrowLeftOutlined /> Back
          </a-button>
          <h1>Knowledge Base</h1>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Breadcrumb -->
        <div class="breadcrumb" v-if="currentArticle">
          <span @click="clearCurrentArticle">Knowledge Base</span>
          <span class="separator">/</span>
          <span>{{ currentArticle.label }}</span>
          <span class="separator">/</span>
          <span class="current">{{ currentArticle.title }}</span>
        </div>

        <!-- Grid View -->
        <div class="grid-container" v-if="!currentArticle">
          <div 
            v-for="(articles, label) in groupedArticles" 
            :key="label"
            class="category-card"
          >
            <div class="category-header">
              <h2>{{ label }}</h2>
              <span class="article-count">{{ articles.length }} articles</span>
            </div>
            <div class="article-list">
              <div 
                v-for="article in articles" 
                :key="article.title"
                class="article-item"
                @click="selectArticle(article)"
              >
                {{ article.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Article Detail View -->
        <div v-else class="article-detail">
          <div class="article-actions">
            <a-button 
              type="primary"
              :loading="saving"
              @click="saveArticle"
            >
              Save Changes
            </a-button>
          </div>
          <h1 class="article-title">{{ currentArticle.title }}</h1>
          <!-- 使用 textarea 进行编辑 -->
          <a-textarea
            v-model:value="editableContent"
            :rows="20"
            class="article-editor"
            :bordered="false"
            placeholder="Enter article content..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import apiClient from '../api/api'
import { ref } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

export default {
  name: 'HelpCenterPage',
  components: {
    ArrowLeftOutlined
  },
  setup() {
    const router = useRouter()
    const groupedArticles = ref({})
    const loading = ref(true)
    const currentArticle = ref(null)
    const editableContent = ref('')
    const saving = ref(false)

    // 获取数据
    const getHelpCenterData = async () => {
      try {
        // 暂时使用固定的用户名
        const userName = 'kreado'
        const data = await apiClient.getHelpCenterData(userName)
        return data
      } catch (error) {
        console.error('Failed to fetch help center data:', error)
        throw error
      }
    }

    // 分组文章
    const groupArticlesByLabel = (response) => {
      const grouped = {}
      response.data.forEach(article => {
        if (!grouped[article.label]) {
          grouped[article.label] = []
        }
        grouped[article.label].push(article)
      })
      groupedArticles.value = grouped
    }

    // 初始化数据
    const initData = async () => {
      try {
        loading.value = true
        const response = await getHelpCenterData()
        groupArticlesByLabel(response)
      } catch (error) {
        console.error('Failed to initialize help center data:', error)
      } finally {
        loading.value = false
      }
    }

    // 选择文章
    const selectArticle = (article) => {
      currentArticle.value = article
      editableContent.value = article.content
    }

    // 清除当前文章
    const clearCurrentArticle = () => {
      currentArticle.value = null
      editableContent.value = ''
    }

    // 返回
    const goBack = () => {
      if (currentArticle.value) {
        clearCurrentArticle()
      } else {
        router.back()
      }
    }

    // 保存文章
    const saveArticle = async () => {
      try {
        saving.value = true
        // 这里添加实际的保存逻辑，调用API保存更新后的内容
        await apiClient.updateArticle({
          ...currentArticle.value,
          content: editableContent.value
        })
        message.success('Article saved successfully')
      } catch (error) {
        console.error('Failed to save article:', error)
        message.error('Failed to save article')
      } finally {
        saving.value = false
      }
    }

    // 初始化
    initData()

    return {
      groupedArticles,
      loading,
      currentArticle,
      editableContent,
      saving,
      selectArticle,
      clearCurrentArticle,
      goBack,
      saveArticle
    }
  }
}
</script>

<style scoped>
.help-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.help-center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.breadcrumb {
  padding: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.breadcrumb span {
  cursor: pointer;
}

.breadcrumb span:hover:not(.current) {
  color: #2563eb;
}

.breadcrumb .separator {
  margin: 0 8px;
  color: #9ca3af;
  cursor: default;
}

.breadcrumb .current {
  color: #1f2937;
  cursor: default;
}

.article-detail {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.article-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #1f2937;
}

.article-editor {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: none;
  resize: none;
  min-height: 0;
}

.article-actions {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1;
}

.grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease;
  border-top: 3px solid #e6f4ff;
}

.category-card:hover {
  transform: translateY(-2px);
  border-top-color: #38BDF8;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.category-header h2 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  position: relative;
}

.category-header h2::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #38BDF8;
}

.article-count {
  font-size: 13px;
  color: #6b7280;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-item {
  padding: 8px 12px;
  border-radius: 6px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.article-item:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.article-content {
  color: #4b5563;
  line-height: 1.6;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  color: #1f2937;
  margin-top: 24px;
  margin-bottom: 16px;
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e6f4ff;
  border-top: 3px solid #38BDF8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>