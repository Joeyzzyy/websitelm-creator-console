<template>
  <a-layout style="height: 100vh;">
    <a-layout-sider
      :width="320"
      :collapsed-width="150"
      style="background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%); display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);"
    >
      <!-- 头像部分 -->
      <div class="user-profile-section">
        <div class="logo-container">
          <img src="../assets/images/websitelm-logo.png" alt="WebsiteLM Logo" class="logo-image">
        </div>
        <div class="welcome-text">
          Welcome back!
        </div>
        <div class="user-info-container">
          <div class="user-name">{{ userDisplayName }}</div>
        </div>
      </div>
      <!-- 菜单部分 -->
      <div class="menu-section">
        <!-- 添加AI Autopilot按钮到菜单部分顶部 -->
        <div class="autopilot-container">
          <a-button 
            class="ai-autopilot-btn" 
            type="primary" 
            @click="openAIAutopilot"
          >
            <span class="btn-text">
              <thunderbolt-filled />
              AI Autopilot
            </span>
            <span class="ai-badge">Recommended</span>
          </a-button>
        </div>
        
        <a-menu
          mode="inline"
          :selectedKeys="[currentView, currentKeywordsStep]"
          :openKeys="openKeys"
          @click="handleMenuClick"
          @openChange="handleOpenChange"
          class="custom-menu"
        >
          <!-- Analytics -->
          <a-menu-item
            key="AnalyticsPage"
            data-tour="analytics"
            :class="{ 'nav-item--active': currentView === 'AnalyticsPage' }"
          >
            <template #icon>
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" class="gold-icon">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </template>
            Analytics
          </a-menu-item>

          <!-- Keywords和Pages组合 - AI Writer -->
          <a-sub-menu key="KeywordsMenu">
            <template #icon>
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" class="gold-icon">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </template>
            <template #title>
              <div class="menu-item-content">
                <span>Keywords & Outlines</span>
              </div>
            </template>
            
            <!-- 添加子菜单项 -->
            <a-menu-item 
              key="KeywordsSelection" 
              @click="navigateToKeywordsStep('selection')"
            >
              <div class="menu-item-content">
                <span>Keywords Selection</span>
              </div>
            </a-menu-item>
            
            <a-menu-item 
              key="OutlineGeneration" 
              @click="navigateToKeywordsStep('outline')"
            >
              <div class="menu-item-content">
                <span>Outline Generation</span>
              </div>
            </a-menu-item>
          </a-sub-menu>

          <!-- 将Pages独立出来 -->
          <a-menu-item
            key="TaskManagementPage"
            data-tour="pages"
            :class="{ 'nav-item--active': currentView === 'TaskManagementPage' }"
          >
            <template #icon>
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" class="gold-icon">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </template>
            <div class="menu-item-content">
              <span>Pages</span>
            </div>
          </a-menu-item>

          <!-- 简化Settings部分，去掉底框和小标签 -->
          <a-sub-menu key="SettingsMenu">
            <template #icon>
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" class="gold-icon">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </template>
            <template #title>
              <div class="menu-item-content">
                <span>Settings</span>
              </div>
            </template>
            
            <!-- 产品信息菜单项 -->
            <a-menu-item
              key="DashboardPage"
              data-tour="dashboard"
              :class="{ 'nav-item--active': currentView === 'DashboardPage' }"
            >
              <div class="menu-item-content">
                <span>Product Information</span>
              </div>
            </a-menu-item>
            
            <!-- 产品资产菜单项 -->
            <a-menu-item
              key="AssetsPage"
              data-tour="assets"
              :class="{ 'nav-item--active': currentView === 'AssetsPage' }"
            >
              <div class="menu-item-content">
                <span>Product Assets</span>
              </div>
            </a-menu-item>
            
            <!-- 账户菜单项 -->
            <a-menu-item
              key="AccountPage"
              data-tour="account"
              :class="{ 'nav-item--active': currentView === 'AccountPage' }"
              @click="handleAccountClick"
            >
              <div class="menu-item-content">
                <span>Account</span>
              </div>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <!-- 底部操作区 -->
      <div class="bottom-actions">
        <!-- Discord 按钮 -->
        <a-button 
          type="link" 
          class="bottom-action-btn discord-btn"
          href="https://discord.gg/2vCGh39ym"
          target="_blank"
        >
          <svg viewBox="0 0 24 24" fill="none" class="discord-icon" width="16" height="16">
            <path d="M9.555 9.23c-.74 0-1.324.624-1.324 1.385 0 .757.6 1.385 1.324 1.385.738 0 1.323-.628 1.323-1.385.015-.761-.585-1.385-1.323-1.385z" fill="currentColor"/>
            <path d="M20.207 0H3.79C2.247 0 1 1.244 1 2.784v15.855c0 1.54 1.247 2.784 2.79 2.784h13.627l-.636-2.22 1.534 1.425 1.451 1.342L22 24V2.784C22 1.244 20.753 0 19.21 0h-.003zM14.692 15.68s-.431-.516-.79-.973c1.57-.443 2.168-1.425 2.168-1.425-.491.323-.958.55-1.378.707-.599.251-1.174.419-1.738.516-.862.162-1.65.118-2.324-.01a9.723 9.723 0 01-1.653-.478 6.69 6.69 0 01-.832-.387c-.034-.02-.068-.034-.102-.052-.024-.043-.02-.02-.063-.03-.275-.15-.43-.251-.43-.251s.58.962 2.114 1.419c-.36.457-.806.994-.806.994-2.656-.084-3.667-1.824-3.667-1.824 0-3.866 1.738-7 1.738-7 1.738-1.303 3.392-1.266 3.392-1.266l.122.147c-2.173.626-3.175 1.579-3.175 1.579s.264-.144.71-.347c1.287-.566 2.31-.72 2.73-.757.07-.01.13-.02.198-.02a9.91 9.91 0 012.383-.024c1.12.132 2.324.464 3.55 1.146 0 0-.958-.909-3.02-1.535l.17-.193s1.654-.037 3.392 1.266c0 0 1.738 3.134 1.738 7 0 0-1.025 1.74-3.682 1.824z" fill="currentColor"/>
          </svg>
          <span v-if="!collapsed">Join Discord</span>
        </a-button>
        
        <div class="bottom-divider"></div>
        
        <!-- Logout 按钮 -->
        <a-button type="link" class="bottom-action-btn logout-btn" @click="handleLogout">
          <logout-outlined style="color: #ff4d4f" />
          <span v-if="!collapsed">Logout</span>
        </a-button>
      </div>
    </a-layout-sider>
    <!-- 内容区域 -->
    <a-layout-content style="padding: 8px; overflow: auto;">
      <router-view @open-guide-mode="startInteractiveGuide" />
    </a-layout-content>
  </a-layout>
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
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 8px;
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
  padding: 0 16px;
  overflow: visible; /* 改为可见，不使用滚动条 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 添加居中对齐 */
}

.custom-menu {
  border: none;
  width: 100%; /* 确保菜单宽度占满容器 */
}

:deep(.ant-menu) {
  background: transparent;
  color: #64748B;
  border-inline-end: none !important;
  max-height: none;
  overflow: visible;
  width: 100%; /* 确保菜单宽度占满容器 */
}

:deep(.ant-menu-item) {
  background: white !important;
  border: 1px solid rgba(24, 144, 255, 0.15) !important;
  margin: 8px 0 !important; /* 统一所有菜单项的间距 */
  transition: all 0.3s ease !important;
  border-radius: 8px !important;
  height: 36px !important;
  line-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  width: 100% !important; /* 确保菜单项宽度占满 */
}

/* 确保子菜单项缩进，但其他菜单项居中 */
:deep(.ant-menu-sub .ant-menu-item) {
  padding-left: 24px !important; /* 子菜单项缩进 */
}

/* 确保Settings菜单项与其他菜单项样式一致 */
:deep(.ant-menu-submenu-title) {
  background: white !important;
  border: 1px solid rgba(24, 144, 255, 0.15) !important;
  margin: 8px 0 !important; /* 统一所有菜单项的间距 */
  transition: all 0.3s ease !important;
  border-radius: 8px !important;
  height: 36px !important;
  line-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.ant-menu-submenu-title:hover) {
  background: rgba(24, 144, 255, 0.05) !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
  transform: translateX(4px);
}

/* 确保工作流组内的内容也居中 */
.workflow-group {
  width: 100%;
}

/* 调整菜单分隔线宽度 */
.menu-divider {
  display: none; /* 完全移除分隔线 */
}

/* 确保底部操作区域也居中 */
.bottom-actions {
  width: 100%;
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
  padding: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  flex-shrink: 0; /* 防止底部区域被压缩 */
}

.bottom-action-btn {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  justify-content: flex-start !important;
  height: 32px !important;
  padding: 0 12px !important;
  border-radius: 6px !important;
}

.bottom-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 6px 0;
}

.discord-btn {
  color: #5865f2 !important;
  background: rgba(88, 101, 242, 0.05) !important;
  border: 1px solid rgba(88, 101, 242, 0.1) !important;
}

.discord-btn:hover {
  color: #5865f2 !important;
  background: rgba(88, 101, 242, 0.1) !important;
  border-color: rgba(88, 101, 242, 0.2) !important;
  transform: translateY(-1px);
}

.discord-icon {
  color: #5865f2;
}

/* 确保折叠时图标居中 */
:deep(.ant-layout-sider-collapsed) .bottom-action-btn {
  justify-content: center !important;
}

.welcome-text {
  font-size: 14px;
  font-weight: 500;
  margin: 4px 0;
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
  gap: 2px;
  width: 100%;
  padding: 0 8px;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 0;
}

.logo-container {
  margin-bottom: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  max-width: 120px;
  height: auto;
  object-fit: contain;
}

.logo-image-small {
  max-width: 40px;
  height: auto;
  object-fit: contain;
}

/* 添加分隔线样式 */
.menu-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.06),
    rgba(0, 0, 0, 0.02)
  );
  margin: 12px 0;
}

/* 确保所有顶级菜单项样式一致 */
:deep(.ant-menu-submenu) {
  width: 100% !important;
  margin: 0 !important; /* 移除子菜单的外部边距 */
  padding: 0 !important; /* 移除子菜单的内部边距 */
}

:deep(.ant-menu-submenu-inline) {
  margin: 0 !important; /* 确保内联子菜单没有额外边距 */
}

:deep(.ant-menu-submenu-title) {
  background: white !important;
  border: 1px solid rgba(24, 144, 255, 0.15) !important;
  margin: 8px 0 !important; /* 统一所有菜单项的间距 */
  transition: all 0.3s ease !important;
  border-radius: 8px !important;
  height: 36px !important;
  line-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  width: 100% !important;
}

/* 确保子菜单内容区域没有额外边距 */
:deep(.ant-menu-submenu-inline > .ant-menu-submenu-content) {
  margin: 0 !important;
  padding: 0 !important;
}

/* 确保所有按钮文本对齐 */
.bottom-action-btn > span:nth-child(2) {
  margin-left: 8px !important;
}

/* 子菜单样式 */
:deep(.ant-menu-sub) {
  background: transparent !important;
  padding-left: 24px !important; /* 增加缩进 */
}

:deep(.ant-menu-sub .ant-menu-item) {
  padding: 8px 12px !important;
  height: auto !important;
  line-height: 1.5 !important;
  margin: 8px 0 !important; /* 统一所有菜单项的间距 */
  font-size: 13px !important; /* 减小字体大小 */
}

/* 确保子菜单项的图标样式一致 */
:deep(.ant-menu-sub .menu-item-content) {
  font-size: 13px;
  color: #4B5563;
}

/* 子菜单项悬停效果 */
:deep(.ant-menu-sub .ant-menu-item:hover) {
  background: rgba(24, 144, 255, 0.05);
}

/* 子菜单项选中效果 */
:deep(.ant-menu-sub .ant-menu-item-selected) {
  background: rgba(24, 144, 255, 0.1) !important;
  color: #1890ff !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
}

/* 添加顶级菜单项选中效果 */
:deep(.ant-menu-item-selected) {
  background: rgba(24, 144, 255, 0.1) !important;
  color: #1890ff !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
  font-weight: 500 !important;
}

/* 添加子菜单标题选中效果 */
:deep(.ant-menu-submenu-selected > .ant-menu-submenu-title) {
  color: #1890ff !important;
  background: rgba(24, 144, 255, 0.05) !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
}

/* 菜单项悬停效果 */
:deep(.ant-menu-item:hover) {
  background: rgba(24, 144, 255, 0.05) !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
  transform: translateX(4px);
}

.autopilot-container {
  width: 100%;
  padding: 0 16px;
  margin-bottom: 12px; 
  display: flex;
  justify-content: center;
}

.ai-autopilot-btn {
  width: 85%;
  height: 36px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible !important;
  margin: 8px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
    animation: subtle-rotate 8s linear infinite;
    z-index: 0;
  }
  
  .btn-text {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }
}

.ai-autopilot-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.ai-autopilot-btn:active {
  transform: translateY(0);
}

.ai-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #22c55e;
  color: white;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
  animation: bounce 1s infinite;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}

@keyframes subtle-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* 确保所有可能的父容器都不会裁剪内容 */
:deep(.ant-btn) {
  overflow: visible !important;
}

</style>

<script>
import { useRouter } from 'vue-router';
import TaskManagementPage from './TaskManagementPage.vue';
import DashboardPage from './DashboardPage.vue';
import KeywordsPlanningPage from './KeywordsPlanningPage.vue';
import AssetsPage from './AssetsPage.vue';
import { LogoutOutlined, RightOutlined, LeftOutlined, QuestionCircleOutlined, UserOutlined, ThunderboltFilled } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import apiClient from '../api/api'
import {
  DashboardOutlined,
  SearchOutlined,
  FileTextOutlined,
  PictureOutlined,
  SettingOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue'
import { DownOutlined } from '@ant-design/icons-vue'

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
    DashboardOutlined,
    SearchOutlined,
    FileTextOutlined,
    PictureOutlined,
    SettingOutlined,
    UserOutlined,
    DownOutlined,
    ThunderboltFilled
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
        { title: 'Analytics', view: 'AnalyticsPage' },
        { title: 'Keywords', view: 'KeywordsPlanningPage' },
        { title: 'Pages', view: 'TaskManagementPage' },
        { title: 'Assets', view: 'AssetsPage' },
      ],
      currentView: this.getViewFromRoute(),
      currentKeywordsStep: '',
      selectedUser: currentCustomerId,
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      currentCustomerEmail: currentCustomerEmail,
      guideModeVisible: false,
      tutorialLibraryVisible: false,
      openKeys: ['KeywordsMenu'],
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
        'AssetsPage': '/product-assets',
        'AccountPage': '/account',
        'AnalyticsPage': '/analytics',
      };
      
      // 如果点击的不是Keywords相关的菜单项，清除currentKeywordsStep
      if (key !== 'KeywordsSelection' && key !== 'OutlineGeneration') {
        this.currentKeywordsStep = '';
      }
      
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
          localStorage.removeItem('accessToken');
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
        '/product-assets': 'AssetsPage',
        '/account': 'AccountPage',
        '/analytics': 'AnalyticsPage',
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
        'AnalyticsPage': BarChartOutlined,
      };
      return iconMap[view];
    },

    handleAccountClick() {
      this.currentView = 'AccountPage';
      this.$router.push('/account');
    },

    navigateToKeywordsStep(step) {
      // 首先导航到Keywords Planning页面，并通过查询参数传递要显示的步骤
      this.$router.push({
        path: '/keywords',
        query: { step: step }  // 通过URL查询参数传递步骤信息
      });
      
      // 设置当前视图
      this.currentView = 'KeywordsPlanningPage';
      
      // 设置当前关键词步骤
      this.currentKeywordsStep = step === 'selection' ? 'KeywordsSelection' : 'OutlineGeneration';
      
      // 使用更长的延时确保页面完全加载
      setTimeout(() => {
        // 直接调用暴露在$root上的方法
        if (this.$root && this.$root.$switchKeywordsStep) {
          this.$root.$switchKeywordsStep(step);
        }
        
        if (step === 'outline') {
          const outlineTab = document.querySelector('[data-tab="outline"]');
          if (outlineTab) {
            outlineTab.click();
          }
        }
      }, 800);  // 增加延时以确保组件已完全加载
    },

    handleOpenChange(openKeys) {
      this.openKeys = openKeys;
    },

    openAIAutopilot() {
      // 使用路径导航到关键词规划页面
      this.$router.push('/keywords');
      
      // 使用setTimeout确保页面加载完成后再触发AI自动选择
      setTimeout(() => {
        if (this.$root && this.$root.$switchKeywordsStep) {
          this.$root.$switchKeywordsStep('outline');
        }
        
        // 然后显示AI选择确认对话框
        setTimeout(() => {
          if (this.$root && this.$root.$showAISelectionConfirm) {
            this.$root.$showAISelectionConfirm();
          }
          
        }, 500); // 增加延迟时间
      }, 800); // 增加延迟时间
    },
  },
  watch: {
    '$route'(to) {
      const routeToView = {
        '/dashboard': 'DashboardPage',
        '/knowledge': 'KnowledgeBasePage',
        '/keywords': 'KeywordsPlanningPage',
        '/task-management': 'TaskManagementPage',
        '/product-assets': 'AssetsPage',
        '/account': 'AccountPage',
        '/analytics': 'AnalyticsPage',
      };
      this.currentView = routeToView[to.path] || 'DashboardPage';
      
      // 如果不是keywords页面，清除currentKeywordsStep
      if (to.path !== '/keywords') {
        this.currentKeywordsStep = '';
      }
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
