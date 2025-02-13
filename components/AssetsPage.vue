<template>
  <page-layout>
    <smart-banner
      :theme="bannerTheme"
      title="Media Asset Management"
      description="Efficiently manage and organize your media assets with our powerful asset management system."
      :badges="[
        { text: 'Image Library' },
        { text: 'Video Storage' },
        { text: 'Asset Analytics' }
      ]"
    />

    <a-spin 
      :spinning="loading"
      class="centered-spin"
    >

      <template v-if="domainConfigured">
        <a-tabs 
          class="main-tabs"
          v-model:activeKey="activeTab"
        >
          <template #rightExtra>
            <a-button 
              v-if="activeTab === 'images' || activeTab === 'videos'" 
              type="primary" 
              class="ai-analyze-btn" 
              @click="showUploadModal"
            >
              <span class="btn-content">
                <span>Upload {{ activeTab === 'images' ? 'Images' : 'Videos' }}</span>
                <upload-outlined />
              </span>
            </a-button>
            <a-button 
              v-else-if="activeTab === 'links' || activeTab === 'button-links'"
              type="primary"
              class="ai-analyze-btn" 
              @click="showAddLinkModal"
            >
              <span class="btn-content">
                <span>Add {{ activeTab === 'links' ? 'Link' : 'Button Link' }}</span>
                
              </span>
            </a-button>
            <a-button
              v-else-if="activeTab === 'knowledge' && !processingKnowledge && Object.keys(groupedArticles).length > 0"
              type="primary"
              class="ai-analyze-btn"
              :loading="regrabLoading"
              @click="showRegrabConfirm"
            >
              <span class="btn-content">
                <sync-outlined :spin="regrabLoading" />
                <span>Regrab Info</span>
              </span>
            </a-button>
          </template>

          <a-tab-pane key="knowledge">
          <template #tab>
            <span class="knowledge-tab">Knowledge Base</span>
          </template>
          </a-tab-pane>
          <a-tab-pane key="images">
            <template #tab>
              <span class="images-tab">Images</span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="videos">
            <template #tab>
              <span class="videos-tab">Videos</span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="links">
            <template #tab>
              <span class="links-tab">Internal Links</span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="button-links">
            <template #tab>
              <span class="button-links-tab">Button Links</span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="header" tab="Header">
            <template #tab>
              <span class="header-tab">Header</span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="footer" tab="Footer" />
          <a-tab-pane key="favicon" tab="Favicon">
            <template #tab>
              <span class="favicon-tab">Favicon</span>
            </template>
          </a-tab-pane>
        </a-tabs>
        <div class="page-content">
          <div class="assets-content">
            <div class="controls-header">
                <div class="controls-right">
                  <slot name="controls"></slot>
                </div>
            </div>
              <!-- Media Asset Content -->
            <template v-if="activeTab === 'images'">
              <a-spin :spinning="imagesLoading">
                <div class="assets-grid" v-if="!imagesLoading">
                  <template v-if="images.length > 0">
                    <a-row :gutter="[16, 16]">
                      <a-col 
                        v-for="image in images" 
                        :key="image.id" 
                        :xs="24" 
                        :sm="12" 
                        :md="8" 
                        :lg="6"
                      >
                        <div class="asset-card">
                          <div class="asset-preview" @click="previewAsset(image)">
                            <img 
                              :src="image.url" 
                              :alt="image.name"
                            >
                            <div class="asset-overlay">
                              <eye-outlined class="preview-icon" />
                            </div>
                            <div class="asset-actions">
                              <a-popconfirm
                                title="Are you sure you want to delete this file?"
                                ok-text="Delete"
                                cancel-text="Cancel"
                                @confirm="deleteAsset(image)"
                                ok-type="primary"
                                :ok-button-props="{
                                  style: {
                                    background: 'linear-gradient(135deg, #1890ff, #3B82F6)',
                                    border: 'none'
                                  }
                                }"
                              >
                                <a-button 
                                  type="link" 
                                  danger 
                                  class="delete-btn"
                                  @click.stop
                                >
                                  <delete-outlined />
                                </a-button>
                              </a-popconfirm>
                            </div>
                          </div>
                          <div class="asset-info">
                            <div class="asset-name-container">
                              <h4 class="asset-name" :title="image.name">{{ image.name }}</h4>
                              <a-button type="link" class="edit-btn" @click="startEditing(image)">
                                <edit-outlined />
                              </a-button>
                            </div>
                            <p class="asset-description" :title="image.description">
                              {{ image.description || 'No description' }}
                            </p>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                    
                    <div class="pagination-wrapper">
                      <a-pagination
                        :current="imagesPagination.currentPage"
                        :total="imagesPagination.total"
                        :pageSize="imagesPagination.pageSize"
                        show-size-changer
                        @change="handleImagesPageChange"
                        @showSizeChange="handleImagesSizeChange"
                      />
                    </div>
                  </template>
                  
                  <div v-else class="empty-state">
                    <h3 class="empty-state-title">Your creative canvas awaits! 🎨</h3>
                    <p class="empty-state-description">
                      Ready to bring your brand to life? Upload your first image and let's make something amazing together.
                    </p>
                    <a-button 
                      type="primary" 
                      class="upload-btn-empty" 
                      @click="showUploadModal"
                    >
                      Upload Images
                    </a-button>
                  </div>
                </div>
              </a-spin>
            </template>
            <template v-else-if="activeTab === 'videos'">
              <a-spin :spinning="videosLoading">
                <div class="assets-grid" v-if="!videosLoading">
                  <template v-if="videos.length > 0">
                    <a-row :gutter="[16, 16]">
                      <a-col 
                        v-for="video in videos" 
                        :key="video.id" 
                        :xs="24" 
                        :sm="12" 
                        :md="8" 
                        :lg="6"
                      >
                        <div class="asset-card">
                          <div class="asset-preview" @click="previewAsset(video)">
                            <video 
                              :src="video.url" 
                              controls
                              preload="metadata"
                            >
                              <p>Your browser doesn't support HTML5 video.</p>
                            </video>
                            <div class="asset-overlay">
                              <eye-outlined class="preview-icon" />
                            </div>
                            <div class="asset-actions">
                              <a-popconfirm
                                title="Are you sure you want to delete this file?"
                                ok-text="Delete"
                                cancel-text="Cancel"
                                @confirm="deleteAsset(video)"
                                ok-type="primary"
                                :ok-button-props="{
                                  style: {
                                    background: 'linear-gradient(135deg, #1890ff, #3B82F6)',
                                    border: 'none'
                                  }
                                }"
                              >
                                <a-button 
                                  type="link" 
                                  danger 
                                  class="delete-btn"
                                  @click.stop
                                >
                                  <delete-outlined />
                                </a-button>
                              </a-popconfirm>
                            </div>
                          </div>
                          <div class="asset-info">
                            <div class="asset-name-container">
                              <h4 class="asset-name" :title="video.name">{{ video.name }}</h4>
                              <a-button type="link" class="edit-btn" @click="startEditing(video)">
                                <edit-outlined />
                              </a-button>
                            </div>
                            <p class="asset-description" :title="video.description">
                              {{ video.description || 'No description' }}
                            </p>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                    
                    <div class="pagination-wrapper">
                      <a-pagination
                        :current="videosPagination.currentPage"
                        :total="videosPagination.total"
                        :pageSize="videosPagination.pageSize"
                        show-size-changer
                        @change="handleVideosPageChange"
                        @showSizeChange="handleVideosSizeChange"
                      />
                    </div>
                  </template>
                  
                  <div v-else class="empty-state">
                    <h3 class="empty-state-title">Your video gallery awaits! 🎬</h3>
                    <p class="empty-state-description">
                      Ready to showcase your content? Upload your first video and start engaging your audience.
                    </p>
                    <a-button 
                      type="primary" 
                      class="upload-btn-empty" 
                      @click="showUploadModal"
                    >
                      Upload Videos
                    </a-button>
                  </div>
                </div>
              </a-spin>
            </template>
            <!-- Link Content -->
            <template v-else-if="activeTab === 'links'">
              <a-spin :spinning="linksLoading">
                <template v-if="!linksLoading">
                  <!-- 添加空状态显示 -->
                  <div v-if="internalLinks.length === 0" class="empty-state">
                    <h3 class="empty-state-title">No Internal Links Found 🔗</h3>
                    <p class="empty-state-description">
                      Start adding internal links to improve your site's navigation and SEO.
                    </p>
                    <a-button 
                      type="primary" 
                      class="upload-btn-empty" 
                      @click="showAddLinkModal"
                    >
                      Add First Link
                    </a-button>
                  </div>
                  
                  <!-- 现有的表格组件 -->
                  <a-table
                    v-else
                    :columns="linkColumns" 
                    :dataSource="internalLinks" 
                    :pagination="{ 
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} items`
                    }"
                    :rowKey="record => record.id"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'operation'">
                        <a-space>
                          <a-button type="link" @click="editLink(record)">
                            <edit-outlined />
                          </a-button>
                          <a-popconfirm
                            title="Are you sure you want to delete this link?"
                            @confirm="deleteLink(record)"
                            ok-text="Delete"
                            cancel-text="Cancel"
                          >
                            <a-button type="link" danger>
                              <delete-outlined />
                            </a-button>
                          </a-popconfirm>
                        </a-space>
                      </template>
                      <template v-if="column.key === 'link'">
                        <a :href="record.link" target="_blank">{{ record.link }}</a>
                      </template>
                    </template>
                  </a-table>
                </template>
              </a-spin>
            </template>
            <!-- Knowledge Tab Content -->
            <template v-else-if="activeTab === 'knowledge'">
              <a-spin :spinning="knowledgeLoading">
                <template v-if="processingKnowledge && !knowledgeLoading">
                  <a-card class="knowledge-processing-card">
                    <div class="processing-content">
                      <LoadingOutlined class="processing-icon" spin />
                      <div class="status-info">
                        <h3 class="status-title">{{ getKnowledgeStatusMessage(knowledgeStatus).title }}</h3>
                        <p class="status-description">{{ getKnowledgeStatusMessage(knowledgeStatus).description }}</p>
                      </div>
                      
                      <!-- 处理时间展示 -->
                      <div class="processing-stats">
                        <div class="stat-item">
                          <ClockCircleOutlined />
                          <span>Processing Time: {{ knowledgeTime }}</span>
                        </div>
                      </div>

                      <!-- 进度提示 -->
                      <div class="processing-tips">
                        <InfoCircleOutlined />
                        <span>This process may take several minutes. You'll be notified once it's complete.</span>
                      </div>
                    </div>
                  </a-card>
                </template>
                <div v-if="!knowledgeLoading && !processingKnowledge">
                  <!-- Knowledge Base Content -->
                  <div class="knowledge-base-container">
                    <div 
                      v-if="!groupedArticles || Object.keys(groupedArticles).length === 0"
                      role="alert" 
                      class="knowledge-alert ant-alert ant-alert-info ant-alert-with-description ant-alert-no-icon"
                    >
                      <div class="ant-alert-content">
                        <div class="ant-alert-description">
                          <div class="empty-state">
                            <h3>Build Your Knowledge Base ✨</h3>
                            <p>Let us help you create a comprehensive knowledge base system to provide complete documentation for your users.</p>
                            <a-button 
                              type="primary" 
                              :loading="initializingKnowledge" 
                              @click="initializeKnowledgeBase"
                              class="init-button"
                            >
                              Initialize Knowledge Base
                            </a-button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <div class="knowledge-intro">
                        <a-collapse :default-active-key="['1']" :bordered="false">
                          <a-collapse-panel key="1">
                            <template #header>
                              <div class="intro-header">
                                <exclamation-circle-filled class="warning-icon" />
                                <span>Important Quality Notice</span>
                              </div>
                            </template>
                            <div class="intro-content">
                              <div class="quality-alert">
                                <div class="alert-main">
                                  <p class="alert-title">
                                    Content Quality Distribution:
                                  </p>
                                  <div class="quality-stats">
                                    <div class="stat-item">
                                      <span class="stat-grade excellent">A</span>
                                      <span class="stat-value">{{ getQualityPercentage(Object.values(groupedArticles).flat(), 'A').toFixed(1) }}%</span>
                                    </div>
                                    <div class="stat-item">
                                      <span class="stat-grade good">B</span>
                                      <span class="stat-value">{{ getQualityPercentage(Object.values(groupedArticles).flat(), 'B').toFixed(1) }}%</span>
                                    </div>
                                    <div class="stat-item">
                                      <span class="stat-grade fair">C</span>
                                      <span class="stat-value">{{ getQualityPercentage(Object.values(groupedArticles).flat(), 'C').toFixed(1) }}%</span>
                                    </div>
                                    <div class="stat-item">
                                      <span class="stat-grade poor">D</span>
                                      <span class="stat-value">{{ getQualityPercentage(Object.values(groupedArticles).flat(), 'D').toFixed(1) }}%</span>
                                    </div>
                                  </div>
                                </div>
                                <div class="alert-message">
                                  <div class="message-content">
                                    <p class="message-title">Action Required</p>
                                    <p class="message-text">
                                      Please optimize content with C and D grades. Low-quality content may significantly impact AI-generated results. Review and enhance these contents to ensure more accurate AI page generation.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a-collapse-panel>
                        </a-collapse>
                      </div>
                      <div class="knowledge-grid">
                        <div v-for="(articles, label) in groupedArticles" 
                              :key="label"
                              class="category-card"
                        >
                          <div class="category-header">
                            <h2>{{ label }}</h2>
                            <div class="quality-stats">
                              <div class="quality-bar">
                                <div class="bar-segment excellent" :style="{ width: getQualityPercentage(articles, 'A') + '%' }"></div>
                                <div class="bar-segment good" :style="{ width: getQualityPercentage(articles, 'B') + '%' }"></div>
                                <div class="bar-segment fair" :style="{ width: getQualityPercentage(articles, 'C') + '%' }"></div>
                                <div class="bar-segment poor" :style="{ width: getQualityPercentage(articles, 'D') + '%' }"></div>
                              </div>
                              <!-- 完成度统计 -->
                              <div class="completion-rate">
                                {{ getCompletionRate(articles) }}% Complete
                              </div>
                            </div>
                          </div>

                          <!-- 文章列表 -->
                          <div class="articles-list">
                            <div v-for="article in articles" 
                                  :key="article.contentId"
                                  class="article-item"
                                  :class="getQualityClass(article.grade)"
                                  @click="selectArticle(article)"
                            >
                              <div class="article-content" @click="selectArticle(article)">
                                <h3>{{ article.title }}</h3>
                                <p v-if="article.content" class="article-preview">
                                  {{ article.content.substring(0, 100) }}...
                                </p>
                                <p v-else class="article-empty" style="color: #ff4d4f;">
                                  Content needs to be added
                                </p>
                              </div>
                              <a-button 
                                type="link" 
                                danger
                                class="delete-btn"
                                @click.stop="showDeleteConfirm(article)"
                              >
                                <delete-outlined />
                              </a-button>
                            </div>
                          </div>

                          <!-- 添加按钮移到底部 -->
                          <div class="category-footer">
                            <a-button 
                              type="link"
                              @click="showAddArticle(label)"
                            >
                              <plus-outlined />
                              Add Article
                            </a-button>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </a-spin>
            </template>
            <!-- Header Section -->
            <template v-else-if="activeTab === 'header'">
              <div class="header-footer-content">
                <a-spin :spinning="headerLoading">
                  <div v-if="!headerLoading" class="settings-section">
                    <div class="preview-section">
                      <div class="preview-container">
                        <HeaderTemplate 
                          :initialData="headerConfig"
                          :layoutId="layoutId || ''"
                        />
                      </div>
                    </div>
                  </div>
                </a-spin>
              </div>
            </template>
            <!-- Footer Section -->
            <template v-else-if="activeTab === 'footer'">
              <div class="header-footer-content">
                <a-spin :spinning="footerLoading">
                  <div v-if="!footerLoading" class="settings-section">
                    <div class="preview-section">
                      <div class="preview-container">
                        <FooterTemplate 
                          :initial-data="footerConfig"
                          :layoutId="layoutId || ''"
                        />
                      </div>
                    </div>
                  </div>
                </a-spin>
              </div>
            </template>
            <!-- Button Links Content -->
            <template v-else-if="activeTab === 'button-links'">
              <a-spin :spinning="buttonLinksLoading">
                <template v-if="!buttonLinksLoading">
                  <!-- Empty state display -->
                  <div v-if="buttonLinks.length === 0" class="empty-state">
                    <h3 class="empty-state-title">No Button Links Found 🔗</h3>
                    <p class="empty-state-description">
                      Start adding button links to enhance your site's call-to-actions.
                    </p>
                    <a-button 
                      type="primary" 
                      class="upload-btn-empty" 
                      @click="showAddLinkModal"
                    >
                      Add First Button Link
                    </a-button>
                  </div>
                  
                  <!-- Button links table -->
                  <a-table
                    v-else
                    :columns="buttonLinkColumns" 
                    :dataSource="buttonLinks" 
                    :pagination="{ 
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} items`
                    }"
                    :rowKey="record => record.id"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'operation'">
                        <a-space>
                          <a-button type="link" @click="editButtonLink(record)">
                            <edit-outlined />
                          </a-button>
                          <a-popconfirm
                            title="Are you sure you want to delete this button link?"
                            @confirm="() => deleteButtonLink(record)"
                            ok-text="Delete"
                            cancel-text="Cancel"
                          >
                            <a-button type="link" danger>
                              <delete-outlined />
                            </a-button>
                          </a-popconfirm>
                        </a-space>
                      </template>
                      <template v-if="column.key === 'link'">
                        <a :href="record.link" target="_blank">{{ record.link }}</a>
                      </template>
                    </template>
                  </a-table>
                </template>
              </a-spin>
            </template>
            <!-- Favicon Content -->
            <template v-else-if="activeTab === 'favicon'">
              <div class="favicon-content">
                <a-spin :spinning="faviconLoading">
                  <div class="preview-section">
                    <div class="section-header">
                      <h3>Favicon Settings</h3>
                      <p class="section-description">
                        Upload different sizes of favicons for various devices and platforms
                      </p>
                    </div>
                    
                    <div class="preview-devices">
                      <!-- Browser Tab Preview -->
                      <div class="device-preview">
                        <div class="preview-header">
                          <h4>Browser Tab Icon</h4>
                          <p class="size-hint">16x16 px</p>
                          <div 
                            class="upload-area" 
                            @click="triggerFaviconUpload('tab')"
                            style="cursor: pointer"
                          >
                            <upload-outlined v-if="!faviconPreviews.tab" class="upload-icon" />
                            <img v-else :src="faviconPreviews.tab" class="preview-img" />
                            <p>Click to upload</p>
                          </div>
                          <input
                            type="file"
                            ref="tabInput"
                            accept=".ico,.png"
                            style="display: none"
                            @change="(e) => handleFaviconChange(e, 'favicon')"
                          />
                        </div>
                        
                        <div class="preview-display">
                          <div class="browser-chrome">
                            <div class="tab">
                              <img v-if="faviconPreviews.tab" :src="faviconPreviews.tab" class="tab-favicon" />
                              <span>My Website - Chrome</span>
                            </div>
                          </div>
                        </div>
                        <div class="preview-description">
                          <p>Used in browser tabs, bookmarks, and favorites bar. This is the most common favicon size that every website should have.</p>
                        </div>
                      </div>

                      <!-- Windows Taskbar Preview -->
                      <div class="device-preview">
                        <div class="preview-header">
                          <h4>Windows Taskbar</h4>
                          <p class="size-hint">32x32 px</p>
                          <div 
                            class="upload-area" 
                            @click="triggerFaviconUpload('taskbar')"
                            style="cursor: pointer"
                          >
                            <upload-outlined v-if="!faviconPreviews.taskbar" class="upload-icon" />
                            <img v-else :src="faviconPreviews.taskbar" class="preview-img" />
                            <p>Click to upload</p>
                          </div>
                          <input
                            type="file"
                            ref="taskbarInput"
                            accept=".ico,.png"
                            style="display: none"
                            @change="(e) => handleFaviconChange(e, 'windows')"
                          />
                        </div>
                        
                        <div class="preview-display">
                          <div class="windows-taskbar">
                            <img v-if="faviconPreviews.taskbar" :src="faviconPreviews.taskbar" class="taskbar-icon" />
                          </div>
                        </div>
                        <div class="preview-description">
                          <p>Displayed when users pin your website to Windows taskbar, add to Start menu, or view in high-resolution bookmarks.</p>
                        </div>
                      </div>

                      <!-- iOS Preview -->
                      <div class="device-preview">
                        <div class="preview-header">
                          <h4>iOS Home Screen</h4>
                          <p class="size-hint">180x180 px</p>
                          <div 
                            class="upload-area" 
                            @click="triggerFaviconUpload('ios')"
                            style="cursor: pointer"
                          >
                            <upload-outlined v-if="!faviconPreviews.ios" class="upload-icon" />
                            <img v-else :src="faviconPreviews.ios" class="preview-img" />
                            <p>Click to upload</p>
                          </div>
                          <input
                            type="file"
                            ref="iosInput"
                            accept=".ico,.png"
                            style="display: none"
                            @change="(e) => handleFaviconChange(e, 'ios')"
                          />
                        </div>
                        
                        <div class="preview-display">
                          <div class="ios-home">
                            <img v-if="faviconPreviews.ios" :src="faviconPreviews.ios" class="ios-app-icon" />
                          </div>
                        </div>
                        <div class="preview-description">
                          <p>Appears when users add your website to their iOS home screen ("Add to Home Screen" feature) or in Safari bookmarks.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-spin>
              </div>
            </template>
          </div>
        </div>
        <!-- Preview Modal -->
        <a-modal
          v-model:open="previewVisible"  
          :footer="null"
          width="800px"
          class="preview-modal"
          @cancel="closePreview"
          :closable="false"
        >
          <img 
            v-if="selectedAsset?.type === 'image'"
            :src="selectedAsset?.url"
            class="preview-image"
            alt="Preview"
          >
          <video
            v-else-if="selectedAsset?.type === 'video'"
            :src="selectedAsset?.url"
            controls
            class="preview-video"
          ></video>
        </a-modal>
        <!-- Upload Modal -->
        <a-modal
          v-model:open="uploadModalVisible"
          :title="`Upload ${activeTab === 'images' ? 'Images' : 'Videos'}`"
          @ok="handleUploadOk"
          @cancel="handleUploadCancel"
          :okButtonProps="{ 
            disabled: !uploadFile || !isMediaFormValid,
            loading: uploading
          }"
        >
          <div class="upload-container">
            <div v-if="!uploadFile" class="upload-area" @click="triggerFileInput">
              <upload-outlined class="upload-icon" />
              <p>Click or drag file to upload</p>
              <p class="upload-hint">
                {{ activeTab === 'images' ? 'Supports JPG, PNG, WebP formats' : 'Supports MP4 format' }}
              </p>
            </div>
            
            <template v-else>
              <div class="preview-container">
                <div class="preview-wrapper">
                  <img
                    v-if="activeTab === 'images' && uploadFile"
                    :src="previewUrl"
                    class="upload-preview"
                  />
                  <video
                    v-if="activeTab === 'videos' && uploadFile"
                    :src="previewUrl"
                    controls
                    class="upload-preview"
                  ></video>
                </div>
              </div>

              <!-- Add form for name and description -->
              <a-form
                :model="mediaForm"
                :rules="mediaFormRules"
                ref="mediaFormRef"
                layout="vertical"
                class="media-form"
              >
                <a-form-item 
                  name="mediaName" 
                  label="Name"
                  :validateTrigger="['blur', 'change']"
                >
                  <a-input 
                    v-model:value="mediaForm.mediaName" 
                    placeholder="Enter file name"
                    :maxLength="50"
                  />
                </a-form-item>
                
                <a-form-item 
                  name="description" 
                  label="Description"
                >
                  <a-textarea 
                    v-model:value="mediaForm.description" 
                    placeholder="Enter description (optional)"
                    :maxLength="200"
                    :rows="3"
                  />
                </a-form-item>
              </a-form>

              <div class="preview-actions">
                <a-button type="primary" danger @click="removeUpload">
                  <delete-outlined /> Remove
                </a-button>
              </div>
            </template>
            
            <input
              type="file"
              ref="fileInput"
              :accept="activeTab === 'images' ? 'image/*' : 'video/mp4'"
              style="display: none"
              @change="handleFileChange"
            />
          </div>
        </a-modal>
        <!-- Add Link Modal -->
        <a-modal
          v-model:open="linkModalVisible"
          :title="(activeTab === 'button-links' ? 'Button ' : 'Internal ') + (editingLink || editingButtonLink ? 'Edit' : 'Add') + ' Link'"
          @ok="handleLinkModalOk" 
          @cancel="handleLinkModalCancel"
          :okButtonProps="{ 
            disabled: !isLinkFormValid,
            loading: linkSubmitting
          }"
        >
          <a-form
            :model="linkForm"
            :rules="linkFormRules"
            ref="linkFormRef"
            layout="vertical"
          >
            <!-- Name field -->
            <a-form-item 
              name="name" 
              label="Name"
              :validateTrigger="['blur', 'change']"
            >
              <a-input 
                v-model:value="linkForm.name" 
                placeholder="Enter link name"
                :maxLength="50"
              />
            </a-form-item>
            
            <!-- Link URL field -->
            <a-form-item 
              name="link" 
              label="Link URL"
              :validateTrigger="['blur', 'change']"
            >
              <a-input 
                v-model:value="linkForm.link" 
                placeholder="Enter link URL"
                :maxLength="200"
              />
            </a-form-item>
            
            <!-- Description field -->
            <a-form-item 
              name="description" 
              label="Description"
              :validateTrigger="['blur', 'change']"
            >
              <a-textarea 
                v-model:value="linkForm.description" 
                placeholder="Enter link description"
                :maxLength="500"
                :rows="3"
              />
            </a-form-item>
            
            <!-- Category field - only show for internal links -->
            <a-form-item 
              v-if="activeTab === 'links'"
              name="category" 
              label="Category"
              :validateTrigger="['blur', 'change']"
            >
              <a-select
                v-model:value="linkForm.category"
                placeholder="Select category"
              >
                <a-select-option 
                  v-for="category in linkCategories" 
                  :key="category" 
                  :value="category"
                >
                  {{ category }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
        <!-- Add Edit Modal -->
        <a-modal
          v-model:open="editModalVisible"
          title="Edit Asset"
          @ok="handleEditOk"
          @cancel="handleEditCancel"
          :okButtonProps="{ 
            disabled: !isEditFormValid,
            loading: editSubmitting
          }"
        >
          <a-form
            :model="editForm"
            :rules="mediaFormRules"
            ref="editFormRef"
            layout="vertical"
            class="media-form"
          >
            <a-form-item 
              name="mediaName" 
              label="Name"
              :validateTrigger="['blur', 'change']"
            >
              <a-input 
                v-model:value="editForm.mediaName" 
                placeholder="Enter file name"
                :maxLength="50"
              />
            </a-form-item>
            
            <a-form-item 
              name="description" 
              label="Description"
            >
              <a-textarea 
                v-model:value="editForm.description" 
                placeholder="Enter description (optional)"
                :maxLength="200"
                :rows="3"
              />
            </a-form-item>
          </a-form>
        </a-modal>
        <!-- Knowledge Edit Modal -->
        <a-modal
          v-model:visible="knowledgeModalVisible"
          :title="currentArticle?.contentId ? 'Edit Knowledge Content' : 'Add Knowledge Content'"
          :width="1400"
          @ok="handleKnowledgeSave"
          @cancel="handleKnowledgeCancel"
          :confirmLoading="knowledgeSaving"
        >
          <template v-if="currentArticle">
            <!-- Article Info Section -->
            <div class="article-info-section">
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">Title</div>
                  <div class="info-value">
                    <a-input 
                      v-if="!currentArticle.contentId"
                      v-model:value="currentArticle.title"
                      placeholder="Enter article title"
                    />
                    <template v-else>
                      {{ currentArticle.title }}
                    </template>
                  </div>
                </div>
                <!-- 只在编辑模式显示 grade -->
                <div class="info-item" v-if="currentArticle.contentId">
                  <div class="info-label">Quality Grade</div>
                  <div class="info-value" :class="getQualityClass(currentArticle.grade)">
                    {{ currentArticle.grade }}
                  </div>
                </div>
              </div>
              <!-- source 只在编辑模式显示 -->
              <div class="info-row" v-if="currentArticle.contentId">
                <div class="info-item">
                  <div class="info-label">Category</div>
                  <div class="info-value">{{ currentArticle.label }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Source</div>
                  <div class="info-value">
                    {{ currentArticle.source || 'Not specified' }}
                  </div>
                </div>
              </div>
              <!-- 新增模式只显示 Category -->
              <div class="info-row" v-else>
                <div class="info-item">
                  <div class="info-label">Category</div>
                  <div class="info-value">{{ currentArticle.label }}</div>
                </div>
              </div>
            </div>

            <!-- Content Editor -->
            <div class="content-editor">
              <div class="editor-label">Content</div>
              <a-textarea
                v-model:value="editableContent"
                :rows="20"  
                placeholder="Enter knowledge content here..."
                :maxLength="5000"
                show-count
                class="large-textarea" 
              />
            </div>
          </template>
        </a-modal>
      </template>
      <template v-else>
        <no-site-configured v-if="!loading"/>
      </template>
    </a-spin>
  </page-layout>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import PageLayout from './layout/PageLayout.vue'
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined, 
  PlusOutlined, 
  FolderOutlined, 
  LinkOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  ApiOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  FileImageOutlined,
  SyncOutlined,  // 添加 SyncOutlined 图标
  ClockCircleOutlined,
  InfoCircleOutlined,
  WarningFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import apiClient from '../api/api';
import { useRouter } from 'vue-router';
import HeaderTemplate from './sections/templates/HeaderTemplate.vue'
import FooterTemplate from './sections/templates/FooterTemplate.vue'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
import SmartBanner from './common/SmartBanner.vue'
import { Modal } from 'ant-design-vue';

export default {
  name: 'BrandAssetsPage',
  components: {
    PageLayout,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    PlusOutlined,
    FolderOutlined,
    LinkOutlined,
    SettingOutlined,
    ExclamationCircleOutlined,
    HeaderTemplate,
    FooterTemplate,
    NoSiteConfigured,
    QuestionCircleOutlined,
    ThunderboltOutlined,
    CloudOutlined,
    ApiOutlined,
    SmartBanner,
    AppstoreOutlined,
    CheckCircleOutlined,
    FileImageOutlined,
    SyncOutlined,  // 注册 SyncOutlined 组件
    ClockCircleOutlined,
    InfoCircleOutlined,
    WarningFilled,
    ExclamationCircleFilled,
  },
  setup() {
    const router = useRouter();
    const domainConfigured = ref(false);
    const loading = ref(true);  // 全局 loading
    const activeTab = ref('knowledge')
    const assets = ref([])
    const pollTimer = ref(null);

    // Check domain configuration status
    const checkDomainStatus = async () => {
      try {
        loading.value = true;
        const response = await apiClient.getProductsByCustomerId();
        domainConfigured.value = response.data?.domainStatus || false;
      } catch (error) {
        console.error('Failed to fetch product info:', error);
        domainConfigured.value = false;
      } finally {
        loading.value = false;
      }
    };

    // Navigate to settings page
    const goToDashboard = () => {
      router.push('/dashboard');
    };

    // onMounted 只负责初始化 knowledge base
    onMounted(async () => {
      try {
        loading.value = true;
        // 检查域名配置状态
        await checkDomainStatus();
        
        // 如果域名已配置，优先加载 knowledge base
        if (domainConfigured.value) {
          await initKnowledgeBase();
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        loading.value = false;
      }
    });

    const goToHelpCenter = () => {
      router.push('/help-center')
    }
    
    // 添加分页相关的响应式变量
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)
    
    // 修改 fetchAssets 方法支持分页
    const fetchAssets = async () => {
      mediaLoading.value = true;
      const isImageTab = activeTab.value === 'images';

      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const mediaType = isImageTab ? 'image' : 'video';
        const response = await apiClient.getMedia(
          customerId,
          mediaType,
          selectedCategory.value === 'all' ? null : selectedCategory.value,
          currentPage.value,
          pageSize.value
        );
        
        if (response.data) {
          assets.value = response.data.map(item => ({
            id: item.mediaId,
            type: item.mediaType,
            name: item.mediaName,
            url: item.mediaUrl,
            categoryId: item.categoryId,
            description: item.description,
            categoryName: item.categoryName,
            uploadTime: new Date().toISOString(),
            size: 0,
            suggestedUsage: '',
            duration: item.mediaType === 'video' ? 0 : undefined
          }));
          total.value = response.TotalCount || 0;
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        message.error(`Failed to load ${isImageTab ? 'images' : 'videos'}`);
      } finally {
        mediaLoading.value = false;
      }
    };

    // 添加分页处理方法
    const handlePageChange = (page, size) => {
      currentPage.value = page
      pageSize.value = size
      fetchAssets()
    }

    const handleSizeChange = (current, size) => {
      currentPage.value = 1
      pageSize.value = size
      fetchAssets()
    }

    // watch 负责处理标签切换时的数据加载
    watch(activeTab, async (newValue) => {
      if (!domainConfigured.value) return;
      
      try {
        switch (newValue) {
          case 'images':
          case 'videos':
            await fetchAssets();
            break;
          case 'links':
            await fetchLinks();
            break;
          case 'button-links':
            await fetchButtonLinks();
            break;
          case 'header':
            await fetchLayoutData('header');
            break;
          case 'footer':
            await fetchLayoutData('footer');
            break;
          case 'knowledge':
            await initKnowledgeBase();
            break;
          case 'favicon':  // 新增: favicon tab 的处理
            await fetchFavicons();
            break;
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${newValue} tab:`, error);
      }
    });

    const previewVisible = ref(false)
    const selectedAsset = ref(null)

    // 加分类相关的状态
    const categories = ref([
      { id: 1, name: 'Marketing Materials' },
      { id: 2, name: 'Product Showcase' },
      { id: 3, name: 'Team Photos' },
    ])
    const selectedCategory = ref('all')
    const selectedKeys = ref([selectedCategory.value])
    const categoryModalVisible = ref(false)
    const categoryForm = ref({ name: '' })
    const editCategoryModalVisible = ref(false)

    // 监听分类变化
    watch(selectedCategory, (newValue) => {
      selectedKeys.value = [newValue]
    })

    // Computed properties
    const filteredAssets = computed(() => {
      return assets.value.filter(asset => {
        const isCorrectType = asset.type === (activeTab.value === 'images' ? 'image' : 'video')
        const matchesCategory = selectedCategory.value === 'all' || 
          asset.categoryId === selectedCategory.value
        
        return isCorrectType && matchesCategory
      })
    })

    const previewAsset = (asset) => {
      selectedAsset.value = asset
      previewVisible.value = true
    }

    const closePreview = () => {
      selectedAsset.value = null
      previewVisible.value = false
    }

    const deleteAsset = async (asset) => {
      try {
        await apiClient.deleteMedia(asset.id)
        assets.value = assets.value.filter(item => item.id !== asset.id)
        message.success('Media file deleted successfully')
      } catch (error) {
        console.error('Failed to delete media file:', error)
        message.error('Failed to delete media file')
      }
    }

    // 添加分相关的方
    const showAddCategory = () => {
      categoryForm.value.name = ''
      categoryModalVisible.value = true
    }

    const handleAddCategory = () => {
      if (categoryForm.value.name) {
        const newCategory = {
          id: Date.now(),
          name: categoryForm.value.name
        }
        categories.value.push(newCategory)
        categoryModalVisible.value = false
        message.success('Category added successfully')
      }
    }

    const deleteCategory = (categoryId) => {
      categories.value = categories.value.filter(c => c.id !== categoryId)
      message.success('Category deleted successfully')
    }

    const handleEditCategory = () => {
      if (categoryForm.value.name) {
        const index = categories.value.findIndex(c => c.id === categoryForm.value.id)
        if (index !== -1) {
          categories.value[index].name = categoryForm.value.name
          message.success('Category updated successfully')
          editCategoryModalVisible.value = false
        }
      }
    }

    // 修改空状的计算属性
    const showEmptyState = computed(() => {
      return !loading.value && assets.value.length === 0;
    });

    // 增传相关的响应式变量
    const uploadModalVisible = ref(false)
    const uploadFile = ref(null)
    const previewUrl = ref('')
    const fileInput = ref(null)
    const uploading = ref(false)
    
    // 示上传模态框
    const showUploadModal = () => {
      uploadModalVisible.value = true
    }
    
    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value.click()
    }
    
    // 修改处理文件选择的方法
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const maxSize = activeTab.value === 'images' ? 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
          message.error(`File size exceeds ${activeTab.value === 'images' ? '1MB' : '50MB'} limit`);
          if (fileInput.value) {
            fileInput.value.value = '';
          }
          return;
        }
        
        uploadFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
        
        // 设置初始文件名（去掉扩展名并替换空格）
        const initialName = file.name
          .replace(/\.[^/.]+$/, "")  // 除扩展名
          .replace(/\s+/g, '_');     // 替换空格为下划线
        
        mediaForm.value.mediaName = initialName;
        
        // 由于初始文件名是有的，直接设置验证状态为 true
        mediaFormValidateStatus.value = true;
      }
    };
    
    // 修改移除上传文件的方法
    const removeUpload = () => {
      uploadFile.value = null;
      previewUrl.value = '';
      mediaForm.value = {
        mediaName: '',
        description: ''
      };
      mediaFormValidateStatus.value = false;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    
    // 处理上传确认
    const handleUploadOk = async () => {
      if (!uploadFile.value || !mediaForm.value.mediaName) return;
      
      uploading.value = true;
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append('file', uploadFile.value);
        formData.append('customerId', localStorage.getItem('currentCustomerId'));
        formData.append('mediaType', activeTab.value === 'images' ? 'image' : 'video');
        formData.append('mediaName', mediaForm.value.mediaName);
        formData.append('description', mediaForm.value.description || '');
        formData.append('categoryName', 'media');
        
        const response = await apiClient.uploadMedia(formData);
        
        if (response.status === 413) {
          message.error('File is too large. Please select a smaller file');
          return;
        }
        
        message.success('Upload successful');
        uploadModalVisible.value = false;
        removeUpload();
        fetchAssets();
      } catch (error) {
        console.error('Upload failed:', error);
        if (error.response?.status === 413) {
          message.error('File is too large. Please select a smaller file');
        } else {
          message.error('Upload failed, please try again');
        }
      } finally {
        uploading.value = false;
        loading.value = false;
      }
    };
    
    // 处理上传取消
    const handleUploadCancel = () => {
      uploadModalVisible.value = false
      removeUpload()
    }

    const getFileNameWithoutExtension = (filename) => {
      return filename.replace(/\.[^/.]+$/, "");
    };

    const getFileExtension = (filename) => {
      return filename.match(/\.[^/.]+$/)?.[0] || '';
    };

    // Add new reactive variables for edit modal
    const editModalVisible = ref(false);
    const editSubmitting = ref(false);
    const editFormRef = ref();
    const editFormValidateStatus = ref(false);
    const editForm = ref({
      mediaName: '',
      description: ''
    });
    const editingAsset = ref(null);

    // Add computed property for edit form validation
    const isEditFormValid = computed(() => {
      return editForm.value.mediaName && 
             !editForm.value.mediaName.includes(' ') && 
             editForm.value.mediaName.length <= 50 &&
             editFormValidateStatus.value;
    });

    // Watch for edit form changes
    watch(() => editForm.value.mediaName, (newVal) => {
      // 简单验证：不为空且不包含空格
      editFormValidateStatus.value = newVal && !newVal.includes(' ');
    });

    // Replace the old startEditing method with new one
    const startEditing = (asset) => {
      // 设置编辑数据
      editingAsset.value = asset;
      editForm.value = {
        mediaName: getFileNameWithoutExtension(asset.name),
        description: asset.description || ''
      };
      
      // 由于初始数据是有效的，直接设置验证状态为 true
      editFormValidateStatus.value = true;
      
      // 显示弹窗
      editModalVisible.value = true;
    };

    // Add new methods for edit modal
    const handleEditOk = async () => {
      if (!editingAsset.value) return;

      try {
        await editFormRef.value.validate();
        editSubmitting.value = true;

        const newName = `${editForm.value.mediaName}${getFileExtension(editingAsset.value.name)}`;
        const response = await apiClient.updateMedia(editingAsset.value.id, {
          mediaName: newName,
          description: editForm.value.description
        });

        if (response) {
          // Update the asset in the local list
          const index = assets.value.findIndex(a => a.id === editingAsset.value.id);
          if (index !== -1) {
            assets.value[index] = {
              ...assets.value[index],
              name: newName,
              description: editForm.value.description
            };
          }
          message.success('Asset updated successfully');
          handleEditCancel();
        }
      } catch (error) {
        console.error('Failed to update asset:', error);
        message.error('Failed to update asset');
      } finally {
        editSubmitting.value = false;
      }
    };

    const handleEditCancel = () => {
      editModalVisible.value = false;
      editingAsset.value = null;
      editForm.value = {
        mediaName: '',
        description: ''
      };
      if (editFormRef.value) {
        editFormRef.value.resetFields();
      }
    };

    // Modify the asset card template to show description if available
    const assetInfo = computed(() => {
      return assets.value.map(asset => ({
        ...asset,
        displayDescription: asset.description ? 
          (asset.description.length > 50 ? `${asset.description.slice(0, 50)}...` : asset.description) 
          : 'No description'
      }));
    });

    // 链接相关的状态
    const linkCategories = ['CorePage', 'LandingPage', 'Blog', 'HelpCenter']
    const selectedLinkCategory = ref('all')

    const linkColumns = [
      {
        title: 'Link',
        dataIndex: 'link',
        key: 'link',
        width: '30%',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '50%',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: '10%',
        filters: [
          { text: 'Core', value: 'Core' },
          { text: 'LandingPage', value: 'LandingPage' },
          { text: 'Blog', value: 'Blog' },
          { text: 'HelpCenter', value: 'HelpCenter' },
        ],
        onFilter: (value, record) => record.category === value,
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '10%',
      },
    ]

    // 添加新的响应式变量
    const linksLoading = ref(false)
    const internalLinks = ref([])

    // 获取内部链接数的方法
    const fetchLinks = async () => {
      linksLoading.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        
        const response = await apiClient.getInternalLinks(customerId, {
          page: 1,
          limit: 100
        })
        
        if (response && response.data) {
          internalLinks.value = response.data.map(link => ({
            id: link.linkId,
            link: link.link,
            description: link.description,
            category: link.category
          }))
        }
      } catch (error) {
        console.error('Failed to fetch internal links:', error) // 保留这个错误日志
        
        // 使用 await 确保消息显示
        await message.error({
          content: error.response?.status === 404 
            ? 'Internal links service is not available' 
            : 'Failed to load internal links. Please try again later.',
          duration: 3 // 显示3秒
        })
        
        internalLinks.value = []
      } finally {
        linksLoading.value = false
      }
    }

    // 删除链接的方法
    const deleteLink = async (record) => {
      try {
        // 这里需要后端提供删除内部链接的 API
        await apiClient.deleteInternalLink(record.id)
        message.success('Link deleted successfully')
        fetchLinks() // 重新获取链接列表
      } catch (error) {
        console.error('Failed to delete link:', error)
        message.error('Failed to delete link')
      }
    }

    // 编辑链接的方法
    const editLink = async (record) => {
      editingLink.value = record
      linkForm.value = {
        name: record.name,
        link: record.link,
        description: record.description,
        category: record.category
      }
      linkModalVisible.value = true
    }

    // 修改处理链接表单提交的方法
    const handleLinkModalOk = async () => {
      try {
        await linkFormRef.value.validate()
        linkSubmitting.value = true
        
        const customerId = localStorage.getItem('currentCustomerId')
        
        if (activeTab.value === 'button-links') {
          // 按钮链接数据结构（不包含 category）
          const buttonLinkData = {
            name: linkForm.value.name,
            link: linkForm.value.link,
            description: linkForm.value.description
          };

          if (editingButtonLink.value) {
            await apiClient.updatePageButtonLink(editingButtonLink.value.id, buttonLinkData);
            message.success('按钮链接更新成功');
          } else {
            await apiClient.createPageButtonLink(buttonLinkData);
            message.success('按钮链接添加成功');
          }
          await fetchButtonLinks();
        } else {
          // 内部链接数据结构（包含 category）
          const internalLinkData = {
            customerId: localStorage.getItem('currentCustomerId'),
            link: linkForm.value.link,
            description: linkForm.value.description,
            category: linkForm.value.category
          };

          if (editingLink.value) {
            await apiClient.updateInternalLink(editingLink.value.id, internalLinkData);
            message.success('内部链接更新成功');
          } else {
            await apiClient.createInternalLink(internalLinkData);
            message.success('内部链接添加成功');
          }
          await fetchLinks();
        }

        linkModalVisible.value = false;
        resetLinkForm()
      } catch (error) {
        console.error('保存链接失败:', error);
        message.error('保存失败，请重试');
      } finally {
        linkSubmitting.value = false
      }
    }

    // Link form related
    const linkModalVisible = ref(false)
    const linkSubmitting = ref(false)
    const linkFormRef = ref()
    const editingLink = ref(null)
    
    const linkForm = ref({
      name: '',
      link: '',
      description: '',
      category: undefined
    });
    
    const linkFormRules = computed(() => {
      if (activeTab.value === 'button-links') {
        return {
          name: [  // 添加 name 字段的验证规则
            { required: true, message: 'Please enter the link name' },
            { max: 50, message: 'Name cannot exceed 50 characters' }
          ],
          link: [
            { required: true, message: 'Please enter the link URL' },
            { type: 'url', message: 'Please enter a valid URL' }
          ],
          description: [
            { required: true, message: 'Please enter the link description' },
            { max: 500, message: 'Description cannot exceed 500 characters' }
          ]
        };
      } else {
        return {
          link: [
            { required: true, message: 'Please enter the link URL' },
            { type: 'url', message: 'Please enter a valid URL' }
          ],
          description: [
            { required: true, message: 'Please enter the link description' },
            { max: 500, message: 'Description cannot exceed 500 characters' }
          ],
          category: [
            { required: true, message: 'Please select a category' }
          ]
        };
      }
    });
    
    const isLinkFormValid = computed(() => {
      if (activeTab.value === 'button-links') {
        return linkForm.value.name && 
               linkForm.value.link && 
               linkForm.value.description
      } else {
        return linkForm.value.link && 
               linkForm.value.description && 
               linkForm.value.category
      }
    })
    
    const resetLinkForm = () => {
      linkForm.value = {
        name: '',
        link: '',
        description: '',
        // 只在内部链接时才需要重置 category
        ...(activeTab.value !== 'button-links' && { category: undefined })
      };
      editingLink.value = null;
      editingButtonLink.value = null;
      if (linkFormRef.value) {
        linkFormRef.value.resetFields()
      }
    }
    
    const showAddLinkModal = () => {
      resetLinkForm()
      linkModalVisible.value = true
    }
    
    const handleLinkModalCancel = () => {
      linkModalVisible.value = false
      resetLinkForm()
    }

    // Add new reactive variables for media form
    const mediaForm = ref({
      mediaName: '',
      description: ''
    });

    const mediaFormRules = {
      mediaName: [
        { required: true, message: 'Please enter the file name' },
        { max: 50, message: 'Name cannot exceed 50 characters' },
        { 
          validator: (_, value) => {
            if (value && value.includes(' ')) {
              return Promise.reject('File name cannot contain spaces');
            }
            return Promise.resolve();
          }
        }
      ]
    };

    const mediaFormRef = ref();
    const mediaFormValidateStatus = ref(false);

    // Add computed property for form validation
    const isMediaFormValid = computed(() => {
      return mediaForm.value.mediaName && 
             !mediaForm.value.mediaName.includes(' ') && 
             mediaForm.value.mediaName.length <= 50 &&
             mediaFormValidateStatus.value;
    });

    // Modify the form to validate on value change
    watch(() => mediaForm.value.mediaName, (newVal) => {
      // 简单验证：不为空且不包含空格
      mediaFormValidateStatus.value = newVal && !newVal.includes(' ');
    });

    // 修改这些响应式变量定义
    const groupedArticles = ref({})
    const currentArticle = ref(null)
    const editableContent = ref('')
    const saving = ref(false)
    const knowledgeStatus = ref('') // 新增:用于存储知识库状态
    const processingKnowledge = ref(false) // 新增:用于显示处理状态
    const knowledgeTime = ref('0'); // 添加处理时间的响应式变量

    // 添加一个计算属性来格式化处理时间
    const formatProcessingTime = (seconds) => {
      if (!seconds) return '0';
      
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return `${seconds}s`;
      }
    };

    // 修改 getKnowledgeStatus 方法
    const getKnowledgeStatus = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getKnowledgeProcessStatus(customerId);
        // 保存处理时间并格式化
        knowledgeTime.value = formatProcessingTime(response.data.executeTime || 0);
        return {
          currentStep: response.data.executeStep,
          executeTime: response.data.executeTime
        };
      } catch (error) {
        console.error('Failed to fetch knowledge base status:', error);
        throw error;
      }
    };

    const getKnowledgeCenter = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getKnowledgeCenter(customerId);
        // Return empty array if data is null or empty
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch knowledge base content:', error);
        message.error('Failed to load knowledge base content');
        return [];
      }
    };

    // 修改 initKnowledgeBase 方法
    const initKnowledgeBase = async () => {
      try {
        // 使用专门的 knowledgeLoading
        knowledgeLoading.value = true;
        
        if (!domainConfigured.value) {
          knowledgeLoading.value = false;
          return;
        }
        
        processingKnowledge.value = true;
        
        const pollStatus = async () => {
          knowledgeLoading.value = true;
          
          const status = await getKnowledgeStatus();
          knowledgeLoading.value = false;
          
          knowledgeStatus.value = status.currentStep;
          
          if (!status.currentStep || status.currentStep === 'end') {
            processingKnowledge.value = false;
            knowledgeLoading.value = true;
            const centerData = await getKnowledgeCenter();
            if (centerData && Array.isArray(centerData)) {
              groupArticlesByLabel(centerData);
            }
            knowledgeLoading.value = false;
            return;
          }
          
          setTimeout(pollStatus, 60000);
        };

        await pollStatus();
        
      } catch (error) {
        console.error('Failed to initialize knowledge base:', error);
        message.error('Failed to load knowledge base');
        processingKnowledge.value = false;
        knowledgeLoading.value = false;
      }
    };

    const selectArticle = (article) => {
      currentArticle.value = article
      editableContent.value = article.content || ''
      knowledgeModalVisible.value = true
    }

    const clearCurrentArticle = () => {
      currentArticle.value = null
      editableContent.value = ''
    }

    const getCategoryStats = (articles) => {
      return {
        green: articles.filter(a => a.grade === 'A').length,
        yellow: articles.filter(a => a.grade === 'B').length,
        red: articles.filter(a => a.grade === 'C' || a.grade === 'D').length
      }
    }

    // 修改 groupArticlesByLabel 方法
    const groupArticlesByLabel = (articles) => {
      const grouped = articles.reduce((acc, article) => {
        const category = article.category || 'Uncategorized'  // 使用 category 替代 label
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push({
          ...article,
          contentId: article.contentId,
          title: article.title,
          content: article.content,
          grade: article.grade,
          label: article.label,
          category: article.category,  // 添加 category
          source: article.source,
          tags: article.tags || []
        })
        return acc
      }, {})
      
      groupedArticles.value = grouped
    }

    // 分别添加 header 和 footer 的 loading 状态
    const headerLoading = ref(false);
    const footerLoading = ref(false);
    
    // 添加 header 配置
    const headerConfig = ref({
      logo: {
        src: "/images/enterprise-logo.png",
        alt: "Logo",
        width: 110,
        height: 53
      },
      mainMenuItems: [
        { key: 'features', label: 'Features' },
        { key: 'solutions', label: 'Solutions' },
        { key: 'resources', label: 'Resources' },
      ],
      actionItems: [
        { 
          key: 'login', 
          label: 'Login',
          href: 'https://app.websitelm.com',
          isExternal: false,
          variant: 'link'
        },
        { 
          key: 'get-started', 
          label: 'Get Started',
          href: 'https://app.websitelm.com',
          isExternal: false,
          variant: 'button'
        }
      ],
      // 添加 styles 对象
      styles: {
        backgroundType: 'solid',
        backgroundColor: '#FFFFFF',
        gradientStart: '#1890FF',
        gradientEnd: '#3B82F6',
        gradientAngle: 135
      }
    })

    // 修改响应式变量定义，将 headerLayoutId 和 footerLayoutId 合并为一个
    const layoutId = ref(null)

    // 修改 fetchLayoutData 方法
    const fetchLayoutData = async (type) => {
      try {
        if (type === 'header') {
          headerLoading.value = true
        } else {
          footerLoading.value = true
        }

        const response = await apiClient.getPageLayout({
          type: type
        })

        if (response?.data) {
          layoutId.value = response.data.pageLayoutId

          if (type === 'header') {
            const headerData = response.data.pageHeaders
            headerConfig.value = {
              logo: {
                src: headerData.logo?.src || '/images/enterprise-logo.png',
                alt: headerData.logo?.alt || 'Logo',
                width: headerData.logo?.width || 110,
                height: headerData.logo?.height || 53
              },
              mainMenuItems: Array.isArray(headerData.mainMenuItems) 
                ? headerData.mainMenuItems 
                : [],
              actionItems: Array.isArray(headerData.actionItems) 
                ? headerData.actionItems.map(item => ({
                    key: item.key || '',
                    label: item.label || '',
                    href: item.href || '#',
                    isExternal: item.isExternal || false,
                    variant: item.variant || 'link',
                    backgroundColor: item.backgroundColor || '#FFFFFF',
                    textColor: item.textColor || '#000000'
                  }))
                : [],
              // 确保 styles 对象被正确设置
              styles: {
                backgroundType: headerData.styles?.backgroundType || 'solid',
                backgroundColor: headerData.styles?.backgroundColor || '#FFFFFF',
                gradientStart: headerData.styles?.gradientStart || '#1890FF',
                gradientEnd: headerData.styles?.gradientEnd || '#3B82F6',
                gradientAngle: headerData.styles?.gradientAngle ?? 135
              }
            }
            console.log('Updated headerConfig:', headerConfig.value) // 添加调试日志
          } else if (type === 'footer') {
            const footerData = response.data.pageFooters
            footerConfig.value = {
              companyName: footerData.companyName || '',
              description: footerData.description || '',
              sections: Array.isArray(footerData.sections) ? footerData.sections : [],
              socialMedia: {
                iconSize: footerData.socialMedia?.iconSize || 24,
                iconColor: footerData.socialMedia?.iconColor || '#9CA3AF',
                links: Array.isArray(footerData.socialMedia?.links) ? footerData.socialMedia.links : []
              },
              newsletter: {
                enabled: footerData.newsletter?.enabled ?? true, // 添加启用/禁用状态
                title: footerData.newsletter?.title || 'Stay Updated',
                text: footerData.newsletter?.text || 'Subscribe to our newsletter',
                buttonText: footerData.newsletter?.buttonText || 'Subscribe'
              },
              copyright: footerData.copyright || '',
              colors: {
                companyName: footerData.colors?.companyName || '#FFFFFF',
                description: footerData.colors?.description || '#9CA3AF',
                featuresTitle: footerData.colors?.featuresTitle || '#FFFFFF',
                featureLinks: footerData.colors?.featureLinks || '#9CA3AF',
                newsletterTitle: footerData.colors?.newsletterTitle || '#FFFFFF',
                newsletterText: footerData.colors?.newsletterText || '#9CA3AF',
                copyright: footerData.colors?.copyright || '#9CA3AF',
                inputBackground: footerData.colors?.inputBackground || '#1F2937',
                inputPlaceholder: footerData.colors?.inputPlaceholder || '#6B7280',
                buttonBackground: footerData.colors?.buttonBackground || '#2563EB',
                buttonText: footerData.colors?.buttonText || '#FFFFFF',
                featuresTitle: footerData.colors?.featuresTitle || '#FFFFFF',
                newsletterTitle: footerData.colors?.newsletterTitle || '#FFFFFF',
              },
              styles: {
                backgroundType: footerData.styles?.backgroundType || 'solid',
                backgroundColor: footerData.styles?.backgroundColor || '#000000',
                gradientStart: footerData.styles?.gradientStart || '#000000',
                gradientEnd: footerData.styles?.gradientEnd || '#1F2937',
                gradientAngle: footerData.styles?.gradientAngle ?? 135
              }
            }

            // 如果有现有的社交媒体链接，确保它们被正确放置在 links 对象中
            if (typeof footerData.socialMedia === 'object' && footerData.socialMedia !== null) {
              footerConfig.value.socialMedia.links = {
                ...footerConfig.value.socialMedia.links,
                ...Object.fromEntries(
                  Object.entries(footerData.socialMedia).filter(([key]) => 
                    key !== 'iconSize' && key !== 'iconColor'
                  )
                )
              }
            }
          }
        }
      } catch (error) {
        console.error('获取布局数据失败:', error)
        message.error('加载布局配置失败')
      } finally {
        if (type === 'header') {
          headerLoading.value = false
        } else {
          footerLoading.value = false
        }
      }
    }

    // 添加 footer 配置相关的响应式变量
    const footerConfig = ref({
      companyName: '',
      description: '',
      features: {
        title: 'Features',
        items: []
      },
      socialMedia: {},
      newsletter: {
        text: '',
        buttonText: ''
      }
    })

    // 新增按钮链接相关的响应式变量
    const buttonLinksLoading = ref(false)
    const buttonLinks = ref([])
    const editingButtonLink = ref(null)

    // 按钮链接表格列定义
    const buttonLinkColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Link',
        dataIndex: 'link',
        key: 'link',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Action',
        key: 'operation',
        width: 150,
        slots: { customRender: 'bodyCell' },
      },
    ];

    // 获取按钮链接列表
    const fetchButtonLinks = async () => {
      buttonLinksLoading.value = true;
      try {
        const response = await apiClient.getPageButtonLinks({
          page: 1,
          limit: 100
        });
        
        if (response && response.data) {
          buttonLinks.value = response.data.map(link => ({
            id: link.linkId,
            name: link.name,
            link: link.link,
            description: link.description
          }));
        }
      } catch (error) {
        console.error('Failed to fetch button links:', error);
        message.error('加载按钮链接失败');
        buttonLinks.value = [];
      } finally {
        buttonLinksLoading.value = false;
      }
    };

    // 编辑按钮链接
    const editButtonLink = (record) => {
      editingButtonLink.value = record;
      linkForm.value = {
        name: record.name,
        link: record.link,
        description: record.description
        // 不设置 category
      };
      linkModalVisible.value = true;
    };

    // 修正删除按钮链接的方法，使用 linkId 而不是 id
    const deleteButtonLink = async (record) => {
      try {
        console.log('currentRecord', record);
        await apiClient.deletePageButtonLink(record.id);
        message.success('Button link deleted successfully');
        await fetchButtonLinks();
      } catch (error) {
        message.error('Failed to delete button link');
      }
    };

    // 添加 banner 相关配置
    const bannerTheme = {
      primary: '#38BDF8',
      secondary: '#818CF8',
      background: 'linear-gradient(135deg, #1a1a1a, #2d3748)',
      textColor: '#FFFFFF',
      descriptionColor: '#94A3B8',
      badgeColor: '#94A3B8',
      badgeBackground: 'rgba(255, 255, 255, 0.05)',
      badgeHoverBackground: 'rgba(56, 189, 248, 0.1)',
      badgeHoverColor: '#38BDF8',
      iconBackground: 'rgba(255, 255, 255, 0.1)',
    }

    const mediaLoading = ref(false);
    const knowledgeLoading = ref(false); // 新增 knowledge base 专用的 loading

    // Add to setup
    const initializingKnowledge = ref(false);

    // Add initialization method
    const initializeKnowledgeBase = async () => {
      try {
        initializingKnowledge.value = true;
        const customerId = localStorage.getItem('currentCustomerId');
        await apiClient.initializeKnowledgeBase(customerId);
        message.success('Knowledge base initialization started. Please refresh the page later to check progress.');
        // Refresh knowledge base status
        await initKnowledgeBase();
      } catch (error) {
        console.error('Failed to initialize knowledge base:', error);
        message.error('Failed to initialize knowledge base. Please try again later.');
      } finally {
        initializingKnowledge.value = false;
      }
    };

    const getKnowledgeStatusMessage = (step) => {
      switch (step) {
        case 'content':
          return {
            title: '🔍 Analyzing Website Content',
            description: 'Scanning and extracting valuable information from your website'
          };
        case 'vector2':
          return {
            title: '🎯 Vectorizing Content',
            description: 'Converting content into AI-readable semantic vectors'
          };
        case 'analyzing':
          return {
            title: '🧠 Processing Knowledge Base',
            description: 'Organizing and structuring content for optimal retrieval'
          };
        case 'embedding':
          return {
            title: '🎯 Generating Embeddings',
            description: 'Creating AI-powered semantic understanding of your content'
          };
        case 'end':
          return {
            title: '✅ Processing Complete',
            description: 'Your knowledge base is ready to use'
          };
        default:
          return {
            title: '⚡ Preparing Analysis',
            description: 'Initializing knowledge base processing'
          };
      }
    };

    // 添加重新获取知识库的相关状态
    const regrabLoading = ref(false);

    // 添加重新获取知识库的方法
    const regrabKnowledgeBase = async () => {
      try {
        regrabLoading.value = true;
        // 调用重新生成知识库的 API
        await apiClient.rebuildKnowledge();
        
        message.success('Knowledge base regeneration started');
        
        // 重置知识库状态并开始轮询
        processingKnowledge.value = true;
        knowledgeStatus.value = '';
        await initKnowledgeBase();
      } catch (error) {
        console.error('Failed to regrab knowledge base:', error);
        message.error('Failed to regrab knowledge base');
      } finally {
        regrabLoading.value = false;
      }
    };

    const getQualityPercentage = (articles, grade) => {
      const totalArticles = articles.length;
      const gradeArticles = articles.filter(article => article.grade === grade);
      return totalArticles > 0 ? (gradeArticles.length / totalArticles) * 100 : 0;
    };

    const getCompletionRate = (articles) => {
      const totalArticles = articles.length;
      const completedArticles = articles.filter(article => article.content);
      return totalArticles > 0 ? (completedArticles.length / totalArticles) * 100 : 0;
    };

    const getQualityDescription = (grade) => {
      switch (grade) {
        case 'A':
          return 'Excellent';
        case 'B':
          return 'Good';
        case 'C':
          return 'Fair';
        case 'D':
          return 'Poor';
        default:
          return 'Unknown';
      }
    };

    const getQualityClass = (grade) => {
      switch (grade) {
        case 'A':
          return 'excellent-article';
        case 'B':
          return 'good-article';
        case 'C':
          return 'fair-article';
        case 'D':
          return 'poor-article';
        default:
          return '';
      }
    };

    const showRegrabConfirm = () => {
      Modal.confirm({
        title: 'Confirm Regrab',
        content: 'This will re-analyze all your website content. The process may take several minutes. Do you want to continue?',
        okText: 'Yes, Continue',
        cancelText: 'Cancel',
        okButtonProps: {
          style: {
            background: 'linear-gradient(135deg, #1890ff, #3B82F6)',
            border: 'none'
          }
        },
        onOk: regrabKnowledgeBase
      });
    };

    // Add new reactive variables
    const knowledgeModalVisible = ref(false)
    const knowledgeSaving = ref(false)

    // Add new methods for modal handling
    const handleKnowledgeSave = async () => {
      if (!currentArticle.value) return;

      knowledgeSaving.value = true;
      try {
        const updateData = {
          grade: currentArticle.value.grade || 'C',
          title: currentArticle.value.title,
          description: currentArticle.value.description,
          source: currentArticle.value.source,
          content: editableContent.value,
          tags: currentArticle.value.tags || [],
          category: currentArticle.value.label
        };

        let response;
        if (currentArticle.value.contentId) {
          // 更新现有文章
          response = await apiClient.updateKnowledge(currentArticle.value.contentId, updateData);
        } else {
          // 创建新文章
          response = await apiClient.createKnowledge(updateData);
        }

        if (response && response.code === 200) {
          message.success(currentArticle.value.contentId ? 'Article updated successfully' : 'Article created successfully');
          knowledgeModalVisible.value = false;
          // 保存后重新获取知识库内容
          const centerData = await getKnowledgeCenter();
          if (centerData && Array.isArray(centerData)) {
            groupArticlesByLabel(centerData);
          }
        } else {
          message.error('Operation failed: ' + (response?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Failed to save article:', error);
        message.error('Failed to save changes');
      } finally {
        knowledgeSaving.value = false;
      }
    };

    const handleKnowledgeCancel = () => {
      knowledgeModalVisible.value = false
      editableContent.value = currentArticle.value?.content || ''
    }

    // 添加删除文章的方法
    const deleteArticle = async (contentId) => {
      try {
        const response = await apiClient.deleteKnowledge(contentId);
        if (response && response.code === 200) {
          message.success('Article deleted successfully');
          // 删除后重新获取知识库内容
          const centerData = await getKnowledgeCenter();
          if (centerData && Array.isArray(centerData)) {
            groupArticlesByLabel(centerData);
          }
        } else {
          message.error('Failed to delete article');
        }
      } catch (error) {
        console.error('Failed to delete article:', error);
        message.error('Failed to delete article');
      }
    };

    // 添加删除确认对话框
    const showDeleteConfirm = (article) => {
      Modal.confirm({
        title: 'Delete Article',
        content: 'Are you sure you want to delete this article?',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          await deleteArticle(article.contentId);
        },
      });
    };

    const showAddArticle = (category) => {
      currentArticle.value = {
        title: '',
        description: '',
        source: '',
        content: '',
        tags: [],
        label: category,
        grade: 'C' // 新文章默认等级
      };
      editableContent.value = '';
      knowledgeModalVisible.value = true;
    };

    // 新增: favicon相关的响应式变量
    const faviconPreviews = ref({
      tab: null,
      taskbar: null,
      ios: null
    });

    const faviconInputs = {
      tab: ref(null),
      taskbar: ref(null),
      ios: ref(null)
    };

    // 添加文件输入引用的定义
    const tabInput = ref(null);
    const taskbarInput = ref(null);
    const iosInput = ref(null);

    // 使用已定义的 triggerFaviconUpload 方法
    const triggerFaviconUpload = (type) => {
      const inputRefs = {
        tab: tabInput,
        taskbar: taskbarInput,
        ios: iosInput
      };
      
      if (inputRefs[type]?.value) {
        inputRefs[type].value.click();
      }
    };

    // 新增: 处理favicon文件选择
    const handleFaviconChange = async (e, type) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!['image/png', 'image/x-icon'].includes(file.type)) {
        message.error('Please upload PNG or ICO format images');
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        message.error('File size cannot exceed 1MB');
        return;
      }

      // Validate image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = async () => {
        let isValid = true;
        let errorMessage = '';

        // Validate dimensions based on type
        switch (type) {
          case 'tab':
            if (img.width !== 16 || img.height !== 16) {
              isValid = false;
              errorMessage = 'Browser tab icon must be 16x16 pixels';
            }
            break;
          case 'taskbar':
            if (img.width !== 32 || img.height !== 32) {
              isValid = false;
              errorMessage = 'Windows taskbar icon must be 32x32 pixels';
            }
            break;
          case 'ios':
            if (img.width !== 180 || img.height !== 180) {
              isValid = false;
              errorMessage = 'iOS home screen icon must be 180x180 pixels';
            }
            break;
        }

        if (!isValid) {
          message.error(errorMessage);
          return;
        }

        try {
          loading.value = true;
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await apiClient.uploadFavicon(formData, type);
          
          if (response) {
            message.success('Uploaded successfully');
            // Refresh all favicons after successful upload
            await fetchFavicons();
          }
        } catch (error) {
          console.error('Failed to upload favicon:', error);
          message.error('Failed to upload favicon. Please try again.');
        } finally {
          loading.value = false;
          // Clear input value to allow uploading the same file again
          if (faviconInputs[type].value) {
            faviconInputs[type].value.value = '';
          }
        }
      };

      img.onerror = () => {
        message.error('Failed to load image. Please ensure the uploaded file is a valid image.');
      };
    };

    // 修改: 获取favicon的方法
    const fetchFavicons = async () => {
      try {
        faviconLoading.value = true;
        const response = await apiClient.getProductsByCustomerId();
        
        if (response?.data) {
          faviconPreviews.value = {
            tab: response.data.favicon || null,
            taskbar: response.data.windowIcon || null, 
            ios: response.data.iosIcon || null
          };
        }
      } catch (error) {
        console.error('获取favicon失败:', error);
        message.error('加载favicon失败');
      } finally {
        faviconLoading.value = false;
      }
    };

    const faviconLoading = ref(false);

    // 分别存储图片和视频数据
    const images = ref([])
    const videos = ref([])

    // 分别存储图片和视频的加载状态
    const imagesLoading = ref(false)
    const videosLoading = ref(false)

    // 分别存储图片和视频的分页数据
    const imagesPagination = ref({
      currentPage: 1,
      pageSize: 12,
      total: 0
    })

    const videosPagination = ref({
      currentPage: 1,
      pageSize: 12,
      total: 0
    })

    // 分别获取图片和视频数据
    const fetchImages = async () => {
      imagesLoading.value = true;
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getMedia(
          customerId,
          'image',
          selectedCategory.value === 'all' ? null : selectedCategory.value,
          imagesPagination.value.currentPage,
          imagesPagination.value.pageSize
        );
        
        if (response.data) {
          images.value = response.data.map(item => ({
            id: item.mediaId,
            type: 'image',
            name: item.mediaName,
            url: item.mediaUrl,
            categoryId: item.categoryId,
            description: item.description,
            categoryName: item.categoryName,
            uploadTime: new Date().toISOString(),
            size: 0,
          }));
          imagesPagination.value.total = response.TotalCount || 0;
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
        message.error('Failed to load images');
      } finally {
        imagesLoading.value = false;
      }
    };

    const fetchVideos = async () => {
      videosLoading.value = true;
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getMedia(
          customerId,
          'video',
          selectedCategory.value === 'all' ? null : selectedCategory.value,
          videosPagination.value.currentPage,
          videosPagination.value.pageSize
        );
        
        if (response.data) {
          videos.value = response.data.map(item => ({
            id: item.mediaId,
            type: 'video',
            name: item.mediaName,
            url: item.mediaUrl,
            categoryId: item.categoryId,
            description: item.description,
            categoryName: item.categoryName,
            uploadTime: new Date().toISOString(),
            size: 0,
            duration: 0
          }));
          videosPagination.value.total = response.TotalCount || 0;
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        message.error('Failed to load videos');
      } finally {
        videosLoading.value = false;
      }
    };

    // 分页处理方法
    const handleImagesPageChange = (page, size) => {
      imagesPagination.value.currentPage = page;
      imagesPagination.value.pageSize = size || imagesPagination.value.pageSize;
      fetchImages();
    };

    const handleVideosPageChange = (page, size) => {
      videosPagination.value.currentPage = page;
      videosPagination.value.pageSize = size || videosPagination.value.pageSize;
      fetchVideos();
    };

    const handleImagesSizeChange = (current, size) => {
      imagesPagination.value.currentPage = 1;
      imagesPagination.value.pageSize = size;
      fetchImages();
    };

    const handleVideosSizeChange = (current, size) => {
      videosPagination.value.currentPage = 1;
      videosPagination.value.pageSize = size;
      fetchVideos();
    };

    // 监听标签页切换
    watch(activeTab, (newValue) => {
      if (newValue === 'images') {
        fetchImages();
      } else if (newValue === 'videos') {
        fetchVideos();
      }
      // ... 其他标签页的处理 ...
    });

    return {
      domainConfigured,
      loading,
      goToDashboard,
      activeTab,
      loading,
      assets,
      fetchAssets,
      filteredAssets,
      previewVisible,
      selectedAsset,
      categories,
      selectedCategory,
      selectedKeys,
      categoryModalVisible,
      categoryForm,
      showAddCategory,
      handleAddCategory,
      deleteCategory,
      editCategoryModalVisible,
      handleEditCategory,
      showEmptyState,
      uploadModalVisible,
      uploadFile,
      previewUrl,
      fileInput,
      showUploadModal,
      triggerFileInput,
      handleFileChange,
      removeUpload,
      handleUploadOk,
      handleUploadCancel,
      uploading,
      deleteAsset,
      startEditing,
      previewAsset,
      closePreview,
      linkCategories,
      selectedLinkCategory,
      linkColumns,
      editLink,
      linksLoading,
      showAddLinkModal,
      deleteLink,
      internalLinks,
      linkModalVisible,
      linkSubmitting,
      linkFormRef,
      linkForm,
      linkFormRules,
      isLinkFormValid,
      editingLink,
      handleLinkModalOk,
      handleLinkModalCancel,
      mediaForm,
      mediaFormRules,
      mediaFormRef,
      isMediaFormValid,
      editModalVisible,
      editSubmitting,
      editFormRef,
      editForm,
      isEditFormValid,
      handleEditOk,
      handleEditCancel,
      assetInfo,
      goToHelpCenter,
      groupedArticles,
      currentArticle,
      editableContent,
      saving,
      selectArticle,
      clearCurrentArticle,
      getCategoryStats,
      pollTimer,
      knowledgeStatus,
      knowledgeTime,
      processingKnowledge,
      headerLoading,
      footerLoading,
      headerConfig,
      layoutId,
      footerConfig, 
      buttonLinksLoading,
      buttonLinks,
      buttonLinkColumns,
      editButtonLink,
      deleteButtonLink,
      currentPage,
      pageSize,
      total,
      handlePageChange,
      handleSizeChange,
      bannerTheme,
      AppstoreOutlined,
      mediaLoading,
      initializingKnowledge,
      initializeKnowledgeBase,
      getKnowledgeStatusMessage,
      knowledgeLoading,
      regrabLoading,
      regrabKnowledgeBase,
      getQualityPercentage,
      getCompletionRate,
      getQualityDescription,
      getQualityClass,
      showRegrabConfirm,
      knowledgeModalVisible,
      knowledgeSaving,
      handleKnowledgeSave,
      handleKnowledgeCancel,
      deleteArticle,
      showDeleteConfirm,
      showAddArticle,
      faviconPreviews,
      faviconInputs,
      triggerFaviconUpload,
      handleFaviconChange,
      tabInput,
      taskbarInput,
      iosInput,
      faviconLoading,
      images,
      imagesLoading,
      videos,
      videosLoading,
      imagesPagination,
      videosPagination,
      fetchImages,
      fetchVideos,
      handleImagesPageChange,
      handleVideosPageChange,
      handleImagesSizeChange,
      handleVideosSizeChange,
    }
  }
}
</script>

<style scoped>
.page-content {
  display: flex;
  gap: 24px;
}

.assets-content {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 0px 0px 12px 0px;
  position: relative;
  min-height: calc(100vh - 300px);
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-right {
  display: flex;
  justify-content: flex-end;
}

.ai-analyze-btn {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  height: 32px;
  padding: 0px 12px;
  border-radius: 16px;
}

.ai-analyze-btn:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-content .anticon {
  font-size: 14px;
  margin-right: 4px;
}

.asset-card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
}

.asset-preview {
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  position: relative;
  cursor: pointer;
}

.asset-preview img,
.asset-preview video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.asset-info {
  padding: 12px;
}

.asset-info h4 {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
}

.asset-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #6B7280;
}

.asset-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.asset-card:hover .asset-actions {
  opacity: 1;
}

.delete-btn {
  padding: 4px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.delete-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #ff4d4f;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  min-height: calc(100vh - 200px);
}

.empty-state-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.empty-state-description {
  font-size: 16px;
  color: #6b7280;
  max-width: 400px;
  margin-bottom: 24px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .controls-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .assets-grid [class*='ant-col'] {
    width: 100%;
  }
}

.asset-tabs {
  flex: 1;
}

.asset-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.asset-card:hover .asset-overlay {
  opacity: 1;
}

.preview-icon {
  color: white;
  font-size: 24px;
}

.asset-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
}

.upload-time {
  color: #6b7280;
  font-size: 13px;
}

.asset-usage {
  color: #4b5563;
  font-size: 12px;
  margin: 4px 0;
  line-height: 1.4;
}

.asset-name {
  flex: 1;
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-modal {
  text-align: center;
}

.preview-image,
.preview-video {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

:deep(.ant-tabs-nav) {
  margin: 0;
}

:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-tabs-ink-bar) {
  background: #3B82F6 !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #3B82F6 !important;
}

:deep(.ant-tabs-tab:hover) {
  color: #60A5FA !important;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: 1px solid #E5E7EB;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 16px !important;
}

/* 确保加载状态在内容区域完全居中 */
.assets-grid {
  min-height: calc(100vh - 300px); /* 调整高度以应你的布局 */
  position: relative;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
}

:deep(.ant-spin) {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

:deep(.ant-spin-spinning) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 确保空状态和加载状态容器高度一致 */
.empty-state {
  min-height: calc(100vh - 300px);
}

.upload-container {
  padding: 20px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #3B82F6;
}

.upload-icon {
  font-size: 32px;
  color: #3B82F6;
  margin-bottom: 8px;
}

.upload-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.preview-wrapper {
  margin-bottom: 16px;
}

.upload-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.asset-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-name {
  flex: 1;
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-name-btn,
.delete-btn {
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-popconfirm-message) {
  padding: 16px 16px 8px;
}

:deep(.ant-popconfirm-message-title) {
  font-size: 14px;
  color: #1a1a1a;
}

:deep(.ant-popconfirm-buttons) {
  padding: 8px 16px 16px;
}

:deep(.ant-popconfirm-buttons .ant-btn-default) {
  border-color: #E5E7EB;
}

:deep(.ant-popconfirm-buttons .ant-btn-default:hover) {
  color: #3B82F6;
  border-color: #3B82F6;
}

:deep(.ant-table) {
  padding: 0 24px;
}

:deep(.ant-table-thead > tr > th) {
  background: #f9fafb;
  font-weight: 600;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #f3f4f6;
}

:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-modal-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
}

.media-form {
  margin-top: 16px;
  margin-bottom: 16px;
}

.preview-wrapper {
  margin-bottom: 16px;
  text-align: center;
}

.upload-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.asset-description {
  font-size: 12px;
  color: #666;
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-btn {
  padding: 4px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.kb-module {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.info-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
  font-weight: 600;
}

.beta-tag {
  background: #1890ff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.ai-preview-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.6rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.text-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.text-controls h3 {
  margin: 0;
  font-size: 1.1rem;
}

.help-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
}

.upload-integration {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px dashed #e2e8f0;
}

.mini-features {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mini-features span {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .text-controls {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .upload-integration {
    text-align: center;
  }

  .mini-features {
    justify-content: center;
  }

  .mini-features span:nth-child(even) {
    display: none;
  }
}

.main-content {
  width: 100%;
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #F9FAFB;
  transition: all 0.3s ease;
}

.article-content {
  flex: 1;
  cursor: pointer;
}

.delete-btn {
  padding: 4px;
  height: 32px;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.1);
}

.status-dot {
  flex-shrink: 0; /* Prevent dot from shrinking */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
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
.status-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.status-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.status-green {
  background-color: #52c41a;
}

.status-yellow {
  background-color: #faad14;
}

.status-red {
  background-color: #ff4d4f;
}

.category-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.article-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #F9FAFB;
  transition: all 0.3s ease;
}

.article-content {
  flex: 1;
  cursor: pointer;
}

.delete-btn {
  padding: 4px;
  height: 32px;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.1);
}

.status-dot {
  flex-shrink: 0; /* Prevent dot from shrinking */
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

:deep(.ant-alert-info) {
  border: 1px solid #e6f4ff;
  background-color: #f0f7ff;
}

:deep(.ant-alert-message) {
  color: #1890ff;
  font-weight: 500;
}

.knowledge-alert {
  border: 1px solid #bae0ff;
  background: #fff;
  border-radius: 12px;
  padding: 0 !important;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0 8px;
}

.highlight-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f7ff;
  padding: 16px;
  border-radius: 8px;
}

.ai-icon {
  font-size: 24px;
}

.highlight-message p {
  margin: 0;
  font-size: 15px;
  color: #262626;
  line-height: 1.5;
}

.quality-indicators {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator span {
  font-size: 14px;
  color: #434343;
}

.action-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff7e6;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #ffd591;
}

.attention-icon {
  font-size: 20px;
}

.action-message p {
  margin: 0;
  font-size: 14px;
  color: #d46b08;
  font-weight: 500;
}

.highlight {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.highlight.yellow {
  background: rgba(250, 173, 20, 0.1);
  color: #d48806;
}

.highlight.red {
  background: rgba(255, 77, 79, 0.1);
  color: #cf1322;
}

:deep(.ant-alert-info) {
  border: none;
}

:deep(.ant-alert-message) {
  margin-bottom: 0;
}

:deep(.ant-alert-description) {
  color: #434343;
}

.kb-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f7ff;
  padding: 12px 16px;
  border-radius: 8px;
  gap: 16px;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.status-message p {
  margin: 0;
  font-size: 14px;
  color: #262626;
  line-height: 1.4;
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(0,0,0,0.06);
}

.indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.indicator span {
  font-size: 13px;
  color: #434343;
  white-space: nowrap;
}

.attention-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #d46b08;
  font-size: 13px;
  padding-left: 16px;
  border-left: 1px solid rgba(0,0,0,0.06);
}

.attention-icon {
  font-size: 16px;
}

@media (max-width: 1024px) {
  .kb-status-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-indicators {
    padding-left: 0;
    border-left: none;
    padding-top: 12px;
    border-top: 1px solid rgba(0,0,0,0.06);
    width: 100%;
    flex-wrap: wrap;
  }
  
  .attention-hint {
    padding-left: 0;
    border-left: none;
  }
}

.traffic-light-descriptions {
  margin-bottom: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.traffic-light-descriptions p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-green {
  background-color: #52c41a;
}

.status-yellow {
  background-color: #faad14;
}

.status-red {
  background-color: #ff4d4f;
}

/* 重命名为更通用的类名，因为这个样式被 header 和 footer 共用 */
.header-footer-content {
  background: white;
  border-radius: 12px;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.section-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

/* 添加预览相关样式 */
.preview-sections {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.preview-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.preview-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.preview-container {
  width: 100%;
  background: #fff;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  text-align: center;
  margin-bottom: 16px;
}

/* 调整预览容器中的组件样式 */
.preview-container :deep(.fixed) {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
}

/* 添加新样式 */
.preview-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header-content h4 {
  margin: 0;
}

/* 添加分页样式 */
.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  padding-bottom: 24px;
}

/* 添加教程按钮样式 */
.tutorial-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  padding: 0;
  height: auto;
  transition: all 0.3s ease;
  text-shadow: 0 0 1px rgba(24, 144, 255, 0.1);
  position: relative;
  
  /* 柔和的发光动画 */
  animation: glow 3s ease-in-out infinite alternate;
  
  &:hover {
    color: #40a9ff;
    background: transparent;
    text-shadow: 0 0 6px rgba(24, 144, 255, 0.3);
    
    :deep(.anticon) {
      transform: rotate(12deg);
      filter: drop-shadow(0 0 4px rgba(24, 144, 255, 0.2));
    }
  }
  
  :deep(.anticon) {
    font-size: 16px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 2px rgba(24, 144, 255, 0.2));
  }
}

/* 柔和的发光动画 */
@keyframes glow {
  from {
    text-shadow: 0 0 1px rgba(24, 144, 255, 0.1),
                 0 0 2px rgba(24, 144, 255, 0.1);
  }
  to {
    text-shadow: 0 0 2px rgba(24, 144, 255, 0.2),
                 0 0 4px rgba(24, 144, 255, 0.2);
  }
}

/* 修改层级控制样式 */
.main-tabs {
  position: relative;
  z-index: 1;
}

.main-tabs :deep(.ant-tabs-nav) {
  position: relative;
  z-index: 1;
}

.main-tabs :deep(.ant-tabs-nav-list) {
  position: relative;
  z-index: 1;
}

.main-tabs :deep(.ant-tabs-nav-list .ant-tabs-tab) {  
  position: relative;
  z-index: 10001;  /* 确保标签在遮罩层之上 */
}

/* 关键是这个！当元素被教程高亮时的样式 */
:deep(.ant-tabs-nav-list .ant-tabs-tab.tutorial-highlight) {  
  z-index: 10002;  /* 高亮时确保在遮罩层之上 */
  background: white;  /* 确保背景是白色 */
  position: relative;
}

/* 其他元素保持在遮罩层之下 */
.category-card,
.assets-grid,
.pagination-wrapper {
  position: relative;
  z-index: 1;
}

/* 这才是关键！确保 tutorial-highlight 类的样式能正确应用 */
:deep(.tutorial-highlight) {
  position: relative;
  z-index: 10002;
  background: white;
}

.upload-btn-empty {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  font-weight: 500;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-btn-empty:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.knowledge-base-container {
  margin-bottom: 24px;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 改为3列 */
  gap: 24px;
  padding: 0 24px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-state h3 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 16px;
  font-weight: 600;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.init-button {
  height: 40px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 6px;
  background: linear-gradient(135deg, #1890ff, #3B82F6);
  border: none;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.init-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
  background: linear-gradient(135deg, #40a9ff, #60a5fa);
}

.init-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
}

.init-button .anticon {
  margin-right: 8px;
}
.knowledge-processing-card {
  margin: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  text-align: center;
}

.processing-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 24px;
}

.status-info {
  margin-bottom: 24px;
}

.status-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.status-description {
  font-size: 16px;
  color: #666;
  max-width: 500px;
}

.processing-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.processing-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8c8c8c;
  font-size: 14px;
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 6px;
}

.unified-loading {
  min-height: calc(100vh - 300px);
  display: flex;
  flex-direction: column;
}

:deep(.unified-loading .ant-spin-container) {
  height: 100%;
}

:deep(.unified-loading .ant-spin) {
  max-height: none;
}

:deep(.unified-loading .ant-spin-spinning) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 确保内容在 loading 时保持正确的布局 */
:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.quality-bar {
  height: 4px;
  display: flex;
  margin: 8px 0;
  border-radius: 2px;
  overflow: hidden;
}

.bar-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.quality-icon {
  font-size: 16px;
  margin-right: 8px;
}

.article-item {
  display: flex;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.article-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
}

.article-empty {
  color: #ff4d4f;
  font-style: italic;
}

.knowledge-intro {
  padding: 0 24px;
}

.intro-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4d4f;
  font-weight: 600;
}

.warning-icon {
  font-size: 18px;
  color: #ff4d4f;
}

.intro-content {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
}

.quality-alert {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
  margin-bottom: 20px;
}

.alert-main {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.alert-title {
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 16px;
  font-size: 14px;
}

.quality-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-grade {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  color: white;
}

.stat-value {
  font-size: 14px;
  color: #1f1f1f;
  font-weight: 500;
}

.excellent { background-color: #52c41a; }
.good { background-color: #1890ff; }
.fair { background-color: #faad14; }
.poor { background-color: #ff4d4f; }

.alert-message {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  padding: 12px 16px;
}

.message-title {
  color: #cf1322;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.message-text {
  color: #434343;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.quality-tips {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.tip-item {
  color: #434343;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.alert-message {
  display: flex;
  gap: 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  padding: 16px;
  border-radius: 8px;
}

.quality-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-grade {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  color: #fff;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.excellent {
  background: linear-gradient(135deg, #34D399, #6EE7B7); /* 柔和的薄荷绿渐变 */
}

.good {
  background: linear-gradient(135deg, #60A5FA, #93C5FD); /* 淡雅的天空蓝渐变 */
}

.fair {
  background: linear-gradient(135deg, #FBBF24, #FCD34D); /* 温暖的向日葵黄渐变 */
}

.poor {
  background: linear-gradient(135deg, #F87171, #FCA5A5); /* 柔和的珊瑚红渐变 */
}

.alert-icon {
  font-size: 20px;
  color: #ff4d4f;
  flex-shrink: 0;
  margin-top: 2px;
}

.message-content {
  flex: 1;
}

.message-title {
  font-weight: 600;
  color: #ff4d4f;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.message-text {
  margin: 0;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.5;
}

.quality-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 13px;
}

.tip-icon {
  color: #52c41a;
  font-size: 14px;
}

:deep(.ant-collapse) {
  background: transparent !important;
  border: none !important;
}

:deep(.ant-collapse-header) {
  padding: 8px 0 !important;
}

:deep(.ant-collapse-content) {
  background: transparent !important;
}

:deep(.ant-collapse-content-box) {
  padding: 12px 0 !important;
}

:deep(.ant-collapse-arrow) {
  color: #ff4d4f !important;
}

.quality-bar {
  flex: 1;
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  display: flex;
  overflow: hidden;
}

.bar-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.bar-segment.excellent {
  background-color: #10B981; /* 绿色 */
}

.bar-segment.good {
  background-color: #3B82F6; /* 蓝色 */
}

.bar-segment.fair {
  background-color: #F59E0B; /* 橙色 */
}

.bar-segment.poor {
  background-color: #EF4444; /* 红色 */
}

.completion-rate {
  font-size: 12px;
  color: #6B7280;
  white-space: nowrap;
  min-width: 80px;  /* 确保有足够空间显示百分比 */
}

.category-header {
  display: flex;
  flex-direction: column;  /* 改为纵向布局 */
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.category-header h2 {
  margin: 0;
  font-size: 14px;  /* 缩小标题字体 */
  font-weight: 600;
  color: #1F2937;
}

.quality-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;  /* 确保占满整行 */
}

.quality-bar {
  flex: 1;
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  display: flex;
  overflow: hidden;
}

/* 适配移动端 */
@media (max-width: 1200px) {
  .knowledge-grid {
    grid-template-columns: repeat(2, 1fr);  /* 平板上显示2列 */
  }
}

@media (max-width: 768px) {
  .knowledge-grid {
    grid-template-columns: 1fr;  /* 手机上显示1列 */
  }
}

/* 添加质量指标相关的样式 */
.quality-indicator {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.quality-icon {
  font-size: 16px;
}

/* 不同等级的颜色样式 */
.quality-icon.excellent {
  color: #22C55E; /* 绿色 - A级 */
}

.quality-icon.good {
  color: #3B82F6; /* 蓝色 - B级 */
}

.quality-icon.fair {
  color: #F59E0B; /* 橙色 - C级 */
}

.quality-icon.poor {
  color: #EF4444; /* 红色 - D级 */
}

/* 文章项的样式 */
.article-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #F9FAFB;
  transition: all 0.3s ease;
}

.article-item:hover {
  background: #F3F4F6;
}

.article-content {
  flex: 1;
}

.article-content h3 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1F2937;
}

.article-preview {
  margin: 0;
  font-size: 12px;
  color: #6B7280;
  line-height: 1.5;
}

.article-empty {
  margin: 0;
  font-size: 12px;
  color: #9CA3AF;
  font-style: italic;
}

/* 不同质量等级的文章背景样式 */
.excellent-article {
  border-left: 3px solid #22C55E;
}

.good-article {
  border-left: 3px solid #3B82F6;
}

.fair-article {
  border-left: 3px solid #F59E0B;
}

.poor-article {
  border-left: 3px solid #EF4444;
}

.article-info-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.content-editor {
  margin-top: 16px;
}

.editor-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

/* Quality grade styles */
.excellent-article {
  color: #52c41a;
}

.good-article {
  color: #1890ff;
}

.fair-article {
  color: #faad14;
}

.poor-article {
  color: #ff4d4f;
}

.content-editor :deep(.large-textarea) {
  min-height: 500px;  /* 设置最小高度 */
}

.content-editor :deep(.ant-input) {
  font-size: 14px;
  line-height: 1.6;
  padding: 12px 16px;  /* 增加内边距 */
}

.header-actions {
  margin-left: auto;
  margin-right: 16px;
}

.header-actions .ant-btn {
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-actions .ant-btn:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.category-footer {
  padding: 8px 0;
  display: flex;
  justify-content: flex-start;
}

.category-footer .ant-btn {
  padding-left: 0;
  color: #3B82F6;
}

.category-footer .ant-btn:hover {
  color: #2563EB;
}

.info-value .ant-input {
  width: 100%;
}

/* Add new styles */
.favicon-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 24px;
}

.preview-section {
  padding: 12px;
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.preview-devices {
  display: flex;
  gap: 48px;
  align-items: flex-start;
  margin-top: 24px;
}

.device-preview {
  flex: 1;
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.preview-header {
  margin-bottom: 24px;
  text-align: center;
}

.preview-header h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.size-hint {
  color: #6b7280;
  font-size: 13px;
  margin: 0 0 16px;
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 16px;
  display: inline-block;
}

.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: white;
}

.upload-area:hover {
  border-color: #60a5fa;
  background: #f8fafc;
}

.upload-icon {
  font-size: 24px;
  color: #60a5fa;
}

.preview-img {
  max-width: 64px;
  height: 64px;
  object-fit: contain;
}

.preview-display {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

/* Browser Tab Preview */
.browser-chrome {
  background: #f1f3f4;
  border-radius: 8px 8px 0 0;
  padding: 8px;
  width: 240px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab {
  background: white;
  border-radius: 8px 8px 0 0;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Windows Taskbar Preview */
.windows-taskbar {
  background: #1f1f1f;
  padding: 12px;
  border-radius: 8px;
  width: 200px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* iOS Preview */
.ios-home {
  background: linear-gradient(135deg, #f8fafc, #e5e7eb);
  padding: 24px;
  border-radius: 16px;
  width: 180px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ios-app-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: block;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .preview-devices {
    flex-direction: column;
    gap: 32px;
  }
  
  .device-preview {
    width: 100%;
  }
  
  .favicon-content {
    margin: 16px;
  }
}

/* Add new styles */
.preview-description {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.preview-description p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  text-align: left;
}

/* 添加放大镜效果相关样式 */
.preview-container {
  position: relative;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  position: relative;
  cursor: zoom-in;
}

.preview-icon {
  width: auto;
  height: auto;
  object-fit: contain;
}

/* 放大镜效果 */
.magnifier {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
  transition: opacity 0.2s, transform 0.2s;
  z-index: 100;
  
  /* 添加放大镜内的图标样式 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.magnifier img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.icon-wrapper:hover .magnifier {
  opacity: 1;
  transform: translate(-50%, -150%) scale(1);
}

/* 为不同尺寸的图标设置合适的预览尺寸 */
.tab-preview {
  width: 16px;
  height: 16px;
}

.taskbar-preview {
  width: 32px;
  height: 32px;
}

.ios-preview {
  width: 180px;
  height: 180px;
}
</style> 