<template>
  <a-layout style="height: 100vh;">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="180"
      :collapsed-width="80"
      style="background: linear-gradient(165deg, #111827 0%, #1F2937 100%); display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);"
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
    width="800px"
  >
    <div class="tutorial-grid">
      <div 
        v-for="(tutorial, index) in tutorials" 
        :key="index"
        class="tutorial-card"
        @click="playTutorial(tutorial)"
      >
        <div class="tutorial-step-badge">
          {{ tutorial.badge }}
        </div>
        <div class="tutorial-thumbnail">
          <div class="tech-overlay"></div>
          <img :src="tutorial.imageUrl" :alt="tutorial.title" class="thumbnail-image">
        </div>
        <div class="tutorial-info">
          <h4>{{ tutorial.title }}</h4>
          <p>{{ tutorial.description }}</p>
          <div class="read-more">Read Documentation →</div>
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%
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

:deep(.ant-menu-item) {
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  border-radius: 12px;
  margin: 8px 0;
  border-left: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.menu-icon {
  font-size: 18px;
  margin-right: 8px;
  opacity: 0.95;
}

:deep(.ant-menu) {
  background: transparent;
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0.05) 100%) !important;
  color: #1890ff !important;
  border-left-color: #1890ff !important;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.1);
}

:deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fff !important;
  border-left-color: rgba(24, 144, 255, 0.5);
}

.nav-item--active {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0.05) 100%) !important;
  color: #1890ff !important;
  border-left-color: #1890ff !important;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.1);
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}

.collapse-trigger:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
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
  background: linear-gradient(to bottom, 
    rgba(17, 24, 39, 0) 0%,
    rgba(17, 24, 39, 0.95) 50%,
    #111827 100%
  );
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.bottom-action-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

/* 添加分隔线 */
.bottom-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.02)
  );
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
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
  background: rgba(24, 144, 255, 0.1);
  border-radius: 20px;
  display: inline-block;
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease;
  border: 1px solid rgba(24, 144, 255, 0.2);
  backdrop-filter: blur(8px);
}

.user-name-display:hover {
  transform: translateY(-2px);
  background: rgba(24, 144, 255, 0.1);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
}

.tutorial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  border-color: #1890ff;
}

.tutorial-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  background: #f5f5f5;
  flex-shrink: 0;
}

.tech-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(24, 144, 255, 0.05),
    rgba(24, 144, 255, 0.1)
  );
  z-index: 1;
}

.tutorial-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.tutorial-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
}

.tutorial-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  flex-grow: 1;
}

.read-more {
  margin-top: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tutorial-card:hover .read-more {
  color: #40a9ff;
  transform: translateX(4px);
}

/* 添加缩略图图片样式 */
.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 0;
}

/* 教程卡片中添加步骤标记样式 */
.tutorial-card {
  /* ... 现有样式 ... */
  position: relative;
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

/* 为第一个教程添加特殊样式 */
.tutorial-card:first-child {
  border: 2px solid #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.tutorial-card:first-child .tutorial-step-badge {
  background: linear-gradient(135deg, #52c41a, #389e0d);
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
import { tutorialConfig } from '../config/tutorials'
import apiClient from '../api/api'

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
        { title: 'Planner', view: 'KeywordsPlanningPage' },
        { title: 'Pages', view: 'TaskManagementPage' },
        { title: 'Assets', view: 'AssetsPage' },
        { title: 'Settings', view: 'SettingsPage' },
      ],
      currentView: this.getViewFromRoute(),
      selectedUser: currentCustomerId,
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      currentCustomerEmail: currentCustomerEmail,
      guideModeVisible: false,
      tutorialLibraryVisible: false,
      tutorials: Object.values(tutorialConfig).map((tutorial, index) => ({
        step: index + 1,
        title: tutorial.title,
        description: tutorial.content,
        imageUrl: tutorial.imageUrl,
        docsLink: tutorial.docsLink,
        badge: tutorial.badge,
        features: tutorial.features
      }))
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
      this.guideModeVisible = true;
    },

    async checkAndStartOnboarding() {
      try {
        // 只检查后端的 onboarding 状态
        const response = await apiClient.getProductsByCustomerId()
        
        console.log('Product Info:', response?.data);
        console.log('Onboarding Status:', response?.data?.onboarding);
        
        // 只有当后端明确返回 onboarding 为 false 时才显示导览
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
      // 实现教程播放逻辑
      window.open(tutorial.docsLink, '_blank'); // 打开文章链接
    },

    // 新增直接开始交互式引导的方法
    startInteractiveGuide() {
      this.guideModeVisible = false; // 确保选择对话框是关闭的
      this.startStepByStepTour(); // 直接开始交互式引导
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
