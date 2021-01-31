<template>
  <modal v-bind:open="open" v-on:update:open="closeModal()">
    <div class="sm:w-80 sm:mx-auto">
      <h1 class="phg-illusion-class">Log In</h1>

      <form @submit.prevent="submitCredentials" class="flex flex-col">
        <text-input
          class="mb-2"
          placeholder="Email"
          v-model="email"
          ref="emailInput"
          @escape="closeModal()"></text-input>
        <text-input
          class="mb-4"
          type="password"
          placeholder="Password"
          v-model="password"
          @escape="closeModal()"></text-input>
        <div class="mb-4">
          <label><input type="checkbox" v-model="rememberMe"> Remember me <span class="text-gray">(1 year)</span></label>
        </div>
        <button class="btn btn-blue px-4 py-1" :disabled="!isValid">Log in</button>
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
    rememberMe: false,
  }),
  components: {
    Modal,
    TextInput,
  },
  watch: {
    open (newValue) {
      if (newValue) {
        this.$nextTick(() => this.$refs.emailInput.focus())
      }
    },
  },
  computed: {
    isValid () {
      return !!this.email && !!this.password
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:open', false)
      this.$nextTick(() => {
        this.email = ''
        this.password = ''
        this.rememberMe = false
      })
    },
    submitCredentials () {
      this.$store.dispatch(
        'player/logIn',
        {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe,
        }
      ).then(() => {
        this.toast.success('You are now logged in!')
        this.closeModal()
      }).catch(error => {
        this.toast.error(error)
      })
    },
  },
}
</script>
