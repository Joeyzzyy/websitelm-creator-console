<template>
  <div class="header-preview">
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
          <a class="menu-item" @click.prevent>
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
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          class="menu-item"
        >
          {{ item.label }}
        </a>
      </template>
    </div>

    <div class="actions">
      <a-button
        v-for="item in data.actionItems"
        :key="item.key"
        :type="item.buttonType"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ item.label }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { DownOutlined } from '@ant-design/icons-vue'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.header-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 8px;
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
}

.menu-item:hover {
  color: #1890ff;
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
</style>
