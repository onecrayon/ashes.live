<template>
  <log-in-form @auth:success="redirectToDestination()">
    <p class="mb-4">This page requires an account; please log in to continue...</p>
  </log-in-form>
</template>

<script>
import LogInForm from './shared/LogInForm.vue'

export default {
  name: 'LogIn',
  components: {
    LogInForm,
  },
  methods: {
    redirectToDestination () {
      if (this.$route.redirectedFrom) this.$router.replace(this.$route.redirectedFrom)
      else this.$router.replace('/')
    },
  },
}
</script>
