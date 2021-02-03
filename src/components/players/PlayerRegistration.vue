<template>
  <h1 class="phg-illusion-class">Finalize your account</h1>

  <p class="text-lg">Welcome to Ashes.live!</p>

	<p><strong>Username</strong> can be anything (though please keep it kid-friendly!), and you will be identified around Ashes.live by a combination of your username and an auto-generated badge; e.g. <player-badge :user="{username: 'IsaacBot', badge: '3000'}"></player-badge></p>

  <div class="sm:w-80">
    <form @submit.prevent="submitRegistration" class="flex flex-col">
      <text-input
        class="mb-4"
        placeholder="Username"
        label="Username"
        v-model="username"
        ref="usernameInput"></text-input>
      <!-- TODO: LEFT OFF implementing form controls, then need to hook up API call on submit -->
      <button class="btn btn-blue px-4 py-1 mb-4" :disabled="!isValid">Join Ashes.live!</button>
    </form>
  </div>
</template>

<script>
import PlayerBadge from '../shared/PlayerBadge.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'PlayerRegistration',
  props: ['token'],
  components: {
    PlayerBadge,
    TextInput,
  },
  data: () => ({
    username: ''
  }),
  mounted () {
    this.$refs.usernameInput && this.$refs.usernameInput.focus()
  },
  computed: {
    isValid () {
      return !!this.username
    },
  },
  methods: {
    submitRegistration () {
      // TODO
    },
  },
}
</script>
