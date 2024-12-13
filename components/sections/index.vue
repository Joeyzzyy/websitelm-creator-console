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
import HowItWorksWithThreeBlocks from './templates/HowItWorksWithThreeBlocks.vue'
import ProductBenefitsWithFourBlocks from './templates/ProductBenefitsWithFourBlocks.vue'
import HowItWorksWithWorkflow from './templates/HowItWorksWithWorkflow.vue'
import WhyChooseUsWithSixSmallBlocks from './templates/WhyChooseUsWithSixSmallBlocks.vue'
import WhyChooseUsWithTwoHugeBlocks from './templates/WhyChooseUsWithTwoHugeBlocks.vue'
import MoreInsightsWithFourCards from './templates/MoreInsightsWithFourCards.vue'
import ProductComparisonTable from './templates/ProductComparisonTable.vue'
import HeroSectionWithVideo from './templates/HeroSectionWithVideo.vue'
import KeyResultsWithThreeCards from './templates/KeyResultsWithThreeCards.vue'
import KeyResultsWithTextBlock from './templates/KeyResultsWithTextBlock.vue'
import KeyResultsWithImage from './templates/KeyResultsWithImage.vue' 
import TitleSection from './templates/TitleSection.vue'
import TitleSectionWithImage from './templates/TitleSectionWithImage.vue'
import ProductBenefitsWithTable from './templates/ProductBenefitsWithTable.vue'

// 组件映射表
const SECTION_COMPONENTS = {
  CallToAction: CallToAction,
  Faqs: Faqs,
  HowItWorksWithThreeBlocks: HowItWorksWithThreeBlocks,
  ProductBenefitsWithFourBlocks: ProductBenefitsWithFourBlocks,
  HowItWorksWithWorkflow: HowItWorksWithWorkflow,
  WhyChooseUsWithSixSmallBlocks: WhyChooseUsWithSixSmallBlocks,
  WhyChooseUsWithTwoHugeBlocks: WhyChooseUsWithTwoHugeBlocks,
  MoreInsightsWithFourCards: MoreInsightsWithFourCards,
  ProductComparisonTable: ProductComparisonTable,
  HeroSectionWithVideo: HeroSectionWithVideo,
  KeyResultsWithThreeCards: KeyResultsWithThreeCards,
  KeyResultsWithTextBlock: KeyResultsWithTextBlock,
  KeyResultsWithImage: KeyResultsWithImage,
  TitleSection: TitleSection,
  TitleSectionWithImage: TitleSectionWithImage,
  ProductBenefitsWithTable: ProductBenefitsWithTable
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
