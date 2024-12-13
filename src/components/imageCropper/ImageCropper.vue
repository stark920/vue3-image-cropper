<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue'
import { useImageCropper } from './useImageCropper'

interface Props {
  src: string
  stencil?: {
    width: number
    height: number
  }
  scale?: {
    min: number
    max: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  stencil: () => ({
    width: 200,
    height: 200,
  }),
  scale: () => ({
    min: 0.5,
    max: 2,
  }),
})

const emits = defineEmits<{
  cropped: [imgDataUrl: string]
}>()

const imageBox = ref<HTMLDivElement | null>(null)
const options = computed(() => {
  const { stencil, scale } = props
  return { stencil, scale }
})
const {
  transformStyle,
  cropperEvents,
  nowScale,
  loadSrc,
  getCroppedImageDataUrl,
  setZoom,
  zoomIn,
  zoomOut,
} = useImageCropper(imageBox, options)

const handleCrop = () => {
  const croppedImage = getCroppedImageDataUrl()
  emits('cropped', croppedImage)
}

watch(
  () => props.src,
  (newImg) => loadSrc(newImg),
)

onMounted(() => loadSrc(props.src))

defineExpose({ handleCrop })
</script>

<template>
  <div
    class="relative bg-accent overflow-hidden"
    :class="!src.length && 'pointer-events-none'"
  >
    <div v-on="cropperEvents" class="size-full cursor-move"></div>
    <div
      class="absolute pointer-events-none select-none origin-center size-max"
      :style="transformStyle"
      ref="imageBox"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_2000px_rgba(0,0,0,0.3)] bg-transparent pointer-events-none"
      :style="`width: ${stencil.width}px; height: ${stencil.height}px`"
    ></div>

    <div v-if="$slots.stencil" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <slot name="stencil" />
    </div>

    <slot
      :fn="{ setZoom, zoomIn, zoomOut }"
      :state="{ nowScale, minScale: scale.min, maxScale: scale.max }"
    />
  </div>
</template>
