import FeaturesTabbed from "../components/sections/templates/FeaturesTabbed.vue";

const componentValidationRules = {
    TitleSection: {
      requiredFields: [
        'title', 
        'subTitle',
        'bottomContent.author',  
        'bottomContent.publishDate' 
      ],
      allowedFields: [
        'title',
        'subTitle',
        'bottomContent.author',
        'bottomContent.publishDate'
      ]
    },
  
    TitleSectionWithImage: {
      requiredFields: [
        'title',
        'subTitle',
        'leftContent.author',
        'leftContent.publishDate',
        'rightContent.imageUrl',
        'rightContent.imageAlt'
      ],
      allowedFields: [
        'title',
        'subTitle',
        'leftContent.author',
        'leftContent.publishDate',
        'rightContent.imageUrl',
        'rightContent.imageAlt'
      ]
    },
  
    HeroSectionWithVideo: {
      requiredFields: [
        'topContent.title',
        'topContent.description',
        'topContent.buttonText',
        'topContent.buttonLink',
        'topContent.videoUrl'
      ],
      allowedFields: [
        'topContent.title',
        'topContent.description',
        'topContent.buttonText',
        'topContent.buttonLink',
        'topContent.videoUrl'
      ]
    },
  
    HeroSectionWithMultipleTexts: {
      requiredFields: [
        'topContent.title',
        'topContent.description',
        'topContent.buttonText',
        'topContent.ctaButtonText'
      ],
      allowedFields: [
        'topContent.title',
        'topContent.description',
        'topContent.buttonText',
        'topContent.ctaButtonText'
      ]
    },
  
    WhyChooseUsWithSmallBlocks: {
      requiredFields: [
        'title',
        'description',
        'buttonText',
        'bottomContent'
      ],
      allowedFields: [
        'title',
        'description',
        'buttonText',
        'bottomContent'
      ]
    },
  
    WhyChooseUsWithBlocks: {
      requiredFields: [
        'topContent.emoji',
        'topContent.title',
        'topContent.description',
        'topContent.subTitle',
        'bottomContent'
      ],
      allowedFields: [
        'topContent.emoji',
        'topContent.title',
        'topContent.description',
        'topContent.subTitle',
        'bottomContent'
      ]
    },
  
    WhyChooseUsWithStory: {
      requiredFields: [
        'topContent.title',
        'topContent.description',
        'leftContent.avatar',
        'leftContent.name',
        'leftContent.introduction',
        'rightContent'
      ],
      allowedFields: [
        'topContent.title',
        'topContent.description',
        'leftContent.avatar',
        'leftContent.name',
        'leftContent.introduction',
        'rightContent'
      ]
    },
  
    HowItWorksWithWorkflow: {
      requiredFields: [
        'topContent.title',
        'topContent.buttonText',
        'bottomContent'  
      ],
      allowedFields: [
        'topContent.title',
        'topContent.buttonText',
        'bottomContent' 
      ]
    },
  
    ProductBenefitsWithBlocks: {
      requiredFields: [
        'leftContent.title',
        'leftContent.description',
        'leftContent.buttonText',
        'leftContent.buttonLink',
        'rightContent'  
      ],
      allowedFields: [
        'leftContent.title',
        'leftContent.description',
        'leftContent.buttonText',
        'leftContent.buttonLink',
        'rightContent'  
      ]
    },
  
    UserReviewsWithMovingCards: {
      requiredFields: [
        'topContent.title',
        'bottomContent'
      ],
      allowedFields: [
        'topContent.title',
        'bottomContent'
      ]
    },
  
    Faqs: {
      requiredFields: [
        'bottomContent'
      ],
      allowedFields: [
        'bottomContent' 
      ]
    },
  
    CallToActionComplex: {
      requiredFields: [
        'title',
        'subTitle',
        'topContent.title',
        'topContent.description',
        'bottomContent.title',
        'bottomContent.content',
        'bottomContent.callToActionEngagementTop',
        'bottomContent.callToActionEngagementBottom',
        'buttonText',
        'ctaButtonText'
      ],
      allowedFields: [
        'title',
        'subTitle',
        'topContent.title',
        'topContent.description',
        'bottomContent.title',
        'bottomContent.content',
        'bottomContent.callToActionEngagementTop',
        'bottomContent.callToActionEngagementBottom',
        'buttonText',
        'ctaButtonText'
      ]
    },

    CallToActionWithEmailInput: {
      requiredFields: [
        'title',
        'inputPlaceholder',
        'buttonText'
      ],
      allowedFields: [
        'title',
        'inputPlaceholder',
        'buttonText'
      ]
    },

    FeaturesTabbed: {
      requiredFields: [
        'title',
        'description',
        'bottomContent'
      ],
      allowedFields: [
        'title',
        'description',
        'bottomContent'
      ]
    },

    MeetOurTeam: {
      requiredFields: [
        'topContent.subtitle',
        'topContent.title',
        'topContent.description',
        'bottomContent'
      ],
      allowedFields: [
        'topContent.subtitle',
        'topContent.title',
        'topContent.description',
        'bottomContent'
      ]
    },
  
    JobList: {
      requiredFields: [
        'topContent.title',
        'topContent.subTitle',
        'bottomContent'
      ],
      allowedFields: [
        'topContent.title',
        'topContent.subTitle',
        'bottomContent'
      ]
    },
    
    ProductBenefitsWithTable: {
      requiredFields: [
        'leftContent.icon',
        'leftContent.title',  
        'leftContent.subTitle',
        'leftContent.buttonText',
        'rightContent',
      ],
      allowedFields: [
        'leftContent.icon',
        'leftContent.title',  
        'leftContent.subTitle',
        'leftContent.buttonText',
        'rightContent',
      ]
    },
  
    // KeyResultsWithImage: {
    //   requiredFields: [
    //     'leftContent',  
    //     'rightContent.imageUrl',
    //     'rightContent.imageAlt'
    //   ],
    //   allowedFields: [
    //     'leftContent',  
    //     'rightContent.imageUrl',
    //     'rightContent.imageAlt'
    //   ]
    // },
  
    // // 三卡片关键结果组件
    // KeyResultsWithThreeCards: {
    //   requiredFields: [
    //     'bottomContent'
    //   ],
    //   allowedFields: [
    //     'bottomContent'  
    //   ]
    // },
  
    KeyResultsWithTextBlock: {
      requiredFields: [
        'leftContent',
        'rightContent'
      ],
      allowedFields: [
        'leftContent',
        'rightContent'  
      ]
    },
  
    // HowItWorksWithThreeBlocks: {
    //   requiredFields: [
    //     'leftContent.icon',
    //     'leftContent.title',
    //     'leftContent.subTitle',
    //     'leftContent.buttonText',
    //     'rightContent'  
    //   ],
    //   allowedFields: [
    //     'leftContent.icon',
    //     'leftContent.title',
    //     'leftContent.subTitle',
    //     'leftContent.buttonText',
    //     'rightContent' 
    //   ]
    // },
  
    
  };

export { componentValidationRules };