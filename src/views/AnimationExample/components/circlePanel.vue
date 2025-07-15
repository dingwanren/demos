<template>
  <div class="config-panel">
    <div v-for="(circle, index) in localCircles" :key="index" class="circle-row">
      <input type="number" v-model.number="circle.centerX" @change="onChange" placeholder="X" class="short-input" />
      <input type="number" v-model.number="circle.centerY" @change="onChange" placeholder="Y" class="short-input" />
      <input type="number" v-model.number="circle.radius" @change="onChange" placeholder="半径" class="short-input" />
      <input type="number" v-model.number="circle.eyeCount" @change="onChange" placeholder="数量" class="short-input" />
      <button @click="removeCircle(index)">删除</button>
    </div>
    <button @click="addCircle">+ 新增圆</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 定义圆的类型
interface CircleConfig {
  centerX: number;
  centerY: number;
  radius: number;
  eyeCount: number;
}

// 接收 props
const props = defineProps<{
  circles: CircleConfig[];
}>();
// 定义 emit
const emit = defineEmits<{
  (e: 'update:circles', value: CircleConfig[]): void;
}>();

// 本地副本（深拷贝避免直接修改 prop）
const localCircles = ref<CircleConfig[]>(JSON.parse(JSON.stringify(props.circles)));

// 监听外部数据变化并同步到本地
watch(
  () => props.circles,
  (newVal) => {
    localCircles.value = JSON.parse(JSON.stringify(newVal));
  }
);

// 当输入值变化时触发更新
function onChange() {
  console.log('onchange')
  emit('update:circles', [...localCircles.value]);
}

// 新增圆配置
function addCircle() {
  localCircles.value.push({
    centerX: 0,
    centerY: 0,
    radius: 10,
    eyeCount: 1
  });
  onChange();
}

// 删除指定索引的圆
function removeCircle(index: number) {
  localCircles.value.splice(index, 1);
  onChange();
}
</script>



<style scoped>
.config-panel {
  position: absolute;
  right: 0;
  top: 0;
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 600px;
}

.circle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.short-input {
  width: 80px;
  padding: 4px;
  font-size: 14px;
}
</style>