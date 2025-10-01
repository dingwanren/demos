<template>
  <div class="page-mouseAnime" ref="pageContainer" @click="handleClick">
    <h1>鼠标动画</h1>
    <p>这是一个由 CLI 工具自动生成的 Vue 3 + TypeScript + setup 示例页面</p>
    <!-- 页面内容 -->

    <div class="dot" ref="dotRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 引用页面容器元素
const pageContainer = ref<HTMLDivElement | null>(null);
// 引用dot元素
const dotRef = ref<HTMLDivElement | null>(null);

function handleClick(e: MouseEvent) {
  console.log(`鼠标点击位置坐标 - X: ${e.x}, Y: ${e.y}`);
  moveDotToIntersection(e.x, e.y);
  getContainerCorners();
}

// 计算交点并移动dot
function moveDotToIntersection(clickX: number, clickY: number) {
  if (!pageContainer.value || !dotRef.value) return;

  const rect = pageContainer.value.getBoundingClientRect();
  const containerTop = rect.top;

  // 计算与竖直方向向右成30度角的直线与容器上边缘的交点
  // 直线斜率: 与竖直方向成30度，即与水平方向成60度，tan(60°) = √3
  const slope = Math.tan(Math.PI / 3); // 60度的正切值
  
  // 计算交点X坐标
  // 直线方程: y - clickY = slope * (x - clickX)
  // 当y = containerTop时，解方程得x
  const intersectionX = clickX + (containerTop - clickY) / slope;
  const intersectionY = containerTop;

  // 确保交点在容器范围内
  const intersection = {
    x: Math.max(rect.left, Math.min(rect.right, intersectionX)),
    y: intersectionY
  };

  console.log('交点坐标:', intersection);

  // 移动dot到交点位置
  dotRef.value.style.left = `${intersection.x - rect.left}px`;
  dotRef.value.style.top = `${intersection.y - rect.top}px`;
}

// 获取容器四个端点坐标
function getContainerCorners() {
  if (!pageContainer.value) return;

  const rect = pageContainer.value.getBoundingClientRect();
  const corners = {
    topLeft: { x: rect.left, y: rect.top },
    topRight: { x: rect.right, y: rect.top },
    bottomLeft: { x: rect.left, y: rect.bottom },
    bottomRight: { x: rect.right, y: rect.bottom }
  };

  console.log('容器四个端点坐标:', corners);
  return corners;
}

// 组件挂载后获取一次坐标
onMounted(() => {
  getContainerCorners();
})
</script>

<style scoped>
.page-mouseAnime {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
