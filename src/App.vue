<script setup lang="ts">
import { ref, shallowRef, type ShallowRef } from 'vue'
import { useColorMode } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { ImageCropper, ImageCropperSlider, ImageCropperZoomButton } from '@/components/imageCropper'

// Trigger dark/light mode
useColorMode()

// Image Cropper
const imageCropper = ref<typeof ImageCropper>()
const cropWidth = ref<number>(200)
const cropHeight = ref<number>(200)
const picSource: ShallowRef<string> = shallowRef('')
const result: ShallowRef<string> = shallowRef('')
const handleCrop = () => imageCropper.value?.handleCrop()
const onCropped = (url: string) => (result.value = url)

// Image Upload
const uploadForm = ref<HTMLFormElement>()
const onFileUploaded = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target || !target.files) return

  // Load image
  const file = target.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    if (!e.target || typeof e.target.result !== 'string') return

    picSource.value = e.target.result
    uploadForm.value?.reset()
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="h-screen bg-background">
    <div class="container grid items-center gap-8 max-w-xl pt-6">
      <form ref="uploadForm">
        <Label for="picture">1. Upload Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          class="bg-slate-500 cursor-pointer hover:bg-slate-400 duration-300"
          @change="onFileUploaded"
        />
      </form>

      <div class="grid gap-2">
        <Label>2. Preview + Cropper</Label>
        <div class="grid gap-4 w-max my-4">
          <NumberField v-model="cropWidth">
            <Label>Crop Width</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <NumberField v-model="cropHeight">
            <Label>Crop Height</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
        <ImageCropper
          :base-image="picSource"
          :crop-width
          :crop-height
          class="aspect-video"
          ref="imageCropper"
          @cropped="onCropped"
        >
          <template #default="{ fn, state }">
            <ImageCropperZoomButton @zoom-in="fn.zoomIn" @zoom-out="fn.zoomOut" />
            <small
              class="absolute right-2 bottom-2 text-foreground bg-background/50 rounded-md px-1"
            >
              {{ state.nowScale }}x
            </small>
            <ImageCropperSlider
              class="bottom-2"
              :value="state.nowScale"
              :min="state.minScale"
              :max="state.maxScale"
              @change="fn.setZoom"
            />
          </template>
        </ImageCropper>
        <Button :disabled="picSource === ''" variant="outline" @click="handleCrop">Crop It</Button>
      </div>

      <div>
        <Label>3. Result</Label>
        <img v-if="result !== ''" :src="result" alt="cropped result" />
      </div>
    </div>
  </div>
</template>
