import { componentValidationRules } from '../config/componentValidationRules';

// 组件默认数据工厂
export const createCleanComponentData = (componentType) => {
  const defaultValues = {
    TitleSection: {
        title: 'Enter your title',
        subTitle: 'Enter your subtitle',
        bottomContent: {
          author: 'Author Name',
          publishDate: new Date().toISOString().split('T')[0]
        }
      },
      
      TitleSectionWithImage: {
        title: 'Enter your title',
        subTitle: 'Enter your subtitle',
        leftContent: {
          author: 'Author Name',
          publishDate: new Date().toISOString().split('T')[0]
        },
        rightContent: {
          imageUrl: 'https://placeholder.com/800x600',
          imageAlt: 'Default Image'
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
          ctaButtonText: 'Contact Sales'
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
            imageUrl: 'https://placeholder.com/400x300',
            imageAlt: 'Feature 1 illustration'
          },
          { 
            title: 'Main Feature 2', 
            description: 'Detailed description of feature 2',
            content: 'Extended content for feature 2',
            buttonText: 'Learn More',
            imageUrl: 'https://placeholder.com/400x300',
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
            imageUrl: 'https://placeholder.com/400x300',
            imageAlt: 'Benefit 1 illustration'
          },
          { 
            icon: '🚀',
            title: 'Benefit 2', 
            subTitle: 'Subtitle of benefit 2',
            content: 'Description of benefit 2',
            buttonText: 'Learn More',
            imageUrl: 'https://placeholder.com/400x300',
            imageAlt: 'Benefit 2 illustration'
          },
          { 
            icon: '🚀',
            title: 'Benefit 3', 
            subTitle: 'Subtitle of benefit 2',
            content: 'Description of benefit 3',
            buttonText: 'Learn More',
            imageUrl: 'https://placeholder.com/400x300',
            imageAlt: 'Benefit 3 illustration'
          },
          { 
            icon: '🚀',
            title: 'Benefit 4', 
            subTitle: 'Subtitle of benefit 4',
            content: 'Description of benefit 4',
            buttonText: 'Learn More',
            imageUrl: 'https://placeholder.com/400x300',
            imageAlt: 'Benefit 4 illustration'
          }
        ]
      },
  
      UserReviewsWithMovingCards: {
          title: 'See What Our Customers Say',
          bottomContent: [
            {
              name: "David Miller",
              position: "Innovation Director - FutureCorp",
              avatarUrl: "https://placeholder.com/800x600",
              avatarAlt: "David Miller's avatar",
              title: "Revolutionary Content Creation",
              content: "websitelm AI has completely transformed our approach to video marketing. The AI-driven content generation is not just fast - it's incredibly intelligent and adaptable."
            },
            {
              name: "Alexandra Peters",
              position: "Global Marketing Head - TechVision",
              avatarUrl: "https://placeholder.com/800x600",
              avatarAlt: "Sarah Chen's avatar",
              title: "Exceptional Marketing Results",
              content: "The versatility and speed of websitelm AI's video generation have given us a competitive edge. Our marketing campaigns are now more dynamic and engaging than ever."
            },
            {
              name: "Thomas Wright",
              position: "Digital Strategy Lead - MediaPro",
              avatarUrl: "https://placeholder.com/800x600",
              avatarAlt: "Sarah Chen's avatar",
              title: "Game-Changing Efficiency",
              content: "What used to take our team weeks now happens in minutes. The quality and consistency of the AI-generated videos have exceeded all our expectations."
            },
            {
              name: "Caroline Foster",
              position: "Brand Director - GlobalBrands",
              avatarUrl: "https://placeholder.com/800x600",
              avatarAlt: "Sarah Chen's avatar",
              title: "Perfect for Brand Building",
              content: "websitelm AI maintains our brand consistency across all markets while allowing for local customization. It's the perfect balance of efficiency and brand control."
            },
            {
              name: "Richard Martinez",
              position: "Operations Manager - ScaleUp Inc",
              avatarUrl: "https://placeholder.com/800x600",
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
          ctaButtonText: "Book a Demo"
        },
      },
  
      WhyChooseUsWithStory: {
        title: 'Why Choose Us With Story',
        description: 'Display founder story and detailed product/service introduction',
        leftContent: {
          avatarUrl: 'https://placeholder.com/800x600',
          avatarAlt: 'Michael Zhang',
          name: 'Michael Zhang',
          title: 'Founder & CEO',
          introduction: 'As a serial entrepreneur and AI technology expert, Michael has over 15 years of experience in the tech industry. Before founding our company, he held technical leadership positions at several renowned tech companies. He firmly believes that AI technology will revolutionize content creation and is dedicated to building the best AI creation tools to help more creators realize their ideas.'
        },
        rightContent: [
          {
            contentTitle: 'From Engineer to Entrepreneur',
            contentText: 'After graduating from MIT with a Computer Science degree in 2008, I immediately immersed myself in Natural Language Processing research. During my 8 years in Silicon Valley, I witnessed the rapid development of AI technology firsthand and participated in several groundbreaking projects. This experience gave me a deep understanding of AI\'s transformative potential.\n\nIn 2016, I made the decision to start my own venture. I saw tremendous opportunities in the emerging AI applications market. In our early days, we focused on providing AI solutions for enterprises, building a solid foundation of industry experience and technical expertise.'
          },
          {
            contentTitle: 'Discovering Real Market Needs',
            contentText: 'While serving our enterprise clients, we identified content creation as a universal pain point. Whether it was e-commerce platforms or media organizations, they all struggled with low content production efficiency and inconsistent quality. This realization led us to develop our first AI content generation tool.\n\nThe market response exceeded our expectations. Our early users reported significant improvements in their content creation workflow, with some achieving up to 300% increase in productivity. This validation encouraged us to further invest in AI content creation technology.'
          },
          {
            contentTitle: 'Building the Future of Content Creation',
            contentText: 'Today, our AI platform serves over 100,000 users worldwide, from individual creators to Fortune 500 companies. We\'ve expanded our capabilities beyond basic content generation to include advanced features like multilingual support, style customization, and SEO optimization.\n\nWhat sets us apart is our deep understanding of both AI technology and content creation needs. Our team includes not just AI researchers and engineers, but also experienced content creators and marketing professionals. This diverse expertise allows us to build tools that are not only technologically advanced but also practical and user-friendly.'
          },
          {
            contentTitle: 'Our Vision and Commitment',
            contentText: 'Looking ahead, we remain committed to pushing the boundaries of AI content creation. We\'re investing heavily in R&D to develop next-generation features like real-time collaboration tools and advanced personalization capabilities.\n\nWe believe that AI should augment human creativity, not replace it. Our goal is to empower creators with tools that handle the routine aspects of content creation, allowing them to focus on strategy and creativity. We\'re excited about the future and invite you to join us in shaping the future of content creation.'
          },
          {
            contentTitle: 'Join Our Growing Community',
            contentText: 'Our platform is more than just a tool - it\'s a community of forward-thinking creators and businesses. We regularly host webinars, workshops, and user meetups to share best practices and gather feedback.\n\nWe\'re proud of the impact we\'ve had so far, but we\'re even more excited about what\'s ahead. Whether you\'re a solo creator or part of a large organization, we\'re here to help you achieve your content creation goals more efficiently and effectively.'
          }
        ]
      },

      FeaturesTabbed: {
        title: 'Writing Features Kit',
        description: 'Our AI-driven features include content detection, plagiarism checking, and automatic citation, helping you submit works with transparency and originality.',
        
        bottomContent: [
          {
            tabName: 'Authentic authorship',
            title: 'Verify authentic authorship',
            description: 'Ensure academic integrity with our authentication tools',
            imageUrl: 'https://placeholder.com/800x600',
            imageAlt: 'Authentic authorship',
            buttonText: 'Get Started Now',
          },
          {
            tabName: 'Cite AI use',
            title: 'Make it easy to disclose your AI use',
            description: 'Our transparency features make it easy to acknowledge when you\'ve used AI',
            imageUrl: 'https://placeholder.com/800x600',
            imageAlt: 'Cite AI use',
            buttonText: 'Get Started Now',
          },
          {
            tabName: 'AI checker',
            title: 'AI checker',
            description: 'Our AI checker helps you detect AI-generated content',
            imageUrl: 'https://placeholder.com/800x600',
            imageAlt: 'AI checker',
            buttonText: 'Get Started Now',
          }
        ]
      },

      MeetOurTeam: {
        topContent: {
          subtitle: 'Our Team',
          title: 'Creating the Future with Industry Experts',
          description: 'Our team consists of professionals from diverse backgrounds, dedicated to providing the highest quality services and solutions for our clients.'
        },
        bottomContent: [
          {
            name: 'Michael Zhang',
            title: 'Chief Executive Officer',
            description: '15 years of experience in the tech industry, having held leadership positions at several renowned technology companies. Focused on AI innovation and business applications.',
            avatarUrl: 'https://placeholder.com/800x600',
            avatarAlt: 'Michael Zhang',
            socials: []
          },
          {
            name: 'Sarah Li',
            title: 'Product Director',
            description: '10 years of product management experience, specializing in user experience design and product strategy. Led teams in developing multiple successful enterprise products.',
            avatarUrl: 'https://placeholder.com/800x600',
            avatarAlt: 'Sarah Li',
            socials: []
          },
          {
            name: 'David Wang',
            title: 'Technical Director',
            description: 'Focused on AI and machine learning, with extensive experience in technical architecture design. Dedicated to transforming cutting-edge technology into practical solutions.',
            avatarUrl: 'https://placeholder.com/800x600',
            avatarAlt: 'David Wang',
            socials: []
          }
        ]
      },

      JobList: {
        topContent: {
          title: 'Join Our Team',
          description: 'Start Your Next Career Chapter With Us'
        },
        bottomContent: [
          {
            position: 'Senior Frontend Engineer',
            type: 'Full-time',
            location: 'San Francisco',
            salary: '$120k-160k',
            tags: ['React', 'Vue', 'TypeScript'],
            responsibilities: [
              'Lead frontend development of core products',
              'Optimize frontend architecture and performance',
              'Participate in technical design and review'
            ],
            requirements: [
              '5+ years of frontend development experience',
              'Expert in React or Vue framework',
              'Strong teamwork and communication skills'
            ]
          },
          {
            position: 'Product Manager',
            type: 'Full-time',
            location: 'New York',
            salary: '$100k-140k',
            tags: ['Product Design', 'User Research', 'Data Analysis'],
            responsibilities: [
              'Drive product strategy and feature design',
              'Conduct user research and requirement analysis',
              'Coordinate with development team to drive project progress'
            ],
            requirements: [
              '3+ years of product management experience',
              'Excellent communication and coordination skills',
              'Strong analytical and problem-solving abilities'
            ]
          },
          {
            position: 'AI Research Engineer',
            type: 'Full-time',
            location: 'Boston',
            salary: '$130k-180k',
            tags: ['Machine Learning', 'Python', 'Deep Learning'],
            responsibilities: [
              'Develop and implement AI algorithms',
              'Research and apply latest AI technologies',
              'Collaborate with cross-functional teams'
            ],
            requirements: [
              'MS/PhD in Computer Science or related field',
              'Strong background in machine learning',
              'Experience with deep learning frameworks'
            ]
          }
        ]
      },

      CallToActionWithEmailInput: {
        title: 'Unlock Explosive Traffic with AI-Generated Landing Pages & Blog Posts.',
        buttonText: "Get Started Now",
        bottomContent: {
          inputPlaceholder: "Enter your email",
        }
      },

      KeyResultsWithTextBlock: {
        leftContent: [
          {
            percentage: 90,
            description: 'Reduction in video production time compared to traditional methods',
            display: true
          },
          {
            percentage: 40,
            description: 'Languages supported for automatic localization and voiceover generation',
            display: true
          },
          {
            percentage: 70,
            description: 'Average cost savings for businesses switching to AI-powered video creation',
            display: true
          }
        ],
        rightContent: [
          {
              contentTitle: 'The Power of AI in Video Production',
              contentText: 'AI technology has revolutionized the way we create and distribute video content. With advanced algorithms and machine learning capabilities, what once took days or weeks can now be accomplished in minutes. Our cutting-edge AI system analyzes your content requirements, automatically selects appropriate visuals, generates professional transitions, and ensures perfect timing for each scene. This breakthrough technology not only saves time but also maintains consistent quality across all your video productions.'
          },
          {
              contentTitle: 'Multilingual Support',
              contentText: 'Our platform supports over 40 languages, making it easy to reach global audiences. The AI automatically generates appropriate translations and voiceovers while maintaining the original message and tone. Each translation is carefully optimized for cultural nuances and local preferences, ensuring your message resonates with viewers worldwide. The system also automatically adjusts visual elements and timing to accommodate different language lengths and reading speeds, delivering a truly localized experience.'
          },
          {
              contentTitle: 'Cost-Effective Solution for Modern Marketing',
              contentText: 'Traditional video production often requires extensive resources, including professional videographers, editors, and voice talent. Our AI-powered platform eliminates these requirements, providing a comprehensive solution that delivers professional results at a fraction of the cost. By automating the entire video creation process, businesses can produce more content more frequently, enabling them to maintain an active presence across all marketing channels.'
          },
          {
              contentTitle: 'Advanced Customization Options',
              contentText: 'Our platform offers extensive customization capabilities to ensure your videos perfectly align with your brand identity. From color schemes and typography to transition styles and audio preferences, every aspect can be tailored to your specific needs. The AI learns from your preferences over time, making future video creation even more efficient while maintaining brand consistency across all your content.'
          },
          {
              contentTitle: 'Data-Driven Performance Optimization',
              contentText: 'Leverage the power of analytics to optimize your video content. Our AI system tracks viewer engagement, retention rates, and conversion metrics to provide actionable insights. These data-driven recommendations help you understand what works best for your audience, allowing you to continuously improve your video marketing strategy and maximize ROI across different platforms and markets.'
          },
          {
              contentTitle: 'Enterprise-Grade Security and Scalability',
              contentText: 'Built with enterprise needs in mind, our platform offers robust security features and unlimited scalability. All content is processed and stored with bank-level encryption, ensuring your sensitive data remains protected. The cloud-based infrastructure automatically scales to handle any volume of video generation, making it suitable for businesses of all sizes, from startups to global enterprises.'
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