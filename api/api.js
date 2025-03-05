import axios from 'axios';

const isProd = import.meta.env.VITE_APP_ENV === 'production';

const API_BASE_URL = isProd 
  ? 'https://api.websitelm.com/v1'
  : 'https://strapi.sheet2email.com/v1';

const KNOWLEDGE_BASE_URL = isProd
  ? 'https://api.websitelm.com'
  : 'https://strapi.sheet2email.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const knowledgeApiClient = axios.create({
  baseURL: KNOWLEDGE_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// const apiClient = axios.create({
//   baseURL: 'https://api.websitelm.com/v1', // 替换为实际的 API 基础地址
//   timeout: 20000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const knowledgeApiClient = axios.create({
//   baseURL: 'https://api.websitelm.com', // 替换为实际的 API 基础地址
//   timeout: 20000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const vercelApiClient = axios.create({
  baseURL: 'https://api.vercel.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer 3LSBxZQ35VdhqRW7tzGs1oYo',
    'Content-Type': 'application/json',
  },
});

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
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentCustomerId');

          if (!window.isNavigatingToLogin) {
            window.isNavigatingToLogin = true;
            
            if (window.location.pathname !== '/login') {
              window.location.replace('/login');
            }
            
            setTimeout(() => {
              window.isNavigatingToLogin = false;
            }, 1000);
          }
        }
        return Promise.reject(error);
    }
);

// 为 knowledgeApiClient 添加请求拦截器
knowledgeApiClient.interceptors.request.use(
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

// 为 knowledgeApiClient 添加响应拦截器
knowledgeApiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentCustomerId');

          if (!window.isNavigatingToLogin) {
            window.isNavigatingToLogin = true;
            
            if (window.location.pathname !== '/login') {
              window.location.replace('/login');
            }
            
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
        console.error('Login failed:', error);
        return false;
    }
};

const getCategories = async (customerId) => {
  try {
    const response = await apiClient.get(`/categories/${customerId}?categoryName=ArticleType`);
    return response.data;
  } catch (error) {
    console.error('Failed to get article categories:', error);
    return null;
  }
};

const getLinks = async (customerId) => {
  try {
      const response = await apiClient.get(`/links?customerId=${customerId}`);
      return response.data;
  } catch (error) {
      console.error('Failed to get header and footer link groups:', error);
      return null;
  }
};

const postLinks = async (payload) => {
  try {
      const response = await apiClient.post(`/links`, payload);
      return response.data;
  } catch (error) {
      console.error('Failed to get header and footer link groups:', error);
      return null;
  }
};

const putLinks = async (groupId, payload) => {
  try {
      const response = await apiClient.put(`/links/${groupId}`, payload);
      return response.data;
  } catch (error) {
      console.error('Failed to get header and footer link groups:', error);
      return null;
  }
};

const deleteGroupLinks = async (groupId) => {
  try {
      const response = await apiClient.delete(`/links/${groupId}`);
      return response.data;
  } catch (error) {
      console.error('Failed to delete header and footer link group:', error);
      return null;
  }
};

const deleteLinks = async (groupId, linkId) => {
  try {
      const response = await apiClient.delete(`/links/${groupId}/${linkId}`);
      return response.data;
  } catch (error) {
      console.error('Failed to delete header and footer link group:', error);
      return null;
  }
};

const getKeywords = async (customerId) => {
  try {
    const response = await apiClient.get(`/keywords/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get keywords:', error);
    return null;
  }
};

const addKeyword = async (keywordId, keywordType, term) => {
  try {
    const response = await apiClient.post(`/keywords/${keywordId}/${keywordType}`, 
        {subKeywordId: '', term: term});
    return response.data;
  } catch (error) {
    console.error('Failed to add keyword:', error);
    throw error;
  }
};

// New: Delete keyword method
const deleteKeyword = async (keywordId, keywordType, subKeywordId) => {
  try {
    const response = await apiClient.delete(`/keywords/${keywordId}/${keywordType}/${subKeywordId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete keyword:', error);
    throw error;
  }
};

// Edit keyword method
const editKeyword = async (keywordId, keywordType, subKeywordId, term) => {
  try {
    const response = await apiClient.put(`/keywords/${keywordId}/${keywordType}/${subKeywordId}`, 
        {subKeywordId: subKeywordId, term: term});
    return response.data;
  } catch (error) {
    console.error('Failed to delete keyword:', error);
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
    console.error('Failed to get domain list:', error);
    return null;
  }
};

// 新增：删除域名的方法
const deleteDomain = async (domainId) => {
  try {
    const response = await apiClient.delete(`/domain/${domainId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete domain:', error);
    return null;
  }
};

// 新增：删除页面的方法
const deletePage = async (pageId) => {
  try {
    const response = await apiClient.delete(`/pages/${pageId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete page:', error);
    return null;
  }
};

// 新：更新页面区块的方法
const updateSection = async (sectionId, sectionData) => {
  try {
    const response = await apiClient.put(`/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Failed to update page section:', error);
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
    console.error('Failed to update page status:', error);
    return null;
  }
};

// 基本信息
const updatePage = async (pageId, pageData) => {
  try {
    const response = await apiClient.put(`/pages/${pageId}`, pageData);
    return response.data;
  } catch (error) {
    console.error('Failed to update page basic info:', error);
    return null;
  }
};

// 新增：获取单篇文章的方法
const getArticleById = async (articleId) => {
  try {
    const response = await apiClient.get(`/pages/${articleId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get article details:', error);
    return null;
  }
};

// 新增：创建产品的方法
const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
};

// 新增：更新产品的方法
const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Failed to update product:', error);
    return null;
  }
};

// 新增：根据客户ID获取产品列表的方法
const getProductsByCustomerId = async () => {
  try {
    const response = await apiClient.get(`/products/customer`);
    return response.data;
  } catch (error) {
    console.error('Failed to get customer product list:', error);
    return null;
  }
};

// 新增：删除产品的方法
const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete product:', error);
    return null;
  }
};

// 新增：获取sitemap的方法
const getSitemap = async () => {
  try {
    const response = await apiClient.get(`/products/sitemap`);
    return response.data;
  } catch (error) {
    console.error('Failed to get sitemap:', error);
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
    console.error('Failed to get help center data:', error);
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
    console.error('Failed to upload media:', error);
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
    console.error('Failed to get media list:', error);
    return null;
  }
};

// 新增：删除媒体文件的方法
const deleteMedia = async (mediaId) => {
  try {
    const response = await apiClient.delete(`/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete media:', error);
    return null;
  }
};

// 新增：更新媒体文件的方法
const updateMedia = async (mediaId, mediaData) => {
  try {
    const response = await apiClient.put(`/media/${mediaId}`, mediaData);
    return response.data;
  } catch (error) {
    console.error('Failed to update media:', error);
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
    console.error('Failed to get GSC sites:', error);
    return null;
  }
};

const submitGscSite = async (siteUrl) => {
  try {
    const response = await apiClient.post('/sites', { siteUrl });
    return response.data;
  } catch (error) {
    console.error('Failed to submit GSC site:', error);
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
    console.error('Failed to delete GSC site:', error);
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
    console.error('Failed to get GSC analytics:', error);
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
    console.error('Failed to check GSC authorization:', error);
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
    console.error('Failed to get internal link list:', error);
    return null;
  }
};

// 新增：创建内部链接的方法
const createInternalLink = async (linkData) => {
  try {
    const response = await apiClient.post('/internal/links', linkData);
    return response.data;
  } catch (error) {
    console.error('Failed to create internal link:', error);
    return null;
  }
};

// 新增：更新内部链接的方法
const updateInternalLink = async (linkId, linkData) => {
  try {
    const response = await apiClient.put(`/internal/links/${linkId}`, linkData);
    return response.data;
  } catch (error) {
    console.error('Failed to update internal link:', error);
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
    console.error('Failed to add Vercel domain:', error);
    throw error;
  }
};

const getVercelDomainInfo = async (projectId) => {
  try {
    const response = await vercelApiClient.get(`/v9/projects/${projectId}/domains`);
    return response.data;
  } catch (error) {
    console.error('Failed to get Vercel domain info:', error);
    throw error;
  }
};

const deleteVercelDomain = async (projectId, domainName) => {
  try {
    const response = await vercelApiClient.delete(`/v9/projects/${projectId}/domains/${domainName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete Vercel domain:', error);
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
    console.error('Failed to get Vercel domain config:', error);
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
    console.error('Failed to verify Vercel domain:', error);
    throw error;
  }
};

const sendEmailCode = async (email, codeType) => {
  try {
    const response = await apiClient.post('/customer/send-email', {
      email,
      codeType // Available values: forgot_password, change_email, register
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send email verification code:', error);
    return null;
  }
};

const register = async (registerData) => {
  try {
    const response = await apiClient.post('/customer/register', registerData);
    return response.data;
  } catch (error) {
    console.error('Failed to register user:', error);
    return null;
  }
};

// Google登录
const googleLogin = async () => {
  try {
    const response = await apiClient.get('/customer/google');
    return response.data;
  } catch (error) {
    console.error('Failed to login with Google:', error);
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
    console.error('Failed to handle Google callback:', error);
    throw error;
  }
};

const resetPassword = async (resetData) => {
  try {
    const response = await apiClient.post('/customer/reset-password', resetData);
    return response.data;
  } catch (error) {
    console.error('Failed to reset password:', error);
    return null;
  }
};

const createDomainWithTXT = async (domainData) => {
  try {
    const response = await apiClient.post('/domain', domainData);
    return response.data;
  } catch (error) {
    console.error('Failed to create domain and add TXT record:', error);
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
    console.error('Failed to get domain list:', error);
    return null;
  }
};

// 修改邮箱地址
const changeEmail = async (changeEmailData) => {
  try {
    const response = await apiClient.post('/customer/change-email', changeEmailData);
    return response.data;
  } catch (error) {
    console.error('Failed to change email:', error);
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
    console.error('Failed to validate domain:', error);
    return null;
  }
};

// Changed: Using knowledgeApiClient to get knowledge center content list
const getKnowledgeCenter = async () => {
  try {
    const response = await knowledgeApiClient.get('/knowledge/list');
    return response.data;
  } catch (error) {
    console.error('Failed to get knowledge center content list:', error);
    return null;
  }
};

// Changed: Using knowledgeApiClient to get knowledge content by ID
const getKnowledgeById = async (contentId) => {
  try {
    const response = await knowledgeApiClient.get(`/knowledge/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get knowledge content details:', error);
    return null;
  }
};

// Changed: Using knowledgeApiClient to update knowledge content
const updateKnowledge = async (contentId, updateData) => {
  try {
    const response = await knowledgeApiClient.put(`/knowledge/${contentId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update knowledge content:', error);
    return null;
  }
};

// 修改: 使用knowledgeApiClient获取knowledge生成状态
const getKnowledgeProcessStatus = async () => {
  try {
    const response = await knowledgeApiClient.get('/knowledge/process');
    return response.data;
  } catch (error) {
    console.error('Failed to get knowledge generation status:', error);
    return null;
  }
};

// 新增: 修改密码接口
const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/customer/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Failed to change password:', error);
    return null;
  }
};

// 新增：手动创建页面的方法
const createManualPage = async (pageData) => {
  try {
    const response = await apiClient.post('/manual/pages', pageData);
    return response.data;
  } catch (error) {
    console.error('Failed to create manual page:', error);
    return null;
  }
};

const updateFullSections = async (pageId, sectionsData) => {
  try {
    const response = await apiClient.put(`/sections/full/${pageId}`, sectionsData);
    return response.data;
  } catch (error) {
    console.error('Failed to update full page sections:', error);
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
    console.error('Failed to get page list:', error);
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
    console.error('Failed to update subfolder:', error);
    return null;
  }
};

// 新增：获取用户子文件夹的方法
const getSubfolders = async () => {
  try {
    const response = await apiClient.get('/customer/subfolder');
    return response.data;
  } catch (error) {
    console.error('Failed to get user subfolder:', error);
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
    console.error('Failed to update sitemap:', error);
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
    console.error('Failed to get sitemap URLs list:', error);
    return null;
  }
};

// 新增：更新页面布局的方法
const updatePageLayout = async (pageLayoutId, layoutData) => {
  try {
    const response = await apiClient.put(`/pages/layout/${pageLayoutId}`, layoutData);
    return response.data;
  } catch (error) {
    console.error('Failed to update page layout:', error);
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
    console.error('Failed to get page layout:', error);
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
    console.error('Failed to check slug existence:', error);
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
    console.error('Failed to get page count:', error);
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
    console.error('Failed to submit site:', error);
    return null;
  }
};

// 修改：AI生成页面内容的方法
const createAIPage = async (outlineId) => {
  try {
    const response = await apiClient.post('/ai/pages', {
      outlineId: outlineId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create AI page content:', error);
    return null;
  }
};

// 新增：获取已发布URL列表的方法
const getPublishUrls = async () => {
  try {
    const response = await apiClient.get('/pages/publish/urls');
    return response.data;
  } catch (error) {
    console.error('Failed to get published URL list:', error);
    return null;
  }
};

// 新增：发布客户sitemap和url的方法
const publishSitemapAndUrls = async () => {
  try {
    const response = await apiClient.post('/pages/publish/sitemap');
    return response.data;
  } catch (error) {
    console.error('Failed to publish customer sitemap and URLs:', error);
    return null;
  }
};

// 新增：获取页面仪表板数据的方法
const getPagesDashboard = async () => {
  try {
    const response = await apiClient.get('/pages/dashboard');
    return response.data;
  } catch (error) {
    console.error('Failed to get page dashboard data:', error);
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
    console.error('Failed to get page button link list:', error);
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
    console.error('Failed to create page button link:', error);
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
    console.error('Failed to update page button link:', error);
    return null;
  }
};

// 新增：删除页面按钮链接的方法
const deletePageButtonLink = async (linkId) => {
  try {
    const response = await apiClient.delete(`/page-button-links/${linkId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete page button link:', error);
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
    console.error('Failed to get analysis status:', error);
    return null;
  }
};

// 新增：更新用户 onboarding status 的方法
const updateOnboardingStatus = async (status) => {
  try {
    const response = await apiClient.put('/customer/onboarding', { status });
    return response.data;
  } catch (error) {
    console.error('Failed to update user onboarding status:', error);
    return null;
  }
};

// 新增：获取关键词概览分析的方法
const getKeywordAnalysisOverview = async () => {
  try {
    const response = await apiClient.post('/planning/analysis-overview');
    return response.data;
  } catch (error) {
    console.error('Failed to get keyword analysis overview:', error);
    return null;
  }
};

// 新增：获取关键词列表的方法
const getPlanningKeywords = async (params = {}) => {
  try {
    const queryParams = {
      source: params.source,
      level: params.level,
      ...(params.status && { status: params.status }),
      ...(params.minKd !== undefined && { minKd: params.minKd }),
      ...(params.maxKd !== undefined && { maxKd: params.maxKd }),
      ...(params.minVolume !== undefined && { minVolume: params.minVolume }),
      ...(params.maxVolume !== undefined && { maxVolume: params.maxVolume }),
      ...(params.prompt && { prompt: params.prompt }),
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/planning/keywords', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Failed to get keyword list:', error);
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
    console.error('Failed to generate planning composite:', error);
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
    console.error('Failed to get user outline list:', error);
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
    console.error('Failed to select outline:', error);
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
    console.error('Failed to cancel selected outline:', error);
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
    console.error('Failed to select keyword:', error);
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
    console.error('Failed to cancel selected keyword:', error);
    return null;
  }
};

// 新增：删除outline的方法
const deletePlanningOutline = async (outlineId) => {
  try {
    const response = await apiClient.delete(`/planning/outline/${outlineId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete outline:', error);
    return null;
  }
};

// 新增：AI选词生成outline的方法
const generatePlanningAI = async () => {
  try {
    const response = await apiClient.post('/planning/ai-generator');
    return response.data;
  } catch (error) {
    console.error('Failed to generate AI outline:', error);
    return null;
  }
};

// 新增：获取用户生成outline批次详细记录的方法
const getPlanningOutlineBatchRecord = async (params = {}) => {
  try {
    const queryParams = {
      ...(params.batchNo && { batchNo: params.batchNo }),
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/planning/outline/batch-record', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Failed to get outline batch record:', error);
    return null;
  }
};

// 新增：获取用户批量生成outline批次列表的方法
const getPlanningOutlineBatches = async (params = {}) => {
  try {
    const queryParams = {
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/planning/outline/batch', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Failed to get outline batch list:', error);
    return null;
  }
};

// 新增：更新用户outline的方法
const updatePlanningOutline = async (outlineId, outlineData) => {
  try {
    const response = await apiClient.put(`/planning/outline/${outlineId}`, {
      description: outlineData.description,
      keywords: outlineData.keywords,
      problemSolved: outlineData.problemSolved,
      relatedKeywords: outlineData.relatedKeywords,
      title: outlineData.title,
      userIntent: outlineData.userIntent
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user outline:', error);
    return null;
  }
};

const cancelGscAuth = async () => {
  try {
    const response = await apiClient.delete('/auth/cancel');
    return response.data;
  } catch (error) {
    console.error('Failed to cancel GSC OAuth:', error);
    return null;
  }
};

// 新增：导入关键词的方法
const importKeywords = async (formData) => {
  try {
    const response = await apiClient.post('/import/keywords', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to import keywords:', error);
    return null;
  }
};

// 新增：重建知识库的方法
const rebuildKnowledge = async () => {
  try {
    const response = await apiClient.post('/knowledge/rebuild');
    return response.data;
  } catch (error) {
    console.error('Failed to rebuild knowledge:', error);
    return null;
  }
};

// 新增：获取客户Package的方法
const getCustomerPackage = async () => {
  try {
    const response = await apiClient.get('/customer/package');
    return response.data;
  } catch (error) {
    console.error('Failed to get customer package:', error);
    return null;
  }
};

// 新增：激活试用套餐的方法
const activateTrialPackage = async (inviteCode) => {
  try {
    const response = await apiClient.post('/trial-package/activate', {
      inviteCode: inviteCode
    });
    return response.data;
  } catch (error) {
    console.error('Failed to activate trial package:', error);
    return null;
  }
};

// 新增: 删除knowledge内容的方法
const deleteKnowledge = async (contentId) => {
  try {
    const response = await knowledgeApiClient.delete(`/knowledge/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete knowledge content:', error);
    return null;
  }
};

// New: Create knowledge content
const createKnowledge = async (knowledgeData) => {
  try {
    const response = await knowledgeApiClient.post('/knowledge/add', knowledgeData);
    return response.data;
  } catch (error) {
    console.error('Failed to create knowledge content:', error);
    return null;
  }
};

// New: Upload favicon
const uploadFavicon = async (formData, faviconType) => {
  try {
    const response = await apiClient.post('/media/favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        faviconType: faviconType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload favicon:', error);
    return null;
  }
};

// New: Get media list by customer ID
const getMediaByCustomer = async (params = {}) => {
  try {
    const queryParams = {
      ...(params.mediaType && { mediaType: params.mediaType }),
      ...(params.categoryName && { categoryName: params.categoryName }),
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit })
    };
    
    const response = await apiClient.get('/media', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Failed to get customer media list:', error);
    return null;
  }
};

// 新增：获取域名favicon的方法
const getDomainFavicon = async (domainName) => {
  try {
    const response = await apiClient.get('/domain/favicon', {
      params: { domainName }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get domain favicon:', error);
    return null;
  }
};

// 新增：获取用户信息的方法
const getUserInfo = async () => {
  try {
    const response = await apiClient.get('/customer/info');
    return response.data;
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
};

// 新增：获取页面生成过程的方法
const getPageWorkflow = async (pageId) => {
  try {
    const response = await apiClient.get('/pages/workflow', {
      params: { pageId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get page workflow:', error);
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
  cancelPlanningKeywords,
  deletePlanningOutline,
  generatePlanningAI,
  getPlanningOutlineBatchRecord,
  getPlanningOutlineBatches,
  updatePlanningOutline,
  cancelGscAuth,
  importKeywords,
  getCustomerPackage,
  rebuildKnowledge,
  activateTrialPackage,
  deleteKnowledge,
  createKnowledge,
  uploadFavicon,
  getMediaByCustomer,
  getUserInfo,
  getDomainFavicon,
  getPageWorkflow
};
