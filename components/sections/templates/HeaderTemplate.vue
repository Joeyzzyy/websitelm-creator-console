<template>
  <div class="grid grid-cols-1 gap-4">
    <HeaderEditor @update="updateHeader" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderEditor from '../../editor/HeaderEditor.vue'

const headerData = ref(null)

const updateHeader = (data) => {
  headerData.value = data
}
</script>