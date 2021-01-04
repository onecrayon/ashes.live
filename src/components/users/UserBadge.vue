<template>
  <div class="inline">
    <span>{{ user.username }}</span><span class="user-badge text-xs text-gray-darker">#{{ user.badge }}</span>
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