import { computed, ref, shallowRef, toValue } from 'vue'
import type { Ref, MaybeRef } from 'vue'

export interface ImageCropperOptions {
  stencil: {
    width: number
    height: number
  }
  scale: {
    min: number
    max: number
  }
}

export function useImageCropper(
  imageBox: Ref<HTMLDivElement | null>,
  option: MaybeRef<ImageCropperOptions>,
  errorHandler?: (e: Event) => void,
) {
  // Background image source
  const image = new Image()
  const imageWidth = shallowRef<number>(0)
  const imageHeight = shallowRef<number>(0)

  image.addEventListener('load', () => {
    resetZoom()
    imageWidth.value = image.width
    imageHeight.value = image.height
    if (imageBox.value?.firstChild) return
    imageBox.value?.appendChild(image)
  })
  image.addEventListener('error', (e) => {
    if (errorHandler) errorHandler(e)
  })

  const loadSrc = (src: string) => {
    if (src.length === 0) return
    image.src = src
  }

  // Background image transform styles
  const transform = ref({
    x: 0,
    y: 0,
    scale: 1,
  })
  const nowScale = computed(() => transform.value.scale)

  const transformStyle = computed(() => {
    const { x, y, scale } = transform.value
    return {
      top: `calc(50% - ${imageHeight.value / 2}px)`,
      left: `calc(50% - ${imageWidth.value / 2}px)`,
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    }
  })

  const zoomIn = (magnification = 0.05) => {
    const { max } = toValue(option).scale
    if (transform.value.scale >= max) return

    const adjustment = (transform.value.scale * (1 + magnification)).toFixed(2)
    const result = parseFloat(adjustment)
    transform.value.scale = result > max ? max : result
  }

  const zoomOut = (magnification = 0.05) => {
    const { min } = toValue(option).scale
    if (transform.value.scale <= min) return

    const adjustment = (transform.value.scale * (1 - magnification)).toFixed(2)
    const result = parseFloat(adjustment)
    transform.value.scale = result < min ? min : result
  }

  const setZoom = (scale: number) => {
    const { min, max } = toValue(option).scale
    if (scale < min || scale > max) return
    transform.value.scale = scale
  }

  const resetZoom = () => {
    transform.value.x = 0
    transform.value.y = 0
    transform.value.scale = 1
  }

  // Generate cropped image
  const getCroppedImageDataUrl = (): string | null => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return null

    const { width: cropperWidth, height: cropperHeight } = toValue(option).stencil
    const { x, y, scale } = transform.value

    canvas.width = cropperWidth
    canvas.height = cropperHeight

    const offsetX = (imageWidth.value * scale) / 2 - cropperWidth / 2
    const offsetY = (imageHeight.value * scale) / 2 - cropperHeight / 2
    const sx = (offsetX - x) / scale
    const sy = (offsetY - y) / scale

    const dWidth = imageWidth.value * scale
    const dHeight = imageHeight.value * scale
    context.drawImage(image, sx, sy, imageWidth.value, imageHeight.value, 0, 0, dWidth, dHeight)

    return canvas.toDataURL('image/png')
  }

  // Mouse event handlers
  const mouseState = ref({
    draggable: false,
    mouseX: 0,
    mouseY: 0,
  })

  const mousedown = (e: MouseEvent) => {
    e.preventDefault()
    mouseState.value.draggable = true
    mouseState.value.mouseX = e.clientX
    mouseState.value.mouseY = e.clientY
  }

  const mousemove = (e: MouseEvent) => {
    e.preventDefault()
    if (!mouseState.value.draggable) return
    transform.value.x += e.clientX - mouseState.value.mouseX
    transform.value.y += e.clientY - mouseState.value.mouseY
    mouseState.value.mouseX = e.clientX
    mouseState.value.mouseY = e.clientY
  }

  const mouseup = (e: MouseEvent) => {
    e.preventDefault()
    mouseState.value.draggable = false
  }

  const windowMouseUp = (e: MouseEvent) => {
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

  const contextmenu = () => {
    mouseState.value.draggable = false
  }

  // Touch event handlers
  const touchstart = (e: TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    mouseState.value.draggable = true
    mouseState.value.mouseX = touch.clientX
    mouseState.value.mouseY = touch.clientY
  }

  const touchmove = (e: TouchEvent) => {
    e.preventDefault()
    if (!mouseState.value.draggable) return
    const touch = e.touches[0]
    transform.value.x += touch.clientX - mouseState.value.mouseX
    transform.value.y += touch.clientY - mouseState.value.mouseY
    mouseState.value.mouseX = touch.clientX
    mouseState.value.mouseY = touch.clientY
  }

  const touchend = (e: TouchEvent) => {
    e.preventDefault()
    mouseState.value.draggable = false
  }

  const touchcancel = (e: TouchEvent) => {
    e.preventDefault()
    mouseState.value.draggable = false
  }

  const cropperEvents = {
    mousedown,
    mousemove,
    mouseup,
    mouseleave,
    wheel,
    contextmenu,
    touchstart,
    touchmove,
    touchend,
    touchcancel,
  }

  return {
    transformStyle,
    cropperEvents,
    nowScale,
    loadSrc,
    getCroppedImageDataUrl,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
  }
}
