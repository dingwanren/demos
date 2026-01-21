<template>
  <div class="poker-container" ref="container">
    <div 
      v-for="(_, index) in 9" 
      :key="index" 
      @mouseenter="hoverCard(index)"
      @mouseleave="resetCard(index)"
      @mousedown="startDrag(index, $event)"
      :style="{
        transform: `rotate(${(index - 4) * 5}deg) translateY(${hoverIndex === index ? '-40px' : '0'})`,
        transformOrigin: '50% 550%',
        position: 'absolute',
        left: '50%',
        bottom: '100px',
        marginLeft: '-60px',
        transition: hoverIndex === index ? 'transform 0.2s ease' : 'none'
      }"
  >
      <div
        class="poker-card"
        ref="cardRef"
        :style="{
          borderColor: rainbowColors[index % 7],
          backgroundColor: lightRainbowColors[index % 7],
          zIndex: dragIndex === index ? 999 : 1
        }"
      ></div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hoverIndex = ref<number | null>(null)
const dragIndex = ref<number | null>(null)
const container = ref<HTMLElement | null>(null)
const startPos = ref({ x: 0, y: 0 })
const cardRef = ref<HTMLElement[]>([])

const rainbowColors = [
  '#FF0000', // 红
  '#FF7F00', // 橙
  '#FFFF00', // 黄
  '#00FF00', // 绿
  '#0000FF', // 蓝
  '#4B0082', // 靛
  '#8B00FF'  // 紫
]

const lightRainbowColors = [
  '#FFCCCB', // 浅红
  '#FFE5B4', // 浅橙
  '#FFFFE0', // 浅黄
  '#90EE90', // 浅绿
  '#ADD8E6', // 浅蓝
  '#E6E6FA', // 浅靛
  '#E6E6FA'  // 浅紫
]

const hoverCard = (index: number) => {
  if (dragIndex.value === null) {
    hoverIndex.value = index
  }
}

const resetCard = (index: number) => {
  console.log(index)
  if (dragIndex.value === null) {
    hoverIndex.value = null
  }
}

const startDrag = (index: number, e: MouseEvent) => {
  dragIndex.value = index
  startPos.value = { x: e.clientX, y: e.clientY }
  document.addEventListener('mousemove', dragCard)
  document.addEventListener('mouseup', stopDrag)
}

const dragCard = (e: MouseEvent) => {
  if (dragIndex.value !== null && container.value) {
    const dx = e.clientX - startPos.value.x
    const dy = e.clientY - startPos.value.y
    const card = cardRef.value[dragIndex.value] as HTMLElement
    card.style.transform = `rotate(${(dragIndex.value - 4) * -5}deg) translate(${dx}px, ${dy}px)`
    card.style.transition = 'none'
  }
}

const stopDrag = () => {
  if (dragIndex.value !== null && container.value) {
    const card = cardRef.value[dragIndex.value] as HTMLElement
    card.style.transform = 'none'
    card.style.transition = 'transform 0.2s ease'
    hoverIndex.value = null
    dragIndex.value = null
    document.removeEventListener('mousemove', dragCard)
    document.removeEventListener('mouseup', stopDrag)
  }
}
</script>

<style scoped>
.poker-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.poker-card {
  width: 120px;
  height: 180px;
  border: 3px solid;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
}
</style>