<template>
  <modal v-model:open="open">
    <div class="sm:w-80 sm:mx-auto">
      <h1 class="phg-illusion-class">Log In</h1>

      <form @submit.prevent="submitCredentials" class="flex flex-col">
        <text-input
          class="mb-2"
          placeholder="Email"
          v-model="email"></text-input>
        <text-input
          class="mb-4"
          type="password"
          placeholder="Password"
          v-model="password"></text-input>
        <button class="btn btn-blue px-4 py-1">Log in</button>
      </form>
    </div>
  </modal>
</template>

<script>
import { useToast } from 'vue-toastification'
import Modal from './shared/Modal.vue'
import TextInput from './shared/TextInput.vue'

export default {
  name: 'LogInModal',
  setup () {
    // Expose toasts for use in other portions of this component
    const toast = useToast()
    return { toast }
  },
  props: {
    open: Boolean,
  },
  emits: ['update:open'],
  data: () => ({
    email: '',
    password: '',
  }),
  components: {
    Modal,
    TextInput,
  },
  methods: {
    closeModal () {
      this.$emit('update:open', false)
    },
    submitCredentials () {
      console.log('submitting?')
      this.$store.dispatch(
        'player/logIn',
        {
          email: this.email,
          password: this.password
        }
      ).catch(error => {
        this.toast.error(error)
      }).then(() => {
        this.toast.success('You are now logged in!')
        this.closeModal()
      })
    },
  },
}
</script>
