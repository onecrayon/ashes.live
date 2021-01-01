<template>
  <div class="inline">
    <span>{{ user.username }}</span><span class="user-badge text-xs">#{{ user.badge }}</span>
  </div>
</template>

<script>
export default {
  name: 'UserBadge',
  props: {
    user: {
      username: '',
      badge: '',
    },
  },
}
</script>
<style scoped>
.user-badge {
  color: var(--color-gray-dark);
}
</style>