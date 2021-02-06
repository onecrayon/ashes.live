<template>
  <h1 class="phg-natural-class">Create your account</h1>

  <p class="text-lg">Enter your email to start creating your account!</p>

  <div class="sm:w-80">
    <form @submit.prevent="submitInvite" class="flex flex-col">
      <text-input
        class="mb-4"
        placeholder="Email"
        v-model="email"
        ref="emailInput"></text-input>
      <button class="btn btn-blue px-4 py-1 mb-4" :disabled="!isValid">Create account</button>
    </form>
    <div class="text-right">
      <router-link to="/players/reset/">Forgot your password?</router-link>
    </div>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composites/useHandleResponseError.js'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'NewPlayer',
  components: {
    TextInput,
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    email: '',
  }),
  mounted () {
    this.$refs.emailInput && this.$refs.emailInput.focus()
  },
  computed: {
    isValid () {
      return !!this.email
    },
    submitInvite () {
      this.$store.dispatch('player/invite', { email: this.email }).then(() => {
        this.toast.success('Your account invitation has been sent! Please follow the instructions in your email to finalize your account.')
      }).catch(this.handleResponseError)
    },
  },
}
</script>
