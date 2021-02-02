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
      <button class="btn btn-blue px-4 py-1 mb-4" :disabled="!isValid">Create Account</button>
    </form>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import TextInput from '../shared/TextInput.vue'
import ValidityErrors from '../shared/ValidityErrors.vue'

export default {
  name: 'NewPlayer',
  components: {
    TextInput,
  },
  setup () {
    // Expose toasts for use in other portions of this component
    const toast = useToast()
    return { toast }
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
      }).catch(error => {
        if (typeof error === 'string') {
          this.toast.error(error)
          return
        }
        // Handle validation failure objects
        this.toast.error({
          component: ValidityErrors,
          props: {
            errors: error
          }
        })
      })
    },
  },
}
</script>
