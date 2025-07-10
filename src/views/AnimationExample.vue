<template>
  <div class="animation-example">
    <div 
      v-for="(circle, circleIndex) in circles" 
      :key="circleIndex"
      class="circle-container"
    >
      <div 
        v-for="(eye, eyeIndex) in eyes" 
        :key="eyeIndex"
        class="eye-container"
        :ref="el => setEyeRef(el, circleIndex, eyeIndex)"
        :style="getEyeStyle(circleIndex, eyeIndex)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import lottie, { type AnimationItem } from 'lottie-web'
import eyeAnimation from '@/assets/eye.json'

interface CircleConfig {
  radius: number
  eyeCount: number
}

const circles = ref<CircleConfig[]>([
  { radius: 200, eyeCount: 12 },
  { radius: 150, eyeCount: 8 }
])

const eyes = ref(Array(12).fill(0))
const eyeRefs = ref<(HTMLElement | null)[][]>([])
const anims = ref<AnimationItem[][]>([])

const setEyeRef = (el: HTMLElement | null, circleIndex: number, eyeIndex: number) => {
  if (!eyeRefs.value[circleIndex]) {
    eyeRefs.value[circleIndex] = []
  }
  eyeRefs.value[circleIndex][eyeIndex] = el
}

const getEyeStyle = (circleIndex: number, eyeIndex: number) => {
  const circle = circles.value[circleIndex]
  const angle = (eyeIndex / circle.eyeCount) * Math.PI * 2
  return {
    left: `${circle.radius * Math.cos(angle)}px`,
    top: `${circle.radius * Math.sin(angle)}px`,
    transform: `rotate(${(eyeIndex / circle.eyeCount) * 360 + 90}deg)`
  }
}

onMounted(() => {
  eyeRefs.value.forEach((circleEyes, circleIndex) => {
    if (!anims.value[circleIndex]) {
      anims.value[circleIndex] = []
    }
    
    circleEyes.forEach((eyeContainer, eyeIndex) => {
      if (eyeContainer) {
        const anim = lottie.loadAnimation({
          container: eyeContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: eyeAnimation
        })
        anims.value[circleIndex][eyeIndex] = anim
      }
    })
  })
})

// 提供外部访问方法
const setEyeSpeed = (circleIndex: number, eyeIndex: number, speed: number) => {
  if (anims.value[circleIndex]?.[eyeIndex]) {
    anims.value[circleIndex][eyeIndex].setSpeed(speed)
  }
}

defineExpose({
  setEyeSpeed
})
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

.circle-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px auto;
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
