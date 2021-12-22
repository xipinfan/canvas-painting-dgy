# Canvas 标签

## 基于 Canvas 的画板

:::demo 通过设置初始值来快捷控制 `canvas`

```vue
<template>
  <CanvasD :width="width" :height="ss.height"></CanvasD>
</template>
<script setup ts>
import { ref, reactive } from 'vue';

const width = ref(500);
const ss = reactive({
  height: 300,
});
</script>
```

:::
