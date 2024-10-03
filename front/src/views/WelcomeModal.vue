<template>
  <b-modal v-model="modalVisible" title="Welcome" hide-footer>
    <p :class="messageClass">Welcome, {{ userName }}!</p>
  </b-modal>
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      modalVisible: this.showModal
    };
  },
  watch: {
    showModal(value) {
      this.modalVisible = value;
      if (value) {
        setTimeout(() => {
          this.modalVisible = false;
          this.$emit('closed');
        }, this.duration);
      }
    }
  }
};
</script>

<style scoped>
.messageClass {
  color: #28a745; 
}
</style>
