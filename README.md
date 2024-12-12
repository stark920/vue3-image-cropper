# vue3-image-cropper

This repository is based on Vue3 (Composition API) + TypeScript + Tailwind.css, inspired by [shadcn-vue](https://www.shadcn-vue.com/) and [VueUse](https://vueuse.org/).

## Installation

Just copy files from the directory which named as [**ImageCropper**](https://github.com/stark920/vue3-image-cropper/tree/main/src/components/imageCropper) inside this repository.

All components css class name are using tailwind.css, make sure your project has install this package(or UnoCSS).

## Examples

### Basic Usage

**your-component.vue**

```javascript
// scripts part
import { ImageCropper } from '@/components/[where-your-store-components]/imageCropper'

const imageCropper = ref<typeof ImageCropper>()
const picSource: ShallowRef<string> = shallowRef('')
const result: ShallowRef<string> = shallowRef('')
const handleCrop = () => imageCropper.value?.handleCrop()
const onCropped = (url: string) => (result.value = url)

// template part, given the section size by yourself
<ImageCropper
  :base-image="picSource"
  class="aspect-video"
  ref="imageCropper"
  @cropped="onCropped"
/>
<button @click="handleCrop">Crop It</button>
```

---

License MIT