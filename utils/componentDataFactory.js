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
        showCtaButton: true
      }
    },
    
    WhyChooseUsWithSmallBlocks: {
      topContent: {
        icon: '⭐',
        title: 'Why Choose Us',
        description: 'Discover our unique advantages'
      },
      bottomContent: [
        { 
          icon: '🚀',
          title: 'Feature 1', 
          content: 'Description for feature 1' 
        },
        { 
          icon: '💡',
          title: 'Feature 2', 
          content: 'Description for feature 2' 
        },
        { 
          icon: '🎯',
          title: 'Feature 3', 
          content: 'Description for feature 3' 
        }
      ]
    },
    
    WhyChooseUsWithBlocks: {
      topContent: {
        icon: '🚀',
        title: 'Our Advantages',
        description: 'What sets us apart',
      },
      bottomContent: [
        { 
          title: 'Main Feature 1', 
          description: 'Detailed description of feature 1',
          content: 'Extended content for feature 1',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Feature 1 illustration'
        },
        { 
          title: 'Main Feature 2', 
          description: 'Detailed description of feature 2',
          content: 'Extended content for feature 2',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Feature 2 illustration'
        }
      ]
    },
    
    HowItWorksWithWorkflow: {
      topContent: {
        icon: '🚀',
        title: 'How It Works',
        description: 'Get Started Now'
      },
      bottomContent: [
        { number: 'Step 1', title: 'Random Title', subTitle: 'Random Subtitle', content: 'Random Content For Step 1' },
        { number: 'Step 2', title: 'Random Title', subTitle: 'Random Subtitle', content: 'Random Content For Step 2' },
        { number: 'Step 3', title: 'Random Title', subTitle: 'Random Subtitle', content: 'Random Content For Step 3' }
      ]
    },

    HowItWorksWithBlocks: {
      leftContent: {
        icon: '🚀',
        title: '[DEMO] How It Works',
        subTitle: '[SAMPLE] Enter your process description here',
        buttonText: '[DEMO] Start Now',
        buttonLink: '#'
      },
      rightContent: [
        {
          icon: '📝',
          contentTitle: '[DEMO] Step 1',
          content: '[SAMPLE] Description of step 1'
        },
        {
          icon: '🎨',
          contentTitle: '[DEMO] Step 2',
          content: '[SAMPLE] Description of step 2'
        },
        {
          icon: '🌐',
          contentTitle: '[DEMO] Step 3',
          content: '[SAMPLE] Description of step 3'
        }
      ]
    },
    
    ProductBenefitsWithBlocks: {
      leftContent: {
        title: 'Product Benefits',
        description: 'Discover the advantages of our solution',
        buttonText: 'Learn More',
        buttonLink: '#'
      },
      rightContent: [
        { 
          icon: '🚀',
          title: 'Benefit 1', 
          subTitle: 'Subtitle of benefit 1',
          content: 'Description of benefit 1',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Benefit 1 illustration'
        },
        { 
          icon: '🚀',
          title: 'Benefit 2', 
          subTitle: 'Subtitle of benefit 2',
          content: 'Description of benefit 2',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Benefit 2 illustration'
        },
        { 
          icon: '🚀',
          title: 'Benefit 3', 
          subTitle: 'Subtitle of benefit 2',
          content: 'Description of benefit 3',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Benefit 3 illustration'
        },
        { 
          icon: '🚀',
          title: 'Benefit 4', 
          subTitle: 'Subtitle of benefit 4',
          content: 'Description of benefit 4',
          buttonText: 'Learn More',
          buttonLink: '#',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: 'Benefit 4 illustration'
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
      bottomContent: [
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
      ]
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
          buttonLink: '#'
        },
        {
          tabName: '[DEMO] Feature 2',
          title: '[DEMO] Feature 2 Title',
          description: '[SAMPLE] Description of feature 2 benefits',
          imageUrl: '/assets/images/placeholder.png',
          imageAlt: '[SAMPLE] Feature 2 illustration',
          buttonText: '[DEMO] Learn More',
          buttonLink: '#'
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
        inputPlaceholder: "[SAMPLE] Enter your email"
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
      rightContent: [
        {
          contentTitle: '[DEMO] Main Feature 1',
          contentText: '[SAMPLE] Our AI-driven solution significantly enhances your workflow efficiency. Through intelligent automation technology, tasks that previously took hours can now be completed in minutes. According to customer feedback, teams save 60-80% of their time on average, allowing them to focus on more creative and strategic initiatives. This breakthrough in productivity has transformed how our clients approach their daily operations.'
        },
        {
          contentTitle: '[DEMO] Main Feature 2',
          contentText: '[SAMPLE] Leveraging advanced machine learning algorithms, our platform continuously learns and optimizes workflows. The system automatically analyzes user behavior patterns, identifies efficiency bottlenecks, and provides personalized improvement recommendations. This data-driven approach has helped over 1,000 businesses achieve remarkable operational improvements, with many reporting a 200% increase in productivity within the first month.'
        },
        {
          contentTitle: '[DEMO] Main Feature 3',
          contentText: '[SAMPLE] We offer comprehensive integration solutions that seamlessly connect with your existing systems. Whether you\'re using CRM, ERP, or other enterprise software, our platform adapts to your needs. Our enterprise-grade security ensures data protection while maintaining high performance. With 24/7 technical support and regular updates, we ensure your business operations run smoothly and efficiently.'
        }
      ]
    },

    ProductBenefitsWithTable: {
      leftContent: [
        {
          icon: '🎥',
          contentTitle: '[DEMO] Feature 1',
          content: '[SAMPLE] Description of feature 1'
        },
        {
          icon: '🌍',
          contentTitle: '[DEMO] Feature 2',
          content: '[SAMPLE] Description of feature 2'
        },
        {
          icon: '⚡',
          contentTitle: '[DEMO] Feature 3',
          content: '[SAMPLE] Description of feature 3'
        },
        {
          icon: '💰',
          contentTitle: '[DEMO] Feature 4',
          content: '[SAMPLE] Description of feature 4'
        }
      ],
      rightContent: {
        icon: '🚀',
        title: '[DEMO] Main Call to Action',
        subTitle: '[SAMPLE] Engaging subtitle for your call to action',
        buttonText: '[DEMO] Start Now',
        buttonLink: '#'
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