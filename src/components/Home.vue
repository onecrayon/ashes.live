<template>
  <h1 class="phg-time-class">Work in progress</h1>

  <p>Thank you for your interest in the next generation Ashes.live site! I am currently hard at work building out an even better experience for Ashes Reborn.</p>

  <p>If you are interested in contributing, please <a href="https://github.com/onecrayon/ashes.live">visit the GitHub repo</a>.</p>

  <p>API docs for this server are located at: <a :href="apiURL" target="_blank">{{ apiURL }}</a></p>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    apiURL () {
      return import.meta.env.VITE_API_URL
    },
  },
}
</script>