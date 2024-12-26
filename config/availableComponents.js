import { createCleanComponentData } from '../utils/componentDataFactory';

export const availableComponents = [
  {
    category: 'Title Sections',
    items: [
      {
        type: 'TitleSection',
        label: 'Standard ',
        template: createCleanComponentData('TitleSection')
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
        label: 'Key Results With Text Block',
        template: createCleanComponentData('KeyResultsWithTextBlock')
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
        type: 'HowItWorksWithWorkflow',
        label: 'Three Workflow Steps',
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
  }
]; 