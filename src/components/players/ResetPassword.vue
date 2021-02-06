<template>
  <h1 class="phg-charm-power">Reset your password</h1>

  <p>Enter your new password below to reset your password and log into the site.</p>

  <div class="sm:w-80">
    <form @submit.prevent="submitPassword" class="flex flex-col">
      <text-input
        class="mb-2"
        placeholder="Password"
        type="password"
        v-model="password"></text-input>
      <text-input
        class="mb-4"
        placeholder="Confirm password"
        type="password"
        v-model="confirmPassword"
        :is-invalid="!!password && !!confirmPassword && password !== confirmPassword"></text-input>
      <button class="btn btn-blue px-4 py-1 mb-4" :disabled="!isValid">Reset password</button>
    </form>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composites/useHandleResponseError.js'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'ResetPassword',
  props: ['token'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    password: '',
    confirmPassword: '',
  }),
  components: {
    TextInput,
  },
  computed: {
    isValid () {
      return this.password && this.confirmPassword && this.password === this.confirmPassword
    },
  },
  methods: {
    submitPassword () {
      this.$store.dispatch('player/resetPassword', {
        token: this.token,
        password: this.password,
        password_confirm: this.confirmPassword,
      }).then(() => {
        this.toast.success('You have successfully changed your password and logged in!')
        this.$router.push('/')
      }).catch(this.handleResponseError)
    },
  },
}
</script>
