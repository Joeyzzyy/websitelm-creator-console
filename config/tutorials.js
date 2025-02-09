import onboardingImage from '../assets/images/tutorials/onboarding.png'
import assetManagementImage from '../assets/images/tutorials/asset-management.png'
import keywordsImage from '../assets/images/tutorials/onboarding.png'
import taskManagementImage from '../assets/images/tutorials/onboarding.png'
import settingsImage from '../assets/images/tutorials/set-up-deployment-domain.png'

export const tutorialConfig = [
  {
    "description": "The Future of AI-Powered Content Creation",
    "imageAlt": "websitelm-how-to-get-onboard",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/tutorial-cover.png",
    "tag": "Get Onboard",
    "targetUrl": "https://websitelm.com/tutorials/get-onboard-with-websitelm",
    "title": "How To Get WebsiteLM Account"
  },
  {
    "imageAlt": "page-cover-image-of-websitelm-pricing-plans-choosing-guide",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-204657@2x.png",
    "tag": "Get Onboard",
    "targetUrl": "https://websitelm.com/tutorials/websitelm-tutorial-choose-plan",
    "title": "Choose The Plan That Suits You The Most"
  },
  {
    "imageAlt": "page-cover-image-of-how-to-verify-domain",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/domain-verified.png",
    "tag": "Get Onboard",
    "targetUrl": "https://websitelm.com/tutorials/verify-your-domain",
    "title": "Verify Your Domain To Start The Journey!"
  },
  {
    "imageAlt": "page-cover-image-of-introduction-to-knowledge-base",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-210948@2x-min.png",
    "tag": "Before we start to generate pages",
    "targetUrl": "https://websitelm.com/tutorials/websitelm-tutorial-enrich-knowledge",
    "title": "How to enrich knowledge base"
  },
  {
    "imageAlt": "page-cover-image-of-how-to-manage-your-assets",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-212101@2x-min.png",
    "tag": "Before we start to generate pages",
    "targetUrl": "https://websitelm.com/tutorials/manage-assets-future-content",
    "title": "Manage Your Assets For Future Content Generation"
  },
  {
    "imageAlt": "page-cover-image-of-how-to-use-ai-keywords-planner",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-212318@2x-min.png",
    "tag": "Let's start to generate pages",
    "targetUrl": "https://websitelm.com/tutorials/websitelm-keywords-planner-tutorial",
    "title": "Let AI Handle Your Keywords Planning And Outline Generation"
  },
  {
    "imageAlt": "",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-212515@2x-min.png",
    "tag": "Let's start to generate pages",
    "targetUrl": "https://websitelm.com/tutorials/websitelm-tutorial-manage-page-generation",
    "title": "Manage Your Page Generation Task"
  },
  {
    "imageAlt": "set-up-deploy-domain",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/sub-domain-configuation-check.png",
    "tag": "Let's get your pages published to Google",
    "targetUrl": "https://websitelm.com/tutorials/websitelm-tutorial-subdomain-subdirectory",
    "title": "Set Up Sub-domain or Sub-Directory To Get Your Pages Published!"
  },
  {
    "imageAlt": "",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-212640@2x.png",
    "tag": "Let's get your pages published to Google",
    "targetUrl": "https://websitelm.com/tutorials/websitelm-publish-unpublish-pages",
    "title": "How to publish & unpublish pages"
  },
  {
    "imageAlt": "connect-google-search-console-with-wensitelm",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/connect-to-gsc-auth-confirm.png",
    "tag": "Let's track data and performace",
    "targetUrl": "https://websitelm.com/tutorials/conntect-google-search-console",
    "title": "Connect Your Google Search Console With Us!"
  },
  {
    "imageAlt": "",
    "imageUrl": "https://strapi.sheet2email.com/media/6768df5eb828c9bcfbec07af/WX20250203-212726@2x.png",
    "tag": "Let's track data and performace",
    "targetUrl": "https://websitelm.com/tutorials/website-lm-submit-sitemap-google",
    "title": "How to submit sitemap to Google Search Console"
  }
];

// 保留原有的配置对象，以防其他地方还在使用
export const tourConfig = {
  onboarding: {
    title: 'How To Get Onboard',
    content: 'This is the place to get your domain verified and connect your Google Search Console to WebsiteLM',
    target: '[data-tour="dashboardpage"]',
    placement: 'right',
    videoUrl: 'https://example.com/placeholder-dashboard.mp4',
    docsLink: 'https://websitelm.com/tutorials/get-onboard-with-websitelm',
    imageUrl: onboardingImage,
    badge: 'Start Here',
    features: [
      {
        title: 'Domain verification',
        link: 'https://websitelm.com/tutorials/verify-your-domain'
      },
      {
        title: 'Google Search Console integration',
        link: 'https://websitelm.com/tutorials/conntect-google-search-console'
      },
      {
        title: 'Dashboard overview',
        link: 'https://websitelm.com/tutorials/get-onboard-with-websitelm#dashboard'
      }
    ]
  },
  
  assetManagement: {
    title: 'Asset Management',
    content: 'This is the place to manage your assets, images, videos, internal link and more, all in one place and will be used for auto SEO page generation later.',
    target: '[data-tour="assetspage"]',
    placement: 'right',
    videoUrl: 'https://example.com/placeholder-assets.mp4',
    docsLink: 'https://websitelm.com/tutorials/manage-assets-future-content',
    imageUrl: assetManagementImage,
    badge: 'Step 2',
    features: [
      {
        title: 'Image assets',
        link: 'https://websitelm.com/tutorials/manage-assets-future-content#images'
      },
      {
        title: 'Video assets',
        link: 'https://websitelm.com/tutorials/manage-assets-future-content#videos'
      },
      {
        title: 'Internal linking',
        link: 'https://websitelm.com/tutorials/manage-assets-future-content#internal-links'
      }
    ]
  },

  keywordPlanning: {
    title: 'Keyword Planning',
    content: 'We provide Keywords Difference Analysis service and Your Competitors\' Top Pages\' keywords ananlysis for all plans!',
    target: '[data-tour="keywordsplanningpage"]',
    placement: 'right',
    videoUrl: 'https://example.com/placeholder-keywords.mp4',
    docsLink: 'https://websitelm.com/tutorials/keyword-planning',
    imageUrl: keywordsImage,
    badge: 'Step 3',
    features: [
      {
        title: 'Keyword research',
        link: 'https://websitelm.com/tutorials/keyword-planning#research'
      },
      {
        title: 'Competitor analysis',
        link: 'https://websitelm.com/tutorials/keyword-planning#competitors'
      },
      {
        title: 'Keyword tracking',
        link: 'https://websitelm.com/tutorials/keyword-planning#tracking'
      }
    ]
  },

  taskManagement: {
    title: 'Task Management',
    content: 'Manage your SEO page generation tasks here, publishment, modification, or create a page from scratch!',
    target: '[data-tour="taskmanagementpage"]',
    placement: 'right',
    videoUrl: 'https://example.com/placeholder-tasks.mp4',
    docsLink: 'https://websitelm.com/tutorials/task-management',
    imageUrl: taskManagementImage,
    badge: 'Step 4',
    features: [
      {
        title: 'Create new tasks',
        link: 'https://websitelm.com/tutorials/task-management#create'
      },
      {
        title: 'Monitor task progress',
        link: 'https://websitelm.com/tutorials/task-management#monitor'
      },
      {
        title: 'Task automation',
        link: 'https://websitelm.com/tutorials/task-management#automation'
      }
    ]
  },

  settings: {
    title: 'Settings',
    content: 'Configure the sub-domain or sub-directory for your pages to be deployed.',
    target: '[data-tour="settingspage"]',
    placement: 'right',
    videoUrl: 'https://example.com/placeholder-settings.mp4',
    docsLink: 'https://websitelm.com/tutorials/websitelm-tutorial-subdomain-subdirectory',
    imageUrl: settingsImage,
    badge: 'Final Step',
    features: [
      {
        title: 'Domain configuration',
        link: 'https://websitelm.com/tutorials/websitelm-tutorial-subdomain-subdirectory#domain'
      },
      {
        title: 'Deployment settings',
        link: 'https://websitelm.com/tutorials/websitelm-tutorial-subdomain-subdirectory#deployment'
      },
      {
        title: 'API integration',
        link: 'https://websitelm.com/tutorials/websitelm-tutorial-subdomain-subdirectory#api'
      }
    ]
  }
} 