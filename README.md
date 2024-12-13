# vue3-image-cropper

This repository is based on Vue3 + TypeScript + Tailwind.css, inspired by [shadcn-vue](https://www.shadcn-vue.com/) and [VueUse](https://vueuse.org/).

## Installation

Just copy the files in the folder named [**ImageCropper**](https://github.com/stark920/vue3-image-cropper/tree/main/src/components/imageCropper) in this project to the folder where you want to store it (Only **ImageCropper.vue** and **useImageCropper.ts** are required).

The css styles of all components are written using tailwind. Please make sure your project has tailwind installed(or UnoCSS).

## Examples

The main component **ImageCropper.vue** exposes a **handleCrop** function to trigger crop behavior and return the cropped image dataUrl(string).

This component doesn't define the size as default. You have to add width/height or aspect-ratio (depends on parent element).

**your-component.vue**

```js
import { ImageCropper } from '@/[your-folder]/imageCropper'
const imageCropper = ref<typeof ImageCropper>()
const src: ShallowRef<string> = shallowRef('')
const result: ShallowRef<string> = shallowRef('')
const handleCrop = () => imageCropper.value?.handleCrop()
const onCropped = (url: string) => (result.value = url)
```

```html
<ImageCropper
  :src
  class="aspect-video"
  ref="imageCropper"
  @cropped="onCropped"
/>
<button @click="handleCrop">Crop It</button>
```

## Component Expose Function

| Function     | Type          | Description                        
| ------------ | ------------- | ---------------------------------- 
| handleCrop   | `() => void`    | Trigger crop image action

## Props

| Prop                | Type                                              | Description             | Default
| ------------------- | ------------------------------------------------- | ----------------------- | ----------------------------
| src                 | `String`                                          | The cropping image      |
| stencil (optional)  | `{ width: number, height: number }`, `undefined`  | The stencil size        | `{ width: 200, height: 200 }`
| scale (optional)    | `{ min: number, max: number }`, `undefined`       | The scaling limitation  | `{ min: 0.5, max: 2 }`

## Emits

| Event     | Description                               | Value
| --------- | ----------------------------------------- | --------
| cropped   | Invoked on the crop image is done         | string

## Default template

The default template has 2 slot props, **fn** provide Functions, **state** provide variables.

### fn
| Prop      | Type                               | Description                   | Default
| --------- | ---------------------------------- | ----------------------------- | ----------------------------
| zoomIn    | `(magnification: number) => void`  | Zoom in                       | `0.05`
| zoomOut   | `(magnification: number) => void`  | Zoom out                      | `0.05`
| setZoom   | `(scale: number) => void`          | Set scale to specific number  | 

### state
| Prop      | Type      | Description                    
| --------- | --------- | -------------------------------
| nowScale  | `Number`  | Current scale value             
| minScale  | `Number`  | Min scale value    
| maxScale  | `Number`  | Max scale value

## Stencil template

You can add other component by this template (ex: Drag and resizable element to change stencil size), the component will align in the center.

### Extra Components

```js
import {
  ImageCropper,
  ImageCropperSlider,
  ImageCropperZoomButton
} from '@/[your-folder]/imageCropper'
```

```html
<ImageCropper
  v-slot="{ fn, state }"
  ...
>
  <!-- add zoom In/Out buttons -->
  <ImageCropperZoomButton @zoom-in="fn.zoomIn" @zoom-out="fn.zoomOut" />

  <!-- add custom element -->
  <small
    class="absolute right-2 bottom-2 text-foreground bg-background/50 rounded-md px-1"
  >
    {{ state.nowScale }}x
  </small>

  <!-- add zoom slider -->
  <ImageCropperSlider
    class="bottom-2"
    :value="state.nowScale"
    :min="state.minScale"
    :max="state.maxScale"
    @change="fn.setZoom"
  />
</ImageCropper>
```

---

License MIT