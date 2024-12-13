<script>
export default {
  name: 'BaseSection',
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
    emitUpdate(updatedSection) {
      this.$emit('update', updatedSection);
    }
  }
}
</script> 