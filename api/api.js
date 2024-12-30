import axios from 'axios';
import { message } from 'ant-design-vue';

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
        // 检查当前请求是否在不需要 token 的列表中
        if (!noAuthUrls.includes(config.url)) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers['Authorization'] = `${accessToken}`;
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
          // 只保留核心验证相关的存储项
          localStorage.clear();

          if (error.response.data.message === 'User not find') {
            message.error('User not found');
          } else if (error.response.data.message === 'Invalid credentials') {
            message.error('Wrong username or password');
          } else {
            message.error('Session expired. Please login again.');
            // window.location.href = '/login';
          }
          // 强制跳转到登录页面
          // 使用 window.location.href 确保完全重新加载页面
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
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

const VERCEL_API_URL = 'https://api.vercel.com';
const VERCEL_TOKEN = 'Rmr5Bk7l1Ai8D2KfXj92U0e4';
const PROJECT_ID = 'nextjs'; 

const getVercelDomains = async () => {
  try {
    const response = await fetch(`${VERCEL_API_URL}/v9/projects/${PROJECT_ID}/domains`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取Vercel域名时出错:', error);
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
const updatePageStatus = async (pageId, status) => {
  console.log('Calling updatePageStatus:', { pageId, status }); // 添加日志
  try {
    const response = await apiClient.put(`/pages/${pageId}/${status}`);
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
    const response = await apiClient.put('/customer/subfloder', {
      subfloder: subfolders
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
    const response = await apiClient.get('/customer/subfloder');
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
    const response = await apiClient.put(`/page/layout/${pageLayoutId}`, layoutData);
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
    const response = await apiClient.get('/page/layout', {
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
  getVercelDomains,
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
  getPageLayout
};
