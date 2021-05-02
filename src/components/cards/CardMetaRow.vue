<template>
  <tr>
    <th class="align-top text-left pb-1 pr-2 text-gray">{{ label }}</th>
    <td class="pb-1"><slot></slot></td>
  </tr>
</template>

<script>
export default {
  name: 'CardMetaRow',
  props: ['label'],
}
</script>
