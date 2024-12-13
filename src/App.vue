<script setup lang="ts">
import { ref, shallowRef, type ShallowRef } from 'vue'
import SampleImage from '@/assets/sample.jpg'
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
const stencilWidth = ref<number>(200)
const stencilHeight = ref<number>(200)
const src: ShallowRef<string> = shallowRef(SampleImage)
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

    src.value = e.target.result
    uploadForm.value?.reset()
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="h-screen bg-background">
    <div class="container grid items-center gap-8 max-w-xl py-6">
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
          <NumberField v-model="stencilWidth">
            <Label>Crop Width</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <NumberField v-model="stencilHeight">
            <Label>Crop Height</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <ImageCropper
          v-slot="{ fn, state }"
          :src
          :stencil="{
            width: stencilWidth,
            height: stencilHeight,
          }"
          class="aspect-[4/3] lg:aspect-video"
          ref="imageCropper"
          @cropped="onCropped"
          @error="
            (e) => {
              console.log(e)
            }
          "
        >
          <ImageCropperZoomButton @zoom-in="fn.zoomIn" @zoom-out="fn.zoomOut" />
          <small class="absolute right-2 bottom-2 text-foreground bg-background/50 rounded-md px-1">
            {{ state.nowScale }}x
          </small>
          <ImageCropperSlider
            class="bottom-2 w-3/5"
            :value="state.nowScale"
            :min="state.minScale"
            :max="state.maxScale"
            :step="0.05"
            @change="fn.setZoom"
          />
        </ImageCropper>
        <Button :disabled="src === ''" variant="outline" @click="handleCrop">Crop It</Button>
      </div>

      <div>
        <Label>3. Result</Label>
        <img v-if="result !== ''" :src="result" class="mx-auto" alt="cropped result" />
      </div>
    </div>
  </div>
</template>
