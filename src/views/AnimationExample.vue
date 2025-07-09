<template>
  <div class="animation-example">
    <div class="eyes-container">
      <div
        v-for="i in 12"
        :key="i"
        :ref="el => { if (el && 'offsetHeight' in el) lottieContainers[i-1] = el as HTMLElement }"
        class="eye-container"
        :style="getEyePosition(i)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
import lottie from "lottie-web";
import eyeAnimation from "@/assets/eye.json";

const lottieContainers = ref<HTMLElement[]>([]);
const anims = ref<any[]>([]);

const radius = 200; // 圆形半径
const center = { x: 200, y: 200 };
const eyesCount = 12;
const getEyePosition = (index: number) => {
  const angle = (index / eyesCount) * Math.PI * 2;
  return {
    left: `${center.x + radius * Math.cos(angle)}px`,
    top: `${center.y + radius * Math.sin(angle)}px`,
    transform: `rotate(${(index / eyesCount) * 360 + 90}deg)`,
  };
};
class Eye {
  animation: any;
  container: HTMLElement | null;
  constructor(animation: any, container: HTMLElement) {
    this.container = container;
    this.animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation,
    });
  }
}

class CircleContainer {
  lottieContainers: Ref<HTMLElement[]>;
  radius: number;
  center: { x: number; y: number };
  count: number;
  eyes: Eye[] = [];

  constructor(
    lottieContainers: Ref<HTMLElement[]>,
    radius: number,
    center: { x: number; y: number },
    count: number
  ) {
    this.lottieContainers = lottieContainers;
    this.radius = radius;
    this.center = center;
    this.count = count;
    this.initEyes();
  }

  initEyes() {
    this.eyes = this.lottieContainers.value.map((container) => {
      return new Eye(eyeAnimation, container);
    });
  }
}

const circlesConfig = [
  {
    lottieContainers,
    radius: 200,
    center: { x: 200, y: 200 },
    count: 12,
  },
  {
    lottieContainers,
    radius: 300,
    center: { x: 300, y: 250 },
    count: 18,
  },
  {
    lottieContainers,
    radius: 400,
    center: { x: 350, y: 300 },
    count: 24,
  },
];
const circles = circlesConfig.map(config => new CircleContainer(config.lottieContainers, config.radius, config.center, config.count))

onMounted(() => {
  lottieContainers.value.forEach((container, index) => {
    if (container) {
      const anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: eyeAnimation,
      });

      anims.value.push(anim);
    }
  });
});
</script>

<style scoped>
.animation-example {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.eyes-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: 230px 230px /*center center*/;
  animation: rotate 10s linear infinite;
  will-change: transform;
}

.eye-container {
  position: absolute;
  width: 60px;
  height: 60px;
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
