export const SECTION_TAGS = {
    HeroSectionWithVideo: {
      title: 'h1',
      subTitle: 'h2',
      description: 'p',
      buttonText: 'button',
      videoUrl: 'video'
    },
    CallToAction: {
      title: 'h2',
      subTitle: 'h3',
      buttonText: 'button'
    },
    TitleSectionWithImage: {
      title: 'h1',
      subTitle: 'h2',
      author: 'span',
      publishDate: 'time',
      image: 'img',
      imageAlt: 'alt'
    },
    HowItWorksWithWorkflow: {
      title: 'h2',
      buttonText: 'button',
      number: 'span',
      content: 'h3'
    },
    HowItWorksWithThreeBlocks: {
      title: 'h2',
      subTitle: 'p',
      buttonText: 'button',
      moduleTitle: 'h3',
      moduleContent: 'p'
    },
    KeyResultsWithImage: {
      percentage: 'strong',
      description: 'p',
      image: 'img',
      imageAlt: 'alt'
    },
    KeyResultsWithTextBlock: {
      percentage: 'strong',
      description: 'p',
      contentTitle: 'h3',
      contentText: 'p'
    },
    ProductBenefitsWithFourBlocks: {
      title: 'h2',
      description: 'p',
      buttonText: 'button',
      moduleTitle: 'h3',
      moduleContent: 'p'
    },
    WhyChooseUsWithTwoHugeBlocks: {
      title: 'h2',
      subTitle: 'p',
      moduleTitle: 'h3',
      moduleContent: 'p',
      buttonText: 'button',
      image: 'img',
      imageAlt: 'alt'
    },
    MoreInsightsWithFourCards: {
      title: 'h3',
      subTitle: 'p',
      directTo: 'a',
      image: 'img'
    },
    Faqs: {
      question: 'h3',
      answer: 'p'
    },
    KeyResultsWithThreeCards: {
      competitorName: 'h3',
      percentage: 'strong',
      metric: 'span',
      description: 'p'
    },
    TitleSection: {
      title: 'h1',
      subTitle: 'p'
    },
    ProductComparisonTable: {
      title: 'h2',
      subTitle: 'p',
      companyName: 'h3',
      featureName: 'h4'
    },
    WhyChooseUsWithSixSmallBlocks: {
      emoji: 'span',
      title: 'h2',
      subTitle: 'p',
      icon: 'span',
      moduleTitle: 'h3',
      moduleContent: 'p'
    },
    ProductBenefitsWithTable: {
      title: 'h2',
      subTitle: 'p',
      buttonText: 'button',
      icon: 'span',
      contentTitle: 'h3',
      contentText: 'p'
    }
}
  
  // 也可以添加一些辅助函数
  export const getSectionTags = (sectionType) => {
    return SECTION_TAGS[sectionType] || {}
  }