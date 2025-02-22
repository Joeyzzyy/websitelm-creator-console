<template>
  <div class="header-preview" :style="computedStyles">
    <div class="logo">
      <img 
        v-if="data.logo.src" 
        :src="data.logo.src" 
        :alt="data.logo.alt"
        :style="{
          width: data.logo.width ? `${data.logo.width}px` : 'auto',
          height: data.logo.height ? `${data.logo.height}px` : 'auto'
        }"
      />
    </div>

    <div class="menu">
      <template v-for="item in data.mainMenuItems" :key="item.key">
        <a-dropdown 
          v-if="item.children && item.children.length"
          :trigger="['hover']"
          placement="bottom"
        >
          <a 
            class="menu-item" 
            :href="item.link"
            :target="item.isExternal ? '_blank' : '_self'"
            :rel="item.isExternal ? 'noopener noreferrer' : ''"
            :style="{ 
              fontWeight: item.fontWeight,
              color: item.color || '#4b5563'
            }"
          >
            {{ item.label }}
            <down-outlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item 
                v-for="subItem in item.children"
                :key="subItem.key"
              >
                <a :href="subItem.href" target="_blank" rel="noopener noreferrer">{{ subItem.label }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a 
          v-else
          class="menu-item"
          :href="item.link"
          :target="item.isExternal ? '_blank' : '_self'"
          :rel="item.isExternal ? 'noopener noreferrer' : ''"
          :style="{ 
            fontWeight: item.fontWeight,
            color: item.color || '#4b5563'
          }"
        >
          {{ item.label }}
        </a>
      </template>
    </div>

    <div class="actions">
      <a-button
        v-for="item in data.actionItems"
        :key="item.key"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        class="custom-button"
        :style="{
          '--button-bg': item.backgroundColor || '#1890ff',
          '--button-color': item.textColor || '#ffffff',
          '--button-border': item.backgroundColor || '#1890ff'
        }"
      >
        {{ item.label }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  styles: {
    type: Object,
    required: true
  }
})

// 计算背景样式
const computedStyles = computed(() => {
  const styles = {
    background: props.styles.backgroundType === 'solid' 
      ? props.styles.backgroundColor || '#FFFFFF'
      : `linear-gradient(${props.styles.gradientAngle || 0}deg, ${props.styles.gradientStart || '#1890FF'}, ${props.styles.gradientEnd || '#3B82F6'})`,
    transition: 'all 0.3s ease'
  }
  
  console.log('Computed header styles:', styles)
  return styles
})
</script>

<style scoped>
.header-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo img {
  display: block;
  object-fit: contain;
}

.menu {
  display: flex;
  gap: 2rem;
}

.menu-item {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.menu-item:hover {
  color: #1890ff;
  text-decoration: none;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

:deep(.ant-dropdown-menu) {
  min-width: 160px;
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 16px;
}

:deep(.ant-dropdown-menu-item a) {
  color: #4b5563;
  text-decoration: none;
}

:deep(.ant-dropdown-menu-item:hover a) {
  color: #1890ff;
}

:deep(.anticon) {
  font-size: 12px;
}

:deep(.ant-btn) {
  margin-left: 8px;
}

:deep(.ant-btn-dashed) {
  border-style: dashed;
}

:deep(.ant-btn-text) {
  padding: 4px 15px;
}

:deep(.ant-btn-link) {
  padding: 4px 15px;
  color: #1890ff;
}

:deep(.custom-button.ant-btn) {
  background-color: var(--button-bg) !important;
  color: var(--button-color) !important;
  border-color: var(--button-border) !important;
}

:deep(.custom-button.ant-btn:hover) {
  opacity: 0.9;
}
</style>
