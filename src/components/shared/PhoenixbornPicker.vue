<template>
  <div class="flex flex-no-wrap">
    <select name="Phoenixborn" id="phoenixborn" @change="$emit('update:filter', $event.target.value)">
      <option value="">All phoenixborn</option>
      <option value="james-endersight">James Enderesight</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'PhoenixbornPicker',
  props: {
	},
  emits: ['update:filter'],
}
</script>
