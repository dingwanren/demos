<template>
  <div class="config-panel">
    <div v-for="(circle, index) in localCircles" :key="index" class="circle-row">
      <input type="number" v-model.number="circle.centerX" @change="onChange" placeholder="X" class="short-input" />
      <input type="number" v-model.number="circle.centerY" @change="onChange" placeholder="Y" class="short-input" />
      <input type="number" v-model.number="circle.radius" @change="onChange" placeholder="半径" class="short-input" />
      <input type="number" v-model.number="circle.eyeCount" @change="onChange" placeholder="数量" class="short-input" />
      <!-- 新增字段 -->
      <input type="number" v-model.number="circle.rotationSpeed" @change="onChange" placeholder="时长(s)" class="short-input" />
      <select v-model="circle.rotationDirection" @change="onChange" class="short-input">
        <option value="clockwise">顺时针</option>
        <option value="counter-clockwise">逆时针</option>
      </select>
      <button @click="removeCircle(index)">x</button>
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
  rotationSpeed: number;      // 新增：旋转时长（秒）
  rotationDirection: 'clockwise' | 'counter-clockwise';  // 新增：方向
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
    centerX: 200,
    centerY: 200,
    radius: 200,
    eyeCount: 12,
    rotationSpeed: 30,
    rotationDirection: 'clockwise'
  });
  onChange();
}

// 删除指定索引的圆
// 目前删除的时候, lottie动画还是会存在,没被销毁
function removeCircle(index: number) {
  localCircles.value.splice(index, 1);
  onChange();
}
</script>



<style scoped>
.config-panel {
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 600px;
  overflow: auto;
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