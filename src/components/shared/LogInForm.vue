<template>
  <div :class="centerForm ? 'sm:w-80 sm:mx-auto': ''">
    <h1 class="phg-illusion-class">Log In</h1>

    <slot></slot>
  </div>

  <div class="sm:w-80" :class="centerForm ? 'sm:mx-auto' : ''">
    <form @submit.prevent="submitCredentials" class="flex flex-col">
      <text-input
        class="mb-2"
        placeholder="Email"
        v-model="email"
        ref="emailInput"
        @escape="$emit('escape')"></text-input>
      <text-input
        class="mb-4"
        type="password"
        placeholder="Password"
        v-model="password"
        @escape="$emit('escape')"></text-input>
      <div class="mb-4">
        <label><input type="checkbox" v-model="rememberMe"> Remember me <span class="text-gray">(1 year)</span></label>
      </div>
      <button class="btn btn-blue px-4 py-1 mb-4" :disabled="!isValid">Log in</button>
    </form>
    <div v-if="$route.name !== 'RequestReset' && $route.name !== 'ResetPassword'" class="text-right">
      <router-link to="/players/reset/">Forgot your password?</router-link>
    </div>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import TextInput from './TextInput.vue'

export default {
  name: 'LogInForm',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  props: {
    centerForm: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['escape', 'auth:success'],
  components: {
    TextInput,
  },
  data: () => ({
    email: '',
    password: '',
    rememberMe: false,
  }),
  mounted () {
    if (this.$refs.emailInput) {
      this.focus()
    }
  },
  computed: {
    isValid () {
      return !!this.email && !!this.password
    }
  },
  methods: {
    focus() {
      this.$refs.emailInput.focus()
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
        this.$emit('auth:success')
      }).catch(this.handleResponseError)
    },
  },
}
</script>
