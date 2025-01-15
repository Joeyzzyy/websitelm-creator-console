import onboardingImage from '../assets/images/tutorials/onboarding.png'
import assetManagementImage from '../assets/images/tutorials/asset-management.png'
import keywordsImage from '../assets/images/tutorials/onboarding.png'
import taskManagementImage from '../assets/images/tutorials/onboarding.png'
import settingsImage from '../assets/images/tutorials/set-up-deployment-domain.png'

export const tutorialConfig = {
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