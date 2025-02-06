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
    ctaButtonText: 'button',
    buttonLink: 'a',
    ctaButtonLink: 'a',
    highlightWordCount: 'span'
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
    buttonLink: 'a',
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
  HowItWorksWithBlocks: {
    icon: 'span',
    title: 'h2',
    contentTitle: 'h3',
    subTitle: 'p',
    buttonText: 'button',
    buttonLink: 'a',
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
  ProductBenefitsWithTable: {
    title: 'h2',
    subTitle: 'p',
    buttonText: 'button',
    icon: 'span',
    contentTitle: 'h3',
    content: 'p',
    buttonLink: 'a'
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
    buttonText: 'button',
    buttonLink: 'a'
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
    buttonText: 'button',
    buttonLink: 'a'
  },
  KeyResultsWithTextBlock: {
    percentage: 'strong',
    description: 'p',
    contentTitle: 'h3',
    contentText: 'p'
  },
  KeyResultsWithImage: {
    percentage: 'strong',
    description: 'p',
    image: 'img',
    imageAlt: 'alt'
  },
  KeyResultsWithCards: {
    logo: 'img',
    competitorName: 'h3',
    percentage: 'strong',
    metric: 'span',
    description: 'p',
    buttonText: 'button',
    buttonLink: 'a'
  },
  Faqs: {
    question: 'h3',
    answer: 'p'
  },
  PageListCard: {
    imageUrl: 'img',
    imageAlt: 'alt',
    subTitle: 'h3',
    title: 'h2',
    targetUrl: 'a',
    cardTitle: 'h3',
    tag: 'p'
  },
  SubscriptionCard: {
    title: 'h2',
    subTitle: 'p',
    yearlyDiscount: 'span',
    planName: 'h3',
    monthlyPrice: 'span',
    yearlyPrice: 'span',
    discount: 'span',
    description: 'p',
    buttonText: 'button',
    featureTitle: 'h4',
    featureItem: 'li'
  },
  FeatureComparisonTable: {
    title: 'h2',
    description: 'p',
    columnTitle: 'h3',
    columnSubtitle: 'p',
    groupName: 'h4',
    featureName: 'li',
    featureValue: 'span'
  }
}
  
export const getSectionTags = (sectionType) => {
  return SECTION_TAGS[sectionType] || {}
}