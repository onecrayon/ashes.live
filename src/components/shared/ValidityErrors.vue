<template>
  <div>
    <strong>Invalid submission:</strong>
    <ul class="list-disc pl-4">
      <li v-for="(err, index) of errors" :key="index">
        <code class="font-mono font-bold">{{ err.loc }}</code>: {{ err.msg }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ValidityErrors',
  props: ['errors'],
}
</script>
