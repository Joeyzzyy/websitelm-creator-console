<template>
  <div>
    <FooterEditor 
      :initial-data="footerData"
      :layoutId="layoutId"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FooterEditor from '../../editor/FooterEditor.vue'

const props = defineProps({
  initialData: {
    type: Object,
    required: true
  },
  layoutId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update'])

// 创建本地响应式数据的深拷贝
const footerData = ref(JSON.parse(JSON.stringify(props.initialData)))

// 处理来自编辑器的更新
const handleUpdate = (newData) => {
  // 添加对比检查，避免不必要的更新
  if (JSON.stringify(footerData.value) !== JSON.stringify(newData)) {
    footerData.value = newData
    emit('update', newData)
  }
}

// 监听 props 变化并更新本地数据
watch(() => props.initialData, (newValue) => {
  if (newValue && JSON.stringify(footerData.value) !== JSON.stringify(newValue)) {
    footerData.value = JSON.parse(JSON.stringify(newValue))
  }
}, { deep: true })
</script>