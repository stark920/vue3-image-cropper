<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue'
import { useImageCropper } from './useImageCropper'

interface Props {
  baseImage: string
  cropWidth?: number
  cropHeight?: number
  minScale?: number
  maxScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  cropWidth: 200,
  cropHeight: 200,
  minScale: 0.5,
  maxScale: 2,
})

const emits = defineEmits<{
  cropped: [imgDataUrl: string]
}>()

const container = ref<HTMLDivElement | null>(null)
const imageBox = ref<HTMLDivElement | null>(null)

const cropperOptions = computed(() => ({
  scale: {
    min: props.minScale,
    max: props.maxScale,
  },
  cropper: {
    width: props.cropWidth,
    height: props.cropHeight,
  },
}))

const {
  transformStyle,
  cropperEvents,
  nowScale,
  loadBaseImage,
  getCroppedImageDataUrl,
  setZoom,
  zoomIn,
  zoomOut,
} = useImageCropper(container, imageBox, cropperOptions)

const handleCrop = () => {
  const croppedImage = getCroppedImageDataUrl()
  emits('cropped', croppedImage)
}

watch(
  () => props.baseImage,
  (newImg) => loadBaseImage(newImg),
)

onMounted(() => loadBaseImage(props.baseImage))

defineExpose({ handleCrop })
</script>

<template>
  <div
    class="relative bg-accent overflow-hidden"
    :class="!baseImage.length && 'pointer-events-none'"
    ref="container"
  >
    <div
      class="bg-no-repeat cursor-move origin-top-left"
      :style="transformStyle"
      v-on="cropperEvents"
      ref="imageBox"
    ></div>

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_2000px_rgba(0,0,0,0.3)] bg-transparent pointer-events-none"
      :style="`width: ${cropWidth}px; height: ${cropHeight}px`"
    ></div>

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_2000px_rgba(0,0,0,0.3)] bg-transparent pointer-events-none"
      :style="`width: ${cropWidth}px; height: ${cropHeight}px`"
    ></div>

    <div v-if="$slots.cropper" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <slot name="cropper" />
    </div>

    <slot :fn="{ setZoom, zoomIn, zoomOut }" :state="{ nowScale, minScale, maxScale }" />
  </div>
</template>
