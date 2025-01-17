import axios from 'axios';

// 创建一个 axios 实例
const apiClient = axios.create({
  // baseURL: 'http://106.15.94.148:7070/v1', // 替换为实际的 API 基础地址
  baseURL: 'https://strapi.sheet2email.com/v1', // 替换为实际的 API 基础地址
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const vercelApiClient = axios.create({
  baseURL: 'https://api.vercel.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer 3LSBxZQ35VdhqRW7tzGs1oYo',
    'Content-Type': 'application/json',
  },
});

// 不需要 token 的接口列表
const noAuthUrls = ['/login'];

apiClient.interceptors.request.use(
    config => {
        if (!noAuthUrls.includes(config.url)) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
          // 只清除认证相关的存储项
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentCustomerId');

          // 添加一个标志来防止重复导航
          if (!window.isNavigatingToLogin) {
            window.isNavigatingToLogin = true;
            
            if (window.location.pathname !== '/login') {
              // 使用 replace 而不是普通导航，这样不会保留在历史记录中
              window.location.replace('/login');
            }
            
            // 清除标志（虽然在重定向后这个清除可能不会执行）
            setTimeout(() => {
              window.isNavigatingToLogin = false;
            }, 1000);
          }
        }
        return Promise.reject(error);
    }
);

const login = async (email, password) => {
    try {
        const response = await apiClient.post('/login', {email, password});
        return response.data;
    } catch (error) {
        console.error('登录失败:', error);
        return false;
    }
};

const getCategories = async (customerId) => {
  try {
    const response = await apiClient.get(`/categories/${customerId}?categoryName=ArticleType`);
    return response.data;
  } catch (error) {
    console.error('获取文章分类失败:', error);
    return null;
  }
};

const getLinks = async (customerId) => {
  try {
      const response = await apiClient.get(`/links?customerId=${customerId}`);
      return response.data;
  } catch (error) {
      console.error('获取页头页尾链接组失败:', error);
      return null;
  }
};

const postLinks = async (payload) => {
  try {
      const response = await apiClient.post(`/links`, payload);
      return response.data;
  } catch (error) {
      console.error('获取页头页尾链组失败:', error);
      return null;
  }
};

const putLinks = async (groupId, payload) => {
  try {
      const response = await apiClient.put(`/links/${groupId}`, payload);
      return response.data;
  } catch (error) {
      console.error('获取页头页尾链接组失败:', error);
      return null;
  }
};

const deleteGroupLinks = async (groupId) => {
  try {
      const response = await apiClient.delete(`/links/${groupId}`);
      return response.data;
  } catch (error) {
      console.error('删除页头页尾链接组失败:', error);
      return null;
  }
};

const deleteLinks = async (groupId, linkId) => {
  try {
      const response = await apiClient.delete(`/links/${groupId}/${linkId}`);
      return response.data;
  } catch (error) {
      console.error('删除页头页尾链接组失败:', error);
      return null;
  }
};

const getKeywords = async (customerId) => {
  try {
    const response = await apiClient.get(`/keywords/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('获取关键词失败:', error);
    return null;
  }
};

const addKeyword = async (keywordId, keywordType, term) => {
  try {
    const response = await apiClient.post(`/keywords/${keywordId}/${keywordType}`, 
        {subKeywordId: '', term: term});
    return response.data;
  } catch (error) {
    console.error('添加关键词失:', error);
    throw error;
  }
};

// 新增：删除关键词方法
const deleteKeyword = async (keywordId, keywordType, subKeywordId) => {
  try {
    const response = await apiClient.delete(`/keywords/${keywordId}/${keywordType}/${subKeywordId}`);
    return response.data;
  } catch (error) {
    console.error('删除关键词失败:', error);
    throw error;
  }
};

// 编辑关键词方法
const editKeyword = async (keywordId, keywordType, subKeywordId, term) => {
  try {
    const response = await apiClient.put(`/keywords/${keywordId}/${keywordType}/${subKeywordId}`, 
        {subKeywordId: subKeywordId, term: term});
    return response.data;
  } catch (error) {
    console.error('删除关键词失败:', error);
    throw error;
  }
};

// 新增：获取域名的方法
const getDomains = async (customerId, page, limit) => {
  try {
    const response = await apiClient.get('/domain', {
      params: { customerId, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('获取域名列表失败:', error);
    return null;
  }
};

// 新增：删除域名的方法
const deleteDomain = async (domainId) => {
  try {
    const response = await apiClient.delete(`/domain/${domainId}`);
    return response.data;
  } catch (error) {
    console.error('删除域名失败:', error);
    return null;
  }
};

// 新增：添加域名的方法
const addDomain = async ({ customerId, domainName }) => {
  try {
    const response = await apiClient.post('/domain', { customerId, domainName });
    return response.data;
  } catch (error) {
    console.error('添加域名失败:', error);
    return null;
  }
};

// 新增：删除页面的方法
const deletePage = async (pageId) => {
  try {
    const response = await apiClient.delete(`/pages/${pageId}`);
    return response.data;
  } catch (error) {
    console.error('删除页面失败:', error);
    return null;
  }
};

// 新：更新页面区块的方法
const updateSection = async (sectionId, sectionData) => {
  try {
    const response = await apiClient.put(`/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('更新页面区块失败:', error);
    return null;
  }
};

// 新增：更新页面状态的方法
const updatePageStatus = async (pageId, status, siteURL) => {
  try {
    const response = await apiClient.put(`/pages/${pageId}/${status}`, null, {
      params: { siteURL }
    });
    return response.data;
  } catch (error) {
    console.error('更新页面状态失败:', error);
    return null;
  }
};

// 基本信息
const updatePage = async (pageId, pageData) => {
  try {
    const response = await apiClient.put(`/pages/${pageId}`, pageData);
    return response.data;
  } catch (error) {
    console.error('更新页面基本信息失败:', error);
    return null;
  }
};

// 新增：获取单篇文章的方法
const getArticleById = async (articleId) => {
  try {
    const response = await apiClient.get(`/pages/${articleId}`);
    return response.data;
  } catch (error) {
    console.error('获取文章详情败:', error);
    return null;
  }
};

// 新增：创建产品的方法
const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('创建产品失败:', error);
    return null;
  }
};

// 新增：更新产品的方法
const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('更新产品失败:', error);
    return null;
  }
};

// 新增：根据客户ID获取产品列表的方法
const getProductsByCustomerId = async () => {
  try {
    const response = await apiClient.get(`/products/customer`);
    return response.data;
  } catch (error) {
    console.error('获取客户产品列表失败:', error);
    return null;
  }
};

// 新增：删除产品的方法
const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('删除产品失败:', error);
    return null;
  }
};

// 新增：获取sitemap的方法
const getSitemap = async () => {
  try {
    const response = await apiClient.get(`/products/sitemap`);
    return response.data;
  } catch (error) {
    console.error('获取sitemap失败:', error);
    return null;
  }
};

// 新增：获取帮助中心数据的方法
const getHelpCenterData = async (userName) => {
  try {
    const response = await fetch(`https://strapi.sheet2email.com/v1/${userName}/help-center`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取帮助中心数据失败:', error);
    return null;
  }
};

// 新增：上传媒体文件的方法
const uploadMedia = async (formData) => {
  try {
    const response = await apiClient.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 5 * 60 * 1000, // 设置为 5 分钟
    });
    return response.data;
  } catch (error) {
    console.error('Upload media failed:', error);
    return null;
  }
};

// 新增：获取媒体文件列表的方法
const getMedia = async (customerId, mediaType, categoryId, page, limit) => {
  try {
    const params = {
      customerId,
      page,
      limit,
      ...(mediaType && { mediaType }), 
      ...(categoryId && { categoryId }) 
    };
    
    const response = await apiClient.get('/media', { params });
    return response.data;
  } catch (error) {
    console.error('获取媒体文件列表失败:', error);
    return null;
  }
};

// 新增：删除媒体文件的方法
const deleteMedia = async (mediaId) => {
  try {
    const response = await apiClient.delete(`/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error('删除媒体文件失败:', error);
    return null;
  }
};

// 新增：更新媒体文件的方法
const updateMedia = async (mediaId, mediaData) => {
  try {
    const response = await apiClient.put(`/media/${mediaId}`, mediaData);
    return response.data;
  } catch (error) {
    console.error('Update media failed:', error);
    return null;
  }
};

// GSC 相关接口
const gscAuth = async (customerId) => {
  try {
    const response = await apiClient.get('/auth', {
      params: { customerId }
    });
    return response.data;
  } catch (error) {
    console.error('GSC auth failed:', error);
    return null;
  }
};

const gscCallback = async (code) => {
  try {
    const response = await apiClient.get('/callback', {
      params: { code }
    });
    return response.data;
  } catch (error) {
    console.error('GSC callback failed:', error);
    return null;
  }
};

const getGscSites = async (customerId) => {
  try {
    const response = await apiClient.get('/sites', {
      params: { customerId }
    });
    return response.data;
  } catch (error) {
    console.error('Get GSC sites failed:', error);
    return null;
  }
};

const submitGscSite = async (siteUrl) => {
  try {
    const response = await apiClient.post('/sites', { siteUrl });
    return response.data;
  } catch (error) {
    console.error('Submit GSC site failed:', error);
    return null;
  }
};

const deleteGscSite = async (siteUrl) => {
  try {
    const response = await apiClient.delete('/sites', {
      data: { siteUrl }
    });
    return response.data;
  } catch (error) {
    console.error('Delete GSC site failed:', error);
    return null;
  }
};

const getGscAnalytics = async (customerId, siteUrl) => {
  try {
    const response = await apiClient.get('/sites/analytics', {
      params: { 
        customerId: customerId,
        siteURL: siteUrl,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get GSC analytics failed:', error);
    return null;
  }
};

const checkGscAuth = async (customerId) => {
  try {
    const response = await apiClient.get('/sites/check', {
      params: { customerId }
    });
    return response.data;
  } catch (error) {
    console.error('检查 GSC 授权状态失败:', error);
    return null;
  }
};

// 新增：获取内部链接列表的方法
const getInternalLinks = async (customerId, params = {}) => {
  try {
    const queryParams = {
      customerId,
      page: params.page,
      limit: params.limit,
      ...(params.description && { description: params.description }),
      ...(params.category && { category: params.category })
    };
    
    const response = await apiClient.get('/internal/links', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('获取内部链接列表失败:', error);
    return null;
  }
};

// 新增：创建内部链接的方法
const createInternalLink = async (linkData) => {
  try {
    const response = await apiClient.post('/internal/links', linkData);
    return response.data;
  } catch (error) {
    console.error('创建内部链接失败:', error);
    return null;
  }
};

// 新增：更新内部链接的方法
const updateInternalLink = async (linkId, linkData) => {
  try {
    const response = await apiClient.put(`/internal/links/${linkId}`, linkData);
    return response.data;
  } catch (error) {
    console.error('更新内部链接失败:', error);
    return null;
  }
};

// 新增：删除内部链接的方法
const deleteInternalLink = async (linkId) => {
  try {
    const response = await apiClient.delete(`/internal/links/${linkId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete internal link:', error);
    return null;
  }
};

const addVercelDomain = async (projectId, domainData) => {
  try {
    const response = await vercelApiClient.post(`/v10/projects/${projectId}/domains`, domainData);
    return response.data;
  } catch (error) {
    console.error('添加Vercel域名时出错:', error);
    throw error;
  }
};

const getVercelDomainInfo = async (projectId) => {
  try {
    const response = await vercelApiClient.get(`/v9/projects/${projectId}/domains`);
    return response.data;
  } catch (error) {
    console.error('获取Vercel域名信息失败:', error);
    throw error;
  }
};

const deleteVercelDomain = async (projectId, domainName) => {
  try {
    const response = await vercelApiClient.delete(`/v9/projects/${projectId}/domains/${domainName}`);
    return response.data;
  } catch (error) {
    console.error('删除Vercel域名失败:', error);
    throw error;
  }
};

const getVercelDomainConfig = async (domainName, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.slug && { slug: params.slug }),
      ...(params.strict && { strict: params.strict }),
      ...(params.teamId && { teamId: params.teamId })
    }).toString();
    
    const response = await vercelApiClient.get(
      `/v6/domains/${domainName}/config${queryParams ? `?${queryParams}` : ''}`
    );
    return response.data;
  } catch (error) {
    console.error('获取Vercel域名配置失败:', error);
    throw error;
  }
};

const verifyVercelDomain = async (projectId, domainName, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.slug && { slug: params.slug }),
      ...(params.teamId && { teamId: params.teamId })
    }).toString();
    
    const response = await vercelApiClient.post(
      `/v9/projects/${projectId}/domains/${domainName}/verify${queryParams ? `?${queryParams}` : ''}`
    );
    return response.data;
  } catch (error) {
    console.error('验证Vercel域名失败:', error);
    throw error;
  }
};

const sendEmailCode = async (email, codeType) => {
  try {
    const response = await apiClient.post('/customer/send-email', {
      email,
      codeType // 可选值: forgot_password, change_email, register
    });
    return response.data;
  } catch (error) {
    console.error('发送邮件验证码失败:', error);
    return null;
  }
};

const register = async (registerData) => {
  try {
    const response = await apiClient.post('/customer/register', registerData);
    return response.data;
  } catch (error) {
    console.error('用户注册失败:', error);
    return null;
  }
};

// Google登录
const googleLogin = async () => {
  try {
    const response = await apiClient.get('/customer/google');
    return response.data;
  } catch (error) {
    console.error('Google登录失败:', error);
    return null;
  }
};

// Google登录回调
const googleCallback = async (code, state) => {
  try {
    const response = await apiClient.get('/customer/google/callback', {
      params: { 
        code,
        state 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Google callback failed:', error);
    throw error;
  }
};

const resetPassword = async (resetData) => {
  try {
    const response = await apiClient.post('/customer/reset-password', resetData);
    return response.data;
  } catch (error) {
    console.error('重置密码失败:', error);
    return null;
  }
};

const createDomainWithTXT = async (domainData) => {
  try {
    const response = await apiClient.post('/domain', domainData);
    return response.data;
  } catch (error) {
    console.error('创建域名和添加 TXT 记录失败:', error);
    return null;
  }
};

const getDomain = async (customerId) => {
  try {
    const response = await apiClient.get('/domain', {
      params: { customerId }
    });
    return response.data;
  } catch (error) {
    console.error('获取域名列表失败:', error);
    return null;
  }
};

// 修改邮箱地址
const changeEmail = async (changeEmailData) => {
  try {
    const response = await apiClient.post('/customer/change-email', changeEmailData);
    return response.data;
  } catch (error) {
    console.error('修改邮箱地址失败:', error);
    return null;
  }
};

const validateDomain = async (customerId) => {
  try {
    const response = await apiClient.get('/domain/validate', {
      params: { customerId }
    });
    return response.data;
  } catch (error) {
    console.error('验证域名失败:', error);
    return null;
  }
};

// 新增：获取knowledge center内容列表的方法
const getKnowledgeCenter = async () => {
  try {
    const response = await apiClient.get('/knowledge/center');
    return response.data;
  } catch (error) {
    console.error('获取knowledge center内容列表失败:', error);
    return null;
  }
};

// 新增：根据ID获取knowledge内容的方法
const getKnowledgeById = async (contentId) => {
  try {
    const response = await apiClient.get(`/knowledge/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('获取knowledge内容详情失败:', error);
    return null;
  }
};

// 新增：更新knowledge内容的方法
const updateKnowledge = async (contentId, updateData) => {
  try {
    const response = await apiClient.put(`/knowledge/center/${contentId}`, {
      content: updateData.content,
      description: updateData.description,
      source: updateData.source,
      tags: updateData.tags,
      title: updateData.title
    });
    return response.data;
  } catch (error) {
    console.error('更新knowledge内容失败:', error);
    return null;
  }
};

// 新增：获取knowledge生成状态的方法
const getKnowledgeProcessStatus = async () => {
  try {
    const response = await apiClient.get('/knowledge/process');
    return response.data;
  } catch (error) {
    console.error('获取knowledge生成状态失败:', error);
    return null;
  }
};

// 新增: 修改密码接口
const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/customer/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('修改密码失败:', error);
    return null;
  }
};

// 新增：手动创建页面的方法
const createManualPage = async (pageData) => {
  try {
    const response = await apiClient.post('/manual/pages', pageData);
    return response.data;
  } catch (error) {
    console.error('手动创建页面失败:', error);
    return null;
  }
};

const updateFullSections = async (pageId, sectionsData) => {
  try {
    const response = await apiClient.put(`/sections/full/${pageId}`, sectionsData);
    return response.data;
  } catch (error) {
    console.error('全量更新页面sections失败:', error);
    return null;
  }
};

// 获取页面列表
const getPages = async (params) => {
  try {
    const { customerId, lang, page, limit } = params;
    const response = await apiClient.get('/pages', {
      params: {
        customerId,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取页面列表失败:', error);
    return null;
  }
};

// 新增：更新子文件夹的方法
const updateSubfolders = async (subfolders) => {
  try {
    const response = await apiClient.put('/customer/subfolder', {
      subfolder: subfolders
    });
    return response.data;
  } catch (error) {
    console.error('更新子文件夹失败:', error);
    return null;
  }
};

// 新增：获取用户子文件夹的方法
const getSubfolders = async () => {
  try {
    const response = await apiClient.get('/customer/subfolder');
    return response.data;
  } catch (error) {
    console.error('获取用户子文件夹失败:', error);
    return null;
  }
};

// 新增：更新sitemap的方法
const updateSitemap = async (customerId) => {
  try {
    const response = await apiClient.put(`/products/sitemap`, null, {
      params: { customerId }
    });
    return response.data;
  } catch (error) {
    console.error('更新sitemap失败:', error);
    return null;
  }
};

const getSitemapUrls = async (params) => {
  try {
    const { customerId, websiteId, page, limit } = params;
    const response = await apiClient.get('/products/sitemap/urls', {
      params: {
        customerId,
        websiteId,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取sitemap URLs列表失败:', error);
    return null;
  }
};

// 新增：更新页面布局的方法
const updatePageLayout = async (pageLayoutId, layoutData) => {
  try {
    const response = await apiClient.put(`/pages/layout/${pageLayoutId}`, layoutData);
    return response.data;
  } catch (error) {
    console.error('更新页面布局失败:', error);
    return null;
  }
};

// 新增：获取页面布局的方法
const getPageLayout = async (params) => {
  try {
    const { pageLayoutId, pageId } = params;
    const response = await apiClient.get('/pages/layout', {
      params: {
        ...(pageLayoutId && { pageLayoutId }),
        ...(pageId && { pageId })
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取页面布局失败:', error);
    return null;
  }
};

// 新增：检查 slug 是否存在的方法
const checkSlugExists = async (slug, pageId) => {
  try {
    const response = await apiClient.get('/pages/slug', {
      params: { slug, pageId }
    });
    return response.data;
  } catch (error) {
    console.error('检查 slug 是否存在失败:', error);
    return null;
  }
};

// 新增：获取页面数量统计的方法
const getPublishedPagesCount = async (params = {}) => {
  try {
    const queryParams = {
      ...(params.lang && { lang: params.lang }),
      ...(params.articleType && { articleType: params.articleType }),
      ...(params.status && { status: params.status })
    };

    const response = await apiClient.get('/pages/count', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('获取页面数量统计失败:', error);
    return null;
  }
};

const submitSite = async (customerId, siteURL) => {
  try {
    const response = await apiClient.post('/sites', null, {
      params: {
        customerId,
        siteURL
      }
    });
    return response.data;
  } catch (error) {
    console.error('提交站点失败:', error);
    return null;
  }
};

// 新增：AI生成页面内容的方法
const createAIPage = async (pageData) => {
  try {
    const response = await apiClient.post('/ai/pages', {
      pageType: pageData.pageType,
      author: pageData.author,
      coverImage: pageData.coverImage,
      customerId: pageData.customerId,
      description: pageData.description,
      language: pageData.language,
      numberOfWords: pageData.numberOfWords,
      publishURL: pageData.publishURL,
      relatedKeyword: pageData.relatedKeyword,
      subTitle: pageData.subTitle,
      title: pageData.title,
      topic: pageData.topic
    });
    return response.data;
  } catch (error) {
    console.error('AI生成页面内容失败:', error);
    return null;
  }
};

// 新增：获取已发布URL列表的方法
const getPublishUrls = async () => {
  try {
    const response = await apiClient.get('/pages/publish/urls');
    return response.data;
  } catch (error) {
    console.error('获取已发布URL列表失败:', error);
    return null;
  }
};

// 新增：发布客户sitemap和url的方法
const publishSitemapAndUrls = async () => {
  try {
    const response = await apiClient.post('/pages/publish/sitemap');
    return response.data;
  } catch (error) {
    console.error('发布客户sitemap和url失败:', error);
    return null;
  }
};

// 新增：获取页面仪表板数据的方法
const getPagesDashboard = async () => {
  try {
    const response = await apiClient.get('/pages/dashboard');
    return response.data;
  } catch (error) {
    console.error('获取页面仪表板数据失败:', error);
    return null;
  }
};

// 新增：获取页面按钮链接列表的方法
const getPageButtonLinks = async (params = {}) => {
  try {
    const queryParams = {
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/page-button-links', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('获取页面按钮链接列表失败:', error);
    return null;
  }
};

// 新增：创建页面按钮链接的方法
const createPageButtonLink = async (linkData) => {
  try {
    const response = await apiClient.post('/page-button-links', {
      description: linkData.description,
      link: linkData.link,
      name: linkData.name
    });
    return response.data;
  } catch (error) {
    console.error('创建页面按钮链接失败:', error);
    return null;
  }
};

// 新增：更新页面按钮链接的方法
const updatePageButtonLink = async (linkId, linkData) => {
  try {
    const response = await apiClient.put(`/page-button-links/${linkId}`, {
      description: linkData.description,
      link: linkData.link,
      name: linkData.name
    });
    return response.data;
  } catch (error) {
    console.error('更新页面按钮链接失败:', error);
    return null;
  }
};

// 新增：删除页面按钮链接的方法
const deletePageButtonLink = async (linkId) => {
  try {
    const response = await apiClient.delete(`/page-button-links/${linkId}`);
    return response.data;
  } catch (error) {
    console.error('删除页面按钮链接失败:', error);
    return null;
  }
};

// 新增：获取分析状态的方法
const getAnalysisStatus = async (type) => {
  try {
    const response = await apiClient.get('/planning/analysis-status', {
      params: {
        taskName: type 
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取分析状态失败:', error);
    return null;
  }
};

// 新增：更新用户 onboarding status 的方法
const updateOnboardingStatus = async (status) => {
  try {
    const response = await apiClient.put('/customer/onboarding', { status });
    return response.data;
  } catch (error) {
    console.error('更新用户 onboarding status 失败:', error);
    return null;
  }
};

// 新增：获取关键词概览分析的方法
const getKeywordAnalysisOverview = async () => {
  try {
    const response = await apiClient.post('/planning/analysis-overview');
    return response.data;
  } catch (error) {
    console.error('获取关键词概览分析失败:', error);
    return null;
  }
};

// 新增：获取关键词列表的方法
const getPlanningKeywords = async (params = {}) => {
  try {
    const queryParams = {
      source: params.source,
      level: params.level,
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/planning/keywords', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('获取关键词列表失败:', error);
    return null;
  }
};

// 新增：生成意图和TDK及大纲的方法
const generatePlanningComposite = async (keywordIds) => {
  try {
    const response = await apiClient.post('/planning/composite-generator', {
      keywordIds: keywordIds
    });
    return response.data;
  } catch (error) {
    console.error('生成意图和TDK及大纲失败:', error);
    return null;
  }
};

// 新增：获取用户outline列表的方法
const getPlanningOutlines = async (params = {}) => {
  try {
    const queryParams = {
      ...(params.status && { status: params.status }),
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/planning/outline', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('获取用户outline列表失败:', error);
    return null;
  }
};

// 新增：选择需要生成的outline的方法
const selectPlanningOutlines = async (outlineIds) => {
  try {
    const response = await apiClient.post('/planning/outline/selected', {
      outlineIds: outlineIds
    });
    return response.data;
  } catch (error) {
    console.error('选择outline失败:', error);
    return null;
  }
};

// 新增：取消选中outline的方法
const cancelPlanningOutlines = async (outlineIds) => {
  try {
    const response = await apiClient.post('/planning/outline/cancel', {
      outlineIds: outlineIds
    });
    return response.data;
  } catch (error) {
    console.error('取消选中outline失败:', error);
    return null;
  }
};

// 新增：选择关键词的方法
const selectPlanningKeywords = async (keywordIds) => {
  try {
    const response = await apiClient.post('/planning/keywords/selected', {
      keywordIds: keywordIds
    });
    return response.data;
  } catch (error) {
    console.error('选择关键词失败:', error);
    return null;
  }
};

// 新增：取消选中关键词的方法
const cancelPlanningKeywords = async (keywordIds) => {
  try {
    const response = await apiClient.post('/planning/keywords/cancel', {
      keywordIds: keywordIds
    });
    return response.data;
  } catch (error) {
    console.error('取消选中关键词失败:', error);
    return null;
  }
};

export default {
  validateDomain,
  changeEmail,
  getDomain,
  createDomainWithTXT,
  resetPassword,
  googleLogin,
  googleCallback,
  register,
  sendEmailCode,
  login,
  getKeywords,
  getLinks,
  postLinks,
  putLinks,
  deleteGroupLinks,
  deleteLinks,
  getCategories,
  addKeyword,
  deleteKeyword,
  editKeyword,
  getDomains,
  deleteDomain,
  addDomain,
  deletePage,
  updateSection,
  updatePageStatus,
  updatePage,
  getArticleById,
  createProduct,
  updateProduct,
  getProductsByCustomerId,
  deleteProduct,
  getSitemap,
  getHelpCenterData,
  uploadMedia,
  getMedia,
  deleteMedia,
  updateMedia,
  gscAuth,
  gscCallback,
  getGscSites,
  submitGscSite,
  deleteGscSite,
  getGscAnalytics,
  checkGscAuth,
  getInternalLinks,
  createInternalLink,
  updateInternalLink,
  deleteInternalLink,
  addVercelDomain,
  getVercelDomainInfo,
  deleteVercelDomain,
  getVercelDomainConfig,
  verifyVercelDomain,
  getKnowledgeCenter,
  getKnowledgeById,
  updateKnowledge,
  getKnowledgeProcessStatus,
  changePassword,
  createManualPage,
  updateFullSections,
  getPages,
  updateSubfolders,
  getSubfolders,
  updateSitemap,
  getSitemapUrls,
  updatePageLayout,
  getPageLayout,
  checkSlugExists,
  getPublishedPagesCount,
  submitSite,
  createAIPage,
  getPublishUrls,
  publishSitemapAndUrls,
  getPagesDashboard,
  getPageButtonLinks,
  createPageButtonLink,
  updatePageButtonLink,
  deletePageButtonLink,
  getAnalysisStatus,
  updateOnboardingStatus,
  getKeywordAnalysisOverview,
  getPlanningKeywords,
  generatePlanningComposite,
  getPlanningOutlines,
  selectPlanningOutlines,
  cancelPlanningOutlines,
  selectPlanningKeywords,
  cancelPlanningKeywords
};
