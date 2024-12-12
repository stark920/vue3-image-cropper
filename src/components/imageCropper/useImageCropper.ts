import { computed, ref, toValue } from 'vue'
import type { Ref } from 'vue'
import type { MaybeRef } from 'vue'

export interface ImageCropperOptions {
  scale: {
    min: number
    max: number
  }
  cropper: {
    width: number
    height: number
  }
}

export function useImageCropper(
  container: Ref<HTMLDivElement | null>,
  imageBox: Ref<HTMLDivElement | null>,
  option: MaybeRef<ImageCropperOptions>,
) {
  // Background image transform styles
  const transform = ref({
    x: 0,
    y: 0,
    scale: 1,
  })
  const nowScale = computed(() => transform.value.scale)
  const transformStyle = computed(
    () =>
      `transform: translate(${transform.value.x}px, ${transform.value.y}px) scale(${transform.value.scale});`,
  )

  const zoomIn = (range = 0.1) => {
    const { max } = toValue(option).scale
    if (transform.value.scale >= max) return

    const adjustment = (transform.value.scale + range).toFixed(2)
    const result = parseFloat(adjustment)
    transform.value.scale = result > max ? max : result
  }

  const zoomOut = (range = 0.1) => {
    const { min } = toValue(option).scale
    if (transform.value.scale <= min) return

    const adjustment = (transform.value.scale - range).toFixed(2)
    const result = parseFloat(adjustment)
    transform.value.scale = result < min ? min : result
  }

  const setZoom = (ratio: number) => {
    const { min, max } = toValue(option).scale
    if (ratio < min || ratio > max) return
    transform.value.scale = ratio
  }

  const resetZoom = () => {
    transform.value.x = 0
    transform.value.y = 0
    transform.value.scale = 1
  }

  // Background image source
  const image = new Image()
  image.addEventListener('load', () => {
    if (!imageBox.value) return
    imageBox.value.style.width = `${image.width}px`
    imageBox.value.style.height = `${image.height}px`
    imageBox.value.style.backgroundImage = `url(${image.src})`
    resetZoom()
  })
  const loadBaseImage = (src: string) => {
    if (src.length === 0) return
    image.src = src
  }

  // Generate cropped image
  const getCroppedImageDataUrl = () => {
    const { width: cropperWidth, height: cropperHeight } = toValue(option).cropper
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = cropperWidth
    canvas.height = cropperHeight

    // source image size
    const sWidth = image.width
    const sHeight = image.height

    // destination image size
    const dWidth = sWidth * transform.value.scale
    const dHeight = sHeight * transform.value.scale

    // adjustment
    const sx =
      (transform.value.x - (container.value?.clientWidth ?? 0) / 2 + cropperWidth / 2) /
      transform.value.scale
    const sy =
      (transform.value.y - (container.value?.clientHeight ?? 0) / 2 + cropperHeight / 2) /
      transform.value.scale

    context?.drawImage(image, -sx, -sy, sWidth, sHeight, 0, 0, dWidth, dHeight)

    return canvas.toDataURL('image/png')
  }

  // Mouse event handlers
  const mouseState = ref({
    draggable: false,
    mouseX: 0,
    mouseY: 0,
  })

  const mousedown = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (e.target !== imageBox.value) return

    mouseState.value.draggable = true
    mouseState.value.mouseX = e.clientX
    mouseState.value.mouseY = e.clientY
  }

  const mousemove = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!mouseState.value.draggable) return

    transform.value.x += e.clientX - mouseState.value.mouseX
    transform.value.y += e.clientY - mouseState.value.mouseY
    mouseState.value.mouseX = e.clientX
    mouseState.value.mouseY = e.clientY
  }

  const mouseup = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    mouseState.value.draggable = false
  }

  const windowMouseUp = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    mouseState.value.draggable = false

    window.removeEventListener('mouseup', windowMouseUp)
    window.removeEventListener('mousemove', mousemove)
  }

  const mouseleave = () => {
    if (!mouseState.value.draggable) return

    window.addEventListener('mouseup', windowMouseUp)
    window.addEventListener('mousemove', mousemove)
  }

  const wheel = (e: WheelEvent) => {
    e.preventDefault()

    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  const cropperEvents = {
    mousedown,
    mousemove,
    mouseup,
    mouseleave,
    wheel,
  }

  return {
    transformStyle,
    cropperEvents,
    nowScale,
    loadBaseImage,
    getCroppedImageDataUrl,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
  }
}
