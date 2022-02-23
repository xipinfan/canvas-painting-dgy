# Esign 手写签字 电子签名

## 基础使用

- 提供 `vue3` 版本适配手机端的签名画布

:::demo

```vue
<template>
  <div id="sign1">
    <vue-esign ref="sign" :width="500" :height="300" :lineWidth="6" lineColor="red" :isCrop="true"></vue-esign>
  </div>
  <div id="control">
    <button @click="reset">清空画布</button>
    <button @click="generate" style="margin-left:10px">保存图片</button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const sign = ref(null);
const reset = () => {
  sign.value.reset();
};
const generate = () => {
  sign.value
    .generate()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      alert(err);
    });
};
</script>
<style>
#sign1 {
  height: 301px;
  width: 501px;
  border: 1px solid black;
}
#control {
  margin-top: 15px;
}
</style>
```

:::

## API

### Props

| 参数      | 说明     | 类型      | 默认值    |
| --------- | -------- | --------- | --------- |
| width     | 画布宽度 | `numbere` | `800`     |
| height    | 画布高度 | `numbere` | `300`     |
| lineWidth | 画笔大小 | `numbere` | `4`       |
| lineColor | 画笔颜色 | `string`  | `#000000` |
| bgColor   | 背景颜色 | `string`  | ``        |
| isCrop    | 是否裁切 | `boolean` | `false`   |

### Methods

#### reset

清空画布

```js
sign.reset();
```

#### generate

保存图片(base64 格式)

```js
sign
  .generate()
  .then((res) => {})
  .catch((err) => {});
```
