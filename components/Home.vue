<template>
  <a-layout style="height: 100vh;">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="180"
      :collapsed-width="80"
      style="background: linear-gradient(165deg, #1a1f35 0%, #131b2e 100%); display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);"
    >
      <!-- 添加折叠按钮 -->
      <div class="collapse-trigger" @click="toggleCollapse">
        <a-button type="text" class="collapse-icon-btn">
          <template v-if="collapsed">
            <RightOutlined style="color: #1890ff;" />
          </template>
          <template v-else>
            <LeftOutlined style="color: #1890ff;" />
          </template>
        </a-button>
      </div>
      <!-- 头像部分 -->
      <div class="user-profile-section">
        <div class="welcome-text" v-if="!collapsed">Welcome back!</div>
        <div v-if="!collapsed" class="user-name-display">
          {{ currentCustomerEmail }}
        </div>
        <a-tooltip v-else :title="currentCustomerEmail" placement="right">
          <div class="user-avatar">
            {{ getEmailInitial(currentCustomerEmail) }}
          </div>
        </a-tooltip>
      </div>
      <!-- 菜单部分 -->
      <div class="menu-section">
        <a-menu
          mode="inline"
          :selectedKeys="[currentView]"
          @click="handleMenuClick"
          class="custom-menu"
        >
          <a-menu-item
            v-for="item in mainNavItems"
            :key="item.view"
            :data-tour="item.view.toLowerCase()"
            :class="{ 'nav-item--active': currentView === item.view }"
          >
            <template #icon>
              <span class="menu-icon">
                {{ item.view === 'TaskManagementPage' ? '📝' : 
                   item.view === 'DashboardPage' ? '📊' :
                   item.view === 'KeywordsPlanningPage' ? '🔍' :
                   item.view === 'KnowledgeBasePage' ? '📚' :
                   item.view === 'AssetsPage' ? '🏷️' :
                   '🔗' }}
              </span>
            </template>
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </div>
      <!-- 底部操作区 -->
      <div class="bottom-actions">
        <!-- Logout 按钮 -->
        <a-button type="link" class="bottom-action-btn" @click="handleLogout">
          <LogoutOutlined />
          <span v-if="!collapsed">Logout</span>
        </a-button>
        
        <!-- 添加分隔线 -->
        <div class="bottom-divider"></div>
        
        <!-- View Guide 按钮 -->
        <a-button 
          type="link" 
          class="bottom-action-btn view-guide-btn"
          @click="startTour"
          data-tour="restart-tour"
        >
          <QuestionCircleOutlined style="color: #1890ff" />
          <span v-if="!collapsed">View Guide</span>
        </a-button>
      </div>
    </a-layout-sider>
    <!-- 内容区域 -->
    <a-layout-content style="padding: 20px; overflow: auto;">
      <router-view />
    </a-layout-content>
  </a-layout>

  <!-- 添加 Onboarding 组件 -->
  <onboarding-tour 
    ref="onboardingTour"
    @complete="handleOnboardingComplete"
  />
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}

.ant-layout-content {
  overflow: hidden !important;
}

/* 用户资料部分 */
.user-profile-section {
  text-align: center;
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
}

/* 菜单部分 */
.menu-section {
  flex: 1;
  padding: 24px 16px;
  padding-bottom: 120px;
  overflow-y: auto;
}

.custom-menu {
  border: none;
}

:deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 12px 0;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #4A4875;
  font-size: 12px;
}

.menu-icon {
  font-size: 18px;
  margin-right: 8px;
}

:deep(.ant-menu) {
  background: transparent;
}

:deep(.ant-menu-item) {
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  margin: 8px 0;
}

:deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
}

.nav-item--active {
  background: linear-gradient(135deg, #1677ff 0%, #1890ff 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(22, 119, 255, 0.3);
}

:deep(.ant-btn-primary:hover) {
  background: #6366F1 !important;
  border-color: #6366F1 !important;
}

:deep(.ant-btn-primary:active) {
  background: #4338CA !important;
  border-color: #4338CA !important;
}

/* 添加过渡效果 */
:deep(.ant-layout-sider) {
  transition: all 0.3s ease !important;
}

/* 更新折叠触发器样式 */
.collapse-trigger {
  position: absolute;
  right: -12px;
  top: 32px;
  z-index: 10;
  background: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;
}

.collapse-trigger:hover {
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.collapse-icon-btn {
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-icon-btn:hover .anticon {
  color: #3B82F6 !important;
}

.logout-section {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.logout-btn {
  width: 100%;
  text-align: left;
  color: #4A4875;
  padding: 8px 12px;
  height: auto;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-size: 12px;
}

.logout-btn:hover {
  color: #6357FF;
  background: rgba(99, 87, 255, 0.15);
}

:deep(.ant-layout-sider.ant-layout-sider-collapsed) {
  .logout-btn span {
    display: none;
  }
  
  .logout-btn {
    padding: 8px;
    text-align: center;
  }
}

.setup-form {
  padding: 0 12px;
}

:deep(.ant-input:not(textarea)),
:deep(.ant-select-selector) {
  min-height: 40px !important;
  height: 40px !important;
  padding: 4px 11px !important;
}

:deep(.ant-input-textarea) {
  height: auto !important;
}

:deep(.ant-input-textarea textarea.ant-input) {
  height: auto !important;
  min-height: 180px !important;
  padding: 12px !important;
  resize: vertical !important;
  line-height: 1.5;
}

:deep(.ant-select-multiple .ant-select-selector) {
  background-color: white !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 4px 8px !important;
  display: flex;
  align-items: center;
}

:deep(.ant-select-multiple .ant-select-selection-search) {
  height: 32px !important;
  line-height: 32px !important;
  margin-inline-start: 0 !important;
  margin-inline-end: 0 !important;
}

:deep(.ant-select-multiple .ant-select-selection-item) {
  height: 24px !important;
  line-height: 22px !important;
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}

:deep(.ant-input),
:deep(.ant-select-selector) {
  border-radius: 8px !important;
  border: 1px solid #e5e7eb !important;
  transition: all 0.3s ease !important;
}

:deep(.ant-input:hover),
:deep(.ant-input:focus),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1) !important;
}

.submit-area {
  text-align: right;
  margin-top: 24px;
}

.submit-button {
  height: 40px;
  background: #1677ff !important;
  border-color: #1677ff !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 0 24px;
}

.submit-button:hover {
  background: #4096ff !important;
  border-color: #4096ff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

/* 添加样式以匹配其他输入框的样式 */
:deep(.ant-input-group-compact) {
  display: flex;
  align-items: stretch;
}

:deep(.ant-select-selector) {
  border-radius: 8px 0 0 8px !important;
  border-right: 0 !important;
  background-color: #f5f5f5 !important;
}

:deep(.ant-input-group-compact .ant-input) {
  border-radius: 0 8px 8px 0 !important;
}

:deep(.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  color: rgba(0, 0, 0, 0.85) !important;
  background-color: #f5f5f5 !important;
  padding-right: 8px !important;
}

:deep(.ant-select-arrow) {
  display: none !important;
}

:deep(.ant-select-selection-selected-value) {
  padding-right: 0 !important;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

/* 自定义关闭按钮样式 */
:deep(.ant-modal-close) {
  color: #6B7280;
  transition: all 0.3s ease;
}

:deep(.ant-modal-close:hover) {
  color: #374151;
  background: rgba(0, 0, 0, 0.04);
}

/* 新增样式 */
.onboarding-modal {
  :deep(.ant-modal-content) {
    background: linear-gradient(145deg, #ffffff 0%, #f8f7ff 100%);
  }
}

.onboarding-title {
  font-size: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #1890ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 24px;
}

.onboarding-submit {
  background: linear-gradient(135deg, #1890ff 0%, #1890ff 100%) !important;
  border: none !important;
  height: 48px !important;
  font-size: 16px !important;
  width: 100% !important;
}

.onboarding-submit:hover {
  background: linear-gradient(135deg, #4338CA 0%, #6D28D9 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 87, 255, 0.25);
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

.onboarding-modal {
  :deep(.ant-input),
  :deep(.ant-select-selector),
  :deep(.ant-input-group-addon) {
    border-width: 2px !important;
  }
  
  :deep(.ant-input:focus),
  :deep(.ant-select-focused .ant-select-selector) {
    border-color: #6357FF !important;
    box-shadow: 0 0 0 3px rgba(99, 87, 255, 0.15) !important;
  }
}

/* 动画效果 */
.onboarding-modal {
  :deep(.ant-form-item) {
    animation: slideUp 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每个单项添加延动画 */
.onboarding-modal {
  :deep(.ant-form-item:nth-child(1)) { animation-delay: 0.1s; }
  :deep(.ant-form-item:nth-child(2)) { animation-delay: 0.2s; }
  :deep(.ant-form-item:nth-child(3)) { animation-delay: 0.3s; }
  :deep(.ant-form-item:nth-child(4)) { animation-delay: 0.4s; }
}

/* 更新底部操作区样式 */
.bottom-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to bottom, rgba(26, 31, 53, 0), #1a1f35);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bottom-action-btn {
  width: 100%;
  text-align: left;
  color: rgba(255, 255, 255, 0.85);
  padding: 8px 12px;
  height: auto;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

/* 添加分隔线 */
.bottom-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 8px 0;
}

/* 确保图标和文字对齐 */
.bottom-action-btn .menu-icon,
.bottom-action-btn .anticon {
  font-size: 18px;
}

.user-profile-section {
  text-align: center;
  padding: 32px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
  position: relative;
}

.welcome-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  animation: fadeIn 0.5s ease;
}

.user-name-display {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  margin-top: 4px;
  padding: 8px 16px;
  background: rgba(22, 119, 255, 0.15);
  border-radius: 20px;
  display: inline-block;
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease;
}

.user-name-display:hover {
  transform: translateY(-2px);
  background: rgba(22, 119, 255, 0.15);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.1);
}

/* 添加动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 适配折叠状态 */
:deep(.ant-layout-sider.ant-layout-sider-collapsed) {
  .welcome-text {
    display: none;
  }
  
  .user-name-display {
    font-size: 14px;
    padding: 4px 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60px;
  }
}

/* 添加响应式阴影效果 */
.user-profile-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, 
    rgba(22, 119, 255, 0.1), 
    rgba(22, 119, 255, 0.3), 
    rgba(22, 119, 255, 0.1)
  );
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.25);
}

/* 调整折叠状态下的样式 */
:deep(.ant-layout-sider.ant-layout-sider-collapsed) {
  .user-profile-section {
    padding: 16px;
  }
  
  .welcome-text {
    display: none;
  }
}

/* 更新 View Guide 按钮样式 */
.bottom-action-btn.view-guide-btn {
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  animation: pulseGlow 2s infinite;
  position: relative;
  overflow: hidden;
  color: rgb(216, 180, 254) !important;
}

.bottom-action-btn.view-guide-btn:hover {
  background: rgba(168, 85, 247, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
}

/* 更新脉冲发光动画 */
@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.6);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(168, 85, 247, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
  }
}

/* 更新光晕效果 */
.bottom-action-btn.view-guide-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(216, 180, 254, 0) 0%,
    rgba(216, 180, 254, 0.2) 50%,
    rgba(216, 180, 254, 0) 100%
  );
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

/* 更新按钮中的图标颜色 */
.bottom-action-btn.view-guide-btn .anticon {
  color: rgb(216, 180, 254) !important;
  font-size: 16px;
}

/* 添加渐变边框效果 */
.bottom-action-btn.view-guide-btn::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 8px;
  background: linear-gradient(45deg, 
    rgba(236, 72, 153, 0.4),  /* 粉色 */
    rgba(168, 85, 247, 0.4),  /* 紫色 */
    rgba(236, 72, 153, 0.4)   /* 粉色 */
  );
  z-index: -1;
  animation: borderGlow 3s infinite;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}
</style>

<script>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import TaskManagementPage from './TaskManagementPage.vue';
import DashboardPage from './DashboardPage.vue';
import KeywordsPlanningPage from './KeywordsPlanningPage.vue';
import AssetsPage from './AssetsPage.vue';
import { LogoutOutlined, RightOutlined, LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import OnboardingTour from './OnboardingTour.vue'

export default {
  name: 'Home',
  components: {
    TaskManagementPage,
    DashboardPage,
    KeywordsPlanningPage,
    AssetsPage,
    LogoutOutlined,
    RightOutlined,
    LeftOutlined,
    QuestionCircleOutlined,
    OnboardingTour
  },
  setup() {
    const router = useRouter();
    
    // 检查登录状态
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('intelickIsLoggedIn');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!isLoggedIn || !accessToken) {
        // 直接在这里处理登出逻辑
        localStorage.removeItem('authToken');
        localStorage.removeItem('intelickIsLoggedIn');
        localStorage.removeItem('currentCustomer');
        localStorage.removeItem('currentCustomerId');
        router.push('/login');
      }
    };

    onMounted(() => {
      checkAuth();
    });
  },
  data() {
    const currentCustomerId = localStorage.getItem('currentCustomerId');
    const currentCustomerEmail = localStorage.getItem('currentCustomerEmail');
    return {
      mainNavItems: [
        { title: 'Home', view: 'DashboardPage' },
        { title: 'Assets', view: 'AssetsPage' },
        { title: 'Planner', view: 'KeywordsPlanningPage' },
        { title: 'Tasks', view: 'TaskManagementPage' },
        { title: 'Settings', view: 'SettingsPage' },
      ],
      currentView: this.getViewFromRoute(),
      selectedUser: currentCustomerId,
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      currentCustomerEmail: currentCustomerEmail,
    };
  },
  computed: {
    avatarStyle() {
      return {
        background: `linear-gradient(135deg, #1890ff, #1890ff)`,
        fontSize: '28px',
        border: '4px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '50%',
        width: '72px',
        height: '72px'
      };
    }
  },
  methods: {
    handleMenuClick({ key }) {
      const routeMap = {
        'DashboardPage': '/dashboard',
        'KnowledgeBasePage': '/knowledge',
        'KeywordsPlanningPage': '/keywords',
        'TaskManagementPage': '/task-management',
        'AssetsPage': '/assets',
        'SettingsPage': '/settings',
      };
      
      if (routeMap[key]) {
        this.$router.push(routeMap[key]);
      }
    },

    handleLogout() {
      Modal.confirm({
        title: 'Confirm Logout',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Are you sure you want to logout from the system?',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('intelickIsLoggedIn');
          localStorage.removeItem('currentCustomer');
          localStorage.removeItem('currentCustomerId');
          this.$router.push('/login');
          message.success('Logout successful');
        }
      });
    },

    getAvatarStyle(user) {
      return {
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    },
    
    getInitials(name) {
      return name ? name.charAt(0).toUpperCase() : '';
    },

    toggleCollapse() {
      this.collapsed = !this.collapsed;
      localStorage.setItem('sidebarCollapsed', this.collapsed);
    },

    getViewFromRoute() {
      const routeToView = {
        '/dashboard': 'DashboardPage',
        '/knowledge': 'KnowledgeBasePage',
        '/keywords': 'KeywordsPlanningPage',
        '/task-management': 'TaskManagementPage',
        '/assets': 'AssetsPage',
        '/settings': 'SettingsPage',
      };
      return routeToView[this.$route.path] || 'DashboardPage';
    },

    getEmailInitial(email) {
      return email ? email.charAt(0).toUpperCase() : '?';
    },

    startTour() {
      this.$refs.onboardingTour.start()
    },

    handleOnboardingComplete() {
      this.$message.success('Tour completed! You can always restart the tour using the button in the bottom left corner.')
    },

    checkAndStartOnboarding() {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted')
      if (!onboardingCompleted) {
        this.$nextTick(() => {
          this.$refs.onboardingTour.start()
        })
      }
    }
  },
  watch: {
    '$route'(to) {
      const routeToView = {
        '/dashboard': 'DashboardPage',
        '/knowledge': 'KnowledgeBasePage',
        '/keywords': 'KeywordsPlanningPage',
        '/task-management': 'TaskManagementPage',
        '/assets': 'AssetsPage',
        '/settings': 'SettingsPage',
      };
      this.currentView = routeToView[to.path] || 'DashboardPage';
    }
  },
  mounted() {
    this.checkAndStartOnboarding()
  }
};
</script>
