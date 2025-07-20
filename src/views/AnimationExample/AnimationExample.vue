<template>
  <div class="animation-example">
    <circle-panel v-model:circles="circles"></circle-panel>
    <div
      v-for="(circle, circleIndex) in circles"
      :key="circleIndex"
      class="circle-container"
      :style="{
        width: circle.radius * 2 + 60 + 'px',
        height: circle.radius * 2 + 60 + 'px',
        top: circle.centerY + 'px',
        left: circle.centerX + 'px',
        '--rotation-speed': circle.rotationSpeed + 's',
        'animation-direction': circle.rotationDirection === 'clockwise' ? 'normal' : 'reverse'
      }"
    >
      <!-- 半径会影响盒子大小,从而影响left,top偏移,从而影响圆心位置,所以半径不同,虽圆心xy位置一样,页面显示出来也是不同位置的 -->
      <!-- 圆心调试点 -->
      <div class="center-point"></div>
      <div
        v-for="(eye, eyeIndex) in circle.eyeCount"
        :key="eyeIndex"
        class="eye-container"
        :ref="(el) => setEyeRef(el, circleIndex, eyeIndex)"
        :style="getEyeStyle(circleIndex, eyeIndex)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, type Ref } from "vue";
import lottie, { type AnimationItem } from "lottie-web";
import eyeAnimation from "@/assets/eye.json";
import circlePanel from "./components/circlePanel.vue";

// @ts-ignore
import LottieApi from "lottie-api";

interface CircleConfig {
  radius: number;
  eyeCount: number;
  centerX: number;
  centerY: number;
  rotationSpeed: number;      // 新增：旋转时长（秒）
  rotationDirection: 'clockwise' | 'counter-clockwise';  // 新增：方向
}

const circles = ref<CircleConfig[]>([
  { radius: 200, eyeCount: 12, centerX: 200, centerY: 200, rotationSpeed: 20, rotationDirection: 'clockwise' },
  { radius: 150, eyeCount: 8, centerX: 400, centerY: 200, rotationSpeed: 20, rotationDirection: 'clockwise' },
]);

const eyeRefs = ref<(HTMLElement | null)[][]>([]);

// 因为 Map 对键是强引用，如果你保存了 DOM 元素，而这些 DOM 元素又被移除出页面，但你没有手动从 Map 中删除它们，就可能导致内存泄漏
// const animMap = new WeakMap();
const animMap = new Map();

watch(
  eyeRefs,
  (newEyeRefs) => {
    newEyeRefs.forEach((circleEyes) => {
      circleEyes.forEach((eyeContainer) => {
        if (eyeContainer && !animMap.has(eyeContainer)) {
          const anim = lottie.loadAnimation({
            container: eyeContainer,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            animationData: eyeAnimation,
          });

          animMap.set(eyeContainer, anim);
        }
      });
    });
  },
  { deep: true }
);
const setEyeRef = (
  el: HTMLElement | null,
  circleIndex: number,
  eyeIndex: number
) => {
  if (!eyeRefs.value[circleIndex]) {
    eyeRefs.value[circleIndex] = [];
  }
  eyeRefs.value[circleIndex][eyeIndex] = el;
};

const getEyeStyle = (circleIndex: number, eyeIndex: number) => {
  const circle = circles.value[circleIndex];
  const angle = (eyeIndex / circle.eyeCount) * Math.PI * 2;
  return {
    left: `${circle.radius * (1 + Math.cos(angle))}px`,
    top: `${circle.radius * (1 + Math.sin(angle))}px`,
    transform: `rotate(${(eyeIndex / circle.eyeCount) * 360 + 90}deg)`,
  };
};

onBeforeUnmount(() => {
  animMap.forEach((anim, container) => {
    anim.destroy();  // 销毁 Lottie 动画
  });
});
</script>

<style scoped>
.animation-example {
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.circle-container {
  position: absolute;
  transform-origin: center;
  animation: rotate linear infinite;
  animation-duration: var(--rotation-speed, 20s);
  animation-direction: var(--rotation-direction, normal); /* 可以是 normal / reverse */
}

.center-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none; /* 避免干扰点击事件 */
}

.eye-container {
  position: absolute;
  width: 60px;
  height: 60px;
  transform-origin: center;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
