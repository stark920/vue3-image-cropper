<script setup lang="ts">
defineEmits(['zoomIn', 'zoomOut'])
</script>

<template>
  <div class="z-10 absolute top-2 right-2 grid gap-y-2">
    <button
      type="button"
      class="rounded-full size-7 text-lg flex items-center justify-center bg-background hover:bg-accent duration-300"
      @click.stop="$emit('zoomIn')"
    >
      +
    </button>
    <button
      type="button"
      class="rounded-full size-7 text-lg flex items-center justify-center bg-background hover:bg-accent duration-300"
      @click.stop="$emit('zoomOut')"
    >
      -
    </button>
  </div>
</template>
