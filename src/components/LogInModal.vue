<template>
  <modal :open="open" @update:open="!$event && closeModal()">
    <log-in-form @escape="closeModal()" @auth:success="closeModal()" center-form ref="loginForm"></log-in-form>
  </modal>
</template>

<script>
import LogInForm from './shared/LogInForm.vue'
import Modal from './shared/Modal.vue'

export default {
  name: 'LogInModal',
  props: {
    open: Boolean,
  },
  emits: ['update:open'],
  components: {
    LogInForm,
    Modal,
  },
  watch: {
    open (newValue) {
      if (newValue) {
        this.$nextTick(() => this.$refs.loginForm.focus())
      }
    },
  },
  methods: {
    closeModal (value) {
      this.$emit('update:open', value || false)
      this.$nextTick(() => {
        this.email = ''
        this.password = ''
        this.rememberMe = false
      })
    },
  },
}
</script>
