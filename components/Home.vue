<template>
  <a-layout style="height: 100vh;">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="220"
      :collapsed-width="80"
      style="background: linear-gradient(180deg, #F0F7FF 0%, #E6F0FF 100%); display: flex; flex-direction: column; box-shadow: 4px 0 10px rgba(0, 0, 0, 0.08);"
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
        <a-avatar
          :style="avatarStyle"
          class="user-avatar"
          @click="showUserModal"
        >
          {{ getCurrentUserInitials(selectedUser) }}
        </a-avatar>
        <div class="user-name">{{ getCurrentUserName(selectedUser) }}</div>
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
          <span>Logout</span>
        </a-button>
      </div>
    </a-layout-sider>
    <!-- 内容区域 -->
    <a-layout-content style="padding: 20px; overflow: auto;">
      <router-view />
    </a-layout-content>
  </a-layout>
  
  <!-- 添加用户切换模态框 -->
  <a-modal
    v-model:open="isUserModalVisible"
    title="Switch User"
    @ok="switchUser"
    @cancel="hideUserModal"
    :okButtonProps="{ 
      style: { 
        background: '#1890ff',
        borderColor: '#1890ff'
      } 
    }"
    okText="Switch"
    cancelText="Cancel"
  >
    <a-radio-group v-model:value="tempSelectedUser" class="user-radio-group">
      <div v-for="user in users" :key="user.userID" class="user-option">
        <a-radio :value="user.userID">
          <div class="user-radio-content">
            <a-avatar :style="getAvatarStyle(user)" class="user-option-avatar">
              {{ getInitials(user.name) }}
            </a-avatar>
            <span class="user-option-name">{{ user.name }}</span>
          </div>
        </a-radio>
      </div>
    </a-radio-group>
  </a-modal>
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
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar {
  cursor: pointer;
  background: linear-gradient(135deg, #4096ff, #1677ff) !important;
  font-size: 28px;
  transition: all 0.3s ease;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.user-name {
  margin-top: 16px;
  font-weight: 600;
  font-size: 12px;
  color: #2D2B4A;
}

.user-role {
  margin-top: 4px;
  font-size: 13px;
  color: #4A4875;
}

/* 菜单部分 */
.menu-section {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.custom-menu {
  border: none;
}

:deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 8px 0;
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
  color: #4A4875;
}

:deep(.ant-menu-item:hover) {
  background: rgba(22, 119, 255, 0.15);
  color: #1677ff;
}

.nav-item--active {
  background: #1677ff !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.25);
}

/* 用户切换模态框样式 */
:deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.ant-select-selector) {
  border-radius: 8px !important;
  height: 40px !important;
  padding: 4px 12px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 32px !important;
}

.user-radio-group {
  width: 100%;
}

.user-option {
  padding: 8px 0;
  transition: all 0.3s ease;
}

.user-option:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.user-radio-content {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.user-option-avatar {
  width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  margin-right: 12px;
  background: linear-gradient(135deg, #1890ff, #1890ff);
  color: white;
}

.user-option-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-radio-wrapper) {
  width: 100%;
  display: flex;
  align-items: center;
}

:deep(.ant-radio) {
  align-self: center;
  margin-top: 0;
}

:deep(.ant-radio-wrapper > span:last-child) {
  flex: 1;
  padding-right: 8px;
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

/* 调整折叠时的样式 */
:deep(.ant-layout-sider.ant-layout-sider-collapsed) {
  .user-name,
  .user-role {
    display: none;
  }
  
  .user-avatar {
    width: 50px !important;
    height: 50px !important;
    font-size: 20px !important;
  }
}

/* 更新折叠触发器样式 */
.collapse-trigger {
  position: absolute;
  right: -12px;
  top: 20px;
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

/* 为每个���单项添加延动画 */
.onboarding-modal {
  :deep(.ant-form-item:nth-child(1)) { animation-delay: 0.1s; }
  :deep(.ant-form-item:nth-child(2)) { animation-delay: 0.2s; }
  :deep(.ant-form-item:nth-child(3)) { animation-delay: 0.3s; }
  :deep(.ant-form-item:nth-child(4)) { animation-delay: 0.4s; }
}

/* 添加新的底部操作区样式 */
.bottom-actions {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: transparent;
}

.bottom-action-btn {
  width: 100%;
  text-align: left;
  color: #4A4875;
  padding: 8px 12px;
  height: auto;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.bottom-action-btn:hover {
  color: #1677ff;
  background: rgba(22, 119, 255, 0.15);
}

.bottom-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 8px 0;
}

/* 折叠时的样式调整 */
:deep(.ant-layout-sider.ant-layout-sider-collapsed) {
  .bottom-action-btn span:not(.menu-icon) {
    display: none;
  }
  
  .bottom-action-btn {
    padding: 8px;
    text-align: center;
  }
}

/* 确保图标和文字对齐 */
.bottom-action-btn .menu-icon,
.bottom-action-btn .anticon {
  font-size: 18px;
}
</style>

<script>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import TaskManagementPage from './TaskManagementPage.vue';
import DashboardPage from './DashboardPage.vue';
import KeywordsPlanningPage from './KeywordsPlanningPage.vue';
import AssetsPage from './AssetsPage.vue';
import { LogoutOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export default {
  name: 'Home',
  components: {
    TaskManagementPage,
    DashboardPage,
    KeywordsPlanningPage,
    AssetsPage,
    LogoutOutlined,
    RightOutlined,
    LeftOutlined
  },
  setup() {
    const router = useRouter();
    
    const handleLogout = () => {
      localStorage.clear();
      router.push('/login');
      message.success('Logout successful');
    };

    // 检查登录状态
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('intelickIsLoggedIn');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!isLoggedIn || !accessToken) {
        handleLogout();
      }
    };

    onMounted(() => {
      checkAuth();
    });

    return { handleLogout };
  },
  data() {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const currentUserId = localStorage.getItem('currentUserId');
    return {
      mainNavItems: [
        { title: 'Home', view: 'DashboardPage' },
        { title: 'Assets', view: 'AssetsPage' },
        { title: 'Keywords Planning', view: 'KeywordsPlanningPage' },
        { title: 'Task Management', view: 'TaskManagementPage' },
        { title: 'Settings', view: 'SettingsPage' },
      ],
      currentView: this.getViewFromRoute(),
      isUserModalVisible: false,
      selectedUser: currentUserId || (storedCustomers.length > 0 ? storedCustomers[0].customerId : ''),
      tempSelectedUser: currentUserId || (storedCustomers.length > 0 ? storedCustomers[0].customerId : ''),
      users: storedCustomers.map(customer => ({
        userID: customer.customerId,
        name: customer.userName
      })),
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
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
    showUserModal() {
      if (this.users.length > 1) {
        this.tempSelectedUser = this.selectedUser;
        this.isUserModalVisible = true;
      }
    },
    hideUserModal() {
      this.tempSelectedUser = this.selectedUser;
      this.isUserModalVisible = false;
    },
    switchUser() {
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const newCurrentCustomer = customers.find(customer => customer.customerId === this.tempSelectedUser);
      
      if (newCurrentCustomer) {
        this.selectedUser = this.tempSelectedUser;
        
        localStorage.setItem('currentCustomer', JSON.stringify(newCurrentCustomer));
        localStorage.setItem('currentUserId', this.selectedUser);
        
        this.isUserModalVisible = false;
        
        location.reload();
        
        this.$notification.success({
          message: 'Success',
          description: `Switched to ${newCurrentCustomer.userName}`,
          duration: 1
        });
      } else {
        this.$notification.error({
          message: 'Error',
          description: 'Selected user not found'
        });
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
          localStorage.clear();
          this.$router.push('/login');
          message.success('Logout successful');
        }
      });
    },

    getCurrentUserName(userId) {
      const user = this.users.find(u => u.userID === userId);
      return user ? user.name : '';
    },

    getCurrentUserInitials(userId) {
      const name = this.getCurrentUserName(userId);
      return name ? name.charAt(0).toUpperCase() : '';
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
  }
};
</script>
