<template>
  <div class="flex flex-no-wrap">
    <input class="appearance-none border-2 border-gray-darker border-r-0 rounded-l-md h-full px-2 flex-auto"
      type="text" placeholder="Filter by name or text..."
    ><button class="btn btn-last h-full px-4 text-l flex-none" title="Clear Search"><i class="fas fa-times"></i></button>
  </div>
</template>

<script>
export default {
  name: 'TextFilter',
}
</script>
