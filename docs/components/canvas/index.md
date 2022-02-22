# Canvas 标签

## 基于 Canvas 的画板

### 基础使用

:::demo 设置 `width` 和 `height` 以及 `border` 的值控制画布的显示, 默认使用的工具为画笔工具

```vue
<template>
  <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" :width="1024" :height="300"></CanvasD>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
</script>
```

:::

## 切换模式

- 通过切换不同的`tool`值来切换当前画布的模式

#### 画笔模式

- 当`tool`值为`pencil`时

:::demo 默认模式下工具即为画笔，可以直接使用

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" :width="300" :height="300"></CanvasD>
    <CanvasD
      tool="pencil"
      border="1px solid rgba(60, 60, 67, 0.12)"
      strokeColor="red"
      :penSize="3"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

#### 橡皮擦模式

- 当`tool`值为`eraser`时

:::demo 橡皮擦模式下可以将绘制的图像擦去，变为背景颜色，如果没有背景颜色则为透明

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD ref="canvas1" border="1px solid rgba(60, 60, 67, 0.12)" tool="eraser" :width="300" :height="300"></CanvasD>
    <CanvasD
      tool="eraser"
      ref="canvas2"
      border="1px solid rgba(60, 60, 67, 0.12)"
      :eraserSize="15"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const canvas1 = ref();
const canvas2 = ref();
onMounted(() => {
  // 用油漆桶涂满画布
  canvas1.value.bucket(0, 0, 20, '#f1f1f1');
  canvas2.value.bucket(0, 0, 20, 'red');
});
</script>
```

:::

### 形状工具

- 本组件提供了大量的基础图形工具待使用，可以直接绘制各种预设好的形状
- 对应一些图形也添加了填充绘制和填充绘制两种方式

#### 直线

- 当`tool`值为`line`时
- 直线绘制为按住一个点朝着下一个点拖动，到达之后松开即可，松开后可按住方位点拖动直线，点击空白后绘制成功

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD ref="canvas1" border="1px solid rgba(60, 60, 67, 0.12)" tool="line" :width="300" :height="300"></CanvasD>
    <CanvasD ref="canvas2" border="1px solid rgba(60, 60, 67, 0.12)" tool="line" :width="300" :height="300"></CanvasD>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const canvas1 = ref();
const canvas2 = ref();
onMounted(() => {
  // 用油漆桶涂满画布
  // canvas1.value.bucket(0, 0, 20, '#f1f1f1');
  // canvas2.value.bucket(0, 0, 20, 'red');
});
</script>
```

:::

#### 直线

:::demo 橡皮擦模式下可以将绘制的图像擦去，变为背景颜色，如果没有背景颜色则为透明

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD ref="canvas1" border="1px solid rgba(60, 60, 67, 0.12)" tool="line" :width="300" :height="300"></CanvasD>
    <CanvasD ref="canvas2" border="1px solid rgba(60, 60, 67, 0.12)" tool="line" :width="300" :height="300"></CanvasD>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const canvas1 = ref();
const canvas2 = ref();
onMounted(() => {
  // 用油漆桶涂满画布
  // canvas1.value.bucket(0, 0, 20, '#f1f1f1');
  // canvas2.value.bucket(0, 0, 20, 'red');
});
</script>
```

:::
