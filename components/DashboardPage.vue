<template>
  <page-layout
    title="Dashboard"
    description="Manage your product and track your performance"
    icon="📊"
  >
    <!-- Product info and statistics banner -->
    <div class="info-banner">
      <!-- Product Info Card -->
      <div class="product-info">
        <div class="card-header">
          <h3>Product Information</h3>
          <div class="header-actions">
            <a-button type="link" class="delete-link" @click="deleteProduct">
              <DeleteOutlined /> Delete
            </a-button>
            <a-button 
              type="link" 
              class="sitemap-link" 
              @click="showSitemapModal" 
              :disabled="!productInfo || loadingSitemap || !productInfo?.projectWebsite"
            >
              <template v-if="loadingSitemap">Loading...</template>
              <template v-else-if="!productInfo?.projectWebsite">Add your website to get sitemap automatically 👉</template>
              <template v-else>Sitemap</template>
            </a-button>
            <a-button 
              type="link" 
              class="edit-link" 
              @click="editProductInfo"
              :disabled="!productInfo"
            >
              <EditOutlined /> Edit
            </a-button>
          </div>
        </div>
        <div class="info-list">
          <!-- Product Name -->
          <div class="info-row">
            <div class="info-label">Product Name</div>
            <div class="info-content">
              <template v-if="productInfo">
                {{ productInfo.productName }}
              </template>
              <template v-else>
                <span class="error-text">Loading Data...</span>
              </template>
            </div>
          </div>

          <!-- Product Description -->
          <div class="info-row">
            <div class="info-label">Product Description</div>
            <div class="info-content">
              <template v-if="productInfo">
                <div class="description-text">{{ productInfo.productDesc }}</div>
              </template>
              <template v-else>
                <span class="error-text">Loading Data...</span>
              </template>
            </div>
          </div>

          <!-- Your Site -->
          <div class="info-row">
            <div class="info-label">Your Site</div>
            <div class="info-content">
              <template v-if="productInfo">
                <a :href="productInfo.projectWebsite" target="_blank" class="site-link">{{ productInfo.projectWebsite }}</a>
              </template>
              <template v-else>
                <span class="error-text">Loading Data...</span>
              </template>
            </div>
          </div>

          <!-- Your Competitors -->
          <div class="info-row">
            <div class="info-label">Your Competitors</div>
            <div class="info-content">
              <template v-if="productInfo">
                <a-tag v-for="comp in competitors" :key="comp.name">
                  <a :href="'https://' + comp.url" target="_blank" class="competitor-link">
                    {{ comp.name }}
                  </a>
                </a-tag>
              </template>
              <template v-else>
                <span class="error-text">Loading Data...</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Container -->
      <div class="metrics-container">
        <!-- Pages Metric -->
        <div class="metric-item">
          <div class="metric-icon">📄</div>
          <div class="metric-data">
            <div class="metric-row">
              <h4>{{ generatedPages.length }}</h4>
              <span class="metric-label">Generated Pages</span>
            </div>
            <div class="metric-row">
              <h4>{{ publishedPages || 0 }}</h4>
              <span class="metric-label">Published Pages</span>
            </div>
          </div>
        </div>

        <!-- Visits Metric -->
        <div class="metric-item">
          <div class="metric-header">
            <div class="metric-icon-container">
              <div class="metric-icon">👥</div>
              <div v-if="isGscConnected && gscSites.length > 0" class="connected-site">
                {{ gscSites[0].siteUrl }}
              </div>
            </div>
            <a-button 
              class="connect-gsc-btn" 
              type="link" 
              @click="connectGSC"
              :disabled="isGscConnected"
            >
              {{ isGscConnected ? 'Connected!' : 'Connect GSC' }}
            </a-button>
          </div>
          <div class="metric-data">
            <div class="metric-row">
              <h4>-</h4>
              <span class="metric-label">Total Visits</span>
            </div>
            <div class="metric-trend positive">
              <span class="trend-icon">↑</span>
              <span>-</span>
            </div>
          </div>
        </div>

        <!-- Clicks Metric -->
        <div class="metric-item">
          <div class="metric-header">
            <div class="metric-icon-container">
              <div class="metric-icon">🎯</div>
              <div v-if="isGscConnected && gscSites.length > 0" class="connected-site">
                {{ gscSites[0].siteUrl }}
              </div>
            </div>
            <a-button 
              class="connect-gsc-btn" 
              type="link" 
              @click="connectGSC"
              :disabled="isGscConnected"
            >
              {{ isGscConnected ? 'Connected!' : 'Connect GSC' }}
            </a-button>
          </div>
          <div class="metric-data">
            <div class="metric-row">
              <h4>-</h4>
              <span class="metric-label">Total Clicks</span>
            </div>
            <div class="metric-trend positive">
              <span class="trend-icon">↑</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </page-layout>

  <!-- Add onboarding modal -->
  <a-modal
    v-model:open="onboardingModalVisible"
    :maskClosable="false"
    :closable="!!formState.productId"
    :width="800"
    :footer="null"
    :class="['product-modal', {'onboarding-modal': !formState.productId}]"
  >
    <template #title>
      <div v-if="!formState.productId" class="onboarding-header">
        <div class="glow-effect"></div>
        <div class="title-container">
          <div class="welcome-badge">BETA</div>
          <h2 class="modal-title onboarding-title">
            🚀 Welcome to WebsiteLM!
          </h2>
          <p class="modal-subtitle">
            Let's set up your product to create your AI marketing assistant
          </p>
        </div>
      </div>
      <div v-else class="modal-title">
        ✏️ Edit Product Information
      </div>
    </template>
    
    <div class="setup-form">
      <a-steps 
        :current="currentStep" 
        class="setup-steps"
        size="small"
      >
        <a-step title="Basic Info" />
        <a-step title="Market Analysis" />
      </a-steps>

      <a-form 
        :model="formState" 
        class="brand-form"
        layout="vertical"
        @finish="handleOnboardingFinish"
        ref="formRef"
      >
        <!-- Step 1: Basic Info -->
        <div v-show="currentStep === 0" class="step-content">
          <div class="basic-info-section">
            <a-form-item 
              label="Product Name" 
              name="productName"
              :rules="[{ required: true, message: 'Please enter product name' }]"
            >
              <a-input 
                v-model:value="formState.productName" 
                placeholder="Enter your product name"
                :maxLength="50"
                class="compact-input"
              />
            </a-form-item>

            <a-form-item 
              label="Official Website" 
              name="website"
            >
              <a-input-group compact>
                <a-select
                  v-model:value="websitePrefix"
                  style="width: 90px"
                  :disabled="true"
                  :open="false"
                >
                  <a-select-option value="https://">https://</a-select-option>
                </a-select>
                <a-input 
                  v-model:value="formState.website" 
                  style="width: calc(100% - 90px)"
                  placeholder="example.com"
                  @change="handleWebsiteChange"
                  class="compact-input"
                />
              </a-input-group>
            </a-form-item>
          </div>
        </div>

        <!-- Step 2: Market Analysis -->
        <div v-show="currentStep === 1" class="step-content">
          <!-- 原有的 competitors-section 内容 -->
          <div class="competitors-section">
            <!-- Competitors Section First -->
            <a-form-item 
              name="competitors"
            >
            <template #label>
              <span class="required-mark">*</span>
              Add your main competitors
            </template>
              <div class="competitors-container">
                <div class="competitors-header">
                  <div class="header-top">
                    <div class="competitors-title">
                      <CompetitorIcon class="icon" />
                    </div>
                    <!-- 将竞品标签移到这里 -->
                    <div class="competitors-list" v-if="formState.competitors.length > 0">
                      <a-tag 
                        v-for="(comp, index) in formState.competitors" 
                        :key="index"
                        closable
                        @close.prevent="removeCompetitor(index)"
                        class="competitor-tag"
                      >
                        <div class="competitor-info">
                          <span class="competitor-name">{{ comp.name }}</span>
                          <a :href="'https://' + comp.url" target="_blank" class="competitor-link">
                            <LinkOutlined />
                            {{ comp.url }}
                          </a>
                        </div>
                      </a-tag>
                    </div>
                  </div>
                  <div class="competitors-description">
                    <p>We'll analyze your competitors' keywords performance to:</p>
                    <ul>
                      <li>
                        <CheckCircleOutlined class="check-icon" />
                        <span>Identify high-performing keywords in your industry</span>
                      </li>
                      <li>
                        <CheckCircleOutlined class="check-icon" />
                        <span>Optimize your content strategy based on market data</span>
                      </li>
                      <li>
                        <CheckCircleOutlined class="check-icon" />
                        <span>Track your ranking performance against competitors</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Add competitor input -->
                <div class="add-competitor">
                  <div class="input-group-wrapper">
                    <a-input
                      v-model:value="newCompetitor.name"
                      class="competitor-name-input"
                      placeholder="Competitor name"
                    >
                      <template #prefix>
                        <TeamOutlined class="input-icon" />
                      </template>
                    </a-input>
                    <a-input
                      v-model:value="newCompetitor.url"
                      class="competitor-url-input"
                      placeholder="Website (e.g. example.com)"
                    >
                      <template #prefix>
                        <GlobalOutlined class="input-icon" />
                      </template>
                    </a-input>
                    <a-button 
                      type="primary"
                      class="add-button"
                      @click="addCompetitor"
                      :disabled="!newCompetitor.name || !newCompetitor.url"
                    >
                      <PlusOutlined /> Add
                    </a-button>
                  </div>
                  <div class="competitor-limit-hint">
                    <InfoCircleOutlined />
                    <span>You can add up to 4 main competitors</span>
                  </div>
                </div>
              </div>
            </a-form-item>

            <!-- 添加展开/收起按��� -->
            <div class="features-toggle" @click="toggleFeatures">
              <span>Need help finding your competitors?</span>
              <DownOutlined :class="['toggle-icon', { 'is-expanded': showFeatures }]" />
            </div>

            <!-- Product Features Section with transition -->
            <div class="features-wrapper" :class="{ 'expanded': showFeatures }">
              <a-form-item 
                label="Don't know your competitors? Describe your product features and we'll help you find relevant competitors" 
                name="coreFeatures"
                :rules="[{ required: false }]"
              >
                <div class="features-input-wrapper">
                  <a-textarea 
                    v-model:value="formState.coreFeatures"
                    :rows="6"
                    :autoSize="false"
                    placeholder="E.g., Our product is a project management tool that helps teams:
- Track tasks and deadlines
- Collaborate on projects in real-time
- Generate automated reports
- Integrate with popular tools like Slack and GitHub"
                    :maxLength="1000"
                    style="resize: none;"
                  />
                </div>
              </a-form-item>
            </div>
          </div>
        </div>

        <div class="steps-action">
          <div class="action-buttons">
            <a-button 
              v-if="currentStep === 1" 
              @click="prevStep"
            >
              Previous
            </a-button>
            <a-button 
              v-if="currentStep === 0" 
              type="primary" 
              @click="nextStep"
              :disabled="!formState.productName"
            >
              Next
            </a-button>
            <a-button 
              v-if="currentStep === 1" 
              type="primary" 
              html-type="submit"
              :loading="loading"
              :disabled="formState.competitors.length === 0" 
              class="submit-button"
            >
              {{ formState.competitors.length === 0 ? 'Add competitors to continue' : 'Start Using WebsiteLM' }}
            </a-button>
          </div>
        </div>
      </a-form>
    </div>
  </a-modal>

  <!-- Add generating mask -->
  <a-modal
    v-model:open="generatingModalVisible"
    :footer="null"
    :closable="false"
    :maskClosable="false"
    class="generating-modal"
  >
    <div class="generating-content">
      <a-spin size="large" />
      <h3>AI is analyzing your website...</h3>
      <p>This may take a few moments. Please wait while we generate product features.</p>
    </div>
  </a-modal>

  <!-- Add success modal component -->
  <success-modal
    v-model:open="successModalVisible"
    @close="handleSuccessModalClose"
  />

  <!-- 添加新的 Sitemap 模态框 -->
  <a-modal
    v-model:open="sitemapModalVisible"
    title="Website Structure"
    :width="1000"
    :footer="null"
    class="sitemap-modal"
  >
    <div class="sitemap-modal-content">
      <div class="sitemap-container">
        <!-- Left: Tree structure -->
        <div class="tree-section">
          <div class="section-header">
            <SearchOutlined />
            <span>Navigation Tree</span>
          </div>
          <div class="tree-content custom-scrollbar">
            <a-tree 
              :tree-data="sitemapData" 
              @select="handleTreeSelect"
              class="custom-tree"
            />
          </div>
        </div>
        
        <!-- Right: Page details -->
        <div class="pages-section">
          <div class="section-header">
            <FileTextOutlined />
            <span>Page List</span>
          </div>
          <div class="pages-content custom-scrollbar">
            <template v-if="selectedPages.length">
              <div class="page-list">
                <div v-for="page in selectedPages" :key="page.loc" class="page-item">
                  <div class="page-info">
                    <a :href="page.loc" target="_blank" class="page-link">
                      <LinkOutlined />
                      <span class="page-url">{{ page.loc }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="empty-state">
                <FolderOpenOutlined />
                <p>Select a category from the tree to view pages</p>
              </div>
            </template>
          </div>
        </div>
      </div> 
    </div>
  </a-modal>

  <!-- 添加 GSC 连接成功的 Modal -->
  <a-modal
    v-model:open="gscSuccessModalVisible"
    :footer="null"
    :maskClosable="false"
    :closable="false"
    class="gsc-success-modal"
  >
    <div class="success-content">
      <div class="success-icon">✨</div>
      <h3>Connected Successfully!</h3>
      <p>Please close this window and refresh the page</p>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import PageLayout from './layout/PageLayout.vue'
import { EditOutlined, DeleteOutlined, ThunderboltOutlined, FileTextOutlined, LineChartOutlined, NodeIndexOutlined } from '@ant-design/icons-vue'
import apiClient from '../api/api'
import SuccessModal from './SuccessModal.vue'
import { CalendarOutlined, LinkOutlined, SearchOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import { GlobalOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    PageLayout,
    EditOutlined,
    DeleteOutlined,
    ThunderboltOutlined,
    SuccessModal,
    CalendarOutlined,
    LinkOutlined,
    FileTextOutlined,
    LineChartOutlined,
    NodeIndexOutlined,
    SearchOutlined,
    FolderOpenOutlined,
    GlobalOutlined
  },
  data() {
    return {
      traffic: '-',
      clicks: '-',
      purchases: '-',
      productInfo: null,
      onboardingModalVisible: false,
      loading: false,
      websitePrefix: 'https://',
      defaultCompetitors: [],
      formState: {
        productId: undefined,
        productName: '',
        website: '',
        coreFeatures: '',
        competitors: []
      },
      successModalVisible: false,
      currentView: 'sitemap',
      generatedPages: [],
      monthlyNewPages: 0,
      newCompetitor: {
        name: '',
        url: ''
      },
      sitemapData: [],
      allPages: [],
      loadingSitemap: false,
      selectedPages: [],
      sitemapModalVisible: false,
      publishedPages: 0,
      isGscConnected: false,
      gscSites: [],
      gscAnalytics: null,
      gscSuccessModalVisible: false,
      gscCheckInterval: null,
      findingCompetitors: false,
      currentStep: 0, // 添加当前步骤
      showFeatures: false, // 添加新的数据属性
    }
  },
  created() {
    this.loadProductInfo()
    this.handleGscCallback()
    this.checkGscStatus()
    this.startGscStatusCheck()
  },
  beforeUnmount() {
    if (this.gscCheckInterval) {
      clearInterval(this.gscCheckInterval)
    }
  },
  setup() {
    const showOnboardingModal = ref(false)
    const isComponentMounted = ref(false)
    const pagesTable = ref(null)
    const productModalVisible = ref(false)
    
    onMounted(() => {
      isComponentMounted.value = true
    })

    onUnmounted(() => {
    })

    return {
      showOnboardingModal,
      isComponentMounted,
      pagesTable,
      productModalVisible
    }
  },
  computed: {
    competitors() {
      if (!this.productInfo || !this.productInfo.competeProduct) return []
      return this.productInfo.competeProduct.split(',').map(item => {
        const [name, url] = item.split('|');
        return { name, url };
      });
    }
  },
  methods: {
    editProductInfo() {
      if (this.productInfo) {
        const competitors = this.productInfo.competeProduct ? 
          this.productInfo.competeProduct.split(',').map(item => {
            const [name, url] = item.split('|');
            return { name, url };
          }) : [];

        this.formState = {
          productId: this.productInfo.productId,
          productName: this.productInfo.productName,
          website: this.productInfo.projectWebsite?.replace('https://', ''),
          coreFeatures: this.productInfo.productDesc,
          competitors: competitors
        }
        this.onboardingModalVisible = true
      }
    },
    
    async loadProductInfo() {
      try {
        const customerId = localStorage.getItem('currentUserId')
        const response = await apiClient.getProductsByCustomerId(customerId)
        
        if (response?.code === 200) {
          this.productInfo = response.data
          if (!response.data) {
            this.formState = {
              productId: undefined,
              productName: '',
              website: '',
              coreFeatures: '',
              competitors: []
            }
            this.onboardingModalVisible = true
          } else {
            this.getSitemap()
          }
        } else {
          this.productInfo = null
        }
      } catch (error) {
        console.error('Failed to load product information:', error)
        this.productInfo = null
      }
    },
    handleCompetitorChange(value) {
      if (value.length > 4) {
        this.formState.competitors = value.slice(0, 4)
      } else {
        this.formState.competitors = value
      }
    },
    async handleOnboardingFinish() {
      this.loading = true
      try {
        const formData = {
          customerId: localStorage.getItem('currentUserId'),
          productName: this.formState.productName,
          productDesc: this.formState.coreFeatures,
          competeProduct: this.formState.competitors.map(comp => 
            `${comp.name}|${comp.url}`
          ).join(','),
          website: this.formState.website || '',
          sitemap: ''
        }

        let response
        if (this.formState.productId) {
          response = await apiClient.updateProduct(this.formState.productId, formData)
        } else {
          response = await apiClient.createProduct(formData)
        }

        if (response?.code === 200) {
          if (!this.formState.productId) {
            this.successModalVisible = true
            this.formState = {
              productId: undefined,
              productName: '',
              website: '',
              coreFeatures: '',
              competitors: []
            }
            this.newCompetitor = {
              name: '',
              url: ''
            }
          } else {
            this.$notification.success({
              message: 'Product Updated',
              description: 'Product information has been updated successfully.'
            })
          }
          
          this.onboardingModalVisible = false
          setTimeout(() => {
            this.loadProductInfo()
          }, 2000)
        }
      } catch (error) {
        console.error('Operation failed:', error)
        this.$notification.error({
          message: this.formState.productId ? 'Update Failed' : 'Setup Failed',
          description: error.message || 'Failed to save product information. Please try again.'
        })
      } finally {
        this.loading = false
      }
    },
    async deleteProduct() {
      try {
        const response = await apiClient.deleteProduct(this.productInfo.productId)
        if (response?.code === 200) {
          this.$notification.success({
            message: 'Delete Successful',
            description: 'Product information has been deleted successfully'
          })
          this.productInfo = null
          this.formState = {
            productId: undefined,
            productName: '',
            website: '',
            coreFeatures: '',
            competitors: []
          }
          this.onboardingModalVisible = true
        }
      } catch (error) {
        this.$notification.error({
          message: 'Delete Failed',
          description: error.message || 'An error occurred while deleting product information'
        })
      }
    },
    handleWebsiteChange(e) {
      this.formState.website = e.target.value.trim()
    },
    handleSuccessModalClose() {
      this.successModalVisible = false
    },
    addCompetitor() {
      if (this.newCompetitor.name && this.newCompetitor.url) {
        if (this.formState.competitors.length >= 4) {
          this.$notification.warning({
            message: 'Maximum Competitors',
            description: 'You can only add up to 4 competitors.'
          });
          return;
        }
        
        this.formState.competitors.push({
          name: this.newCompetitor.name,
          url: this.newCompetitor.url.replace(/^https?:\/\//, '')
        });
        
        this.newCompetitor = {
          name: '',
          url: ''
        };
      }
    },
    removeCompetitor(index) {
      const newCompetitors = [...this.formState.competitors];
      newCompetitors.splice(index, 1);
      this.formState.competitors = newCompetitors;
    },
    async getSitemap() {
      if (!this.productInfo?.projectWebsite) {
        return;
      }
      
      try {
        this.loadingSitemap = true;
        const customerId = localStorage.getItem('currentUserId');
        const response = await apiClient.getSitemap(customerId);

        if (response?.code !== 200 || !response?.data) {
          throw new Error('Failed to get sitemap');
        }

        const urls = response.data.sitemaps?.[0]?.urlset?.urls || [];
        if (!Array.isArray(urls)) {
          this.allPages = [];
          this.sitemapData = [];
          return;
        }

        this.allPages = urls;
        this.sitemapData = this.processSitemap(urls);
        
      } catch (error) {
        console.error('Failed to get sitemap:', error);
        this.$message.error('Failed to get sitemap, please try again later');
        this.sitemapData = null;
      } finally {
        this.loadingSitemap = false;
      }
    },

    processSitemap(urls) {
      const pathMap = new Map();
      const rootPages = [];
      
      urls.forEach(url => {
        const urlObj = new URL(url.loc);
        const pathname = urlObj.pathname;
        const segments = pathname.split('/').filter(Boolean);
        
        if (segments.length === 0 || segments.length === 1) {
          rootPages.push({
            ...url,
            displayPath: urlObj.hostname + pathname
          });
        } else {
          const firstSegment = segments[0];
          if (!pathMap.has(firstSegment)) {
            pathMap.set(firstSegment, {
              pages: []
            });
          }
          pathMap.get(firstSegment).pages.push(url);
        }
      });

      // Build tree structure
      const treeNodes = Array.from(pathMap.entries()).map(([key, value]) => ({
        key,
        title: `${key} (${value.pages.length})`,
        children: value.pages.map(page => ({
          key: page.loc,
          title: new URL(page.loc).pathname
        }))
      }));

      // Add root directory node
      if (rootPages.length > 0) {
        treeNodes.unshift({
          key: 'root',
          title: `Root Directory (${rootPages.length})`,
          children: rootPages.map(page => ({
            key: page.loc,
            title: page.displayPath
          }))
        });
      }
      return treeNodes;
    },
    handleTreeSelect(selectedKeys, { node }) {
      if (selectedKeys.length === 0) {
        this.selectedPages = [];
        return;
      }

      // 获取所有实际存在的页面（过滤掉虚拟目录）
      const getAllPages = (node) => {
        let pages = [];
        
        // 只有当节点有实际的URL（不是虚拟目录）时才添加
        if (node.key && node.key.startsWith('http')) {
          pages.push({ loc: node.key });
        }
        
        // 递归处理子节点
        if (node.children) {
          node.children.forEach(child => {
            pages = pages.concat(getAllPages(child));
          });
        }
        return pages;
      };

      this.selectedPages = getAllPages(node);
    },
    showSitemapModal() {
      this.sitemapModalVisible = true;
      if (!this.sitemapData) {
        this.getSitemap();
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },
    async connectGSC() {
      if (this.isGscConnected) {
        return // 如果已经连接，不执行任何操作
      }
      
      try {
        const customerId = localStorage.getItem('currentUserId')
        const response = await apiClient.gscAuth(customerId)
        
        if (response?.code === 200 && response.redirectURL) {
          const width = 600
          const height = 600
          const left = (window.screen.width / 2) - (width / 2)
          const top = (window.screen.height / 2) - (height / 2)
          
          window.open(
            response.redirectURL,
            'Google Auth',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
          )
        }
      } catch (error) {
        this.$notification.error({
          message: 'GSC Connection Failed',
          description: error.message || 'Failed to connect to Google Search Console'
        })
      }
    },

    async handleGscCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const isGscSuccess = urlParams.get('gsc-auth-success');
      
      if (isGscSuccess === 'true') {
        // 显示 Modal 而不是 notification
        this.gscSuccessModalVisible = true;
        
        // 移除 URL 参数
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // 刷新 GSC 数据
        await this.loadGscData();
      }
    },

    async loadGscData() {
      try {
        const customerId = localStorage.getItem('currentUserId')
        const response = await apiClient.getGscSites(customerId)
        
        if (response?.code === 200 && response?.data) {
          this.gscSites = response.data
          console.log('GSC Sites loaded:', this.gscSites)
        }
      } catch (error) {
        console.error('Failed to load GSC data:', error)
      }
    },

    async checkGscStatus() {
      try {
        const customerId = localStorage.getItem('currentUserId')
        const response = await apiClient.checkGscAuth(customerId)
        
        if (response?.code === 1201) {
          this.isGscConnected = false
          this.gscSites = []
          this.gscAnalytics = null
          return
        }
        
        this.isGscConnected = response?.code === 200
        
        if (this.isGscConnected) {
          await this.loadGscData()
        } else {
          this.gscSites = []
          this.gscAnalytics = null
        }
      } catch (error) {
        console.error('Failed to check GSC status:', error)
        this.isGscConnected = false
        this.gscSites = []
        this.gscAnalytics = null
      }
    },

    startGscStatusCheck() {
      if (this.gscCheckInterval) {
        clearInterval(this.gscCheckInterval)
      }
      
      this.gscCheckInterval = setInterval(() => {
        this.checkGscStatus()
      }, 60000)
    },
    async findCompetitors() {
      if (!this.formState.coreFeatures) {
        this.$message.warning('请先输入产品描述');
        return;
      }

      this.findingCompetitors = true;
      try {
        const response = await apiClient.findCompetitors({
          description: this.formState.coreFeatures
        });

        if (response?.code === 200 && response.data) {
          // 将返回的竞品数据添加到competitors列表中
          const newCompetitors = response.data.map(comp => ({
            name: comp.name,
            url: comp.url
          }));
          
          this.formState.competitors = [...newCompetitors];
          
          this.$message.success('successfully find your competitors!');
        }
      } catch (error) {
        this.$message.error('查询竞品失败: ' + (error.message || '未知错误'));
      } finally {
        this.findingCompetitors = false;
      }
    },
    nextStep() {
      if (this.formState.productName) {
        this.currentStep++;
      }
    },
    prevStep() {
      this.currentStep--;
    },
    toggleFeatures() {
      this.showFeatures = !this.showFeatures;
    }
  }
})
</script>

<style scoped>
.required-mark {
  color: #ff4d4f;
  margin-right: 4px;
  font-family: SimSun, sans-serif;
  font-size: 14px;
}

.page-header {
  margin-bottom: 16px;
}

.gradient-text {
  background: linear-gradient(135deg, #1890FF 0%, #40A9FF 50%, #69C0FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-card {
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.earnings-banner {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid rgba(231, 241, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.banner-title {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 24px;
  font-weight: 600;
}

.earnings-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.metrics-container {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 12px;
  height: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.metric-item {
  flex: 1;
  position: relative;
  border: 1px solid rgba(124, 58, 237, 0.1);
  padding: 16px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  
  @media (max-width: 768px) {
    min-height: 180px;
  }
}

.metric-icon {
  font-size: 20px;
  margin-bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-item h4 {
  font-size: 24px;
  font-weight: 700;
  margin: 4px 0;
}

.metric-label {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}

.metric-trend {
  font-size: 12px;
  margin-top: 8px;
}

.metric-trend.positive {
  color: #10B981;
}

.trend-icon {
  font-weight: bold;
}

.no-data-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.no-data-content {
  text-align: center;
}

.no-data-icon {
  margin-bottom: 16px;
}

.no-data-title {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

.no-data-description {
  color: #6B7280;
  margin-bottom: 24px;
}

.create-button {
  background: #1890ff;
  border-color: #1890ff;
}

.create-button:hover {
  background: #4338CA;
  border-color: #4338CA;
}

:deep(.ant-col-lg-4\.8) {
  width: 20%;
  flex: 0 0 20%;
}

@media (max-width: 1400px) {
  .info-banner {
    flex-direction: column;
  }
  
  .product-info {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: 24px;
  }

  .metrics-container {
    width: 100%;
    flex-wrap: wrap;
  }

  .metric-item {
    flex: 1 1 calc(33.333% - 16px);
    min-width: 160px;
  }
}

.info-banner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 16px;
}

.product-info {
  width: 100%;
  min-width: unset;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 220px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  min-height: 24px;
}

.info-label {
  flex: 0 0 140px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.info-content {
  flex: 1;
  font-size: 14px;
  color: #111827;
  padding: 0;
  min-width: 0;

  .ant-tag {
    margin-right: 8px;   /* 添加右边距 */
    
    &:last-child {
      margin-right: 0;   /* 最后一个标签需要右边距 */
    }
  }
  
  @media (max-width: 576px) {
    width: 100%;
    padding: 0;
  }
}

.truncated-text {
  white-space: normal;
  word-break: break-word;
}

.action-buttons-container {
  display: flex;
  gap: 8px;
  padding: 16px 0;
}

.action-buttons-container .ant-btn {
  min-width: 120px;
}

.action-buttons-container .ant-btn-primary {
  background: #1890ff;
  border-color: #1890ff;
}

.action-buttons-container .ant-btn-primary:hover {
  background: #6D28D9;
  border-color: #6D28D9;
}

.metrics-container {
  width: 100%;
  display: flex;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-modal {
  .modal-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .modal-subtitle {
    color: #666;
    margin-top: 8px;
  }
  
  .setup-form {
    margin-top: 24px;
  }
  
  .submit-button {
    width: 100%;
    height: 40px;
    background: #5ba5ff;
    border-color: #5ba5ff;
    
    &:hover {
      background: #5ba5ff;
      border-color: #5ba5ff;
    }
  }
  
  &.onboarding-modal {
    .modal-title {
      text-align: center;
    }
    
    .modal-subtitle {
      text-align: center;
    }
  }
}

.delete-button {
  color: #dc2626;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.delete-button:hover {
  color: #b91c1c;
  background: rgba(220, 38, 38, 0.1);
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  
  &.onboarding-title {
    font-size: 28px;
    background: linear-gradient(135deg, #1890FF 0%, #40A9FF 50%, #69C0FF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.modal-subtitle {
  color: #666;
  margin-top: 8px;
  font-size: 16px;
}

.onboarding-modal {
  .ant-modal-content {
    background: linear-gradient(to bottom, #ffffff, #f8fafc);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
}

.onboarding-header {
  position: relative;
  padding: 16px 0 ;
  overflow: hidden;
  text-align: center;
}

.glow-effect {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 200px;
  background: radial-gradient(
    circle at center,
    rgba(79, 70, 229, 0.15) 0%,
    rgba(124, 58, 237, 0.15) 25%,
    rgba(236, 72, 153, 0.15) 50%,
    transparent 70%
  );
  filter: blur(20px);
  pointer-events: none;
}

.title-container {
  position: relative;
  z-index: 1;
}

.welcome-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #1890FF, #40A9FF);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 1px;
  box-shadow: 0 2px 10px rgba(24, 144, 255, 0.3);
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  
  &.onboarding-title {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #1890FF 0%, #40A9FF 50%, #69C0FF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
}

.modal-subtitle {
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}

.ant-form-item {
  transition: all 0.3s ease;

  margin-bottom: 12px !important;
  
  &:hover {
    transform: translateX(4px);
  }
}

/* Improve input box */
.ant-input, .ant-input-affix-wrapper {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover, &:focus {
    border-color: #1890FF;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
}

/* Improve button */
.ant-btn-primary {
  background: linear-gradient(135deg, #1890FF, #40A9FF);
  border: none;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  }
}

.generating-modal {
  :deep(.ant-modal-content) {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
}

.generating-content {
  text-align: center;
  padding: 32px;

  h3 {
    margin: 24px 0 12px;
    font-size: 20px;
    color: #1a1a1a;
  }

  p {
    color: #666;
    margin: 0;
  }
}

:deep(.ant-input-group-compact) {
  display: flex;
}

:deep(.ant-input-group-compact .ant-btn) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 32px;
  line-height: 32px;
  padding: 0 8px;
}

.coming-soon-text {
  color: #1890ff;
  font-size: 12px;
  margin-top: 4px;
  font-style: italic;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
  color: #059669;
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.1);
}

.product-info:hover {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.05);
}

@media (max-width: 1400px) {
  .product-info {
    padding: 12px;
  }
  
  .info-value {
    max-width: 140px;
  }
}

/* Title area */
.product-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.2;
}

/* Edit button */
.edit-button {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #1890ff;
  background: rgba(124, 58, 237, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.12);
  height: auto;
}

.edit-button:hover {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(124, 58, 237, 0.12));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
  color: #1890ff;
}

/* Information item container */
.info-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Information item */
.info-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  padding: 6px 8px;
  background: transparent;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.info-item:hover {
  background: rgba(124, 58, 237, 0.02);
}

.info-label {
  color: #6B7280;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.info-label::before {
  content: none;
}

.info-value {
  justify-self: flex-end;
  color: #1F2937;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  background: rgba(124, 58, 237, 0.03);
  border-radius: 4px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  background: #ECFDF5;
  color: #059669;
}


@media (max-width: 1400px) {
  .product-info {
    padding: 12px;
  }
  
  .info-value {
    max-width: 140px;
  }
}

/* Competitor tag container */
.competitors-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

/* Competitor tag */
.competitor-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 6px;
  background: rgba(124, 58, 237, 0.03);
  border-radius: 4px;
  font-size: 12px;
  color: #1890ff;
  white-space: nowrap;
}

/* Tag group style */
.tags-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

/* Add responsive style */
.pages-analytics-section {
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
    
    .section-header {
      flex-direction: column;
      gap: 16px;
      
      .header-controls {
        flex-wrap: wrap;
        width: 100%;
        
        .ant-input-search,
        .ant-select {
          width: 100% !important;
        }
      }
    }
  }
}

/* Optimize table display on small screens */
:deep(.ant-table) {
  @media (max-width: 768px) {
    .ant-table-content {
      overflow-x: auto;
    }
    
    .page-title-cell {
      .title-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .page-meta {
        flex-direction: column;
        gap: 4px;
      }
    }
    
    .metrics-cell {
      flex-direction: column;
      gap: 8px;
    }
  }
}

/* Add theme color related styles */
:deep(.ant-tag) {
  &.ant-tag-blue {
    color: #1890ff;
    background: #e6f7ff;
    border-color: #91d5ff;
  }
  
  &.ant-tag-green {
    color: #52c41a;
    background: #f6ffed;
    border-color: #b7eb8f;
  }
  
  &.ant-tag-red {
    color: #f5222d;
    background: #fff1f0;
    border-color: #ffa39e;
  }
  
  &.ant-tag-purple {
    color: #722ed1;
    background: #f9f0ff;
    border-color: #d3adf7;
  }
  
  &.ant-tag-orange {
    color: #fa8c16;
    background: #fff7e6;
    border-color: #ffd591;
  }
}

.view-controls {
  margin: 0 0 16px 0;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-start;
}

/* Add purple theme style */
:deep(.view-switcher) {
  .ant-radio-button-wrapper {
    height: 36px;
    padding: 0;
    border-color: #1890ff;
    position: relative;
    transition: all 0.3s ease;
    
    &:first-child {
      border-left-color: #1890ff;
    }
    
    &:not(:first-child)::before {
      background-color: #1890ff;
    }
    
    .switcher-content {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 16px;
      gap: 8px;
      
      .anticon {
        font-size: 16px;
      }
      
      .switcher-text {
        font-size: 14px;
        line-height: 1;
      }
    }
    
    /* Unselected state */
    color: #1890ff;
    background: white;
    
    &:hover {
      color: white;
      background: #9F67FF;
      border-color: #9F67FF;
    }
    
    /* Selected state */
    &.ant-radio-button-wrapper-checked {
      color: white;
      background: #1890ff;
      border-color: #1890ff;
      box-shadow: -1px 0 0 0 #1890ff;
      
      &:hover {
        background: #9F67FF;
        border-color: #9F67FF;
      }
      
      &::before {
        background-color: #1890ff;
      }
    }
  }
}

/* Add transition animation */
.pages-analytics-section,
.keywords-analytics-section {
  transition: all 0.3s ease;
}

/* Optimize table style */
:deep(.keywords-analytics-section) {
  .ant-table-wrapper {
    .ant-table {
      /* Increase cell padding */
      .ant-table-cell {
        padding: 16px 24px;
        
        /* Header style */
        &.ant-table-cell-fix-left {
          font-weight: 600;
        }
      }
      
      /* Ensure content is vertically centered */
      .ant-table-row {
        .ant-table-cell {
          vertical-align: middle;
        }
      }
      
      /* Optimize hover effect */
      .ant-table-row:hover {
        .ant-table-cell {
          background: #f5f3ff;
        }
      }
    }
  }
}

/* If you need to adjust table borders and dividers */
:deep(.ant-table) {
  .ant-table-cell {
    border-right: 1px solid #f0f0f0;
    
    &:last-child {
      border-right: none;
    }
  }
}

/* Add related styles */
.competitors-list {
  margin-bottom: 12px;
}

.competitor-link {
  color: #666;
}

.competitor-link:hover {
  color: #1890ff;
}

.sitemap-action {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.sitemap-modal {
  :deep(.ant-modal-content) {
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-height: 80vh;
  }
  
  :deep(.ant-modal-header) {
    border-bottom: none;
    padding: 12px 16px;
  }
  
  :deep(.ant-modal-body) {
    padding: 0;
  }
}

.sitemap-header {
  display: none;
}

.sitemap-container {
  display: flex;
  height: 500px;
}

.tree-section, .pages-section {
  flex: 0 0 50%;
  width: 50%;
  display: flex;
  flex-direction: column;
}

.tree-section {
  border-right: 1px solid rgba(24, 144, 255, 0.1);
}

.section-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
  
  .anticon {
    color: #1890FF;
  }
}

.tree-content, .pages-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.page-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-item {
  padding: 8px 12px;
  border-radius: 6px;
  background: #f9fafb;
  
  &:hover {
    background: #f3f4f6;
    transform: translateX(4px);
  }
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890FF;
  width: 100%;
  
  .page-url {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.page-date {
  display: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  gap: 16px;
  
  .anticon {
    font-size: 32px;
  }
}

:deep(.custom-tree) {
  :deep(.ant-tree-list) {
    height: auto !important;
  }
  
  :deep(.ant-tree-list-holder-inner) {
    transform: none !important;
  }
  
  /* 其他树的样式... */
}

.sitemap-section {
  margin-top: 24px;
  padding: 32px;
  border-radius: 16px;
  background: white;
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 400px;
}

.sitemap-content {
  position: relative;
  height: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.sitemap-illustration {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  border-radius: 16px;
}

.sitemap-overlay {
  position: relative;
  z-index: 1;
  padding: 40px;
  
  h3 {
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  p {
    color: #ffffff;
    margin-bottom: 32px;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .ant-btn {
    min-width: 180px;
    height: 48px;
    background: #ffffff;
    border-color: #ffffff;
    color: #1890ff;
    font-size: 16px;
    
    &:hover {
      background: #f3f4f6;
      border-color: #f3f4f6;
      color: #6D28D9;
    }
  }
}

/* 修改 card-header 样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  line-height: 1.2;
}

.edit-link {
  padding: 4px 8px;
  color: #1890FF;
  font-size: 12px;
  border-radius: 6px;
  background: rgba(24, 144, 255, 0.04);
  border: 1px solid rgba(24, 144, 255, 0.12);
  height: auto;
}

.edit-link:hover {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.12), rgba(64, 169, 255, 0.12));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
  color: #1890FF;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.delete-link {
  padding: 4px 8px;
  color: #dc2626;
  font-size: 12px;
  border-radius: 6px;
  background: rgba(220, 38, 38, 0.04);
  border: 1px solid rgba(220, 38, 38, 0.12);
  height: auto;
}

.delete-link:hover {
  background: rgba(220, 38, 38, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.site-link {
  color: #3ca9fd;
  text-decoration: none;
}

.site-link:hover {
  text-decoration: underline;
}

.metric-data {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.metric-row h4 {
  font-size: 20px;
  margin: 0;
  color: #1F2937;
}

.metric-row .metric-label {
  font-size: 12px;
  color: #6B7280;
}

.metric-item {
  position: relative;
}

.connect-gsc-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 24px;
  background: transparent !important;
  border: none;
  color: #1890FF;
  font-size: 12px;
  padding: 0 8px;
  box-shadow: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: #40A9FF;
    background: rgba(24, 144, 255, 0.05) !important;
  }
  
  &[disabled] {
    color: #10B981 !important; /* 成功色 */
    cursor: default;
    opacity: 1;
  }
  
  &:disabled:hover {
    background: transparent !important;
    transform: none;
  }
}

.connect-gsc-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.empty-state.elegant {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 48px 24px;
  text-align: center;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 12px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #E6F7FF, #BAE7FF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 16px -4px rgba(124, 58, 237, 0.1);
}

.empty-icon :deep(.anticon) {
  font-size: 28px;
  color: #1890FF;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1890FF, #40A9FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.empty-description {
  font-size: 14px;
  line-height: 1.6;
  color: #6B7280;
  max-width: 280px;
  margin-bottom: 24px;
}

.action-button {
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
  background: linear-gradient(135deg, #1890FF, #40A9FF);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
}

.action-button:active {
  transform: translateY(0);
}

.description-text {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
  color: #111827;
}

.sitemap-link {
  padding: 4px 8px;
  color: #1890FF;
  font-size: 12px;
  border-radius: 6px;
  background: rgba(24, 144, 255, 0.04);
  border: 1px solid rgba(24, 144, 255, 0.12);
  height: auto;
  white-space: nowrap;
  
  &:disabled {
    color: #666;
    cursor: default;
    background: transparent;
    border: none;
    
    &:hover {
      background: transparent;
      transform: none;
      box-shadow: none;
    }
  }
}

.sitemap-link:hover {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.12), rgba(64, 169, 255, 0.12));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
  color: #1890FF;
}

.gsc-success-modal {
  :deep(.ant-modal-content) {
    border-radius: 16px;
    padding: 32px;
    text-align: center;
  }
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 24px;
  animation: bounce 1s ease infinite;
}

.success-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 16px;
}

.success-content p {
  font-size: 16px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-content .ant-btn {
  min-width: 160px;
  height: 40px;
  font-size: 16px;
  background: linear-gradient(135deg, #1890FF, #40A9FF);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #40A9FF, #69C0FF);
    transform: translateY(-1px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.features-input-wrapper {
  position: relative;
  margin-top: 8px;
  width: 95%;  
  margin-left: auto; 
  margin-right: auto;
}

.find-competitors-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  height: 32px;
  padding: 0 16px;
  font-size: 13px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1890ff;
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  
  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }
  
  &:disabled {
    background: #f5f5f5;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
    box-shadow: none;
    
    &:hover {
      transform: none;
    }
  }
  
  .anticon {
    font-size: 14px;
  }
}

.competitors-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.competitors-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.competitors-description {
  color: #6b7280;
  font-size: 14px;
}

.competitors-description p {
  margin-bottom: 8px;
}

.competitors-description ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.competitors-description li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #374151;
}

.check-icon {
  color: #1890ff;
  font-size: 16px;
}

.competitor-tag {
  margin-bottom: 8px;
  padding: 6px 10px;
  background: white;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.competitor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.competitor-name {
  font-weight: 500;
  color: #1f2937;
}

.competitor-link {
  color: #6b7280;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-icon {
  color: #1890ff;
}

.competitor-limit-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 添加新的样式 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.product-info-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.competitors-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
}

.features-description {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 14px;
  
  .info-icon {
    color: #1890ff;
    margin-top: 3px;
  }
}

/* 修复样式问题 */
.competitors-container {
  width: 100%;
}

.competitors-header {
  width: 100%;
}

.competitors-description {
  width: 100%;
}

.competitors-description ul {
  width: 100%;
  padding-left: 0;
}

.competitors-description li {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.check-icon {
  flex-shrink: 0;
  margin-top: 4px;
}

.competitor-tag {
  width: 100%;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.competitor-info {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.competitor-name {
  font-weight: 500;
  color: #1f2937;
}

.competitor-link {
  color: #6b7280;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-icon {
  color: #1890ff;
}

.competitor-limit-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 添加新的样式 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.product-info-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.competitors-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
}

.features-description {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 14px;
  width: 100%;
}

/* 修改输入框相关样式 */
.input-group-wrapper {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
}

.competitor-name-input {
  flex: 2;  /* 占据更多空间 */
}

.competitor-url-input {
  flex: 3;  /* 网址输入框稍长一些 */
}

.add-button {
  width: 100px;  /* 固定添加按钮宽度 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.input-icon {
  color: #1890ff;
}

/* 确保所有父级容器都占满宽度 */
.competitors-section {
  width: 100%;
}

.competitors-container {
  width: 100%;
}

.add-competitor {
  width: 100%;
}

.input-group-wrapper {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
}

.competitor-name-input,
.competitor-url-input,
.add-button {
  height: 32px;
}

.competitor-name-input {
  flex: 2;
}

.competitor-url-input {
  flex: 3;
}

.add-button {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* 覆盖 Ant Design 的默认样式 */
:deep(.ant-input-affix-wrapper) {
  width: 100%;
}

:deep(.ant-form-item-control-input) {
  width: 100%;
}

:deep(.ant-form-item-control-input-content) {
  width: 100%;
}

/* 新增和修改的样式 */
.header-top {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.competitors-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
}

.competitors-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.competitor-tag {
  margin: 0;
  padding: 4px 8px;
  background: white;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.competitor-info {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.competitor-name {
  font-weight: 500;
  color: #1f2937;
}

.competitor-link {
  color: #6b7280;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.setup-steps {
  margin-bottom: 24px;
  padding: 0 40px;
}

.step-content {
  min-height: 200px;
}

.basic-info-section {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.compact-input {
  max-width: 100%;
}

.steps-action {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px;
}

/* 调整弹窗高度 */
:deep(.ant-modal-body) {
  max-height: 600px;
  overflow-y: auto;
}

/* 优化步骤条样式 */
:deep(.ant-steps-item-title) {
  font-size: 14px;
}

:deep(.ant-steps-item-active .ant-steps-item-title) {
  color: #1890ff;
}

/* 添加新的样式 */
.features-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.is-expanded {
  transform: rotate(180deg);
}

.features-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.features-wrapper.expanded {
  max-height: 500px; /* 根据实际内容调整 */
}

/* 修改按钮容器样式 */
.steps-action {
  margin-top: 24px;
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  
  .ant-btn {
    min-width: 120px;  /* 统一按钮最小宽度 */
    height: 40px;      /* 统一按钮高度 */
    font-size: 14px;   /* 统一字体大小 */
    display: flex;     /* 使用flex布局确保内容居中 */
    align-items: center;
    justify-content: center;
    padding: 0 24px;   /* 统一内边距 */
    
    &.submit-button {
      background: #1890ff;
      border-color: #1890ff;
      
      &:hover {
        background: #40a9ff;
        border-color: #40a9ff;
      }
    }
  }
}

/* 移除之前的 submit-button margin */
.submit-button {
  margin-left: 0;  /* 移除之前的左边距 */
}

/* 修改竞品标签容器样式 */
.competitors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

/* 修改竞品标签样式 */
.competitor-tag {
  display: inline-flex;
  max-width: fit-content; /* 根据内容自适应宽度 */
  background: white;
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 4px;
  padding: 4px 8px;
}

/* 修改竞品信息样式 */
.competitor-info {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.competitor-name {
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
}

.competitor-link {
  color: #6b7280;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 200px; /* 限制链接最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

