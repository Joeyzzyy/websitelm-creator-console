<!-- Section组件注册中心 -->
<template>
  <component 
    :is="getSectionComponent(section.componentName)"
    :section="section"
    :disabled="disabled"
    @update="handleUpdate"
  />
</template>

<script>
import CallToAction from './templates/CallToAction.vue'
import Faqs from './templates/Faqs.vue'
import HowItWorksWithThreeBlocks from './templates/HowItWorksWithBlocks.vue'
import ProductBenefitsWithBlocks from './templates/ProductBenefitsWithBlocks.vue'
import HowItWorksWithWorkflow from './templates/HowItWorksWithWorkflow.vue'
import WhyChooseUsWithSmallBlocks from './templates/WhyChooseUsWithSmallBlocks.vue'
import WhyChooseUsWithBlocks from './templates/WhyChooseUsWithBlocks.vue'
import HeroSectionWithVideo from './templates/HeroSectionWithVideo.vue'
import KeyResultsWithThreeCards from './templates/KeyResultsWithCards.vue'
import KeyResultsWithTextBlock from './templates/KeyResultsWithTextBlock.vue'
import KeyResultsWithImage from './templates/KeyResultsWithImage.vue' 
import TitleSection from './templates/TitleSection.vue'
import TitleSectionWithImage from './templates/TitleSectionWithImage.vue'
import ProductBenefitsWithTable from './templates/ProductBenefitsWithTable.vue'
import PageListCard from './templates/PageListCard.vue'
import SubscriptionCard from './templates/SubscriptionCard.vue'
import FeatureComparisonTable from './templates/FeatureComparisonTable.vue'
import ProductComparison from './templates/ProductComparison.vue'

// 组件映射表
const SECTION_COMPONENTS = {
  CallToAction: CallToAction,
  Faqs: Faqs,
  HowItWorksWithThreeBlocks: HowItWorksWithThreeBlocks,
  ProductBenefitsWithFourBlocks: ProductBenefitsWithBlocks,
  HowItWorksWithWorkflow: HowItWorksWithWorkflow,
  WhyChooseUsWithSixSmallBlocks: WhyChooseUsWithSmallBlocks,
  WhyChooseUsWithTwoHugeBlocks: WhyChooseUsWithBlocks,
  HeroSectionWithVideo: HeroSectionWithVideo,
  KeyResultsWithThreeCards: KeyResultsWithThreeCards,
  KeyResultsWithTextBlock: KeyResultsWithTextBlock,
  KeyResultsWithImage: KeyResultsWithImage,
  TitleSection: TitleSection,
  TitleSectionWithImage: TitleSectionWithImage,
  ProductBenefitsWithTable: ProductBenefitsWithTable,
  PageListCard: PageListCard,
  SubscriptionCard: SubscriptionCard,
  FeatureComparisonTable: FeatureComparisonTable,
  ProductComparison: ProductComparison
}

export default {
  name: 'SectionWrapper',
  props: {
    section: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getSectionComponent(componentName) {
      return SECTION_COMPONENTS[componentName]
    },
    handleUpdate(updatedSection) {
      try {
        const newSection = {
          ...updatedSection,
          sectionId: this.section.sectionId,
          pageId: this.section.pageId,
          position: this.section.position
        };
        
        this.$emit('update', newSection);
      } catch (error) {
        console.error('Error in handleUpdate:', error);
      }
    }
  },
  
  watch: {
    section: {
      handler(newVal, oldVal) {
      },
      deep: true
    }
  }
}
</script>
