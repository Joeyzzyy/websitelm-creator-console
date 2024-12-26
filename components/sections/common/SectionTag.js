export const SECTION_TAGS = {
  TitleSection: {
    title: 'h1',
    subTitle: 'h2',
    author: 'span',
    publishDate: 'time'
  },
  TitleSectionWithImage: {
    title: 'h1',
    subTitle: 'h2',
    author: 'span',
    publishDate: 'time',
    image: 'img',
    imageAlt: 'alt'
  },
  HeroSectionWithVideo: {
    title: 'h2',
    subTitle: 'h3',
    description: 'p',
    buttonText: 'button',
    videoUrl: 'video',
    buttonLink: 'a'
  },
  HeroSectionWithMultipleTexts: {
    title: 'h2',
    subTitle: 'h3',
    buttonText: 'button',
    ctaButtonText: 'button'
  },
  WhyChooseUsWithSmallBlocks: {
    emoji: 'span',
    title: 'h2',
    description: 'p',
    icon: 'span',
    moduleTitle: 'h3',
    moduleContent: 'p'
  },
  WhyChooseUsWithBlocks: {
    emoji: 'span',
    title: 'h2',
    description: 'p',
    moduleTitle: 'h3',
    moduleContent: 'p',
    buttonText: 'button',
    image: 'img',
    imageAlt: 'alt'
  },
  WhyChooseUsWithStory: {
    title: 'h2',
    description: 'p',
    avatarUrl: 'img',
    avatarAlt: 'alt',
    name: 'span',
    founderTitle: 'span',
    introduction: 'p',
    contentTitle: 'h3',
    contentText: 'p'
  },
  HowItWorksWithWorkflow: {
    emoji: 'span', 
    title: 'h2',
    description: 'p',
    stepTitle: 'h3',
    stepSubTitle: 'h4',
    number: 'span',
    content: 'p'
  },
  ProductBenefitsWithBlocks: {
    title: 'h2',
    description: 'p',
    buttonText: 'button',
    buttonLink: 'a',
    moduleIcon: 'span',
    moduleTitle: 'h3',
    moduleSubTitle: 'h4',
    moduleContent: 'p'
  },
  UserReviewsWithMovingCards: {
    title: 'h2',
    name: 'span',
    position: 'span',
    content: 'p',
    avatarUrl: 'img',
    avatarAlt: 'alt',
    reviewTitle: 'h3',
  },

  CallToActionComplex: {
    title: 'h2',
    subTitle: 'p',
    topTitle: 'h3',
    topDescription: 'p',
    contentTitle: 'h4',
    contentDescription: 'p',
    callToActionEngagementTop: 'p',
    callToActionEngagementBottom: 'p',
    buttonText: 'button',
    ctaButtonText: 'button'
  },
  FeaturesTabbed: {
    title: 'h2',
    description: 'p',
    tabTitle: 'span',
    contentTitle: 'h3',
    contentDescription: 'p',
    contentButtonText: 'button',
    imageUrl: 'img',
    imageAlt: 'alt',
    buttonText: 'button'
  },
  MeetOurTeam: {
    subtitle: 'span',
    title: 'h2',
    description: 'p',
    memberName: 'h3',
    memberTitle: 'h4',
    memberDescription: 'p',
    memberAvatar: 'img',
    memberAvatarAlt: 'alt',
  },
  JobList: {
    title: 'h2',
    description: 'p',
    position: 'h3',
    type: 'span',
    location: 'span',
    salary: 'span',
    tags: 'span',
    responsibilities: 'p',
    requirements: 'p'
  },
  CallToActionWithEmailInput: {
    title: 'h2',
    inputPlaceholder: 'input',
    buttonText: 'button'
  },



  

  CallToAction: {
    title: 'h2',
    subTitle: 'h3',
    buttonText: 'button'
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
  ProductComparisonTable: {
    title: 'h2',
    subTitle: 'p',
    companyName: 'h3',
    featureName: 'h4'
  },
  ProductBenefitsWithTable: {
    title: 'h2',
    subTitle: 'p',
    buttonText: 'button',
    icon: 'span',
    contentTitle: 'h3',
    content: 'p',
    buttonLink: 'a'
  }
}
  
export const getSectionTags = (sectionType) => {
  return SECTION_TAGS[sectionType] || {}
}