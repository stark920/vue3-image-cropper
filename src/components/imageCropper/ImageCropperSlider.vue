<script setup lang="ts">
interface Props {
  value: number
  variant?: 'horizontal' | 'vertical'
  step?: number
  min: number
  max: number
}

withDefaults(defineProps<Props>(), {
  step: 0.1,
  variant: 'horizontal',
})

const emit = defineEmits<{
  change: [ratio: number]
}>()

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('change', parseFloat(target.value))
}
</script>

<template>
  <input
    :value
    :min
    :max
    :step
    type="range"
    :class="
      variant === 'vertical'
        ? 'rotate-[270deg] top-1/2 -translate-y-1/2'
        : 'left-1/2 -translate-x-1/2'
    "
    class="absolute z-10"
    @change="onChange"
  />
</template>
