<template>
  <modal :open="open" @update:open="!$event && closeModal()">
    <log-in-form @escape="closeModal()" @auth:success="closeModal(true)" center-form ref="loginForm">
      <slot></slot>
    </log-in-form>
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
  emits: ['update:open', 'login:success', 'login:canceled'],
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
    closeModal (succeeded) {
      if (succeeded) this.$emit('login:success')
      else this.$emit('login:canceled')
      this.$emit('update:open', false)
      this.$nextTick(() => {
        this.email = ''
        this.password = ''
        this.rememberMe = false
      })
    },
  },
}
</script>
