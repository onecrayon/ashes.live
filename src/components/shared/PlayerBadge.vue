<template>
  <router-link :to="profileURL">
    <span>{{ user.username }}</span><span class="text-gray">#{{ user.badge }}</span>
  </router-link>
</template>

<script>
export default {
  name: 'PlayerBadge',
  props: {
    user: {
      username: '',
      badge: '',
    },
  },
  computed: {
    profileURL () {
      return `/players/${this.user.badge}/`
    },
  },
}
</script>
