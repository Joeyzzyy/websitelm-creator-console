<template>
  <div class="grid grid-cols-1 gap-4">
    <FooterEditor @update="updateFooter" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FooterEditor from '../../editor/FooterEditor.vue'

const footerData = ref(null)

const updateFooter = (data) => {
  footerData.value = data
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>