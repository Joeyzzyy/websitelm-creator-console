<template>
  <div class="textarea-with-breaks">
    <div class="textarea-controls">
      <a-textarea
        :value="modelValue"
        :rows="rows"
        :disabled="disabled"
        :style="textareaStyle"
        @input="handleInput"
        ref="textarea"
      />
      <div class="break-controls">
        <a-tooltip title="添加换行">
          <a-button-group>
            <a-button size="small" @click="addBreaks(1)">
              <template #icon><enter-outlined /></template>
            </a-button>
            <a-button size="small" @click="addBreaks(2)">
              <template #icon><column-height-outlined /></template>
            </a-button>
          </a-button-group>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { EnterOutlined, ColumnHeightOutlined } from '@ant-design/icons-vue'

export default {
  name: 'TextareaWithLineBreak',
  components: {
    EnterOutlined,
    ColumnHeightOutlined
  },
  props: {
    modelValue: String,
    rows: {
      type: Number,
      default: 4
    },
    disabled: Boolean,
    textareaStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    handleInput(e) {
      this.$emit('update:modelValue', e.target.value)
    },
    addBreaks(count) {
      const textarea = this.$refs.textarea?.$el?.querySelector('textarea')
      if (!textarea) {
        console.warn('Textarea element not found')
        return
      }
      
      const { selectionStart, selectionEnd } = textarea
      const breaks = '\n'.repeat(count)
      
      const newValue = 
        this.modelValue.substring(0, selectionStart) +
        breaks +
        this.modelValue.substring(selectionEnd)
      
      this.$emit('update:modelValue', newValue)
      
      // 保持光标位置在插入的换行符之后
      this.$nextTick(() => {
        const newPosition = selectionStart + count
        textarea.setSelectionRange(newPosition, newPosition)
        textarea.focus()
      })
    }
  }
}
</script>

<style scoped>
.textarea-with-breaks {
  width: 100%;
}

.textarea-controls {
  position: relative;
}

.break-controls {
  position: absolute;
  right: 8px;
  bottom: 8px;
}

.break-controls :deep(.ant-btn) {
  padding: 0 4px;
}
</style> 