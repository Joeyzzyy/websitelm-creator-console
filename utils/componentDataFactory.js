import { componentValidationRules } from '../config/componentValidationRules';

// 组件默认数据工厂
export const createCleanComponentData = (componentType) => {
  const defaultValues = {
    TitleSection: {
      title: '[DEMO] Enter Title Here',
      subTitle: '[DEMO] Enter Subtitle Here',
      bottomContent: {
        author: '[SAMPLE] Author Name',
        publishDate: new Date().toISOString().split('T')[0]
      }
    },
      
    TitleSectionWithImage: {
      title: '[DEMO] Enter Title Here',
      subTitle: '[DEMO] Enter Subtitle Here',
      leftContent: {
        author: '[SAMPLE] Author Name',
        publishDate: new Date().toISOString().split('T')[0]
      },
      rightContent: {
        imageUrl: '/assets/images/placeholder.png',
        imageAlt: '[SAMPLE] Image Description'
      }
    },
    
    HeroSectionWithVideo: {
      topContent: {
        title: 'Welcome to Our Platform',
        description: 'Discover how our solution can help you achieve your goals',
        buttonText: 'Get Started',
        buttonLink: '#',
        videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'
      }
    },
    
    HeroSectionWithMultipleTexts: {
      topContent: {
        title: 'Transform Your Business',
        subTitle: 'Learn how our platform can help you grow',
        buttonText: 'Start Free Trial',
        buttonLink: '#',
        ctaButtonText: 'Contact Sales',
        ctaButtonLink: '#',
        showButton: true,
        showCtaButton: true,
        highlightWordCount: 2,
        enableProductHunt: false,
        productHuntId: '',
        bannerImage: '/assets/images/placeholder.png'
      }
    },
    
    WhyChooseUsWithSmallBlocks: {
      topContent: {
        title: 'Why Choose Us',
        description: 'Discover our unique advantages'
      },
      bottomContent: [
        { 
          topText: 'Feature 1',
          middleText: 'Value 1',
          bottomText: 'Description 1'
        },
        { 
          topText: 'Feature 2',
          middleText: 'Value 2',
          bottomText: 'Description 2'
        },
        { 
          topText: 'Feature 3',
          middleText: 'Value 3',
          bottomText: 'Description 3'
        }
      ]
    },
    
    WhyChooseUsWithBlocks: {
      topContent: {
        title: 'Our Advantages',
        description: 'What sets us apart, and why you should choose us',
      },
      bottomContent: [
        { 
          title: 'Main Feature 1', 
          description: 'Detailed description of feature 1',
          content: 'Extended content for feature 1',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: 'https://picsum.photos/1200/600',
          imageAlt: 'Feature 1 illustration'
        },
        { 
          title: 'Main Feature 2', 
          description: 'Detailed description of feature 2',
          content: 'Extended content for feature 2',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: 'https://picsum.photos/1200/600',
          imageAlt: 'Feature 2 illustration'
        }
      ]
    },
    
    HowItWorksWithWorkflow: {
      topContent: {
        title: 'Transform Your Business',
        subTitle: 'Learn how our platform can help you grow',
        buttonText: 'Get Started',
        buttonLink: '#',
        ctaButtonText: 'Learn More',
        ctaButtonLink: '#',
        showButton: true,
        showCtaButton: true,
        imageUrl: 'https://picsum.photos/1200/600',
        imageAlt: 'Workflow Diagram Example'
      },
      bottomContent: [
        {
          number: '01',
          title: '[DEMO] Sign Up',
          subTitle: '[DEMO] Create Your Account',
          content: 'Get started by creating your account in just a few minutes. No credit card required.'
        },
        {
          number: '02',
          title: '[DEMO] Configure',
          subTitle: '[DEMO] Set Your Preferences',
          content: 'Customize your settings and preferences to match your specific needs and requirements.'
        },
        {
          number: '03',
          title: '[DEMO] Launch',
          subTitle: '[DEMO] Start Using Platform',
          content: 'Begin using the platform immediately and see results. Our intuitive interface makes it easy to get started.'
        }
      ]
    },

    HowItWorksWithBlocks: {
      leftContent: {
        title: '[DEMO] How It Works',
        subTitle: '[SAMPLE] Enter your process description here',
        buttonText: '[DEMO] Start Now',
        buttonLink: '#'
      },
      rightContent: [
        {
          contentTitle: '[DEMO] 01',
          content: '[SAMPLE] Description of step 1'
        },
        {
          contentTitle: '[DEMO] 02',
          content: '[SAMPLE] Description of step 2'
        },
        {
          contentTitle: '[DEMO] 03',
          content: '[SAMPLE] Description of step 3'
        }
      ]
    },
    
    ProductBenefitsWithBlocks: {
      "leftContent": {
          "buttonLink": "#",
          "buttonText": "Learn More",
          "description": "Discover the advantages of our solution",
          "title": "Product Benefits"
      },
      "rightContent": [
          {
              "content": "Description of benefit 1",
              "icon": "mdi:check",
              "title": "Benefit 1"
          },
          {
              "content": "Description of benefit 2",
              "icon": "mdi:close",
              "title": "Benefit 2"
          },
          {
              "content": "Description of benefit 3",
              "icon": "mdi:download",
              "title": "Benefit 3"
          },
          {
              "content": "Description of benefit 4",
              "icon": "mdi:heart",
              "title": "Benefit 4"
          }
      ]
    },

    UserReviewsWithMovingCards: {
        title: '[DEMO] Customer Reviews',
        bottomContent: [
          {
            name: "[SAMPLE] John Smith",
            position: "[SAMPLE] Position - Company",
            avatarUrl: '/assets/images/placeholder.png',
            avatarAlt: "[SAMPLE] User avatar",
            title: "[DEMO] Review Title",
            content: "[SAMPLE] Enter your customer review content here"
          },
          {
            name: "David Miller",
            position: "Innovation Director - FutureCorp",
            avatarUrl: '/assets/images/placeholder.png',
            avatarAlt: "David Miller's avatar",
            title: "Revolutionary Content Creation",
            content: "websitelm AI has completely transformed our approach to video marketing. The AI-driven content generation is not just fast - it's incredibly intelligent and adaptable."
          },
          {
            name: "Alexandra Peters",
            position: "Global Marketing Head - TechVision",
            avatarUrl: '/assets/images/placeholder.png',
            avatarAlt: "Sarah Chen's avatar",
            title: "Exceptional Marketing Results",
            content: "The versatility and speed of websitelm AI's video generation have given us a competitive edge. Our marketing campaigns are now more dynamic and engaging than ever."
          },
          {
            name: "Thomas Wright",
            position: "Digital Strategy Lead - MediaPro",
            avatarUrl: '/assets/images/placeholder.png',
            avatarAlt: "Sarah Chen's avatar",
            title: "Game-Changing Efficiency",
            content: "What used to take our team weeks now happens in minutes. The quality and consistency of the AI-generated videos have exceeded all our expectations."
          },
          {
            name: "Caroline Foster",
            position: "Brand Director - GlobalBrands",
            avatarUrl: '/assets/images/placeholder.png',
            avatarAlt: "Sarah Chen's avatar",
            title: "Perfect for Brand Building",
            content: "websitelm AI maintains our brand consistency across all markets while allowing for local customization. It's the perfect balance of efficiency and brand control."
          },
          {
            name: "Richard Martinez",
            position: "Operations Manager - ScaleUp Inc",
            avatarUrl: '/assets/images/placeholder.png',
            avatarAlt: "Sarah Chen's avatar",
            title: "Streamlined Production Process",
            content: "The automated workflow and intelligent content generation have revolutionized our video production. We're creating more content with better results and lower costs."
          }
        ]
      },

    Faqs: {
      topContent: [
        {
          question: "What is your product/service?",
          answer: "Our product/service is designed to help businesses improve their efficiency and productivity. It offers comprehensive solutions for [specific problem/need]."
        },
        {
          question: "How does it work?",
          answer: "Our solution works through a simple three-step process: 1) Initial setup and configuration 2) Integration with your existing systems 3) Automated optimization and reporting."
        },
        {
          question: "What are the key benefits?",
          answer: "The main benefits include: increased productivity, cost savings, improved accuracy, and better customer satisfaction. Our clients typically see results within the first month of implementation."
        },
        {
          question: "How much does it cost?",
          answer: "We offer flexible pricing plans tailored to different business sizes and needs. Contact our sales team for a detailed quote based on your specific requirements."
        },
        {
          question: "Is there customer support available?",
          answer: "Yes, we provide 24/7 customer support through multiple channels including phone, email, and live chat. Our dedicated support team is always ready to help."
        }
      ],
      bottomContent: {
        showButton: true,
        buttonText: "Learn More",
        buttonLink: "#"
      }
    },

    CallToActionComplex: {
      topContent: {
        title: 'Unlock Explosive Traffic with AI-Generated Landing Pages & Blog Posts.',
        description: "Elevate your website's SEO performance and drive meaningful traffic with AI-powered content creation. WebsiteLM is designed to streamline content generation, making it easier than ever to produce high-quality, SEO-optimized pages that engage your audience and rank higher in search results.",
      },
      bottomContent: {
        title: 'Key Benefits',
        content: [
          {
            title: 'Automate Content Creation',
            description: 'Save time and resources with AI-driven content generation for landing pages, blog posts, and more.'
          },
          {
            title: 'Boost SEO Performance',
            description: 'Leverage cutting-edge AI to craft content that not only resonates with your audience but also ranks well on search engines.'
          },
          {
            title: 'Tailored for Your Audience',
            description: 'Personalize your website\'s content using advanced AI to better connect with your target market and improve user engagement.'
          },
          {
            title: 'Continuous Optimization',
            description: 'Track, update, and optimize your content for sustained traffic growth and higher conversions.'
          }
        ],
        callToActionEngagementTop: 'Start transforming your website today—effortlessly build, optimize, and maintain content that drives results.',
        callToActionEngagementBottom: 'Join thousands of users already maximizing their website\'s potential with WebsiteLM.',
        buttonText: "Get Started Now",
        ctaButtonText: "Book a Demo",
        showButton: true,
        showCtaButton: true
      },
    },

    WhyChooseUsWithStory: {
      title: '[DEMO] Why Choose Us Story',
      description: '[SAMPLE] Display founder story and company introduction',
      leftContent: {
        avatarUrl: '/assets/images/placeholder.png',
        avatarAlt: '[SAMPLE] Founder Photo',
        name: '[SAMPLE] John Smith',
        title: '[SAMPLE] Founder & CEO',
        introduction: '[SAMPLE] Brief introduction about the founder\'s background and expertise in the industry. Include key achievements and vision.'
      },
      rightContent: [
        {
          contentTitle: '[DEMO] Our Beginning',
          contentText: '[SAMPLE] In 2018, our founder identified a critical gap in the market. After experiencing firsthand the challenges of traditional solutions, we embarked on a mission to revolutionize the industry. Starting with just a small team of dedicated innovators, we developed our first prototype in a modest office space, fueled by our passion for creating meaningful change.'
        },
        {
          contentTitle: '[DEMO] Market Discovery',
          contentText: '[SAMPLE] Through extensive market research and countless conversations with potential users, we discovered that businesses were struggling with inefficient processes and outdated technologies. This insight led us to develop our core technology platform, incorporating cutting-edge AI and machine learning capabilities. Early adopters quickly validated our approach, providing valuable feedback that helped shape our solution.'
        },
        {
          contentTitle: '[DEMO] Current Success',
          contentText: '[SAMPLE] Today, we serve over 1,000 enterprise clients globally, with a team of 200+ dedicated professionals. Our platform processes millions of transactions daily, helping businesses achieve unprecedented efficiency gains. We\'ve been recognized by leading industry analysts and have won multiple innovation awards. But what truly drives us is the transformative impact we continue to have on our clients\' businesses.'
        },
        {
          contentTitle: '[DEMO] Future Vision',
          contentText: '[SAMPLE] Looking ahead, we\'re committed to pushing the boundaries of innovation. Our R&D team is actively developing next-generation features that will further revolutionize how businesses operate. We believe in creating technology that not only solves today\'s challenges but anticipates tomorrow\'s needs.'
        }
      ]
    },

    FeaturesTabbed: {
      title: '[DEMO] Product Features',
      description: '[SAMPLE] Overview of our main product features and capabilities',
      bottomContent: [
        {
          tabName: '[DEMO] Feature 1',
          title: '[DEMO] Feature 1 Title',
          description: '[SAMPLE] Description of feature 1 benefits',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Feature 1 illustration',
          buttonText: '[DEMO] Learn More',
          buttonLink: '#',
          imageOnRight: true
        },
        {
          tabName: '[DEMO] Feature 2',
          title: '[DEMO] Feature 2 Title',
          description: '[SAMPLE] Description of feature 2 benefits',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Feature 2 illustration',
          buttonText: '[DEMO] Learn More',
          buttonLink: '#',
          imageOnRight: false
        },
        {
          tabName: '[DEMO] Feature 3',
          title: '[DEMO] Feature 3 Title',
          description: '[SAMPLE] Description of feature 3 benefits',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Feature 3 illustration',
          buttonText: '[DEMO] Learn More',
          buttonLink: '#'
        },
        {
          tabName: '[DEMO] Feature 4',
          title: '[DEMO] Feature 4 Title',
          description: '[SAMPLE] Description of feature 4 benefits',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Feature 4 illustration',
          buttonText: '[DEMO] Learn More',
          buttonLink: '#'
        }
      ]
    },

    MeetOurTeam: {
      topContent: {
        subtitle: '[DEMO] Our Team',
        title: '[DEMO] Meet Our Industry Experts',
        description: '[SAMPLE] Brief introduction about our team and their expertise'
      },
      bottomContent: [
        {
          name: '[SAMPLE] John Smith',
          title: '[SAMPLE] Chief Executive Officer',
          description: '[SAMPLE] 15+ years of industry experience. Expert in business strategy and innovation.',
          avatarUrl: '/assets/images/placeholder.png',
          avatarAlt: '[SAMPLE] CEO Photo',
          socials: []
        },
        {
          name: '[SAMPLE] Sarah Johnson',
          title: '[SAMPLE] Product Director',
          description: '[SAMPLE] 10+ years in product management. Specialized in user experience design.',
          avatarUrl: '/assets/images/placeholder.png',
          avatarAlt: '[SAMPLE] Product Director Photo',
          socials: []
        },
        {
          name: '[SAMPLE] David Brown',
          title: '[SAMPLE] Technical Director',
          description: '[SAMPLE] Expert in AI and machine learning. Leading technical innovation.',
          avatarUrl: '/assets/images/placeholder.png',
          avatarAlt: '[SAMPLE] Tech Director Photo',
          socials: []
        }
      ]
    },

    JobList: {
      topContent: {
        title: '[DEMO] Career Opportunities',
        description: '[SAMPLE] Explore our open positions'
      },
      bottomContent: [
        {
          position: '[DEMO] Job Title 1',
          type: '[SAMPLE] Full-time',
          location: '[SAMPLE] City, Country',
          salary: '[SAMPLE] $XXk-$XXXk',
          tags: ['[SAMPLE] Skill 1', '[SAMPLE] Skill 2', '[SAMPLE] Skill 3'],
          responsibilities: [
            '[SAMPLE] Key responsibility 1',
            '[SAMPLE] Key responsibility 2',
            '[SAMPLE] Key responsibility 3'
          ],
          requirements: [
            '[SAMPLE] Required qualification 1',
            '[SAMPLE] Required qualification 2',
            '[SAMPLE] Required qualification 3'
          ],
          buttonText: '[DEMO] Apply Now',
          buttonLink: '#'
        }
      ]
    },

    CallToActionWithEmailInput: {
      title: '[DEMO] Your Main Call to Action Headline',
      buttonText: "[DEMO] Get Started",
      bottomContent: {
        inputPlaceholder: "[SAMPLE] Enter your email",
        smallText: "[SAMPLE] We respect your privacy and keep your data secure"
      }
    },

    KeyResultsWithTextBlock: {
      leftContent: [
        {
          percentage: 90,
          description: '[SAMPLE] Achievement metric description 1',
          display: true
        },
        {
          percentage: 40,
          description: '[SAMPLE] Achievement metric description 2',
          display: true
        },
        {
          percentage: 70,
          description: '[SAMPLE] Achievement metric description 3',
          display: true
        }
      ],
      rightContent: '<p><strong><span class="content-subtitle">Introduction Of Our Available Plans</span></strong></p><p>WebsiteLM currently provides two plans that can be directly subscribed and purchased. <br>One of them is the standard version with the price of $45/mo. for monthly payment and $36/mo. for annual payment.</p><p>Another one is the professional version with the price of $129/mo. for monthly payment and $99/mo. for annual payment.</p><p></p><p>The key differences between those plans are:<br>1. Times you can use our AI keywords planning feature (30 times compared with 100times)<br>2. Pages you can generated with our AI page generation feature (30 indexed-ready page compared with 100 pages.)</p><p></p><p>We strongly recommended you to started with a standard version with a monthly payment. You will have a 15-day cash-back guarantee and you can update you plan smoothly any time if you are satisfied with WebsiteLM.<br><br>To know more about our pricing plans, <a target="_blank" rel="noopener noreferrer nofollow" class="content-link" href="https://websitelm.com/pricing"><strong>click here!</strong></a><br></p>'
    },

    ProductBenefitsWithTable: {
      "leftContent": {
          "imageAlt": "Abstract image",
          "imageUrl": "https://picsum.photos/1080/720"
      },
      "rightContent": [
          {
              "content": "Generate professional videos automatically",
              "contentTitle": "AI Video Creation",
              "icon": "mdi:help"
          },
          {
              "content": "Support for 40+ languages",
              "contentTitle": "Global Reach",
              "icon": "mdi:heart"
          },
          {
              "content": "Complete videos in minutes",
              "contentTitle": "Fast Processing",
              "icon": "mdi:sync"
          },
          {
              "content": "Save up to 90% on video production",
              "contentTitle": "Cost Effective",
              "icon": "mdi:document"
          }
      ],
      "topContent": {
          "buttonLink": "https://websitelm.com",
          "buttonText": "Start Free Trial",
          "description": "Discover the benefits of using our product",
          "title": "Product Benefits"
      }
    },

    CallToAction: {
      title: '[DEMO] Your Main Call to Action',
      subTitle: '[SAMPLE] Supporting text for your call to action',
      bottomContent: {
        buttonText: "[DEMO] Get Started",
        buttonLink: "#"
      }
    },

    KeyResultsWithImage: {
      leftContent: [
        {
          percentage: 95,
          description: '[SAMPLE] Achievement metric 1 description'
        },
        {
          percentage: 80,
          description: '[SAMPLE] Achievement metric 2 description'
        },
        {
          percentage: 70,
          description: '[SAMPLE] Achievement metric 3 description'
        }
      ],
      rightContent: {
        imageUrl: '/assets/images/placeholder.png',
        imageAlt: '[SAMPLE] Results Illustration',
      }
    },

    KeyResultsWithCards: {
      bottomContent: [
        {
          competitorLogo: '/assets/images/placeholder.png',
          competitorLogoAlt: '[SAMPLE] Competitor 1',
          competitorName: '[DEMO] Traditional Method',
          percentage: 85,
          metric: '[DEMO] Efficiency Gain',
          description: '[SAMPLE] Description of improvement compared to traditional methods',
          buttonText: '[DEMO] View Details',
          buttonLink: '#'
        },
        {
          competitorLogo: '/assets/images/placeholder.png',
          competitorLogoAlt: '[SAMPLE] Competitor 2',
          competitorName: '[DEMO] Manual Process',
          percentage: 90,
          metric: '[DEMO] Time Saved',
          description: '[SAMPLE] Description of time savings compared to manual process',
          buttonText: '[DEMO] View Details',
          buttonLink: '#'
        },
        {
          competitorLogo: '/assets/images/placeholder.png',
          competitorLogoAlt: '[SAMPLE] Competitor 3',
          competitorName: '[DEMO] Basic Tools',
          percentage: 73,
          metric: '[DEMO] Performance Boost',
          description: '[SAMPLE] Description of performance improvements over basic tools',
          buttonText: '[DEMO] View Details',
          buttonLink: '#'
        }
      ]
    },

    PageListCard: {
      title: '[DEMO] Card List',
      subTitle: '[DEMO] Featured Content',
      bottomContent: [
        {
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Content Image 1',
          tag: '[SAMPLE] Category 1',
          title: '[DEMO] Sample Article Title 1',
          targetUrl: '#'
        },
        {
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Content Image 2',
          tag: '[SAMPLE] Category 2',
          title: '[DEMO] Sample Article Title 2',
          targetUrl: '#'
        },
        {
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Content Image 3',
          tag: '[SAMPLE] Category 3',
          title: '[DEMO] Sample Article Title 3',
          targetUrl: '#'
        }
      ]
    },

    SubscriptionCard: {
      title: '[DEMO] Choose Your Plan',
      subTitle: '[DEMO] Select a plan that suits your needs',
      bottomContent: {
        yearlyDiscount: '20%',
        plans: [
          {
            name: 'Basic',
            price: {
              monthly: '29',
              yearly: '24'
            },
            discount: '20%',
            description: 'Perfect for getting started',
            buttonText: 'Get Started',
            popular: false,
            features: [
              {
                title: 'Core Features',
                items: [
                  'Up to 10 users',
                  'Basic analytics',
                  'Email support'
                ]
              }
            ]
          },
          {
            name: 'Professional',
            price: {
              monthly: '79',
              yearly: '64'
            },
            discount: '20%',
            description: 'Best for growing teams',
            buttonText: 'Start Free Trial',
            popular: true,
            features: [
              {
                title: 'Everything in Basic, plus:',
                items: [
                  'Up to 50 users',
                  'Advanced analytics',
                  'Priority support',
                  'Custom integrations'
                ]
              }
            ]
          },
          {
            name: 'Enterprise',
            price: {
              monthly: '199',
              yearly: '164'
            },
            discount: '20%',
            description: 'For large organizations',
            buttonText: 'Contact Sales',
            popular: false,
            features: [
              {
                title: 'Everything in Pro, plus:',
                items: [
                  'Unlimited users',
                  'Custom reporting',
                  'Dedicated support',
                  'Advanced security',
                  'SLA guarantee'
                ]
              }
            ]
          }
        ]
      }
    },

    FeatureComparisonTable: {
      title: '[DEMO] Compare All Features',
      subTitle: '[DEMO] Choose the plan that best fits your needs',
      bottomContent: {
        columns: [
          {
            title: 'Essential',
            subtitle: 'Basic features',
            recommended: false
          },
          {
            title: 'Professional',
            subtitle: 'Most popular',
            recommended: true
          },
          {
            title: 'Enterprise',
            subtitle: 'Custom solutions',
            recommended: false
          }
        ],
        featureGroups: [
          {
            name: 'Core Features',
            features: [
              {
                name: 'Number of Users',
                values: ['Up to 10 users', 'Up to 50 users', 'Unlimited']
              },
              {
                name: 'Storage Space',
                values: ['10 GB', '50 GB', 'Unlimited']
              }
            ]
          },
          {
            name: 'Support',
            features: [
              {
                name: 'Email Support',
                values: ['Basic', 'Priority', '24/7 Dedicated']
              },
              {
                name: 'Phone Support',
                values: ['✖', '✔', '✔']
              }
            ]
          }
        ]
      }
    }
  };

  // 获取验证规则
  const rules = componentValidationRules[componentType];
  if (!rules) {
    console.warn(`No rules found for component type: ${componentType}`);
    return {};
  }

  // 创建干净的组件数据
  const cleanData = {
    componentName: componentType,
    ...defaultValues[componentType]
  };

  return cleanData;
}; 