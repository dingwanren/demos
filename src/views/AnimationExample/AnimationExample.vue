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
      }"
    >
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
import { ref, onMounted, watch, type Ref } from "vue";
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
}

const circles = ref<CircleConfig[]>([
  { radius: 200, eyeCount: 12, centerX: 200, centerY: 200 },
  { radius: 150, eyeCount: 8, centerX: 400, centerY: 200 },
]);

const eyeRefs = ref<(HTMLElement | null)[][]>([]);
const animMap = new WeakMap();

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
  animation-duration: var(--rotation-speed, 10s);
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
