<template>
  <div class="inline">
    <span>{{ user.username }}</span><span class="text-xs text-gray-darker">#{{ user.badge }}</span>
  </div>
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
}
</script>
