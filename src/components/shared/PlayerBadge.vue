<template>
  <span v-if="noLink">
    {{ user.username }}<span class="text-gray">#{{ user.badge }}</span>
  </span>
  <router-link v-else :to="profileURL">
    {{ user.username }}<span class="text-gray">#{{ user.badge }}</span>
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
    noLink: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    profileURL () {
      return `/players/${this.user.badge}/`
    },
  },
}
</script>
