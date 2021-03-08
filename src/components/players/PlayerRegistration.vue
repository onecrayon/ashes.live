<template>
  <h1 class="phg-illusion-class">Finalize your account</h1>

  <div class="sm:flex">
    <div class="sm:order-2 sm:pl-8 sm:w-1/3">
      <p class="text-lg">Welcome to Ashes.live!</p>

      <p><strong>Username</strong> can be anything (though please keep it kid-friendly!), and you will be identified around Ashes.live by a combination of your username and an auto-generated badge; e.g. <player-badge :user="{username: 'IsaacBot', badge: '3000'}" no-link></player-badge>.</p>
    </div>
    <div class="sm:w-2/3 sm:order-1">
      <form @submit.prevent="submitRegistration" class="flex flex-col">
        <text-input
          class="mb-4 sm:w-80"
          placeholder="Username"
          label="Username"
          v-model="username"
          ref="usernameInput"></text-input>
        <text-input
          type="password"
          class="mb-2 sm:w-80"
          placeholder="Password"
          label="Password"
          v-model="password"></text-input>
        <text-input
          type="password"
          class="mb-4 sm:w-80"
          placeholder="Confirm password"
          label="Confirm password"
          v-model="confirmPassword"
          :is-invalid="!!password && !!confirmPassword && password !== confirmPassword"></text-input>
        <text-editor
          class="mb-4"
          placeholder="Player profile..."
          label="Description"
          v-model="description"></text-editor>
        <div class="mb-4">
          <label><input type="checkbox" v-model="newsletterOptIn"> Notify me of new site features</label>
        </div>
        <button class="btn btn-blue px-4 py-1 mb-4 sm:w-80" :disabled="!isValid">Join Ashes.live!</button>
      </form>
    </div>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import PlayerBadge from '../shared/PlayerBadge.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'PlayerRegistration',
  props: ['token'],
  components: {
    PlayerBadge,
    TextEditor,
    TextInput,
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    username: '',
    password: '',
    confirmPassword: '',
    description: '',
    newsletterOptIn: false,
  }),
  mounted () {
    this.$refs.usernameInput && this.$refs.usernameInput.focus()
  },
  computed: {
    isValid () {
      return (
        !!this.username
        && !!this.password
        && !!this.confirmPassword
        && this.password === this.confirmPassword
      )
    },
  },
  methods: {
    submitRegistration () {
      const data = {
        token: this.token,
        username: this.username,
        password: this.password,
        password_confirm: this.confirmPassword,
        newsletter_opt_in: this.newsletterOptIn,
      }
      if (this.description) {
        data.description = this.description
      }
      this.$store.dispatch('player/register', data).then(() => {
        this.toast.success(`Welcome to Ashes.live, ${this.username}!`)
        this.$router.push('/decks/mine/')
      }).catch(this.handleResponseError)
    },
  },
}
</script>
