import { createCleanComponentData } from '../utils/componentDataFactory';

export const availableComponents = [
  {
    category: 'Title Sections',
    items: [
      {
        type: 'TitleSection',
        label: 'Standard ',
        template: createCleanComponentData('TitleSection'),
        preview: "/previews/title-section.png",
        description: "A simple and elegant title section with optional subtitle and description."
      },
      {
        type: 'TitleSectionWithImage',
        label: 'With Image',
        template: createCleanComponentData('TitleSectionWithImage')
      }
    ]
  },
  {
    category: 'Blog Writing',
    items: [
      {
        type: 'KeyResultsWithTextBlock',
        label: 'Text Block With Key Results',
        template: createCleanComponentData('KeyResultsWithTextBlock')
      }
    ]
  },
  {
    category: 'Key Results',
    items: [
      {
        type: 'KeyResultsWithImage',
        label: 'With Image',
        template: createCleanComponentData('KeyResultsWithImage')
      },
      {
        type: 'KeyResultsWithCards',
        label: 'With Cards',
        template: createCleanComponentData('KeyResultsWithCards')
      }
    ]
  },
  {
    category: 'Hero Sections',
    items: [
      {
        type: 'HeroSectionWithVideo',
        label: 'With Video',
        template: createCleanComponentData('HeroSectionWithVideo')
      },
      {
        type: 'HeroSectionWithMultipleTexts',
        label: 'With Multiple Texts',
        template: createCleanComponentData('HeroSectionWithMultipleTexts')
      }
    ]
  },
  {
    category: 'Why Choose Us',
    items: [
      {
        type: 'WhyChooseUsWithSmallBlocks',
        label: 'With Small Blocks',
        template: createCleanComponentData('WhyChooseUsWithSmallBlocks')
      },
      {
        type: 'WhyChooseUsWithBlocks',
        label: 'With Normal Blocks',
        template: createCleanComponentData('WhyChooseUsWithBlocks')
      },
      {
        type: 'WhyChooseUsWithStory',
        label: 'With Story',
        template: createCleanComponentData('WhyChooseUsWithStory')
      }
    ]
  },
  {
    category: 'How It Works',
    items: [
      {
        type: 'HowItWorksWithBlocks',
        label: 'With Blocks',
        template: createCleanComponentData('HowItWorksWithBlocks')
      },
      {
        type: 'HowItWorksWithWorkflow',
        label: 'With Workflow Steps',
        template: createCleanComponentData('HowItWorksWithWorkflow')
      },
    ]
  },
  {
    category: 'Features Telling',
    items: [
      {
        type: 'FeaturesTabbed',
        label: 'Features Tabbed',
        template: createCleanComponentData('FeaturesTabbed')
      }
    ]
  },
  {
    category: 'Product Benefits',
    items: [
      {
        type: 'ProductBenefitsWithBlocks',
        label: 'Benefits Blocks',
        template: createCleanComponentData('ProductBenefitsWithBlocks')
      },
      {
        type: 'ProductBenefitsWithTable',
        label: 'Benefits Table',
        template: createCleanComponentData('ProductBenefitsWithTable')
      }
    ]
  },
  {
    category: 'User Reviews',
    items: [
      {
        type: 'UserReviewsWithMovingCards',
        label: 'With Moving Cards',
        template: createCleanComponentData('UserReviewsWithMovingCards')
      }
    ]
  },
  {
    category: 'Meet Our Team',
    items: [
      {
        type: 'MeetOurTeam',
        label: 'Meet Our Team',
        template: createCleanComponentData('MeetOurTeam')
      }
    ]
  },
  {
    category: 'Job List',
    items: [
      {
        type: 'JobList',
        label: 'Job List',
        template: createCleanComponentData('JobList')
      }
    ]
  },
  {
    category: 'FAQ',
    items: [
      {
        type: 'Faqs',
        label: 'FAQ Section',
        template: createCleanComponentData('Faqs')
      }
    ]
  },
  {
    category: 'Call to Action',
    items: [
      {
        type: 'CallToAction',
        label: 'Simple Version',
        template: createCleanComponentData('CallToAction')
      },
      {
        type: 'CallToActionComplex',
        label: 'Complex Version',
        template: createCleanComponentData('CallToActionComplex')
      },
      {
        type: 'CallToActionWithEmailInput',
        label: 'With Email Input',
        template: createCleanComponentData('CallToActionWithEmailInput')
      }
    ]
  },
  {
    category: 'Page Lists',
    items: [
      {
        type: 'PageListCard',
        label: 'Page List Card',
        template: createCleanComponentData('PageListCard'),
      }
    ]
  },
  {
    category: 'Subscription',
    items: [
      {
        type: 'SubscriptionCard',
        label: 'Subscription Card',
        template: createCleanComponentData('SubscriptionCard')
      }
    ]
  },
  {
    category: 'Comparison',
    items: [
      {
        type: 'FeatureComparisonTable',
        label: 'Feature Comparison Table',
        template: createCleanComponentData('FeatureComparisonTable'),
        description: "A detailed feature comparison table for comparing different plans or products."
      }
    ]
  }
]; 