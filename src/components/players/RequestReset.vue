<template>
  <h1 class="phg-charm-power">Forgot your password?</h1>

  <p>Enter the email you signed up with in order to reset your password.</p>

  <div class="sm:w-80">
    <form @submit.prevent="submitEmail" class="flex flex-col">
      <text-input
        class="mb-4"
        placeholder="Email"
        v-model="email"
        ref="emailInput"></text-input>
      <button class="btn btn-blue px-4 py-1 mb-4" :disabled="!isValid">Request password reset</button>
    </form>
  </div>
</template>

<script>
import { request } from '/src/utils.js'
import useHandleResponseError from '/src/composites/useHandleResponseError.js'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'RequestReset',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    TextInput,
  },
  data: () => ({
    email: '',
  }),
  mounted () {
    if (this.$refs.emailInput) {
      this.focus()
    }
  },
  computed: {
    isValid () {
      return !!this.email
    }
  },
  methods: {
    focus () {
      this.$refs.emailInput.focus()
    },
    submitEmail () {
      request('/v2/reset', {
        method: 'post',
        data: { email: this.email },
      }).then(() => {
        this.toast.success('Your password request has been sent! Please check your email.')
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          this.toast.warning('This email has not been registered yet! Please sign up to continue.')
          this.$router.push('/players/new/')
          return
        }
        this.handleResponseError(error)
      })
    },
  },
}
</script>
