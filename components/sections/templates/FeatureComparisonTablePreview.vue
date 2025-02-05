<template>
  <div class="comparison-table-container">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold mb-3">{{ section.title }}</h2>
      <p class="text-gray-600 text-sm">{{ section.subTitle }}</p>
    </div>

    <div class="comparison-table">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-left py-4 px-6 bg-gray-50 w-1/3">Features</th>
            <th 
              v-for="(column, index) in section.bottomContent.columns" 
              :key="index"
              class="py-4 px-6 bg-gray-50"
            >
              <div class="text-base font-semibold mb-1">{{ column.title }}</div>
              <div class="text-xs text-gray-500">{{ column.subtitle }}</div>
              <div 
                v-if="column.recommended" 
                class="inline-block mt-1 text-[10px] text-[#4B89FF] bg-blue-50 px-2 py-0.5 rounded-full"
              >
                Recommended
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(group, groupIndex) in section.bottomContent.featureGroups" :key="groupIndex">
            <!-- Category Header -->
            <tr>
              <td 
                colspan="100%" 
                class="text-left py-4 px-6 bg-[#F8FAFC] font-semibold text-gray-900 text-sm border-t border-b border-gray-100"
              >
                {{ group.name }}
              </td>
            </tr>
            <!-- Features -->
            <tr 
              v-for="(feature, featureIndex) in group.features" 
              :key="featureIndex"
              class="border-b border-gray-100 feature-row"
            >
              <td class="text-left py-3 px-6 text-gray-600 text-xs">
                {{ feature.name }}
              </td>
              <td 
                v-for="(value, valueIndex) in feature.values" 
                :key="valueIndex"
                class="py-3 px-6"
                :class="{ 'bg-blue-50/10': section.bottomContent.columns[valueIndex].recommended }"
              >
                <feature-availability :value="value" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent, h } from 'vue'

// Feature availability component
const FeatureAvailability = defineComponent({
  props: {
    value: {
      type: [Boolean, String, Number],
      required: true
    }
  },
  setup(props) {
    const renderValue = () => {
      if (typeof props.value === 'boolean') {
        return props.value ? 
          h('div', { 
            class: 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50' 
          }, [
            h('i', { class: 'fas fa-check text-[#4B89FF]' })
          ]) :
          h('div', { 
            class: 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50' 
          }, [
            h('i', { class: 'fas fa-minus text-gray-300' })
          ])
      }
      return h('span', { 
        class: 'text-sm font-medium text-gray-900' 
      }, props.value)
    }

    return () => h('div', { class: 'flex justify-center' }, [renderValue()])
  }
})

export default {
  name: 'FeatureComparisonTablePreview',
  components: {
    FeatureAvailability
  },
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.comparison-table {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg;
  transition: all 0.3s ease;
}

.comparison-table th {
  @apply font-semibold text-gray-900;
}

.comparison-table td {
  @apply text-sm;
}

.feature-row {
  @apply transition-colors duration-200;
}

.feature-row:hover {
  @apply bg-gray-50;
}
</style> 