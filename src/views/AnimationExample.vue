<template>
  <div class="animation-example">
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
        v-for="(eye, eyeIndex) in eyes"
        :key="eyeIndex"
        class="eye-container"
        :ref="(el) => setEyeRef(el, circleIndex, eyeIndex)"
        :style="getEyeStyle(circleIndex, eyeIndex)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
import lottie, { type AnimationItem } from "lottie-web";
import eyeAnimation from "@/assets/eye.json";

// @ts-ignore
import LottieApi from "lottie-api";

interface CircleConfig {
  radius: number;
  eyeCount: number;
  centerX?: number;
  centerY?: number;
}

const circles = ref<CircleConfig[]>([
  { radius: 200, eyeCount: 12, centerX: 200, centerY: 200 },
  { radius: 150, eyeCount: 8, centerX: 400, centerY: 200 },
]);

const eyes = ref(Array(12).fill(0));
const eyeRefs = ref<(HTMLElement | null)[][]>([]);
const anims = ref<AnimationItem[][]>([]);

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

onMounted(() => {
  eyeRefs.value.forEach((circleEyes, circleIndex) => {
    if (!anims.value[circleIndex]) {
      anims.value[circleIndex] = [];
    }

    circleEyes.forEach((eyeContainer, eyeIndex) => {
      if (eyeContainer) {
        const anim = lottie.loadAnimation({
          container: eyeContainer,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: eyeAnimation,
        });
        const api = LottieApi.createAnimationApi(anim);

        anims.value[circleIndex][eyeIndex] = anim;
      }
    });
  });
});

// 提供外部访问方法
const setEyeSpeed = (circleIndex: number, eyeIndex: number, speed: number) => {
  if (anims.value[circleIndex]?.[eyeIndex]) {
    anims.value[circleIndex][eyeIndex].setSpeed(speed);
  }
};

const setCircleCenter = (circleIndex: number, x: number, y: number) => {
  if (circles.value[circleIndex]) {
    circles.value[circleIndex].centerX = x;
    circles.value[circleIndex].centerY = y;
  }
};

const setRotationSpeed = (circleIndex: number, speed: number) => {
  const container = eyeRefs.value[circleIndex]?.[0]?.parentElement;
  if (container) {
    container.style.setProperty("--rotation-speed", `${10 / speed}s`);
  }
};

defineExpose({
  setEyeSpeed,
  setCircleCenter,
  setRotationSpeed,
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
