# vue3-image-cropper

This repository is based on Vue 3, TypeScript, and Tailwind CSS, inspired by [shadcn-vue](https://www.shadcn-vue.com/) and [VueUse](https://vueuse.org/).

## Installation

To use this package, copy the files in the folder named [**ImageCropper**](https://github.com/stark920/vue3-image-cropper/tree/main/src/components/imageCropper) from this repository to the desired folder in your project. Only **ImageCropper.vue** and **useImageCropper.ts** are required.

The CSS styles for all components are written using Tailwind CSS. Please ensure that your project has Tailwind CSS (or UnoCSS) installed.

## Examples

The main component, **ImageCropper.vue**, exposes a **handleCrop** function to trigger the cropping behavior and return the cropped image as a dataURL (string).

This component does not have predefined dimensions. You must specify the width/height or aspect ratio based on the parent element.

**your-component.vue**

```js
import { ImageCropper } from '@/[your-folder]/imageCropper';

const imageCropper = ref<typeof ImageCropper>();
const handleCrop = () => imageCropper.value?.handleCrop();

const src: ShallowRef<string> = shallowRef('');
const result: ShallowRef<string> = shallowRef('');

const onCropped = (url: string) => (result.value = url);
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

## Component Exposed Function

| Function     | Type          | Description                        
| ------------ | ------------- | ---------------------------------- 
| handleCrop   | `() => void`  | Triggers the crop action.

## Props

| Prop                | Type                                              | Description              | Default
| ------------------- | ------------------------------------------------- | ------------------------ | ----------------------------
| src                 | `String`                                          | The image to be cropped. |
| stencil (optional)  | `{ width: number, height: number }`, `undefined`  | The stencil size.        | `{ width: 200, height: 200 }`
| scale (optional)    | `{ min: number, max: number }`, `undefined`       | The scaling limits.      | `{ min: 0.5, max: 2 }`

## Emits

| Event     | Description                                               | Value
| --------- | --------------------------------------------------------- | --------
| cropped   | Triggered when the image cropping is complete.            | string
| error     | Triggered when image loading or generation fails.         | Event

## Default template

The default template provides two slot props: **fn** (functions) and **state** (variables).

### fn
| Function  | Type                               | Description                         | Default
| --------- | ---------------------------------- | ----------------------------------- | ----------------------------
| zoomIn    | `(magnification: number) => void`  | Zooms in on the image.              | `0.05`
| zoomOut   | `(magnification: number) => void`  | Zooms out of the image.             | `0.05`
| setZoom   | `(scale: number) => void`          | Sets the zoom to a specific value.  | 

### state
| Variable  | Type      | Description                    
| --------- | --------- | -------------------------------
| nowScale  | `Number`  | The current scale value.            
| minScale  | `Number`  | The minimum scale value.
| maxScale  | `Number`  | The maximum scale value.

## Stencil template

You can customize this template by adding other components, such as drag-and-resizable elements to modify the stencil size. The component will align in the center.

## Extra Components

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
  <!-- Add zoom in/out buttons -->
  <ImageCropperZoomButton @zoom-in="fn.zoomIn" @zoom-out="fn.zoomOut" />

  <!-- Add a custom element -->
  <small
    class="absolute right-2 bottom-2 text-foreground bg-background/50 rounded-md px-1"
  >
    {{ state.nowScale }}x
  </small>

  <!-- Add a zoom slider -->
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

## License 

This project is licensed under the MIT License.