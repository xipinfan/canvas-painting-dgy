# Canvas

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
- `tool`的可选值有`pickup`，`pencil`，`eraser`，`line`，
  `round`，`rectangle`，`rightTriangle`，`isosceles`，`diamond`，`text`， `bucket`，默认为 `pencil`

### 画笔模式

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

### 橡皮擦模式

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

### 拾色器模式

- 当`tool`值为`pickup`时

:::demo 颜色请打开控制台查看

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD
      ref="canvas1"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="pickup"
      :width="300"
      :height="300"
      @click="watchColor"
    ></CanvasD>
    <CanvasD
      tool="pickup"
      ref="canvas2"
      border="1px solid rgba(60, 60, 67, 0.12)"
      :eraserSize="15"
      @click="watchColor1"
      :width="300"
      :height="300"
    ></CanvasD>
    {{ color }}
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
const canvas1 = ref();
const canvas2 = ref();
const color = ref<string>('');
const watchColor = function () {
  console.log(canvas1.value.pickup);
};
const watchColor1 = function () {
  console.log(canvas2.value.pickup);
};
onMounted(() => {
  // 用油漆桶涂满画布
  canvas1.value.bucket(0, 0, 20, '#f1f1f1');
  canvas2.value.bucket(0, 0, 20, 'red');
});
</script>
```

:::

### 油漆桶

- 当`tool`值为`bucket`时

:::demo 同时也可以使用画布外露的 bucket 函数来进行油漆桶操作，具体查看 api 即可

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="bucket"
      bucketColor="#f1f1f1"
      :width="300"
      :height="300"
    ></CanvasD>
    <CanvasD
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="bucket"
      bucketColor="#fff555"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

## 形状工具

- 本组件提供了大量的基础图形工具待使用，可以直接绘制各种预设好的形状
- 对应一些图形也添加了填充绘制和填充绘制两种方式,通过`shapeStatu`切换`fill`, `stroke`两种，默认为`stroke`

### 直线

- 当`tool`值为`line`时
- 直线绘制为按住一个点朝着下一个点拖动，到达之后松开即可，松开后可按住方位点拖动直线，点击空白后绘制成功

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="line" :width="300" :height="300"></CanvasD>
    <CanvasD
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="line"
      :penSize="10"
      strokeColor="red"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

### 圆形

- 当`tool`值为`round`时
- 与直线的操作相似

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="round" :width="300" :height="300"></CanvasD>
    <CanvasD
      strokeColor="red"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="round"
      shapeStatu="fill"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

### 矩形

- 当`tool`值为`rectangle`时
- 操作同上

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="rectangle" :width="300" :height="300"></CanvasD>
    <CanvasD
      strokeColor="red"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="rectangle"
      shapeStatu="fill"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

### 直角三角形

- 当`tool`值为`rightTriangle`时
- 操作同上

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="rightTriangle" :width="300" :height="300"></CanvasD>
    <CanvasD
      strokeColor="red"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="rightTriangle"
      shapeStatu="fill"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

### 等腰三角形

- 当`tool`值为`isosceles`时
- 操作同上

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="isosceles" :width="300" :height="300"></CanvasD>
    <CanvasD
      strokeColor="red"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="isosceles"
      shapeStatu="fill"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

### 菱形

- 当`tool`值为`diamond`时
- 操作同上

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="diamond" :width="300" :height="300"></CanvasD>
    <CanvasD
      strokeColor="red"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="diamond"
      shapeStatu="fill"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

## 文本工具

### 文本

- 当`tool`值为`text`时
- 点击一端拉向另一端之后松开，即可出现文本框，此时可以输入文字，在点击文本框外部时即完成文本编写
- 通过 `fontSize` 设置文字大小
- 通过 `fontFamily` 设置字体
- 通过 `fontWeight` 设置粗细

:::demo

```vue
<template>
  <div style="display:flex;justify-content:space-around;">
    <CanvasD border="1px solid rgba(60, 60, 67, 0.12)" tool="text" :width="300" :height="300"></CanvasD>
    <CanvasD
      strokeColor="red"
      border="1px solid rgba(60, 60, 67, 0.12)"
      tool="text"
      :fontSize="22"
      fontWeight="600"
      :width="300"
      :height="300"
    ></CanvasD>
  </div>
</template>
```

:::

## 保存图片

- 使用`save`函数保存当前图片，导出 base64 编码，默认格式为 png

:::demo 通过设置导入函数参数的不同来设置导出格式， 导出内容在控制台中可以看到

```vue
<template>
  <div>
    <CanvasD ref="canvas1" border="1px solid rgba(60, 60, 67, 0.12)" :width="600" :height="300"></CanvasD>
    <input type="button" style="witdh:150px;height:30px;margin-top:10px" value="保存图片" @click="clickButton" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const canvas1 = ref();
const clickButton = () => {
  console.log(canvas1.value.save('png'));
};
</script>
```

:::

## API

### Props

| 参数            | 说明           | 类型     | 默认值       |
| --------------- | -------------- | -------- | ------------ |
| width           | 画布宽度       | `number` | `400`        |
| height          | 画布长度       | `number` | `400`        |
| border          | 画布的边框     | `string` |              |
| tool            | 当前画布的工具 | `string` | `pencil`     |
| bgColor         | 背景颜色       | `string` |              |
| penSize         | 画笔大小       | `number` | `0`          |
| strokeColor     | 绘制图像的颜色 | `string` | `#000000`    |
| eraserSize      | 橡皮擦大小     | `number` | `6`          |
| fontSize        | 文本字体大小   | `number` | `16`         |
| fontFamily      | 文本字体样式   | `string` | `sans-serif` |
| fontWeight      | 文本粗细       | `string` | `400`        |
| shapeStatu      | 图案绘制样式   | `string` | `stroke`     |
| bucketColor     | 油漆桶颜色     | `string` | `white`      |
| bucketIntensity | 橡皮擦大小     | `number` | `20`         |

### Methods

| 参数   | 说明                           | 类型       | 默认值 |
| ------ | ------------------------------ | ---------- | ------ |
| pickup | 获取拾色器选择到的颜色         | `string`   |        |
| bucket | 在指定的位置进行油漆桶操作     | `function` |        |
| save   | 返回当前画布 base64 格式的图片 | `function` |        |

#### bucket

油漆桶操作

```js
canvas.value.bucket(0, 0, 20, '#f1f1f1');
```

### Events

| 参数  | 说明     | 类型       | 默认值 |
| ----- | -------- | ---------- | ------ |
| click | 点击事件 | `function` |        |
