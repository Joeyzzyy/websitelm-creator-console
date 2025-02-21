<template>
  <a-layout style="height: 100vh;">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="180"
      :collapsed-width="80"
      style="background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%); display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);"
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
        <div class="logo-container" v-if="!collapsed">
          <img src="../assets/images/websitelm-logo.png" alt="WebsiteLM Logo" class="logo-image">
        </div>
        <div class="logo-container" v-else>
          <img src="../assets/images/websitelm-logo-single.png" alt="WebsiteLM Icon" class="logo-image-small">
        </div>
        <div class="welcome-text" v-if="!collapsed">
          Welcome back!
        </div>
        <div v-if="!collapsed" class="user-info-container">
          <div class="user-name">{{ userDisplayName }}</div>
        </div>
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
                <component :is="getMenuIcon(item.view)" />
              </span>
            </template>
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </div>
      <!-- 底部操作区 -->
      <div class="bottom-actions">
        <!-- Account Setting 按钮 -->
        <a-button 
          type="link" 
          class="bottom-action-btn account-btn" 
          @click="handleAccountClick"
        >
          <user-outlined />
          <span v-if="!collapsed">Account Setting</span>
        </a-button>
        
        <!-- View Guide 按钮 -->
        <a-button 
          type="link" 
          class="bottom-action-btn guide-btn"
          @click="startTour"
          data-tour="restart-tour"
        >
          <QuestionCircleOutlined style="color: #1890ff" />
          <span v-if="!collapsed">View Guide</span>
        </a-button>
        
        <!-- 添加分隔线 -->
        <div class="bottom-divider"></div>
        
        <!-- Logout 按钮 -->
        <a-button type="link" class="bottom-action-btn logout-btn" @click="handleLogout">
          <logout-outlined style="color: #ff4d4f" />
          <span v-if="!collapsed">Logout</span>
        </a-button>
      </div>
    </a-layout-sider>
    <!-- 内容区域 -->
    <a-layout-content style="padding: 20px; overflow: auto;">
      <router-view @open-guide-mode="startInteractiveGuide" />
    </a-layout-content>
  </a-layout>

  <!-- 添加 Onboarding 组件 -->
  <onboarding-tour 
    ref="onboardingTour"
    @complete="handleOnboardingComplete"
  />

  <!-- 添加选择模式的对话框 -->
  <a-modal
    v-model:visible="guideModeVisible"
    title="Choose Guide Mode"
    :footer="null"
    class="guide-mode-modal"
  >
    <div class="guide-mode-options">
      <div class="guide-mode-card" @click="startStepByStepTour">
        <div class="mode-icon">
          <svg viewBox="0 0 24 24" class="tech-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                  fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3>Interactive Guide</h3>
        <p>Step-by-step walkthrough of key features</p>
      </div>
      
      <div class="guide-mode-card" @click="showTutorialLibrary">
        <div class="mode-icon">
          <svg viewBox="0 0 24 24" class="tech-icon">
            <path d="M4 6h16M4 12h16M4 18h16" 
                  fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3>Tutorial Library</h3>
        <p>Browse and select specific features to learn</p>
      </div>
    </div>
  </a-modal>

  <!-- 添加教程库对话框 -->
  <a-modal
    v-model:visible="tutorialLibraryVisible"
    title="Tutorial Library"
    :footer="null"
    class="tutorial-library-modal"
    width="1000px"
  >
    <div class="max-w-full mx-auto px-4 max-h-[600px] overflow-y-auto custom-scrollbar">
      <div v-for="(group, category) in groupedTutorials" :key="category" class="mb-8">
        <div class="flex items-center mb-4 group">
          <div class="relative">
            <h3 class="text-xs font-medium text-[#1890ff] px-3 py-1.5 bg-gradient-to-r from-[#1890ff]/10 to-white rounded-lg border border-[#1890ff]/20 shadow-sm backdrop-blur-sm">
              {{ category }}
            </h3>
            <div class="absolute inset-0 bg-[#1890ff]/10 blur-lg rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="ml-4 flex-grow">
            <div class="h-px bg-gradient-to-r from-[#1890ff]/20 via-gray-200 to-transparent"></div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="tutorial in group" 
            :key="tutorial.id"
            class="group flex flex-col bg-white rounded-lg border border-gray-200 hover:border-[#1890ff]/20 hover:shadow-lg transition-all duration-200 cursor-pointer"
            @click="playTutorial(tutorial)"
          >
            <div class="flex flex-col flex-grow p-4">
              <h4 class="text-sm font-semibold text-gray-900 group-hover:text-[#1890ff] transition-colors duration-200 line-clamp-2 mb-2">
                {{ tutorial.title }}
              </h4>
              
              <p v-if="tutorial.description" class="text-xs text-gray-600 line-clamp-2 mb-3">
                {{ tutorial.description }}
              </p>
              
              <div class="read-more mt-auto text-xs text-[#1890ff] font-medium flex items-center gap-1">
                Read Documentation 
                <span class="transform transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
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

:deep(.ant-menu) {
  background: transparent;
  color: #64748B;
  border-inline-end: none !important;
}

:deep(.ant-menu-item) {
  color: #64748B;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  border-inline-end: none !important;
  margin-inline-end: 0 !important;
}

:deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.9) !important;
  color: #6366F1 !important;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

:deep(.ant-menu-item-selected) {
  background: white !important;
  color: #6366F1 !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15) !important;
}

.menu-icon {
  color: #64748B;
}

:deep(.ant-menu-item:hover .menu-icon) {
  color: #6366F1;
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
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

.collapse-trigger:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
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
  color: #6366F1 !important;
}

.logout-section {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.logout-btn {
  color: #ff4d4f !important;
  background: rgba(255, 77, 79, 0.05) !important;
  border: 1px solid rgba(255, 77, 79, 0.1) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
}

.logout-btn:hover {
  color: #ff4d4f !important;
  background: rgba(255, 77, 79, 0.1) !important;
  border-color: rgba(255, 77, 79, 0.2) !important;
}

/* 确保折叠时图标居中 */
:deep(.ant-layout-sider-collapsed) .logout-btn {
  justify-content: center !important;
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
  background: linear-gradient(to bottom, 
    rgba(248, 250, 252, 0) 0%,
    rgba(248, 250, 252, 0.95) 50%,
    #F8FAFC 100%
  );
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bottom-action-btn {
  width: 100%;
  text-align: left;
  color: #64748B;
  padding: 8px 12px;
  height: auto;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.bottom-action-btn:hover {
  background: white;
  color: #6366F1;
  border-color: rgba(99, 102, 241, 0.2);
}

/* 添加分隔线 */
.bottom-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.06),
    rgba(0, 0, 0, 0.02)
  );
  margin: 8px 0;
}

/* 确保图标和文字对齐 */
.bottom-action-btn .menu-icon,
.bottom-action-btn .anticon {
  font-size: 18px;
}

.welcome-text {
  font-size: 16px;
  font-weight: 500;
  margin: 12px 0;
  background: linear-gradient(135deg, #1890ff 0%, #6366F1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 0.5px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 8px;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 4px;
}

.user-email {
  font-size: 13px;
  color: #64748B;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
}

/* 选择模式对话框样式 */
.guide-mode-modal {
  :deep(.ant-modal-content) {
    background: linear-gradient(165deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 12px;
  }
}

.guide-mode-options {
  display: flex;
  gap: 20px;
  padding: 20px 0;
}

.guide-mode-card {
  flex: 1;
  padding: 24px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.guide-mode-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.15);
  border-color: #1890ff;
}

.mode-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 16px;
  color: #1890ff;
}

.guide-mode-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.guide-mode-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* 教程库样式 */
.tutorial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px 0;
  position: relative;
}

.tutorial-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  padding: 20px;
  height: 100%;
}

.tutorial-step-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
}

/* 移除所有与图片相关的样式 */
.tutorial-thumbnail,
.tech-overlay,
.thumbnail-image {
  display: none;
}

/* 调整卡片内容布局 */
.tutorial-info {
  padding: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 更新阅读更多链接样式 */
.read-more {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 添加悬停效果 */
.tutorial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  border-color: #1890ff;
}

/* 移除图片加载相关的方法 */
.tutorial-card img {
  display: none;
}

/* 添加自定义样式 */
.tutorial-library-modal {
  :deep(.ant-modal-body) {
    padding: 16px;
    max-height: calc(90vh - 110px); /* 减去标题和padding的高度 */
    overflow-y: hidden; /* 防止双滚动条 */
  }
  
  :deep(.ant-modal-content) {
    max-height: 90vh;
  }
  
  /* 自定义滚动条样式 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(24, 144, 255, 0.3) transparent;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(24, 144, 255, 0.3);
      border-radius: 3px;
      
      &:hover {
        background-color: rgba(24, 144, 255, 0.5);
      }
    }
  }
}

/* 确保模态框在小屏幕上也有合适的高度 */
@media (max-height: 800px) {
  .tutorial-library-modal {
    :deep(.ant-modal-body) {
      max-height: calc(80vh - 110px);
    }
    
    :deep(.ant-modal-content) {
      max-height: 80vh;
    }
  }
}

/* 更新底部按钮样式 */
.account-btn {
  background: rgba(24, 144, 255, 0.1) !important;
  border: 1px solid rgba(24, 144, 255, 0.2) !important;
}

.account-btn:hover {
  background: rgba(24, 144, 255, 0.15) !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
}

.guide-btn {
  background: rgba(24, 144, 255, 0.05) !important;
  border: 1px solid rgba(24, 144, 255, 0.15) !important;
}

.guide-btn:hover {
  background: rgba(24, 144, 255, 0.1) !important;
  border-color: rgba(24, 144, 255, 0.25) !important;
}

/* 更新logo相关样式 */
.logo-container {
  margin-bottom: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  max-width: 140px;
  height: auto;
  object-fit: contain;
}

.logo-image-small {
  max-width: 40px;
  height: auto;
  object-fit: contain;
}
</style>

<script>
import { useRouter } from 'vue-router';
import TaskManagementPage from './TaskManagementPage.vue';
import DashboardPage from './DashboardPage.vue';
import KeywordsPlanningPage from './KeywordsPlanningPage.vue';
import AssetsPage from './AssetsPage.vue';
import { LogoutOutlined, RightOutlined, LeftOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import OnboardingTour from './OnboardingTour.vue'
import { tutorialConfig } from '../config/tutorials'
import apiClient from '../api/api'
import {
  DashboardOutlined,
  SearchOutlined,
  FileTextOutlined,
  PictureOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

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
    OnboardingTour,
    DashboardOutlined,
    SearchOutlined,
    FileTextOutlined,
    PictureOutlined,
    SettingOutlined,
    UserOutlined
  },
  setup() {
    const router = useRouter();
    
    // 检查登录状态和套餐状态
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('intelickIsLoggedIn');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!isLoggedIn || !accessToken) {
        // 处理未登录状态
        localStorage.removeItem('authToken');
        localStorage.removeItem('intelickIsLoggedIn');
        localStorage.removeItem('currentCustomer');
        localStorage.removeItem('currentCustomerId');
        router.push('/login');
        return false;
      }
      
      // 检查套餐状态
      try {
        const packageResponse = await apiClient.getCustomerPackage();
        if (packageResponse?.data?.customerPackageStatus !== 1) {
          router.push('/subscription');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Failed to check subscription status:', error);
        return false;
      }
    };

    return { checkAuth };
  },
  data() {
    const currentCustomerId = localStorage.getItem('currentCustomerId');
    const currentCustomerEmail = localStorage.getItem('currentCustomerEmail');
    return {
      mainNavItems: [
        { title: 'Dashboard', view: 'DashboardPage' },
        { title: 'Keywords', view: 'KeywordsPlanningPage' },
        { title: 'Pages', view: 'TaskManagementPage' },
        { title: 'Assets', view: 'AssetsPage' },
      ],
      currentView: this.getViewFromRoute(),
      selectedUser: currentCustomerId,
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      currentCustomerEmail: currentCustomerEmail,
      guideModeVisible: false,
      tutorialLibraryVisible: false,
      tutorials: tutorialConfig,
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
    },
    // 将教程按tag分组
    groupedTutorials() {
      const groups = {};
      this.tutorials.forEach((tutorial, index) => {
        const category = tutorial.tag || 'General';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push({
          ...tutorial,
          badge: `${groups[category].length + 1}`, // 添加序号作为badge
          id: tutorial.targetUrl // 使用targetUrl作为唯一标识
        });
      });
      return groups;
    },
    userDisplayName() {
      return this.currentCustomerEmail 
        ? this.currentCustomerEmail.split('@')[0]
        : 'User';
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
        'AccountPage': '/account',
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
        '/account': 'AccountPage',
      };
      return routeToView[this.$route.path] || 'DashboardPage';
    },

    startTour() {
      this.guideModeVisible = true;
    },

    async checkAndStartOnboarding() {
      try {
        const response = await apiClient.getProductsByCustomerId()
        if (response?.data && !response?.data.onboarding && this.$refs.onboardingTour) {
          console.log('Starting onboarding tour...');
          this.$nextTick(() => {
            this.$refs.onboardingTour.start();
          });
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    },

    handleOnboardingComplete() {
      // 只更新后端状态
      const customerId = localStorage.getItem('currentCustomerId');
      apiClient.updateOnboardingStatus(customerId, true).then(() => {
        this.$message.success('Tour completed! You can always restart the tour using the button in the bottom left corner.');
      });
    },

    // 开始分步引导
    startStepByStepTour() {
      this.guideModeVisible = false
      this.$refs.onboardingTour.start()
    },

    // 显示教程库
    showTutorialLibrary() {
      this.guideModeVisible = false
      this.tutorialLibraryVisible = true
    },

    // 播放选中的教程
    playTutorial(tutorial) {
      window.open(tutorial.targetUrl, '_blank');
    },

    // 新增直接开始交互式引导的方法
    startInteractiveGuide() {
      this.guideModeVisible = false; // 确保选择对话框是关闭的
      this.startStepByStepTour(); // 直接开始交互式引导
    },

    // 添加初始化方法
    async initializeAfterLogin() {
      try {
        // 1. 检查套餐状态
        const packageResponse = await apiClient.getCustomerPackage();
        const packageStatus = packageResponse?.data?.customerPackageStatus;
        
        if (packageStatus === 0) {
          this.$message.warning('No subscription found. Please purchase a plan.');
          this.$router.push('/subscription');
          return;
        } else if (packageStatus === 2) {
          this.$message.warning('Your subscription has expired. Please renew your plan.');
          this.$router.push('/subscription');
          return;
        } else if (packageStatus !== 1) {
          this.$message.error('Subscription status is abnormal. Please contact customer service.');
          this.$router.push('/subscription');
          return;
        }

        // 2. 获取用户信息
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse?.data) {
          localStorage.setItem('currentCustomerEmail', userResponse.data.email);
          localStorage.setItem('currentCustomerId', userResponse.data.id);
        }

        // 3. 获取用户配置
        const configResponse = await apiClient.getUserConfig();
        if (configResponse?.data) {
          this.collapsed = configResponse.data.sidebarCollapsed ?? false;
        }

        // 4. 检查引导状态
        await this.checkAndStartOnboarding();

        // 5. 初始化其他必要数据
        await this.initializeUserData();

      } catch (error) {
        console.error('初始化失败:', error);
        this.$message.error('系统初始化失败，请刷新页面重试');
      }
    },

    // 添加获取图标的方法
    getMenuIcon(view) {
      const iconMap = {
        'DashboardPage': DashboardOutlined,
        'KeywordsPlanningPage': SearchOutlined,
        'TaskManagementPage': FileTextOutlined,
        'AssetsPage': PictureOutlined,
        'AccountPage': UserOutlined,
      };
      return iconMap[view];
    },

    handleAccountClick() {
      this.currentView = 'AccountPage';
      this.$router.push('/account');
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
        '/account': 'AccountPage',
      };
      this.currentView = routeToView[to.path] || 'DashboardPage';
    }
  },
  async mounted() {
    const authResult = await this.checkAuth();
    if (!authResult) {
      return; // 如果认证或套餐检查失败，直接返回
    }
    
    // 如果是从登录页面跳转来的，执行初始化
    if (this.$route.query.fromLogin) {
      await this.initializeAfterLogin();
    }
    // 否则只检查引导状态
    else {
      await this.checkAndStartOnboarding();
    }
  }
};
</script>
